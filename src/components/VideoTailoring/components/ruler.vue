<template>
  <div class="vh-video-tailoring__ruler">
    <ul class="clearfix">
      <li v-for="(item, index) in videoTimeData" :key="'ruler' + index">
        <div class="vh-video-tailoring__scale-tip" v-if="index % 10 == 0">
          {{ scaleTime(index) }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import { formatTime } from '../js/format';
  export default {
    props: {
      /**
       * 视频时长 单位为秒 默认20*60
       */
      rulerLength: {
        type: Number,
        default: 100,
        required: true
      },
      /**
       * 当前时间单位 单位为秒
       */
      currentUnit: {
        type: Number,
        required: true
      },
      /**
       * 刻度尺的开始时间，由于两个尺子交替渲染，所以需要传入初始时间
       */
      startTime: {
        type: Number,
        default: 0,
        required: true
      }
    },
    data() {
      return {
        videoTimeData: this.rulerLength + 1, // 刻度尺初始化
        startTimeData: this.startTime // 定义刻度尺初始刻度
      };
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {
      /**
       * 时间格式化
       */
      scaleTime(index) {
        return formatTime((this.startTime + index) * this.currentUnit);
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__ruler {
    position: absolute;
    top: -35px;
    ul {
      white-space: nowrap;
      padding-top: 15px;
      position: relative;
      li {
        display: inline-block;
        width: 10px;
        height: 5px;
        border-bottom: 1px solid #333;
        border-right: 1px solid #333;
        list-style-type: none;
        position: relative;
        box-sizing: border-box;
        margin-top: 21px;
        &:first-child {
          border-right: 1px solid #333;
          border-top: none;
          height: 26px;
          margin-bottom: 0;
          border-bottom: 0;
        }
        &:nth-child(5n + 1) {
          border-right: 1px solid #333;
          height: 10px;
          margin-top: 16px;
        }
        &:nth-child(10n + 1) {
          border-right: 1px solid #333;
          height: 12px;
          margin-bottom: 0;
        }
        .vh-video-tailoring__scale-tip {
          background-color: #17171e;
          position: absolute;
          top: -16px;
          left: 8px;
          font-size: 12px;
          color: #666666;
          line-height: 14px;
        }
      }
      .vh-current-dom {
        position: absolute;
        width: 2px;
        height: 25px;
        top: 8px;
        background-color: #fe5659;
      }
    }
  }
</style>
