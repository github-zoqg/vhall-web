<template>
  <div
    class="vhall-subStream-box"
    ref="sub-videoBox"
    v-show="isPushed"
    :class="{
      'vhall-server-mainScreen': (mainScreen ==  accountId) && (miniElement == 'doc') && (roleName == 1 || roleName == 4),
      'vhall-mainScreen-top': (mainScreen ==  accountId) && (miniElement == 'doc') && (roleName == 1 || roleName == 4) && (streamLength < 2) ,
      'vhall-mainScreen': (mainScreen ==  accountId) && (miniElement == 'doc' || miniElement == '') && (roleName == 2),
      'vhall-miniBox vhall-saas-miniArea': (mainScreen ==  accountId) && (miniElement == 'video')
    }"
  >
    <div
      id="interactive-wrap--media"
      style="width:0; height:0; oveflow: hidden; position:relative;"
    ></div>
    <div class="subcribe-boxs" :id="`stream-${accountId}`"></div>
    <div class="disabledVideo-img" v-show="videoMuteStatus && layout !=2"></div>
    <div class="publish-failiure" v-show="republishCount >= 3">推流失败</div>
    <!-- 主持人 - 直播未开始 ， 音频直播 ， 音频直播 结束 遮罩图 -->
    <div
      :class="status == 1 ? 'audio-img':'audio-img--beforestart'"
      v-show="layout == 1 || videoToAudio"
      v-if="roleName == 1"
    >
      <div class="voicebg">
        <span></span>
      </div>
    </div>

    <p class="pop-nickName">
      {{ nickName | subString(8)}}
      <span
        class="network-status"
        :class="`network-status${netWorkStatus}`"
      >
      </span>
      <span
        class="iconfont"
        :class="audioMuteStatus ? 'iconicon_maikefengguanbi' : `iconicon_maikefeng_${audioLevel}`"
        style="float:right; font-size:12px"
      ></span>
    </p>

    <!-- 阴影区-->
    <div class="shadow-area"></div>
    <div class="vhall-subStream-box--pophover" v-show="layout !=1">
      <!-- 右侧小窗体 区域 -->
      <div class="action-mini-pop" v-if="(mainScreen ==  accountId) && isDocShow">
        <p>
          <span v-if="roleName == 1">主持人</span>
          <span v-if="roleName == 2">观众</span>
          <span v-if="roleName == 3">助理</span>
          <span v-if="roleName == 4">嘉宾</span>

          <el-tooltip :content="videoMuteStatus ? '打开摄像头': '关闭摄像头'" placement="top" v-tooltipMove>
            <a
              href="javascript:void(0);"
              @click="muteDevice('video')"
              :class="videoMuteStatus ?
            'iconfont iconicon_shexiangtouguanbi' : 'iconfont iconicon_shexiangtoukaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioMuteStatus ? '打开麦克风': '关闭麦克风'" placement="top" v-tooltipMove>
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              class="iconfont"
              :class="audioMuteStatus ? 'iconicon_maikefengguanbi' : `icon-audio-level iconicon_maikefeng_${audioLevel}`"
            ></a>
          </el-tooltip>
          <a href="javascript:void(0);" style="background:none" v-if="roleName != 1"></a>
        </p>
        <p class="audio-network-status">
          <a
            class="network-status"
            :class="`network-status${netWorkStatus}`"
          >
          </a>
        </p>
        <p>
          <span>视图</span>
          <el-tooltip content="切换" placement="bottom" v-tooltipMove>
            <a v-if="!isFullScreen" href="javascript:void(0);" class="iconfont iconicon_qiehuan" @click="exchange()">
              <!-- 切换 -->
            </a>
          </el-tooltip>
          <el-tooltip content="全屏" placement="bottom" v-tooltipMove>
            <a
              href="javascript:void(0);"
              class="iconfont"
              :class="{'iconicon_quanping': !isFullScreen,'iconicon_quxiaoquanping': isFullScreen }"
              @click="fullScreen"
            >
              <!-- 全屏 -->
            </a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom" v-tooltipMove>
            <a
              v-if="roleName != 1 "
              href="javascript:void(0);"
              class="iconfont iconicon_xiamai"
              @click="speakOff()"
            >
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
      </div>
      <!-- 右侧小窗体 区域 -->
      <div class="action-mini-pop" v-else>
        <p>
          <el-tooltip :content="videoMuteStatus ? '打开摄像头': '关闭摄像头'" placement="top" v-tooltipMove>
            <a
              href="javascript:void(0);"
              @click="muteDevice('video')"
              :class="videoMuteStatus ?
              'iconfont iconicon_shexiangtouguanbi' : 'iconfont iconicon_shexiangtoukaiqi'"
            ></a>
          </el-tooltip>
          <el-tooltip :content="audioMuteStatus ? '打开麦克风': '关闭麦克风'" placement="top" v-tooltipMove>
            <a
              href="javascript:void(0);"
              @click="muteDevice('audio')"
              :class="audioMuteStatus ? 'iconfont iconicon_maikefengguanbi' : 'iconfont iconyinliang'"
            ></a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="top" v-tooltipMove>
            <a
              v-if="roleName != 1"
              href="javascript:void(0);"
              class="iconfont iconicon_xiamai"
              @click="speakOff()"
            >
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
        <p v-if="roleName == 1">
          <el-tooltip content="设为主讲人" placement="bottom" v-tooltipMove>
            <a
              href="javascript:void(0);"
              class="iconfont iconsheweizhujiangren"
              @click="setOwner()"
            >
              <!-- 设为主屏 -->
            </a>
          </el-tooltip>
          <el-tooltip content="下麦" placement="bottom" v-tooltipMove>
            <a
              href="javascript:void(0);"
              class="iconfont iconicon_xiamai"
              @click="speakOff()"
              v-if="showDownMic"
            >
              <!-- 下麦 -->
            </a>
          </el-tooltip>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { findIndex } from 'lodash';
import EventBus from '@/utils/Events';
import { calculateAudioLevel, calculateNetworkStatus } from '../../utils/utils';
let createLocalLock = false;
/**
 * 互动模块
 * sean.shi
 */
