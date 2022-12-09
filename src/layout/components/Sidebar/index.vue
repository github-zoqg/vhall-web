<template>
  <div :class="{ 'has-logo': showLogo }">
    <div class="sidebar-logo-container" :class="{ collapse: !sidebar.opened }">
      <transition>
        <!-- 关闭情况下 -->
        <router-link v-if="!sidebar.opened" key="collapse" class="sidebar-logo-link" to="/">
          <img v-if="logo" :src="logo" class="sidebar-logo" />
        </router-link>
        <!-- 展开情况下 -->
        <div v-else key="expand" class="sidebar-logo-link">
          <a :href="logo_jump_url" v-if="logo" class="sidebar-logo2">
            <img v-if="logo" :src="logo" />
          </a>
          <a :href="logo_jump_url" v-else class="sidebar-logo2">
            <img src="../../../common/images/sys/logo@2x.png" class="sidebar-logo static" />
          </a>
        </div>
      </transition>
      <!-- 是否收缩按钮 -->
      <hamburger
        :is-active="sidebar.opened"
        :class="`hamburger-container ${sidebar.opened ? 'right' : 'left'}`"
        @toggleClick="toggleSideBar"
      />
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
        @select="selectMenu"
        mode="vertical"
        class="el-menu-reset"
      >
        <template v-for="route in routes">
          <sidebar-item
            :key="route.path"
            :item="route"
            :base-path="route.path"
            v-show="isShow(route)"
          ></sidebar-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import SidebarItem from './SidebarItem';
  import Hamburger from '../Hamburger/index.vue';
  import Env from '@/api/env.js';
  import { sessionOrLocal } from '@/utils/utils';
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
        childPremission: {}
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
          // 子账号有设置权限，数据不展示，碰到name=dataMgr的数据，不展示整个模块。其它模块正常处理
          if (route && route.meta && route.meta.name === 'dataMgr') {
            return false;
          } else {
            return (
              route &&
              route.children &&
              route.children.length > 0 &&
              route.children.filter(item => {
                if (this.vsQuanxian[item.meta.auth_key] > 0) {
                  return true;
                } else {
                  return false;
                }
              })
            );
          }
        } else {
          // TODO 左侧导航菜单
          if (route.meta && route.meta.auth_key && this.vsQuanxian) {
            console.log('左侧', route.meta.auth_key, this.vsQuanxian[route.meta.auth_key]);
            if (this.vsQuanxian[route.meta.auth_key] > 0) {
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
        return this.$fetch('getChildPermission')
          .then(res => {
            console.log('当前权限', res.data);
            sessionOrLocal.set('SAAS_V3_SON_PS', JSON.stringify(res.data));
            this.childPremission = res.data;
          })
          .catch(res => {
            sessionOrLocal.removeItem('SAAS_V3_SON_PS');
            this.childPremission = {};
          });
      },
      // 开启或者关闭 左侧导航部分
      toggleSideBar() {
        this.sidebar.opened = !this.sidebar.opened;
        sessionOrLocal.set('v3-control-sidebar', JSON.stringify(this.sidebar));
        this.$EventBus.$emit('hamburger', this.sidebar.opened);
      },
      changeImg() {
        console.log(111111111111);
      },
      selectMenu(index, indexPath) {
        switch (index) {
          case '/material/word':
            this.setReport(100510);
            break;
          case '/material/video':
            this.setReport(100517);
            break;
          case '/material/question':
            this.setReport(100525);
            break;
          case '/material/prize':
            this.setReport(100533);
            break;
          case '/material/viewer':
            this.setReport(100540);
            break;
          case '/material/advertCard':
            this.setReport(100550);
            break;
          case '/material/gift':
            this.setReport(100556);
            break;
          case '/data/info':
            this.setReport(100562);
            break;
          case '/data/live':
            this.setReport(100577);
            break;
          case '/setting/function':
            this.setReport(100620);
            break;
          case '/setting/dev':
            this.setReport(100589);
            break;
          case '/setting/logo':
            this.setReport(100615);
            break;
          case '/setting/chat':
            this.setReport(100580);
            break;
          case '/setting/brand':
            this.setReport(100633);
            break;
          case '/setting/player':
            this.setReport(100490);
            break;
          case '/finance/info':
            this.setReport(100688);
            break;
          case '/finance/income':
            this.setReport(100749);
            break;
          case '/acc/info':
            this.setReport(100777);
            break;
          case '/acc/myHome':
            this.setReport(100790);
            break;
          case '/acc/son':
            this.setReport(100805);
            break;
        }
      },
      setReport(k) {
        let userId = sessionOrLocal.get('userId');
        this.$vhall_paas_port({
          k: k,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      pageResize() {
        this.$nextTick(() => {
          let screenWidth = window.screen.width;
          if (screenWidth < 1366) {
            this.sidebar.opened = false;
            sessionOrLocal.set('v3-control-sidebar', JSON.stringify(this.sidebar));
            this.$EventBus.$emit('hamburger', false);
          }
        });
      }
    },
    async created() {
      let userInfo = sessionOrLocal.get('userInfo');
      let vsPersonStr = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      if (vsPersonStr) {
        this.vsQuanxian = JSON.parse(vsPersonStr);
      }
      if (userInfo) {
        if (JSON.parse(userInfo).parent_id > 0) {
          // 获取子账号权限，更新
          await this.getChildPermission();
        }
      }
    },
    mounted() {
      // 从缓存中获取控制台图片
      let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      this.logo = userInfo.user_extends ? userInfo.user_extends.logo : '';
      console.log(this.logo, process.env.VUE_APP_COMPANY_URL, '2222222222222222');

      if (this.logo) {
        this.logo_jump_url = userInfo.user_extends
          ? userInfo.user_extends.logo_jump_url
          : process.env.VUE_APP_COMPANY_URL;
      } else {
        this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
      }
      // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, userInfo.user_extends.logo || '') : '';
      this.$EventBus.$on('hamburger', status => {
        this.sidebar.opened = status;
      });
      this.$EventBus.$on('saas_vs_account_change', res => {
        let user_extends = res.user_extends;
        this.logo = user_extends.logo;
        console.log(this.logo, process.env.VUE_APP_COMPANY_URL, '1111111111111111');
        if (this.logo) {
          this.logo_jump_url = user_extends.logo_jump_url || process.env.VUE_APP_COMPANY_URL;
        } else {
          this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
        }
      });
      let _this = this; //赋值vue的this
      window.onresize = () => {
        // 调用methods中的事件
        _this.pageResize();
      };
    },
    destroyed() {
      window.onresize = null;
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
    width: 100% !important;
    height: 64px;
    background: #fb3a32;
    text-align: center;
    overflow: hidden;
    & .sidebar-logo-link {
      width: 100%;
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
        width: 120px !important;
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
    -webkit-tap-highlight-color: transparent;
    &.right {
      right: 0;
    }
    &.left {
      left: 0;
    }
  }
</style>
