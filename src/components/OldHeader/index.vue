<template>
  <div>
    <header class="commen-header home-header">
      <nav :class="['navbar nav-top all']" role="navigation">
        <div :class="['navbar-header', {'white-bg': isWhiteBg}]">
          <a :href="logo_jump_url" v-if="logo" class="navbar-brand">
            <img v-if="logo" :src="logo">
          </a>
          <a class="navbar-brand" :href="logo_jump_url" v-else>
            <img src="../../common/images/sys/logo-red@2x.png" alt="" v-if="isWhiteBg" />
            <img src="../../common/images/sys/logo@2x.png" alt="" v-else />
          </a>
        </div>
        <div class="collapse navbar-collapse" v-if="isShowLogin">
          <div class="pull-right login-reg" >
            <div class=""  v-if="isLogin">
              <el-dropdown @command="handleCommand" class="hover-dropdown">
                <span class="el-dropdown-link">
                  <img  class="head" :src="avatarImgUrl" alt="" width="30" height="30"/>
                  <span class="textofover">{{userInfo && userInfo.nick_name ? userInfo.nick_name : '--'}}</span>
                  <span class="caret"></span>
                </span>
                <el-dropdown-menu slot="dropdown" class="zdy-hover-dropdown">
                  <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class=""  v-if="!isLogin">
              <el-button size="small" round @click="toLoginPageHandle">登录</el-button>
              <el-button type="primary" size="small" round @click="toRegisterHandle">注册</el-button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";

export default {
  name: "index.vue",
  props: {
    isShowLogin: {
      require: false,
      default: true
    },
    scene: {
      require: false,
      default: ''
    },
    isWhiteBg: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      isLogin: null,
      userInfo: null,
      avatarImgUrl: null,
      logo: null,
      logo_jump_url: null
    };
  },
  methods: {
    toLoginPageHandle() {
      this.$router.push({
        path: '/login'
      });
    },
    toRegisterHandle() {
      this.$router.push({
        path: '/register'
      });
    },
    handleCommand(command) {
      if(command === 'loginOut') {
        this.loginOut();
      }
    },
    userLogoGet(id) {
      this.$fetch('userLogoGet', {
        webinar_user_id: id
      }).then(res => {
        console.log('用户控制台标识图：', res);
        this.logo = res.data.logo || '';
        this.logo_jump_url = res.data.logo_jump_url ? res.data.logo_jump_url : process.env.VUE_APP_COMPANY_URL;
      }).catch(err=>{
        this.logo = '';
        this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
      });
    },
    loginOut() {
      sessionOrLocal.clear();
      sessionOrLocal.clear('localStorage');
      // 更新当前页面
      this.isLogin = false;
    },
    updateAccount(account) {
      this.userInfo = account;
      this.avatarImgUrl = account ? account.avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png` : `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
    },
    // 获取标记 logo 主办方信息
    getSignInfo (id) {
      return this.$fetch('watchInterGetWebinarTag', {
        webinar_id: id
      }).then(res => {
        if (res.data) {
          // this.signInfo = res.data
          this.logo = res.data.logo_url || '';
          this.logo_jump_url = res.data.skip_url ? res.data.skip_url : process.env.VUE_APP_COMPANY_URL;
        }
      })
    }
  },
  mounted() {
    let userInfo  = sessionOrLocal.get('userInfo');
    if(userInfo !== null && userInfo !== 'null') {
      this.userInfo = JSON.parse(userInfo);
      this.avatarImgUrl = this.userInfo ? this.userInfo.avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png` : `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
    }
    this.isLogin = userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
    this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
    this.$EventBus.$on('saas_vs_login_out', this.loginOut);
    if (this.$route.path.indexOf('/user/home') !== -1) {
      if(this.$route.meta.type !== 'owner') {
        // 非控制台查看
        this.userLogoGet(this.$route.meta.type === 'owner' ? sessionOrLocal.get('userId') : this.$route.params.str);
      }
    } else if (this.$route.path.indexOf('/chooseWay/') !== -1 && this.$route.path.indexOf('/live/chooseWay/') === -1) {
      let _data = this.$route.params
      this.arr = [_data.str, _data.role]; // 活动ID，角色
      this.getSignInfo(this.arr[0]);
    }
  }
};
</script>
<style lang="less" scoped>
header.commen-header {
  margin-bottom: 0;
  height: 64px;
  background-color: #ffffff;
  .nav-top {
    height: 64px;
    margin: 0 auto;
    width: 1300px;
    border: none;
    &.all {
      width: 100%;
    }
  }
  .navbar {
    position: relative;
    min-height: 64px;
    margin-bottom: 20px;
  }
  .navbar-header {
    width: 224px;
    height: 64px;
    background: #FB3A32;
    float: left;
    &.white-bg {
      background: #ffffff;
    }
  }
  .navbar-brand {
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
  .navbar-collapse {
    padding-right: 15px;
    padding-left: 15px;
    overflow-x: visible;
    -webkit-overflow-scrolling: touch;
    border-top: 1px solid transparent;
    -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
  }
  .pull-right {
    float: right;
  }
  .login-reg {
    padding: 16px 0 0 10px;
    img.head {
      border-radius: 50%;
      margin-top: -12px;
      border: none;
    }
    .textofover {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      max-width: 160px;
    }
    .caret {
      display: inline-block;
      width: 0;
      height: 0;
      vertical-align: middle;
      border-top: 4px dashed;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      color: #787a7b;
      margin-left: 5px;
      margin-bottom: 13px;
    }
  }
  header #personal-info {
    padding: 5px 9px;
    cursor: pointer;
    position: relative;
  }
}
@media (min-width: 768px) {
  .navbar {
    border-radius: 4px;
  }
}
@media (min-width: 768px) {
  .navbar-collapse {
    display: block;
    height: auto;
    padding-bottom: 0;
    overflow: visible;
    width: auto;
    border-top: 0;
    padding-right: 15px;
    padding-left: 15px;
  }
}
/deep/.el-dropdown {
  margin-top: 6px;
}
</style>