export default {
  props: {
    // PAAS 房间ID
    inavId: {
      required: true
    },
    // 用户信息
    userInfo: {
      required: false
    },
    roomId: {
      required: true
    },

    // PAAS APPID
    appId: {
      required: true
    },

    // 三方用户ID
    accountId: {
      required: true
    },
    // 主持人ID

    ownerId: {
      required: true
    },

    // PAAS token
    token: {
      required: true
    },

    // 角色
    role: {
      required: false,
      default: 'GUEST'
    },

    // vss 系统身份
    roleName: {
      required: true
    },

    // nick
    nickName: {
      required: false
    },

    // 布局
    layout: {
      required: false
    },

    // 是否 是主屏
    mainScreen: {
      required: false
    },

    // 文档是否显示
    isDocShow: {
      required: false
    },
    // 直播开始状态
    status: {
      required: true
    },

    speakerList: {
      required: true,
      default: () => []
    },

    miniElement: {
      required: true,
      default: 'video'
    },
    isInteract: {
      required: true // 是否为互动直播
    },
    splited: {
      required: false, // 分屏状态
      default: false
    },
    webinarId: {
      required: true // 活动id
    }
  },

  data () {
    return {
      beforeUnloadTime: null,
      $SDKINSTANCE: null,
      $localStreamId: null,
      $videoDevice: '', // 视频设备ID
      $audioDevice: '', // 音频设备ID
      $profile: '', // 设备分辨率
      $mediaStreamId: null,
      videoMuteStatus: false,
      audioMuteStatus: false,
      broadCastLayout: '',
      isPushed: false, // 是否已经推流成功
      isFullScreen: false,
      videoToAudio: false,
      showDownMic: false,
      screenSharing: false, // 桌面共享状态
      audioLevel: 1, // 音量
      netWorkStatus: 0, // 网络状态
      republishCount: 0, // 重新推流次数
      streamLength: 0 // 房间内音视频流数量
    };
  },
  created () {
  },
  watch:{
    streamLength (newValue) {
      console.warn(newValue, '计算其个数')

        if(newValue == 1 ){
          console.warn('改变到的远端流个数----', this.streamLength);
          // 手动触发window resize 事件
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
    }
  },
  async mounted () {
    this.broadCastLayout = sessionStorage.getItem('layout') || 'CANVAS_LAYOUT_PATTERN_TILED_6_1T5D';
    await this.initSDK();
    this.addListeners();
  },

  filters: {
    subString: function (value, length) {
      if (!value) return '';
      return value.length > 8 ? `${value.substring(0, length)}...` : value;
    }
  },

  methods: {
    /**
     * init 互动SDK
     * @param cb {Function} - SDK 初始化之后的事件回调方法
     * @param mixedcb {Function} - SDK 混流成功之后的回调
     * @return {void}
     */

    initSDK () {
      return new Promise((resolve, reject) => {
        if (this.$SDKINSTANCE) {
          resolve(this.$SDKINSTANCE);
        } else {
          let _data = {
            accountId: this.accountId, // 第三方用户ID，必填     *不能是中文
            inavId: this.inavId, // 房间ID，必填
            appId: this.appId, // 应用ID，必填
            token: this.token, // access_token，必填
            role: this.role,
            roomId: this.roomId // 如需开启旁路，必填
          }
          try {
            let _otherOption = JSON.parse(sessionStorage.getItem('report_extra'))
            let _report_extra = JSON.parse(_otherOption.report_extra)
            // delete _otherOption.report_extra.switch_id
            _otherOption.report_extra = JSON.stringify({
              join_id: _report_extra.join_id
            })
            _data.otherOption = _otherOption
          } catch (error) {}
          // otherOption: {
          //   ...JSON.parse(sessionStorage.getItem('report_extra'))
          // }
          console.warn(_data, '查询初始化的值');
          VhallRTC.createInstance(_data,
            e => {
              this.$SDKINSTANCE = e.vhallrtc;
              window.hudong = e.vhallrtc;
              console.log('互动SDK初始化成功', e);
              // 设备检测事件触发后再调用
              // 广播 ready 事件
              EventBus.$emit('sdkReady', {
                ...e
              });

              setTimeout(() => {
                this.autoRepushStream();
              }, 1000);

              // 广播结束
              resolve(e);
            },
            e => {
              console.log('初始化失败。请刷新页面', e);
              //  如果用户已经在房间里。 直接刷新页面
              this.$message.error(e.message);
              if (e.message == '连接互动房间失败') { // sdk未返回错误码，暂时只能根据中文文字判断
                EventBus.$emit('EVENT_ROOM_EXCDISCONNECTED', e);
              }
              if (e.code == 30009 || e.message == '当前用户已经连接') {
                document.getElementById('no-support-relogin').style.display =
                  'block';
              }
              reject(e);
            }
          );
        }
      });
    },

    autoRepushStream () {
      let OnMicArray = this.speakerList.filter(item => {
        return item.account_id == this.accountId;
      })[0];

      if (OnMicArray) {
        if (this.status != 1) {
          return;
        }
        this.videoMuteStatus = OnMicArray.video != 1;
        this.audioMuteStatus = OnMicArray.audio != 1;

        this.$streamPush().then(() => {
          const info = this.getDesktopAndIntercutInfo();
          if (this.roleName == 1) {
            const remoteUsersWithStream = info.remoteUsers.filter(r => r.streams.length > 0);
            let totalStreamCount = remoteUsersWithStream.length;
            if (this.$localStreamId) {
              totalStreamCount = totalStreamCount + 1;
            }
            const layout = this.getLayout(totalStreamCount, info.streaming);
            const layoutAndMainscreenStreamId = { layout };
            console.error('this.mainScreen', this.mainScreen, 'this.accountId',this.accountId);
            if (info.streaming) { // 如果是插播或者桌面共享则把插播或桌面共享的流设置为主屏
              layoutAndMainscreenStreamId.mainScreenStreamId = info.streamId;
            } else if (this.accountId == this.mainScreen) { // 如果主持人是主讲人把主屏设置为主持人
              layoutAndMainscreenStreamId.mainScreenStreamId = this.$localStreamId;
            }
            this.startBroadCast(layoutAndMainscreenStreamId);

            EventBus.$emit('startLive');
          }
          const remote = info.remoteUsers.filter(item => {
            return item.streams.length > 0;
          });
          const local = info.localUser.streams.length > 0;
          this.streamLength = local ? remote.length + 1 : remote.length;
        }).catch((e) => {
          if (this.status == 1 && this.roleName == 1) {
            EventBus.$emit('startLive'); // 主持人下麦刷新页面后开始计时
          }
          EventBus.$emit('STREAM_PUSH_ERROR', e); // 业务端上麦成功后推流失败错误
          EventBus.$emit('republisherror', e);
          this.speakOff();
        });
      } else if (
        this.speakerList.length == 0 &&
        this.mainScreen == this.accountId &&
        this.status == 1
      ) {
        this.speakOn().then(() => {
          EventBus.$emit('startLive');
          if (this.roleName == 1) {
            this.startBroadCast(this.$localStreamId); // 房间内没有流 并且主讲人为主持人 需要重新开启旁路 解决17447
          }
        });
      } else if (this.status == 1) {
        EventBus.$emit('startLive'); // 主持人下麦刷新页面后开始计时
      }
    },

    /**
     * 获取当前互动组件 实例
     * @return {Object}  - 返回互动SDK实例
     */
    async getInstance () {
      return this.$SDKINSTANCE && this.$SDKINSTANCE;
    },

    /**
     * 创建本地流
     * @param obt {Object} - sdk init stream base info config
     * @return {Promise} - 创建成功后的promise 回调
     *
     */
    async createLocalStream (opt = {}) {
      if (createLocalLock) return;

      createLocalLock = true;
      let vidoeDeviceStatus = true; // 是否 创建带有 视频状态的流
      let audioDeviceStatus = true; // 是否 创建带有 音频状态的流

      this.$videoDevice = sessionStorage.getItem('selectedVideoDeviceId');
      this.$audioDevice = sessionStorage.getItem('selectedAudioDeviceId');

      //  主持人 - 无视频自动切换音频直播 (4.9.7版本去掉该逻辑)

      // 音频直播
      console.warn('this.layout----------', this.layout);
      if (this.layout == 1) {
        // 显示遮罩层
        // 禁用视频
        // 不采集 视频设备信息
        this.videoToAudio = true;
        vidoeDeviceStatus = false;
        this.videoMuteStatus = true;
      }

      let profileConst; // 当前用户是主屏的时候会使用媒体设置设置的清晰度，媒体设置里未设置则使用defaultMainscreenDefinition。当前用户不是主屏则使用defaultSmallscreenDefinition
      let profile;
      if (vidoeDeviceStatus) {
        const defaultMainscreenDefinition = sessionStorage.getItem('defaultMainscreenDefinition');
        const defaultSmallscreenDefinition = sessionStorage.getItem('defaultSmallscreenDefinition');
        const mainscreenDefinition = sessionStorage.getItem('speakerDefinition');
        if (this.mainScreen == this.accountId) {
          profileConst = this.$profile || this.formatDefinition(mainscreenDefinition) || this.formatDefinition(defaultMainscreenDefinition);
        } else {
          profileConst = this.formatDefinition(defaultSmallscreenDefinition);
        }
        profile = VhallRTC[profileConst];
      }
      console.log('设备变更了',vidoeDeviceStatus, profileConst, this.$profile, profile, this.mainScreen, this.accountId);
      let options = Object.assign(
        {
          videoNode: `stream-${this.accountId}`, // 传入本地视频显示容器，必填
          audio: audioDeviceStatus, // 是否获取音频，选填，默认为true
          video: vidoeDeviceStatus, // 是否获取视频，选填，默认为true
          profile, // 自定义分辨率，使用分辨率模板，选填，与videoQuality参数互斥，优先使用profile参数，推荐使用。
          mute: {
            audio: this.audioMuteStatus,
            video: this.videoMuteStatus
          },
          audioDevice: sessionStorage.getItem('selectedAudioDeviceId') || '',
          attributes: JSON.stringify({
            nickName: this.nickName,
            role: this.roleName
          })
          // simulcast: this.roleName != 1 // 互动sdk2.2.1开始支持
        },
        {
          ...opt
        }
      );

      if (this.layout != 2) {
        let videoDevice = this.$videoDevice || undefined;
        videoDevice && (options.videoDevice = videoDevice);
      }

      await this.initSDK();

      if (this.$localStreamId) {
        try {
          await this.destroyStream();
        } catch (e) {
          console.log('prepare create local stream!', e);
        }
      }
      console.log(options, '创建本地流参数（createStream）');
      return new Promise((resolve, reject) => {
        if (this.$SDKINSTANCE) {
          console.log(document.querySelector(`#stream-${this.accountId}`), 'video-node');
          this.$SDKINSTANCE.createStream(
            options,
            e => {
              createLocalLock = false;
              this.$localStreamId = e.streamId;
              clearInterval(this.audioLeveInterval);
              this.audioLeveInterval = setInterval(() => {
                // 获取音频状态
                this.$SDKINSTANCE.getAudioLevel({streamId: this.$localStreamId}, (level) => {
                  this.audioLevel = calculateAudioLevel(level);
                }, () => { this.audioLevel = 0; });
              }, 1000);
              clearInterval(this.netWorkStatusInterval);
              this.netWorkStatusInterval = setInterval(() => {
                // 获取网络状态
                this.$SDKINSTANCE.getStreamPacketLoss({streamId: this.$localStreamId}, (status) => {
                  this.netWorkStatus = calculateNetworkStatus(status);
                }, () => { this.netWorkStatus = 0; });
              }, 2000);
              resolve(e.streamId);
            },
            e => {
              createLocalLock = false;
              // this.$message({
              //   message: e.msg,
              //   type: 'error'
              // })
              console.log('info: localstream created error!', e, options);
              reject(e);
            }
          );
        } else {
          createLocalLock = false;
          reject(new Error('sdk is unready'));
        }
      });
    },
    /**
     * 销毁本地流
     */
    destroyStream (streamId) {
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.destroyStream(
          {
            streamId: streamId || this.$localStreamId
          },
          () => {
            if (!streamId) {
              this.$localStreamId = '';
            }
            resolve();
          },
          e => {
            reject(e);
          }
        );
      });
    },

    /**
     *  打开关闭 视频
     * @param opt {Object} -  SDK 配置对象
     * @reutun void
     */
    muteDevice (device) {
      if (!this.$localStreamId) {
        this.$message('请先开启直播');
        return;
      }
      if (device == 'audio') {
        this.audioMuteStatus = !this.audioMuteStatus;
      } else if (device == 'video') {
        this.videoMuteStatus = !this.videoMuteStatus;
      }
      // 通过 VSS 禁用
      let muteDevice;
      let status;
      if (device == 'audio') {
        muteDevice = 1;
        status = this.audioMuteStatus ? 0 : 1;
      } else if (device == 'video') {
        muteDevice = 2;
        status = this.videoMuteStatus ? 0 : 1;
      }
      // TODO:
      this.$fetch('setRoomDevice', {
        room_id: this.roomId,
        receive_account_id: this.accountId,
        device: muteDevice,
        status: status,
      });
    },

    /**
     * 视频画面 互相切
     */
    exchange () {
      // 远端流加入 - 自动自适应 - 增加， 空出顶部的样式
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

    exchangeDoc () {
      var current = this.$refs['sub-videoBox'];
      var exchangeAreaDom = document.querySelector(
        '.vhall-saas-watchbox__mainContent__bigArea .vhall-watch-doc-wrapper'
      );
      if (!exchangeAreaDom) {
        exchangeAreaDom = document.querySelector(
          '.vhall-document-container .doc-wrapper'
        );
      }
      exchangeAreaDom.className = 'doc-wrapper';
      var videoClass = current.className.split(' ');
      videoClass = videoClass.filter(item => {
        return item != 'vhall-server-mainScreen';
      });
      current.className = `${videoClass.join(
        ' '
      )} vhall-saas-miniArea vhall-miniBox`;
    },

    /**
     *  开始直播
     *  @return {Promise} - 返回一个Promise 对象。 供调用方捕获异常和成功信息
     */

    async startLive (status) {
      console.warn('点击的是开支直播-----------------------------------', this.webinarId, this.$route, status)
      return this.$streamPush().then(() => {
        if (status != 1) {
          return this.$fetch('liveStart', {
            webinar_id: this.$route.params.il_id, // TODO: 临时修改
            start_type: 1
          }).then((res) => {
            if(res.code == 200){
              if (this.role == VhallRTC.MASTER) {
                setTimeout(() => {
                  this.startBroadCast({
                    roomId: this.roomId // 直播房间ID，必填
                  });
                }, 600);
              }
              EventBus.$emit('startLive');
            }else{
              this.$message.warning(res.msg)
            }
          });
        } else {
          if (this.role == VhallRTC.MASTER) {
            this.startBroadCast({
              roomId: this.roomId // 直播房间ID，必填
            });
          }
          EventBus.$emit('startLive');
        }
      });
    },

    /**
     * 结束直播
     * @return {Promise} - 返回一个Promise 对象。 供调用方捕获异常和成功信息
     */
    stopLive () {
      EventBus.$emit('_endLive');
      return this.$streamStop(this.$localStreamId)
        .then(() => {
          this.stopBradCast().catch(e => {
            this.$SDKINSTANCE.stopBroadCast(
              {
                roomId: this.roomId
              },
              () => {},
              () => {}
            );
          });
        }).then(() => {
          return this.$fetch('liveEnd', {
            webinar_id: this.webinarId,
            end_type: 1
          }).then((res) => {
            if(res.code == 200){
              EventBus.$emit('endLive');
              // 广播 直播结束
            }else{
              this.$message.warning(res.msg)
            }
          });
        }).catch((e) => {
          console.error(e, 333);
          this.stopBradCast().catch(e => {
            this.$SDKINSTANCE.stopBroadCast(
              {
                roomId: this.roomId
              },
              () => {},
              () => {}
            );
          });
          return this.$fetch('liveEnd', {
            webinar_id: this.webinarId,
            end_type: 1
          }).then((res) => {
            if(res.code == 200){
              EventBus.$emit('endLive');
              // 广播 直播结束
            }else{
              this.$message.warning(res.msg)
            }
          });
        });
    },

    /**
     * 开启旁路混流
     * @param opt {Object} - 开启旁路配置参数
     * @param reset
     */
    startBroadCast (opt, resetCout = 2, resetTime = 500) {
      console.log('current broad cast layout', VhallRTC[this.broadCastLayout]);
      let options = Object.assign(
        {
          // roomId: this.roomId, // 直播房间ID，必填：实例化sdk的时候传就可以
          layout:
            VhallRTC[this.broadCastLayout] || VhallRTC.CANVAS_LAYOUT_PATTERN_FLOAT_6_5D, // 旁路布局，选填 默认一人平铺类型
          profile: VhallRTC.BROADCAST_VIDEO_PROFILE_1080P_1,
          precastPic: false,
          border: { // 旁路边框属性
            width: 2,
            color: '0x666666'
          }
          // mainScreenStreamId: '' // 旁路流中主屏显示流ID，选填 默认最先推送的流ID
        },
        opt
      );
      this.$SDKINSTANCE.startBroadCast(
        options,
        () => {
          console.log('firt start broadcast success');
        },
        e => {
          console.log('broad cast error:: 1s 后重新开启');
          setTimeout(() => {
            this.$SDKINSTANCE.startBroadCast(
              {
                // roomId: this.roomId, // 直播房间ID，必填实； 实例化sdk的时候传就可以
                layout:
                  VhallRTC[this.broadCastLayout] ||
                  VhallRTC.CANVAS_LAYOUT_PATTERN_FLOAT_6_5D, // 旁路布局，选填 默认一人平铺类型
                profile: VhallRTC.BROADCAST_VIDEO_PROFILE_1080P_1,
                precastPic: false,
                border: { // 旁路边框属性
                  width: 2,
                  color: '0x666666'
                }
              },
              () => {
                console.log('broad cast success::');
              },
              e => {
                console.log('broad cast error :: ', e);
              }
            );
          }, 1000);
        }
      );
    },
    /**
     * 停止旁路
     */
    stopBradCast () {
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.stopBroadCast(
          {
            roomId: this.roomId
          },
          () => {
            console.log('broadcast stop success');
            resolve();
          },
          e => {
            console.log('broadcast stop error', e);
            reject(e);
          }
        );
      });
    },

    /**
     * 动态设置旁路布局
     */
    setBroadCastLayout (layout) {
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.setBroadCastLayout(
          {
            layout: layout// 旁路布局，选填 不填默认不改变原配置
          },
          () => {
            console.log('dynamic layout success::', layout);
            resolve();
          },
          e => {
            console.log('dynamic layout error::', e);
            setTimeout(() => {
              this.$SDKINSTANCE.setBroadCastLayout(
                {
                  layout: layout // 旁路布局，选填 不填默认不改变原配置
                },
                () => {
                  console.log('retry dynamic layout success::', layout);
                }, (e) => {
                  console.log('retry dynamic layout error::', layout);
                  reject(e);
                });
            }, 0);
          }
        );
      });
    },

    /**
     * 上麦
     */
    async speakOn () {
      return new Promise((resolve, reject) => {
        return this.$fetch('speakOn', {
          room_id: this.roomId
        }).then(async () => {
          this.audioMuteStatus = false; // 修复13329
          this.videoMuteStatus = false; // 修复13329
          try {
            await this.$streamPush();
          } catch (e) {
            EventBus.$emit('STREAM_PUSH_ERROR', e); // 业务端上麦成功后推流失败错误
            this.speakOff();
            return Promise.reject(e);
          }
          this.resetLayout();
          resolve();
        }).catch((res) => {
          reject(res);
        });
      });
    },
    /**
     * 下麦 - 动作
     * @param { String } accountId
     * @return { Promise }
     * TODO:
     *
     */
    speakOff (accountId) {
      return this.$fetch('speakOff', {
        room_id: this.roomId
      }).then(() => {
        if (this.accountId == this.mainScreen && this.roleName == 4) {
          this.setOwner(this.ownerId);
        }
      });
    },

    /**
     *  推流 - 动作
     */
    async $streamPush (streamId) {
      console.log('push stream start');
      if (this.isPushed) {
        return;
      }
      try {
        await this.createLocalStream();
      } catch (e) {
        this.streamError = true;
        e.message = '初始化本地流失败，请检查设备是否被禁用或者被占用';
        return Promise.reject(e);
      }
      this.streamError = false;
      this.isPushed = true;
      console.log('push stream start create local stream success');
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.publish(
          {
            streamId: streamId || this.$localStreamId,
            accountId: this.accountId
          },
          () => {
            this.streamLength = this.streamLength + 1;
            console.log('push streamed success！');
            if (this.mainScreen == this.accountId && this.roleName == 1) {
              this.$SDKINSTANCE.setBroadCastScreen(
                {
                  mainScreenStreamId: this.$localStreamId
                },
                () => {},
                e => {
                  setTimeout(() => {
                    this.$SDKINSTANCE.setBroadCastScreen(
                      {
                        mainScreenStreamId: this.$localStreamId
                      },
                      () => {},
                      e => {}
                    );
                  }, 50);
                }
              );
            }
            EventBus.$emit('streamPushed');
            resolve();
          },
          e => {
            console.log('push streamed error !!', e, this.$localStreamId);
            reject(e);
          }
        );
      });
    },
    /**
     * 停止推流 - 动作
     */
    $streamStop (streamId) {
      if (!this.isPushed) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.unpublish(
          {
            streamId: streamId || this.$localStreamId
          },
          e => {
            console.log('stop pushing stream success');
            this.isPushed = false;
            this.$localStreamId = null;
            this.resetLayout();
            resolve();
          },
          e => {
            console.log('stop pushing stream error', e);
            this.$localStreamId = null;
            this.resetLayout();
            reject(e);
          }
        );
        setTimeout(() => { // 网络出问题sdk接口不返回的情况
          this.isPushed = false;
          resolve();
        }, 1000);
      });
    },

    /**
     * envirmonet check  when desktop share
     * @returns { Promise }  Boolean
     */
    shareScreenCheck () {
      return new Promise((resolve, reject) => {
        VhallRTC.getDevices(
          {},
          devices => {
            console.log('ss', devices);
            let check = devices.videoInputDevices.filter(item => {
              return item.deviceId.toLowerCase() == 'desktopscreen';
            });
            if (check.length) {
              resolve(true);
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(false);
            }
          },
          e => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
          }
        );
      });
    },

    /**
     * 桌面共享
     */
    async shareScreen () {
      // VhallRTC

      let status;
      try {
        status = await this.shareScreenCheck();
      } catch (e) {
        status = false;
      }

      const ua = navigator.userAgent;
      // eslint-disable-next-line no-useless-escape
      const chromeTest = ua.match(/chrome\/([\d\.]+)/i);
      const chromeVersion = chromeTest ? chromeTest[1] : 0;
      const safariTest = ua.match(/Version\/([\d.]+).*Safari/);
      const safariVersion = safariTest ? safariTest[1].replace(/\./g, '') : 0;
      console.log('user agent match', ua, chromeTest, safariTest);

      if (!chromeVersion && (!safariVersion || Number(safariVersion) < 1304)) {
        this.$message({
          message: '您的浏览器不支持桌面共享！'
        });
        return;
      }

      if (!status) {
        if (Number(chromeVersion) < 74) {
          this.$confirm(
            '检测到您未安装桌面共享Chrome浏览插件， 无法发起桌面共享，请尝试下载插件解决。',
            '提示',
            {
              distinguishCancelAndClose: true,
              confirmButtonText: '下载插件',
              cancelButtonText: '安装帮助'
            }
          )
            .then(() => {
              window.open(
                'https://static01-class.e.vhall.com/vhallclass/chrome_extension/omakdpbabdhobphckndjamjoggpnemml_main.crx',
                '_self'
              );
            })
            .catch(action => {
              if (action == 'cancel') {
                window.open('http://www.vhall.com/saas/doc/1674.html', '_blank');
              }
            });
        }
        return;
      }

      EventBus.$emit('sharescreenconfirm');
    },
    /**
     * 停止桌面共享
     */
    stopShareScreen () {
      this.$SDKINSTANCE.unpublish(
        {
          streamId: this.$mediaStreamId
        },
        () => {
          this.screenSharing = false;
          (this.roleName == 1) && this.resetLayout();
          EventBus.$emit('sharescreenstop');
        },
        e => {
          console.log(e);
        }
      );
    },

    /**
     * 设备变更重新 推流
     */
    republish () {
      if (this.status != 1) {
        // eslint-disable-next-line new-cap
        return new Promise.reject();
      }

      return new Promise((resolve, reject) => {
        if (this.$localStreamId) {
          this.unpublish(
            () => {
              this.$localStreamId = null;
              this.isPushed = false;
              this.$streamPush().then(() => {
                resolve();
              }).catch((e) => {
                reject(e);
              });
            },
            e => {
              reject(e);
              console.log('err', e);
            }
          );
        } else {
          this.$localStreamId = null;
          this.isPushed = false;
          this.$streamPush().then(() => {
            resolve();
          }).catch((e) => {
            reject(e);
          });
        }
      });
    },

    unpublish (success, error) {
      this.$SDKINSTANCE &&
        this.$SDKINSTANCE.unpublish(
          {
            streamId: this.$localStreamId
          },
          success,
          error
        );
    },

    streamMute () {
      this.$SDKINSTANCE.mute(
        {
          streamId: this.$localStreamId,
          mute: {
            audio: this.audioMuteStatus, // 是否关音频，选填。不填则不改变当前流音频状态
            video: this.videoMuteStatus // 是否关视频，选填。不填则不改变当前流视频状态
          }
        },
        e => {
          console.log('mute device', e);
        },
        e => {
          console.log('mute device error', e);
        }
      );
    },

    /**
     *  重置观看端布局
     *  @param { Number } streamType [流类型]
     */
    resetLayout (streamType) {
      if (this.roleName != 1) {
        return;
      }
      const info = this.getDesktopAndIntercutInfo();
      const remoteUsersWithStream = info.remoteUsers.filter(r => r.streams.length > 0);
      let totalStreamCount = remoteUsersWithStream.length;
      if (this.$localStreamId) {
        totalStreamCount = totalStreamCount + 1;
      }

      // 如果是插播或者桌面共享 则设置 一屏幕独大
      let desktopAndIntercutStreaming = false;
      if (streamType == 3 || streamType == 4 || this.screenSharing || info.streaming) {
        desktopAndIntercutStreaming = true;
      }
      const layout = this.getLayout(totalStreamCount, desktopAndIntercutStreaming);
      this.setBroadCastLayout(layout);

    },

    /**
     * 重设大屏
     */

    setBigScreen (data) {
      console.log('设置主屏', data);
      if (this.roleName == 1 && data.room_role == 4) {
        this.showDownMic = true;
      } else if (this.roleName == 1 && data.room_role == 2) {
        this.showDownMic = false;
      }
      const streamInfo = this.getDesktopAndIntercutInfo();
      const users = streamInfo.remoteUsers.concat(streamInfo.localUser);
      const mainScreenUser = users.find(u => u.accountId == data.room_join_id) || { streams: [] };
      const mainScreenStream = mainScreenUser.streams.find(s => s.streamType == 2) || {};
      console.warn('mainScreenStream--',mainScreenStream, 'mainScreenUser----',mainScreenUser);
      if (this.roleName == 1 && data.room_join_id != this.accountId) {
        this.$SDKINSTANCE.setBroadCastScreen(
          {
            mainScreenStreamId: mainScreenStream.streamId
          },
          () => {},
          e => {}
        );
      } else if (this.roleName == 1 && this.accountId == data.room_join_id) {
        if (!this.$localStreamId && data.device_status == 1 && !this.streamError) { // 17096 【H5互动】主持人和嘉宾都下麦后造成房间无流的异常情况处理,如果推流失败不会重新推流
          this.speakOn();
        }
        this.$localStreamId && this.$SDKINSTANCE.setBroadCastScreen(
          {
            mainScreenStreamId: this.$localStreamId
          },
          () => {},
          e => {}
        );
      }
      if (streamInfo.streaming && this.accountId == streamInfo.accountId) {
        this.stopShareScreen();
      }
      // 双流相关逻辑
      const bigscreenUser = streamInfo.remoteUsers.find(u => u.accountId == data.room_join_id);
      let bigscreenStream;
      if (bigscreenUser) {
        bigscreenStream = bigscreenUser.streams.find(s => s.streamType != 4 && s.streamType != 3);
        const dulaParams = {dual: 1, streamId: bigscreenStream.streamId}; // 大画面的流设置为大流
        bigscreenStream && this.$SDKINSTANCE.setDual(dulaParams);
      }
      const streams = streamInfo.remoteUsers.reduce((acc, curr) => { // 其它流设置为小流
        acc.push(curr.streams.find(s => s.streamType != 3 && s.streamType != 4));
        return acc;
      }, []).filter(s => !!s);
      streams.forEach(s => {
        if (bigscreenStream && s.streamId == bigscreenStream.streamId) return;
        const dulaParams = {dual: 0, streamId: s.streamId};
        this.$SDKINSTANCE.setDual(dulaParams);
      });
    },

    /**
     * add listeners
     */
    addListeners () {
      if (this.roleName == 1) {
        let speakOffTimer = {};
        // 退出房间 20s 自动下麦，离开用户
        EventBus.$on('Leave', e => {
          // 用户 退出房间 = 事件
          // sender_id,
          if ((e.sender_id == this.accountId && e.context.audience) || (e.context.role_name == 1 && !e.context.audience) || e.context.isAuthChat) return; // 主持端登录观看端后关闭页面防止发起端下线
          const userId = e.sender_id;
          const check = findIndex(this.speakerList, item => {
            return item.account_id == userId;
          });
          if (check != -1) {
            console.log('用户 退出房间 = 事件', userId);
            speakOffTimer[`${userId}${e.context.audience}`] = setTimeout(() => {
              clearTimeout(speakOffTimer[`${userId}${e.context.audience}`]);
              this.speakOff(userId);
            }, 20000);
          }
        });

        EventBus.$on('Join', e => {
          // 用户 加入房间 = 事件
          const userId = e.sender_id;
          if (speakOffTimer[`${userId}${e.context.audience}`]) {
            console.log('用户 加入房间 = 事件', e);
            console.log('您正在取消下麦用户', userId);
            try {
              clearTimeout(speakOffTimer[`${userId}${e.context.audience}`]);
              delete speakOffTimer[`${userId}${e.context.audience}`];
            } catch (e) {
              console.log('这个用户， 没有上麦');
            }
          }
        });
      }

      /**
       * 设备更新信息
       */
      EventBus.$on('deviceChange', data => {
        const isOnMic = this.speakerList.find(item => { // 如果嘉宾或者观看端在麦上重新推流
          return item.account_id == this.accountId;
        });
        console.log('设备变更了！！', data);
        const { profile, layout, desktopProfile } = data;
        this.$profile = profile;
        this.broadCastLayout = layout;
        this.desktopProfile = desktopProfile;
        if (!data.repushStream) return;
        if (this.roleName == 1 && this.status == 1) {
          this.republish();
        } else if ((this.roleName == 2 || this.roleName == 4) && this.status == 1 && isOnMic) {
          this.republish().catch((e) => {
            EventBus.$emit('republisherror', e);
          });
        }
      });

      /**
       * 设置主讲人
       */
      EventBus.$on('vrtc_speaker_switch', data => {});
      EventBus.$on('vrtc_big_screen_set', this.setBigScreen);

      //  视频禁用
      EventBus.$on('vrtc_frames_forbid', e => {
        if (this.accountId == e.room_join_id) {
          this.videoMuteStatus = true;
          this.streamMute();
          this.$message.error('摄像头已关闭，对方将看不到您的画面');
        }
      });

      // 视频取消禁用
      EventBus.$on('vrtc_frames_display', e => {
        if (this.accountId == e.room_join_id) {
          this.videoMuteStatus = false;
          this.streamMute();
          this.$message.success('摄像头已打开');
        }
      });

      // 音频禁用
      EventBus.$on('vrtc_mute', e => {
        if (this.accountId == e.room_join_id) {
          this.audioMuteStatus = true;
          this.streamMute();
          this.$message.error('麦克风已关闭，对方将听不到您的声音');
        }
      });

      // 音频取消禁用
      EventBus.$on('vrtc_mute_cancel', e => {
        if (this.accountId == e.room_join_id) {
          this.audioMuteStatus = false;
          this.streamMute();
          this.$message.success('麦克风已打开');
        }
      });

      // 全体静音
      EventBus.$on('disable_all', () => {
        // this.audioMuteStatus = true
        // this.streamMute()
      });

      // 取消全体禁言
      EventBus.$on('permit_all', () => {
        // this.audioMuteStatus = false
        // this.streamMute()
      });

      // 主持人 自己上麦
      EventBus.$on('applyByHost', () => {
        if (this.roleName == 1) {
          this.speakOn().then(() => {
            EventBus.$emit('startLive');
          });
        }
      });

      // TO DO - 禁言。 消息收到之后 - 调用 speakOff 事件
      EventBus.$on('disable', msg => {
        if (msg.data.target_id == this.accountId) {
          console.log('禁言消息', this.$SDKINSTANCE.getRoomInfo(), msg);
          if (this.$SDKINSTANCE.getRoomInfo().local.user.streams.length > 0) {
            this.speakOff();
          }
        }
      });

      // 直播结束 全体自动下麦
      EventBus.$on('live_over', e => {
        console.log('直播已经结束开始下麦动作', this.roleName);
        this.republishCount = 0;
        this.stopShareScreen();
        this.$streamStop(); // api结束活动发起端页需要停止推流
      });
      // 直播开始
      EventBus.$on('live_start', e => {
        this.republishCount = 0;
      });

      // TO DO - 下麦消息 - 调用 speakOff
      EventBus.$on('vrtc_disconnect_success', msg => {
        if (msg.target_id == this.accountId && this.$SDKINSTANCE) {
          // 判断 - 是否在桌面共享中
          const streamsLength = this.$SDKINSTANCE.getRoomInfo().local.user
            .streams.length;
          try {
            if (streamsLength > 1) {
              this.stopShareScreen();
              this.$streamStop();
            } else {
              this.$streamStop();
            }
          } catch (e) {
            console.log('已经停止推流', e);
          }
        } else if (msg.target_id == this.mainScreen) {
          // 主屏幕用户 下麦 - 主持人 - 主动把当前，主持人设为主讲人
          if (this.roleName == 1) {
            try {
              this.setOwner();
            } catch (e) {}
          }
        }
        this.streamLength = this.streamLength - 1;
      });

      /**
       *  TO DO - 踢出消息 - 调用 speakOff
       */
      EventBus.$on('room_kickout', msg => {
        let check = this.speakerList.findIndex(
          item => item.account_id == this.accountId
        );
        if (msg.target_id == this.accountId && check >= 0) {
          try {
            this.speakOff();
          } catch (e) {
            console.log('已经停止推流');
          }
        }
      });
      /**
       *  更新房间内音视频流数量
       */
      EventBus.$on('remoteStreams', msg => {
        if (this.$localStreamId) {
          this.streamLength = msg.length + 1;
        } else {
          this.streamLength = msg.length;
        }
      });

      /**
       *  桌面共享 = 停止
       */

      this.$SDKINSTANCE.on(VhallRTC.EVENT_STREAM_END, (e) => {
        // 如果摄像头，被拔掉也会触发这个 steam-end 事件
        // this.stopShareScreen() // 2.1.8-2版本里sdk自动停止桌面共享流
        if (this.status != 1) return; // 如果活动未开始，不调用停止桌面共享方法不弹出stream-end报错提示
        (this.roleName == 1) && this.resetLayout();
        const info = this.getDesktopAndIntercutInfo();
        console.log(e, info, 'sharescreeninfo');
        if (info.streamId == e.data.streamId) { // 桌面共享
          this.screenSharing = false;
          EventBus.$emit('sharescreenstop');
        } else { // 设备问题引起的本地流结束事件
          if (this.splited) return; // 解决17565 【H5】主持人结束“分屏”，主持人自动下麦
          EventBus.$emit('EVENT_STREAM_END_ERROR');
          this.speakOff();
        }
      });

      /**
       * 远端流 加入- 重置现在的布局
       */
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_ADD, (e) => {
        console.log(e, 'streamadd');
        let mainScreenId;
        if (e.data.streamType == 3 || e.data.streamType == 4) {
          mainScreenId = e.data.streamId;
        } else if (e.data.accountId == this.mainScreen) {
          mainScreenId = e.data.streamId;
        }
        if (this.roleName != 1) return;
        mainScreenId && this.$SDKINSTANCE.setBroadCastScreen({
          mainScreenStreamId: mainScreenId
        }, () => {
        }, () => {
        });

        this.resetLayout(e.data.streamType);
      });

      /**
       * 远端流 退出 - 重置现在的布局样式
       */
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_REMOVED, e => {
        if (this.roleName != 1) return;
        if (e.data.streamType == 3 || e.data.streamType == 4) {
          const info = this.getDesktopAndIntercutInfo();
          const remoteUsersWithStream = info.remoteUsers.filter(r => r.streams.length > 0);
          let totalStreamCount = remoteUsersWithStream.length;
          if (this.$localStreamId) {
            totalStreamCount = totalStreamCount + 1;
          }

          // 如果是插播或者桌面共享 则设置 一屏幕独大
          const layout = this.getLayout(totalStreamCount, false);
          this.setBroadCastLayout(layout);
        } else {
          this.resetLayout();
        }
      });

      /**
       * 房间链接出错
       */
      this.$SDKINSTANCE.on(VhallRTC.EVENT_ROOM_EXCDISCONNECTED, e => {
        EventBus.$emit('EVENT_ROOM_EXCDISCONNECTED', e);
      });
      /**
       * stream-stunk事件
       */
      this.$SDKINSTANCE.on(VhallRTC.EVENT_STREAM_STUNK, e => {
        EventBus.$emit('EVENT_STREAM_STUNK', e);
        this.republish();
      });
      // 远端流 失败
      this.$SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_FAILED, (e) => {
        console.log('tangrma log info::', e);
        // 本地流失败 重推
        if (e.data.stream.getID() == this.$localStreamId && this.republishCount < 3) {
          EventBus.$emit('EVENT_LOCALSTREAM_FAILED', e);
          this.$streamStop();
          this.resubscribeTimer = setTimeout(() => {
            clearTimeout(this.resubscribeTimer);
            this.republish();
            this.republishCount = this.republishCount + 1;
          }, 2000);
        }
      });
      /**
       *  监听退出全屏事件
       */
      window.addEventListener(
        'fullscreenchange',
        e => {
          console.error('interactive', document.fullscreenElement);
          if (document.fullscreenElement) {
            // 进入全屏
          } else {
            let Element = this.$refs['sub-videoBox'];
            if (Element.className.split(' ').includes('vhall-saas-miniArea')) {
              Element.className = Element.className
                .split(' ')
                .filter(item => {
                  return item != 'vhall-server-mainScreen';
                })
                .join(' ');
            }
            // 离开全屏
            this.isFullScreen = false;
          }
        },
        true
      );
      EventBus.$off('sharescreenprocess');
      EventBus.$on('sharescreenprocess', () => {
        const configuredProfile = sessionStorage.getItem('screenDefinition');
        let profile = VhallRTC.RTC_SCREEN_PROFILE_1080P_16x9_M;
        if (this.desktopProfile) {
          profile = VhallRTC[this.desktopProfile];
        } else if (configuredProfile && configuredProfile != 'null' && configuredProfile != 'undefined') {
          profile = VhallRTC[configuredProfile];
        }
        const options = {
          videoNode: 'interactive-wrap--media', // 传入本地视频显示容器，必填
          profile, // 自定义分辨率，使用分辨率模板，选填，与videoQuality参数互斥，优先使用profile参数，推荐使用。
          videoDevice: 'desktopScreen',
          audio: false, // 桌面共享不采集麦克风防止回声
          speaker: true // 桌面共享不采集扬声器声音
          // simulcast: this.roleName != 1 // 互动sdk2.2.1开始支持
        };

        this.$SDKINSTANCE.createStream(options, e => {
          this.$mediaStreamId = e.streamId;
          this.$SDKINSTANCE.publish(
            {
              streamId: e.streamId
            },
            e => {
              this.screenSharing = true;
              this.roleName == 1 && this.resetLayout(3);
              // console.log('桌面共享成功', e)
              EventBus.$emit('sharescreenstart');
              // setTimeout(this.setBroadCastLayout, 1000);
              // setTimeout(() => {
              this.$SDKINSTANCE.setBroadCastScreen(
                { mainScreenStreamId: this.$mediaStreamId }, () => {
                  console.log('动态设置旁路主屏幕成功');
                },
                e => {
                  console.log('动态设置旁路主屏幕失败', e);
                }
              );
              // }, 2000)
            },
            e => {
              console.log('推流失败', e);
            }
          );
        }, error => {
          console.log(error, '桌面共享创建本地流失败');
          if (error.data.error.type == 'access-denied') {
            if (/macintosh|mac os x/i.test(navigator.userAgent)) {
              EventBus.$emit('SHARESCREEN_ACCESS_DENIED', error);
            }
          }
        });
      });
      EventBus.$on('relogin', (msg) => { // 解决14568
        const token = sessionStorage.getItem('vss_token');
        if (msg.data.token == token || this.status != 1 || this.accountId != msg.data.accountId) return;
        document.getElementById('no-support-relogin').style.display = 'block';
        this.$message.error('当前用户重复进入房间');
        this.$streamStop(); // 解决15181 临时解决方案
      });
      EventBus.$on('SETSPEAKER', (msg) => { // 成员列表设置主讲人
        this.setOwner(msg.receive_account_id);
      });
    },

    /**
     * 全屏方法
     * @Function void()
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
     * 设置主讲人
     * @param {Number | String} accountId 用户ID
     * @Function void()
     */
    setOwner (accountId) {
      if (accountId) {
        const streamInfo = this.getDesktopAndIntercutInfo();
        const users = streamInfo.remoteUsers.concat(streamInfo.localUser);
        const mainScreenUser = users.find(u => u.accountId == accountId) || { streams: [] };
        const mainScreenStream = mainScreenUser.streams.find(s => s.streamType == 2) || {};
        if (!mainScreenStream.streamId) return EventBus.$emit('BIGSCREENSET_FAILED');
      }
      // TODO:
      this.$fetch('setMainScreen', {
        receive_account_id: accountId || this.accountId,
        room_id: this.roomId
      });
      // TODO:
      this.$fetch('setSpeaker', {
        receive_account_id: accountId || this.accountId,
        room_id: this.roomId
      });
    },
    // TODO:
    setMainScreen (status) {
      this.$fetch('setMainScreen', {
        receive_account_id: this.accountId,
        room_id: this.roomId
      });
    },
    /**
   *  获取插播和桌面共享的流信息
   *  @returns { object } [{streaming: Boolean, streamId: streamId, accountId: accountId, streamType: streamType, remoteUsers: [], localUser: {}  }]
   */
    getDesktopAndIntercutInfo () {
      const info = {streaming: false, streamId: '', streamType: '', accountId: '', remoteUsers: [], localUser: {}};
      const inavInfo = this.$SDKINSTANCE.getRoomInfo();
      const users = inavInfo.remote.users.concat(inavInfo.local.user || {});
      const user = users.find((u) => {
        return u.streams.length > 1;
      });
      if (user) {
        const stream = user.streams.find(s => s.streamType == 3 || s.streamType == 4) || {};
        info.streaming = true;
        info.streamId = stream.streamId;
        info.streamType = stream.streamType;
        info.accountId = user.accountId;
      }
      info.remoteUsers = inavInfo.remote.users;
      info.localUser = inavInfo.local.user;
      return info;
    },
    /**
   *  获取旁路布局
   *  @param { Number } count [房间内除了桌面共享和插播流总数，包括本地流]
   *  @param { Boolean } desktopAndIntercutStreaming [是否存在桌面共享或者插播类型的流]
   *  @returns { String } [互动sdk布局常量]
   */
    getLayout (count = 0, desktopAndIntercutStreaming = false) {
      if (desktopAndIntercutStreaming) {
        return VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_1;
      }
      let layout = VhallRTC.CANVAS_LAYOUT_PATTERN_TILED_6_1T5D;
      if (
        (this.broadCastLayout == 'CANVAS_LAYOUT_PATTERN_GRID_4_M' ||
          sessionStorage.getItem('layout') == 'CANVAS_LAYOUT_PATTERN_GRID_4_M')
      ) {
        switch (count) {
          case 1:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_1;
            break;
          case 2:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_2_H;
            break;
          case 3:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_3_E;
            break;
          case 4:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_4_M;
            break;
          case 5:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_5_D;
            break;
          case 6:
            layout = VhallRTC.CANVAS_LAYOUT_PATTERN_GRID_6_E;
            break;
        }
      } else if (!this.broadCastLayout ||
       this.broadCastLayout == 'CANVAS_LAYOUT_PATTERN_FLOAT_6_5D' ||
        sessionStorage.getItem('layout') == 'CANVAS_LAYOUT_PATTERN_FLOAT_6_5D') {
        layout = VhallRTC.CANVAS_LAYOUT_PATTERN_FLOAT_6_5D;
      } else if (this.broadCastLayout == 'CANVAS_LAYOUT_PATTERN_TILED_6_1T5D' ||
        sessionStorage.getItem('layout') == 'CANVAS_LAYOUT_PATTERN_TILED_6_1T5D') {
        layout = VhallRTC.CANVAS_LAYOUT_PATTERN_TILED_6_1T5D;
      }
      return layout;
    },
    /**
   *  获取旁路布局
   *  @param { string } param [字符串 120，240，360，480]
   *  @returns { String } [互动sdk推流Profile常量]
   */
    formatDefinition (param = '360') {
      let definition = 'RTC_VIDEO_PROFILE_360P_16x9_M';
      switch (param) {
        case '240':
          definition = 'RTC_VIDEO_PROFILE_240P_16x9_M';
          break;
        case '480':
          definition = 'RTC_VIDEO_PROFILE_480P_16x9_M';
          break;
        case '360':
          definition = 'RTC_VIDEO_PROFILE_360P_16x9_M';
          break;
        case '120':
          definition = 'RTC_VIDEO_PROFILE_120P_16x9_M';
          break;
      }
      return definition;
    }
  },
  async beforeDestroy () {
    EventBus.$off('vrtc_big_screen_set', this.setBigScreen);
    // 取消关闭页面的监听

    await new Promise((resolve, reject) => {
      this.$SDKINSTANCE.destroyInstance(
        {},
        () => {
          resolve();
          console.log('sdk is destoryed');
        },
        e => {
          reject(e);
          console.log('destoryed', e);
        }
      );
    });
  },

  destroyed () {}
};
</script>

