<template>
  <div class="chat-com" :class="{assistant :assistantType}" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="chat-content" ref="chatContent">
      <div class="chat-content-scroll" ref="scroll">
        <div>
          <template v-for="msg in chatList">
            <msg-item
              :key="msg.count"
              :msg="msg"
              :roleName="roleName"
              @lotteryCheck="lotteryCheck"
              @questionnaireCheck="questionnaireCheck"
              @previewImg="previewImg"
            ></msg-item>
          </template>
        </div>
      </div>
    </div>
    <div class='tip' v-show="showTip" @click="scrollTo">
      {{tipMsg}}
    </div>
    <div class="chat-bottom">
      <!-- 上传图片预览 -->
      <div v-show="uploadActive" class="chat-img-box">
        <div class="chat-img" v-for="(url, index) in imgUrls" :key="index">
          <img
            width="100%"
            height="100%"
            :src="url + '?x-oss-process=image/resize,m_lfit,h_34,w_34'"
            alt
          />
          <i class="img-close" @click="deleteImg(index)"></i>
        </div>
      </div>

      <!-- 表情选择 -->
      <div class="emoji-wrapper">
        <emoji ref="emoji" @emojiInput="emojiInput"></emoji>
      </div>
      <!-- 过滤 -->
      <chat-filter
        v-if="roleName != 2"
        :roomId="roomId"
        :webinarId="webinarId"
        :allBanned="allBanned"
        ref="chatFilter"
        :chatFilterUrl="chatFilterUrl"
        :isAssistant='assistantType'
      ></chat-filter>

      <div class="chat-control-wrap">
        <span class="iconfont iconbiaoqing" @click.stop="toggleEmoji"></span>
        <el-upload
          v-if="roleName != '2'"
          class="avatar-uploader"
          :action="`${$baseUrl}/cmpt/chat/upload`"
          :show-file-list="false"
          name="file"
          :before-upload="onExceed"
          :data="{
            vss_token: vssToken,
            room_id: roomId
          }"
          accept=".jpg, .jpeg, .png, .bmp"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <i
            :class="['iconfont', 'icontupianliaotian', uploadActive ? 'active' : '']"
          ></i>
        </el-upload>
        <a
          v-if="roleName != '2' && plugin.audit.show"
          class="iconfont iconguolv"
          @click="toggleChatFilter"
        ></a>
      </div>
      <div class="chat-input-wrap">
        <input
          v-if="!inputStatus.disable && !chatLoginStatus"
          ref="chatInput"
          accept="image/jpg, image/png, image/jpeg, image/bmp"
          :placeholder="inputStatus.placeholder"
          :disabled="inputStatus.disable"
          type="text"
          maxlength="140"
          v-model="inputValue"
          @keyup.enter="sendMsgThrottle"
          @keyup.delete="backspace"
        />
        <div
          v-if="(roleName != 1 && inputStatus.disable) || chatLoginStatus"
          class="input-placeholder"
        >
          {{ inputStatus.placeholder }}
        </div>
        <div v-show="chatLoginStatus" class="chat-input-login">
          <span @click="clickCallLogin">登录</span>
          参与互动
        </div>
        <button :class="{assistant: assistantType}" @click="sendMsgThrottle">发送</button>
      </div>
    </div>
    <img-preview ref="imgPreview" :imgs="previewImgList"></img-preview>
    <chat-user-control :roomId="roomId" :userId="userId" :reply="reply" :deleteMsg="deleteMsg" :atUser="atUser" :atList="atList"></chat-user-control>
  </div>
