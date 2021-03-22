<template>
  <div class="vh-video-tailoring__cutting-point">
    <div class="vh-video-tailoring__point" :style="{ left: pointPosition + 'px' }" @click="deletePoint"></div>
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
     * 当前裁剪点位置对应的时间
     */
    pointTime: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      pointPosition: 0, // 当前裁剪点位置
      totalTime: 0 // 当前视频总时长
    };
  },
  created () {
    // 初始化裁剪点位置
    this.pointPosition = (this.pointTime / this.currentUnit) * 10 + 9 - 7;
  },
  mounted () {},
  computed: {},
  methods: {
    /**
     * 删除裁剪点
     */
    deletePoint () {
      this.$EventBus.$emit('deleteCutPoint', this.pointTime);
    }
  },
  watch: {
    /**
     * 监听当前时间单位变化，用于变更当前坐标位置
     */
    currentUnit () {
      this.pointPosition = (this.pointTime / this.currentUnit) * 10 + 9 - 7;
    },
    /**
     * 监听当前裁剪点位置对应的时间变化，用于变更当前坐标位置
     */
    pointTime () {
      this.pointPosition = (this.pointTime / this.currentUnit) * 10 + 9 - 7;
    }
  }
};
</script>
<style lang="less">
.vh-video-tailoring__cutting-point {
  .vh-video-tailoring__point {
    position: absolute;
    width: 14px;
    height: 16px;
    background-image: url('../image/delete_pointer.png');
    background-size: cover;
    top: -18px;
    &:hover {
      cursor: pointer;
      background-image: url('../image/delete_pointer_hover.png');
    }
  }
  &.vh-on {
    .vh-video-tailoring__point {
      background-image: url('../image/delete_pointer_hover.png');
    }
  }
}
</style>
