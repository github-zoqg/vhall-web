<template>
  <div class="component-wrap-box">
    <!-- 显示区域 -->
    <div class="editor-preview" v-html="info.content || '默认图文'">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      required: false
    }
  }
}
</script>
<style lang="less" scoped>
  .component-wrap-box{
    width: 100%;
    color: #333;
    text-align: left;
  }
  .editor-preview{
    min-height: 30px;
    margin: 20px 0px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 22px;
  }
</style>
