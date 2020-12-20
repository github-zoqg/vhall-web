import EventBus from '@/utils/Events';
import { findIndex } from 'lodash';
import { resize } from '../../../../utils/utils';

export const listenEvent = {
  methods: {
    initNotice () {
      if (this.playerType == 'live' || this.roleName != 2) {
        window.chatSDK.onRoomMsg(msg => {
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
          EventBus.$emit(msg.data.type, msg);
        });
      }
    },
    addSocketsListener () {
      console.log(66666666, this.speakerList)
      EventBus.$on('room_kickout', e => {
        console.log('用户被踢出', e);
        if (e.target_id == this.roomInfo.third_party_user_id) {
          this.isKicked = true;
        }
      });
      EventBus.$on('finished', () => {
        this.loading = false;
      });
      // 禁言自己
      EventBus.$on('disable', msg => {
        if (msg.data.target_id == this.roomInfo.third_party_user_id) {
          this.isBanned = true;
        }
      });
      // 取消禁言自己
      EventBus.$on('permit', msg => {
        if (msg.data.target_id == this.roomInfo.third_party_user_id) {
          this.isBanned = false;
        }
      });
      // 全体禁言
      EventBus.$on('disable_all', () => {
        this.allBanned = true;
      });
      // 取消全体禁言true
      EventBus.$on('permit_all', () => {
        this.allBanned = false;
      });

      // 问答开启
      EventBus.$on('question_answer_open', e => {
        this.qaVisible = true;
      });
      // 问答关闭
      EventBus.$on('question_answer_close', e => {
        this.qaVisible = false;
        this.changeTab(0);
      });

      // 互动房间关闭
      EventBus.$on('live_over', e => {
        // this.interactiveShow = false
        this.liveEnded = true;

        console.log('========  room Closed  ===========');
        this.handShow = false;
        this.handDownShow = false;
        this.interactiveShow = false;
        this.videoSizeShow = true;
        // this.$refs.interactive.speakOff(this.roomInfo.third_party_user_id)
      });
      // 直播开始
      EventBus.$on('live_start', e => {
        console.log('========  room Closed  ===========');
        this.liveEnded = false;
      });

      // EventBus.$on('red_envelope_push', msg => {
      //   // 发红包
      //   this.redPacketUuid = msg.red_packet_uuid;
      //   this.redPacketShowBut = false;
      //   setTimeout(() => {
      //     this.redPacketShowBut = true;
      //     this.isHavePacket = true;
      //   }, 300);
      // });
      EventBus.$on('red_envelope_ok', msg => {
        // 发红包
        this.redPacketUuid = msg.red_packet_uuid;
        this.redPacketShowBut = false;
        setTimeout(() => {
          this.redPacketShowBut = true;
          this.isHavePacket = true;
        }, 300);
      });

      EventBus.$on('lottery_submit', msg => {
        console.log('参加抽奖');
        console.log('cnajiaji', this.$refs.lotterySon.prizeShow);
        // this.$refs.lotterySon.prizeShow = true;
      });

      EventBus.$on('lottery_result_notice', msg => {
        this.$refs.lotterySon.endRecive(msg, this.userChatId);
      });

      EventBus.$on('lottery_push', msg => {
        console.log('faqichoujiang', msg);
        this.$refs.lotterySon.startLottery(msg,true);
      });

      // 监听举手上麦
      EventBus.$on('vrtc_connect_open', msg => {
        this.$message.success('您可以举手申请上麦了');
        this.handShow = true;
        this.statusHand = true; // 全部允许举手的状态
      });
      // 监听关闭举手上麦
      EventBus.$on('vrtc_connect_close', msg => {
        console.log('2');
        console.log('eeeeeeeeee', msg);
        this.$message.success('主持人关闭了举手功能');
        this.handShow = false;
        this.statusHand = false; // 全部不允许举手的状态
      });

      // 直播中sdk控制显示隐藏文档
      EventBus.$on('watchDocShow', flag => {
        this.watchDocShow = flag; // true false
        if (flag) {
          this.showDocPlaceholderForSharescreen = false;
        }
        this.setMiniElement(this.watchDocShow ? 'video' : '');
      });

      // 主持人邀请上麦
      EventBus.$on('vrtc_connect_invite', msg => {
        console.log('3');
        if (msg.room_join_id != this.roomInfo.third_party_user_id) {
          return;
        }
        this.getWatchUpperMsg(msg);
      });

      // 问卷推送 TODO: 永正
      EventBus.$on('questionnaire_push', msg => {
        // this.$vhallFetch('checkSurvey', {
        //   survey_id: msg.questionnaire_id,
        //   user_id: this.roomInfo.third_party_user_id,
        //   webinar_id: this.ilId
        // }).then(res => {
        //   if (res.code == 200) {
        //     const time = 1000;
        //     let step = Math.floor(Math.random() * 10);
        //     step = step > 5 ? 5 : step;
        //     console.log('time step', step);
        //     setTimeout(() => {
        //       this.showQA = true;
        //       this.$refs.questions.contentQuestion(msg.questionnaire_id);
        //     }, step * time);
        //   }
        // });
      });
      // 上麦成功
      EventBus.$on('vrtc_connect_success', msg => {
        console.log('5>>>', msg.room_join_id);
        console.log('6>>>', this.roomInfo.third_party_user_id);
        if (msg.room_join_id == this.roomInfo.third_party_user_id) {
          if (this.isDesktop == '1' && this.watchDocShow && this.miniElemt == 'doc') {
            // 桌面共享切大屏
            this.miniElemtChange();
          }
          setTimeout(() => {
            this.handDownShow = true;
            this.handShow = false;
            window.clearInterval(this.timerFun);
          }, 100);
        }
      });
      // 被下麦消息
      EventBus.$on('vrtc_disconnect_success', msg => {
        console.log('观看端被下麦', msg.target_id);

        if (this.roomInfo.third_party_user_id == msg.target_id) {
          this.handDownShow = false;
          this.lowerWheat = true; // 上麦的状态
          this.handSend = '举手上麦';
          window.clearInterval(this.timerFun);
          // 在全部允许举手的状态下进行邀请上麦
          this.statusHand ? (this.handShow = true) : (this.handShow = false);
          setTimeout(() => {
            this.interactiveShow = false;
            // 桌面共享切大屏
            if (this.showDocPlaceholderForSharescreen) { // 如果文档占位框是桌面共享的时候开启的就关闭文档占位框
              if (this.miniElemt == 'video') {
                this.miniElemtChange();
                this.setMiniElement('');
              }
              this.watchDocShow = false;
            }
            console.log(this.isDesktop, this.watchDocShow, this.miniElemt, 'this.miniel');
            if (this.isDesktop == '1' && this.watchDocShow && this.miniElemt == 'video') {
              this.miniElemtChange();
              EventBus.$emit('closeSharescreenOnOffline');
            }
            resize();
          }, 100);
        }
      });

      let liveStopTimer;
      if (!this.isPlayback) {
        // 监听房间在线人数
        EventBus.$on('Join', msg => {
          if (msg.context.role_name == 1) {
            try {
              clearTimeout(liveStopTimer);
            } catch (e) {}
          }
        });
        EventBus.$on('Leave', msg => {
          this.$emit('onlineLeave', msg);
          if (msg.context.role_name == 1 && !msg.context.audience) {
            this.$message.warning({ message: `${this.$t('message.host')}${this.$t('message.hostLeft')}` });
            liveStopTimer = setTimeout(() => {
              // EventBus.$emit('live_over')
            }, 20000);
          }
        });
        EventBus.$on('base_num_update', msg => {
          this.$emit('updateBaseNum', msg);
        });
      }

      // 观众中奖时，在聊天框点击查看中奖信息
      EventBus.$on('lotteryCheck', (msg, userId) => {
        console.log(msg, userId);
        this.$refs.lotterySon.endRecive(msg, userId);
      });

      // 设置主屏幕
      EventBus.$on('vrtc_big_screen_set', e => {
        console.log('mainScreen Change', e.data.room_join_id);

        this.mainScreen = e.data.room_join_id;
      });

      // 观众查看问卷 TODO: 永正
      EventBus.$on('questionnaireCheck', questionnaireId => {
        // this.$vhallFetch('checkSurvey', {
        //   survey_id: questionnaireId,
        //   user_id: this.roomInfo.third_party_user_id,
        //   webinar_id: this.ilId
        // }).then(res => {
        //   if (res.code == 200) {
        //     this.showQA = true;
        //     setTimeout(() => {
        //       this.$refs.questions.chatPreview(questionnaireId, false);
        //     }, 200);
        //   } else {
        //     this.showQA = true;
        //     console.log('checksss>>>>>>>>>>>>>');
        //     setTimeout(() => {
        //       this.$refs.questions.chatPreview(questionnaireId, true);
        //     }, 200);
        //   }
        // });
      });
      // 监听直播开启
      EventBus.$on('startPlay', msg => {
        this.startPlayControl();
        setTimeout(() => {
          this.setMiniElement(this.watchDocShow ? 'video' : '');
        }, 200);
      });
      // //监听设备检测消息
      EventBus.$on('vrtc_connect_device_check', msg => {
        if (msg.room_join_id == this.roomInfo.third_party_user_id && msg.device_status != 1) {
          this.handShow = false;
          this.handDownShow = false;
        }
      });
      // 同意上麦邀请
      EventBus.$on('vrtc_connect_agree', async (msg) => {
        if (msg.room_join_id == this.roomInfo.third_party_user_id) {
          // 更新上麦人员列表
          await this.$fetch('getToolStatus', {
            room_id: this.bizInfo.room_id
          }).then(res => {
            this.mainScreen = res.data.main_screen
            this.speakerList = res.data.speaker_list
          })
          this.handDownShow = true; // 下麦按钮的显示
          this.handShow = false; // 上麦按钮关闭
          this.lowerWheat = true; // 上麦的状态
          this.$fetch('speakOn', { // 上麦接口成功后出发vrtc_connect_success消息，监听到该消息后手动维护speakerList，渲染互动组件 互动组件初始化互动sdk后 执行autorepushstream方法判断该用户是否已上麦，若已上麦就开始推流
            room_id: this.bizInfo.room_id
          }).then(() => {
            this.interactiveShow = true;
            this.loading = true;
            this.wating = false;
            this.timer = null;
            clearTimeout(this.timerFun);
            this.cancelMic = true;
          }).catch(() => {
            this.interactiveShow = false;
            this.handShow = true;
            this.loading = false;
            this.handDownShow = false;
          });
        }
      });

      // 互动连麦- 失败
      EventBus.$on('vrtc_connect_failure', msg => {
        if (msg.room_join_id == this.roomInfo.third_party_user_id) {
          this.wating = false;
          this.timer = null;
          clearTimeout(this.timerFun);
          this.cancelMic = false;
        }
      });

      // 互动连麦- 拒绝
      EventBus.$on('vrtc_connect_refused', msg => {
        if (msg.room_join_id == this.roomInfo.third_party_user_id) {
          this.wating = false;
          this.timer = null;
          clearTimeout(this.timerFun);
        }
      });

      // 布局切换
      EventBus.$on('vhallLayoutExchange', value => {
        this.miniElemt = value;
      });

      // 观看端 - 自动同步主讲人信息
      EventBus.$on('vrtc_speaker_switch', msg => {
        this.$message.success(`${msg.nick_name}${this.$t('message.setHostTips')}`);
      });

      // 结束直播清空上麦列表
      EventBus.$on('live_over', msg => {
        this.speakerList = this.speakerList.filter(item => {
          return item.account_id == this.roomInfo.account_id;
        });
      });

      // 手动维护在线上麦人员列表 - 上线
      EventBus.$on('vrtc_connect_success', e => {
        let check = findIndex(this.speakerList, item => {
          return item.account_id == e.data.room_join_id;
        });

        if (check < 0) {
          console.warn('test----观看端响应到上麦情形---', this.speakerList, e);
          this.speakerList.push({
            account_id: e.data.room_join_id,
            audio: e.data.vrtc_audio_status == 'on' ? 1 : 0,
            nick_name: e.data.nick_name,
            role_name: Number(e.data.room_role),
            video: e.data.vrtc_video_status == 'on' ? 1 : 0
          });
          console.warn('test----观看端响应到上麦情形---', this.speakerList);
        }
      });

      // 手动维护在线上麦人员列表 - 下线
      EventBus.$on('vrtc_disconnect_success', e => {
        console.log('手动维护在线上麦人员列表 - 下线', e);

        console.log('下麦用户ID', e.target_id);
        e.data.target_id &&
          (this.speakerList = this.speakerList.filter(item => {
            return item.account_id != e.target_id;
          }));
      });

      // 切换设备重新推流报错
      EventBus.$on('republisherror', e => {
        if (e.data.error.msg.name == 'NotAllowedError') {
          this.$message.error('设备被禁用导致上麦失败，请检查设备!');
        } else {
          this.$message.error('因设备问题导致上麦失败，请检查设备!');
        }
      });

      // 桌面共享开启
      EventBus.$on('desktopScreenShow', () => {
        const inInteractive = document.querySelector('.vhall-subStream-box ');
        if (inInteractive && !this.watchDocShow) {
          this.watchDocShow = true; // 桌面共享开启时,如果文档未开启并且是上麦状态,开启文档用来展示桌面共享组件
          this.miniElemt = 'video';
          this.showDocPlaceholderForSharescreen = true;
        }
      });
      // 桌面共享 结束
      EventBus.$on('desktopScreenHide', () => {
        const inInteractive = document.querySelector('.vhall-subStream-box');
        if (inInteractive && this.miniElemt == 'video') {
          this.showDocPlaceholderForSharescreen && (this.watchDocShow = false);
          this.showDocPlaceholderForSharescreen && (this.miniElemt = '');
        }
        this.showDocPlaceholderForSharescreen = false;
      });
      // 桌面共享时混流最大化
      EventBus.$on('desktop_open', e => {
        this.isDesktop = '1';
        setTimeout(() => {
          if (!this.interactiveShow && this.watchDocShow) { // 如果是观众上麦之前打开文档,再打开桌面共享,然后上麦的话关闭桌面共享不关闭文档窗口
            this.showDocPlaceholderForSharescreen = false;
          }
          if (this.interactiveShow || !this.watchDocShow) return;
          console.log(this.interactiveShow, this.watchDocShow, this.miniElemt, 'this.watchDocShow2');
          if (this.miniElemt == 'video') {
            this.miniElemtChange();
          }
        }, 4000);
      });

      // 桌面共享时混流最小化
      EventBus.$on('desktop_close', e => {
        this.isDesktop = '0';
        if (this.interactiveShow || !this.watchDocShow) return;
        if (this.miniElemt == 'doc') {
          this.miniElemtChange();
        }
      });
      // 转播结束
      EventBus.$on('live_broadcast_stop', e => {
        this.rebroadcastChannelId = this.roomInfo.channel_id;
      });
      // 清晰度设置
      EventBus.$on('vrtc_definition_set', e => {
        if (e.vrtc_definition) {
          sessionStorage.setItem('speakerDefinition', e.vrtc_definition || '');
        }
      });
      EventBus.$on('open_qa', () => {
        if (!this.chatStatusShow) {
          this.changeTab(2);
        }
      });
      // 设备问题引起的本地流结束事件
      EventBus.$on('EVENT_STREAM_END_ERROR', () => {
        this.streamendErrorPopupVisible = true;
      });
      // 弱网情况重新推流http://wiki.vhallops.com/pages/viewpage.action?pageId=119177504
      EventBus.$on('EVENT_LOCALSTREAM_FAILED', (e) => {
        console.log(e, 'EVENT_LOCALSTREAM_FAILED');
        this.$message.warning('因网络问题推流失败，正在重新推流');
      });
      // 弱网情况重新订阅http://wiki.vhallops.com/pages/viewpage.action?pageId=119177504
      EventBus.$on('EVENT_REMOTESTREAM_FAILED', (e) => {
        console.log(e, 'EVENT_REMOTESTREAM_FAILED');
        if (e.isSharescreen) {
          this.$message.warning(`因网络问题订阅桌面共享失败，正在重新订阅`);
        } else {
          this.$message.warning(`因网络问题订阅用户[${e.nickName}]失败，正在重新订阅`);
        }
      });
      // EVENT_STREAM_STUNK事件
      EventBus.$on('EVENT_STREAM_STUNK', (e) => {
        console.log(e, 'EVENT_STREAM_STUNK');
        this.$message.warning('互动流编码异常，正在重新推流');
      });
      EventBus.$on('disable', (msg) => {
        if (msg.data.target_id == this.roomInfo.third_party_user_id) {
          this.UpperVisible = false;
        }
      });
    }
  }
};
