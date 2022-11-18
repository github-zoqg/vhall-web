<template>
  <div class="emptyWrapper">
    <router-view />
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
  .emptyWrapper {
    width: 100%;
    height: 100%;
  }
</style>
