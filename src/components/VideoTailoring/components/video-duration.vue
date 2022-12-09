<template>
  <div
    class="vh-video-tailoring__video-duration-warp"
    :style="{ width: vodReady ? durationWidth + 15 + 'px' : '100%' }"
    ref="videoDurationWarp"
    @mousemove="showTimeMouseMove"
    @mouseleave="showTimeMouseLeave"
  >
    <div
      class="vh-video-tailoring__bg-warp"
      :style="{ width: vodReady ? durationWidth + 'px' : '100%' }"
    ></div>
    <cutting-block
      v-for="(element, index) in cutTimeList"
      :key="index"
      :currentUnit="currentUnit"
      :warpStart="warpStart"
      :cutTime="20"
      :position="element"
      :firstRulerStartTime="firstRulerStartTime"
      :secondRulerStartTime="secondRulerStartTime"
      :currentPage="currentPage"
      :rulerLength="rulerLength"
    ></cutting-block>
    <cutting-point
      v-for="(element, index) in cutPointList"
      :key="'cutpoint' + index"
      :currentUnit="currentUnit"
      :pointTime="element"
      :class="{ 'vh-on': delCuttingPoint == element }"
      @previewChange="previewChange"
    ></cutting-point>
    <!-- <event-point
      v-for="(item, index) in eventPointList"
      :key="'eventPoint' + index"
      :eventTime="item.timePoint"
      :eventLabel="item.msg"
      :currentUnit="currentUnit"
      :currentPage="currentPage"
      :rulerLength="rulerLength"
    ></event-point>-->
    <span
      class="vh-video-tailoring__current-time"
      v-show="showCurrentTime && currentTime"
      ref="currentTimeDom"
      :style="{ left: currentTimeLeft + 'px' }"
    >
      {{ currentTime }}
    </span>
  </div>
