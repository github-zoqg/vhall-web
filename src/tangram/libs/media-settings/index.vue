<template>
  <div class="vhall-mediasetting-content">
  <div id="check-preview-videos" style="width:0; height:0; overflow:hidden"> </div>
    <div class="preview-wrap">
      <div  v-show="layout != 1 && !videoError" class="loading-wrapper" v-loading="layout==1 ? false : !ready" element-loading-background="#2d2d2d">
        <div id="preview-video" class="preview-video"></div>
      </div>
      <div v-show="videoError" class="preview-video-error"><span class="iconfont iconshexiangtou"></span></div>
      <preview-audio :visible="visible" :audioId="selectedAudioDeviceId"></preview-audio>
    </div>
    <div class="form-group">
      <div class="form-item" v-if="layout != 1">
        <span class="label">摄像头</span>
        <div class="form-content">
          <el-select class="v-item" v-model="selectedVideoDeviceId" placeholder="请选择摄像头">
            <el-option
              v-for="videoDevice in videoDevices"
              :key="videoDevice.deviceId"
              :value="videoDevice.deviceId"
              :label="videoDevice.label"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <span class="label">麦克风</span>
        <div class="form-content">
          <el-select class="v-item" v-model="selectedAudioDeviceId" placeholder="请选择麦克风">
            <el-option
              v-for="audioDevice in audioDevices"
              :key="audioDevice.deviceId"
              :value="audioDevice.deviceId"
              :label="audioDevice.label"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div
        class="form-item"
        v-if="roleName == '1' && selectedVideoDeviceId && layout!=1"
      >
        <span class="label">画质</span>
        <div class="form-content">
          <el-select class="v-item" v-model="selectedRate" placeholder="请选择画质">
            <el-option v-for="rate in rates" :key="rate.label" :value="rate.label" :label="formatDefinition(rate.label)"></el-option>
          </el-select>
        </div>
      </div>
      <div
        class="form-item"
        v-if="roleName == '1' && layout!=1"
      >
        <span class="label">桌面共享</span>
        <div class="form-content">
          <el-select :disabled="status==1" class="v-item" v-model="selectedScreenRate" placeholder="请选择桌面共享画质">
            <el-option v-for="rate in screenRates" :key="rate.label" :value="rate.value" :label="rate.label"></el-option>
          </el-select>
          <el-tooltip placement="top">
            <div slot="content">
              <div class="help-tips">
                <p style="line-height: 20px">1.PPT静态演示：适用于桌面共享时演示文档、图片等静态内容；</p>
                <p style="line-height: 20px">2.视频动态演示：适用于演示视频等多动画内容；</p>
                <p style="line-height: 20px">3.直播中不可更改；</p>
              </div>
            </div>
            <span class="iconfont iconwenda1"></span>
          </el-tooltip>
        </div>
      </div>
      <div class="form-item layout" v-if="roleName == '1'&&layout!=2 && isInteract == 1">
        <span class="label">
          观看端布局
          <br />&nbsp;&nbsp;&nbsp;&nbsp;(视频)
        </span>
        <div class="form-content">
          <ul class="broad-layout" :class="{disabled:status==1}" :title="status==1?'直播过程中不可更改':''">
            <li
              v-for="(l,index) in layoutList"
              :key="l"
              class="layout-item"
              @click="status == 1 ? () => {} : selectLayout(l)"
            >
              <div :class="selectedLayout == l?'bg selected':'bg'"></div>
              <span>{{layoutHash[index]}}</span>
            </li>
          </ul>
          <el-tooltip placement="top">
            <div slot="content">
              <div class="help-tips">
                <p style="line-height: 20px">直播中不可更改观看布局</p>
              </div>
            </div>
            <span class="iconfont iconwenda1 layout-icon"></span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button class="refresh" @click="refresh">刷新设备</button>
      <button class="save" @click="openConfirm">保存</button>
    </div>
    <SaasAlert
        :visible="popAlertVisible"
        :confirm="true"
        @onClose="popAlertClose"
        @onSubmit="popAlertSubmit"
        @onCancel="popAlertClose"
        :title="'提示'"
      >
        <div slot="content">修改设置后会导致重新推流，是否继续保存？</div>
      </SaasAlert>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import PreviewAudio from './preview-audio';
