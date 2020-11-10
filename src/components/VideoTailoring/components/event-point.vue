<template>
  <div
    class="vh-video-tailoring__event-point"
    :style="{ left: pointLeft + 'px' }"
    @click="showEventPointPopFun"
    @mouseenter="showLabel"
  >
    <p class="vh-video-tailoring__event-content" :style="{ left: labelLeft + 'px' }" ref="eventPointLabel">
      {{ pointTime + ' ' + eventLabel }}
    </p>
  </div>
</template>
<script>
import { formatTime } from '../js/format';
export default {
  props: {
    /**
     * 事件点时间
     */
    eventTime: {
      type: Number,
      default: 0,
      required: true
    },
    /**
     * 事件点名称
     */
    eventLabel: {
      type: String,
      default: '',
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
  data () {
    return {
      pointLeft: '9', // 事件点的左坐标
      labelLeft: '0' // 事件点文字的左坐标
    };
  },
  created () {
    // 事件点的左坐标初始化
    this.pointLeft = Math.round((this.eventTime / this.currentUnit) * 10) + 9 - 2;
  },
  mounted () {},
  computed: {
    pointTime () {
      //  事件点文字中的时间初始化
      return formatTime(this.eventTime * this.currentUnit);
    }
  },
  methods: {
    /**
     * 显示添加修改事件点弹窗
     */
    showEventPointPopFun () {
      this.$EventBus.$emit('showEventPointPop', this.eventTime, this.eventLabel);
    },
    /**
     * 动态计算事件点文字显示位置，方式事件点偏左或偏右显示不全
     */
    showLabel (e) {
      let boxLeft = this.$parent.$parent.$refs.vhTailoringWrap.getBoundingClientRect().left;
      let boxRight = this.$parent.$parent.$refs.vhTailoringWrap.getBoundingClientRect().right;
      let labelWidth = this.$refs.eventPointLabel.getBoundingClientRect().width;
      if (e.pageX - boxLeft < labelWidth / 2) {
        // 如果当前事件点距离左外框小于事件点文字宽度一半，则文字应偏右显示
        this.labelLeft = -(e.pageX - boxLeft);
      } else if (boxRight - e.pageX < labelWidth / 2) {
        // 如果当前事件点距离右外框小于事件点文字宽度一半，则文字应偏左显示
        this.labelLeft = -(labelWidth - (boxRight - e.pageX));
      } else {
        // 如果当前事件点距离右外框大于等于事件点文字宽度一半，则文字应居中显示
        this.labelLeft = -labelWidth / 2;
      }
    }
  },
  watch: {
    /**
     * 监听当前时间单位变化修改事件点位置
     */
    // eslint-disable-next-line no-unused-vars
    currentUnit (newVal, oldVal) {
      this.pointLeft = Math.round((this.eventTime / newVal) * 10) + 9 - 2;
    },
    /**
     * 监听事件时间变化修改事件点位置
     */
    // eslint-disable-next-line no-unused-vars
    eventTime (newVal, oldVal) {
      this.pointLeft = Math.round((newVal / this.currentUnit) * 10) + 9 - 2;
    }
  }
};
</script>
<style lang="less">
.vh-video-tailoring__event-point {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  top: -3px;
  background-color: #fe5659;
  z-index: 3;
  .vh-video-tailoring__event-content {
    position: absolute;
    z-index: 9;
    top: -15px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.8);
    padding: 2px 5px;
    border-radius: 4px;
    opacity: 0;
    color: #fff;
    white-space: nowrap;
  }
  &:hover {
    cursor: point;
    .vh-video-tailoring__event-content {
      opacity: 1;
    }
  }
}
</style>
