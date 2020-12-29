<template>
  <div class="title-wrapbox">
    <div class="title-previewbox">
      {{ info.title }}
    </div>
  </div>
</template>
<script>

export default {
  name: 'component-title',
  props: {
    info: {
      required: false
    }
  },

  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
  .title-previewbox{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3562FA;
    line-height: 22px;
  }
</style>
