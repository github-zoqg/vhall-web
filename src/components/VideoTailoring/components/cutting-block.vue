<template>
  <div class="vh-video-tailoring__cutting-warp" ref="rulersWarp" @mousedown="rulersMouseDown">
    <div
      class="vh-video-tailoring__left-border"
      :style="{ left: pointerLeft + 'px' }"
      @mousedown.stop="clearMouse"
    >
      <div
        attr_id="letf_target"
        class="vh-video-tailoring__pull-left-warp"
        @mousedown.stop="targetMousedown"
      ></div>
    </div>
    <div
      class="vh-video-tailoring__content"
      :style="{ left: contentLeft + 'px', width: contentWidth + 'px' }"
      @mousedown="rulersMouseDown"
    >
      <div class="vh-video-tailoring__content-center"></div>
    </div>
    <div
      class="vh-video-tailoring__right-border"
      :style="{ left: pointerRight + 'px' }"
      @mousedown.stop="clearMouse"
    >
      <div
        attr_id="right_target"
        class="vh-video-tailoring__pull-right-warp"
        @mousedown.stop="targetMousedown"
      ></div>
    </div>
  </div>
</template>
<script>
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
       * 裁剪段的详细信息
       * startTime 裁剪段的开始时间
       * endTime 裁剪段的结束时间
       * startLineTime 裁剪段前一个剪切点时间
       * endLineTime 裁剪段后一个剪切点时间
       */
      position: {
        type: Object,
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
        pointerLeft: 0, // 剪裁段左起位置
        pointerRight: 0, // 剪裁段左起位置
        contentLeft: 0, // 剪裁段背景位置
        totalRightPositon: 0, // 总视频右侧点位置
        // rightPoint: 0,
        // leftPoint: 0,
        currentTarget: '', // 当前移动滑块（左边滑块或右边滑块）
        basicPointLeft: 0, // 当前所在刻度尺开始左侧位置
        basicTime: 0 // 当前所在刻度尺开始时间
      };
    },
    created() {
      // 动态获取当前视频的总时长及当前播放的时间
      if (window.vhallPlayer) {
        this.totalTime = Math.round(window.vhallPlayer.getDuration());
        // 当前视频时间截止点的x坐标
        this.totalRightPositon = (this.totalTime * 10) / this.currentUnit + 9;
      } else {
        this.$EventBus.$on('component_playerSDK_ready', () => {
          this.totalTime = Math.round(window.vhallPlayer.getDuration());
          // 当前视频时间截止点的x坐标
          this.totalRightPositon = (this.totalTime * 10) / this.currentUnit + 9;
        });
      }
      window.vhallPlayer.on(window.VhallPlayer.TIMEUPDATE, () => {
        this.currentTime = window.vhallPlayer.getCurrentTime(() => {
          console.log('获取当前视频播放时间失败----------');
        });
      });

      // 当前裁剪时间段的起始点x坐标
      this.pointerLeft = (this.position.startTime / this.currentUnit) * 10 + 9;
      this.pointerRight = (this.position.endTime / this.currentUnit) * 10 + 9;
      // 当前裁剪时间段的起点
      this.contentLeft = this.pointerLeft;
    },
    mounted() {},
    computed: {
      /**
       * 当前裁剪时间段的长度
       */
      contentWidth() {
        return Math.abs(this.pointerRight - this.pointerLeft);
      }
    },
    methods: {
      /**
       * 鼠标控制时间轴切换视频播放时间
       */
      rulersMouseDown(e) {
        if (e.which == 1) {
          let rulerBasic; // 当前刻度点所在的刻度尺是第一把还是第二把
          if (this.firstRulerStartTime > this.secondRulerStartTime) {
            rulerBasic = this.$parent.$parent.$refs.secondRuler;
            this.basicTime = this.secondRulerStartTime;
          } else {
            rulerBasic = this.$parent.$parent.$refs.firstRuler;
            this.basicTime = this.firstRulerStartTime;
          }
          this.basicPointLeft = rulerBasic.$el.getBoundingClientRect().left; // 当前所在刻度尺开始左侧位置
          let point = e.pageX - this.basicPointLeft + this.currentPage * this.rulerLength * 10 - 9;
          this.$EventBus.$emit('seekTime', point);
        }
      },
      /**
       * 删除当前的裁剪端
       */
      deleteCutPoint() {
        this.$EventBus.$emit('deleteCutPoint', this.position);
      },
      clearMouse() {
        // 单纯清楚鼠标动作
      },
      /**
       * 点击裁剪段移动点
       */
      targetMousedown(dom) {
        if (dom.which == 1) {
          let target = dom.target.getAttribute('attr_id'); // 判断是左边三角还是右边
          if (target == 'letf_target') {
            this.currentTarget = 'left';
          } else if (target == 'right_target') {
            this.currentTarget = 'right';
          }

          let rulerBasic; // 当前刻度点所在的刻度尺是第一把还是第二把
          if (this.firstRulerStartTime > this.secondRulerStartTime) {
            rulerBasic = this.$parent.$parent.$refs.secondRuler;
            this.basicTime = this.secondRulerStartTime;
          } else {
            rulerBasic = this.$parent.$parent.$refs.firstRuler;
            this.basicTime = this.firstRulerStartTime;
          }
          this.basicPointLeft = rulerBasic.$el.getBoundingClientRect().left; // 当前所在刻度尺开始左侧位置
          document.onmousemove = this.documentMouseMove.bind(this);
          document.onmouseup = this.documentMouseUp.bind(this);
        }
      },
      /**
       * 当前裁剪段左右两端移动所进行的操作
       */
      documentMouseMove(e) {
        if (this.contentWidth < 20) {
          return false;
        }
        // let unitDistance = (1 / this.currentUnit) * 10 + 9
        if (this.currentTarget == 'left') {
          // 当前鼠标对应时间轴的x坐标位置
          let point = e.pageX - this.basicPointLeft + this.currentPage * this.rulerLength * 10;
          let startLineTimePosition;
          if (this.position.startLineTime) {
            startLineTimePosition = (this.position.startLineTime / this.currentUnit) * 10 + 9;
          }
          if (point >= this.pointerRight - 20) {
            this.pointerLeft = this.pointerRight - 20;
          } else if (startLineTimePosition && point <= startLineTimePosition) {
            // 坐标大于视频剪裁点坐标，将当前坐标赋值为剪裁点坐标
            this.pointerLeft = startLineTimePosition;
          } else if (point <= 9) {
            // 坐标小于视频开始点坐标，将当前坐标赋值为起点坐标
            this.pointerLeft = 9;
          } else if (point >= this.totalRightPositon) {
            // 坐标大于视频截止点坐标，将当前坐标赋值为截止坐标
            this.pointerLeft = this.totalRightPositon;
          } else {
            // 当前坐标赋值为鼠标坐标
            this.pointerLeft = point;
          }
          this.contentLeft = this.pointerLeft;
        }
        if (this.currentTarget == 'right') {
          let endLineTimePositon;
          if (this.position.endLineTime) {
            endLineTimePositon = (this.position.endLineTime / this.currentUnit) * 10 + 9;
          }
          // 同left
          let point = e.pageX - this.basicPointLeft + this.currentPage * this.rulerLength * 10;
          if (point <= this.pointerLeft + 20) {
            this.pointerRight = this.pointerLeft + 20;
          } else if (endLineTimePositon && point >= endLineTimePositon) {
            this.pointerRight = endLineTimePositon;
          } else if (point <= 9) {
            this.pointerRight = 9;
          } else if (point >= this.totalRightPositon) {
            this.pointerRight = this.totalRightPositon;
          } else {
            this.pointerRight = point;
          }
          this.contentLeft = this.pointerLeft;
        }
        this.$emit('previewChange');
      },
      /**
       * 当前裁剪段左右两端移动解除绑定
       */
      // eslint-disable-next-line no-unused-vars
      documentMouseUp(e) {
        this.checkPoint();
        document.onmousemove = null;
        document.onmouseup = null;
      },
      /**
       * 检查当前裁剪段起止点坐标位置，如果起点位置大于终点位置，则交换起止点
       */
      checkPoint() {
        if (this.pointerLeft > this.pointerRight) {
          let temp = this.pointerLeft;
          this.pointerLeft = this.pointerRight;
          this.pointerRight = temp;
          this.contentLeft = this.pointerLeft;
        }
        let cutStartTime = Math.round(((this.pointerLeft - 9) / 10) * this.currentUnit);
        let cutEndTime = Math.round(((this.pointerRight - 9) / 10) * this.currentUnit);
        this.$EventBus.$emit('cuttiongBlockRemove', this.position, cutStartTime, cutEndTime);
      }
    },
    watch: {
      /**
       * 监测当前时间单位变化
       */
      // eslint-disable-next-line no-unused-vars
      initUnit(newVal, oldVal) {
        this.currentUnit = newVal;
      },
      /**
       * 监听当前时间单位变化，用于变更当前坐标位置
       */
      currentUnit() {
        this.totalRightPositon = (this.totalTime * 10) / this.currentUnit + 9;
        this.pointerLeft = (this.position.startTime / this.currentUnit) * 10 + 9;
        this.pointerRight = (this.position.endTime / this.currentUnit) * 10 + 9;
        this.contentLeft = this.pointerLeft;
      },
      /**
       * 监听当前裁剪段起止点坐标变化，用于变更当前坐标位置
       */
      position: {
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          this.position = newVal;
          this.pointerLeft = (this.position.startTime / this.currentUnit) * 10 + 9;
          this.pointerRight = (this.position.endTime / this.currentUnit) * 10 + 9;
          this.contentLeft = this.pointerLeft;
        },
        deep: true
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__cutting-warp {
    .vh-video-tailoring__content {
      position: absolute;
      top: 0;
      height: 83px;
      background-color: #000000;
      border: 1px solid #fb3a32;
      box-sizing: border-box;
      border-radius: 4px;
      overflow: hidden;
      .vh-video-tailoring__content-center {
        width: 100%;
        height: 74px;
        background-color: #333;
        margin-top: 3px;
      }
      // .vh-delet-dom {
      //   display: none;
      //   position: absolute;
      //   top: 5px;
      //   right: 5px;
      //   z-index: 4;
      //   &:hover {
      //     cursor: pointer;
      //   }
      // }
      // &.vh-cutting-block-hover {
      //   .vh-delet-dom {
      //     display: block;
      //   }
      // }
    }
    .vh-video-tailoring__left-border {
      position: absolute;
      top: 0;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.2);
      .vh-video-tailoring__pull-left-warp {
        // display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        width: 8px;
        height: 83px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../image/pull-left-new.png');
        &:hover {
          background-image: url('../image/pull-left-new.png');
          cursor: pointer;
          display: block;
        }
      }
    }
    .vh-video-tailoring__right-border {
      position: absolute;
      top: 0;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.2);
      .vh-video-tailoring__pull-right-warp {
        // display: none;
        position: absolute;
        top: 0;
        right: -1px;
        z-index: 4;
        width: 8px;
        height: 83px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../image/pull-right-new.png');
        &:hover {
          background-image: url('../image/pull-right-new.png');
          cursor: pointer;
          display: block;
        }
      }
    }
    &:hover {
      .vh-video-tailoring__pull-right-warp,
      .vh-video-tailoring__pull-left-warp {
        display: block;
      }
    }
  }
</style>
