<template>
  <el-dialog
    class="vh-check"
    :visible.sync="isShow"
    center
    destroy-on-close
    @open="restart"
    @close="stopPreview"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="'15vh'"
  >
    <el-steps v-if="currentStep != 3" :active="currentStep" finish-status="success" :class="{audio: layout == 1}">
      <el-step v-if="layout != 1" :title="videoStatus == 'process' ? '检测中' : '摄像头'" :status="videoStatus" :class="videoStatus">
        <span slot="icon" class="iconfont iconicon-video"></span>
      </el-step>
      <el-step :title="audioStatus == 'process' ? '检测中' : '麦克风'" :status="audioStatus" :class="audioStatus">
        <span slot="icon" class="iconfont iconicon-microphoneon"></span>
      </el-step>
      <el-step :title="audioOutputStatus == 'process' ? '检测中' : '扬声器'" :status="audioOutputStatus" :class="audioOutputStatus">
        <span slot="icon" class="iconfont iconicon-volumeon"></span>
      </el-step>
    </el-steps>
    <div v-if="currentStep == 0" class="vh-video-preview-wrapper">
      <div v-show="!videoError" v-loading="!ready&&!videoError" element-loading-background="#2d2d2d">
        <div id="vh-device-check-video"></div>
      </div>
      <div v-show="videoError" class="preview-video-error"><span class="iconfont iconicon-video"></span></div>
      <div class="vh-check-box">
        <div class="vh-check-box__label">摄像头</div>
        <el-select v-model="selectedVideoDeviceId" @change="videoChange">
          <el-option
            v-for="item in videoDevices"
            :key="item.deviceId"
            :value="item.deviceId"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="currentStep == 1" class="vh-audio-preview-wrapper">
      <div class="vh-check-box">
        <div class="vh-check-box__label">麦克风</div>
        <el-select v-model="selectedAudioDeviceId" @change="audioChange">
          <el-option
            v-for="item in audioDevices"
            :key="item.deviceId"
            :value="item.deviceId"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="vh-check-box">
        <div class="vh-check-box__label"> </div>
        <preview-audio ref="previewAudio" :audioId="selectedAudioDeviceId"></preview-audio>
      </div>
    </div>
    <div v-if="currentStep == 2" class="vh-audiooutput-preview-wrapper">
      <div class="vh-check-box" v-show="!isSafari">
        <div class="vh-check-box__label">扬声器</div>
        <el-select v-model="selectedAudioOutputDeviceId" @change="audioOutputChange">
          <el-option
            v-for="item in audioOutputDevices"
            :key="item.deviceId"
            :value="item.deviceId"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="vh-check-box">
        <span class="vh-check-box__label">音量</span>
        <el-slider v-model="volume" :show-tooltip="false" :min="0" :max="1" :step="0.1"></el-slider>
      </div>
      <div class="play-button">
        <span v-if="audioPaused" class="iconfont iconicon-pause" @click="playAudio()"></span>
        <span v-else class="iconfont iconicon-play1" @click="playAudio()"></span>
        点此播放声音
      </div>
      <audio ref="outputAudioPlayer" id="outputAudioPlayer" loop>
        <source src="./audio.mp3" type="audio/mp3" />This browser does not support the audio element.
      </audio>
    </div>
    <div class="check-end" v-if="currentStep == 3">
      <div class="check-end-icon success" v-if="videoStatus == 'success' && audioStatus == 'success' && audioOutputStatus == 'success'">
        <span class="iconfont iconicon-right"></span>
        <div class="check-end-text">设备检测正常</div>
      </div>
      <div class="check-end-icon fail" v-else>
        <div class="iconfont-fail"><span class="iconfont iconguanbi2"></span></div>
        <div class="check-end-text">设备检测异常</div>
      </div>
    </div>
    <div v-if="currentStep == 3" class="vh-check-result">
      <div class="vh-check-result__item">
        <span>检测项目</span>
        <span>检测结果</span>
      </div>
      <div class="vh-check-result__item" v-if="layout != 1">
        <span>摄像头</span>
        <span :class="videoStatus">
          <span v-if="videoStatus == 'success'"><span class="iconfont iconicon-rightsmall"></span>正常</span>
          <span v-else><span class="iconfont iconicon-error"></span>异常</span>
        </span>
      </div>
      <div class="vh-check-result__item">
        <span>麦克风</span>
        <span :class="audioStatus">
          <span v-if="audioStatus == 'success'"><span class="iconfont iconicon-rightsmall"></span>正常</span>
          <span v-else><span class="iconfont iconicon-error"></span>异常</span>
        </span>
      </div>
      <div class="vh-check-result__item">
        <span>扬声器</span>
        <span :class="audioOutputStatus">
          <span v-if="audioOutputStatus == 'success'"><span class="iconfont iconicon-rightsmall"></span>正常</span>
          <span v-else><span class="iconfont iconicon-error"></span>异常</span>
        </span>
      </div>
    </div>
    <div class="vh-footer">
      <template v-if="currentStep == 0">
        <div class="vh-check-tip"><span class="iconfont iconicon-video icon-tip"></span><span>您能看到摄像头画面吗？</span></div>
        <div class="button-container">
          <el-button class="confirm" :class="{disable: !ready || videoError}" @click="checkVideoSuccess">能看到</el-button>
          <el-button class="cancel" :class="{disable: !ready}" @click="checkVideoFail">看不到</el-button>
        </div>
      </template>
      <template v-else-if="currentStep == 1">
        <div class="vh-check-tip"><span class="iconfont iconicon-microphoneon icon-tip"></span><span>对着麦克风讲话，您能看到音量条波动么？</span></div>
        <div class="button-container">
          <el-button class="confirm" :class="{disable: !audioReady}" @click="checkAudioSuccess">能看到</el-button>
          <el-button class="cancel" :class="{disable: !audioReady}" @click="checkAudioFail">看不到</el-button>
        </div>
      </template>
      <template v-else-if="currentStep == 2">
        <div class="vh-check-tip"><span class="iconfont iconicon-volumeon icon-tip"></span><span>点击播放键，您能听到声音么？</span></div>
        <div class="button-container">
          <el-button  class="confirm" :class="{disable: !speakerReady}" @click="checkAudioOutputSuccess">能听到</el-button>
          <el-button class="cancel" :class="{disable: !speakerReady}" @click="checkAudioOutputFail">听不到</el-button>
        </div>
      </template>
      <template v-else>
        <div>
          <el-button v-if="videoStatus != 'success' || audioStatus != 'success' || audioOutputStatus != 'success'" @click="restart" class="confirm">重新检测</el-button>
          <el-button
            v-if="videoStatus == 'success' && audioStatus=='success'"
            :class="audioOutputStatus != 'success' ? 'cancel' : 'confirm'"
            @click="checkFinish"
          >{{this.roleName == 1 ? '去直播' : '马上互动'}}</el-button>
        </div>
      </template>
    </div>
    <div v-if="currentStep == 3 && (videoStatus != 'success' || audioStatus != 'success' || audioOutputStatus != 'success')" class="test-failed">
      <span class="iconfont iconicon-help"></span>
      <a
        class="vh-check-help"
        href="https://www.vhall.com/saas/doc/1722.html"
        target="_blank"
      >帮助与支持</a>
    </div>
  </el-dialog>
