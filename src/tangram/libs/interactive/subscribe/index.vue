<template>
  <div
    class="vhall-subStream-box"
    ref="sub-videoBox"
    :class="{
      'vhall-server-mainScreen': (mainScreen ==  accountId) && (miniElement == 'doc') && (roleName == 1 || roleName == 4),
      'vhall-mainScreen-top': (mainScreen ==  accountId) && (miniElement == 'doc') && (roleName == 1 || roleName == 4) && (onlineUsers < 2),

      'vhall-mainScreen': (mainScreen ==  accountId) && (miniElement == 'doc' || !miniElement) && (roleName == 2),
      'vhall-miniBox vhall-saas-miniArea': (mainScreen ==  accountId) && ((miniElement == 'video'))
    }"
  >
    <!-- :class="[{'vhall-mainScreen': (mainScreen == accountId) && !isDocShow, 'vhall-miniBox vhall-saas-miniArea': (mainScreen == accountId) && isDocShow}]" -->
    <div class="subcribe-boxs" style="text-align:left" :id="`stream-${accountId}`"></div>
    <div class="disabledVideo-img" v-show="videoStatus"></div>
    <div class="subscribe-failiure" v-show="resubscribeCount >= 3">订阅失败</div>
    <p class="pop-nickName">
       {{ nickName | subString(8)}}
      <span
        class="network-status"
        :class="`network-status${netWorkStatus}`"
      >
      </span>
      <span
        class="iconfont"
        :class="audioStatus ? 'iconicon_maikefengguanbi' : `iconicon_maikefeng_${audioLevel}`"
        style="float:right; font-size:12px"
      ></span>
    </p>

    <!-- 阴影区-->
    <div class="shadow-area"></div>

    <div class="vhall-subStream-box--pophover">
      <!-- 右侧小窗体 区域 -->
      <div class="action-mini-pop" v-if="(mainScreen == accountId)">
        <p v-if="roleName == 1" class="iconcontainer-top">
          <span v-if="role == 1">主持人</span>
          <span v-if="role == 2">观众</span>
          <span v-if="role == 3">助理</span>
          <span v-if="role == 4">嘉宾</span>
          <el-tooltip :content="videoStatus ? '打开摄像头': '关闭摄像头'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('video')"
              :class="videoStatus ? 'iconfont iconicon_shexiangtouguanbi' : 'iconfont iconicon_shexiangtoukaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioStatus ? '打开麦克风': '关闭麦克风'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              class="iconfont"
              :class="audioStatus ? 'iconicon_maikefengguanbi' : `icon-audio-level iconicon_maikefeng_${audioLevel}`"
            ></a>
          </el-tooltip>
          <!-- <a href="javascript:void(0);" style="background:none"></a> -->
        </p>
        <p class="audio-network-status">
          <a
            v-if="roleName == 4"
            href="javascript:void(0);"
            class="iconfont user-audio-status"
            :class="audioStatus ? 'iconicon_maikefengguanbi' : `iconicon_maikefeng_${audioLevel}`"
          ></a>
          <a
            class="network-status"
            :class="`network-status${netWorkStatus}`"
          >
          </a>
        </p>
        <p>
          <span>视图</span>
          <el-tooltip content="切换" placement="bottom">
            <a
              v-if="miniElement && !isFullScreen"
              href="javascript:void(0);"
              class="iconfont iconicon_qiehuan"
              @click="exchange()"
            >
              <!-- 切换 -->
            </a>
          </el-tooltip>
          <el-tooltip :content="isFullScreen ? '关闭全屏': '全屏'" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont"
              :class="{ 'iconicon_quanping': !isFullScreen,'iconicon_quxiaoquanping': isFullScreen }"
              @click="fullScreen()"
            >
              <!-- 全屏 -->
            </a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom">
            <a
              v-if="roleName == 1"
              href="javascript:void(0);"
              class="iconfont iconicon_xiamai"
              @click="speakOff()"
            >
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
      </div>

      <div class="action-mini-pop" v-else>
        <p v-if="roleName == 1">
          <el-tooltip :content="videoStatus ? '打开摄像头': '关闭摄像头'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('video')"
              :class="videoStatus ? 'iconfont iconicon_shexiangtouguanbi' : 'iconfont iconicon_shexiangtoukaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioStatus ? '打开麦克风': '关闭麦克风'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              :class="audioStatus ? 'iconfont iconicon_maikefengguanbi' : 'iconfont iconyinliang'"
            ></a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont iconicon_xiamai"
              @click="speakOff()"
              v-if="roleName != 1"
            >
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
        <p v-if="roleName == 1">
          <el-tooltip content="设为主讲人" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont iconsheweizhujiangren"
              v-show="role == 4 || role == 1"
              @click="setOwner(false)"
            >
              <!-- 设为主讲人 -->
            </a>
          </el-tooltip>
          <el-tooltip content="设为主画面" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont iconsheweizhujiangren"
              v-if="role == 2"
              @click="setMainScreen(false)"
            >
              <!-- 设为主屏 -->
            </a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom">
            <a href="javascript:void(0);" class="iconfont iconicon_xiamai" @click="speakOff()">
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import { calculateAudioLevel, calculateNetworkStatus } from '../../../utils/utils';

