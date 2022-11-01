<template>
  <div class="vhall-watch" @mousemove="wrapEnter" @mouseleave="wrapLeave">
    <div class="vhall-watch-box" :id="id">
      <img
        v-if="seizeImageShow"
        class="seize-image"
        src="./img/gz.png"
        alt
      />
      <div class="audio" v-show="audioStatus || isAudio">
        <img src="./img/bg2x.png" />
        {{$t("message.voicePlaying")}}
      </div>
      <div class="loading" v-if="loading && !(audioStatus || isAudio)">
        <img src="./img/load.gif" />
      </div>
      <div class="overEnd live-end" v-show="liveEnded"></div>
      <div class="overEnd" v-show="BackEnd">
        <i @click="play">{{$t("message.replay")}}</i>
      </div>
    </div>
     <!-- 语言为英语的时候 不显示更改后的倍速和清晰度 -->
    <div v-if="poster!=''" class="poster_img_box">
      <img :src="poster" alt="">
    </div>
    <div class="Tips" :class="{'TipsOpcity': changeQuality || changeSpeed}">
      {{$t('message.switchSpeed')}}
      <span v-if="changeQuality && lang != 'en'">{{currentQualitys.def | fromalText}}</span>
      <span v-if="changeSpeed && lang != 'en'">{{currentSpeed == 1 ? $t('message.normal') : currentSpeed}}{{$t('message.speedX')}}</span>
    </div>
    <div class="video-doc-exchange" :class="{visible: hoveVideo}" v-if="exchangeVideoDoc && !isFullscreen && !BackEnd && docVisible">
      <p>
        <!-- <span>视图</span> -->
        <el-tooltip content="切换" placement="top" v-tooltipMove>
          <a
            href="javascript:void(0);"
            class="iconfont iconfuzhi"
            @click="exchangeVideoDoc"
          ></a>
        </el-tooltip>
      </p>
    </div>
    <div
      class="vod-controller"
      :class="{'active': hoveVideo, 'mini': isMini && !isFullscreen}"
      v-show="!liveEnded && !BackEnd && controller !='disabled' && vodControllerShow"
      @mouseenter="controllerMouseEnter"
      @mouseleave="controllerMouseLeave"
    >
      <div class="slider line-slider" v-if="!isLive">
        <el-slider v-model="sliderVal" :show-tooltip="false" ref="controllerRef" @change="setVideo"></el-slider>
        <div class="Times" :style="{left: hoverLeft + 'px'}" v-show="TimesShow">
          <span class="current-time">{{hoverTime | secondToDate}}</span>
        </div>
      </div>
      <div class="wrap">
        <div class="left-box">
          <i
            class="iconfont icons poiner"
            @click="videoPlayBtn"
            ref="videoPlayBtnDom"
          >{{statePaly ? '&#xe738;': '&#xe764;'}}</i>
          <div class="center-box" v-if="!isLive">
            <span class="current-time">{{currentTime | secondToDate}}</span>
            <span>/</span>
            <span class="all-time">{{totalTime | secondToDate}}</span>
          </div>
        </div>
        <div class="right-box">
          <div class="Painting Paint" :class="{active: PaintingActive}">
            <span v-if="!isAudio" @click="PaintingEnter">
              {{currentQualitys.def | fromalText}}
            </span>
            <span v-else>{{$t('message.original')}}</span>
            <ul>
              <li
                v-for="(item, index) in getQualitysMap"
                @click="changeQualitys(item)"
                :class="{'li-active':currentQualitys.def == item.def}"
                :key="index"
              >
                {{item.def | fromalText}}
              </li>
            </ul>
          </div>
          <div class="Painting spee" v-if="UsableSpeed.length>0" :class="{active: SpeeActive}">
            <span
              @click="SpeeEnter"
            >{{currentSpeed == 1 ? $t('message.speed'): currentSpeed.toString().length &lt; 3 ? `${currentSpeed.toFixed(1)}X` : `${currentSpeed}X`}}</span>
            <ul>
              <li
                v-for="val in UsableSpeed"
                @click="setSpeed(val)"
                :key="val"
                :class="{'li-active': currentSpeed==val}"
              >{{val.toString().length &lt; 3 ? `${val.toFixed(1)}X` : `${val}X`}}</li>
            </ul>
          </div>
          <div class="volume-box">
            <span class="icon-box">
              <i
                style="color: #ECECEC"
                class="iconfont icons poiner"
                @click="jingYin"
                :class="(voice > 0)? 'iconyinliangicon' : 'iconjingyinicon'"
              ></i>
            </span>
            <div class="ver-slider">
              <el-slider class="123" vertical height="100px" v-model="voice" :show-tooltip="false"></el-slider>
            </div>
          </div>
          <i v-if="!(isEmbedVideo && !isLive) && lang != 'en' && this.playerInfo.barrage"
            @mouseenter="wrapEnter"
            class="iconfont icons poiner iconicon-pcdanmuguanbi"
            v-show="!danmuIsOpen "
            @click="openBarrage"
          ></i>
          <i v-if="!(isEmbedVideo && !isLive) && lang != 'en'"
            @mouseenter="wrapEnter"
            class="iconfont icons poiner iconicon-pcdanmukaiqi-011"
            v-show="danmuIsOpen"
            @click="closeBarrage"
          ></i>
          <i v-if="isFullscreen" v-show="!(isIE && isMini)" class="iconfont icons poiner iconquanpingguanbi" @click="exitFullscreen"></i>
          <i v-else v-show="!(isIE && isMini)" class="iconfont icons poiner iconquanping" @click="enterFullscreen"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @author Sean
 * @vue-prop addId {String} - paas appid
 * @vue-prop accountId {String} - third platform user id
 * @vue-prop token {String} - paas required token
 * @vue-prop type {String} - player type  'live' or 'vod' default 'live'
 * @vue-prop poster {String} - player poster img must be .jpg format
 * @vue-prop roomId {String} - paas roomId
 * @vue-prop liveOption {Object}
 * @vue-prop vodOption {Object}
 */