</template>
<script>
// 兼容2.1.6返回的分辨率
import PreviewAudio from './previewAudio';
import EventBus from '@/utils/Events';
const RESOLUTION_REG = /((^VIDEO_PROFILE_(720P|540P|480P|360P)_1$)|(^RTC_VIDEO_PROFILE_(720P|540P|480P|360P)_16x9_M$))/;
export default {
  data () {
    return {
      isShow: false,
      videoDevices: [],
      audioDevices: [],
      audioOutputDevices: [],
      selectedVideoDeviceId: '',
      selectedAudioDeviceId: '',
      selectedAudioOutputDeviceId: '',
      selectedRate: '',
      previewWidth: 0,
      rafID: null,
      analyserNode: null,
      currentStep: this.layout == 1 ? 1 : 0,
      videoStatus: this.layout == 1 ? 'success' : 'process',
      audioStatus: this.layout == 1 ? 'process' : 'wait',
      audioOutputStatus: 'wait',
      videoError: false,
      ready: this.layout != 1,
      volume: 0.5,
      audioPaused: true,
      audioReady: false, // 麦克风状态
      speakerReady: !!this.isSafari, // 扬声器状态
      isSafari: navigator.userAgent.match(/Version\/([\d.]+).*Safari/) // 是否为safari浏览器
    };
  },
  props: {
    roleName: {
      required: true
    },
    layout: {
      required: true
    }
  },
  created () {
    console.log(this.layout, 'layout', this.currentStep);
    window.ddd = this;
  },
  mounted () {
    this.selectedVideoDeviceId = sessionStorage.getItem('selectedVideoDeviceId') || '';
    this.selectedAudioDeviceId = sessionStorage.getItem('selectedAudioDeviceId') || '';
  },
  watch: {
    volume (value) {
      this.$refs.outputAudioPlayer && (this.$refs.outputAudioPlayer.volume = value);
    },
    currentStep (value) {
      console.log(this.layout, 'layout', this.currentStep, value);
      if (value == 2) {
        setTimeout(() => {
          this.$refs.outputAudioPlayer && this.$refs.outputAudioPlayer.addEventListener('pause', () => {
            this.audioPaused = true;
          });
          this.$refs.outputAudioPlayer && this.$refs.outputAudioPlayer.addEventListener('play', () => {
            this.audioPaused = false;
          });
        }, 100);
      }
    }
  },
  components: {
    PreviewAudio
  },
  methods: {
    show () {
      this.isShow = true;
      this.ready = false;
      this.videoError = false;
    },
    /**
     * 获取设备
     */
    getVideoDeviceInfo () {
      return new Promise((resolve, reject) => {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => {
            stream.getTracks().forEach(trackInput => {
              trackInput.stop();
            });

            this.getDevices().then(res => {
              this.startPreviewVideo();
            });
          })
          .catch(error => {
            console.warn('获取视频设备失败', error);

            reject(error);
          });
      });
    },
    getAudioDeviceInfo () {
      return new Promise((resolve, reject) => {
        this.getDevices().then(res => {
          navigator.mediaDevices
            .getUserMedia({ audio: {deviceId: this.selectedAudioDeviceId} })
            .then(stream => {
              stream.getTracks().forEach(trackInput => {
                trackInput.stop();
              });
              resolve();
            })
            .catch(error => {
              reject(error);
            });
          this.$refs.previewAudio && this.$refs.previewAudio.initAudio(this.selectedAudioDeviceId);
        }).catch((error) => {
          console.log('获取设备失败');
          reject(error);
        });
      });
    },
    // sdk获取设备列表
    getDevices () {
      return new Promise((resolve, reject) => {
        VhallRTC.getDevices(
          {},
          async devices => {
            try {
              console.log('================devices==========', devices);
              this.audioDevices = devices.audioInputDevices.filter(
                d => d.deviceId != 'default' && d.deviceId != 'communications' && d.label
              );
              this.videoDevices = devices.videoInputDevices.filter(d => d.label && d.deviceId != 'desktopScreen');
              this.audioOutputDevices = devices.audioOutputDevices.filter(d => d.label);
              if (this.videoDevices.length) {
                this.selectedVideoDeviceId =
                  this.selectedVideoDeviceId ||
                  sessionStorage.getItem('selectedVideoDeviceId') ||
                  (this.videoDevices[0] && this.videoDevices[0].deviceId);
              } else {
                sessionStorage.removeItem('selectedVideoDeviceId');
              }

              if (this.audioDevices.length) {
                this.selectedAudioDeviceId =
                  this.selectedAudioDeviceId ||
                  sessionStorage.getItem('selectedAudioDeviceId') ||
                  (this.audioDevices[0] && this.audioDevices[0].deviceId);
              } else {
                sessionStorage.removeItem('selectedAudioDeviceId');
              }
              this.selectedAudioOutputDeviceId = this.audioOutputDevices[0] && this.audioOutputDevices[0].deviceId;
              resolve();
            } catch (e) {
              sessionStorage.removeItem('selectedVideoDeviceId');
              sessionStorage.removeItem('selectedAudioDeviceId');
              reject(e);
            }
          },
          e => {
            console.log('获取设备列表失败', e);
            reject(e);
          }
        );
      });
    },
    /**
     * 视频Id变换
     */
    videoChange () {
      this.ready = false;
      this.startPreviewVideo();
    },
    /**
     * 麦克风变化
     */
    audioChange () {
      navigator.mediaDevices
        .getUserMedia({ audio: {deviceId: this.selectedAudioDeviceId} })
        .then(stream => {
          stream.getTracks().forEach(trackInput => {
            trackInput.stop();
          });
          console.log(stream, 'hh');
          this.audioReady = true;
        })
        .catch(() => {
          this.audioReady = true;
        });
      this.$refs.previewAudio && this.$refs.previewAudio.initAudio(this.selectedAudioDeviceId);
    },
    /**
     * 切换扬声器
     */
    audioOutputChange () {
      const audioPlayer = this.$refs.outputAudioPlayer;
      if (typeof audioPlayer.sinkId !== 'undefined') {
        audioPlayer
          .setSinkId(this.selectedAudioOutputDeviceId)
          .then(() => {})
          .catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
          });
      } else {
        console.warn('Browser does not support output device selection.');
      }
    },
    /**
     * 预览·
     */
    async startPreviewVideo () {
      if (this.localStreamId) {
        await this.stopPreviewVideo();
      }
      let opts = {
        videoNode: 'vh-device-check-video', // 传入本地视频显示容器，必填
        audio: false, // 是否获取音频，选填，默认为true
        videoDevice: this.selectedVideoDeviceId,
        profile: VhallRTC.RTC_VIDEO_PROFILE_240P_16x9_M
      };
      console.log('opts', opts);
      VhallRTC.startPreview(
        opts,
        e => {
          this.localStreamId = e.streamId;
          this.ready = true;
          this.videoError = false;
          console.log('创建预览成功', JSON.stringify(e));
        },
        error => {
          this.ready = false;
          this.videoError = true;
          this.$message.error('视频预览失败，请检查设备');
          console.error('创建本地预览流失败', error);
        }
      );
    },
    stopPreviewVideo () {
      return new Promise((resolve, reject) => {
        VhallRTC.stopPreview(
          {
            streamId: this.localStreamId
          },
          () => {
            console.log('销毁预览成功');
            this.ready = false;
            this.videoError = false;
            this.localStreamId = '';
            resolve();
          },
          error => {
            this.ready = false;
            this.videoError = false;
            console.error('销毁预览失败', error);
            reject(error);
          }
        );
      });
    },
    /**
     * 获取设备分辨率
     */
    getVideoConstraints (deviceId) {
      return new Promise((resolve, reject) => {
        VhallRTC.getVideoConstraints(
          {
            deviceId: deviceId
          },
          constraints => {
            if (constraints.length == 0) {
              console.error('未获取到分辨率');
              this.selectedRate = '';
              this.rates = [];
            } else {
              console.log('constraints', constraints);
              this.rates = constraints.filter(item => RESOLUTION_REG.test(item.label));
              console.log('设备分辨率：', this.rates);
              this.selectedRate = (this.rates[0] && this.rates[0].label) || '';
            }
            resolve();
          },
          e => {
            console.log('error', e);
            reject(e);
          }
        );
      });
    },
    checkVideoFail () {
      this.videoStatus = 'error';
      this.audioStatus = 'process';
      this.currentStep = 1;
      this.stopPreview();
      setTimeout(() => {
        this.getAudioDeviceInfo().then(() => {
          this.audioReady = true;
        }).catch(() => {
          this.audioReady = true;
        });
      }, 20);
    },
    checkVideoSuccess () {
      if (!this.ready) return;
      this.videoStatus = 'success';
      this.audioStatus = 'process';
      this.currentStep = 1;
      this.stopPreview();
      setTimeout(() => {
        this.getAudioDeviceInfo().then(() => {
          this.audioReady = true;
        }).catch(() => {
          this.audioReady = true;
        });
      }, 20);
    },
    checkAudioFail () {
      this.audioStatus = 'error';
      this.audioOutputStatus = 'process';
      this.currentStep = 2;
      setTimeout(() => {
        this.audioOutputChange();
      }, 20);
    },
    checkAudioSuccess () {
      if (!this.audioReady) return;
      this.audioStatus = 'success';
      this.audioOutputStatus = 'process';
      this.currentStep = 2;
      setTimeout(() => {
        this.audioOutputChange();
      }, 20);
    },
    checkAudioOutputFail () {
      this.audioOutputStatus = 'error';
      this.currentStep = 3;
    },
    checkAudioOutputSuccess () {
      this.audioOutputStatus = 'success';
      this.currentStep = 3;
    },
    restart () {
      this.ready = false;
      this.videoError = false;
      this.currentStep = this.layout == 1 ? 1 : 0;
      this.videoStatus = this.layout == 1 ? 'success' : 'process';
      this.audioStatus = this.layout == 1 ? 'process' : 'wait';
      this.audioOutputStatus = 'wait';
      this.videoDevices = [];
      this.audioDevices = [];
      if (this.layout == 1) {
        this.getAudioDeviceInfo().then(() => {
          this.audioReady = true;
        }).catch(() => {
          this.audioReady = true;
        });
      } else {
        this.getVideoDeviceInfo().catch((e) => {
          this.$message.error('获取摄像头失败，请检查是否被占用或者被禁用');
          this.videoError = true;
          this.ready = true;
          this.selectedVideoDeviceId = '';
          sessionStorage.setItem('selectedVideoDeviceId', '');
        });
      }
    },
    checkFinish () {
      this.isShow = false;
      EventBus.$emit('MEDIACHECK_FINISH', {
        selectedVideoDeviceId: this.selectedVideoDeviceId,
        selectedAudioDeviceId: this.selectedAudioDeviceId
      });
    },
    stopPreview () {
      if (this.localStreamId) {
        this.stopPreviewVideo();
      }
    },
    playAudio () {
      if (this.$refs.outputAudioPlayer) {
        if (this.audioPaused) {
          if (!this.selectedAudioOutputDeviceId && !this.isSafari) return;
          this.$refs.outputAudioPlayer.play();
          this.speakerReady = true;
        } else {
          this.$refs.outputAudioPlayer.pause();
        }
      }
    }
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
    max-width: 294px !important;
    span{
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
.vh-check {
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .el-dialog {
    width: 420px;
    height: 500px;
    border-radius: 4px;
    margin: auto !important;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-bottom: 0 !important;
    padding-top: 30px !important;
    padding-right: 40px !important;
    padding-left: 40px !important;
    border-top: 4px #FC5659 solid;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    height: 500px;
    flex-direction: column;
    box-sizing: border-box;
  }
  .el-steps{
    &.audio{
      width: 191px;
      margin-left: auto;
      margin-right: auto;
      &>.el-step{
        &>.el-step__head {
          &>.el-step__line{
            height: 1px;
            top: 19px;
            width: 90px;
            left: 33%;
            background: #E8E8E8;
            &>.el-step__line-inner {
                display: none;
              }
          }
        }
      }
    }
    &>.el-step{
      &>.el-step__head {
        &>.el-step__line{
          height: 1px;
          top: 19px;
          width: 90px;
          left: 33%;
          background: #E8E8E8;
          &>.el-step__line-inner {
              display: none;
            }
        }
        &>.el-step__icon{
          border: none;
          height: 40px;
          width: 40px;
          background-color: #FC5659;
          color: white;
          line-height: 40px;
          &>.el-icon-check{
            font-size: 22px;
            font-weight: normal;
          }
          &>.el-icon-close{
            font-size: 22px;
            font-weight: normal;
          }
          &>.iconfont{
            font-size: 24px;
          }
        }
        &.is-wait{
          &>.el-step__icon{
          background-color: #E8E8E8;
          color: #666666;
        }
        }
      }
    }
  }
  .el-step__title {
    font-size: 12px;
    line-height: 31px;
    color: #666;
    &.is-process{
      color: #FC5659;
      font-weight: normal;
    }
    &.is-wait{
      color: #606266;
      font-weight: normal;
    }
    &.is-success{
      color: #606266;
      font-weight: normal;
    }
  }
  .el-input {
      width: 294px;
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
        line-height: 32px;
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
  .vh-video-preview-wrapper {
    width: 340px;
    margin: 0 auto;
    margin-top: 4px;
    &>div{
      #vh-device-check-video {
        border-radius: 4px;
        overflow: hidden;
        width: 340px;
        height: 191px;
        background-color: black;
      }
    }
    & > .preview-video-error {
      width: 340px;
      height: 191px;
      margin: auto;
      background:#000000;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      & > span{
        font-size: 56px;
        color: #666666;
      }
    }
  }
  .vh-audio-preview-wrapper {
    width: 340px;
    margin: 0 auto;
    height: 191px;
    margin-top: 4px;
  }
  .vh-audiooutput-preview-wrapper{
    width: 340px;
    margin: 0 auto;
    height: 191px;
    margin-top: 4px;
  }
  .vh-check-box {
    display: flex;
    align-items: center;
    margin-top: 16px;
    .el-input{
      height: 32px;
    }
    .el-select {
      flex: 1;
    }
    .el-slider {
      flex: 1;
    }
    .el-slider__bar{
      background-color: #FFC059;
    }
    .el-slider__button-wrapper{
      cursor: pointer;
      &.hover{
        cursor: pointer;
      }
      &:hover{
        cursor: pointer;
      }
    }
    .el-tooltip{
      width: 17px;
      height: 17px;
      background: rgba(255,255,255,1);
      box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.2);
      border-radius: 50%;
      border: none;
      &:hover{
        transform: scale(1) !important;
        cursor: pointer;
      }
      &.hover{
        transform: scale(1) !important;
        cursor: pointer;
      }
    }
    &__label {
      min-width: 48px;
      font-size: 12px;
    }
  }
  .play-button{
    width: 160px;
    height: 32px;
    background: rgba(237,237,237,1);
    border-radius: 2px;
    line-height: 32px;
    display: flex;
    justify-content: center;
    margin-left: 48px;
    margin-top: 10px;
    &>.iconfont{
      color: #FFC059;
      cursor: pointer;
      margin-right: 5px;
      font-size: 18px;
    }
  }
  .vh-check-tip {
    margin-bottom: 32px;
    text-align: center;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    &>.iconfont{
      font-size: 18px;
    }
  }
  .vh-check-result {
    text-align: center;
    height: 150px;
    &__item {
      margin: 0 auto;
      display: flex;
      width: 340px;
      height: 32px;
      color: #333333;
      line-height: 32px;
      font-size: 12px;
      &:nth-child(odd) {
        background:rgba(232,232,232,1);
      }
      &:nth-child(even) {
        background:rgba(232,232,232,0.3);
      }
      & > span {
        &:first-child{
          padding-left: 40px;
          text-align: left;
        }
        &:nth-child(2) {
          padding-left: 120px;
          text-align: left
        }
        flex: 1;
        &>span{
            &>.iconfont{
              vertical-align: bottom;
              padding-right: 2px;
            }
          }
        &.error {
          color: #f56c6c;
        }
        &.success {
          color: #5EA6EC;
        }
      }
    }
    .vh-check-help {
      display: block;
      margin-top: 40px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
   .vh-footer {
    text-align: center;
    margin-bottom: 30px;
    margin-top: 34px;
    & > div {
       &.button-container{
          width: 214px;
          display: flex;
          justify-content: space-between;
          margin: auto;
       }
       & > button {
        display: inline-block;
        padding: 0;
        width: 100px;
        height: 30px;
        line-height: 28px;
        border-radius: 2px;
        border-color: #999;
        border: 1px solid #d2d2d2;
        display: inline-block;
        margin-bottom: 0;
        font-size: 12px;
        color: #666;
        font-weight: 400;
        text-align: center;
        &.disable{
          pointer-events: none;
          background-color: #aaa !important;
          color: white;
          border: none;
        }
        &:active{
          background: #bd4545;
        }
        &.confirm {
          background: #FC5659;
          border: none;
          color: white;
          line-height: 28px;
          &:active{
            background: #bd4545;
          }
        }
        &.cancel {
          background: white;
          &:active{
            background: #bd4545 !important;
            border: none;
            color: white;
            line-height: 28px;
            border: none;
          }
          &:hover{
            background: #FC5659;
            border: none;
            color: white;
            line-height: 28px;
            border: none;
          }
        }
      }
    }
    .icon-tip {
      color: #FC5659;
      padding-right: 3px;
    }
  }
  .test-failed{
      margin-left: -26px;
      margin-bottom: 12px;
      &>.iconfont {
        font-size: 15px;
        color: #666666;
        vertical-align: middle;
      }
      &>a{
        font-size: 12px;
        color: #666666;
      }
    }
  .check-end{
    height: 164px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding-bottom: 10px;
    box-sizing: border-box;
    padding-bottom: 14px;
    &>.check-end-icon{
      display: flex;
      flex-direction: column;
      align-items: center;
      &>.iconfont-fail{
        height: 48px;
        width: 48px;
        border: 3px solid #FC5659;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        &>.iconfont{
          font-size: 24px;
        }
      }
      &>.iconfont{
        font-size: 48px;
      }
      &>.check-end-text{
        font-size: 16px;
        margin-top: 7px;
      }
      &.success{
        color: #5EA6EC;
      }
      &.fail{
        color: #FC5659;
      }
    }
  }
}
</style>
