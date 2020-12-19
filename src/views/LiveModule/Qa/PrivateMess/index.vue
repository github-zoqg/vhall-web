<template>
  <div class="private-wrap clearFix">
    <ul class="list-name fl">
      <li v-for="(ite, index) in userList" :key="index" :class="{'active-name': acrivePrivate == index}" @click="selectUser(ite, index)">
        <span class="ellsips">
          {{ite.nickname ||  '' }}
        </span>
        <span @click.stop="closeUser(ite,index)">X</span>
      </li>
    </ul>
    <div class="list-content fr">
      <p class="private-head">
        <span>{{activeName || userList[0]&&userList[0].nickname || ''}}</span>
        <span class="close" @click="$emit('close')">﹀</span>
      </p>
      <ul class="private-content">
        <li class="private-content-li" v-for="(item, index) in chatList" :key="index">
          <p>我： <span>{{filterTime(item.created_at)}}</span></p>
          <p v-html="item.data && item.data.text_content"></p>
        </li>
      </ul>
      <div class="private-footer">
        <el-input type="textarea" :rows="2" placeholder="说点什么吧..." v-model="privateValue"> </el-input>
        <p>
          <i class="iconfont iconbiaoqing" @click.stop="toggleEmoji"></i>
          <el-button class="send-right" type="primary" @click="privateSend">发送</el-button>
        </p>
      </div>
      <!-- 表情选择 -->
      <div class="emoji-wrapper">
        <small-emoji ref="emoji" @emojiInput="emojiInput"></small-emoji>
      </div>
    </div>
  </div>
