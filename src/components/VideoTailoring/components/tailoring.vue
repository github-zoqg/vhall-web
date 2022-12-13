<template>
  <div class="vh-video-tailoring__tailoring-warp" ref="vhTailoringWrap">
    <div class="vh-video-tailoring__control-warp">
      <!-- <div
        class="vh-video-tailoring__control fl"
        ref="vhControlWrap"
        @mousemove="vhControlWrapMouseMove"
        @mouseleave="vhControlWrapMouseLeave"
      >-->
      <div
        id="sliderSelector"
        class="vh-video-tailoring__control fl"
        ref="vhControlWrap"
        v-if="videoTime"
      >
        <el-slider
          v-model="sliderVal"
          :show-tooltip="false"
          ref="controllerRef"
          @change="setVideo"
          @input="setSilderVideo"
        ></el-slider>
        <controlEventPoint
          v-for="(item, index) in eventPointList"
          :key="'controlEventPoint' + index"
          :eventTime="item.timePoint"
          :eventLabel="item.msg"
          :videoTime="videoTime"
        ></controlEventPoint>

        <template v-if="videoTime">
          <effectiveZone
            v-for="(item, index) in cutTimeList"
            :key="'effectiveZone' + index"
            :startTime="Number(item.startTime)"
            :endTime="item.endTime"
            :videoTime="videoTime"
          ></effectiveZone>
        </template>
        <!-- <span
          v-show="currentPointTime"
          class="vh-currentPointTime"
          ref="currentPointTimeDom"
          :style="{ left: currentPointTimeLeft + 'px' }"
          >{{ currentPointTime }}</span
        >-->
      </div>
      <div class="vh-video-tailoring__control fl" ref="vhControlWrap" v-else>
        <el-slider :show-tooltip="false" ref="controllerRef" disabled></el-slider>
      </div>

      <div class="vh-video-tailoring__volume-box">
        <span @click="jingYin" class="vh-video-tailoring__icon-voice-warp">
          <icon
            style="color: #999"
            :icon-class="voice > 0 ? 'saasicon_yangshengqion' : 'saasicon_yangshengqioff'"
          ></icon>
        </span>
        <div class="vh-video-tailoring__slider">
          <el-slider v-model="voice" :show-tooltip="false" vertical height="90px"></el-slider>
        </div>
      </div>
    </div>
    <!-- <span class="vh-video-tailoring__time fr">
      <span class="vh-video-tailoring__hover-time">{{ showTime }}</span>
      /
      {{ showVideoTime }}
    </span>-->
    <div
      class="vh-video-tailoring__button-operation-warp clearfix"
      :class="{ 'vh-video-tailoring__button-operation-warp-active': vodReady }"
    >
      <div>
        <div class="vh-video-tailoring__operate fl" :class="{ 'operate-disabled': !vodReady }">
          <el-tooltip class="item" effect="dark" content="上一秒" placement="top" v-tooltipMove>
            <span @click="seekBack" class="vh-btn vh-video-tailoring__seek-back">
              <icon icon-class="saasicon_shangyimiao"></icon>
            </span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="statePaly ? '暂停' : '开始'"
            placement="top"
            v-tooltipMove
          >
            <span
              @click="videoPlayBtn"
              class="vh-btn vh-video-tailoring__play"
              :class="{ 'is-pause': statePaly }"
            >
              <icon :icon-class="statePaly ? 'saasicon_bofang' : 'saasicon_zanting'"></icon>
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下一秒" placement="top" v-tooltipMove>
            <span @click="seekForward" class="vh-btn vh-video-tailoring__seek-forward">
              <icon icon-class="saasicon_xiayimiao"></icon>
            </span>
          </el-tooltip>
        </div>
        <span class="vh-video-tailoring__time fr">
          <span :class="{ 'vh-video-tailoring__hover-time': vodReady }">{{ showTime }}</span>
          /
          {{ showVideoTime }}
        </span>
      </div>
      <div class="vh-video-select__button">
        <el-button @click="addEvent" class="fl vh-video-tailoring__add-event" :disabled="!vodReady">
          <el-tooltip class="item" effect="dark" content="事件点" placement="top" v-tooltipMove>
            <icon icon-class="saasicon_shijiandian"></icon>
          </el-tooltip>
        </el-button>
        <el-button
          @click="addCutVideoEvent"
          class="fl vh-video-tailoring__cut-video-event"
          :disabled="!vodReady"
        >
          <el-tooltip class="item" effect="dark" content="裁剪" placement="top" v-tooltipMove>
            <icon icon-class="saasicon_caijian"></icon>
          </el-tooltip>
        </el-button>
        <el-button
          @click="delCuttingPointFun"
          class="fl vh-video-tailoring__del-video-event"
          :disabled="!vodReady"
        >
          <el-tooltip class="item" effect="dark" content="删除" placement="top" v-tooltipMove>
            <icon class="icon" icon-class="saasicon_shanchu"></icon>
          </el-tooltip>
        </el-button>

        <el-button
          @click="narrow"
          class="fl vh-video-tailoring__enlarge"
          :disabled="this.currentUnit <= 1 && !vodReady"
        >
          <el-tooltip class="item" effect="dark" content="放大刻度尺" placement="top" v-tooltipMove>
            <icon class="icon" icon-class="saasicon_fangda"></icon>
          </el-tooltip>
        </el-button>

        <el-button
          @click="enlarge"
          class="fl vh-video-tailoring__narrow"
          :disabled="this.currentUnit >= this.maxValue && !vodReady"
        >
          <el-tooltip class="item" effect="dark" content="缩小刻度尺" placement="top" v-tooltipMove>
            <icon class="icon" icon-class="saasicon_suoxiao"></icon>
          </el-tooltip>
        </el-button>
        <el-button
          :disabled="!vodReady"
          @click="qp"
          class="fl vh-btn vh-video-tailoring__qp-btn"
          v-if="!isFullScreen"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="全屏"
            placement="top"
            v-if="!isFullScreen"
            v-tooltipMove
          >
            <icon class="icon" icon-class="saasicon_quanping"></icon>
          </el-tooltip>
          <!-- <span class="vh-iconfont vh-icon-full-screen"></span> -->
        </el-button>
        <el-button
          :disabled="!vodReady"
          @click="tcqp"
          class="fl vh-btn vh-video-tailoring__qxqp-btn"
          v-if="isFullScreen"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="退出全屏"
            placement="top"
            v-if="isFullScreen"
            v-tooltipMove
          >
            <icon class="icon" icon-class="saasicon_quxiaoquanping"></icon>
          </el-tooltip>
          <!-- <span class="vh-iconfont vh-icon-exit-full-screen"></span> -->
        </el-button>
      </div>
      <el-button
        @click="saveVideo"
        class="fr vh-video-tailoring__save-btn"
        :class="{ 'vh-video-tailoring__btn-disable': !vodReady }"
      >
        {{ t('保存') }}
      </el-button>
      <el-button
        @click="exportVideo"
        class="fr vh-video-tailoring__export-btn"
        :class="{ 'vh-video-tailoring__btn-disable': !vodReady }"
      >
        {{ t('导出') }}
      </el-button>
    </div>
    <div class="vh-video-tailoring__operation-warp">
      <div
        class="vh-video-tailoring__cursor-operation-warp"
        ref="rulersWarp"
        :style="{ left: rulersWarpLeft + 'px' }"
      >
        <div class="vh-video-tailoring__rulers-warp">
          <Ruler
            :style="{ left: firstRulerLeft + 'px' }"
            :currentUnit="currentUnitData"
            :rulerLength="rulerLength"
            :startTime="firstRulerStartTime"
            ref="firstRuler"
          ></Ruler>
          <Ruler
            :style="{ left: secondRulerLeft + 'px' }"
            :currentUnit="currentUnitData"
            :rulerLength="rulerLength"
            :startTime="secondRulerStartTime"
            ref="secondRuler"
          ></Ruler>
          <Pointer
            :currentUnit="currentUnitData"
            :warpStart="warpStart"
            :firstRulerStartTime="firstRulerStartTime"
            :secondRulerStartTime="secondRulerStartTime"
            :currentPage="currentPage"
            :rulerLength="rulerLength"
            @previewChange="previewChange"
          ></Pointer>

          <video-duration
            ref="refVideoDuration"
            :videoTime="videoTime"
            :currentUnit="currentUnitData"
            :warpStart="warpStart"
            :firstRulerStartTime="firstRulerStartTime"
            :secondRulerStartTime="secondRulerStartTime"
            :currentPage="currentPage"
            :rulerLength="rulerLength"
            :eventPointList="eventPointList"
            @previewChange="previewChange"
            :vodReady="vodReady"
          ></video-duration>
        </div>
      </div>

      <div class="vh-video-tailoring__slider clearfix">
        <div class="vh-video-tailoring__slider-ruler fl">
          <el-slider
            v-model="sliderValue"
            :max="sliderMaxVal"
            @input="sliderChange"
            :videoTime="videoTime"
            :show-tooltip="false"
            :disabled="isSliderDisabled"
          ></el-slider>
        </div>
        <!-- <div class="vh-silder-control fr">
        <el-slider
          v-model="currentUnit"
          show-input
          :min="1"
          :max="maxValue"
          :show-tooltip="false"
        >
        </el-slider>
        </div>-->
      </div>
    </div>
    <!-- <div
      class="vh-video-tailoring__operation-empty-warp"
      v-show="!vodReady"
    >{{ t('添加媒体资源后，开始创建您的视频！')}}
    {{t('立即')}}
      <el-link type="primary" @click="addVideo">{{t('添加回放')}}</el-link>
    </div> -->
    <el-dialog
      class="vh-video-tailoring__popbody"
      :visible.sync="addEventType"
      width="480px"
      :title="t('设置事件点')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="vh-video-tailoring__form vh-video-tailoring__form-time">
        <span>{{ t('选择时间') }}</span>
        <div class="vh-video-tailoring__input-form">{{ formatEventTime }}</div>
      </div>
      <div class="vh-video-tailoring__form">
        <span>{{ t('标记文字') }}</span>
        <div class="vh-video-tailoring__input-form">
          <VhallInput
            v-model="eventLabel"
            :placeholder="t('请输入标记文字')"
            maxlength="20"
            v-clearEmoij
            show-word-limit
          ></VhallInput>
        </div>
      </div>
      <div class="vh-video-tailoring__btn-group">
        <el-button round size="medium" type="primary" @click="addEventPoint">
          {{ t('确定') }}
        </el-button>
        <el-button round size="medium" @click="cancelAddEventPoint">{{ t('取消') }}</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      class="vh-video-tailoring__delcutpoint-popbody"
      :visible.sync="delCutPoint"
      title
      width="440px"
    :close-on-click-modal=false
    :close-on-press-escape=false
    >
      <div class="vh-video-tailoring__form">
        <img src="../image/del@2x.png" alt />
        <p>{{ t('删除剪切点，是否确认删除？') }}</p>
      </div>
      <div class="vh-video-tailoring__btn-group">
        <el-button type="primary" @click="delCutPointFun">{{ t('确认') }}</el-button>
        <el-button @click="closeDelCutPointPop">{{ t('取消') }}</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import Ruler from './ruler'; // 剪裁刻度尺组件
  import Pointer from './pointer'; // 当前播放时间对应指针组件
  import videoDuration from './video-duration'; // 剪裁区域的视频进度条
  import controlEventPoint from './control-event-point'; // 控制条中事件点的显示
  import effectiveZone from './effective-zone'; // 控制条中有效区的显示
  import { formatTime, descend } from '../js/format';
  // import { match } from 'minimatch'
  export default {
    props: {
      /**
       * 视频刻度尺总显示时长 单位为秒 默认20*60
       */
      videoShowTime: {
        type: Number,
        default: 1200,
        required: true
      },
      /**
       * 一个视频刻度由两个定长的尺子组成，目的是视频长度过长时，避免页面渲染过多li影响性能
       * rulerLength则是每个尺子所分格数
       */
      rulerLength: {
        type: Number,
        default: 100,
        required: true
      },
      /**
       * 当前时间单位初始化 共七档对应 1s、3s、6s、12s、30s、60s、120s
       */
      initUnit: {
        type: Number,
        required: false
      },
      /**
       * 视频初始化是否完成
       */
      vodReady: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        videoTime: 0, // 视频实际时长
        currentPage: 0, // slider当前滑动页数
        sliderValue: 0, // slider当前数值
        firstRulerStartTime: 0, // 第一把尺子初始时间
        secondRulerStartTime: 0, // 第二把尺子初始时间
        preSliderVal: 0, // 记录滑动完成前一个slider数，来判断当前slider是向前滑动还是向后滑动
        rulersWarpLeft: 0, // 总刻度尺的向左偏移量
        sliderData: 0, // 当前刻度下slider滑动位置对应的秒数
        firstRulerLeft: 0, // 第一把尺子的向左偏移量
        secondRulerLeft: 1200, // 第二把尺子的向左偏移量
        warpStart: 0, // 刻度尺所在框架与浏览器左侧距离，用于计算指针等位置转换
        currentTime: 0, // 当前视频播放时间
        // hoverTime: '', // 当前鼠标滑动显示的时间
        // isPreview: false, // 当前是否是预览状态
        previewSettimeOut: null, // 预览所需要的计时器，控制跳转视频播放时间
        cutTimeList: [], // 当前所有被裁剪的时间段数组
        eventPointList: [], // 事件点数组
        addEventType: false, // 添加事件点弹窗
        eventTime: '', // 事件时间
        eventLabel: '', // 事件名
        currentUnit: this.initUnit, // 当前时间单位 共七档对应 1s、3s、6s、12s、30s、60s、120s
        isSliderDisabled: true,
        sliderVal: 0, // 视频时间
        statePaly: false, // 默认播放状态
        voice: 60, // 音量
        catchVoice: 0,
        delCuttingPoint: '',
        // currentPointTime: '', // 鼠标滑过播放条时当前时间
        // currentPointTimeLeft: '', // 鼠标滑过播放条时当前时间左侧位置
        maxValue: this.initUnit, // 放大缩小倍数最大值
        currentTimeLeft: '', // 鼠标滑过裁剪区域显示当前时间左侧位置
        delCutPoint: false, // 删除裁剪点弹窗显示隐藏
        formatEventTime: '', // 事件点弹窗中显示的格式化后的时间
        isFullScreen: false, // 当前是否是全屏
        isUserInput: false // 是否是用户触发的视频进度条的 input 事件
      };
    },
    beforeDestroy() {
      // sessionStorage.setItem('leftTime', 0);
      this.$EventBus.$off('seekTime');
      // this.$EventBus.$off('cutTimeListChange') // 测试是否注释
      this.$EventBus.$off('showEventPointPop');
      this.$EventBus.$off('delEventPoint');
      this.$EventBus.$off('deleteCutPoint');
      this.$EventBus.$off('blockInit');
      this.$EventBus.$off('cuttingBlockInit');
      this.$EventBus.$off('deleteCutPoint');
      this.$EventBus.$off('addEventPoint');
      this.$EventBus.$off('cuttiongBlockRemove');
      this.$EventBus.$off('pointMouseDown');
      this.$EventBus.$off('pointMouseUp');
      this.$EventBus.$off('deleteCutPointSuccess');
      window.clearInterval(this.previewSettimeOut);
      document.removeEventListener('mouseup', this.sliderMouseUp);
    },
    created() {
      sessionStorage.setItem('leftTime', 0);
      this.$nextTick(() => {
        // 对两个刻度尺初始化
        this.firstRulerStartTime = this.currentPage * this.rulerLength;
        this.secondRulerStartTime = (this.currentPage + 1) * this.rulerLength;
        this.secondRulerLeft = this.rulerLength * 10; // 第二把尺子的向左偏移量
        if (this.$refs.rulersWarp) {
          this.warpStart = this.$refs.rulersWarp.getBoundingClientRect().left;
        }
      });

      this.$EventBus.$on('eventPointListInit', eventPointList => {
        this.eventPointList = eventPointList;
      });

      // 监听视频初始化成功
      this.$EventBus.$on('component_playerSDK_ready', () => {
        setTimeout(() => {
          // 动态获取当前视频的总时长及当前播放的时间 当做刻度尺值，弱播放时间小于1200秒，则刻度尺最小赋值为1200秒
          this.videoTime = Math.round(window.vhallPlayer.getDuration());
          this.$nextTick(() => {
            const sliderBtn = document.querySelector('#sliderSelector .el-slider__button');
            sliderBtn.onmousedown = () => {
              this.isUserInput = true;
            };
            document.addEventListener('mouseup', this.sliderMouseUp);
          });
          let leftTime = sessionStorage.getItem('leftTime');
          this.$EventBus.$emit('blockInit', leftTime ? leftTime : 0, this.videoTime);
          window.vhallPlayer.on(window.VhallPlayer.TIMEUPDATE, () => {
            this.currentTime = window.vhallPlayer.getCurrentTime(() => {
              console.log('获取当前视频播放时间失败----------');
            });
            this.sliderVal = (this.currentTime / this.videoTime) * 100;
          });
        }, 100);

        let currentScreenDate = 110 * this.currentUnitData;
        this.isSliderDisabled = currentScreenDate >= this.videoTime;

        window.vhallPlayer.on(window.VhallPlayer.PLAY, () => {
          // 监听播放状态
          this.statePaly = true;
        });
        window.vhallPlayer.on(window.VhallPlayer.PAUSE, () => {
          // 监听暂停状态
          this.statePaly = false;
        });
      });

      // 监听当前对裁剪的时间段数组的增加或移除操作，用来更新控制跳转视频播放时间
      this.$EventBus.$on('cutTimeListChange', cutTimeList => {
        this.previewChange();
        this.cutTimeList = cutTimeList;
        this.$forceUpdate();
      });

      // 显示添加修改事件点弹窗
      this.$EventBus.$on('showEventPointPop', (eventTime, eventLabel) => {
        this.eventTime = eventTime;
        this.eventLabel = eventLabel;
        this.addEventType = true;
      });

      // 监听删除事件点事件
      this.$EventBus.$on('delEventPoint', eventTime => {
        this.eventTime = eventTime;
        this.delEventPoint();
      });

      // 监听删除裁剪时间段的操作
      this.$EventBus.$on('deleteCutPoint', pointTime => {
        this.delCuttingPoint = pointTime;
      });
    },
    mounted() {},
    components: {
      Ruler,
      Pointer,
      videoDuration,
      controlEventPoint,
      effectiveZone
    },
    methods: {
      /**
       * 全屏
       */
      qp() {
        this.isFullScreen = true;
        let fullarea = this.$parent.$refs.videoTailoringWarp;
        if (fullarea.requestFullscreen) {
          fullarea.requestFullscreen();
        } else if (fullarea.webkitRequestFullScreen) {
          fullarea.webkitRequestFullScreen();
        } else if (fullarea.mozRequestFullScreen) {
          fullarea.mozRequestFullScreen();
        } else if (fullarea.msRequestFullscreen) {
          // IE11
          fullarea.msRequestFullscreen();
        }
      },
      /**
       * 取消全屏
       */
      tcqp() {
        this.isFullScreen = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      },
      // vhControlWrapMouseMove (e) {
      //   if (this.vodReady) {
      //     let basic = this.$refs.vhControlWrap
      //     let basicLeft = basic.getBoundingClientRect().left
      //     let basicWidth = basic.getBoundingClientRect().width
      //     let point = e.pageX - basicLeft
      //     let seekTime = (point / basicWidth) * this.videoTime
      //     let hoverTime = formatTime(seekTime * 1)
      //     this.currentPointTime = hoverTime
      //     let currentPointTimeWidth = this.$refs.currentPointTimeDom.getBoundingClientRect()
      //       .width
      //     if (point - currentPointTimeWidth / 2 < 0) {
      //       this.currentPointTimeLeft = 0
      //     } else if (
      //       point - currentPointTimeWidth / 2 >=
      //       basicWidth - currentPointTimeWidth
      //     ) {
      //       this.currentPointTimeLeft = basicWidth - currentPointTimeWidth
      //     } else {
      //       this.currentPointTimeLeft = point - currentPointTimeWidth / 2
      //     }
      //   }
      // },
      // vhControlWrapMouseLeave () {
      //   this.currentPointTime = ''
      // },
      /**
       * 静音/取消静音
       */
      jingYin() {
        if (this.voice == 0) {
          this.voice = this.catchVoice;
        } else {
          this.catchVoice = this.voice;
          this.voice = 0;
        }
      },
      /**
       * 播放||暂停
       */
      videoPlayBtn() {
        if (this.vodReady) {
          if (window.vhallPlayer.getIsPause()) {
            this.play();
          } else {
            this.pause();
          }
        }
      },
      /**
       *  开始播放旁路
       */
      play() {
        window.vhallPlayer && window.vhallPlayer.play();
      },
      /**
       * 暂停
       */
      pause() {
        window.vhallPlayer && window.vhallPlayer.pause();
      },
      /**
       * 快进功能
       */
      setVideo() {
        const time = (this.sliderVal / 100) * this.videoTime;
        this.setVideoCurrentTime(time);
        this.play();
      },
      /**
       * 滑动滚动条滑块
       */
      setSilderVideo() {
        if (this.isUserInput) {
          const time = (this.sliderVal / 100) * this.videoTime;
          this.setVideoCurrentTime(time);
          this.play();
        }
      },
      /**
       * 滑块鼠标松开事件执行函数
       */
      sliderMouseUp() {
        this.isUserInput = false;
      },
      /**
       * 设置播放时间
       */
      setVideoCurrentTime(val) {
        window.vhallPlayer && window.vhallPlayer.setCurrentTime(val);
      },
      /**
       * 视频刻度倍数变更
       */
      sliderChange(val) {
        // slider移动计算当前尺子的渲染结果
        this.sliderData = val * this.currentUnitData * 10; // 当前刻度下slider滑动位置对应的秒数
        this.currentPage = parseInt(this.sliderData / this.rulerUnitLength); // 当前页数
        this.rulersWarpLeft = -(val * 10 * 10);
        this.rulersWarpLeft = val == 0 ? this.rulersWarpLeft : this.rulersWarpLeft - 9;
        if (Math.abs(this.rulersWarpLeft % (this.rulerLength * 10)) > 120) {
          if (this.preSliderVal > val) {
            let curPg = this.currentPage + 1;
            if (curPg % 2 == 0) {
              // 避免点击滑块错误修改
              this.firstRulerLeft = this.rulerLength * 10 * (this.currentPage + 1);
              this.firstRulerStartTime = (this.currentPage + 1) * this.rulerLength;
              // 实际修改
              this.secondRulerLeft = this.rulerLength * 10 * this.currentPage;
              this.secondRulerStartTime = this.currentPage * this.rulerLength;
            } else {
              // 实际修改
              this.firstRulerLeft = this.rulerLength * 10 * this.currentPage;
              this.firstRulerStartTime = this.currentPage * this.rulerLength;
              // 避免点击滑块错误修改
              this.secondRulerLeft = this.rulerLength * 10 * (this.currentPage + 1);
              this.secondRulerStartTime = (this.currentPage + 1) * this.rulerLength;
            }
            // console.log('向←走', this.currentPage)
          } else {
            if (this.currentPage % 2 == 1) {
              // 实际修改
              this.firstRulerLeft = this.rulerLength * 10 * (this.currentPage + 1);
              this.firstRulerStartTime = (this.currentPage + 1) * this.rulerLength;
              // 避免点击滑块错误修改
              this.secondRulerLeft = this.rulerLength * 10 * this.currentPage;
              this.secondRulerStartTime = this.currentPage * this.rulerLength;
            } else {
              // 避免点击滑块错误修改
              this.firstRulerLeft = this.rulerLength * 10 * this.currentPage;
              this.firstRulerStartTime = this.currentPage * this.rulerLength;
              // 实际修改
              this.secondRulerLeft = this.rulerLength * 10 * (this.currentPage + 1);
              this.secondRulerStartTime = (this.currentPage + 1) * this.rulerLength;
            }
            // console.log('向→走', this.currentPage)
          }
          this.preSliderVal = val;
        } else if (this.rulersWarpLeft == 0 || val == 0) {
          // 避免点击滑块错误修改
          this.firstRulerLeft = this.rulerLength * 10 * 0;
          this.firstRulerStartTime = 0 * this.rulerLength;
          // 实际修改
          this.secondRulerLeft = this.rulerLength * 10 * 1;
          this.secondRulerStartTime = 1 * this.rulerLength;
        }
      },
      /**
       * 后退一秒
       */
      seekBack() {
        if (this.vodReady) {
          this.currentTime = parseInt(
            window.vhallPlayer.getCurrentTime(() => {
              console.log('获取当前视频播放时间失败----------');
            })
          );
          window.vhallPlayer.setCurrentTime(this.currentTime - 1);
        }
      },
      /**
       * 前进一秒
       */
      seekForward() {
        if (this.vodReady) {
          this.currentTime = parseInt(
            window.vhallPlayer.getCurrentTime(() => {
              console.log('获取当前视频播放时间失败----------');
            })
          );
          window.vhallPlayer.setCurrentTime(this.currentTime + 1);
        }
      },
      /**
       * 添加事件点，显示弹窗
       */
      addEvent() {
        this.addEventType = true;
        this.eventTime = Math.round(
          window.vhallPlayer.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          })
        );
        this.formatEventTime = formatTime(this.eventTime * 1);
      },
      /**
       * 添加事件点
       */
      addEventPoint() {
        if (this.eventLabel == '') {
          this.$message({
            message: this.t('请输入事件点标记文字'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        let eventPoint = { timePoint: this.eventTime, msg: this.eventLabel };
        this.eventLabel = '';
        for (let i = 0; i < this.eventPointList.length; i++) {
          if (this.eventPointList[i].timePoint == eventPoint.timePoint) {
            this.eventPointList.splice(i, 1);
            break;
          }
        }
        this.eventPointList.push(eventPoint);
        this.$EventBus.$emit('eventPointListChange', this.eventPointList);
        this.addEventType = false;
      },
      /**
       * 取消添加事件点
       */
      cancelAddEventPoint() {
        this.addEventType = false;
      },
      /**
       * 删除事件点
       */
      delEventPoint() {
        if (this.eventTime !== '') {
          for (let i = 0; i < this.eventPointList.length; i++) {
            if (this.eventPointList[i].timePoint == this.eventTime) {
              this.eventPointList.splice(i, 1);
              this.$EventBus.$emit('eventPointListChange', this.eventPointList);
              break;
            }
          }
        }
      },
      /**
       * 关闭事件点弹窗
       */
      closeEventPointPop() {
        this.addEventType = false;
      },
      /**
       * 对视频进行裁剪操作
       */
      addCutVideoEvent() {
        let cutTime = parseInt(
          window.vhallPlayer.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          })
        );
        if (cutTime == 0 || cutTime == this.videoTime) {
          this.$message({
            message: this.t('请选择正确的视频裁剪点'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        this.$EventBus.$emit('cuttingBlockInit', cutTime);
      },
      /**
       * 对当前裁剪的视频进行预览或取消预览
       */
      previewChange() {
        let cutTimeListNew = this.cutTimeList;
        window.clearInterval(this.previewSettimeOut);
        this.previewSettimeOut = window.setInterval(() => {
          let curTime = 0;
          if (window.vhallPlayer) {
            curTime = parseInt(
              window.vhallPlayer.getCurrentTime(() => {
                console.log('获取当前视频播放时间失败----------');
              })
            );
          }
          if (curTime == 0) return false;
          cutTimeListNew = cutTimeListNew.sort(descend);
          if (cutTimeListNew.length == 1) {
            if (curTime < cutTimeListNew[0].startTime) {
              window.vhallPlayer.setCurrentTime(cutTimeListNew[0].startTime);
            } else if (curTime >= cutTimeListNew[0].endTime) {
              window.vhallPlayer.setCurrentTime(cutTimeListNew[0].endTime);
              window.vhallPlayer.pause();
            }
          } else {
            for (let i = 0; i < cutTimeListNew.length; i++) {
              if (i == 0) {
                if (curTime < cutTimeListNew[i].startTime) {
                  window.vhallPlayer.setCurrentTime(cutTimeListNew[i].startTime);
                } else if (i + 1 < cutTimeListNew.length) {
                  if (
                    curTime >= cutTimeListNew[i].endTime &&
                    curTime < cutTimeListNew[i + 1].startTime
                  ) {
                    window.vhallPlayer.setCurrentTime(cutTimeListNew[i + 1].startTime);
                  }
                }
              } else if (i + 1 == cutTimeListNew.length) {
                if (curTime >= cutTimeListNew[i].endTime) {
                  window.vhallPlayer.setCurrentTime(cutTimeListNew[i].endTime);
                  window.vhallPlayer.pause();
                } else if (
                  curTime < cutTimeListNew[i].startTime &&
                  curTime >= cutTimeListNew[i - 1].endTime
                ) {
                  window.vhallPlayer.setCurrentTime(cutTimeListNew[i].startTime);
                }
              } else {
                if (
                  curTime >= cutTimeListNew[i].endTime &&
                  curTime < cutTimeListNew[i + 1].startTime
                ) {
                  window.vhallPlayer.setCurrentTime(cutTimeListNew[i + 1].startTime);
                }
              }
            }
          }
        }, 1000);
      },
      /**
       * 时间轴放大
       */
      enlarge() {
        if (this.currentUnit < this.maxValue) {
          ++this.currentUnit;
        }
      },
      /**
       * 时间轴缩小
       */
      narrow() {
        if (this.currentUnit > 1) {
          --this.currentUnit;
        }
      },
      /**
       * 点击删除事件点操作
       */
      delCuttingPointFun() {
        if (this.delCuttingPoint !== '') {
          this.delCutPoint = true;
          this.$confirm('删除剪切点，是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              this.delCutPointFun();
            })
            .catch(() => {});
        }
      },
      /**
       * 删除裁剪时间段操作
       */
      delCutPointFun() {
        this.$EventBus.$emit('deleteCutPointSuccess', this.delCuttingPoint);
        this.delCutPoint = false;
        this.delCuttingPoint = '';
      },
      /**
       * 关闭删除裁剪点确认弹窗
       */
      closeDelCutPointPop() {
        this.delCutPoint = false;
      },
      /**
       * 保存视频
       */
      async saveVideo() {
        if (!this.vodReady) {
          return false;
        }
        this.$emit('saveVideoClick');
      },
      /**
       * 点击导出回放
       */
      exportVideo() {
        if (!this.vodReady) {
          return false;
        }
        this.$emit('exportVideoClick');
        // let duration = 0
        // for (let i = 0; i < this.$parent.cutTimeList.length; i++) {
        //   duration += parseInt(this.$parent.cutTimeList[i].endTime - this.$parent.cutTimeList[i].startTime)
        // }
        // this.$parent.exportVideoDuration = formatTime(duration)
        // this.$parent.exportVideoVisibile = true
      },
      addVideo() {
        this.$emit('addVideo');
      },
      t(name) {
        return name;
      }
    },
    watch: {
      /**
       * 事件点弹窗打开，视频暂停
       * 事件点弹窗关闭，视频播放
       */
      // eslint-disable-next-line no-unused-vars
      addEventType(newVal, oldVal) {
        if (newVal) {
          window.vhallPlayer.pause();
        } else {
          this.eventTime = '';
          this.eventLabel = '';
          window.vhallPlayer.play();
        }
      },
      /**
       * 监测当前时间单位变化
       */
      // eslint-disable-next-line no-unused-vars
      initUnit(newVal, oldVal) {
        this.currentUnit = newVal;
        this.maxValue = newVal;
      },
      /**
       * 监测当前时间单位变化，修改最下面滚动条是否可用
       */
      // eslint-disable-next-line no-unused-vars
      currentUnit(newVal, oldVal) {
        this.sliderValue = 0;
        let currentScreenDate = 110 * this.currentUnitData;
        this.isSliderDisabled = currentScreenDate >= this.videoTime;
      },
      /**
       * 设置视频声音
       */
      // eslint-disable-next-line no-unused-vars
      voice(newVal, oldVal) {
        window.vhallPlayer.setVolume(newVal, () => {
          console.log('设置音量失败');
        });
      },
      /**
       * 视频初始化完成后，获取初始化刻度尺开始端位置
       */
      // eslint-disable-next-line no-unused-vars
      vodReady(newVal, oldVal) {
        if (newVal) {
          this.warpStart = this.$refs.rulersWarp.getBoundingClientRect().left;
        }
      },
      t(name) {
        return name;
      }
    },
    computed: {
      /**
       * silder的最大值 视频总时长/当前单位时长 / 10刻度
       */
      sliderMaxVal() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        let sliderMaxValData = Math.round(this.videoShowTime / this.currentUnitData / 10);
        // return sliderMaxValData > 0 ? sliderMaxValData - 1 : 0
        return sliderMaxValData;
      },
      /**
       * 当前刻度下一把尺子的长度(单位秒)
       */
      rulerUnitLength() {
        return this.rulerLength * this.currentUnitData;
      },
      /**
       * 当前单位刻度对应的换算
       */
      currentUnitData() {
        switch (this.currentUnit) {
          case 1:
            return 1;
          case 2:
            return 3;
          case 3:
            return 6;
          case 4:
            return 12;
          case 5:
            return 30;
          case 6:
            return 60;
          case 7:
            return 120;
          default:
            return 1;
        }
      },
      /**
       * 视频当前播放时长初始化
       */
      showTime() {
        return formatTime(Math.round(this.currentTime) * 1);
      },
      /**
       * 视频总时长格式化
       */
      showVideoTime() {
        return formatTime(this.videoTime * 1);
      },
      eventLabelLength() {
        return this.eventLabel.length;
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__tailoring-warp {
    // padding: 0 20px;
    position: relative;
    .vh-video-tailoring__control-warp {
      width: auto;
      height: 37px;
      background-color: #222222;
      padding: 0px 2px 0px 24px;
      .vh-video-tailoring__control {
        width: calc(100% - 60px);
        position: relative;
        .vh-currentPointTime {
          position: absolute;
          top: -15px;
          padding: 0px 5px;
          background: red;
          border-radius: 50px;
        }
        .el-slider__runway {
          height: 4px;
          margin: 11px 0 0;
          .el-slider__bar {
            height: 4px;
            background-color: #4e4e4e;
          }
        }
        .el-slider__button-wrapper {
          width: 12px;
          height: 36px;
          line-height: 36px;
          top: -17px;
        }

        .el-slider__runway.disabled .el-slider__bar,
        .el-slider__runway.disabled {
          background-color: #333;
        }

        .el-slider__button {
          background: url(../image/slider-button-new.png);
          width: 16px;
          height: 16px;
          border-radius: 0;
          background-repeat: no-repeat;
          background-size: 16px 16px;
          border: 0;
        }
        &:hover {
          .el-slider__button {
            // width: 8px;
            // height: 8px;
            // border: 2px;
            // cursor: initial !important;
          }
        }
      }
      .vh-video-tailoring__volume-box {
        position: relative;
        width: 60px;
        height: 28px;
        line-height: 40px;
        float: right;
        display: flex;
        align-items: center;
        justify-content: center;
        .vh-iconfont {
          display: inline-block;
          font-size: 22px;
          color: #fafafa;
          cursor: pointer;
          &:hover {
            color: #1890ff;
          }
        }
        .vh-video-tailoring__icon-voice-warp {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 28px;
          &:hover {
            & + .vh-video-tailoring__slider {
              display: block;
            }
          }
        }
        .vh-video-tailoring__slider {
          display: none;
          width: 70px;
          position: absolute;
          z-index: 3;
          right: -8px;
          top: -110px;
          &:hover {
            display: inline-block;
          }
          .el-slider {
            width: 40px;
            background: rgba(0, 0, 0, 0.81);
            border-radius: 4px;
            padding: 10px 0;
            .el-slider__runway {
              margin: 0 18px;
              background: #333;
              // .el-slider__bar {
              //   background-color: #E18B2E;
              // }
            }
          }
          .el-slider.is-vertical .el-slider__runway,
          .el-slider.is-vertical .el-slider__bar {
            width: 6px;
          }
          .el-slider.is-vertical .el-slider__button-wrapper {
            left: -15px;
            .el-slider__button {
              width: 14px;
              height: 14px;
              border: none;
              box-shadow: 0px 0px 6px 0px rgba(30, 137, 228, 0.8);
              background: #ececec;
            }
          }
        }
      }
    }
    .vh-video-tailoring__button-operation-warp {
      height: 56px;
      line-height: 56px;
      background-color: #17171e;
      height: 72px;
      line-height: 72px;
      padding: 0px 24px;
      border-radius: 15px 15px 0px 0px;
      display: flex;
      align-items: center;
      position: relative;
      .fr {
        float: right !important;
      }
      .fl {
        float: left !important;
      }
      .vh-video-select__button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: 9px;

        .el-button {
          // margin: 10px 7.5px;
          // width: 120px;
          // height: 36px;
          width: 20px;
          margin-right: 20px;
          padding: 0;
          border-radius: 4px;
          background-color: transparent;
          color: #80818b;
          border: none;
          background-repeat: no-repeat;
          &:hover {
            background-color: transparent;
            color: #fff;
          }
          &.is-disabled {
            cursor: default;
            // opacity: 1;
            // &:hover {
            // color: #80818b;
            // }
          }
          .vh-iconfont {
            font-size: 22px;
          }
          .iconfont-v3 {
            font-size: 18px;
          }
          // &.vh-video-tailoring__add-event {
          //   margin-left: 30px;
          //   background-size: 16px 17px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/add-event@2x.png');
          //   &:hover {
          //     color: #fff;
          //     background-image: url('../image/add-event-hover@2x.png');
          //   }
          // }
          // &.vh-video-tailoring__cut-video-event {
          //   background-size: 14px 17px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/cut-video-event@2x.png');
          //   &:hover {
          //     color: #fff;
          //     background-image: url('../image/cut-video-event-hover@2x.png');
          //   }
          // }
          // &.vh-video-tailoring__del-video-event {
          //   background-size: 16px 16px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/del-video-event@2x.png');
          //   &:hover {
          //     color: #fff;
          //     background-image: url('../image/del-video-event-hover@2x.png');
          //   }
          // }
          // &.vh-video-tailoring__enlarge {
          //   background-size: 16px 16px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/enlarge@2x.png');
          //   &:hover {
          //     color: #fff;
          //     background-image: url('../image/enlarge-hover@2x.png');
          //   }
          // }
          // &.vh-video-tailoring__narrow {
          //   background-size: 16px 2px;
          //   background-position: 16px 17px;
          //   background-image: url('../image/narrow@2x.png');
          //   &:hover {
          //     color: #fff;
          //     background-image: url('../image/narrow-hover@2x.png');
          //   }
          // }
          // &.vh-video-tailoring__qp-btn {
          //   background-size: 16px 16px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/qp@2x.png');
          //   &:hover {
          //     background-image: url('../image/qp-hover@2x.png');
          //     color: #ffffff;
          //   }
          // }
          // &.vh-video-tailoring__qxqp-btn {
          //   background-size: 16px 16px;
          //   background-position: 16px 9px;
          //   background-image: url('../image/qp@2x.png');
          //   &:hover {
          //     background-image: url('../image/qp-hover@2x.png');
          //     color: #ffffff;
          //   }
          // }
        }
      }
      .vh-video-tailoring__time {
        color: #666;
        .vh-video-tailoring__hover-time {
          color: #fff;
        }
      }
      .vh-video-select__button .el-button {
        color: #999;
        font-size: 18px;
        &:hover {
          color: #fff;
        }
      }
      .vh-btn {
        display: inline-block;
        cursor: pointer;
        background-repeat: no-repeat;
        vertical-align: middle;
        &.vh-video-tailoring__seek-back {
          width: 18px;
          height: 21px;
          line-height: 21px;
          background-size: 16px 13px;
          margin-left: 0px;
          i {
            color: #999;
            font-size: 18px;
            &:hover {
              color: #fff;
            }
          }
        }
        &.vh-video-tailoring__play {
          width: 20px;
          height: 21px;
          background-size: 20px 22px;
          margin: 0 26px;
          line-height: 22px;
          i {
            color: #999;
            font-size: 22px;
            &:hover {
              color: #fff;
            }
          }
        }
        &.vh-video-tailoring__seek-forward {
          width: 18px;
          height: 21px;
          line-height: 21px;
          background-size: 16px 13px;
          i {
            color: #999;
            font-size: 18px;
            &:hover {
              color: #fff;
            }
          }
        }
      }
      .vh-video-tailoring__save-btn {
        width: 76px;
        height: 36px;
        line-height: 36px;
        background: #fb3a32;
        border: none;
        border-radius: 18px;
        padding: 0;
        text-align: center;
        color: #fafafa;
        position: absolute;
        right: 114px;
        // &:hover{
        //   color: #FAFAFA;
        //   background-color: #1890FF;
        // }
        &.vh-video-tailoring__btn-disable {
          color: #ffffff !important;
          background: #f09d99 !important;
          cursor: default;
        }
      }
      .vh-video-tailoring__export-btn {
        width: 76px;
        height: 36px;
        line-height: 36px;
        background: #000000;
        border-radius: 18px;
        padding: 0;
        text-align: center;
        color: #999999;
        position: absolute;
        right: 24px;
        border: 1px solid #666666;
        // &:hover{
        //   color: #999999;
        //   background-color: #1890FF;
        // }
        &.vh-video-tailoring__btn-disable {
          cursor: default;
        }
      }
      .vh-video-tailoring__time {
        color: #666;
        line-height: 76px;
        .vh-video-tailoring__hover-time {
          color: #fff;
        }
      }
      .vh-video-tailoring__operate {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.operate-disabled {
          i {
            color: #999 !important;
            cursor: default !important;
          }
        }
      }
      &.vh-video-tailoring__button-operation-warp-active {
        .vh-video-tailoring__time {
          color: #666;
          .vh-video-tailoring__hover-time {
            color: #fff;
          }
        }
        .vh-video-select__button .el-button {
          color: #999;
          font-size: 18px;
          &:hover {
            color: #fff;
          }
        }
      }
    }
    .vh-unit-warp {
      float: left;
      margin: 5px 5px 0 0;
    }
    .vh-video-tailoring__operation-warp {
      width: 100%;
      padding-top: 20px;
      margin-top: 15px;
      padding-bottom: 8px;
      overflow: hidden;
      background: #000;
      .vh-title {
        text-align: center;
        font-size: 18px;
        border-bottom: 1px solid #333;
      }
      .vh-video-tailoring__cursor-operation-warp {
        position: relative;
        height: 120px;
        // background-color: #b3b3b3;
        .vh-video-tailoring__rulers-warp {
          height: 100%;
        }
      }
      .el-slider__runway {
        background: #333;
        .el-slider__bar {
          background-color: #666;
        }
      }
    }
    .vh-video-tailoring__operation-empty-warp {
      width: 1306px;
      height: 93px;
      border: 1px dashed #4b4b53;
      margin: 8px auto;
      color: #80818b;
      line-height: 91px;
      font-size: 14px;
      .el-link {
        .el-link--inner {
          line-height: 22px;
        }
      }
    }
    .vh-test {
      position: absolute;
      top: 0;
      left: 0;
    }
    .vh-video-tailoring__popbody {
      .el-dialog {
        overflow: hidden;
      }
      .el-dialog__body {
        text-align: left;
        background-color: #fff;
        .vh-video-tailoring__form {
          margin-top: 24px;
          &.vh-video-tailoring__form-time {
            margin-top: 0;
          }
          > span {
            display: inline-block;
            width: 56px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1a1a1a;
            line-height: 20px;
          }
          .vh-video-tailoring__input-form {
            display: inline-block;
            width: 351px;
            margin-left: 8px;
            color: #1a1a1a;
            position: relative;
            .el-input__inner {
              height: 40px;
              line-height: 40px;
            }
            .vh-invitation-card__title-length {
              position: absolute;
              right: 8px;
              top: 8px;
              color: #666666;
              width: fit-content;
              span {
                width: fit-content;
                &.vh-invitation-card__curLength {
                  color: #1e90ff;
                }
              }
            }
          }
        }
        .vh-video-tailoring__btn-group {
          text-align: right;
          margin-top: 24px;
          padding-bottom: 24px;
          .el-button {
            width: 80px;
            height: 36px;
            padding: 0;
            line-height: 34px;
            text-align: center;
            & + .el-button {
              margin-left: 12px;
            }
          }
        }
      }
    }
    .vh-video-tailoring__delcutpoint-popbody {
      .el-dialog__header {
        height: 50px;
        line-height: 50px;
        padding: 0;
        background-color: #fff;
        font-size: 16px;
        color: #333;
        .el-dialog__headerbtn {
          top: 17px;
          &:hover {
            .el-dialog__close {
              color: #eb9630;
            }
          }
        }
      }
      .vh-video-tailoring__form {
        img {
          width: 60px;
        }
        p {
          font-size: 12px;
          color: #666666;
          margin-top: 24px;
        }
      }
      .vh-video-tailoring__btn-group {
        text-align: center;
        margin-top: 36px;
        .el-button {
          width: 140px;
          height: 40px;
          padding: 0;
          line-height: 38px;
          text-align: center;
          border-radius: 100px;
          & + .el-button {
            margin-left: 60px;
          }
          &.el-button--default {
            border-color: #e2e2e2;
            color: #666666;
            background-color: #ffffff;
            &:hover {
              border-color: #1e90ff;
              color: #1e90ff;
              background-color: #ffffff;
            }
          }
        }
      }
    }
    .right-box {
      .Painting {
        cursor: pointer;
        position: relative;
        font-size: 12px;
        margin-right: 20px;
        &.spee {
          /*width: 60px;*/
        }
        span {
          color: #fc5659;
          font-size: 14px;
        }
        &.active {
          ul {
            display: block;
          }
        }
        ul {
          border-radius: 4px;
          display: none;
          position: absolute;
          bottom: 170%;
          left: -5px;
          width: 23px;
          text-align: left;
          padding: 10px 13px;
          line-height: 23px;
          background-color: rgba(0, 0, 0, 0.7);
          li {
            list-style-type: none;
            text-align: center;
            color: #fff;
            &:hover {
              color: #fc5659;
            }
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
    .vh-video-tailoring__slider {
      padding: 0 10px;
      .vh-video-tailoring__slider-ruler {
        width: 100%;
      }
    }
    /deep/ .svg-icon[data-v-26c99969] {
      vertical-align: -0.15em;
    }
  }
</style>
