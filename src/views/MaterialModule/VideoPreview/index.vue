<template>
  <div class="preview-wrap">
    <div
      class="content content-player"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-background="rgba(0,0,0,.9)"
      @mousemove="wrapEnter"
      @mouseleave="wrapLeave"
    >
      <div id="videoDom"></div>
      <div
        class="tips"
        v-if="!loading"
        :class="
          videoType.toLowerCase() == '.mp3' || videoType.toLowerCase() == '.mav' ? '' : 'tipsIndex'
        "
      >
        <div
          class="video-img"
          v-if="videoType.toLowerCase() == '.mp3' || videoType.toLowerCase() == '.mav'"
        >
          <!-- <img class="audio-img" :src="audioImg" alt=""> -->
          <p>语音播放中</p>
        </div>
        <div v-if="tipsType == 2" class="video-end">
          <div class="reset-play" @click="resetPlay">
            <i class="iconfont-v3 saasicon_replay"></i>
            <p>重新播放</p>
          </div>
          <!-- <el-button class="reset-play" @click="resetPlay">再次播放</el-button> -->
        </div>
      </div>
      <div v-if="!loading" class="vod-controller" :class="{ active: hoveVideo }">
        <div class="slider line-slider">
          <el-slider
            v-model="sliderVal"
            :show-tooltip="false"
            ref="controllerRef"
            @change="setVideo"
          ></el-slider>
          <div class="Times" :style="{ left: hoverLeft + 'px' }" v-show="TimesShow">
            <span class="current-time">{{ hoverTime | secondToDate }}</span>
          </div>
        </div>
        <div class="wrap">
          <div class="left-box fl">
            <i v-if="!statePaly" class="iconfont-v3 saasicon_zanting" @click="videoPlayBtn"></i>
            <i v-else class="iconfont-v3 saasicon_bofang" @click="videoPlayBtn"></i>
            <div class="center-box">
              <span class="current-time">
                {{ currentTime | secondToDate }}
              </span>
              <span>/</span>
              <span class="all-time">{{ totalTime | secondToDate }}</span>
            </div>
          </div>
          <div class="right-box fr">
            <div class="volume-box">
              <span class="icon-box">
                <i
                  style="color: #ececec"
                  class="iconfont-v3"
                  @click="jingYin"
                  :class="voice > 0 ? 'saasicon_yangshengqion' : 'saasicon_yangshengqioff'"
                ></i>
              </span>
              <div class="ver-slider">
                <el-slider
                  vertical
                  height="100px"
                  :min="0"
                  @change="setVoice"
                  v-model="voice"
                ></el-slider>
              </div>
            </div>
            <i
              v-if="isFullscreen"
              class="iconfont-v3 saasicon_quxiaoquanping"
              @click="exitFullscreen"
            ></i>
            <i v-else class="iconfont-v3 saasicon_quanping" @click="enterFullscreen"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { secondToDateZH } from '@/utils/general';
  import controle from './js/control';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    data() {
      this.$Vhallplayer = null;
      return {
        totalTime: 0,
        currentTime: 0,
        statePaly: true, // 播放状态
        voice: 20, // 音量
        isMute: false, // 是否为静音
        sliderVal: 0, // seek
        hoverTime: 10, // seek显示时间
        hoverLeft: 10,
        TimesShow: false,
        isFullscreen: false, // 全屏
        loading: true,
        hoveVideo: false,
        audioImg: require('@/common/images/gif/video.gif'),
        tipsType: 0 // 1为音频封面   2 播放结束
      };
    },
    mixins: [controle],
    props: ['videoParam'],
    filters: {
      secondToDate(val) {
        return secondToDateZH(val);
      }
    },
    computed: {
      videoType() {
        return this.videoParam.msg_url || this.videoParam.file_type;
      }
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getVideoAppid();
      console.log(this.videoParam, this.videoType, '?123454?????');
    },
    beforeDestroy() {
      if (this.$Vhallplayer) {
        this.$Vhallplayer.destroy();
      }
    },
    methods: {
      getVideoAppid() {
        this.$fetch('getAppid').then(res => {
          this.initSDK(res.data.app_id, res.data.access_token).then(() => {
            this.initSlider();
            this.totalTime = this.$Vhallplayer.getDuration(() => {
              console.log('获取总时间失败');
            });
            this.listen();
          });
        });
      },
      initSDK(app_id, access_token) {
        const incomingData = {
          appId: app_id, // 应用ID，必填
          accountId: this.userId || 1, // 第三方用户ID，必填
          token: access_token, // access_token，必填
          type: 'vod', // live 直播  vod 点播  必填
          videoNode: 'videoDom', // 播放器的容器， div的id 必填
          poster: '', // 封面地址  仅支持.jpg
          vodOption: { recordId: this.videoParam.paas_record_id, forceMSE: false },
          marqueeOption: {
            // 选填
            enable: false, // 默认 false
            text: 'xxx', // 跑马灯的文字
            alpha: 100, // 透明度  100 完全显示   0 隐藏
            size: 18, // 文字大小
            color: '#ff8d41', //  文字颜色
            interval: 20, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
            speed: 6000, // 跑马灯移动速度  3000快     6000中   10000慢
            position: 1 // 跑马灯位置 ， 1 随机 2上  3中 4下
          },
          watermarkOption: {
            // 选填
            enable: false, // 默认 false
            url: this.audioImg, // 水印图片的路径
            align: 'tr', // 图片的对其方式， tl | tr | bl | br 分别对应：左上，右上，左下，右下
            position: ['20px', '20px'], // 对应的横纵位置，支持px,vh,vw,%
            size: ['80px', '35px'] // 水印大小，支持px,vh,vw,%
          },
          subtitleOption: {
            enable: true
          },
          otherOption: {
            vid: 0, // hostId
            vfid: 0,
            guid: 0,
            biz_id: 0,
            report_extra: "{'join_id':0,'switch_id':0,'is_filter':1}"
          }
        };
        return new Promise(resolve => {
          console.log('======实例化播放器参数======', incomingData);
          window.VhallPlayer.createInstance(
            incomingData,
            event => {
              this.$Vhallplayer = event.vhallplayer;
              window.vp = this.$Vhallplayer;
              this.$Vhallplayer.openControls(false);
              this.$Vhallplayer.on(window.VhallPlayer.LOADED, () => {
                this.loading = false;
                // 加载中
                resolve();
              });
            },
            e => {
              console.log('播放器创建实例失败', e, e.message);
              this.loading = false;
              throw new Error(e.message);
            }
          );
        });
      },
      destroy() {
        this.$Vhallplayer.destroy();
      },
      initSlider() {
        this.$Vhallplayer.on(window.VhallPlayer.TIMEUPDATE, () => {
          this.currentTime = this.$Vhallplayer.getCurrentTime(() => {});
          this.sliderVal = (this.currentTime / this.totalTime) * 100;
        });
        // 拖拽显示时间
        const dom = this.$refs.controllerRef.$el;
        const but = document.querySelector('div.el-slider__button-wrapper');
        const innitDom = () => {
          dom.onmouseover = e => {
            console.log('dom over', e);
            this.TimesShow = true;
            const totalWidth = dom.offsetWidth;
            this.ContorlWidth = dom.offsetWidth;
            const lef = e.layerX;
            this.hoverTime = (lef / totalWidth) * this.totalTime;
            this.hoverLeft = lef;
            dom.onmousemove = event => {
              const lef = event.layerX;
              this.hoverTime = (lef / totalWidth) * this.totalTime;
              this.hoverLeft = lef;
            };
          };
          dom.onmouseout = () => {
            this.TimesShow = false;
          };
        };
        innitDom();
        but.onmousedown = () => {
          dom.onmouseout = dom.onmousemove = dom.onmousemove = dom.onmouseover = null;
          this.ContorlWidth = dom.offsetWidth;
          this.onmousedownControl = true;
          this.pause();
          document.onmousemove = () => {
            this.TimesShow = true;
          };
          document.onmouseup = () => {
            document.onmousemove = null;
            this.onmousedownControl = false;
            this.TimesShow = false;
            innitDom();
          };
        };
        but.onmouseover = e => {
          this.TimesShow = false;
          e.stopPropagation();
        };
      }
    }
  };
