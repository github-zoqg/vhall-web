<template>
  <div class="living_preview_wap">
    我是手机端预览
  </div>
</template>
<script>
export default {
  props: {
    type: {
      // 是直播页还是引导页
      type: Number,
      default: 1
    }
  }
}
</script>
<style lang="less" scoped>
  .living_preview_wap{
    width: 100%;
  }
</style>
