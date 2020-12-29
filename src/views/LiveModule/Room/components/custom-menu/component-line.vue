<template>
  <div class="line-wrapbox">
  </div>
</template>
<script>

export default {
  name: 'component-line',
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
  .line-wrapbox{
    width: 100%;
    border: 2px dashed #eaeaea;
    margin: 10px 0px;
  }
</style>
