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
    <div class="vhall-split-img"></div>
    <p class="pop-nickName">
      {{ userInfo.nick_name }}
      <span
        class="iconfont iconyinliangjinyong"
        style="float:right; font-size:12px"
        v-if="audioStatus"
      ></span>
    </p>

    <div class="vhall-subStream-box--pophover">
      <!-- 右侧小窗体 区域 -->
      <div class="action-mini-pop" v-if="(mainScreen == accountId)">
        <p v-if="roleName == 1">
          <span v-if="role == 1">主持人</span>
          <span v-if="role == 2">观众</span>
          <span v-if="role == 3">助理</span>
          <span v-if="role == 4">嘉宾</span>
          <el-tooltip :content="videoStatus ? '打开摄像头': '关闭摄像头'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('video')"
              :class="videoStatus ? 'iconfont iconshexiangtouguanbi' : 'iconfont iconshexiangtou_kaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioStatus ? '打开麦克风': '关闭麦克风'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              :class="audioStatus ? 'iconfont iconyinliangjinyong' : 'iconfont iconyinliang'"
            ></a>
          </el-tooltip>
          <a href="javascript:void(0);" style="background:none" v-if="role != 1"></a>
        </p>
        <p>
          <span>视图</span>
          <el-tooltip content="切换" placement="bottom">
            <a
              v-if="miniElement"
              href="javascript:void(0);"
              class="iconfont iconfuzhi"
              @click="exchange()"
            >
              <!-- 切换 -->
            </a>
          </el-tooltip>
          <el-tooltip :content="isFullScreen ? '关闭全屏': '全屏'" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont"
              :class="{ 'iconquanping': !isFullScreen,'iconquanpingguanbi': isFullScreen }"
              @click="fullScreen()"
            >
              <!-- 全屏 -->
            </a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom">
            <a
              v-if="roleName == 1 && role!= 1"
              href="javascript:void(0);"
              class="iconfont iconjushoujinyong"
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
              :class="videoStatus ? 'iconfont iconshexiangtouguanbi' : 'iconfont iconshexiangtou_kaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioStatus ? '打开麦克风': '关闭麦克风'" placement="top">
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              :class="audioStatus ? 'iconfont iconyinliangjinyong' : 'iconfont iconyinliang'"
            ></a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom">
            <a
              href="javascript:void(0);"
              class="iconfont iconjushoujinyong"
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
          <el-tooltip content="设为主屏" placement="bottom">
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
            <a href="javascript:void(0);" class="iconfont iconjushoujinyong" @click="speakOff()">
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

export default {
  props: {
    sdkInstance: {
      required: false
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
      streamID: null
    };
  },

  created () {
    this.EventListens();
  },

  mounted () {
    this.subStream();
  },

  methods: {
    /**
     *  全屏事件
     * @function void -  点击进入全屏
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
     * @function void
     */
    setOwner () {
      this.$vhallFetch('setMainScreen', {
        receive_account_id: this.accountId,
        room_id: this.roomId
      });

      this.$vhallFetch('setSpeaker', {
        receive_account_id: this.accountId,
        room_id: this.roomId
      });

    },

    /**
     * 设为主画面、
     *
     * @function void
     *
     */
    setMainScreen () {
      this.$vhallFetch('setMainScreen', {
        receive_account_id: this.accountId,
        room_id: this.roomId
      });
      this.$vhallFetch('setSpeaker', {
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
      console.log('流订阅状态', this.userInfo.status);
      if (!this.userInfo.streamId) {
        return;
      }

      this.audioStatus = this.userInfo.audio == '0';
      this.videoStatus = this.userInfo.video == '0';

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
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

      this.$vhallFetch('muteDevic', {
        room_id: this.roomId,
        device: muteDevice,
        status: status,
        account_Id: this.accountId,
        receive_account_id: this.accountId
      });
    },

    speakOff () {
      // 发送下麦消息
      this.$vhallFetch('speakOff', {
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

      // 视频禁用
      EventBus.$on('vrtc_frames_forbid', e => {
        if (this.accountId == e.room_join_id) {
          this.videoStatus = true;
        }
      });

      // 视频取消禁用
      EventBus.$on('vrtc_frames_display', e => {
        if (this.accountId == e.room_join_id) {
          this.videoStatus = false;
        }
      });

      // 音频禁用
      EventBus.$on('vrtc_mute', e => {
        if (this.accountId == e.room_join_id) {
          this.audioStatus = true;
        }
      });

      // 音频取消禁用
      EventBus.$on('vrtc_mute_cancel', e => {
        if (this.accountId == e.room_join_id) {
          this.audioStatus = false;
        }
      });

      /**
       *  监听退出全屏事件
       */
      window.addEventListener(
        'fullscreenchange',
        e => {
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

  },

  destroyed () {
    clearInterval(this.speakOffTimer);
    this.speakOffTime = 20;
  }
};
</script>

<style lang="less">
.vhall-subStream-box {
  position: relative;
  height: 100%;
  min-height: 120px;
  width: 160px;
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
    padding-left: 15px;
    padding-right: 15px;
    line-height: 24px;
    width: 100%;
    color: #fff;
    left: 0;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
      text-align: center;
      line-height: 40px;
      flex: 1;
      color: #fff;
      a {
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
      }
      span {
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
  &:hover {
    .vhall-subStream-box--pophover {
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
  }
}
</style>
