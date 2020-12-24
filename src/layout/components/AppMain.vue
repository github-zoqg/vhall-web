<template>
  <section class="app-main">
   <!-- <transition name="fade-transform" mode="out-in">-->
      <router-view :key="key" />
   <!-- </transition>-->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style scoped>
.app-main {
  /*64 = navbar  */
  min-height: calc(100vh - 64px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f7f7f7;
  padding: 40px 61px 60px 61px;
}
@media screen and (min-width: 1920px) {
  .app-main {
    padding: 40px 161px 60px 161px;
  }
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="less">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
