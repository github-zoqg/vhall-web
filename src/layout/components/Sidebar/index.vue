<template>
  <div :class="{'has-logo':showLogo}">
    <div class="sidebar-logo-container" :class="{'collapse':!sidebar.opened}">
      <transition name="sidebarLogoFade">
        <router-link v-if="!sidebar.opened" key="collapse" class="sidebar-logo-link" to="/">
          <img v-if="logo" src="../../../common/images/logo.png" class="sidebar-logo">
        </router-link>
        <router-link v-else key="expand" class="sidebar-logo-link" to="/">
          <img v-if="logo" src="../../../common/images/logo.png" class="sidebar-logo">
        </router-link>
      </transition>
      <!-- 是否收缩按钮 -->
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        background-color="#1A1A1A"
        text-color="#E2E2E2"
        :unique-opened="false"
        active-text-color="#FB3A32"
        :collapse-transition="false"
        mode="vertical"
        class="el-menu-reset"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem';
import Hamburger from '../Hamburger/index.vue';
import {sessionOrLocal} from "@/utils/utils";
export default {
  components: {
    SidebarItem,
    Hamburger
  },
  data() {
    return {
      sidebar: {
        opened: true,
        withoutAnimation: false
      },
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    };
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return sessionOrLocal.get('sidebarLogo') || false;
    }
  },
  methods: {
    // 开启或者关闭 左侧导航部分
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened;
      sessionOrLocal.set('v3-control-sidebar', JSON.stringify(this.sidebar));
      this.$EventBus.$emit('hamburger', this.sidebar.opened);
    },
    getUserInfo() {
      // 控制台-账户信息页需要，所有页面都依赖
      this.$fetch('getInfo', {
        scene_id: 2
      }).then(res =>{
        if(res.code === 200 && res.data) {
          sessionOrLocal.set('account_info', JSON.stringify(res.data));
        } else {
          sessionOrLocal.set('account_info', null);
        }
      });
    }
  },
  mounted() {
    this.$EventBus.$on("hamburger", (status) => {
      this.sidebar.opened = status;
    });
    this.getUserInfo();
  },
  destroyed() {
  }
};
</script>
<style lang="less" scoped>
/*LOGO部分*/
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  position: relative;
  width: 224px;
  height: 64px;
  background: #FB3A32;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo-link {
    width: 224px;
    height: 54px;
    margin: 5px auto;
    text-align: center;
    & .sidebar-logo {
      height: 100%;
      width: auto;
    }
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
/*收缩按钮部分*/
.hamburger-container {
  position: absolute;
  right: 0;
  line-height: 32px;
  height: 32px;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;
}
</style>
