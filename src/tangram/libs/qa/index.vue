<template>
  <div class="vhall-qa">
    <div class="qa-content" ref="chatContent">
      <div v-if="isPrivate&&!masterEnd" class="qa-container-private" ref="scroll">
        <div>
          <template v-for="msg in privateMessages">
            <private-message :key="msg.msg_id" :msg="msg" :joinId="joinId" :atHost="atHost"></private-message>
          </template>
        </div>
      </div>
      <div v-if="!masterEnd && !isPrivate" class="qa-container-client" ref="scroll">
        <div>
          <template class="qa-item" v-for="msg in msgList">
            <client-message :key="msg.id" :msg="msg"></client-message>
          </template>
        </div>
      </div>
      <div v-if="masterEnd" class="qa-container-master" ref="scroll">
        <div>
          <template v-for="msg in msgList">
            <master-end-message :key="msg.id" :msg="msg"></master-end-message>
          </template>
        </div>
      </div>
    </div>
    <div v-if="masterEnd&&!isEmbed" class="button-container">
      <p  @click="openQa" >问答管理</p>
    </div>
    <div v-if="!masterEnd" class="qa-inputbar">
      <div class="operation-box">
        <i
          class="emoji iconfont iconbiaoqing"
          @click="openEmojiTab"
          :style="emojiVisible&&{color:'#fc5659'}"
        ></i>
        <i class="filter iconfont iconquanyuanjinyanguolv" title="查看全部消息"></i>
        <div class="emoji-tab" v-show="emojiVisible">
          <img
            :src="item.src"
            @click="emojiSelect(item)"
            v-for="item in emojiList"
            :key="item.value"
          />
        </div>
        <div
          v-if="privateMessages.length"
          class="private-messages-button"
          @click="togglePrivate"
          :style="isPrivate?'color:#fc5659':''"
        >
          私聊
          <span v-if="!isPrivateRead&&privateMessages.length" class="message-tips"></span>
        </div>
      </div>
      <div class="text-box">
        <textarea
          v-if="logedIn"
          ref="inputBox"
          maxlength="140"
          v-model="inputValue"
          :placeholder="inputStatus.placeholder"
          :disabled="inputStatus.disabled"
          @keyup.enter="sendMessage"
          @focus="textFocus"
        ></textarea>
        <div v-if="!logedIn" class="chat-login" @click="login">
          <span>登录</span>参与互动
        </div>
        <a class="send" href="javascript:;" @click="sendMessage">发送</a>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import { faceArr, textToEmoji, emojiToPath } from '../../libs/chat/js/emoji';