</template>
<script>
import smallEmoji from '@/tangram/libs/chat/emoji.vue';
import {  textToEmoji } from '@/tangram/libs/chat/js/emoji';
import Msg from '@/tangram/libs/chat/js/msg-class';
import { formatTime, handleTime } from '@/tangram/libs/chat/js/handle-time';
export default {
  components: {
    smallEmoji
  },
  props:['userInfo', 'onlyChatMess','priteChatList', 'webinar_id'],
  data() {
    return {
      acrivePrivate: 0, // 当前私聊对象
      activeName: '',
      privateValue: '', // 私聊内容
      userList: this.priteChatList, // 私聊列表
      chatList: [], //获取到
    }
  },
  watch:{
    onlyChatMess: {
      handler(newValue, oldValue){
        if(newValue.type){
          console.warn(newValue, 7777777);
          this.$nextTick(()=>{
            let isFlag = this.userList.some((ele, index) =>{
              this.acrivePrivate = index
              return ele.user_id == newValue.item.account_id
            })
            if(!isFlag){
              if(newValue.item){
                newValue.user_id = newValue.item.account_id
              }
              this.userList.push(newValue)
              this.acrivePrivate = this.userList.length - 1
            }
            this.activeName = newValue.nickname
            this.getDefaultContent(newValue.item.account_id)
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed:{
    filterTime(){
      return function(time){
        return this.$moment(time).format('hh:mm:ss')
      }
    }
  },
  methods: {
    getDefaultContent(toAccountID){
      let _data = {
        room_id: this.userInfo.interact.room_id,
        start_time: '',
        pos: 0,
        limit: 100,
        // to_user: '16422715',
        to_user: toAccountID,
        webinar_id: this.webinar_id
      }
      this.chatList = []
      this.$fetch('v3GetPrivCon', _data).then(res=>{
        console.warn(res);
        if(res.code == 200){
          this.chatList = res.data.list
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    closeUser(user, index){
      this.userList.splice(index, 1)
      this.chatList = []
      this.activeName=''
    },
    // 切换表情显示
    toggleEmoji () {
      this.$refs.emoji.toggleShow();
    },
    // 子组件输入表情
    emojiInput (value) {
      this.privateValue += value;
    },
    selectUser(user, index){
      // 设置当前私聊title名字
      this.activeName = user.nickname
      this.acrivePrivate = index
      console.warn(this.userList[index]);
      this.getDefaultContent(this.userList[index].user_id)
    },
    roleClassFilter (value) {
      return value == '1' ? 'host' : value == '3' ? 'assistant' : 'guest';
    },
    emojiToText (content) {
      return textToEmoji(content).map(c => {
        return c.msgType == 'text'
          ? c.msgCont
          : `<img width="24" src="${c.msgImage}" border="0" />`;
      }).join(' ');
    },
    privateSend(){
      if (!this.privateValue.trim()) {
        return this.$message.error('内容不能为空');
      }
      let data = {
        avatar: this.userInfo.join_info.avatar,
        // target_id: '16422715',
        target_id: this.userList[this.acrivePrivate].user_id,
        type:'text',
        barrageTxt: this.privateValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>'),
        text_content: this.privateValue
      };
      // 为保持一致   故传了多个不同key  同value
      let context = {
        // to: '16422715',
        to: this.userList[this.acrivePrivate].user_id,
        nickname: this.userInfo.join_info.nickname, // 昵称
        nick_name: this.userInfo.join_info.nickname,
        user_name:  this.userInfo.join_info.nickname,
        role_name: this.roleClassFilter(this.userInfo.join_info.role_name), // 角色 1主持人2观众3助理4嘉宾
        user_role: this.roleClassFilter(this.userInfo.join_info.role_name),
        user_id: this.userInfo.join_info.third_party_user_id,
        // user_id: '16421384',
        app: 'vhall'
      };
      this.$nextTick(()=>{
        this.$emit('sendMsg', data,context)
        if(!window.sessionStorage.getItem('localJoinList')){
          window.sessionStorage.setItem('localJoinList', JSON.stringify(this.userList[this.acrivePrivate].id))
          this.$fetch('v3SetUser', {room_id: this.userInfo.interact.room_id, webinar_id: this.webinar_id, to: this.userList[this.acrivePrivate].id})
        }else{
          let _arr = window.sessionStorage.getItem('localJoinList')
           if(_arr.indexOf(this.userList[this.acrivePrivate].id) == -1){
            window.sessionStorage.setItem('localJoinList', `${_arr},${this.userList[this.acrivePrivate].id}`)
          }
        }
        let _data = {
          created_at: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
          data:{
            text_content: this.emojiToText(this.privateValue)
          }
        }
        this.chatList.push(_data)
        this.privateValue = ''
      })
    }
  },
}
</script>
<style lang="less" scoped>
.private-wrap{
  position: absolute;
  width: 720px;
  height: 400px;
  border: 1px solid;
  right: 0;
  bottom: 0px;
  background-color: #f1f1f1;
  border: 1px solid #c1c1c1;
  .list-name{
    width: 140px;
    height: 100%;
    display: inline-block;
    border-right: 1px solid #c1c1c1;
    li{
      height: 40px;
      line-height: 40px;
      position: relative;
      color: #666;
      font-size: 15px;
      text-align: left;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
      &:hover{
        span:nth-child(2){
          display: inline-block
        }
      }
      span{
        width: 100px;
        display: inline-block;
        &:nth-child(2){
          width: 20px;
          float: right;
          display: none;

        }
      }
    }
    .active-name{
      color: #fff;
      background-color: #5095ff;
    }
  }
  .list-content{
    display: inline-block;
    width: calc(100% - 140px);
    position: relative;
    height: 100%;
    .private-head{
      width: 100%;
      height: 40px;
      color: #fff;
      background-color: #5095ff;
      font-size: 14px;
      line-height: 39px;
      text-align: center;
      .close{
          position: absolute;
          right: 10px;
          line-height: 39px;
          color: #fff;
          font-weight: normal;
          font-size: 24px;
          top: 3px;
      }
    }
    .private-content{
      height: calc(100% - 140px);
      overflow-y: auto;
      &-li{
        font-size: 14px;
        color: #949393;
        border-bottom: 1px solid #fff;
        p{
          padding-left: 10px;
          line-height: 24px;
          &:nth-child(2){
            color: #333;
          }
          span{
            color: #bcbcbc;
            font-size: 12px;
            margin-left: 5px;
          }
        }
      }
    }
    .private-footer{
      height: 100px;
      .el-textarea{
        height: 60px;
        overflow: hidden;
      }
      p{
        height: 30px;
        margin-top: 5px;
        float: right;
        line-height: 30px;
        .send-right{
          height: 100%;
          line-height: 30px;
          padding: 0 14px;
          margin-left: 10px;
        }
      }

    }
    .emoji-wrapper {
      width: 294px;
      position: absolute;
      bottom: 100px;
      left: 0;
    }
  }
}
</style>
