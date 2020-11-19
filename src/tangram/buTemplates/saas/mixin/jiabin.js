import EventBus from '@/utils/Events';
export default {
  data () {
    return {
      isApplying: false,
      applyWating: false,
      applyTimer: null,
      applyTimerCount: 30
    };
  },

  mounted () {
    this.applyEventListener();
    this.throttle = true;
  },

  methods: {
    // 嘉宾上麦
    applyMic () {
      if (!this.throttle) { // 4秒后才可点击
        return;
      }
      this.throttle = false;
      setTimeout(() => {
        this.throttle = true;
      }, 4000);
      if (this.isApplying) {
        console.log('分屏 状态', this.splitStatus);
        if (this.splitStatus == 2) {
          this.$refs.interactive.speakOff();
          this.isApplying = false;
        } else {
          // 分屏上麦
          EventBus.$emit('splitSpeakOff');
          this.isApplying = false;
        }
        return;
      }

      if (this.applyWating) {
        this.$vhallFetch('cancleApply', {
          room_id: this.roomInfo.room_id
        }).then(res => {
          this.isApplying = false;
          // 结束倒计时
          this.applyWating = false;
          this.applyTimerCount = null;
          clearTimeout(this.applyTimer);
        });
        return;
      }

      if (this.applyWating || this.isApplying) {
        return;
      }

      this.$vhallFetch('apply', {
        room_id: this.roomInfo.room_id
      }).then(res => {
        this.applyWating = true;
        this.applyTimerCount = 30;
        this.applyTimer = setInterval(() => {
          this.applyTimerCount = this.applyTimerCount - 1;
          if (this.applyTimerCount == 0) {
            this.$message.warning({ message: `主持人拒绝了您的上麦请求` });
            clearInterval(this.applyTimer);
            this.applyWating = false;
            this.isApplying = false;
            this.$vhallFetch('cancleApply', {
              room_id: this.roomInfo.room_id
            });
          }
        }, 1000);
      });
    },

    applyEventListener () {
      // 禁言自己
      EventBus.$on('disable', (msg) => {
        if (msg.data.target_id == this.third_party_user_id) {
          this.isBanned = true;
        }
      });
      // 取消禁言自己
      EventBus.$on('permit', (msg) => {
        if (msg.data.target_id == this.third_party_user_id) {
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
      // 同意互动连麦
      EventBus.$on('vrtc_connect_agree', e => {
        if (e.room_join_id == this.roomInfo.third_party_user_id) {
          if (this.splitStatus == 2) {
            this.$nextTick(() => {
              this.$refs.interactive.speakOn().then(() => {
                this.isApplying = true;
                // 结束倒计时
                this.applyWating = false;
                this.applyTimerCount = null;
                clearTimeout(this.applyTimer);
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                });
              }).catch((e) => {
                this.isApplying = false;
                // 结束倒计时
                this.applyWating = true;
                this.applyTimerCount = null;
                clearTimeout(this.applyTimer);
                this.$message.error('上麦失败');
              });
            });
          } else {
            this.$nextTick(() => {
              this.isApplying = true;
              // 结束倒计时
              this.applyWating = false;
              this.applyTimerCount = null;
              clearTimeout(this.applyTimer);
            });
            // EventBus.$emit('splitSpeakOn')
          }
        }
      });

      // 互动连麦- 失败
      EventBus.$on('vrtc_connect_failure', e => {
        if (e.room_join_id == this.roomInfo.third_party_user_id) {
          this.applyWating = false;
          this.applyTimerCount = null;
          clearTimeout(this.applyTimer);
        }
      });

      // 互动连麦- 拒绝
      EventBus.$on('vrtc_connect_refused', e => {
        if (e.room_join_id == this.roomInfo.third_party_user_id) {
          this.applyWating = false;
          this.isApplying = false;
          this.applyTimerCount = null;
          clearTimeout(this.applyTimer);
        }
      });

      // 主持人邀请上麦
      EventBus.$on('vrtc_connect_invite', msg => {
        if (msg.room_join_id != this.roomInfo.third_party_user_id) {
          return;
        }

        try {
          this.getWatchUpperMsg();
        } catch (e) {
          console.log('分屏跳过上麦邀请');
        }
      });

      // 被下麦消息
      EventBus.$on('vrtc_disconnect_success', (e) => {
        if (e.data.target_id == this.roomInfo.third_party_user_id) {
          this.isApplying = false;
        }
      });
      // 直播结束后- 自动切换，下麦操作
      EventBus.$on('live_over', (e) => {
        this.isApplying = false;
      });

      EventBus.$on('room_kickout', e => {
        console.log('用户被踢出', e);
        if (e.target_id == this.roomInfo.third_party_user_id) {
          this.isKicked = true;
          // this.$message({
          //   type: 'warning',
          //   message: '您已经被踢出房间'
          // })
        }
      });
      // 被禁言后隐藏邀请上麦弹框
      EventBus.$on('disable', (msg) => {
        if (msg.data.target_id == this.roomInfo.third_party_user_id) {
          this.UpperVisible = false;
        }
      });
    }
  }
};
