<template>
  <div :class="{'has-logo':showLogo}">
    <div class="sidebar-logo-container" :class="{'collapse':!sidebar.opened}">
      <transition name="sidebarLogoFade">
        <!-- 关闭情况下 -->
        <router-link v-if="!sidebar.opened" key="collapse" class="sidebar-logo-link" to="/">
          <img v-if="logo" :src="logo" class="sidebar-logo">
        </router-link>
        <!-- 展开情况下 -->
        <div v-else key="expand" class="sidebar-logo-link">
          <a :href="logo_jump_url" v-if="logo" class="sidebar-logo2">
            <img v-if="logo" :src="logo">
          </a>
          <img v-else src="../../../common/images/sys/logo@2x.png"  class="sidebar-logo static"/>
        </div>
      </transition>
      <!-- 是否收缩按钮 -->
      <hamburger :is-active="sidebar.opened" :class="`hamburger-container ${sidebar.opened ? 'right' : 'left' }`" @toggleClick="toggleSideBar" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        background-color="#1A1A1A"
        text-color="#E2E2E2"
        :unique-opened="true"
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
import Env from '@/api/env.js';
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
      logo: null,
      logo_jump_url: ''
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
    changeImg() {
      console.log(111111111111);
    }
  },
  mounted() {
    // 从缓存中获取控制台图片
    let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
    this.logo = userInfo.user_extends ? userInfo.user_extends.logo : '';
    this.logo_jump_url = userInfo.user_extends ? userInfo.user_extends.logo_jump_url : process.env.VUE_APP_WEB_URL;
      // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, userInfo.user_extends.logo || '') : '';
    this.$EventBus.$on("hamburger", (status) => {
      this.sidebar.opened = status;
    });
    this.$EventBus.$on("saas_vs_account_change", (res) => {
      let user_extends = res.user_extends;
      this.logo = user_extends.logo;
      this.logo_jump_url = user_extends.logo_jump_url;
    });
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
    height: 64px;
    text-align: center;
    & .sidebar-logo {
      height: 100%;
      width: 100%;
      &.static {
        height: auto;
        width: 156px;
        float: left;
        margin: 4px 0;
      }
    }

    a.sidebar-logo2 {
      float: left;
      padding: 4px 0;
      text-align: left;
      width: 156px!important;
      height: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
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
  top: calc(50% - 16px);
  line-height: 32px;
  height: 32px;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;
  &.right {
    right: 0;
  }
  &.left {
    left: 0;
  }
}
</style>