export default {
  name: 'Subitem',
  props: {
    sdkInstance: {
      required: true
    },

    roomId: {
      required: true
    },
    onlineUsers: {
      required: true
    },
    accountId: {
      required: true
    },

    role: {
      required: false,
      default: 2
    },

    // 使用者 角色信息
    roleName: {
      required: true
    },

    nickName: {
      required: false
    },

    mainScreen: {
      required: false
    },

    miniElement: {
      required: true
    },
    userInfo: {
      required: true
    },
    isDocShow: {
      required: false
    },
    masterAccountId: {
      required: true // 发起端accountID
    }
  },
  data () {
    return {
      // role: 2, //  用户角色 =  //2 观众  // 1 主持人 // 3 助理 // 4 嘉宾
      $inav_info: null,
      audioStatus: false, // 音频 禁用状态
      videoStatus: false, // 视频 禁用状态
      isFullScreen: false,
      speakOffTimer: null,
      speakOffTime: 5,
      ownerSpeakOff: false,
      streamID: null,
      audioLevel: 1, // 音量
      netWorkStatus: 0, // 网络状态
      resubscribeCount: 0 // 重新订阅次数
    };
  },

  computed: {
    showMainUser () {
      console.log('this. mainScrennn', this.mainScreen, this.accountId);
      if (this.mainScreen == this.accountId) {
        return true;
      } else {
        return false;
      }
    }
  },

  created () {
    this.EventListens();
    // this.splitEvents()
  },

  mounted () {
    console.log(this.userInfo.streamId, 'subscribed streamId');
    this.audioStatus = this.userInfo.audio == '0';
    this.videoStatus = this.userInfo.video == '0';
    this.subStream();
    clearInterval(this.audioLeveInterval);
    this.audioLeveInterval = setInterval(() => {
      // 获取音量
      this.sdkInstance.getAudioLevel({streamId: this.userInfo.streamId}, (level) => {
        this.audioLevel = calculateAudioLevel(level);
      }, () => { this.audioLevel = 0; });
    }, 1000);
    clearInterval(this.netWorkStatusInterval);
    this.netWorkStatusInterval = setInterval(() => {
      // 获取网络状态
      this.sdkInstance.getStreamPacketLoss({streamId: this.userInfo.streamId}, (status) => {
        this.netWorkStatus = calculateNetworkStatus(status);
      }, () => { this.netWorkStatus = 0; });
    }, 2000);
  },

  filters: {
    subString: function (value, length) {
      if (!value) return '';
      return value.length > 8 ? `${value.substring(0, length)}...` : value;
    }
  },

  methods: {

    /**
     *  全屏事件
     */
    fullScreen () {
      let Element = this.$refs['sub-videoBox'];
      if (Element.requestFullscreen && !this.isFullScreen) {
        if (Element.className.split(' ').includes('vhall-saas-miniArea')) {
          Element.className = `${Element.className} vhall-server-mainScreen`;
        }
        Element.requestFullscreen();
        this.isFullScreen = true;
      } else {
        if (Element.className.split(' ').includes('vhall-saas-miniArea')) {
          Element.className = Element.className
            .split(' ')
            .filter(item => {
              return item != 'vhall-server-mainScreen';
            })
            .join(' ');
        }

        document.exitFullscreen && document.exitFullscreen();
        this.isFullScreen = false;
      }
    },

    /**
     * 设为主讲人
     */
    setOwner () {
      EventBus.$emit('SETSPEAKER', {receive_account_id: this.accountId});
    },

    /**
     * 设为主画面
     *
     */
    setMainScreen () {
      const inavInfo = this.sdkInstance.getRoomInfo();
      const desckTop = inavInfo.remote.users.filter((item) => {
        return item.streams.length > 1;
      });
      if (desckTop == 0) {
        this.sdkInstance.setBroadCastScreen(
          {
            mainScreenStreamId: this.userInfo.streamId
          },
          () => {},
          e => { console.log('动态设置主屏失败', e); });
      }
      this.$fetch('setMainScreen', {
        receive_account_id: this.accountId,
        room_id: this.roomId
      });
      this.$fetch('setSpeaker', {
        receive_account_id: this.masterAccountId,
        room_id: this.roomId
      });
    },

    exchange () {
      if (this.miniElement == 'doc') {
        EventBus.$emit('vhallLayoutExchange', 'video');
      } else {
        EventBus.$emit('vhallLayoutExchange', 'doc');
      }

      this.$nextTick(() => {
        // 手动触发window resize 事件
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
      });
    },

    /**
     * 订阅流信息
     *
     * @param {String | undefined}
     * @returns void
     *
     *  */
    async subStream () {
      console.log('流订阅状态', JSON.stringify(this.userInfo));
      this.audioStatus = this.userInfo.audio == '0';
      this.videoStatus = this.userInfo.video == '0';

      document.getElementById(`stream-${this.accountId}`).innerHTML = '';
      let opt = {
        streamId: this.userInfo.streamId,
        videoNode: `stream-${this.accountId}`, // 远端流显示容器，必填
        dual: this.mainScreen == this.accountId ? 1 : 0 // 双流订阅选项，0 为小流，1 为大流 选填。默认为 0
      };

      this.sdkInstance.subscribe(
        opt,
        (e) => {
          console.log('流订阅成功', this.userInfo, e);
          clearInterval(this.resubscribeTimer);
          // 订阅成功后--自动调整。布局样式
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        },
        e => {
          console.log('订阅失败', e);
        }
      );
    },

    muteDevice (device) {
      if (device == 'audio') {
        this.audioStatus = !this.audioStatus;
      } else if (device == 'video') {
        this.videoStatus = !this.videoStatus;
      }
      // 通过 VSS 禁用 未成功
      let muteDevice;
      let status;
      if (device == 'audio') {
        muteDevice = 1;
        status = this.audioStatus ? 0 : 1;
      } else if (device == 'video') {
        muteDevice = 2;
        status = this.videoStatus ? 0 : 1;
      }
      this.$fetch('setRoomDevice', {
        room_id: this.roomId,
        receive_account_id: this.accountId,
        device: muteDevice,
        status: status,
      })
    },

    speakOff () {
      // 发送下麦消息
      this.$fetch('speakUserOff', {
        room_id: this.roomId,
        receive_account_id: this.accountId
      });
    },

    EventListens () {
      // 下麦 消息 - 响应处理
      EventBus.$on('vrtc_disconnect_success', e => {
        if (this.accountId == e.target_id) {
          try {
            clearInterval(this.speakOffTimer);
          } catch (e) {
          }
        }
      });

      // 设置主讲人 消息 - 响应处理
      EventBus.$on('vrtc_speaker_switch', e => {});

      // // 视频禁用
      EventBus.$on('vrtc_frames_forbid', e => {
        if (this.accountId == e.room_join_id) {
          this.videoStatus = true;

          // EventBus.$emit('sendCmdToShadow', e)
        }
      });

      // 视频取消禁用
      EventBus.$on('vrtc_frames_display', e => {
        if (this.accountId == e.room_join_id) {
          this.videoStatus = false;
          // EventBus.$emit('sendCmdToShadow', e)
        }
      });

      // 音频禁用
      EventBus.$on('vrtc_mute', e => {
        if (this.accountId == e.room_join_id) {
          // EventBus.$emit('sendCmdToShadow', e)
          this.audioStatus = true;
        }
      });

      // 音频取消禁用
      EventBus.$on('vrtc_mute_cancel', e => {
        if (this.accountId == e.room_join_id) {
          // EventBus.$emit('sendCmdToShadow', e)
          this.audioStatus = false;
        }
      });

      // 全体静音
      // 流静音 响应事件 -
      this.sdkInstance.on(VhallRTC.EVENT_REMOTESTREAM_MUTE, (e) => {
        console.log('远端流静音', e);
      });

      // 远端流 失败
      this.sdkInstance.on(VhallRTC.EVENT_REMOTESTREAM_FAILED, (e) => {
        console.log('tangrma log info::', e, this.userInfo.streamId);
        // 远端流 失败之后，进行取消订阅在重新订阅
        if (e.data.stream.getID() == this.userInfo.streamId && this.resubscribeCount < 3) {
          EventBus.$emit('EVENT_REMOTESTREAM_FAILED', {nickName: this.userInfo.nick_name || this.userInfo.nickName, isSharescreen: false});
          clearInterval(this.resubscribeTimer);
          this.resubscribeTimer = setInterval(() => {
            this.subStream();
            this.resubscribeCount = this.resubscribeCount + 1;
            if (this.resubscribeCount >= 3) {
              clearInterval(this.resubscribeTimer);
            }
          }, 3000);
        }
      });
      // 直播结束
      EventBus.$on('live_over', e => {
        this.resubscribeCount = 0;
      });
      // 直播开始
      EventBus.$on('live_start', e => {
        this.resubscribeCount = 0;
      });
      /**
       *  监听退出全屏事件
       */
      window.addEventListener(
        'fullscreenchange',
        e => {
          // console.error('subscribe',document.fullscreenElement)
          if (document.fullscreenElement) {
            // 进入全屏
          } else {
            // 离开全屏
            let Element = this.$refs['sub-videoBox'];
            if (Element.className.split(' ').includes('vhall-saas-miniArea')) {
              Element.className = Element.className
                .split(' ')
                .filter(item => {
                  return item != 'vhall-server-mainScreen';
                })
                .join(' ');
            }
            this.isFullScreen = false;
          }
        },
        true
      );
    }
  },

  beforeDestroy () {
    clearInterval(this.speakOffTimer);
    this.speakOffTime = 20;
  },

  destroyed () {
  }
};
</script>

