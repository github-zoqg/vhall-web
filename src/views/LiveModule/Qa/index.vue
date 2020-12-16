<template>
  <div class="new-qa">
    <OldHeader class="head-wrap"></OldHeader>
    <div class="qa-wrap">
        <h3 class="title">{{baseObj.webinar && baseObj.webinar.subject}}</h3>
        <p class="host">主播：{{ baseObj.webinar && baseObj.webinar.userinfo && baseObj.webinar.userinfo.nickname}}</p>
        <div class="tab-box">
          <ul>
            <li @click="select(index)" :class="['tab-li', {'tab-li-active' : index == active}]"  v-for="(item, index) in List" :key="index">
              {{item.text}}
              <span class="count">({{item.count}})</span>
              <span class="border"></span>
            </li>
            <li v-if="active == 2" class="reply-text">
              <el-checkbox @change='setReply' v-model="openReply">公开</el-checkbox>
              <el-checkbox @change='setReply' v-model="privacyReply">私密</el-checkbox>
            </li>
          </ul>
          <div class="tab-content">
            <!-- 待处理 -->
            <ul :class="['await-deal', {'showPagination': activeObj.count > 20}]" v-show="active == 0">
              <li v-for="(item, index) in awaitList" :key="index" class="clearFix">
               <div class="fl">
                 <p class="await-name">
                  <span>{{item.nick_name}}</span>
                  <span>{{item.created_at}}</span>
                 </p>
                 <p class="await-content" v-html="item.content"></p>
               </div>
               <div class="fr">
                  <el-button @click="reply('text', item, index)" size="small" class="setBut">文字回复</el-button>
                  <el-button @click="reply('audio', item, index)" size="small" class="setBut">标记为语音回复</el-button>
                  <el-dropdown @command="reply" size="small" class="setBut">
                    <el-button size="small"  class="el-dropdown-link">更多</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command='{type: "private",item:item, index}'>私聊</el-dropdown-item>
                        <el-dropdown-item :command='{type: "no", item:item, index}'>不处理</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
               </div>
              </li>
            </ul>
            <!-- 语音回复 -->
            <ul class="await-deal text-deal" v-show="active == 1">
              <li v-for="(item, index) in audioList" :key="index" class="clearFix">
               <div class="fl">
                 <p class="await-name">
                  <span>{{item.nick_name}}</span>
                  <span>{{item.created_at}}</span>
                  <span style="color:#169bd5">{{baseObj.join_info.nickname}} <span class="mark">标记为语音回复</span>  {{filterTime(item.updated_at)}}</span>
                 </p>
                 <p class="await-content">{{item.content}}</p>
               </div>
               <div class="fr">
                  <el-button @click="reply({type: 'private'}, item, index)" size="small" class="setBut">私聊</el-button>
                  <el-button @click="reply('text', item, index)" size="small" class="setBut">文字回复</el-button>
               </div>
              </li>
            </ul>
            <!-- 文字回复 -->
            <ul class="await-deal text-deal" v-show="active == 2">
              <li v-for="(item, index) in textDealList" :key="index" class="clearFix">
               <div class="fl">
                 <p class="await-name">
                  <span>{{item.nick_name}}</span>
                  <span>{{item.created_at}}</span>
                 </p>
                 <p class="await-content">{{item.content}}</p>
               </div>
               <div class="fr">
                  <el-button @click="reply({type: 'private'}, item, index)" size="small" class="setBut">私聊</el-button>
                  <el-button @click="reply('text', item, index)" size="small" class="setBut">文字回复</el-button>
               </div>
                <ul class="answer">
                  <li class="await-name" v-for="(ite, ind) in item.answer" :key="ind">
                    <span class="triangle"></span>
                    <p class="">
                      <span class="answer-time">{{ite.nick_name}}</span> <span  class="answer-time">{{filterTime(ite.updated_at)}}</span>
                      <span  class="answer-open" v-if="ite.is_open == 1">公开</span> <span v-if="ite.is_backout==1">已撤销</span> <span v-if="ite.is_backout==0" @click="revoke(ite, ind, index)" class="answer-time answer-revoke">撤销此条回复</span>
                    </p>
                    <p>{{ite.content}}</p>
                  </li>
                </ul>
              </li>
            </ul>
            <!-- 不处理 -->
            <ul class="no-deal await-deal" v-show="active == 3">
              <li v-for="(item, index) in noDealList" :key="index" class="clearFix">
                <div class="fl">
                 <p class="await-name">
                  <span>{{item.nick_name}}</span>
                  <span>{{item.created_at}}</span>
                 </p>
                 <p class="await-content">{{item.content}}</p>
               </div>
               <div class="fr">
                    <span>操作时间：{{filterTime(item.updated_at)}}</span>
                    <span class="ellsips">操作人：{{baseObj.join_info && baseObj.join_info.nickname}}</span>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <SPagination :total="activeObj.count" v-show="activeObj.count > 20" :currentPage="searchParams.page" :page-size="searchParams.page_size"
                @current-change="currentChangeHandler" align="center"></SPagination>
            </div>
            <div class="messChat">
              <el-button v-show="!privateFlag" @click="messClick" size='small' type="success">私聊</el-button>
              <template v-if="privateFlag">
                <Private :userInfo='baseObj' :webinar_id='webinar_id' :onlyChatMess='onlyChatMess' :priteChatList='priteChatList' @close='privateClose' @sendMsg='privateSendMsg'></Private>
              </template>
            </div>
          </div>
        </div>
    </div>
    <VhallDialog
        title="文字回复"
        custom-class='text-reply'
        :visible.sync="textDalog"
        :close-on-click-modal="false"
        width="50%">
        <div id="send-content">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="5"
            placeholder="请输入内容"
            v-model="sendMessage.text"
            show-word-limit>
          </el-input>
        </div>
        <div slot="footer">
          <p class="send-left">
            <el-radio v-model="sendMessage.Radio" label="1">公开</el-radio>
            <el-radio v-model="sendMessage.Radio" label="0">私密</el-radio>
          </p>
          <el-button class="send-right" type="primary" @click="textReply">确定</el-button>
        </div>
      </VhallDialog>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
