<template>
  <div class="private-wrap clearFix">
    <ul class="list-name fl">
      <li v-for="(item, index) in userList" :key="index" class="ellsips" :class="{'active-name': acrivePrivate == index}" @click="selectUser(item)">
        {{item.name}}
      </li>
    </ul>
    <div class="list-content fr">
      <p class="private-head">
        <span>{{activeName || userList[0].name || ''}}</span>
      </p>
      <p class="private-content"></p>
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
import { faceArr, textToEmoji, emojiToPath } from '@/tangram/libs/chat/js/emoji';
import Msg from '@/tangram/libs/chat/js/msg-class';
import { formatTime, handleTime } from '@/tangram/libs/chat/js/handle-time';
export default {
  components: {
    smallEmoji
  },
  props:['userInfo', 'onlyChatMess'],
  data() {
    return {
      acrivePrivate: 0, // 当前私聊对象
      activeName: '',
      privateValue: '', // 私聊内容
      userList:[
        {
          name: 'test'
        }
      ]
    }
  },
  watch:{

  },
  methods: {
    // 切换表情显示
    toggleEmoji () {
      console.warn('点击的表情展示----', this.$refs, this.$refs.emoji);
      this.$refs.emoji.toggleShow();
    },
    // 子组件输入表情
    emojiInput (value) {
      this.privateValue += value;
    },
    selectUser(user){
      // 设置当前私聊title名字
      this.activeName = user.name
    },
    privateSend(){
      console.warn('私聊发送图片和表情', this.privateValue);
      if (!this.privateValue.trim()) {
        return this.$message.error('内容不能为空');
      }
      let data = {
        type:'text',
        barrageTxt: this.privateValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>'),
        text_content: textToEmojiText(this.privateValue),
      };
      let context = {
        nickname: this.userInfo.join_info.nickname, // 昵称
        avatar: this.userInfo.avatar, // 头像
        role_name: this.userInfo.role_name, // 角色 1主持人2观众3助理4嘉宾
        join_id: this.userInfo.join_id
      };
      console.log('获取私聊  准备发送的消息----', context);
      let tempData = new Msg({
        avatar: getAvatar(context.avatar),
        nickName: context.nickname,
        type: 'text',
        content: data,
        sendId: context.join_id,
        sendTime: formatTime(new Date()),
        roleName: context.role_name,
        client: 'pc',
        showTime: handleTime(item.sendTime),
        replyMsg: this.replyMsg
      });

    }
  },
}
</script>
<style lang="less" scoped>
.private-wrap{
  position: absolute;
  width: 700px;
  height: 400px;
  border: 1px solid;
  right: 0;
  bottom: 0px;
  background-color: #f1f1f1;
  border: 1px solid #c1c1c1;
  .list-name{
    width: 120px;
    height: 100%;
    display: inline-block;
    border-right: 1px solid #c1c1c1;
    li{
      height: 40px;
      line-height: 40px;
      color: #666;
      font-size: 15px;
      text-align: left;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
    }
    .active-name{
      color: #fff;
      background-color: #5095ff;
    }
  }
  .list-content{
    display: inline-block;
    width: calc(100% - 120px);
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
    }
    .private-content{
      height: calc(100% - 140px);
      overflow-y: auto;
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
