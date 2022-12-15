<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isCollapse: false
      };
    }
  };
</script>
<style lang="less">
  html {
    height: 100%;
  }
  body {
    margin: 0 0 !important;
  }
  #app {
    min-width: 1366px;
    height: 100%;
    background: #f7f7f7;
  }
</style>
