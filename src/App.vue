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
html{
  height: 100%;
}
body {
  margin: 0 0!important;
  .el-picker-panel__shortcut:first-of-type {
      color: #fb3a32;
    }
}
#app{
  min-width: 1366px;
  height: 100%;
  background: #F7F7F7;
}
</style>