import getJsonp from '../../utils/jsonp';
import PrivateMessage from './privateMessage';
import MasterEndMessage from './masterEndMessage';
import ClientMessage from './clientMessage';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import PullDown from '@better-scroll/pull-down';
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(ScrollBar);
BScroll.use(PullDown);
BScroll.use(MouseWheel);
export default {
  name: 'qa',
  props: [
    'webinarId',
    'masterEnd',
    'joinId',
    'thirdPartyId',
    'isEmbed',
    'roomId',
    'vssToken',
    'roleName'
  ],
  components: {
    PrivateMessage,
    MasterEndMessage,
    ClientMessage
  },
  data () {
    return {
      url: `/webinar/question/${this.webinarId}`,
      emojiList: [],
      emojiVisible: false,
      inputStatus: {
        placeholder: '说点儿什么吧',
        disabled: false
      },
      inputValue: '',
      msgList: [],
      isPrivate: false,
      privateMessages: [],
      isPrivateRead: false, // 是否有未读私聊消息
      hostName: '',
      hostJoinId: '',
      logedIn: false,
      questionGap: 0 // 每次发送问答成功以后需要等待15秒才能再此发送问答
    };
  },
  watch: {
    'msgList.length' (newval) {
      setTimeout(() => {
        this.scroll.refresh();
        this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
      }, 50);
    },
    'privateMessages.length' (newval) {
      if (!this.isPrivate) {
        this.isPrivateRead = false;
      }
      setTimeout(() => {
        this.scroll.refresh();
        this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
      }, 50);
    }
  },
  mounted () {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.logedIn = (userInfo && userInfo.length == undefined) || this.isEmbed;
    this.emojiList = this.getEmojiList();
    this.init();

    EventBus.$on('question_answer_create', e => {
      // 发起端收到消息
      e.content = this.emojiToText(e.content);
      this.msgList.push(e);
    });
    EventBus.$on('question_answer_commit', e => {
      if (e.data.join_id != this.joinId && e.data.answer && e.data.answer.is_open == '0') { // 发给别人的私密消息
        return;
      }
      e.content = this.emojiToText(e.content);
      e.answer.content = this.emojiToText(e.answer.content);
      this.msgList.push(e);
    });
    EventBus.$on('question_answer_backout', e => {
      // 撤销消息
      this.msgList = this.msgList.filter(msg => {
        if (!msg.answer) return true;
        return msg.answer.id != e.question_answer_id;
      });
    });
    EventBus.$on('receiveMsg', msg => {
      console.warn('监听到的私聊消息事件----1--', msg);
      let e = { ...msg };
      console.warn(e, e.data.text_content, '监听到的私聊消息事件----4-');
      if (!e.data.text_content) {
        return;
      }
      e.data = e.data.text_content;
      console.warn('监听到的私聊消息事件---2---', e);
      if (e.context.to == this.joinId || e.sender_id == this.joinId) {
        // 如果是本用户收发的消息放到私聊消息队列
        if (e.sender_id != this.joinId) {
          // 发消息的人不是本用户
          console.warn('私聊消息的派发---3---', e);
          this.privateMessages.push(e);
        } else {
        }
      }
    });
    EventBus.$on('live_over', e => {
      // 活动结束
      this.$parent.qaVisible = false;
      this.$parent.changeTab(0);
    });
    EventBus.$on('open_qa', () => {
      this.$parent.isQAEnabled = true;
    });
    EventBus.$on('close_qa', () => {
      this.$parent.isQAEnabled = false;
    });
    document.addEventListener(
      'click',
      () => {
        this.emojiVisible = false;
      },
      true
    );
    // TODO:
    if(!this.roleName){
      // 只有观众才加载问答记录
      this.$fetch('getHistoryQaMsg', {
        room_id: this.roomId
      }).then((res = {data: {}}) => {
        console.warn(res, '历时问答记录')
        const list = res.data.list.map((h) => {
          return {...h, content: this.emojiToText(h.content)};
        });
        this.msgList = list;
        if (this.msgList.length && !this.masterEnd) {
          this.$parent.qaVisible = true;
        }
      }).catch(res => {});
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          click: true,
          bounce: false,
          scrollY: true,
          scrollX: false,
          pullDownRefresh: {
            threshold: 40
          },
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          },
          scrollbar: true
        });
      });
    },
    openQa(){
      const base = (process.env.VUE_APP_NODE_ENV === 'production' || process.env.VUE_APP_NODE_ENV === 'test') ? '/v3/' : '/'
      window.open(`${base}live/qa/${this.webinarId}`)
    },
    refresh () {
      this.scroll.refresh();
    },
    getEmojiList () {
      var result = [];
      for (let key in faceArr) {
        result.push({
          name: key,
          value: faceArr[key],
          src: emojiToPath(key)
        });
      }
      return result;
    },
    emojiToText (content) {
      return textToEmoji(content)
        .map(c => {
          return c.msgType == 'text'
            ? c.msgCont
            : `<img width="24" src="${c.msgImage}" border="0" />`;
        })
        .join(' ');
    },
    openEmojiTab () {
      if (!this.logedIn) return;
      this.emojiVisible = true;
    },
    emojiSelect (item) {
      this.emojiVisible = false;
      this.inputValue += item.name;
      this.$refs.inputBox.focus();
    },
    sendMessage () {
      if (this.inputValue.trim() === '') {
        return;
      }
      this.$refs.inputBox.blur();
      if (this.isPrivate) {
        if (!this.hostJoinId) return this.$message('需要@ 私聊对象');
        const msg = this.trimPlaceHolder(this.inputValue.trim());
        let _data = this.emojiToText(msg)
        let _content = { user_name: this.hostName, sender_id: this.hostJoinId }
        window.chatSDK.emit(_data, _content)
        if(!window.sessionStorage.getItem('localJoinList')){
          window.sessionStorage.setItem('localJoinList', JSON.stringify(this.userList[this.acrivePrivate].id))
          this.$fetch('v3SetUser', {room_id: this.userInfo.interact.room_id, webinar_id: this.webinar_id, to: this.userList[this.acrivePrivate].id})
        }else{
          let _arr = window.sessionStorage.getItem('localJoinList')
           if(_arr.indexOf(this.userList[this.acrivePrivate].id) == -1){
            window.sessionStorage.setItem('localJoinList', `${_arr},${this.userList[this.acrivePrivate].id}`)
          }
        }
        this.privateMessages.push({
          data: _data, // TODO:
          context: _content
        });
        this.scroll.refresh();
      } else {
        if (this.questionGap > 0) {
          this.lock = sessionStorage.getItem('QALock');
          if (this.lock && this.lock == 'true') {
            this.inputStatus.placeholder = `太频繁啦，还有${this.questionGap}秒后才能发送`;
          } else {
            this.inputStatus.placeholder = '说点什么吧';
          }
        } else {
          // TODO:
          this.$fetch('sendQaMsg', {
            room_id: this.roomId,
            content: this.inputValue
          })
            .then(res => {
              this.lock = sessionStorage.getItem('QALock');
              this.questionGap = 15;
              this.questionGapInterval = window.setInterval(() => {
                if (this.questionGap > 0) {
                  if (!this.lock || this.lock == 'false') {
                    sessionStorage.setItem('QALock', true);
                  } else {
                    this.inputStatus.placeholder = `太频繁啦，还有${this.questionGap}秒后才能发送`;
                  }
                  this.questionGap = this.questionGap - 1;
                } else {
                  window.clearInterval(this.questionGapInterval);
                  this.inputStatus.placeholder = '说点什么吧';
                  sessionStorage.setItem('QALock', false);
                }
              }, 1000);
            })
            .catch(res => {});
        }
      }

      this.inputValue = '';
    },
    togglePrivate () {
      this.isPrivate = !this.isPrivate;
      this.inputValue = '';
      if (this.isPrivate) {
        this.isPrivateRead = true;
      }
      this.$nextTick(() => {
        this.refresh();
      });
    },
    atHost (data) {
      this.hostName = data.name;
      this.hostJoinId = data.joinId;
      this.inputValue = this.inputValue
        ? `我对${this.hostName}说: ${this.trimPlaceHolder()}`
        : `我对${this.hostName}说:`;
    },
    textFocus () {
      if (this.isPrivate && !this.inputValue && this.hostJoinId) {
        this.inputValue = `我对${this.hostName}说:`;
      }
    },
    trimPlaceHolder () {
      return this.inputValue.replace(`我对${this.hostName}说:`, '');
    },
    login () {
      this.$parent.loginTest();
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../public/iconfont/iconfont.css';
.vhall-qa {
  width: 100%;
  height: 100%;
  position: relative;
  background: #434343;
  & > .qa-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 81px;
    & > .qa-container-client {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    & > .qa-container-master {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    & > .qa-container-private {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  }

  & > .button-container {
    height: 52px;
    width: 100%;
    background: #34363a;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    & > p {
      color: #fff;
      display: block;
      margin: 0 auto;
      border-radius: 5px;
      background: #fc5659;
      line-height: 35px;
      font-size: 12px;
      text-align: center;
      margin: 10px;
      &:hover,
      &:active {
        background: #fc5659;
      }
    }
  }
  & > .qa-inputbar {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    z-index: 99;
    border-top: 1px solid #3a3a48;
    background-color: #2d2d2d;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    & > .operation-box {
      display: flex;
      margin-bottom: 7px;
      font-size: 20px !important;
      align-items: center;
      position: relative;
      & > .emoji {
        color: #999;
        margin-right: 10px;
        cursor: pointer;
        font-size: 19px;
        &:hover {
          color: #fc5659;
          cursor: pointer;
        }
      }
      & > .emoji-tab {
        position: absolute;
        bottom: 43px;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        width: 294px;
        border: 1px #afafaf solid;
        background: white;
        left: -10px;
        box-sizing: border-box;
        & > img {
          width: 24px;
          height: 24px;
        }
      }
      & > .filter {
        display: none;
        color: #999;
        font-size: 19px;
        &:hover {
          color: #fc5659;
          cursor: pointer;
        }
      }
      & > .private-messages-button {
        font-size: 12px;
        font-family: '微软雅黑';
        position: absolute;
        right: 5px;
        bottom: 4px;
        color: #ababab;
        cursor: pointer;
        & > .message-tips {
          background: #fc5659;
          height: 4px;
          width: 4px;
          display: block;
          position: absolute;
          top: 1px;
          right: -2px;
          border-radius: 2px;
        }
        &:hover {
          color: #fc5659;
        }
        &:active {
          color: #ff3333;
        }
      }
    }
    & > .text-box {
      text-align: left;
      height: 34px;
      width: 100%;
      box-sizing: border-box;
      z-index: 99;
      background-color: #2d2d2d;
      display: flex;
      & > .chat-login {
        position: relative;
        z-index: 2;
        height: 34px;
        width: 222px;
        cursor: pointer;
        background: #545454;
        border-radius: 4px 0 0 4px;
        float: left;
        line-height: 32px;
        color: #aaa;
        box-sizing: border-box;
        padding-left: 9px;
        font-size: 12px;
        & > span {
          color: #fc5659;
          margin-right:4px;
        }
      }
      & > textarea {
        border: none;
        background: #545454;
        height: 34px;
        max-width: 80%;
        resize: none;
        padding: 0 9px;
        line-height: 34px;
        color: #fff;
        overflow: auto;
        border-radius: 4px 0 0 4px;
        box-sizing: border-box;
        font-size: 12px;
        outline: none;
        flex: 1;
      }
      & > a {
        box-sizing: border-box;
        width: 20%;
        max-width: 20%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #999;
        cursor: pointer;
        color: #fff;
        float: left;
        border-radius: 0 4px 4px 0;
        font-size: 13px;

        &:hover {
          background: #fc5659;
        }
      }
    }
  }
}
</style>
