<template>
  <div>
    <section class="layout__main">
      <nav class="layout__left" :class="{
        hideSidebar: !openSidebar,
        openSidebar: openSidebar,
        withoutAnimation: false
      }">
        <sidebar class="sidebar-container" />
      </nav>
      <section class="layout__right" :class="{
        hideSidebar: !openSidebar,
        openSidebar: openSidebar,
        withoutAnimation: false
      }">
        <header class="header__nav" :class="showShadow ? 'show-shadow' : ''">
          <navbar />
        </header>
        <section class="section__main">
          <app-main />
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';
export default {
  components: { Sidebar, Navbar, AppMain },
  data() {
    return {
      openSidebar: true,
      showShadow: false
    };
  },
  mounted() {
    this.$EventBus.$on("hamburger", (status) => {
      this.openSidebar = !!status;
    });
    this.$nextTick(() => {
      window.addEventListener("scroll", this.handleScroll); // 监听（绑定）滚轮滚动事件
    });
  },
  beforeDestroy() {
    this.$EventBus.$off('hamburger');
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop; //滚动高度
      if (scrollHeight > 40) {
        this.showShadow = true;
      } else {
        this.showShadow = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@color_f7: #F7F7F7;
@color_1A: #1A1A1A;
@color_ff: #FFFFFF;
/*头部*/
.header__nav {
  background: @color_ff;
  display: block;
  overflow: hidden;
  padding: 16px 0;
  position: fixed;
  z-index: 100;
  height: 64px;
}
.show-shadow{
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
}
/*主体*/
.layout__left {
  float: left;
  font-size: 20px;
  background: @color_1A;
  transition: all 0.3s;
  &:before {
    content: '';
    display: block;
    height: 1px;
    background-color: #fff;
  }
  &.hideSidebar {
    width: 84px;
  }
  &.openSidebar {
    width: 224px;
  }
}
.layout__right {
  overflow: hidden;
  background: @color_f7;
}
.section__main {
  padding-top: 104px;
  width: 1020px;
  min-width: 1024px;
  /*min-height: 650px;*/
  min-height: 100vh;
  height: auto;
  margin: 0 auto;
  padding-bottom: 40px;
}
@media (min-width: 1920px) {
  .section__main {
    width: 1374px;
    min-width: 1374px;
  }
}
</style>
