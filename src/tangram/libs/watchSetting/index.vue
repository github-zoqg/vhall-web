<template>
  <div class="vhall-watch-setting">
    <div class="preview-wrap">
      <div class="loading-wrapper" v-show="layout!=2 && !videoError" v-loading="!ready" element-loading-background="#2d2d2d">
        <div id="preview-videos" class="preview-video"></div>
      </div>
      <div v-show="videoError" class="preview-video-error"><span class="iconfont iconshexiangtou"></span></div>
      <preview-audio :visible="visible" :audioId="selectedAudioDeviceId"></preview-audio>
    </div>
    <div class="form-group">
      <div class="form-item" v-if="layout != 2">
        <span class="label">摄像头</span>
        <div class="form-content">
          <el-select class="v-item" placeholder="无可用设备" @change = 'changeAudio' v-model="selectedVideoDeviceId">
            <el-option
              v-for="videoDevice in videoDevices"
              :key="videoDevice.deviceId"
              :value="videoDevice.deviceId"
              :label="videoDevice.label"
              ></el-option
            >
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <span class="label">麦克风</span>
        <div class="form-content">
          <el-select class="v-item" placeholder="无可用设备" @change = 'changeAudio' v-model="selectedAudioDeviceId">
            <el-option
              v-for="audioDevice in audioDevices"
              :key="audioDevice.deviceId"
              :value="audioDevice.deviceId"
              :label="audioDevice.label"
              ></el-option
            >
          </el-select>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button class="refresh" @click="refreshEquip">刷新设备</button>
      <button class="save" @click="save">保存</button>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import PreviewAudio from '../media-settings/preview-audio';
