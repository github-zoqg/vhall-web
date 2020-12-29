import EventBus from '@/utils/Events';
import Msg from '../js/msg-class';
import { textToEmojiText } from '../js/emoji';
import { handleTime } from '../js/handle-time';
import getAvatar from '../js/get-avatar';
import { throttle } from 'lodash';
const pcDevice = ['pc_browser', 'desktop'];

const eventMixin = {
  methods: {
    listenEvents () {
      const throttleChatMsg = throttle(() => {
        if (this.chatList.length > 200) {
          this.chatList = this.chatList.slice(-200);
        }
      }, 2000);
      this.chatSDK.on(msg => {
        if (typeof msg !== 'object') {
          msg = JSON.parse(msg);
        }
        try {
          if (typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context);
          }
          if (typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }
        console.log('============收到聊天消息==============111=');
        console.log(msg);
        if (!msg.data.barrageTxt && msg.data.text_content) {
          msg.data.barrageTxt = msg.data.text_content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        }
        if (msg.data.text_content) {
          msg.data.text_content = textToEmojiText(msg.data.text_content);
        }
        EventBus.$emit('receiveMsg', msg);
        if (msg.data.type == 'text' || msg.data.type == 'image') {
          // 问答私聊消息，不添加到聊天列表里面
          if (msg.data.target_id) return;

          // 如果是观众，并且接受到的消息是自己发的，不显示
          if (this.roleName == 2 && msg.sender_id == this.userId) return;

          let item = {};
          if (this.chatList.length) {
            item = this.chatList[this.chatList.length - 1];
          }
          if (msg.context.atList && msg.context.atList.length && msg.data.text_content) {
            msg.context.atList.forEach((a) => {
              msg.data.text_content = msg.data.text_content.replace(`***${a.nickName}`, `@${a.nickName}`);
            });
          }
          throttleChatMsg(); // 解决17618
          let data = new Msg({
            avatar: getAvatar(msg.context.avatar),
            nickName: msg.context.nickname,
            type: msg.data.type,
            content: msg.data,
            sendId: msg.sender_id,
            sendTime: msg.date_time,
            roleName: msg.context.role_name,
            client: pcDevice.includes(msg.client) ? 'pc' : 'mobile',
            showTime: handleTime(item.sendTime),
            replyMsg: msg.context.replyMsg || {},
            atList: msg.context.atList || [],
            msgId: msg.msg_id,
            channel: msg.channel
          });
          console.warn('回显个人发的消息---', data)
          this.chatList.push(data);
        }
        // 禁言某个用户
        if (msg.data.type == 'disable') {
          EventBus.$emit('disable', msg);
          if (msg.data.target_id == this.userId) {
            this.inputValue = '';
            this.inputStatus.disable = true;
            this.inputStatus.placeholder = '您已被禁言';
          }
        }
        // 取消禁言某个用户
        if (msg.data.type == 'permit') {
          EventBus.$emit('permit', msg);
          if (msg.data.target_id == this.userId && !this.allBanned) {
            this.inputValue = '';
            this.inputStatus.disable = false;
            this.inputStatus.placeholder = '参与聊天';
          }
        }

        // 取消禁言某个用户
        if (msg.data.type == 'disable_all') {
          EventBus.$emit('disable_all', msg);
          if (this.roleName == '2') {
            this.inputValue = '';
            this.inputStatus.disable = true;
            if (this.chatLoginStatus) {
              return;
            }
            this.inputStatus.placeholder = '全员禁言中';
          }
        }
        // 取消禁言某个用户
        if (msg.data.type == 'permit_all') {
          EventBus.$emit('permit_all', msg);
          if (this.roleName == '2') {
            if (this.isBanned) {
              this.inputValue = '';
              this.inputStatus.disable = true;
              this.inputStatus.placeholder = '您已被禁言';
              return;
            }
            this.inputValue = '';
            this.inputStatus.disable = false;
            if (this.chatLoginStatus) {
              return;
            }
            this.inputStatus.placeholder = '参与聊天';
          }
        }
      });

      if (this.playerType == 'live' || this.roleName != 2) {
        // 接受房间消息
        this.chatSDK.onRoomMsg(msg => {
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
          console.log('==========房间消息========1===', msg);
          Object.assign(msg, msg.data);
          setTimeout(() => {
            if (msg.type == 'live_start') {
              EventBus.$emit('startPlay', true);
            }
          }, 200);

          if (this.splited) {
            EventBus.$emit('sendCmdToShadow', msg);
          }

          EventBus.$emit('roomAllInfo', msg);
          // 发起抽奖
          if (msg.type == 'lottery_push' && this.roleName == '2') {
            let data = new Msg({
              nickName: '抽奖',
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                text_content: '正在进行抽奖环节'
              },
              type: msg.type
            });
            this.chatList.push(data);
          }
          // 抽奖结果
          if (msg.type == 'lottery_result_notice' && this.roleName == '2') {
            let index = msg.lottery_winners.findIndex(item => item.lottery_user_id == this.userId);
            if (index >= 0) {
              let data = new Msg({
                nickName: '抽奖',
                avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
                content: {
                  text_content: '恭喜您中奖了！',
                  msg: msg,
                  userId: this.userId
                },
                type: msg.type
              });
              this.chatList.push(data);
            }
            window.vhallReport && window.vhallReport.report('LOTTERY', {
              question_id: index >= 0 ? 1 : 0,
              answer_id: msg.lottery_id
            });
          }
          // 打赏成功
          if (msg.data.type == 'reward_pay_ok') {
            let data = new Msg({
              avatar: getAvatar(msg.data.rewarder_avatar),
              nickName: msg.data.rewarder_nickname,
              type: 'text',
              content: {
                text_content: msg.data.reward_describe ? msg.data.reward_describe : '很精彩，赞一个！'
              },
              sendId: this.userId,
              roleName: this.roleName,
            });
            console.log(999, msg)
            this.chatList.push(data);
            console.log(1000, this.chatList)

          }
          // 礼物
          if (msg.data.type == "gift_send_success") {
            let uploadUrl = sessionStorage.getItem('imageDomin');
            let data = new Msg({
              nickName: msg.gift_user_nickname,
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                gift_name: msg.gift_name,
                gift_url: `${uploadUrl}/${msg.gift_image_url}`
              },
              type: msg.type
            });
            this.chatList.push(data);
          }
          // 开启问答
          if (msg.type == 'question_answer_open') {
            EventBus.$emit('open_qa');
            console.log(110, msg)
            let data = new Msg({
              nickName: '问答',
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                text_content: `${msg.nick_name}开启了问答`
              },
              type: msg.type
            });
            this.chatList.push(data);
          }
          // 关闭问答
          if (msg.type == 'question_answer_close') {
            EventBus.$emit('close_qa');
            let data = new Msg({
              nickName: '问答',
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                text_content: `${msg.nick_name}关闭了问答`
              },
              type: msg.type
            });
            this.chatList.push(data);
          }
          // 推送问卷
          if (msg.type == 'questionnaire_push') {
            EventBus.$emit('questionnaireCheck', msg.questionnaire_id);
            let text =
              msg.room_role == '3' ? `助理${msg.nick_name}` : msg.room_role == '4' ? `嘉宾${msg.nick_name}` : '主持人';
            let data = new Msg({
              nickName: '问卷',
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                text_content: `${text}发起了问卷`,
                questionnaire_id: msg.questionnaire_id
              },
              roleName: this.roleName,
              type: msg.type
            });
            this.chatList.push(data);
          }
          // 发起签到
          if (msg.type == 'sign_in_push') {
            let text = msg.data.sign_creator_nickname || '主持人';
            let data = new Msg({
              nickName: '签到',
              avatar: '//cnstatic01.e.vhall.com/static/images/watch/system.png',
              content: {
                text_content: `${text}发起了签到`
              },
              type: msg.type
            });
            this.chatList.push(data);
          }
          // console.warn('派发的消息，查看数据类型和数据', msg, msg.type);
          EventBus.$emit(msg.type, msg);
        });
      }
      // 接受加入房间消息
      this.chatSDK.join(msg => {
        if (typeof msg !== 'object') {
          msg = JSON.parse(msg);
        }
        try {
          if (msg.context && typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context);
          }
          if (msg.data && typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }

        console.log('********加入房间消息*********');
        console.log(msg);
        EventBus.$emit(msg.data.type, msg);
        const baseOnlineNumber = sessionStorage.getItem('baseOnlineNumber');
        this.onlineUsers = Number(baseOnlineNumber) + Number(msg.uv);
      });
      // 接受离开房间消息
      this.chatSDK.leave(msg => {
        if (typeof msg !== 'object') {
          msg && (msg = JSON.parse(msg));
        }
        try {
          if (msg.context && typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context);
          }
          if (msg.data && typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }
        console.log('********离开房间消息*********');
        console.log(msg);
        EventBus.$emit(msg.data.type, msg);
        const baseOnlineNumber = sessionStorage.getItem('baseOnlineNumber');
        this.onlineUsers = Number(baseOnlineNumber) + Number(msg.uv);
      });
      // 自定义消息
      this.chatSDK.onCustomMsg((msg) => {
        if (typeof msg !== 'object') {
          msg && (msg = JSON.parse(msg));
        }
        try {
          if (msg.data && typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }
        console.log('********自定义消息*********');
        console.log(msg);
        EventBus.$emit(msg.data.type, msg);
      });
      // @本用户的msgItem元素
      EventBus.$on('scrollElement', (el) => {
        this.showTip = true;
        this.elements.push(el);
        this.tipMsg = this.replyElement ? '有多条未读消息' : '有人@你';
      });
      // 关闭提示
      EventBus.$on('closeTip', () => {
        this.showTip = false;
        this.tipMsg = '';
      });
      // 清空@列表
      EventBus.$on('clearElements', () => {
        this.elements = [];
        this.showTip = false;
        this.tipMsg = '';
        this.replyElement = null;
      });
      // 有人回复本用户
      EventBus.$on('replyMsg', (e) => {
        if (this.userId != e.msg.sendId) return;
        this.showTip = true;
        this.tipMsg = this.elements.length ? '有多条未读消息' : '有人回复你';
        this.replyElement = e.el;
      });

      window.addEventListener('resize', () => {
        this.refresh();
        this.scrollBottom();
      }, true);
    }
  }
};
export default eventMixin;
