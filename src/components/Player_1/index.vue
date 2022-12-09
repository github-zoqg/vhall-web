<template>
  <div>
    <div :id="nodeId" class="vh-player"></div>
  </div>
</template>
<script>
  /**
   * 播放器组件
   * @author junyuan.cao
   * @component
   */
  export default {
    name: 'player',
    props: {
      /**
       * 传递给播放器的参数，和默认参数合并
       */
      playerParams: {
        type: Object,
        default: () => ({}),
        required: false
      },
      /**
       * 是否显示弹幕
       *
       */
      showBarrage: {
        type: Boolean,
        default: false,
        required: false
      },
      /**
       * 房间id
       */
      roomId: {
        required: true,
        type: String
      },
      /**
       * 用户昵称
       */
      nickName: {
        required: true,
        type: String
      },
      /**
       * 应用ID
       */
      appId: {
        required: true,
        type: String
      },
      /**
       * 用户ID
       */
      accountId: {
        type: [String, Number],
        required: true
      },
      /**
       * pass_access_token
       */
      token: {
        type: String,
        required: true
      },
      /**
       * 直播类型，直播 live ,回放 vod
       */
      type: {
        required: false,
        type: String,
        default: 'live'
      },
      /**
     * 直播时需要传递的参数，默认为false,直播时需传值。type为直播流类型，可选值有 hls | flv；roomId为房间id,defaultDefinition为默认清晰度，非必填，默认480p,支持same, 720p,480p,360p,a。
    }
     *
     *
     */
      liveOption: {
        type: [Boolean, Object],
        required: false
      },
      /**
       * 回放时需要传递的参数,默认为false,回放时需传值。recordId为回放ID,defaultDefinition为默认清晰度，非必填，默认480p,支持same, 720p,480p,360p,a。
       */
      vodOption: {
        type: Object,
        required: false
      },
      /**
       * 开启播放器自带UI
       */
      openPlayerUI: {
        type: Boolean,
        required: false,
        default: true
      },
      /**
       * 是否开启跑马灯
       */
      openScrollText: {
        required: false,
        type: Boolean,
        default: false
      },
      /**
       * node id
       */
      nodeId: {
        type: String,
        default: 'vh-player'
      },
      /**
       * 是否自动播放
       */
      autoPlay: {
        type: Boolean,
        default: true,
        required: false
      }
    },

    data() {
      return {};
    },
    async mounted() {
      try {
        if (this.openScrollText) {
          await this.getScrollTextInfo();
        }
        await this.initSDK();
        if (this.showBarrage) {
          this.openBarrage();
        } else {
          this.closeBarrage();
        }
      } catch (e) {
        console.log(e);
      }
    },
    methods: {
      getScrollTextInfo() {
        return new Promise(resolve => {
          this.$vhallFetch('getScrollTextInfo', {
            room_id: this.roomId
          }).then(res => {
            if (!res.data) {
              this.scrollText = null;
            } else {
              this.scrollText = res.data;
            }
            resolve();
          });
        });
      },

      initSDK() {
        let params = {
          appId: this.appId, // 应用ID，必填
          accountId: this.accountId, // 第三方用户ID，必填
          token: this.token, // access_token，必填
          videoNode: this.nodeId,
          language: 'zh',
          type: this.type // live 直播  vod 点播  必填
        };
        Object.assign(params, this.playerParams);
        if (this.liveOption && this.type == 'live') {
          params.liveOption = Object.assign({}, this.liveOption, {
            roomId: this.roomId
          });
        } else if (this.type === 'vod' && this.vodOption) {
          params.vodOption = this.vodOption;
        } else {
          throw new Error('参数异常');
        }
        if (this.scrollText && this.scrollText.status == 1) {
          // 跑马灯
          params.marqueeOption = {
            enable: true,
            text:
              this.scrollText.text_type == 2
                ? `${this.scrollText.text}${this.nickName}${this.accountId}`
                : this.scrollText.text, // 跑马灯的文字
            alpha: this.scrollText.alpha, // 透明度,100完全显示,0 隐藏
            size: this.scrollText.size, // 文字大小
            color: this.scrollText.color, // 文字颜色
            interval: this.scrollText.interval, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
            speed: this.scrollText.speed, // 跑马灯移动速度:3000快,6000中,10000慢
            position: this.scrollText.position // 跑马灯位置 , 1 随机 2上,3中 4下
          };
        }
        console.log('初始化播放器参数', params);
        return new Promise((resolve, reject) => {
          window.VhallPlayer.createInstance(
            params,
            event => {
              console.log('初始化播放器成功');
              window.vhallPlayer = this.$PLAYER = event.vhallplayer;
              !this.autoPlay && this.$PLAYER.pause();
              this.$PLAYER.openControls(false);
              this.$PLAYER.openUI(this.openPlayerUI);
              if (this.type == 'live') {
                resolve();
                this.$EventBus.$emit('component_playerSDK_ready');
              } else {
                this.$PLAYER.on(window.VhallPlayer.LOADED, () => {
                  resolve();
                  this.$EventBus.$emit('component_playerSDK_ready');
                });
              }
              this.$EventBus.$emit('markPoints', event.markPoints);
            },
            e => {
              reject(e);
            }
          );
        });
      },

      /**
       * 开启弹幕
       */
      openBarrage() {
        this.$PLAYER && this.$PLAYER.openBarrage();
      },
      /**
       * 关闭弹幕
       */
      closeBarrage() {
        this.$PLAYER && this.$PLAYER.closeBarrage();
      },
      /**
       * 发送弹幕
       */
      addBarrage(text) {
        this.$PLAYER &&
          this.$PLAYER.addBarrage(text, e => {
            console.log(e, '添加弹幕失败');
          });
      },
      /**
       * 开启浏览器播放器UI
       */
      openControls(boolean) {
        this.$PLAYER && this.$PLAYER.openControls(boolean);
      },
      /**
       * 开启/关闭sdk播放器自带UI
       */
      openUI(boolean) {
        this.$PLAYER && this.$PLAYER.openUI(boolean);
      }
    },
    beforeDestroy() {
      this.$PLAYER && this.$PLAYER.destroy();
    }
  };
</script>
<style lang="less">
  .vh-player {
    overflow: hidden;
  }
</style>