</template>
<script>
// import ChatFunc from './chat-func/Chat'
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import PullDown from '@better-scroll/pull-down';
import MouseWheel from '@better-scroll/mouse-wheel';
import ObserveDom from '@better-scroll/observe-dom';
import eventMixin from './mixin/event-mixin';
import uploadMixin from './mixin/upload-mixin';
import EventBus from '@/utils/Events';
import Msg from './js/msg-class';
import ImgPreview from './img-preview';
import Emoji from './emoji';
import ChatFilter from './chat-filter';
import MsgItem from './msg-item';
import ChatUserControl from './chat-user-control';
import { textToEmojiText } from './js/emoji';
import { formatTime, handleTime } from './js/handle-time';
import getAvatar from './js/get-avatar';
import { disableScroll, enableScroll } from '../../utils/scroll';
BScroll.use(ScrollBar);
BScroll.use(PullDown);
BScroll.use(MouseWheel);
BScroll.use(ObserveDom);
export default {
  mixins: [eventMixin, uploadMixin],
  props: {
    // 是否分屏
    splited: {
      required: false,
      default: false
    },

    playerType: {
      required: false
    },
    token: {
      required: false
    },
    appId: {
      required: true
    },
    // 打开手动过滤地址需要
    webinarId: {
      required: false
    },
    // 是否全体禁言
    allBanned: {
      required: true
    },
    // 是否被禁言
    isBanned: {
      required: true
    },
    channelId: {
      type: [Number, String],
      default: ''
    },
    roomId: {
      type: [Number, String],
      default: -1
    },
    roleName: {
      required: true
    },
    // 图片上传需要
    vssToken: {
      type: [Boolean, String],
      default: ''
    },
    userId: {
      type: [Number, String],
      default: ''
    },
    chatFilterData: {
      required: false // 聊天过滤的数组
    },
    chatFilterUrl: {
      required: true // 聊天过滤的跳转url
    },
    showControl: {
      type: Boolean,
      default: true
    },
    plugin: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        image: false,
        emoji: false,
        audit: {
          show: true,
          src: 'javascript:;'
        }
      }
    },
    isEmbed: {
      required: false // 是否为潜入页
    }
  },
  data () {
    return {
      assistantType: this.$route.query.assistantType,
      placeholderDescribe: '', // placeholder的显示
      chatLoginStatus: false, // 聊天是否需要登录
      // 聊天列表
      chatList: [],
      // 输入框的值
      inputValue: '',
      // 输入框状态
      inputStatus: {
        placeholder:
          this.roleName == '1'
            ? '参与聊天'
            : this.roleName != '2'
              ? (this.isBanned ? '您已被禁言' : '参与聊天')
              : this.allBanned
                ? '全员禁言中'
                : this.isBanned
                  ? '您已被禁言'
                  : '参与聊天',
        disable: this.roleName == '1' ? false : (this.roleName != '2' ? this.isBanned : this.isBanned || this.allBanned)
      },
      // 预览图片列表
      previewImgList: [],
      // 回复消息
      replyMsg: {},
      // @用户
      atList: [],
      // 提示开关
      showTip: false,
      // 提示定时器
      tipTimer: '',
      // @本用户的元素集合
      elements: [],
      // 是否有人回复本用户
      replyElement: null,
      // 提示文字
      tipMsg: '',
      // 发送聊天间隔时间
      chatGap: 0,
      // 总在线人数
      onlineUsers: 0
    };
  },
  components: {
    ImgPreview,
    Emoji,
    MsgItem,
    ChatFilter,
    ChatUserControl
  },
  watch: {
    'chatList.length' (newval) {
      setTimeout(() => {
        let isBottom = false;
        if (this.scroll.y <= this.scroll.maxScrollY + 10) {
          isBottom = true;
        }
        this.scroll.refresh();
        if (this.isPullingDown) {
          this.scroll.finishPullDown();
          this.isPullingDown = false;
          return;
        }
        if (isBottom) {
          this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
        }
        this.$emit('chatUpdata');
      }, 50);
    },
    replyMsg () {
      if (Object.keys(this.replyMsg || {}).length == 0) {
        this.inputValue = this.trimPlaceHolder('reply');
      } else {
        this.inputValue = this.inputValue
          ? `回复${this.replyMsg.nickName}: ${this.trimPlaceHolder('reply')}`
          : `回复${this.replyMsg.nickName}: `;
      }
    },
    inputValue (newValue) {
      if (!newValue) {
        this.replyMsg = {};
      }
    }
  },
  mounted () {
    this.init();
    window.chatA = this;
    // 1--是需要登录才能参与互动   0--不登录也能参与互动
    if (sessionStorage.getItem('watch')) {
      if (JSON.parse(sessionStorage.getItem('moduleShow')).modules.chat_login.show == 1) {
        if (
          JSON.parse(sessionStorage.getItem('authInfo')).length == undefined ||
          this.isEmbed
        ) {
          // 登录状态
          this.chatLoginStatus = false;
        } else {
          // 非登录状态
          this.chatLoginStatus = true;
          this.inputStatus.placeholder = this.placeholderDescribe;
        }
      } else {
        this.chatLoginStatus = false;
      }
    }
    // // 点击页面其他地方的时候让弹框隐藏
    // document.addEventListener(
    //   'click',
    //   () => {
    //     this.isShowEmojiTab = false
    //     this.personStatus.canOpen = false
    //   },
    //   true
    // )
    // // 滚轮滚动的时候弹框消失
    // document.addEventListener('mousewheel', e => {
    //   this.personStatus.canOpen = false
    // })
  },

  methods: {
    scrollBottom () {
      this.scroll.scrollTo(0, this.scroll.maxScrollY, 200);
    },
    clickCallLogin () {
      this.$parent.loginTest();
    },
    init () {
      this.chatSDK = window.chatSDK;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          click: true,
          bounce: false,
          scrollY: true,
          scrollX: false,
          pullDownRefresh: {
            threshold: 40
          },
          // preventDefaultException: {
          //   tagName: /^(SPAN|P)$/
          // },
          eventPassthrough: 'horizontal',
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          },
          scrollbar: {
            fade: true,
            interactive: true
          },
          observeDom: true
        });
        // this.scroll.on('pullingDown', () => {
        //   this.page++
        //   this.isPullingDown = true
        //   this.getHistoryMsg()
        // })

        this.listenEvents();
        this.page = 1;
        this.getHistoryMsg();

        // this.scroll.once('scroll', disableScroll)
        // this.scroll.once('scrollEnd', enableScroll)
      });
    },
    mouseenter () {
      if (!this.isClientEnd()) return; // 只有观看端才执行
      disableScroll();
    },
    mouseleave () {
      if (!this.isClientEnd()) return; // 只有观看端才执行
      enableScroll();
    },
    // 发送消息
    sendMsg (callback) {
      // chatFilterData    //过滤敏感词汇
      // console.log('guolv关键词',this.chatFilterData)
      window.clearTimeout(this.sendTimeOut);
      this.sendTimeOut = setTimeout(() => {
        let inputValue = this.trimPlaceHolder('reply');
        if (this.inputStatus.disable) {
          return;
        }
        if ((!inputValue || (inputValue && !inputValue.trim())) && !this.uploadActive) {
          return this.$message.error('内容不能为空');
        }
        let data = {};
        if (inputValue) {
          data.type = 'text';
          data.barrageTxt = inputValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
          data.text_content = inputValue;
        }
        if (this.uploadActive) {
          data.image_urls = this.imgUrls;
          data.type = 'image';
        }
        let userInfo = JSON.parse(sessionStorage.getItem('user'));
        let context = {
          nickname: userInfo.nick_name, // 昵称
          avatar: userInfo.avatar, // 头像
          role_name: this.roleName, // 角色 1主持人2观众3助理4嘉宾
          replyMsg: this.replyMsg, // 回复消息
          atList: this.atList // @用户列表
        };
        console.log('context', context);
        // data.role_name = this.roleName
        let filterStatus = true;
        console.log(JSON.stringify(data));
        if (sessionStorage.getItem('watch')) {
          if (this.chatFilterData && this.chatFilterData.length > 0) {
            this.chatFilterData.map(item => {
              if (inputValue.includes(item)) {
                filterStatus = false;
              }
            });
          }
        }
        if (this.roleName != 2 || (this.roleName == 2 && filterStatus)) {
          if (this.atList.length && data.text_content) {
            this.atList.forEach((a) => {
              data.text_content = data.text_content.replace(`@${a.nickName}`, `***${a.nickName}`);
            });
          }
          this.chatSDK.emit(data, context);
          window.vhallReport.report('CHAT', {
            event: JSON.stringify(data),
            market_tools_id: this.roleName
          });
        }
        this.imgUrls = [];
        this.inputValue = '';
        this.replyMsg = {};
        this.$refs.emoji.isShow = false;
        // 观众端会显示回显，会过滤掉socket中自己的信息
        if (this.roleName == 2) {
          let context = sessionStorage.getItem('vhall_chat_context');
          context = context ? JSON.parse(context) : {};
          let item = {};
          if (this.chatList.length) {
            item = this.chatList[this.chatList.length - 1];
          }
          data.text_content = textToEmojiText(data.text_content);
          let tempData = new Msg({
            avatar: getAvatar(context.avatar),
            nickName: context.nickname,
            type: 'text',
            content: data,
            sendId: this.userId,
            sendTime: formatTime(new Date()),
            roleName: this.roleName,
            client: context.device_type == 2 ? 'pc' : 'mobile',
            showTime: handleTime(item.sendTime),
            replyMsg: this.replyMsg,
            atList: this.atList
          });
          this.chatList.push(tempData);
          if (!data.barrageTxt.includes('<img')) {
            this.$emit('pushBarrage', data.barrageTxt);
          }
        }
        this.atList = [];
        callback && callback();
      }, 300);
    },
    // 发送聊天节流
    sendMsgThrottle () {
      if (this.roleName != 2) {
        this.sendMsg();
        return;
      }
      if (this.chatGap > 0) {
        this.lock = sessionStorage.getItem('chatLock');
        if (this.lock && this.lock == 'true') {
          this.$message.warning(`当前活动火爆，请您在${this.chatGap}秒后再次发言`);
        }
      } else {
        this.sendMsg(() => {
          window.clearInterval(this.chatGapInterval);
          this.lock = sessionStorage.getItem('chatLock');
          this.chatGap = this.delayTime(this.onlineUsers);
          this.chatGapInterval = window.setInterval(() => {
            if (this.chatGap > 0) {
              if (!this.lock || this.lock == 'false') {
                sessionStorage.setItem('chatLock', true);
              } else {
                // this.$message.warning(`太频繁啦，还有${this.chatGap}秒后才能发送`)
              }
              this.chatGap = this.chatGap - 1;
            } else {
              window.clearInterval(this.chatGapInterval);
              sessionStorage.setItem('chatLock', false);
            }
          }, 1000);
        });
      }
    },
    /**
     * 获取根据人数和系数获取延迟时间
     * @param n 人数
     * @param o 非必传，系数，不传递默认为1
     * @returns {number}
     */
    delayTime (n, o) {
      n = n || 0;
      o = o || 1;
      let result = 0;
      if (n <= 1000) {
        result = 0;
      } else if (n <= 10000) { // 大于1千，小于1万
        result = n / 1000;
      } else if (n <= 50000) { // 大于1万，小于5万
        result = 20 + 10 * (n - 10000) / 10000;
      } else if (n > 50000) { // 大于5万
        result = 60;
      }
      return Math.floor(o * result);
    },
    // 获取历史消息
    getHistoryMsg () {
      let data = {
        room_id: this.roomId,
        curr_page: this.page,
        page_size: 50 // 所有端统一显示50条
      };
      this.$vhallFetch('getHistoryMsgNew', data).then(res => {
        if (res.data.length) {
          let list = res.data
            .map(item => {
              if (item.data.text_content) {
                item.data.text_content = textToEmojiText(item.data.text_content);
              }
              if (item.context.atList && item.context.atList.length && item.data.text_content) {
                item.context.atList.forEach((a) => {
                  item.data.text_content = item.data.text_content.replace(`***${a.nickName}`, `@${a.nickName}`);
                });
              }
              return new Msg({
                type: item.data.type,
                avatar: item.avatar ? item.avatar : 'https://cnstatic01.e.vhall.com/3rdlibs/vhall-static/img/default_avatar.png',
                sendId: item.sender_id,
                showTime: item.showTime,
                nickName: item.nickname,
                roleName: item.role_name,
                sendTime: item.date_time,
                content: item.data,
                replyMsg: item.context.replyMsg,
                atList: item.context.atList,
                msgId: item.msg_id,
                channel: item.channel_id,
                isHistoryMsg: true
              });
            }).reduce((acc, curr) => {
              let showTime = curr.showTime;
              if (acc.find(s => s.showTime == showTime)) {
                acc.push({...curr, showTime: ''});
              } else {
                acc.push(curr);
              }
              return acc;
            }, []);
          this.chatList.unshift(...list);
        } else {
          this.scroll.finishPullDown();
          this.isPullingDown = false;
        }
      });
    },
    // 切换表情显示
    toggleEmoji () {
      if (this.chatLoginStatus) {
        this.$message.error('未登录');
        return;
      }

      if (this.inputStatus.disable) {
        this.$message.error('您已被禁言');
        return;
      }
      this.$refs.emoji.toggleShow();
    },

    // 子组件输入表情
    emojiInput (value) {
      if (this.inputStatus.disable) {
        return;
      }
      this.inputValue += value;
    },
    refresh () {
      this.scroll && this.scroll.refresh();
    },
    // 子组件查看抽奖
    lotteryCheck (msg, userId) {
      EventBus.$emit('lotteryCheck', msg, userId);
    },
    // 子组件查看问卷
    questionnaireCheck (questionnaire_id) {
      console.log('ss', questionnaire_id);
      EventBus.$emit('questionnaireCheck', questionnaire_id);
    },
    // 子组件预览聊天图片
    previewImg (index, imgs) {
      this.previewImgList = imgs.map(item => item.split('?')[0]);
      if (this.$route.query.assistantType) {
        console.log('imgPreview', this.previewImgList);
        return EventBus.$emit('imgPreview', {list: this.previewImgList, index});
      }
      this.$refs.imgPreview.show();
      clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => {
        this.$refs.imgPreview.goToPage(index, 0, 0);
      }, 400);
    },
    toggleChatFilter () {
      this.$refs.chatFilter.toggleShow();
    },
    reply (count) {
      this.inputValue = '';
      this.atList = [];
      this.replyMsg = this.chatList.find((chatMsg) => {
        return chatMsg.count == count;
      }) || {};
      this.$refs.chatInput.focus();
    },
    trimPlaceHolder (type) {
      return this.inputValue.replace(/^[回复].+[:]\s/, '');
    },
    deleteMsg (count) {
      const msgToDelete = this.chatList.find((chatMsg) => {
        return chatMsg.count == count;
      }) || {};
      const params = {channel_id: msgToDelete.channel, msg_id: msgToDelete.msgId, room_id: this.roomId};
      setTimeout(() => {
        this.$vhallFetch('deleteMessage', params).then(res => {
          this.chatList = this.chatList.filter((chatMsg) => {
            return chatMsg.count != count;
          });
        });
      }, 3000); // 优化 17532
    },
    atUser (count) {
      this.replyMsg = {};
      const msgToAt = this.chatList.find((chatMsg) => {
        return chatMsg.count == count;
      }) || {};
      if (!this.atList.find((u) => u.accountId == msgToAt.sendId)) {
        this.inputValue = this.trimPlaceHolder() + `@${msgToAt.nickName} `;
        this.$refs.chatInput.focus();
        const currentIndex = this.$refs.chatInput.selectionStart || 0;
        this.atList.push({nickName: msgToAt.nickName, accountId: msgToAt.sendId, index: currentIndex});
      }
    },
    backspace (e) {
      if (!this.inputValue) {
        this.atList = [];
        return;
      }
      const currentIndex = this.$refs.chatInput.selectionStart;
      const firstPart = this.inputValue.substring(0, currentIndex);
      const lastIndex = firstPart.lastIndexOf('@');
      if (lastIndex != -1) {
        let userName = this.inputValue.substring(lastIndex, currentIndex);
        const nickName = userName.replace('@', '');
        // 删除整个@过的用户名逻辑
        if (this.atList.find(u => u.nickName == nickName)) {
          this.atList = this.atList.filter(n => n.nickName != nickName);
          this.inputValue = this.inputValue.replace(userName, '');
        } else {
          this.atList = this.atList.filter((a) => {
            const atIndex = this.inputValue.indexOf(`@${a.nickName} `);
            return atIndex != -1;
          });
        }
      }
      // 删除要回复的用户名逻辑
      const lastReplyIndex = firstPart.lastIndexOf('回复');
      if (lastReplyIndex != -1) {
        let replyUserName = this.inputValue.substring(lastReplyIndex, currentIndex);
        console.log(`回复${this.replyMsg.nickName}:` == replyUserName);
        if (`回复${this.replyMsg.nickName}:` == replyUserName) {
          this.inputValue = this.inputValue.replace(replyUserName, '');
          this.replyMsg = {};
        } else {
          (this.inputValue.indexOf(`回复${this.replyMsg.nickName}: `) == -1) && (this.replyMsg = {});
        }
      }
    },
    scrollTo () {
      const el = this.replyElement || this.elements[0];
      this.scroll.scrollToElement(el, 100, false, false);
      EventBus.$emit('clearElements');
    },
    isClientEnd () {
      const href = window.location.href || '';
      return href.includes('t-webinar.e.vhall.com') || href.includes('live.vhall.com');
    }
    // 打开禁言下麦弹框
    // async openPicControl (joinId, event, item) {
    //   if (!this.showControl) {
    //     return
    //   }
    //   if (!joinId) {
    //     console.error('joinId为空')
    //     return
    //   }
    //   let contentDom = document.querySelector('.chat-content')
    //   // 临时使用固定弹框高度82，固定头像高度30
    //   let controlDomHeight = 82
    //   let contentHeight = contentDom.offsetHeight
    //   let contentTop = contentDom.offsetTop
    //   let contentScrollTop = contentDom.scrollTop
    //   const target = event.target.parentNode
    //   if (!target) {
    //     console.error('target不存在')
    //     return
    //   }

    //   // pic-wrap元素的高度减去容器的滚动高度加上图片高度如果小于聊天容器.chat-content高度加上聊天容器.chat-content距离顶部高度减去控制弹框.pic-control高度
    //   // 则弹框top值为pic-wrap的距离顶部高度减去容器.chat-content滚动高度加上图片高度30
    //   // 否则top值为pic-wrap的距离顶部高度减去容器.chat-content滚动高度减去控制弹框.pic-control高度
    //   if (
    //     target.offsetTop - contentScrollTop + 30 <
    //     contentHeight + contentTop - controlDomHeight
    //   ) {
    //     this.personStatus.top = target.offsetTop - contentScrollTop + 30
    //   } else {
    //     this.personStatus.top =
    //       target.offsetTop - contentScrollTop - controlDomHeight
    //   }

    //   let personInfo = await window.chat.getPersonInfo(joinId, this.roomId)
    //   this.personStatus.isKickout = personInfo.isKickOut
    //   this.personStatus.isBlockSpeak = personInfo.isSpeak
    //   this.personStatus.joinId = personInfo.joinId
    //   this.personStatus.canOpen = true
    // },
    // async kickOut (joinId, isKickOut) {
    //   this.personStatus.canOpen = false
    //   this.requestOver = false

    //   await window.chat.kickOut(joinId, 1 - isKickOut)
    //   this.requestOver = true
    // },
    // async blockSpeak (joinId, isSpeak) {
    //   this.personStatus.canOpen = false

    //   await window.chat.blockSpeak(joinId, 1 - isSpeak)
    //   this.requestOver = true
    // }
  }
};
</script>
<style lang="less" scoped>
p {
  margin: 0;
}
.chat-com {
  width: 100%;
  height: 100%;
  position: relative;
  background: #434343;
  &.assistant{
    background: #323232;
  }
  .pic-control {
    position: absolute;
    background: #36383f;
    border: 1px solid #505061;
    border-radius: 4px;
    color: #b8bbca;
    font-size: 12px;
    width: 118px;
    padding: 6px 0;
    text-align: center;
    top: 30px;
    z-index: 1;
    // left:0;
    p {
      line-height: 34px;
      cursor: pointer;
    }
  }
  .chat-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 81px;
    margin-top: 10px;
    .chat-content-scroll {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  }
  .tip {
    display: flex;
    flex-direction: column;
    text-align: center;
    height:32px;
    line-height: 32px;
    background:rgba(255,241,232,1);
    color: #FF9446;
    font-size: 12px;
    position: absolute;
    box-sizing: border-box;
    left: 0;
    right: 0;
    bottom: 84px;
    cursor: pointer;
  }
  .chat-bottom {
    display: flex;
    /*height: 81px;*/
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid #3a3a48;
    background-color: #2d2d2d;
    position: absolute;
    box-sizing: border-box;
    left: 0;
    right: 0;
    bottom: 0;
    .chat-control-wrap {
      display: flex;
      align-items: center;
      /*height: 20px;*/
      margin-bottom: 7px;
      & > * {
        margin-left: 10px;
      }
      .iconfont {
        color: #999999;
        font-size: 19px;
        cursor: pointer;
        &.active {
          color: #fc5659;
        }
        &:hover {
          color: #fc5659;
          cursor: pointer;
        }
        &.pic-disabled {
          pointer-events: none;
        }
        &.icontupianliaotian{
          font-size: 18px;
        }
      }
      .icon-common {
        width: 24px;
        color: #999999;
        height: 24px;
        font-size: 18px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }

      .iconbiaoqing {
        font-size: 19px;
        color: #999;
        margin-left: 0;
        margin-bottom: 1px;
        &:hover {
          color: #fc5659;
          cursor: pointer;
        }
      }
      .chat-audit {
        background-image: url('../../assets/auditing.png');
        &:hover {
          background-size: 95%;
          background-image: url('../../assets/auditing-hover.png');
        }
      }
      .avatar-uploader {
        flex: 1;
      }
      // .iconbiaoqing {
      //   color: #999;
      //   &:hover {
      //     color: #fc5659;
      //     cursor: pointer;
      //   }
      // }
    }
    .chat-input-wrap {
      display: flex;
      height: 34px;
      position: relative;
      input {
        flex: 1;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: none;
        background: rgba(84, 84, 84, 1);
        outline: none;
        padding-left: 12px;
        color: #b8bbca;
        &:focus + button {
          background: #999999;
        }
      }
      .input-placeholder {
        flex: 1;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: none;
        background: rgba(84, 84, 84, 1);
        outline: none;
        padding-left: 12px;
        color: #b8bbca;
        font-size: 14px;
        line-height: 34px;
      }
      .chat-input-login {
        position: absolute;
        // width: 100%;
        height: 34px;
        line-height: 34px;
        top: 0;
        left: 9px;
        z-index: 2;
        color: #aaa;
        font-size: 12px;
        background: #545454;
        span {
          font-size: 12px !important;
          color: #aaa;
        }
        span:first-of-type {
          color: #fc5659;
          cursor: pointer;
          font-size: 12px !important;
        }
      }
      button {
        &.assistant{
          width: 58px;
          flex-basis: initial;
        }
        flex-basis: 20%;
        width: 20%;
        text-align: center;
        line-height: 34px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: rgba(153, 153, 153, 1);
        cursor: pointer;
        color: #fff;
        border: none;
        outline: none;
        /* &:active {
          background: #999999;
        } */
        &:hover {
          background: #fc5659;
        }
      }
    }
    .chat-img-box {
      padding: 8px;
      background: #3f3f3f;
      position: absolute;
      top: -50px;
      left: 7%;
      box-sizing: border-box;
      .chat-img {
        float: left;
        width: 34px;
        height: 34px;
        margin-right: 8px;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        .img-close {
          position: absolute;
          width: 15px;
          height: 15px;
          background: url('../../assets/images/chat/img-del.png') no-repeat;
          background-size: contain;
          top: 0px;
          right: 0px;
          display: none;
        }
        & > img {
          display: block;
        }
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          border: 1px solid #fc5659;
          .img-close {
            display: block;
          }
        }
      }
    }
    .emoji-wrapper {
      width: 294px;
      position: absolute;
      top: 0;
      transform: translateY(-100%);
      left: 0;
    }
  }
}
</style>
