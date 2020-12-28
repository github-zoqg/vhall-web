<template>
  <div class="textlink-wrapbox">
    <div class="textlink-previewbox">
      <div class="textlink">
        <a :href="info.src ? info.src : 'javascript:void(0);'">
          {{ info.text }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'component-textlink',
  props: {
    info: {
      required: false
    }
  },
  created() {
    console.log(8989, this.info)
  },
  data: function() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
  .textlink-wrapbox{
    .textlink {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3562FA;
      line-height: 22px;
    }
  }
</style>