</script>
<style lang="less" scoped>
  .preview-wrap {
    height: 100%;
    .content {
      height: 100%;
      position: relative;
      overflow: hidden;
      .head {
        height: 40px;
        color: red;
        line-height: 40px;
        background: #ccc;
        span {
          display: inline-block;
          width: calc(100% - 40px);
          text-align: center;
        }
        .close {
          padding-right: 10px;
        }
      }
    }
    .tips {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #000;
      .video-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url('../../../common/images/gif/video.gif') no-repeat;
        background-size: 100% 100%;
        // .audio-img{
        //   height: 100%;
        //   width: 100%;
        //   object-fit: scale-down;
        // }
        p {
          width: 100%;
          color: #ccc;
          position: absolute;
          bottom: 90px;
          text-align: center;
        }
      }
      &.tipsIndex {
        z-index: -1;
      }
      .video-end {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 22;
        background: #1a1a1a;
        i {
          color: #fff;
          font-size: 40px;
          padding: 10px;
        }
        // img{
        //   width: 100%;
        //   height: 100%;
        // }
        .reset-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }
        p {
          color: #fff;
          font-size: 16px;
          padding-top: 10px;
        }
      }
    }
    #videoDom {
      height: 100%;
      width: 100%;
      background: black;
      /deep/.vhallPlayer-container {
        display: none !important;
      }
    }
    .vod-controller {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 40px;
      bottom: -45px;
      background: rgba(0, 0, 0, 0.7);
      transition: all 0.8s;
      color: white;
      .local-icon {
        display: inline-block;
        width: 38px;
        text-align: center;
        color: white;
      }
      .slider::v-deep {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .Times {
          position: absolute;
          top: -35px;
          min-width: 60px;
          text-align: center;
          padding: 5px;
          background: rgba(0, 0, 0, 0.3);
          font-size: 12px;
          color: #fff;
          transform: translateX(-50%);
        }
        &:hover {
          top: -2px;
          .el-slider__runway {
            height: 3px;
          }
          .el-slider__bar {
            height: 3px;
          }
        }
        .el-slider {
          .el-slider__runway {
            margin: 0;
            height: 3px;
            background-color: rgba(255, 255, 255, 0.3);
          }
        }
        .el-slider__button-wrapper {
          top: -16px;
        }
        .el-slider__bar {
          height: 3px;
        }
        .el-slider__button {
          width: 14px;
          height: 14px;
        }
      }
      .wrap {
        width: 100%;
        .left-box {
          i:first-child {
            padding: 0 8px;
            cursor: pointer;
          }
          .local-icon {
            margin: 0 4px;
          }
          .center-box {
            display: inline-block;
            line-height: 48px;
          }
        }
        .right-box {
          i:last-child {
            padding: 0 12px;
            cursor: pointer;
          }
          .volume-box {
            display: inline-block;
            line-height: 34px;
            position: relative;
            height: 34px;
            margin-top: 6px;
            &:hover {
              .ver-slider {
                display: block;
              }
            }
            .icon-box {
              i {
                padding-right: 5px;
                cursor: pointer;
              }
            }
            .ver-slider {
              display: none;
              position: absolute;
              left: 0;
              bottom: 30px;
            }
          }
        }
      }
    }
    .active {
      bottom: 0px;
    }
  }
</style>