import { secondToDateZH } from '../../utils/filter';
import { session } from './js/utils';
import { isIE } from '../../utils/utils';
export default {
  props: {
    appId: {
      type: String
    },
    accountId: {
      type: [String , Number]
    },
    token: {
      type: String
    },
    type: {
      type: String
    },
    poster: {
      type: String
    },
    liveOption: {
      type: Object
    },
    vodOption: {
      type: Object
    },
    playerInfo: {
      required: false
    },
    vodControllerShow: {
      type: Boolean,
      default () {
        return true;
      }
    },
    controller: {
      type: String
    },
    isAudio: {
      type: Boolean,
      default () {
        return false;
      }
    },
    id: {
      required: false,
      default: 'vhall-watch-box'
    },
    recordHistoryTime: {
      required: false,
      default: ''
    },
    exchangeVideoDoc: {
      required: false
    },
    isMini: {
      required: false
    },
    docVisible: {
      required: false,
      default: false
    }
  },

  data () {
    return {
      TimesShow: false,
      hoverTime: 0,
      hoverLeft: 0,
      // vodControllerShow: true,  //播放条的显示
      seizeImageShow: false, // 占位图的开关
      vhallWatchShow: false, // 切屏的开关
      audioStatus: false,
      PaintingActive: false, // 清晰度弹框
      SpeeActive: false, // 倍速弹框
      getQualitysMap: [],
      currentQualitys: {def: ''},
      danmuIsOpen: false,
      currentSpeed: 1,
      hoveVideo: true,
      $PLAYER: null,
      percent: 20,
      voice: 60,
      statePaly: false, // 默认播放状态
      sliderVal: 0,
      isLoop: false,
      totalTime: 0,
      currentTime: 0,
      UsableSpeed: [],
      isLive: this.type == 'live',
      catchVoice: 0,
      BackEnd: false,
      liveEnded: false,
      endTime: 0,
      changeQuality: false,
      changeSpeed: false,
      onlyID: {
        userId: this.accountId,
        userList: [
          {
            id: this.accountId,
            speed: 1
          }
        ]
      },
      isEmbedVideo: false,
      isFullscreen: false,
      loading: false, // 卡顿显示加载
      lang: this.$route.query.lang,
      isIE: isIE()
    };
  },
  watch: {
    sliderVal (val) {
      if (this.onmousedownControl) {
        this.hoverTime = (val / 100) * this.totalTime;
        this.hoverLeft = (val / 100) * this.ContorlWidth;
      }
      // const time = (val / 100) * this.totalTime
    },
    // eslint-disable-next-line no-unused-vars
    voice (newVal, oldVal) {
      this.$PLAYER.setVolume(newVal, () => {
        console.log('设置音量失败');
      });
    },
    hoveVideo (newValue) {
      if (newValue) {
        clearTimeout(this.hoverVideoTimer);
        this.hoverVideoTimer = setTimeout(() => {
          this.hoveVideo = false;
        }, 3000);
      }
    },
    isMini (value) {
      if (isIE() && value) {
        this.exitFullscreen();
      }
    }
  },
  mounted () {
    if (this.$route.query.embed == 'video') {
      this.isEmbedVideo = true;
    }
    this.$EventBus.$on('receiveMsg', msg => {
      if (msg.data.target_id || !msg.data.text_content || msg.sender_id == this.accountId) return;
      if (msg.context.atList && msg.context.atList.length) {
        msg.context.atList.forEach((a) => {
          msg.data.text_content = msg.data.text_content.replace(`***${a.nickName}`, `@${a.nickName}`);
        });
      }
      const text = msg.data.barrageTxt;
      if (text && text.includes('<img')) { console.log(123); } else {
        this.$nextTick(() => {
          this.addBarrage(text);
        });
      }
    });
    // setTimeout(() => {
    //   this.initPaly();
    // }, 500);
    if (this.type == 'vod') {
      // eslint-disable-next-line no-unused-vars
      window.addEventListener('beforeunload', e => {
        if (this.$PLAYER) {
          this.endTime = this.$PLAYER.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          });
        }
        if (this.getLoginStatus()) {
          localStorage.setItem(this.vodOption.recordId, this.endTime);
          const params = {
            record_id: this.vodOption.recordId,
            time: this.endTime
          };
          // eslint-disable-next-line no-unused-vars
          this.$fetch('saveSeek', params).then(res => {});
        } else {
          localStorage.setItem(this.vodOption.recordId, this.endTime);
        }
      });
    }
    const setFullscreen = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
      if (fullscreenElement && fullscreenElement.className && fullscreenElement.className.indexOf('vhall-watch') != -1) {
        this.isFullscreen = true;
      } else {
        this.isFullscreen = false;
      }
    };
    window.addEventListener('fullscreenchange', setFullscreen);
    window.addEventListener('webkitfullscreenchange', setFullscreen);
    window.addEventListener('mozfullscreenchange', setFullscreen);
    window.addEventListener('msfullscreenchange', setFullscreen);
    window.addEventListener('MSFullscreenChange', setFullscreen);
    clearTimeout(this.hoverVideoTimer);
    this.hoverVideoTimer = setTimeout(() => {
      this.hoveVideo = false;
    }, 3000);
    this.initPaly();
  },
  filters: {
    secondToDate (val) {
      return secondToDateZH(val);
    },
    fromalText (val) {
      let text;
      switch (val) {
        case 'same':
          text = window.i18n.t('message.original');
          break;
        case '720p':
          text = window.i18n.t('message.video720');
          break;
        case '480p':
          text = window.i18n.t('message.video480');
          break;
        case 'a':
          text = window.i18n.t('message.audio');
          break;
        case '360p':
          text = window.i18n.t('message.video360');
          break;
        default:
          text = window.i18n.t('message.video360');
      }
      return text;
    }
  },
  methods: {
    initPaly () {
      this.FRIST = true;
      this.initSDK().then(() => {
        setTimeout(() => {
          // this.playerInfo &&
          //   !this.playerInfo.disableDanmu &&
          // this.openBarrage(); // 开启弹幕(助理端不开启)
          this.getCurrentQuality(); // 获取当前清晰度列表
          this.getQualitys(); // 获取全部清晰度
          this.$nextTick(() => {
            let defaultDefinition;
            if (sessionStorage.getItem('localQuality')) {
              let isDefinition = this.getQualitysMap.find(q => {
                if (q.def == this.currentQualitys.def) {
                  return q.def;
                }
              });
              if (isDefinition) {
                defaultDefinition = isDefinition;
              } else {
                this.currentQualitys = this.getQualitysMap[0];
              }
            } else {
              defaultDefinition = this.getQualitysMap.find(q => {
                return (
                  q.def == this.playerInfo.default_definition &&
                  this.playerInfo.default_definition
                );
              });
            }
            if (isIE()) {
              setTimeout(() => {
                defaultDefinition && this.changeQualitys(defaultDefinition);
              }, 500);
            } else {
              defaultDefinition && this.changeQualitys(defaultDefinition);
            }
          });
          if (this.type == 'vod') {
            let endTime;
            const totalTime = this.$PLAYER.getDuration(() => {
              console.log('获取视频总时长失败');
            });
            const parsedTotalTime = parseInt(totalTime);
            if (this.getLoginStatus() || this.recordHistoryTime != '') {
              endTime = parseFloat(this.recordHistoryTime);
              const parsedEndTime = parseInt(this.recordHistoryTime);
              if (
                endTime &&
                endTime != 'undefined' &&
                parsedTotalTime != parsedEndTime
              ) {
                const seekTime = endTime < 6 ? 0 : endTime - 5;
                this.setVideoCurrentTime(seekTime);
              }
            } else {
              endTime = localStorage.getItem(this.vodOption.recordId);
              const parsedEndTime = parseInt(endTime);
              if (
                endTime &&
                endTime != 'undefined' &&
                parsedTotalTime != parsedEndTime
              ) {
                const seekTime = endTime < 6 ? 0 : endTime - 5;
                this.setVideoCurrentTime(seekTime);
              }
            }
            // this.play()
          }
        }, 500);
        console.log('初始化播放器成功');
        if (this.$PLAYER && this.$PLAYER.getIsPause()) {
          this.statePaly = false;
        } else {
          this.statePaly = true;
        }
        if (this.isLive) {
          console.log('直播了');
          // 直播开始
          // eslint-disable-next-line no-unused-vars
          this.$EventBus.$on('live_start', e => {
            this.liveEnded = false;
          });
          // 直播结束
          // eslint-disable-next-line no-unused-vars
          this.$EventBus.$on('live_over', e => {
            this.liveEnded = true;
            this.$PLAYER.destroy();
          });
          this.$PLAYER.on(window.VhallPlayer.PLAY, () => {
            // 监听播放状态
            this.statePaly = true;
            this.setChange();
            this.changeQuality = true;
            console.log('播放了');
          });
          this.$PLAYER.on(window.VhallPlayer.PAUSE, () => {
            // 监听暂停状态
            console.log('暂停');
            this.statePaly = false;
          });
          // 视频清晰度发生改变----卡顿切换清晰度时触发
          this.$PLAYER.on(window.VhallPlayer.DEFINITION_CHANGE, () => {
            this.loading = true;
          });
          this.$PLAYER.on(window.VhallPlayer.LOADED, () => {
            this.loading = false;
            this.play();
          });
          this.$PLAYER.on(window.VhallPlayer.ERROR, (e) => {
            console.log('播放器sdk VhallPlayer.ERROR事件', e);
          });
        } else {
          console.log('点播了');
          this.totalTime = this.$PLAYER.getDuration(() => {
            console.log('获取视频总时长失败');
          });
          this.$PLAYER.on(window.VhallPlayer.PLAY, () => {
            // 监听播放状态
            console.log('播放');
            this.statePaly = true;
            this.BackEnd = false;
            this.$emit('BackEnd', false);
            // this.statePaly?this.seizeImageShow = false:this.seizeImageShow = true;
          });
          this.$PLAYER.on(window.VhallPlayer.PAUSE, () => {
            // 监听暂停状态
            console.log('暂停');
            this.statePaly = false;
          });
          this.$PLAYER.on(window.VhallPlayer.ENDED, () => {
            // 监听暂停状态
            console.log('播放完毕');
            this.BackEnd = true;
            this.$emit('BackEnd', true);
          });
          this.initSpee(); // 获取倍速
          this.initSlider(); // 初始化播放进度条
        }
      });
    },
    setVideo () {
      // 快进功能
      const time = (this.sliderVal / 100) * this.totalTime;
      console.log(this.sliderVal, '快进');
      this.setVideoCurrentTime(time);
      this.play();
    },
    setSize (opt) {
      console.log('设置视频大小', opt);
      this.$PLAYER &&
        this.$PLAYER.setSize(opt, () => {
          console.log('设置视频大小失败');
        });
    },
    // 播放条的显示
    // controllerShow(val){
    //   val == 'video' ? this.vodControllerShow = false : this.vodControllerShow = true;
    // },
    jingYin () {
      if (this.voice == 0) {
        this.voice = this.catchVoice;
      } else {
        this.catchVoice = this.voice;
        this.voice = 0;
      }
    },
    initSpee () {
      this.UsableSpeed = this.$PLAYER.getUsableSpeed(() => {
        console.log('获取倍速失败');
      });
      console.log('获取倍速', this.UsableSpeed);
      this.UsableSpeed = this.UsableSpeed.filter(value => {
        return (
          value == '2' ||
          value == '1.75' ||
          value == '1.5' ||
          value == '1' ||
          value == '0.75' ||
          value == '1.25'
        );
      });
      if (session.get('localSpeed')) {
        const localList = session.get('localSpeed').userList;
        console.log(localList, 987654, session.get('localSpeed'));
        const flag = localList.some(item => {
          if (item.id == this.onlyID.userId) {
            console.log('本地倍速值和当前用户一致--------', item.id, this.onlyID.userId);
            this.currentSpeed = item.speed;
            return true;
          }
        });
        if (!flag) {
          this.currentSpeed = 1;
        }
        console.log('end -----------', this.currentSpeed);
      }
      if (session.get('localSpeed')) {
        let suc = true;
        this.$PLAYER.setPlaySpeed(this.currentSpeed, () => {
          suc = false;
        });
        if (suc) {
          console.log('设置成功,sucess');
        } else {
          console.log('设置失败,falil');
          this.currentSpeed = 1;
        }
      }
    },
    changeScreen () {
      this.$emit('changeScreen', this.vhallWatchShow);
    },
    changeStatus () {
      this.vhallWatchShow = !this.vhallWatchShow;
    },
    PaintingEnter () {
      this.PaintingActive = !this.PaintingActive;
    },
    SpeeEnter () {
      this.SpeeActive = !this.SpeeActive;
    },
    changeQualitys (item) {
      console.log('设置画质第n此进入-------', item);
      let sucess = true;
      this.$PLAYER.setQuality(item, err => {
        sucess = false;
        console.log('设置画质失败 ', err); // object 类型，{ code: 错误码, message: "", data: {} }
      });
      if (sucess) {
        console.log('设置画质成功------999');
        this.changeQuality = true;
        if (this.changeSpeed) {
          this.changeSpeed = false;
        }
        let data = {
          userId: this.onlyID.userId,
          QualityList: [{ id: this.onlyID.userId, def: item.def }]
        };
        sessionStorage.setItem('localQuality', JSON.stringify(data));
      }
      this.setChange();
      this.PaintingActive = false; // 关闭弹框
      this.getCurrentQuality();
      if (this.type == 'vod') {
        // 回放的时候获取清晰度
        console.log('回放时进入获取倍速', this.type);
        this.initSpee();
      }
    },
    initSDK () {
      let params = {
        appId: this.appId, // 应用ID，必填
        accountId: this.accountId, // 第三方用户ID，必填
        token: this.token, // access_token，必填
        videoNode: this.id || 'vhall-watch-box',
        type: this.type, // live 直播  vod 点播  必填
        poster: '',
        language: 'zh',
        autoplay: false,
        forceMSE: false
      };
      if (this.isLive && this.liveOption && this.type == 'live') {
        params = Object.assign(params, {
          liveOption: this.liveOption
        });
      } else if (this.type === 'vod' && this.vodOption) {
        params = Object.assign(params, {
          vodOption: this.vodOption
        });
        params.pursueOption = { enable: true };
      } else {
        throw new Error('参数异常');
      }
      if (this.playerInfo.scrolling_text) {
        // 跑马灯
        params.marqueeOption = {
          enable: true,
          text: this.playerInfo.scrolling_text.text, // 跑马灯的文字
          alpha: this.playerInfo.scrolling_text.alpha, // 透明度,100完全显示,0 隐藏
          size: this.playerInfo.scrolling_text.size, // 文字大小
          color: this.playerInfo.scrolling_text.color, // 文字颜色
          interval: this.playerInfo.scrolling_text.interval, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
          speed: this.playerInfo.scrolling_text.speed, // 跑马灯移动速度:3000快,6000中,10000慢
          position: this.playerInfo.scrolling_text.position // 跑马灯位置 , 1 随机 2上,3中 4下
        };
      } else {
        params.marqueeOption = {
          text: ''
        };
      }
      if (this.playerInfo.watermark) {
        // 水印
        params.watermarkOption = {
          enable: true,
          url: this.playerInfo.watermark.img_url, // 水印图片的路径
          align: this.fromalAlign(this.playerInfo.watermark.img_position), // 图片的对其方式， tl | tr | bl | br 分别对应：左上，右上，左下，右下
          position: ['20px', '20px'], // 对应的横纵位置，支持px,vh,vw,%
          size: ['80px'] // 水印大小，支持px,vh,vw,%
        };
      }
      console.log(params, '初始化播放器参数');
      return new Promise((resolve, reject) => {
        window.VhallPlayer.createInstance(
          params,
          event => {
            console.log('ffffffffffffffffffffffffff', event);
            this.$PLAYER = event.vhallplayer;
            window.ppp = this.$PLAYER;
            this.$PLAYER.openControls(false);
            this.$PLAYER.openUI(false);
            this.$EventBus.$emit('component_playerSDK_ready');
            if (this.isLive) {
              resolve();
            } else {
              this.$PLAYER.on(window.VhallPlayer.LOADED, () => {
                // // 加载中
                // this.$EventBus.$emit('component_playerSDK_ready');
                resolve();
              });
            }
            this.$EventBus.$emit('markPoints', event.markPoints);
          },
          e => {
            console.error('ffffffffffffffffffffffffff', event);
            reject(e);
          }
        );
      });
    },

    /**
     *  开始播放旁路
     */
    play () {
      // if (this.poster != '') {
      //   this.poster = '';
      // }
      console.log(this.$PLAYER);
      this.$PLAYER && this.$PLAYER.play();
      if (this.isIE) {
        this.BackEnd = false;
      }
    },
    /**
     * 暂停
     */
    pause () {
      this.$PLAYER && this.$PLAYER.pause();
    },
    /**
     * 设置播放时间
     */
    setVideoCurrentTime (val) {
      this.$PLAYER &&
        this.$PLAYER.setCurrentTime(val, () => {
          console.log('设置当前播放时间失败-----------');
        });
    },
    /**
     * 获取当前 视频质量
     */
    getCurrentQuality () {
      this.currentQualitys = this.$PLAYER && this.$PLAYER.getCurrentQuality();
      if (sessionStorage.getItem('localQuality')) {
        const JsonParse = JSON.parse(sessionStorage.getItem('localQuality'));
        const localList = JsonParse.QualityList;
        for (const key in localList) {
          if (localList[key].id == this.onlyID.userId) {
            console.log(localList[key].id, localList[key]);
            this.$nextTick(() => {
              this.$set(this.currentQualitys, 'def', localList[key].def);
            });
          }
        }

      } else {
        // eslint-disable-next-line no-unused-vars
      }
      this.$nextTick(() => {
        if (this.currentQualitys.def == 'a') {
          console.log('进入');
          this.audioStatus = true;
        } else {
          console.log('no-------进入');
          this.audioStatus = false;
        }
      });
    },
    /**
     * 获取视频清晰度列表
     */
    getQualitys () {
      let arr = this.$PLAYER && this.$PLAYER.getQualitys();
      if (this.isAudio) {
        this.getQualitysMap = arr.filter(item => {
          return item.def === 'same';
        });
        return;
      }

      const arr2 = arr.filter(item => {
        return (
          item.def === '480p' ||
          item.def === '720p' ||
          item.def === '360p' ||
          item.def === 'a' ||
          item.def === 'same'
        );
      });
      const sloat = [];
      arr2.forEach(item => {
        if (item.def === 'same') {
          item.index = 0;
          sloat.push(item);
        }
      });
      arr2.forEach(item => {
        if (item.def === '720p') {
          item.index = 1;
          sloat.push(item);
        }
      });
      arr2.forEach(item => {
        if (item.def === '480p') {
          item.index = 2;
          sloat.push(item);
        }
      });
      arr2.forEach(item => {
        if (item.def === '360p') {
          item.index = 3;
          sloat.push(item);
        }
      });
      arr2.forEach(item => {
        if (item.def === 'a') {
          item.index = 4;
          sloat.push(item);
        }
      });
      this.getQualitysMap = JSON.parse(JSON.stringify(sloat));
    },
    /**
     * 全屏切换
     */
    enterFullscreen () {
      let element = document.querySelector('.vhall-watch');
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
    },
    exitFullscreen () {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    },
    /**
     * 设置loop
     */
    toogleLoop () {
      this.isLoop = !this.isLoop;
      this.$PLAYER.setLoop(this.isLoop, () => {
        console.log('设置loop失败-----------');
      });
    },
    /**
     * 设置倍速
     */
    setPlaySpeed () {},

    /**
     * 开启弹幕
     */
    openBarrage () {
      this.danmuIsOpen = true;
      this.$PLAYER && this.$PLAYER.openBarrage();
    },
    /**
     * 关闭弹幕
     */
    closeBarrage () {
      this.danmuIsOpen = false;
      this.$PLAYER && this.$PLAYER.closeBarrage();
    },
    /**
     * 发送弹幕
     */
    addBarrage (text) {
      try {
        this.$PLAYER &&
          this.$PLAYER.addBarrage(text, e => {
            console.log(e, '添加弹幕失败');
          });
      } catch (e) {
        // eslint-disable-next-line no-unused-vars
      }
    },
    setSpeed (val) {
      let sucess = true;
      this.$PLAYER.setPlaySpeed(val, err => {
        console.log(err, '切换失败');
        sucess = false;
      });
      if (sucess) {
        this.changeSpeed = true;
        if (this.changeQuality) {
          this.changeQuality = false;
        }
        this.setChange();
        if (session.get('localSpeed')) {
          // 判断列表中是否含有当前用户存储的倍速
          let localList = session.get('localSpeed').userList;
          const flag = localList.some(item => {
            if (item.id == this.onlyID.userId) {
              item.speed = val;
              return true;
            }
          });
          if (flag) {
            this.onlyID.userList = localList;
          } else {
            this.onlyID.userList = localList.concat({
              id: this.onlyID.userId,
              speed: val
            });
          }
          session.set('localSpeed', this.onlyID);
        } else {
          this.onlyID.userList = [{
            id: this.onlyID.userId,
            speed: val
          }];
          session.set('localSpeed', this.onlyID);
        }
      }
      this.currentSpeed = val;
      this.SpeeActive = false;
    },
    setChange () {
      if (this.changeTime) {
        clearTimeout(this.changeTime);
      }
      this.changeTime = setTimeout(() => {
        this.changeSpeed = false;
        this.changeQuality = false;
      }, 2000);
    },
    initSlider () {
      this.$PLAYER.on(window.VhallPlayer.TIMEUPDATE, () => {
        this.currentTime = this.$PLAYER.getCurrentTime(() => {
          console.log('获取当前视频播放时间失败----------');
        });
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
        // eslint-disable-next-line no-unused-vars
        dom.onmouseout = e => {
          this.TimesShow = false;
        };
      };
      innitDom();
      // eslint-disable-next-line no-unused-vars
      but.onmousedown = e => {
        dom.onmouseout = dom.onmousemove = dom.onmousemove = dom.onmouseover = null;
        this.ContorlWidth = dom.offsetWidth;
        this.onmousedownControl = true;
        this.pause();
        // eslint-disable-next-line no-unused-vars
        document.onmousemove = e => {
          this.TimesShow = true;
        };
        // eslint-disable-next-line no-unused-vars
        document.onmouseup = e => {
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
    },
    videoPlayBtn () {
      if ((this.$PLAYER && this.$PLAYER.getIsPause()) || !this.statePaly) {
        this.play();
      } else {
        this.pause();
      }
    },

    wrapEnter () {
      this.hoveVideo = true;
    },
    wrapLeave () {
      clearTimeout(this.hoverVideoTimer);
      this.hoverVideoTimer = setTimeout(() => {
        this.hoveVideo = false;
        this.PaintingActive = false;
        this.SpeeActive = false;
      }, 3000);
    },
    fromalAlign (val) {
      let text;
      switch (parseInt(val)) {
        case 1:
          text = 'tl';
          break;
        case 2:
          text = 'tr';
          break;
        case 3:
          text = 'br';
          break;
        case 4:
          text = 'bl';
          break;
      }
      return text;
    },
    getLoginStatus () {
      return JSON.parse(sessionStorage.getItem('userInfo')) && JSON.parse(sessionStorage.getItem('userInfo')).length == undefined;
    },
    controllerMouseLeave () {
      clearTimeout(this.hoverVideoTimer);
      this.hoverVideoTimer = setTimeout(() => {
        this.hoveVideo = false;
      }, 3000);
    },
    controllerMouseEnter () {
      clearTimeout(this.hoverVideoTimer);
      this.hoveVideo = true;
    }
  },

  destroyed () {
    document.onmouseenter = null;
    this.$PLAYER && this.$PLAYER.destroy();
  }
};
</script>
<style lang="less" scoped>
@import './icon.less';
.poster_img_box{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 21;
  img{
    width: 100%;
    height: 100%;
  }
}
.vhall-watch {
  position: relative;
  height: 100%;
  width: 100%;
  background: #2d2d2d;
  overflow: hidden;
}
.mini-vhall-watch {
  position: absolute;
  top: 0;
  height: 94%;
  width: 100%;
}
.vhall-watch-box {
  width: 100%;
  height: 100%;
  position: relative;

  .seize-image {
    width: 200px;
    height: 200px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  /*border:1px solid red;*/
  .audio {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1em;

    /*background-image: linear-gradient(to top, #86377b 20%, #27273c 80%);*/
    background: url('./img/audioBg.png') no-repeat;
    background-size: cover;
    img {
      width: 10%;
      display: inline-block;
      margin-right: 20px;
      color: #fff;
    }
  }
  .loading{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 26px;
    }
  }
  .overEnd {
    width: 100%;
    height: 100%;
    background: url('../../common/images/small.png') no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    i {
      font-style: normal;
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #ff3939;
      color: #fff;
      cursor: pointer;
      border-radius: 4px;
    }
    &.live-end {
      background: url('../../common/images/livebg.png') no-repeat center center;
      background-color: #2d2d2d;
    }
  }
}
.vhall-watch-loading-icon {
  position: absolute;
  width: 200px;
  height: 200px;
  left: 50%;
  top: 50%;
  i {
    font-size: 70px;
  }
}

.Tips {
  padding: 0 15px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 100px;
  position: absolute;
  left: 50%;
  bottom: 48px;
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: rgba(236, 236, 236, 1);
  line-height: 44px;
  text-align: center;
  transform: translateX(-50%);
  // opacity: 0;
  // transition: 0.1s;
  display: none;
  span {
    color: #fc5659;
  }
}
.TipsOpcity {
  display: block;
}
.video-doc-exchange{
  position: absolute;
  top: -50px;
  z-index: 21;
  right: 8px;
  width: 40px;
  height: 40px;
  opacity: 100;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.8s;
  p {
    width: 100%;
    color: #fff;
    text-align: center;
  }
  span {
    display: inline-block;
    text-align: right;
    // width: 54px;
    font-size: 12px;
  }
  a {
    display: inline-block;
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    background:rgba(0,0,0,1);
    border-radius: 100%;
    user-select: none;
    &:hover {
      background: #fc5659;
    }
  }
  &.visible{
    display: flex;
    top: 6px;
  }
}
.vod-controller {
  position: absolute;
  bottom: -48px;
  z-index: 21;
  width: 100%;
  padding: 0px 20px;
  height: 38px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.7);
  transition: all 0.8s;
  .iconicon-pcdanmuguanbi,.iconicon-pcdanmukaiqi-011{
    font-size: 18px !important;
  }
  &.mini{
    .left-box{
      margin-left: -10px;
      margin-top: -2px;
      .center-box {
        line-height: 20px;
        span {
          font-size: 12px;
        }
        .all-time{
          margin-left: 0px;
        }
        .current-time{
          margin-right: 0px;
        }
      }
      i{
        margin-right: 0px;
        font-size: 14px;
        margin-left: -2px;
      }
    }
    .right-box{
      margin-right: -10px;
      .Painting{
        margin-right: 8px;
        span{
          font-size: 12px;
          width: 24px;
        }
      }
      .Paint, .spee{
        ul{
          left: -75%;
          width: 45px;
          padding: 10px 6px;
          line-height: 20px;
        }
      }
      .volume-box{
        margin-right: 7px;
        margin-left: 2px;
      }
      .iconicon-pcdanmukaiqi-011,.iconicon-pcdanmuguanbi{
        margin-right: 8px;
        margin-top: 0px;
        font-size: 16px !important;
      }
      i{
        font-size: 14px !important;
        margin-top: 0px;
      }
    }

     /deep/ .slider{
          &:hover{
          .el-slider__button-wrapper {
              top: -8px !important;
            }
          }
      }
  }
  .slider {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    top: -2px;
    left: 0px;
    &:hover{
      height: 10px;
      top: -8px;
    }
    .Times {
      position: absolute;
      top: -35px;
      padding: 5px;
      background: rgba(0, 0, 0, 0.3);
      font-size: 12px;
      color: #fff;
      /*display: none;*/
      transform: translateX(-50%);
    }
    /*&:hover {*/
    /*  .Times {*/
    /*    display: block;*/
    /*  }*/
    /*}*/

    .layui-slider {
      height: 4px;
      border-radius: 3px;
      position: relative;
      cursor: pointer;
      .layui-slider-bar {
        background: rgb(30, 159, 255);
        width: 8%;
        left: 0%;
        border-radius: 3px;
        position: absolute;
        height: 100%;
      }
      .layui-slider-wrap {
        width: 36px;
        height: 36px;
        position: absolute;
        top: -16px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        z-index: 10;
        text-align: center;
        left: 8%;
        &:after {
          content: '';
          height: 100%;
          display: inline-block;
          vertical-align: middle;
        }
        .layui-slider-wrap-btn {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
          transition: 0.3s;
          border: 2px solid #1e9fff;
        }
      }
    }
  }
  .wrap {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .iconfont {
    &.icons {
      font-size: 16px;
      color: #fff;
      margin-right: 20px;
      &:last-child {
        margin-right: 0px;
        font-size: 15px;
        color: #fff !important;
      }
    }
    &.poiner {
      cursor: pointer;
      display: inline-block;
      margin-top: 2px;
    }
    &.iconquanping {
      &:hover {
        color: #fc5659;
      }
    }
    &.iconicon-pcdanmukaiqi-011 {
      color: #fc5659;
    }
    &.iconyinliang1 {
      margin-right: 5px;
    }
    &.iconjingyin {
      margin-right: 5px;
    }
  }
  &.active {
    bottom: 0px;
  }
   /deep/ .el-slider__button {
    width: 10px;
    height: 10px;
    border: 0px;
    position: absolute;
    top: 8px;
  }
   /deep/ .line-slider{
    .el-slider__button-wrapper {
      top: -12px;
      width: 0px;
    }
  }
   /deep/ .el-slider__runway {
    margin: 0;
    height: 2px;
    /*width: calc(100% - 8px); */
  }
   /deep/ .slider{
    &:hover{
      .el-slider__runway {
          margin: 0;
          height: 10px;
          /*width: calc(100% - 8px); */
        }
      .el-slider__button {
        width: 16px;
        height: 16px;
        border: 0px;
        transform: scale(1) !important;
        position: absolute;
        top: 5px;
      }
      .el-slider__bar {
        height: 10px;
        background-color: #fc5659;
        border-radius: 0 !important;
      }
      .el-slider__button-wrapper {
        top: -8px;
        width: 0px;
      }
    }
  }
   /deep/ .el-slider__bar {
    height: 2px;
    background-color: #fc5659;
  }
   /deep/ .el-dropdown {
    color: #fff;
  }
  .live-font {
    color: #fff;
    font-weight: bold;
  }
  .left-box {
    i {
      /*width: 25px;*/
      color: #fff;
      display: inline-block;
      cursor: pointer;
      font-size: 20px;
      text-align: center;
      position: relative;
    }
    .center-box {
      display: inline-block;
      .current-time {
        color: #fff;
        margin-right: 5px;
      }
      span {
        color: #fff;
        font-size: 14px;
      }
      .all-time {
        margin-left: 5px;
        color: #fff;
      }
    }
  }

  .right-box {
    display: flex;
    height: 100%;
    flex-direction: row;
    align-items: center;
    .icon-box {
      display: inline-block;
      width: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      i {
        display: block;
        font-size: 14px;
      }
    }
    .volume-box {
      height: 100%;
      align-items: center;
      display: flex;
      margin-right: 20px;
      position: relative;
      height: 20px;
      .icon-voice {
        width: 25px;
        height: 25px;
        color: #fff;
        cursor: pointer;
        font-size: 20px;
        text-align: center;
        position: relative;
      }
      .ver-slider {
        position: absolute;
        bottom: 100%;
        left: -47%;
        width: 30px;
        display: none;
        /* margin-bottom: 2px; */
        .layui-slider {
          height: 4px;
          background: red;
          border-radius: 3px;
          position: relative;
          cursor: pointer;
          .layui-slider-bar {
            background: rgb(30, 159, 255);
            width: 8%;
            left: 0%;
            border-radius: 3px;
            position: absolute;
            height: 100%;
          }
          .layui-slider-wrap {
            width: 36px;
            height: 36px;
            position: absolute;
            top: -16px;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            z-index: 10;
            text-align: center;
            left: 8%;
            &:after {
              content: '';
              height: 100%;
              display: inline-block;
              vertical-align: middle;
            }
            .layui-slider-wrap-btn {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #fff;
              display: inline-block;
              vertical-align: middle;
              cursor: pointer;
              transition: 0.3s;
              border: 2px solid #1e9fff;
            }
          }
        }
        .el-slider  /deep/ {
          .el-slider__runway {
            margin: 10px auto 10px;
            width: 2px;
          }
          .el-slider__bar {
            width: 2px;
          }
          .el-slider__button-wrapper {
            left: -5px !important;
          }
          .el-slider__button {
            width: 12px;
            height: 12px;
            transform: scale(1) !important;
          }
        }
      }
      &:hover {
        .ver-slider {
          background-color: rgba(0, 0, 0, 0.7);
          display: block;
          border-radius: 2px;
        }
      }
       /deep/ .el-slider__button-wrapper {
        // top: -12px;
        width: 0px;
      }
    }
    .Painting {
      cursor: pointer;
      position: relative;
      font-size: 12px;
      margin-right: 20px;
      line-height: 24px;
      height: 24px;
      &.spee:hover {
        /*width: 60px;*/
        ul {
          display: block;
        }
        span {
          color: #fc5659;
        }
      }
      &.Paint:hover {
        ul {
          display: block;
        }
        span {
          color: #fc5659;
        }
      }
      span {
        color: #fff;
        width: 38px;
        font-size: 14px;
        text-align: center;
        display: inline-block;
        &:hover {
          color: #fc5659;
        }
      }
      &.active {
        ul {
          display: block;
        }
      }
      ul {
        border-radius: 2px;
        display: none;
        position: absolute;
        bottom: 100%;
        left: -39%;
        text-align: left;
        padding: 13px 0px;
        line-height: 30px;
        width: 70px;
        background-color: rgba(0, 0, 0, 0.7);
        li {
          list-style-type: none;
          text-align: center;
          font-size: 12px;
          color: #fff;
          &:hover {
            color: #fc5659;
            transform: scale(1.1);
          }
        }
        .li-active {
          color: #fc5659;
        }
      }
    }
    .icon-fullscreen,
    .loop {
      width: 25px;
      height: 25px;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      text-align: center;
      position: relative;
      margin-right: 20px;
    }
  }
  &--play {
    width: 40px;
    height: 60px;
    line-height: 60px;
    font-size: 30px;
  }
  &--voice {
    width: 40px;
    height: 60px;
  }
}
</style>