<style>
.el-message-box__content {
  padding: 0 24px;
}
</style>
<style lang="less" scoped>
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
.vhall-server-mainScreen{
  .pop-nickName{
    padding-left: 10px !important;
    padding-right: 10px !important;
    height: 40px !important;
    &>.iconfont {
      display: none;
    }
    &>.network-status {
      display: none;
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
}
.audio-network-status {
  display: none;
}
.vhall-server-mainScreen {
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
  width: 100%;
  width: 160px;

  .disabledVideo-img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(../../assets/no_video_bg.png) center no-repeat #2d2d2d;
    background-size: 400px;
    z-index: 1;
  }
  .publish-failiure {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background: rgb(45, 45, 45);
    color: wheat;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .audio-img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-size: 400px;
    width: 100%;
    height: 100%;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333438 url(../../assets/voicefrequency.png) no-repeat;
    background-size: 100% 100%;
    /*opacity: 0.8;*/
    &--beforestart {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-size: 400px;
      width: 100%;
      height: 100%;
      z-index: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url(../../assets/livebg.png) no-repeat;
      background-size: 100% 100%;
      // background-color: black;
      & > .voicebg {
        display: none;
      }
    }
    & > .voicebg {
      color: white;
      font-size: 20px;
      width: 170px;
      height: 46px;
      background: url(../../assets/voice.png) left no-repeat;
      background-size: 69px;
      z-index: 4;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      & > span {
        width: 96px;
        height: 22px;
        display: inline-block;
        background: url(../../assets/voiceinprogress.png) no-repeat;
        background-size: 100%;
      }
    }
  }
  .subcribe-boxs {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    text-align: left;
  }

  .pop-nickName {
    position: absolute;
    z-index: 3;
    bottom: 0;
    text-align: left;
    padding-left: 6px;
    padding-right: 6px;
    line-height: 24px;
    height: 25px;
    word-break: keep-all;
    width: 100%;
    color: #fff;
    left: 0;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
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
      margin: 0px;
      text-align: left;
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
        margin-right: 10px;
        &.iconsheweizhujiangren {
          font-size: 14px;
        }
        // &.iconyinliangjinyong {
        //   font-size: 15px;
        // }
        // &.icon-audio-level{
        //   font-size: 15px;
        // }
        &:hover {
          background: #fc5659;
        }
      }
      span {
        display: inline-block;
        text-align: right;
        width: 54px;
        margin-right: 10px;
        font-size: 12px;
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

.vhall-server-mainScreen,.vhall-mainScreen {
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
        background: url(../../assets/images/common/network2.png) no-repeat center;
      }
      &>.network-status1{
        background: url(../../assets/images/common/network1.png) no-repeat center;
      }
      &>.network-status0{
        background: url(../../assets/images/common/network0.png) no-repeat center;
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
}
</style>