export default {
  name: 'MediaSettings',
  props: {
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
    }
  },
  components: {
    PreviewAudio
  },
  data () {
    return {
      streamed: '',
      $SDKINSTANCE: null,
      audioDevices: [],
      videoDevices: [],
      rates: [],
      selectedVideoDeviceId: '',
      selectedAudioDeviceId: '',
      selectedRate: '',
      checkResult: false,
      ready: false,
      videoError: false // 创建流错误或者无摄像头的时候设置为true
    };
  },
  watch: {
    editorAble (val) {
      console.log(val, 'vallll');
      if (val) {
        this.vhallCheckings();
        this.createPreview();
      } else {
        this.destoryPreview();
      }
    },
    selectedVideoDeviceId (val) {
      if (val) {
        if (this.editorAble) {
          this.ready = false;
          this.createPreview();
        }
      }
    }
  },
  mounted () {
    this.vhallCheckings();
  },
  methods: {
    // 改变设备
    changeAudio () {
      this.destoryPreview();
      this.createPreview();
    },
    // 刷新设备
    refreshEquip () {
      this.vhallCheckings();
    },
    // 保存按钮
    save () {
      if (!this.ready) {
        this.$message({
          message: `保存失败，请检查设备`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      const options = {
        videoDevice: this.selectedVideoDeviceId, // 视频Id
        audioDevice: this.selectedAudioDeviceId, // 音频Id,
        repushStream: true
      };
      EventBus.$emit('deviceChange', options);

      sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
      sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');

      this.destoryPreview();

      this.$emit('onCloses');
      this.$message.success('保存成功');
    },
    vhallCheckings () {
      VhallRTC.getDevices({
      }, (devices) => {
        console.log(devices, 'devices12');
        if (devices) {
          this.audioDevices = devices.audioInputDevices.filter((d) => {
            return d.deviceId != 'default' && d.deviceId != 'communications' && d.label;
          });
          if (!this.audioDevices.find(d => d.deviceId == sessionStorage.getItem('selectedAudioDeviceId'))) {
            sessionStorage.setItem('selectedAudioDeviceId', '');
          }
        }
        this.selectedAudioDeviceId = sessionStorage.getItem('selectedAudioDeviceId') || (this.audioDevices[0] && this.audioDevices[0].deviceId);
        sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');
        if (devices) {
          this.videoDevices = devices.videoInputDevices.filter((d) => {
            return d.deviceId != 'desktopScreen' && d.label;
          });
        }
        if (!this.videoDevices.find(d => d.deviceId == sessionStorage.getItem('selectedVideoDeviceId'))) {
          sessionStorage.setItem('selectedVideoDeviceId', '');
        }
        this.selectedVideoDeviceId = sessionStorage.getItem('selectedVideoDeviceId') || (this.videoDevices[0] && this.videoDevices[0].deviceId);
        sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
        console.log(this.videoDevices, 'videoDevices');
      },
      e => {
        console.log('获取设备列表失败', e);
      });
    },
    /**
       *  创建本地预览视频图
       *
       * */
    createPreview () {
      let opt = {
        videoNode: 'preview-videos', // 传入本地视频显示容器，必填
        audio: true, // 是否获取音频，选填，默认为true
        video: true, // 是否获取视频，选填，默认为true
        profile: VhallRTC.RTC_VIDEO_PROFILE_240P_16x9_M, // 自定义分辨率，使用分辨率模板，选填，与videoQuality参数互斥，优先使用profile参数，推荐使用。// 自定义分辨率、码率、帧率(5-30)，选填 不使用profile模板时可选填，初学者不推荐使用。
        mute: {audio: false, video: false}, // 是否静音，关视频，选填，默认为false
        videoDevice: this.selectedVideoDeviceId, // 视频设备id，选填 默认为系统缺省
        audioDevice: this.selectedAudioDeviceId // 视频设备id，选填 默认为系统缺省
      };

      console.log('>>>>>>>>>>>>>>>>>>>>创建本地预览');
      clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => {
        this.destoryPreview();
        VhallRTC.startPreview(opt, (devices) => {
          this.streamed = devices.streamId;
          console.log('>>>>>>>>>>>>>>>>>>>devices', devices);
          this.videoError = false;
          this.ready = true;
        },
        e => {
          this.ready = false;
          this.videoError = true;
          console.log('v创建本地流失败>>>', e);
        });
      }, 1000);
    },
    destoryPreview () {
      console.log('this.stremaed>>>>>>>>>>>>>>>>>>>>>>', this.streamed);
      let opts = {
        streamId: this.streamed
      };
      VhallRTC.stopPreview(opts, (res) => {
        console.log('本地流销毁成功', res);
        this.ready = false;
      }, (e) => {
        console.log('本地流销毁失败', e);
      });
      document.getElementById('preview-videos').innerHTML = '';
    }
  }

};
</script>
<style lang="less">
/deep/.el-select-dropdown__list{
  .el-select-dropdown__item.selected{
    color: #606266;
  }
  .el-select-dropdown__item{
    line-height: 26px !important;
    height: initial !important;
    max-width: 248px;
    span{
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
/deep/.vhall-watch-setting {
  padding: 20px 40px;
  width: 100%;
  background-color: white;
  * {
    box-sizing: border-box;
    font: 12px 'Microsoft YaHei';
    color: #444;
  }
  & > .preview-wrap {
    #preview-audio{
      width: 300px;
    }
    & > .loading-wrapper{
      width: 300px;
      height: 169px;
      z-index: 10;
        & > .preview-video {
          overflow: hidden;
          width: 300px;
          height: 169px;
          margin: auto;
          background-color:black;
          background-size: cover;
          background-position: center;
        }
      }
      & > .preview-video-error {
        width: 300px;
        height: 169px;
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
    & > .form-item {
      margin: auto;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      & > .label {
        width: 52px;
      }
      & > .form-content {
        flex: 1;
        max-width: 248px;
        & > .v-item {
          position: relative;
          .el-input {
            width: 248px;
            height: 28px;
            input {
              height: 100% !important;
              border-radius: 2px;
            }
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
          & > li.layout-item {
            cursor: pointer;
            & > .bg {
              width: 60px;
              height: 40px;
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
    margin-bottom: 10px;
    margin-top: 25px;
    & > .refresh {
      outline: none;
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
