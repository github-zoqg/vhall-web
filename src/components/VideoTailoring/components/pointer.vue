<template>
  <div
    class="vh-video-tailoring__pointer"
    :style="{ left: pointerLeft + 'px' }"
    @mousedown.stop="mousedown"
  >
    <span
      class="vh-video-tailoring__mouse-time"
      v-show="currentMouseTime"
      ref="currentMouseTime"
      :style="{ left: currentMousePostion + 'px' }"
    >
      {{ currentMouseTime }}
    </span>
  </div>
</template>
<script>
  import { formatTime } from '../js/format';
  export default {
    props: {
      /**
       *  当前时间单位 共七档对应 单位为秒
       */
      currentUnit: {
        type: Number,
        required: true
      },
      /**
       * 刻度尺所在框架与浏览器左侧距离，用于计算指针等位置转换
       */
      warpStart: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 第一把尺子初始时间
       */
      firstRulerStartTime: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 第二把尺子初始时间
       */
      secondRulerStartTime: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 当前刻度尺滑动页数
       */
      currentPage: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 当前一把刻度尺的长度
       */
      rulerLength: {
        type: Number,
        default: 0,
        required: true
      }
    },
    data() {
      return {
        currentTime: 0, // 当前视频播放时间
        totalTime: 0, // 当前视频总时长
        pointerLeft: '3', // 当前游标初始位置
        isPointerMouseDown: false, // 记录游标是否被按下状态
        basicTime: 0, // 当前所在刻度尺开始时间
        currentMouseTime: '', // 当前鼠标移动时间
        currentMousePostion: 0 // 当前鼠标移动时间显示位置
      };
    },
    created() {
      // 监听视频初始化成功
      this.$EventBus.$on('component_playerSDK_ready', () => {
        this.totalTime = Math.round(window.vhallPlayer.getDuration());
        setTimeout(() => {
          // 动态获取当前视频的总时长及当前播放的时间
          window.vhallPlayer.on(window.VhallPlayer.TIMEUPDATE, () => {
            this.currentTime = window.vhallPlayer.getCurrentTime(() => {
              console.log('获取当前视频播放时间失败----------');
            });

            // 计算当前播放进度块显示的位置 （当前播放的总时长/单位块的时长）
            // 单元格宽为10像素，由于最开始的单元格没有划线，所以总位置需要加出前面的空位
            if (!this.isPointerMouseDown) {
              this.pointerLeft = Math.round((this.currentTime / this.currentUnit) * 10) + 9 - 6;

              this.currentMouseTime = formatTime(Math.round(this.currentTime));
              // this.labelMove(this.pointerLeft)
            }
          });
        }, 100);
      });

      // 鼠标控制时间轴切换视频播放时间，用于切换当前游标位置
      this.$EventBus.$on('seekTime', point => {
        let seekTimePosition = point;
        let currentPlayTime = Math.round((seekTimePosition / 10) * this.currentUnit);
        currentPlayTime = currentPlayTime >= this.totalTime ? this.totalTime - 4 : currentPlayTime;
        window.vhallPlayer.setCurrentTime(currentPlayTime);
      });
    },
    mounted() {},
    computed: {
      /**
       * 计算视频总结点位置
       */
      totalRightPositon() {
        return (this.totalTime * 10) / this.currentUnit + 9;
      }
    },
    methods: {
      /**
       * 鼠标在游标上按下，来进行滑动与移出操作绑定
       */
      mousedown(e) {
        if (e.which == 1) {
          this.isPointerMouseDown = true;
          window.vhallPlayer.pause();
          let rulerBasic; // 当前刻度点所在的刻度尺
          if (this.firstRulerStartTime > this.secondRulerStartTime) {
            rulerBasic = this.$parent.$refs.secondRuler;
            this.basicTime = this.secondRulerStartTime;
          } else {
            rulerBasic = this.$parent.$refs.firstRuler;
            this.basicTime = this.firstRulerStartTime;
          }
          this.basicPointLeft = rulerBasic.$el.getBoundingClientRect().left; // 当前所在刻度尺开始左侧位置
          document.onpointermove = this.pointerMouseMove.bind(this);
          document.onpointerup = this.pointerMouseUp.bind(this);
          this.$EventBus.$emit('pointMouseDown');
        }
      },
      /**
       * 按下游标时滑动鼠标，对游标进行滑动操作
       */
      pointerMouseMove(e) {
        this.pointerLeft = Math.round(e.layerX) - 6;
        let rulerBasic; // 当前刻度点所在的刻度尺
        if (this.firstRulerStartTime > this.secondRulerStartTime) {
          rulerBasic = this.$parent.$refs.secondRuler;
          this.basicTime = this.secondRulerStartTime;
        } else {
          rulerBasic = this.$parent.$refs.firstRuler;
          this.basicTime = this.firstRulerStartTime;
        }
        this.basicPointLeft = rulerBasic.$el.getBoundingClientRect().left; // 当前所在刻度尺开始左侧位置

        let point = e.pageX - this.basicPointLeft + this.currentPage * this.rulerLength * 10;
        if (point <= 9) {
          this.pointerLeft = 9 - 6;
        } else if (point >= this.totalRightPositon) {
          this.pointerLeft = this.totalRightPositon - 6;
        } else {
          this.pointerLeft = point - 6;
        }
        this.currentMouseTime = formatTime(Math.round((this.pointerLeft / 10) * this.currentUnit));
        let labelWidth = this.$refs.currentMouseTime.getBoundingClientRect().width;
        let bgLeft = this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().left;
        let bgRight = bgLeft + this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().width;

        if (e.pageX >= bgLeft && e.pageX <= bgRight) {
          if (point - (point - (e.pageX - bgLeft)) < labelWidth / 2) {
            this.currentMousePostion = -(e.pageX - bgLeft) + 6;
          } else if (point + (bgRight - e.pageX) - point < labelWidth / 2) {
            this.currentMousePostion = bgRight - e.pageX - labelWidth + 6;
          } else {
            this.currentMousePostion = -labelWidth / 2 + 6;
          }
        }
      },
      /**
       * 时间显示段位置计算
       */
      labelMove(position) {
        let rulerBasic; // 当前刻度点所在的刻度尺
        if (this.firstRulerStartTime > this.secondRulerStartTime) {
          rulerBasic = this.$parent.$refs.secondRuler;
          this.basicTime = this.secondRulerStartTime;
        } else {
          rulerBasic = this.$parent.$refs.firstRuler;
          this.basicTime = this.firstRulerStartTime;
        }
        this.basicPointLeft = rulerBasic.$el.getBoundingClientRect().left; // 当前所在刻度尺开始左侧位置
        let labelWidth = this.$refs.currentMouseTime.getBoundingClientRect().width;
        if (position < Math.round(labelWidth / 2) - 6) {
          this.currentMousePostion = -position;
        } else {
          this.currentMousePostion = -Math.round(labelWidth / 2) + 6;
        }
      },
      /**
       * 鼠标抬起时，解除移动绑定
       */
      // eslint-disable-next-line no-unused-vars
      pointerMouseUp(e) {
        this.isPointerMouseDown = false;
        let currentPlayTime = Math.round((this.pointerLeft / 10) * this.currentUnit);
        currentPlayTime = currentPlayTime >= this.totalTime ? this.totalTime - 4 : currentPlayTime;
        window.vhallPlayer.setCurrentTime(currentPlayTime);
        window.vhallPlayer.play();
        document.onpointermove = null;
        document.onpointerup = null;
        this.$EventBus.$emit('pointMouseUp');
        this.$emit('previewChange');
      }
    },
    watch: {
      /**
       * 监听当前时间单位变化，用于变更当前坐标位置
       */
      // eslint-disable-next-line no-unused-vars
      currentUnit(newVal, oldVal) {
        this.pointerLeft = Math.round((this.currentTime / newVal) * 10) + 9 - 6;
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__pointer {
    position: absolute;
    width: 12px;
    height: 109px;
    top: 11px;
    background-size: 12px 109px;
    background-image: url('../image/point-warp@2x.e10898e.png');
    z-index: 5;
    &:hover {
      cursor: grabbing;
    }
    .vh-video-tailoring__mouse-time {
      width: 51px;
      height: 14px;
      position: absolute;
      top: 24px;
      left: 7px !important;
      background: #666666;
      font-size: 12px;
      color: #fff;
    }
  }
</style>