</template>
<script>
  import cuttingBlock from '../components/cutting-block'; // 裁剪框组件
  import cuttingPoint from '../components/cutting-point'; // 裁剪点组件
  // import eventPoint from '../components/event-point' // 事件点组件
  import { formatTime, descend } from '../js/format';
  export default {
    props: {
      /**
       *  视频时长 单位为秒
       */
      videoTime: {
        type: Number,
        default: 0,
        required: true
      },
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
      },
      /**
       * 事件点数组
       */
      eventPointList: {
        type: Array,
        required: true
      },
      /**
       * 视频初始化信息是否完成
       */
      vodReady: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        cutTimeList: [], // 当前所有被裁剪的时间段数组
        basicTime: 0, // 当前所在刻度尺开始时间
        cutPointList: [], // 当前裁剪点
        delCuttingPoint: 0, // 当前选中的裁剪点
        currentTime: 0, // 鼠标hover时，当前时间显示
        currentTimeLeft: '', // 鼠标hover时，当前时间显示位置
        showCurrentTime: true // 是否显示当前时间label
      };
    },
    created() {
      // 监听添加裁剪时间段的操作
      this.$EventBus.$on('blockInit', (leftTime, rightTime) => {
        this.blockInitNewFirst(leftTime, rightTime);
      });

      // 监听添加裁剪时间段的操作
      this.$EventBus.$on('cuttingBlockInit', cutTime => {
        if (this.cutPointList.indexOf(cutTime) == -1) {
          this.cuttingBlockInitNew(cutTime);
          // this.cutPointList.push(cutTime)
        }
      });

      // 监听删除裁剪时间段的操作
      this.$EventBus.$on('deleteCutPoint', pointTime => {
        this.delCuttingPoint = pointTime;
      });

      // 监听添加事件点的操作
      // eslint-disable-next-line no-unused-vars
      this.$EventBus.$on('addEventPoint', cutTime => {
        // let point = (cutTime / this.currentUnit) * 10
      });

      // 监听移动裁剪时间段位置的操作
      this.$EventBus.$on('cuttiongBlockRemove', (position, cutStartTime, cutEndTime) => {
        this.blockInitNew(cutStartTime, cutEndTime, position);
      });

      // 点击播放指针时，不显示刻度尺的时间label
      this.$EventBus.$on('pointMouseDown', () => {
        this.showCurrentTime = false;
      });

      // 取消点击播放指针时，恢复示刻度尺的时间label
      this.$EventBus.$on('pointMouseUp', () => {
        this.showCurrentTime = true;
      });

      // 监听删除裁剪点
      let _this = this;
      this.$EventBus.$on('deleteCutPointSuccess', pointTime => {
        _this.cutTimeList = _this.cutTimeList.sort(descend);
        let index = _this.cutPointList.indexOf(pointTime);
        if (index > -1) {
          _this.cutPointList.splice(index, 1);
          let pushArr;
          let cutArr = [];
          for (let i = 0; i < _this.cutTimeList.length; i++) {
            if (
              _this.cutTimeList[i].endLineTime == pointTime &&
              _this.cutTimeList[i + 1].startLineTime == pointTime
            ) {
              cutArr.push(_this.cutTimeList[i]);
              cutArr.push(_this.cutTimeList[i + 1]);
              pushArr = {
                startTime: _this.cutTimeList[i].startTime,
                endTime: _this.cutTimeList[i + 1].endTime
              };
              if (_this.cutTimeList[i].startLineTime) {
                pushArr.startLineTime = _this.cutTimeList[i].startLineTime;
              }
              if (_this.cutTimeList[i + 1].endLineTime) {
                pushArr.endLineTime = _this.cutTimeList[i + 1].endLineTime;
              }
              break;
            }
          }

          let leg = _this.cutTimeList.length;
          // 删除当前裁剪数组中，与需要删除数组相同的元素
          for (let i = leg - 1; i >= 0; i--) {
            for (let j = 0; j < cutArr.length; j++) {
              if (_this.cutTimeList[i]) {
                if (_this.cutTimeList[i] == cutArr[j]) {
                  _this.cutTimeList.splice(i, 1);
                  continue; // 结束当前本轮循环，开始新的一轮循环
                }
              }
            }
          }
          _this.cutTimeList.push(pushArr);
        }
        this.$EventBus.$emit('cutTimeListChange', this.cutTimeList);
      });
    },
    mounted() {},
    components: {
      cuttingBlock,
      // eventPoint,
      cuttingPoint
    },
    computed: {
      /**
       * 计算当前播视频总时长对应显示条
       * 单元格宽为10像素，由于最开始的单元格没有划线，所以总位置需要加出前面的空位
       */
      durationWidth() {
        return Math.round((this.videoTime * 10) / this.currentUnit);
      }
    },
    methods: {
      /**
       * 初始化第一段裁剪片段
       */
      blockInitNewFirst(leftTime, rightTime) {
        this.cutTimeList = [];
        // 将当前段加入到当前裁剪的数组中
        let pushArr = {
          startTime: leftTime,
          endTime: rightTime
        };
        this.cutTimeList.push(pushArr);
        this.$EventBus.$emit('cutTimeListChange', this.cutTimeList);
      },
      /**
       * 初始化第一段裁剪片段
       */
      blockInitNew(leftTime, rightTime, position) {
        if (this.cutTimeList.length > 0) {
          for (let i = 0; i < this.cutTimeList.length; i++) {
            if (
              this.cutTimeList[i].startTime == position.startTime &&
              this.cutTimeList[i].endTime == position.endTime
            ) {
              this.$set(this.cutTimeList[i], 'endTime', rightTime);
              this.$set(this.cutTimeList[i], 'startTime', leftTime);
            }
          }
        } else {
          // 将当前段加入到当前裁剪的数组中
          let pushArr = {
            startTime: leftTime,
            endTime: rightTime
          };
          this.cutTimeList.push(pushArr);
        }
        this.$EventBus.$emit('cutTimeListChange', this.cutTimeList);
        sessionStorage.setItem('leftTime', leftTime);
      },
      /**
       * 添加裁剪时间段操作
       */
      cuttingBlockInitNew(cutTime) {
        this.cutTimeList = this.cutTimeList.sort(descend);
        // let cutArr = []
        for (let i = 0; i < this.cutTimeList.length; i++) {
          if (this.cutTimeList[i].startTime < cutTime && cutTime < this.cutTimeList[i].endTime) {
            let leftTime = this.cutTimeList[i].endTime;
            let leftEndLineTime = this.cutTimeList[i].endLineTime;
            let pushArr = {
              startLineTime: cutTime,
              startTime: cutTime,
              endTime: leftTime
            };
            if (leftEndLineTime) {
              pushArr.endLineTime = leftEndLineTime;
            }
            this.$set(this.cutTimeList[i], 'endTime', cutTime);
            this.$set(this.cutTimeList[i], 'endLineTime', cutTime);
            this.cutTimeList.push(pushArr);
            this.cutPointList.push(cutTime);
          }
        }
        this.$EventBus.$emit('cutTimeListChange', this.cutTimeList);
      },
      /**
       * 鼠标在时间轴滑动时，显示当前鼠标所在位置对应时间
       */
      showTimeMouseMove(e) {
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
        let cutStartTime = (point - 9) / 10;
        this.currentTime = formatTime(Math.round(cutStartTime * this.currentUnit));

        let labelWidth = this.$refs.currentTimeDom.getBoundingClientRect().width;
        let bgLeft = this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().left;
        let bgRight = bgLeft + this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().width;

        // if (point - (point - (e.pageX - bgLeft)) < labelWidth / 2) {
        //   this.currentTimeLeft = point - (e.pageX - bgLeft)
        // } else
        if (point + (bgRight - e.pageX) - point < labelWidth / 2) {
          this.currentTimeLeft = point - (labelWidth - (bgRight - e.pageX));
        } else {
          this.currentTimeLeft = point;
        }
      },
      /**
       * 鼠标移除时间轴时，取消当前鼠标所在位置对应时间的显示
       */
      showTimeMouseLeave() {
        this.currentTime = '';
      },
      /**
       * 调取父级的previewChange方法
       */
      previewChange() {
        this.$emit('previewChange');
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__video-duration-warp {
    position: absolute;
    left: 0px;
    height: 50px;
    top: 34px;
    .vh-video-tailoring__bg-warp {
      position: absolute;
      left: 9px;
      height: 22px;
      top: 4px;
      background-color: rgba(81, 81, 81, 0.3);
    }
    .vh-video-tailoring__current-time {
      position: absolute;
      top: 32px;
      color: #3562fa;
      font-size: 12px;
    }
  }
</style>