import SaasAlert from '../saas-popup/alert';
export default {
  name: 'MediaSettings',
  props: {
    // 是否 - 已经显示
    editorAble: {
      required: true
    },
    roleName: {
      required: true
    },
    isInteract: {
      required: true
    },
    layout: {
      required: true
    },
    roomId: {
      required: true
    },
    vssToken: {
      required: true
    },
    visible: {
      required: true
    },
    status: {
      required: true // 直播状态
    }
  },
  components: {
    PreviewAudio,
    SaasAlert
  },
  data () {
    return {
      $SDKINSTANCE: null,
      audioDevices: [],
      videoDevices: [],
      rates: [],
      selectedVideoDeviceId: '',
      selectedAudioDeviceId: '',
      selectedRate: '',
      selectedScreenRate: '',
      screenRates: [{value: 'RTC_SCREEN_PROFILE_1080P_16x9_H', label: '视频动态演示模式'}, {value: 'RTC_SCREEN_PROFILE_1080P_16x9_M', label: 'PPT静态演示模式'}],
      layoutList: [
        'CANVAS_LAYOUT_PATTERN_FLOAT_6_5D',
        'CANVAS_LAYOUT_PATTERN_TILED_6_1T5D',
        'CANVAS_LAYOUT_PATTERN_GRID_4_M'
      ],
      selectedLayout: '',
      layoutHash: {
        0: '主次浮窗',
        1: '主次平铺',
        2: '均匀排列'
      },
      checkResult: false,
      placeholder: '无可用设备',
      popAlertVisible: false,
      ready: false, // 流创建成功时设置为true
      videoError: false // 创建流错误或者无摄像头的时候设置为true
    };
  },
  watch: {
    editorAble (val) {
      if (val) {
        this.$SDKINSTANCE && this.createPreview();
        this.getDeviceInfo(1);
      } else {
        this.$SDKINSTANCE && this.destroyStream();
        this.ready = false;
      }
    },
    selectedVideoDeviceId (val) {
      if (!val) return;
      this.getVideoConstraints(val);
      if (this.editorAble) {
        this.ready = false;
        this.createPreview();
      }
    },
    selectedAudioDeviceId (val) {
      if (!val || !this.selectedVideoDeviceId) return;
      this.getVideoConstraints(this.selectedVideoDeviceId);
      if (this.editorAble) {
        this.ready = false;
        this.createPreview();
      }
    }
  },
  created () {
    this.initEvents();
  },

  mounted () {
    this.selectedVideoDeviceId = sessionStorage.getItem('selectedVideoDeviceId');
    this.selectedAudioDeviceId = sessionStorage.getItem('selectedAudioDeviceId');
    this.selectedRate = sessionStorage.getItem('selectedRate');
  },

  methods: {
    initEvents () {
      EventBus.$on('sdkReady', e => {
        this.$SDKINSTANCE = e.vhallrtc;
        EventBus.$emit('deviceCheck', {});
        if (this.roleName != 3) {
          this.getDeviceInfo();
          this.$SDKINSTANCE.on(VhallRTC.EVENT_DEVICE_CHANGE, () => {
            clearTimeout(this.deviceTimer);
            this.deviceTimer = setTimeout(() => {
              this.destroyStream();
              this.getDeviceInfo();
            }, 1000);
          });
        }
        if (this.editorAble) this.createPreview();
      });
    },

    /**
     *  创建本地预览视频图
     *
     * */
    createPreview () {
      if (!this.checkResult) {
        return;
      }
      this.$SDKINSTANCE && this.destroyStream();
      document.getElementById('preview-video').innerHTML = '';
      console.log('changeddd');
      clearTimeout(this.createTimer);
      this.createTimer = window.setTimeout(() => {
        const options = {
          videoNode: 'preview-video', // 传入本地视频显示容器，必填
          audio: true, // 是否获取音频，选填，默认为true
          video: !!this.selectedVideoDeviceId, // 是否获取视频，选填，默认为true
          profile: VhallRTC.RTC_VIDEO_PROFILE_480P_16x9_M, // 自定义分辨率，使用分辨率模板，选填，与videoQuality参数互斥，优先使用profile参数，推荐使用。
          mute: { audio: false, video: false }, // 是否静音，关视频，选填，默认为false
          videoDevice: this.selectedVideoDeviceId,
          audioDevice: this.selectedAudioDeviceId
        };

        console.log('预览', options);
        if (this.ready) return;
        this.$SDKINSTANCE.createStream(
          options,
          e => {
            this.ready = true;
            this.localStreamId = e.streamId;
            this.videoError = false;
            if (!this.selectedVideoDeviceId) {
              this.videoError = true;
            }
          },
          e => {
            this.ready = false;
            this.videoError = true;
            this.$message.error('创建本地预览流失败,请检查设备');
            console.log('创建本地预览流失败', e);
          }
        );
      }, 500);
    },
    /**
     *  获取设备信息
     *@param {Number} flag - flag为1的时候不触发设备检测成功事件
     *
     * */
    getDeviceInfo (flag) {
      this.$SDKINSTANCE.getDevices(
        {},
        async (devices) => {
          console.log('getDevices', devices);
          this.audioDevices = devices.audioInputDevices.filter((d) => {
            return d.deviceId != 'default' && d.deviceId != 'communications' && d.label;
          });
          this.videoDevices = devices.videoInputDevices.filter((d) => {
            return d.deviceId != 'desktopScreen' && d.label;
          });

          if (this.videoDevices.length) {
            this.selectedVideoDeviceId =
              this.selectedVideoDeviceId ||
              sessionStorage.getItem('selectedVideoDeviceId') ||
              (this.videoDevices[0] && this.videoDevices[0].deviceId);
            if (!this.videoDevices.find((device) => { return device.deviceId == this.selectedVideoDeviceId; })) {
              sessionStorage.removeItem('selectedVideoDeviceId');
              this.selectedVideoDeviceId = '';
              this.videoError = true;
              this.ready = false;
            }
          } else {
            sessionStorage.removeItem('selectedVideoDeviceId');
            this.selectedVideoDeviceId = '';
            this.videoError = true;
            this.ready = false;
          }

          if (this.audioDevices.length) {
            this.selectedAudioDeviceId =
              this.selectedAudioDeviceId ||
              sessionStorage.getItem('selectedAudioDeviceId') ||
              (this.audioDevices[0] && this.audioDevices[0].deviceId);
            if (!this.audioDevices.find((device) => { return device.deviceId == this.selectedAudioDeviceId; })) {
              sessionStorage.removeItem('selectedAudioDeviceId');
              this.selectedAudioDeviceId = '';
            }
          } else {
            sessionStorage.removeItem('selectedAudioDeviceId');
            this.selectedAudioDeviceId = '';
          }

          const savedLayout = sessionStorage.getItem('layout');
          this.selectedLayout =
            this.selectedLayout || (savedLayout != 'null' && savedLayout != 'undefined' ? savedLayout : '') || 'CANVAS_LAYOUT_PATTERN_TILED_6_1T5D';
          if (flag != 1) {
            sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
            sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');
            sessionStorage.setItem('layout', this.selectedLayout || '');
          }
          await this.getVideoConstraints(this.selectedVideoDeviceId);
          const options = {
            videoDevice: this.selectedVideoDeviceId, // 视频Id
            audioDevice: this.selectedAudioDeviceId // 音频Id,
          };
          if (this.roleName == 1) {
            options.layout = this.selectedLayout;
            options.profile = this.selectedRate;
            options.desktopProfile = this.selectedScreenRate;
          }
          // 抛出音视频 检测方法
          if (flag != 1) {
            EventBus.$emit('deviceChange', options);
            EventBus.$emit('deviceSuccess', {
              video: !!(this.videoDevices.length && this.videoDevices[0].deviceId),
              audio: !!(this.audioDevices[0] && this.audioDevices[0].deviceId),
              type: 'deviceCheck'
            });
            sessionStorage.setItem('selectedRate', this.selectedRate || '');
            this.checkResult = true;
          }
        },
        e => {
          sessionStorage.removeItem('selectedVideoDeviceId');
          sessionStorage.removeItem('selectedAudioDeviceId');
          EventBus.$emit('deviceError', {});
          this.videoError = true;
          console.log('获取设备列表失败', e);
        }
      );
    },

    getVideoConstraints (deviceId) {
      if (!this.$SDKINSTANCE) return;
      return new Promise((resolve, reject) => {
        this.$SDKINSTANCE.getVideoConstraints(
          {
            deviceId: deviceId
          },
          constraints => {
            console.log('媒体设置获取设备分辨率列表和对应设备ID', constraints, deviceId);
            this.rates = constraints.filter(item => {
              return item.label == 'RTC_VIDEO_PROFILE_240P_16x9_M' || item.label == 'RTC_VIDEO_PROFILE_480P_16x9_M' || item.label == 'RTC_VIDEO_PROFILE_360P_16x9_M';
            });
            console.log('媒体设置过滤后的设备分辨路', this.rates);
            const speakerDefinition = sessionStorage.getItem('speakerDefinition');
            if (!this.selectedRate) { // 摄像头画质初始值
              if (speakerDefinition && speakerDefinition != 'null' && speakerDefinition != 'undefined') {
                this.selectedRate = speakerDefinition;
              } else {
                this.selectedRate = this.formatDefinition(sessionStorage.getItem('defaultMainscreenDefinition'));
              }
            }
            const screenDefinition = sessionStorage.getItem('screenDefinition');
            if (!this.selectedScreenRate) { // 桌面共享画质初始值
              if (screenDefinition && screenDefinition != 'null' && screenDefinition != 'undefined') {
                this.selectedScreenRate = screenDefinition;
              } else {
                this.selectedScreenRate = 'RTC_SCREEN_PROFILE_1080P_16x9_M';
              }
            }
            resolve();
          },
          e => {
            reject(e);
            console.log('error', e);
          }
        );
      });
    },
    openConfirm () {
      if ((!this.ready || !document.querySelector('#preview-video').innerHTML) && this.layout != 1) return this.$message.error('请检查设备！');
      if (this.status == 1) {
        this.popAlertVisible = true;
      } else {
        this.updateDeviceSetting();
      }
    },
    popAlertClose () {
      this.popAlertVisible = false;
    },
    popAlertSubmit () {
      this.updateDeviceSetting();
      this.popAlertVisible = false;
    },
    updateDeviceSetting () {
      if (this.roleName == '1') {
        this.$vhallFetch('saveMediaSettings', {
          vss_token: this.vssToken,
          room_id: this.roomId,
          definition: this.selectedRate,
          layout: this.selectedLayout,
          screen_definition: this.selectedScreenRate
        }).then(res => {
          const options = {
            videoDevice: this.selectedVideoDeviceId, // 视频Id
            audioDevice: this.selectedAudioDeviceId, // 音频Id,
            profile: this.selectedRate, // 分辨率 profile
            layout: this.selectedLayout,
            desktopProfile: this.selectedScreenRate,
            repushStream: true
          };
          EventBus.$emit('deviceChange', options);

          sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
          sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');
          sessionStorage.setItem('layout', this.selectedLayout || '');
          sessionStorage.setItem('selectedRate', this.selectedRate || '');
          this.$message.success('保存成功！');
          this.$SDKINSTANCE && this.destroyStream();
          this.close();
        });
      } else {
        const options = {
          videoDevice: this.selectedVideoDeviceId, // 视频Id
          audioDevice: this.selectedAudioDeviceId,
          repushStream: true // 音频Id,
        };
        EventBus.$emit('deviceChange', options);

        sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
        sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');
        sessionStorage.setItem('layout', this.selectedLayout || '');
        sessionStorage.setItem('selectedRate', this.selectedRate || '');
        this.$message.success('保存成功！');
        this.$SDKINSTANCE && this.destroyStream();
        this.close();
      }
    },

    refresh () {
      this.getDeviceInfo(1);
    },
    close () {
      this.$emit('close');
    },
    destroyStream () {
      this.localStreamId && this.$SDKINSTANCE.destroyStream({
        streamId: this.localStreamId
      });
      this.localStreamId = null;
    },
    selectLayout (l) {
      this.selectedLayout = l;
    },
    formatDefinition (value = '360') {
      let label = '';
      switch (value) {
        case 'RTC_VIDEO_PROFILE_240P_16x9_M':
          label = '流畅';
          break;
        case 'RTC_VIDEO_PROFILE_480P_16x9_M':
          label = '高清';
          break;
        case 'RTC_VIDEO_PROFILE_360P_16x9_M':
          label = '标清';
          break;
        case '240':
          label = 'RTC_VIDEO_PROFILE_240P_16x9_M';
          break;
        case '480':
          label = 'RTC_VIDEO_PROFILE_480P_16x9_M';
          break;
        case '360':
          label = 'RTC_VIDEO_PROFILE_360P_16x9_M';
          break;
      }
      return label;
    }

  },

  destroyed () {
    this.destroyStream();
  }
};
</script>
<style lang="less">
.el-select-dropdown__list{
  .el-select-dropdown__item.selected{
    color: #606266;
  }
  .el-select-dropdown__item{
    line-height: 26px !important;
    height: initial !important;
    max-width: 250px;
    span{
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
.vhall-mediasetting-content {
  padding: 20px 30px;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  * {
    box-sizing: border-box;
    font: 12px 'Microsoft YaHei';
    color: #444;
  }
  & > .preview-wrap {
    & > .loading-wrapper{
      width: 320px;
      height: 180px;
      z-index: 10;
      overflow: hidden;
      & > .preview-video {
        width: 320px;
        height: 180px;
        margin: auto;
        background-color:black;
        background-size: cover;
        background-position: center;
      }
    }
    & > .preview-video-error {
      width: 320px;
      height: 180px;
      margin: auto;
      background:#F5F5F5;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      & > span{
        font-size: 43px;
        color: #CCCCCC;
      }
    }
  }
  & > .form-group {
    width: 320px;
    display: flex;
    flex-direction: column;
    align-content: center;
    & > .form-item {
      width: 320px;
      margin: auto;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      & > .label {
        width: 72px;
        padding-right: 10px;
        text-align: right;
      }
      & > .form-content {
        flex: 1;
        max-width: 250px;
        position: relative;
        & > .iconfont{
          position: absolute;
          top: 7px;
          right: -20px;
          font-size: 14px;
          color: #D2D2D2;
          &.layout-icon{
            top: 18px;
          }
        }
        .v-item {
          position: relative;
          .el-input {
            width: 250px;
            height: 28px;
            &.is-focus {
              & > .el-input__inner{
                border-color: #fc5659 !important;
              }
            }
            & > .el-input__inner{
                &:focus{
                  border-color: #fc5659 !important;
                }
              }
            input {
              height: 100% !important;
              border-radius: 2px;
            }
            .el-input__icon {
              line-height: 19px;
            }
            &.is-disabled {
              .el-input__inner {
                border-color: #d2d2d2;
                background-color: #f2f2f2;
                color: #999999;
              }
            }
          }
        }
      }
    }
    & > .form-item.layout {
      & > .form-content {
        & > .broad-layout {
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          &.disabled {
            & > li.layout-item {
              cursor: not-allowed;
              &>.bg{
                cursor: not-allowed;
              }
            }
          }
          & > li.layout-item {
            cursor: pointer;
            & > .bg {
              width: 74px;
              height: 50px;
              border-radius: 2px;
              border: 1px solid #c4c4c4;
              background-size: 100% 100%;
            }
            & > .bg.selected {
              border: 1px solid #fc5659;
            }
            & > span {
              display: inline-block;
              width: 100%;
              text-align: center;
            }
          }
          & > li {
            &:first-child {
              & > div {
                background-image: url('../../buTemplates/saas/img/float.png');
              }
            }
            &:nth-child(2) {
              & > div {
                background-image: url('../../buTemplates/saas/img/tiled.png');
              }
            }
            &:nth-child(3) {
              & > div {
                background-image: url('../../buTemplates/saas/img/grid.png');
              }
            }
          }
        }
      }
    }
  }
  & > .btn-group {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
    & > .refresh {
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      margin: 0 auto;
      color: #fff;
      cursor: pointer;
      margin-right: 10px;
      background-color: #aaa;
      border: none;
      &:hover {
        background: #ff3333;
      }
      &:active {
        background: #bd4545;
      }
    }
    & > .save {
      background: #fc5659;
      border-color: #fc5659;
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      margin: 0 auto;
      color: #fff;
      cursor: pointer;
      border: none;
      margin-right: 10px;
      &:hover {
        background: #ff3333;
      }
      &:active {
        background: #bd4545;
      }
    }
  }
}
</style>
