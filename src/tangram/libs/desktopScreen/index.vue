<template>
  <div id="vhall-subcribe-screen" v-show="this.streamId || this.showBox">
    <p class="network-audio-status" v-show="streamId != 'shareUser' && !splited">
      <span
        class="network-status"
        :class="`network-status${netWorkStatus}`"
      >
      </span>
      <span
        class="iconfont"
        :class="`iconicon_maikefeng_${audioLevel}`"
        style="float:right; font-size:12px"
      ></span>
    </p>
    <div class="vhall-split-img" v-if="splited"></div>
    <div class="tips-box" v-show="streamId == 'shareUser'">
      <i class="iconfont iconzhuomiangongxiang1"></i><br>
      <p>
        桌面共享中...
      </p>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import { calculateNetworkStatus, calculateAudioLevel } from '../../utils/utils';

export default {
  props: {
    ownerId: {
      required: true
    },

    roleName: {
      required: true
    },

    splited: {
      required: false,
      default: false
    },
    interactiveShow: {
      required: false // 观看端判断是否要现实桌面共享组件
    }
  },

  data () {
    return {
      showBox: false,
      $SDKINSTANCE: null,
      streamId: null,
      audioLevel: 0, // 音量
      netWorkStatus: 0 // 网络状态
    };
  },

  watch: {
    streamId (val) {
      EventBus.$emit('sendCmdToHost', {
        type: 'screenShare',
        streamId: this.streamId
      });
    }
  },

  created () {
    console.log('房主ID', this.ownerId);
  },

  mounted () {
    this.addEventListener();
  },

  methods: {
    addEventListener () {
      EventBus.$on('deviceSuccess', (msg) => {
        if (msg.type == 'permissionCheck' && this.roleName != 3 && this.roleName != 2) {
          this.subscribeDeskTop();
        }
      });
      EventBus.$on('streamPushed', (e) => {
        if (this.roleName == 2) {
          this.subscribeDeskTop();
        }
      });
      EventBus.$on('desktop_open', () => {
        this.interactiveShow && (this.showBox = true);
      });

      EventBus.$on('desktop_close', () => {
        this.showBox = false;
        this.streamId = '';
      });

      EventBus.$on('sdkReady', (e) => {
        this.$SDKINSTANCE = e.vhallrtc;
        this.addSDKEvents();
      });

      EventBus.$on('sharescreenstart', () => {
        console.log('我开启了桌面共享哦！！');
        this.streamId = 'shareUser';
      });

      EventBus.$on('sharescreenstop', () => {
        this.streamId = '';
      });

      EventBus.$on('INTERACT_SHADOW_MSG', (e) => {
        console.log('分屏桌面共享消息', e);

        if (e.type == 'screenShare') {
          this.streamId = e.streamId;
        }
      });
      EventBus.$on('closeSharescreenOnOffline', () => {
        this.showBox = false;
        this.streamId = '';
      });
    },

    addSDKEvents () {
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_ADD, (e) => {
        // { e.type， 流类行 }
        // 0: 纯音频, 1: 只是视频, 2: 音视频  3: 屏幕共享, 4: 插播
        console.log('订阅视频互动流-桌面共享流 或者 插播流', e);
        if (e.data.streamType == 3 || e.data.streamType == 4) {
          this.streamId = e.data.streamId;

          let opt = {
            streamId: e.data.streamId,
            videoNode: 'vhall-subcribe-screen', // 远端流显示容器，必填
            mute: {audio: false, video: false} // 是否静音，关视频。选填 默认false
          };

          this.$SDKINSTANCE.subscribe(opt, () => {
            console.log('桌面共享流订阅成功', e.data.streamId);
            EventBus.$emit('desktopScreenShow');
            clearInterval(this.audioLeveInterval);
            this.audioLeveInterval = setInterval(() => {
              // 获取音量
              this.$SDKINSTANCE.getAudioLevel({streamId: this.streamId}, (level) => {
                this.audioLevel = calculateAudioLevel(level);
              }, () => { this.audioLevel = 0; });
            }, 1000);
            clearInterval(this.netWorkStatusInterval);
            this.netWorkStatusInterval = setInterval(() => {
              // 获取网络状态
              this.$SDKINSTANCE.getStreamPacketLoss({streamId: this.streamId}, (status) => {
                this.netWorkStatus = calculateNetworkStatus(status);
              }, () => { this.netWorkStatus = 0; });
            }, 2000);
          }, (e) => {
            console.log('订阅失败', e);
          });
        }
      });

      // 桌面共享 流结束
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_REMOVED, (e) => {
        if (e.data.streamId == this.streamId) {
          this.streamId = '';
          EventBus.$emit('desktopScreenHide');
        }
      });

      // // 流播放失败 -- 再次订阅
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_FAILED, (e) => {
        if (e.data.stream.getID() == this.streamId) { // 解决15081
          console.log('tangram log info:: stream error info desktop 111111111111111111111111111111', e, e.data.stream.getID(), this.streamId);
          this.$nextTick(() => { EventBus.$emit('EVENT_REMOTESTREAM_FAILED', {isSharescreen: true}); });
          clearInterval(this.resubscribeTimer);
          this.resubscribeTimer = setInterval(() => {
            let opt = {
              streamId: this.streamId,
              videoNode: 'vhall-subcribe-screen', // 远端流显示容器，必填
              mute: { audio: false, video: false } // 是否静音，关视频。选填 默认false
            };
            this.$SDKINSTANCE.subscribe(opt, () => {
              clearInterval(this.resubscribeTimer);
              EventBus.$emit('desktopScreenShow');
              console.log('桌面共享流订阅成功', e.data.stream);
              EventBus.$emit('sendCmdToHost', {
                type: 'screenShare',
                streamId: this.streamId
              });
            }, (e) => {
              console.log('订阅失败', e);
            });
          }, 3000);
        }
      });
    },

    subscribeDeskTop () {
      const inavInfo = this.$SDKINSTANCE.getRoomInfo();
      console.log('刷新重新订阅- 房间桌面共享流', inavInfo);
      const owner = inavInfo.remote.users.find((item) => {
        return item.streams.length > 1 && item.streams.some((stream) => {
          return (stream.streamType == 3 || stream.streamType == 4);
        });
      });
      if (!owner) return;
      const desktopStream = owner.streams.find((stream) => {
        return (stream.streamType == 3 || stream.streamType == 4);
      });
      this.streamId = desktopStream.streamId;
      let opt = {
        streamId: this.streamId,
        videoNode: 'vhall-subcribe-screen', // 远端流显示容器，必填
        mute: { audio: false, video: false } // 是否静音，关视频。选填 默认false
      };
      this.$SDKINSTANCE.subscribe(opt, () => {
        EventBus.$emit('desktopScreenShow');
        console.log('桌面共享流订阅成功', this.streamId);
        EventBus.$emit('sendCmdToHost', {
          type: 'screenShare',
          streamId: this.streamId
        });
        clearInterval(this.audioLeveInterval);
        this.audioLeveInterval = setInterval(() => {
          // 获取音量
          this.$SDKINSTANCE.getAudioLevel({streamId: this.streamId}, (level) => {
            this.audioLevel = calculateAudioLevel(level);
          }, () => { this.audioLevel = 0; });
        }, 1000);
        clearInterval(this.netWorkStatusInterval);
        this.netWorkStatusInterval = setInterval(() => {
          // 获取网络状态
          this.$SDKINSTANCE.getStreamPacketLoss({streamId: this.streamId}, (status) => {
            this.netWorkStatus = calculateNetworkStatus(status);
          }, () => { this.netWorkStatus = 0; });
        }, 2000);
      }, (e) => {
        console.log('订阅失败', e);
      });
    }
  },

  destroyed () {
    this.$SDKINSTANCE = null;
  }
};
</script>
<style lang="less">
  #vhall-subcribe-screen{
    z-index: 3;
    .vhall-split-img{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url(//cnstatic01.e.vhall.com/static/images/interact/class-video3@2x.png) center no-repeat #2d2d2d;
      background-size: 98px 64px;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    width: 100%;
    height: 100%;
    background: #2d2d2d;
    position: relative;
    .tips-box {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 400px;
      height: 220px;
      i {
        font-size: 137px;
        display: block;
        color: #999;
        width: 100%;
      }
      p{
        text-align: center;
        font-size: 16px;
        color: #999;
      }
    }
    .licode_player{
      position: absolute;
      top: 0px;
    }
    &>.network-audio-status{
      position: absolute;
      z-index: 3;
      bottom: 0;
      text-align: left;
      font-size: 12px;
      padding-left: 10px;
      padding-right: 10px;
      line-height: 24px;
      width: 100%;
      color: #fff;
      left: 0;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &>.network-status{
        float: right;
        height: 16px;
        width: 16px;
        margin-left: 5px;
        margin-top: 3px;
        background-size: contain;
      }
      &>.network-status2{
        background-image: url(../../assets/images/common/network2.png);
      }
      &>.network-status1{
        background-image: url(../../assets/images/common/network1.png);
      }
      &>.network-status0{
        background-image: url(../../assets/images/common/network0.png);
      }
    }
  }
</style>