import Private from './PrivateMess/index';
import { faceArr, textToEmoji, emojiToPath, textToEmojiText } from '@/tangram/libs/chat/js/emoji';
import SPagination from '@/components/Spagination/main'
export default {
  components: {
    OldHeader,
    Private,
    SPagination
  },
  computed:{
    filterTime(){
      return function(time){
        return this.$moment(time).format('hh:mm')
      }
    }
  },
  data() {
    return {
      List:[
        {text:'待处理', count: 0},
        {text:'语音回复', count: 0},
        {text:'文字回复', count: 0},
        {text:'不处理', count: 0}
      ],
      active: 0, // 当前正在展示的Dom
      activeObj: {}, // 当前正在展示的信息
      baseObj: {},
      awaitList: [], // 待处理
      textDealList: [], // 文字回复
      audioList: [], // 语音回复
      noDealList: [], // 不处理
      $Chat: null, // 聊天句柄
      privateFlag: false,
      textDalog: false, // 是否显示输入框
      // 当前展示 提交信息集合
      sendMessage: {
        text: '',
        Radio: '1' // 信息类型
      },
      openReply: true, // 文字回复之公开
      privacyReply: true, // 文字回复之隐私
      searchParams: {
        page_size: 20,
        page: 0
      },
      onlyChatMess:{}, // 当前私聊对象
      priteChatList: [], // 私聊列表
      webinar_id: null
    }
  },
  async created() {
   await this.getUserInfo()
   this.getChat(0)  // 待处理
   this.getChat(1)  // 不处理
   this.getChat(2)  // 语音回复
   this.setReply()  // 文字回复
   this.initChat()
   this.getPrivateList() // 获取私聊列表
  },
  watch:{
    'awaitList.length' (newval){
      this.$nextTick(()=>{

      })
    }
  },
  mounted() {
    this.webinar_id = this.$router.currentRoute.params.id
    this.$EventBus.$on('question_answer_create', e => {
      console.warn('我是问答管理页面-----', e);
      // 发起端收到消息
      e.content = this.emojiToText(e.content);
      this.awaitList.push(e)
      this.$nextTick(()=>{
        this.List[0].count = this.awaitList.length
      })
    });
  },
  methods: {
    getUserInfo(){
      return new Promise((resolve, reject) =>{
        console.warn('this.$router.params', this.$router.currentRoute.params.id);
        this.$fetch('initiatorInfo', { webinar_id:  this.$router.currentRoute.params.id }).then(res => {
          if(res.code == 200){
            this.baseObj = res.data
            resolve()
          }else{
            this.$message.warning(res.msg)
          }
        }).catch(err=>{
          reject()
        })
      })
    },
    select(index){
      this.active = index
      this.activeObj = Object.assign(this.activeObj,{active: index, count: this.List[index].count})
      // 0 未处理 1 不处理 2 语音回复 3 文字回复
      switch (index) {
        case 0:
          this.getChat(0)
          break;
        case 1:
          this.getChat(2)
          break;
        case 2:
          // 获取文字回复
          this.setReply()
          break;
        case 3:
          this.getChat(1)
          break;
      }
    },
    currentChangeHandler(val){
      console.warn('页码的点击效果----', val);
      if(this.active == 2) {
        this.setReply(val-1)
      } else {
        this.getChat( this.active, val-1)
      }
    },
    getChat(val, pagePos){
      this.$fetch('getAutherQa', {
        room_id: this.baseObj.interact.room_id,
        type: val,
        limit: 20 ,
        pos: pagePos ? pagePos : 0
      }).then(res=>{
        if(res.code == 200){
          try {
            console.warn(res.data.list);
            res.data.list.forEach(item=>{
              if (item.content) {
                item.content = textToEmojiText(item.content);
              }
            })
          } catch (error) {
            console.warn(error, '聊天消息过滤错误');
          }
          switch (val) {
            case 0:
            this.awaitList = res.data.list
            this.List[0].count = res.data.total
            this.activeObj = Object.assign(this.activeObj,{active: 0, count: res.data.total})
              break;
          case 1:
            this.noDealList = res.data.list
            this.List[3].count = res.data.total
            break;
          case 2:
            this.audioList = res.data.list
            this.List[1].count = res.data.total
            break;
          }
        }else{
          this.$message.warning(res.msg)
        }
      }).catch(err=>{
      })
    },
    setReply(pagePos){
      // 文本回复  --- 设置回复 / 获取回复
      let openType = 0
      if(this.openReply && this.privacyReply){
        openType = 2
      }else if(this.openReply){
        openType = 1
      }else{
        openType = 0
      }
      let data = {
        room_id: this.baseObj.interact.room_id,
        is_open: openType, // 0 私密 1 公开 2 全部
        pos: pagePos? pagePos : 0 ,
        limit: 20
      }
      this.$fetch('v3GetTextReply', data).then(res=>{
        if(res.code == 200){
          this.textDealList = res.data.list
          this.List[2].count = res.data.total
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    reply(val, item, index){
      if(typeof val == 'object'){
        if(val.type == 'private'){
          // 合并 当前数据
          this.onlyChatMess = {}
          console.warn(val , '点击的是私聊');
          let privateMess = Object.assign(val, {activeDom: this.active, Subscript: index})
          if(this.active != 0){
            privateMess.item = item
          }else{
            privateMess.Subscript = val.index
          }
          privateMess.nickname = privateMess.item.nick_name
          console.warn('--------点击的是私聊---------------',privateMess );
          if(!this.privateFlag){
            this.privateFlag = true
          }

          this.onlyChatMess = privateMess
        }else{
          console.warn('不处理----开始执行');
          let data = {
            question_id: val.item.id,
            room_id: this.baseObj.interact.room_id,
            type: 1,
            is_open: 1
          }
          this.$fetch('v3ReplayUserQu', data).then(res=>{
            if(res.code == 200){
              this.$nextTick(()=>{
                this.List[0].count--
                if(this.List[0].count <=0) this.List[0].count = 0
                this.List[3].count++
                this.awaitList.splice(val.index, 1)
              })
            }else{
              this.$message.warning(res.msg)
            }
          })
        }
      }else{
        if(val == 'text'){
          this.sendMessage.text = ''
          this.sendMessage.Radio = '1'
          this.sendMessage = Object.assign(this.sendMessage, item, {activeDom: this.active, index: index})
          this.textDalog = true
        }else if(val == 'audio'){
          // 设置为语音回复
          let data = {
            question_id: item.id,
            room_id: this.baseObj.interact.room_id,
            type: 2,
            is_open: 1
          }
          this.$fetch('v3ReplayUserQu', data).then(res=>{
            if(res.code == 200){
              this.$nextTick(()=>{
                this.List[0].count--
                this.awaitList.splice(val.index, 1)
                this.List[1].count++
              })
            }
          })
        }
      }
    },
    messClick(){
      console.warn('点击的升级');
      this.privateFlag = true
    },
    privateClose(){
      this.privateFlag = false
    },
    privateSendMsg(data,msg){
      console.warn('发送私聊消息, 走到消息通道', msg);
      this.$Chat.emit(data,msg)
    },
    revoke(val, index, fatherIndex){
      // 撤销回复
      console.warn('撤销回复', this.textDealList[fatherIndex].answer[index]);
      this.$fetch('v3Revoke', {answer_id: val.id, room_id: this.baseObj.interact.room_id}).then(res=>{
        if(res.code == 200){
          console.warn(res, '撤销成功');
          this.$nextTick(() => {
            this.textDealList[fatherIndex].answer[index].is_backout = 1
          })
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 初始化
    initChat(){
      let option = {
        appId: this.baseObj.interact.paas_app_id, // appId 必须
        accountId: this.baseObj.join_info.third_party_user_id, // 第三方用户ID
        channelId: this.baseObj.interact.channel_id, // 频道id 必须
        token: this.baseObj.interact.paas_access_token, // 必须， token，初始化接口获取
      }
      window.VhallChat.createInstance(option, (event) => {
        this.$Chat = event.message; // 聊天实例句柄
        let disable = event.disable; // 个人是否被禁言，bool值
        let disable_all = event.disable_all; // 是否频道被禁言，bool值
        this.monitor()
      },err=>{
        console.error(err);
      })
    },
    emojiToText (content) {
      return textToEmoji(content).map(c => {
        return c.msgType == 'text'
          ? c.msgCont
          : `<img width="24" src="${c.msgImage}" border="0" />`;
      }).join(' ');
    },
    // 监听
    monitor(){
      this.$Chat.onRoomMsg(msg => {
        console.warn('坚挺到消息的派发----0-', msg);
        if (typeof msg !== 'object') {
          msg = JSON.parse(msg);
        }
        try {
          if (msg.data && typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }
        Object.assign(msg, msg.data);
        // console.warn('坚挺到消息的派发----1-', msg);
         this.$EventBus.$emit(msg.type, msg);
      })
    },
    textReply(){
      let data = {
        question_id: this.sendMessage.id,
        content: this.sendMessage.text,
        is_open: Number(this.sendMessage.Radio),
        type: 3,
        room_id: this.baseObj.interact.room_id
      }
      console.warn('点击的文字回复----准备到最终', data, this.sendMessage,);
      this.$fetch('v3ReplayUserQu', data).then(res=>{
        if(res.code == 200){
            this.textDalog = false
            if(this.sendMessage.activeDom == 0){
              // 点击的是待处理的 Dom
              this.awaitList.splice(this.sendMessage.index, 1)
            }else if(this.sendMessage.activeDom == 1){
              // 点击的是语音回复 Dom
              this.audioList.splice(this.sendMessage.index, 1)
            }else{
              // 点击的是文字回复 Dom
              this.textDealList.splice(this.sendMessage.index, 1)
            }
            this.List[2].count++
            this.List[this.sendMessage.activeDom].count--
            if(this.List[this.sendMessage.activeDom].count<=0){
              this.List[this.sendMessage.activeDom].count = 0
            }
        }
      })
    },
    getPrivateList(){
      this.$fetch('v3GetPrivateList', {room_id: this.baseObj.interact.room_id, webinar_id: this.$router.currentRoute.params.id }).then(res=>{
        console.warn(res);
        if(res.code == 200){
          console.warn('开始准备', res);
          this.priteChatList = res.data.list
        }else{
          this.$message.warning(res.msg)
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
.new-qa{
  background: #f8f8f8;
  &::-webkit-scrollbar{
    width: 5px;
  }
  ::v-deep.head-wrap{
    .collapse{
      height: 100%;
      .login-reg{
        height: 100%;
        .head{
          margin-top: -8px;
          border: none;
          vertical-align: middle;
          display: inline-block;
        }
        .caret{
          margin-bottom: 4px;
        }
      }
    }
  }
  .qa-wrap{
    width: 1300px;
    margin: 0 auto;
    .title{
      margin-top: 50px;
      font-size: 24px;
    }
    .host{
      margin: 30px 0 20px;
      font-size: 18px;
    }
    .tab-box{
      border: 1px solid #bbb;
      height: 700px;
      ul{
          height: 44px;
          line-height: 44px;
          border-bottom: 1px solid #ddd;
        .tab-li{
          display: inline-block;
          min-width: 120px;
          text-align: center;
          background: #bbb;
          margin-right: 3px;
          position: relative;
          .count{
            color: #f64a43;
          }
          .border{
            display: none;
            border: 2px solid red;
            background: red;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          &-active{
            color: #f64a43;
            .border{
              display: inline-block;
            }
          }
        }
        .reply-text{
          width: 140px;
          height: calc(100% - 2px);
          float: right;
          display: inline-block;
          .el-checkbox{
            margin-right: 0;
            &:nth-child(1){
              margin-right: 15px;
            }
          }
        }
      }
      .tab-content{
        height: calc(100% - 44px);
        position: relative;
        ul{
          height: 100%;
          overflow-y: auto;
        }
        .await-deal{
          &::-webkit-scrollbar{
            width: 5px;
          }
          font-size: 14px;
          li{
            border-bottom: 1px solid #c2c2c2;
            padding: 10px 20px;
          }
          .fl{
            width: calc(100% - 330px);
            line-height: 25px;
            .await-name{
              color: #888;
              font-size: 12px;
              span{
                margin-right: 15px;
              }
              .mark{
                margin: 0 10px;
              }
            }
            .await-content{
              font-size: 12px;
            }
          }
          .fr{
            float: right;
            width: 330px;
            margin-top: 6px;
            text-align: right;
            .setBut{
              margin-left: 10px;
            }
          }
        }
        .messChat{
          position: absolute;
          bottom: 0;
          right: 0;
          .el-button{
            background: #169BD5;
            color: #fff;
            border: none;
            padding: 5px 20px;
          }
        }
        .no-deal{
          .fr{
            font-size: 14px;
            color: #333;
            span{
              width: 140px;
              float: right;
              display: inline-block;
            }
          }
        }
      }
      .showPagination{
        height: calc(100% - 58px) !important;
      }
      .pagination{
        height: 60px;
        .pageBox{
          width: 100%;
          background: #fff;
          padding: 0;
          position: absolute;
          left: 50%;
          bottom: 0px;
          height: 60px;
          padding-top: 18px;
          transform: translateX(-50%);
          .el-pagination{
            height: 100%;
          }
        }
      }
      // 文字回复  回答
      .answer{
        font-size: 14px;
        color: #888;
        width: 100%;
        li{
          border: none!important;
          background: #e8e8e8;
          position: relative;
          margin-top: 20px;
          .triangle{
            position: absolute;
            top: -28px;
            width: 0px;
            height: 0px;
            border-width: 14px;
            border-style: solid;
            border-color: transparent transparent #e8e8e8 transparent;
          }
        }
        p{
          line-height: 26px;
          &:hover{
            .answer-revoke{
              display: inline-block;
            }
          }
          .answer-time{
            font-size: 12px;
            margin-right: 8px;
          }
          .answer-open{
            padding: 3px 8px;
            background: #169BD5;
            color: #fff;
            font-size: 14px;
            margin-right: 14px;
          }
          .answer-revoke{
            text-decoration: none;
            cursor: pointer;
            color: #337ab7;
            display: none;
          }
        }
      }
    }
  }
}

// 问答管理 回复
::v-deep .text-reply {
  width: 600px!important;
  .el-message-box__header {
    padding: 0;
  }
  .el-dialog__header{
    padding: 7px 10px!important;
    border-bottom: 1px solid #ccc;
    background: #f3f3f3;
    .el-dialog__title{
      font-size: 14px;
      color: #818181;
    }
  }
  .el-dialog__headerbtn{
    top: 20px;
  }
  #send-content{
    margin-top: 20px;
  }
  .send-left{
    display: inline-block;
    width: 140px;
    margin-right: 20px;

  }
}
</style>
