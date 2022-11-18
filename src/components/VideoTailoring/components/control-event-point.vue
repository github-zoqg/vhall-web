<template>
  <div
    class="vh-video-tailoring__control-event-point"
    :style="{ left: pointLeft + '%' }"
    @mouseenter.stop="showLabel"
  >
    <div
      class="vh-video-tailoring__event-content"
      :style="{ left: labelLeft + 'px', top: labelTop + 'px' }"
      ref="eventPointLabel"
    >
      <div class="vh-video-tailoring__content">
        {{ pointTime + ' ' + eventLabel }}
        <el-button @click="delEventPoint">{{ '删除' }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatTime } from '../js/format';
  export default {
    props: {
      /**
       * 事件时间
       */
      eventTime: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 事件名
       */
      eventLabel: {
        type: String,
        default: '',
        required: true
      },
      /**
       * 视频实际时长
       */
      videoTime: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        pointLeft: '0', // 事件点的左坐标
        labelLeft: '0', // 事件点文字的左坐标
        labelTop: '0' // 事件点文字的上坐标
      };
    },
    created() {
      // 事件点的左坐标初始化
      // this.pointLeft =
      //   Math.floor((this.eventTime / this.videoTime) * 100) == 100
      //     ? 99.8
      //     : Math.floor((this.eventTime / this.videoTime) * 100)
      this.pointLeft = ((this.eventTime / this.videoTime) * 100).toFixed(3) - 0.2;
    },
    mounted() {},
    computed: {
      /**
       * 事件点文字中的时间初始化
       */
      pointTime() {
        return formatTime(this.eventTime * this.currentUnit);
      }
    },
    methods: {
      /**
       * 动态计算事件点文字显示位置，方式事件点偏左或偏右显示不全
       */
      showLabel(e) {
        let boxLeft = this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().left;
        let boxRight = this.$parent.$refs.vhTailoringWrap.getBoundingClientRect().right;
        let labelWidth = this.$refs.eventPointLabel.getBoundingClientRect().width;
        let labelHeight = this.$refs.eventPointLabel.getBoundingClientRect().height;
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
        this.labelTop = -labelHeight + 10;
      },
      delEventPoint() {
        this.$EventBus.$emit('delEventPoint', this.eventTime);
      },
      t(name) {
        return name;
      }
    },
    watch: {
      /**
       * 监听事件时间变化修改事件点位置
       */
      eventTime(newVal) {
        // this.pointLeft =
        //   Math.floor((newVal / this.videoTime) * 100) == 100
        //     ? 99.8
        //     : Math.floor((newVal / this.videoTime) * 100)

        this.pointLeft = ((newVal / this.videoTime) * 100).toFixed(3) - 0.2;
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__control-event-point {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    top: 11px;
    background-color: #fb3a32;
    z-index: 3;
    .vh-video-tailoring__event-content {
      width: 178px;
      // height: 86px;
      text-align: left;
      word-break: break-all;
      position: absolute;
      z-index: 9;
      padding-bottom: 15px;
      display: none;
      color: #fff;
      .vh-video-tailoring__content {
        font-size: 14px;
        background: rgba(255, 255, 255, 0.95);
        // border: 1px solid #333333;
        // box-shadow: 0px 0px 8px 0px rgba(#1C1C26, 0.3);
        border-radius: 4px;
        padding: 12px 12px;
        line-height: 20px;
        color: #000;
        .el-button {
          color: #666;
          &:hover {
            color: #fb3a32;
          }
        }
      }
      &:hover {
        display: block;
      }
      .el-button {
        display: block;
        border: none;
        padding: 0;
        background-color: rgba(0, 0, 0, 0);
        margin-top: 5px;
      }
    }
    &:hover {
      width: 8px;
      height: 8px;
      top: 10px;
      cursor: point;
      .vh-video-tailoring__event-content {
        display: block;
      }
    }
  }
</style>