<style lang="less">
.vhall-saas-miniArea{
  .pop-nickName{
    &>.iconfont{
      font-size: 14px !important;
    }
    padding-left: 10px !important;
    padding-right: 10px !important;
    height: 28px !important;
  }
}
.audio-network-status {
  display: none;
}
.vhall-server-mainScreen {
    .pop-nickName{
      &>.iconfont{
        display: none !important;
      }
      &>.network-status{
        display: none !important;
      }
    }
  .shadow-area{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 168px;
    background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.7) 100%);
    z-index: 2;
  }
  .user-audio-status{
    display: inline-block !important;
  }
  .vhall-subStream-box {
    &--pophover {
      p {
        a {
          background: transparent;
        }
        span {
          display: inline-block;
        }
      }
      .action-mini-pop {
        margin: auto;
      }
    }
  }
}
.vhall-subStream-box {
  position: relative;
  height: 100%;
  min-height: 120px;
  width: 160px;
  .disabledVideo-img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(../../../assets/no_video_bg.png) center no-repeat #2d2d2d;
    background-size: 400px;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .subscribe-failiure {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgb(45, 45, 45);
    color: wheat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .subcribe-boxs {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    &>div{
      & > .licode_stream{
        height: 100% !important;
        width: 100% !important;
        position: initial !important;
        top: initial !important;
        left: initial !important;
      }
    }
  }

  .pop-nickName {
    position: absolute;
    z-index: 3;
    bottom: 0;
    text-align: left;
    font-size: 12px;
    padding-left: 6px;
    padding-right: 6px;
    line-height: 24px;
    height: 25px;
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
      background-image: url(../../../assets/images/common/network2.png);
    }
    &>.network-status1{
      background-image: url(../../../assets/images/common/network1.png);
    }
    &>.network-status0{
      background-image: url(../../../assets/images/common/network0.png);
    }
  }

  &--pophover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 3;
    display: none;
    p {
      &.iconcontainer-top {
        text-align: left;
      }
      line-height: 40px;
      flex: 1;
      color: #fff;
      margin-right: -10px;
      a {
        text-align: center;
        display: inline-block;
        color: #fff;
        font-size: 16px;
        width: 32px;
        height: 32px;
        line-height: 32px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 100%;
        margin-right: 10px !important;
        &:hover {
          background: #fc5659;
        }
        &.iconsheweizhujiangren {
          font-size: 14px;
        }
        // &.iconyinliangjinyong {
        //   font-size: 15px;
        // }
        // &.icon-audio-level {
        //   font-size: 15px;
        // }
        &.user-audio-status{
          display:none;
          background: transparent;
          cursor: initial
        }
      }
      span {
        text-align: center;
        display: inline-block;
        text-align: right;
        width: 54px;
        font-size: 12px;
        margin-right: 10px !important;
      }
    }

    .action-mini-pop {
      margin: auto;
    }
  }
  &:hover {
    .vhall-subStream-box--pophover {
      display: flex;
    }
  }
}

.vhall-server-mainScreen {
  .vhall-subStream-box--pophover {
    .audio-network-status {
      display: inline;
      text-align: center;
      &>.network-status{
      display: inline-block;
      vertical-align: middle;
      background-size: 50% !important;
      margin-top: -3px;
      }
      &>.network-status2{
        background: url(../../../assets/images/common/network2.png) no-repeat center;
      }
      &>.network-status1{
        background: url(../../../assets/images/common/network1.png) no-repeat center;
      }
      &>.network-status0{
        background: url(../../../assets/images/common/network0.png) no-repeat center;
      }
    }
    display: block;
    top: auto;
    bottom: 10px;
    z-index: 3;
    background: none;
    p {
      display: inline;
      text-align: center;
    }
  }
  &>.pop-nickName{
      padding-left: 10px !important;
      padding-right: 10px !important;
      height: 40px !important;
      &>.iconfont{
        font-size: 14px !important;
      }
    }
}
</style>
