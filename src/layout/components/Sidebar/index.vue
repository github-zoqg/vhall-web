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
          <a :href="logo_jump_url" v-else class="sidebar-logo2">
            <img src="../../../common/images/sys/logo@2x.png"  class="sidebar-logo static"/>
          </a>
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
        active-background-color="#2A2A2A"
        text-color="#E2E2E2"
        :unique-opened="true"
        active-text-color="#FB3A32"
        :collapse-transition="false"
        mode="vertical"
        class="el-menu-reset"
      >
      <template  v-for="route in routes">
         <sidebar-item :key="route.path" :item="route" :base-path="route.path" v-show="isShow(route)">
         </sidebar-item>
      </template>
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
      logo_jump_url: process.env.VUE_APP_COMPANY_URL,
      childPremission: {},
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
    isShow(route) {
      if (this.childPremission && Number(this.childPremission.permission_data) === 0) {
        // 子账号有设置权限
        return !(route && route.meta && route.meta.name === 'dataMgr');
      } else {
        // TODO 左侧导航菜单
        if (route.meta && route.meta.auth_key && this.vsQuanxian) {
           if(this.vsQuanxian[route.meta.auth_key] > 0) {
             // 由权限限制的字段，若大于0，则返回
             return true;
           } else {
             return false;
           }
        } else {
          return true;
        }
      }
    },
    getChildPermission() {
      return this.$fetch('getChildPermission').then(res => {
        console.log('当前权限', res.data)
        sessionOrLocal.set('SAAS_V3_SON_PS', JSON.stringify(res.data));
        this.childPremission = res.data;
      }).catch(res => {
        sessionOrLocal.removeItem('SAAS_V3_SON_PS');
        this.childPremission = {};
      })
    },
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
  async created() {
    let userInfo = sessionOrLocal.get('userInfo');
    if (userInfo) {
      if(JSON.parse(userInfo).parent_id > 0) {
        // 获取子账号权限，更新
        await this.getChildPermission();
      }
    }
    let vsPersonStr = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
    if (vsPersonStr) {
      this.vsQuanxian = JSON.parse(vsPersonStr);
    }
  },
  mounted() {
    // 从缓存中获取控制台图片
    let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
    this.logo = userInfo.user_extends ? userInfo.user_extends.logo : '';
    console.log(this.logo, process.env.VUE_APP_COMPANY_URL, '2222222222222222')

    if(this.logo) {
      this.logo_jump_url = userInfo.user_extends ? userInfo.user_extends.logo_jump_url : process.env.VUE_APP_COMPANY_URL;
    } else {
      this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
    }
    // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, userInfo.user_extends.logo || '') : '';
    this.$EventBus.$on("hamburger", (status) => {
      this.sidebar.opened = status;
    });
    this.$EventBus.$on("saas_vs_account_change", (res) => {
      let user_extends = res.user_extends;
      this.logo = user_extends.logo;
      console.log(this.logo,process.env.VUE_APP_COMPANY_URL, '1111111111111111')
      if(this.logo) {
        this.logo_jump_url = user_extends.logo_jump_url || process.env.VUE_APP_COMPANY_URL;
      } else {
        this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
      }
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
      /* &.static {
        height: auto;
        width: 156px;
        float: left;
        margin: 4px 0;
      } */
    }

    a.sidebar-logo2 {
      float: left;
      margin: 10px 0 10px 18px;
      text-align: left;
      width: 120px!important;
      height: 44px;
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
  top: calc(50% - 26px);
  line-height: 44px;
  height: 44px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color:transparent;
  &.right {
    right: 0;
  }
  &.left {
    left: 0;
  }
}
</style>
