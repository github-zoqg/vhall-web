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
  },
};
</script>
<style lang="less">
html{
  height: 100%;
}
#app{
  height: 100%;
}
</style>
