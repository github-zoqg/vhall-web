<template>
  <div :class="{
        hideSidebar: !openSidebar,
        openSidebar: openSidebar,
        withoutAnimation: false
      }" class="app-wrapper">
    <!-- 左侧导航 -->
    <sidebar class="sidebar-container" />

    <div class="main-container">
      <!-- 顶部 -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!-- 内容主体 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';
import Cookies from 'js-cookie';
import { sessionOrLocal } from "@/utils/utils";

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  provide() {},
  data() {
    return {
      openSidebar: true
    };
  },
  computed: {
    sidebar() {
      return JSON.stringify(sessionOrLocal.get('sidebar')) || {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // 左侧导航是否打开
        withoutAnimation: false // 左侧导航是否动画
      };
    },
    fixedHeader() {
      return JSON.stringify(sessionOrLocal.get('setting')).fixedHeader; // 头部是否定位
    }
  },
  methods: {
  },
  mounted() {
    this.$EventBus.$on("hamburger", (status) => {
      this.openSidebar = !!status;
    });
  },
  destroyed() {
    this.$EventBus.$off('hamburger');
  }
};
</script>

<style lang="less" scoped>
  @import "../common/css/other/mixin.less";
  @import "../common/css/other/variables.less";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - @sideBarWidth);
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
