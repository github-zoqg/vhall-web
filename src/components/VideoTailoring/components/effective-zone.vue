<template>
  <div class="vh-video-tailoring__effective-zone" ref="rulersWarp">
    <div class="vh-video-tailoring__left-border" :style="{ left: pointerLeft + '%' }"></div>
    <div
      class="vh-video-tailoring__content"
      :style="{ left: contentLeft + '%', width: contentWidth + '%' }"
      @mousedown="seekVideo"
    ></div>
    <div class="vh-video-tailoring__right-border" :style="{ left: pointerRight + '%' }"></div>
  </div>
</template>
<script>
  export default {
    props: {
      /**
       *  有效区开始时间
       */
      startTime: {
        type: Number,
        default: 1,
        required: true
      },
      /**
       * 有效区结束时间
       */
      endTime: {
        type: Number,
        default: 0,
        required: true
      },
      /**
       * 视频时长 单位为秒
       */
      videoTime: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        pointerRight: 0, // 有效区右侧位置
        pointerLeft: 0, // 有效区左侧位置
        contentLeft: 0 // 有效区宽度
      };
    },
    created() {
      // 初始化位置
      this.pointerLeft = (this.startTime / this.videoTime) * 100;
      this.contentLeft = this.pointerLeft;
      this.pointerRight = (this.endTime / this.videoTime) * 100;
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
       * 点击进行视频播放时间切换
       */
      seekVideo(e) {
        if (e.which == 1) {
          let basic = this.$parent.$refs.vhControlWrap;
          let basicLeft = basic.getBoundingClientRect().left;
          let basicWidth = basic.getBoundingClientRect().width;
          let point = e.pageX - basicLeft;
          let seekTime = (point / basicWidth) * this.videoTime;
          window.vhallPlayer.setCurrentTime(seekTime);
        }
      }
    },
    watch: {
      /**
       * 监听有效区开始时间，用来变更有效区左侧位置及宽度
       */
      // eslint-disable-next-line no-unused-vars
      startTime(newVal, oldVal) {
        this.pointerLeft = (newVal / this.videoTime) * 100;
        this.contentLeft = this.pointerLeft;
      },
      /**
       * 监听有效区结束时间，用来变更有效区右侧位置及宽度
       */
      // eslint-disable-next-line no-unused-vars
      endTime(newVal, oldVal) {
        this.pointerRight = (newVal / this.videoTime) * 100;
      }
    }
  };
</script>
<style lang="less">
  .vh-video-tailoring__effective-zone {
    .vh-video-tailoring__content {
      position: absolute;
      top: 11px;
      height: 4px;
      background-color: #ccc;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
      }
    }
    .vh-video-tailoring__left-border {
      position: absolute;
      top: 0;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.2);
      .vh-video-tailoring__pull-left-warpp {
        // display: none;
        position: absolute;
        bottom: -18px;
        left: -6px;
        z-index: 4;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 6px solid black;
        &:hover {
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
        bottom: -18px;
        right: -6px;
        z-index: 4;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 6px solid black;
        &:hover {
          cursor: pointer;
          display: block;
        }
      }
    }
    &:hover {
      .vh-video-tailoring__pull-right-warp,
      .vh-video-tailoring__pull-left-warpp {
        display: block;
      }
    }
  }
</style>
