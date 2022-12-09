<template>
  <div>
    <header class="commen-header home-header">
      <nav :class="['navbar nav-top all']" role="navigation">
        <div :class="['navbar-header', { 'white-bg': isWhiteBg }]">
          <a :href="logo_jump_url" v-if="logo" class="navbar-brand" target="_blank">
            <img v-if="logo" :src="logo" />
          </a>
          <a class="navbar-brand" :href="logo_jump_url" target="_blank" v-else>
            <img src="../../common/images/sys/logo-red@2x.png" alt="" v-if="isWhiteBg" />
            <img src="../../common/images/sys/logo@2x.png" alt="" v-else />
          </a>
        </div>
      </nav>
    </header>
    <!-- 登录与注册 -->
    <!-- <RegLogin ref="regLogin" :gray_id="gray_id"></RegLogin> -->
  </div>
</template>

<script>
  import { sessionOrLocal, clearCookies } from '@/utils/utils';
  // import RegLogin from './components/reg-login/index'
  import { defaultAvatar } from '@/utils/ossImgConfig';

  export default {
    name: 'index.vue',
    // components: {
    //   RegLogin
    // },
    props: {
      isShowLogin: {
        require: false,
        default: true
      },
      scene: {
        require: false,
        default: ''
      },
      user_id: {
        require: false,
        default: ''
      },
      isWhiteBg: {
        require: false,
        default: false
      },
      gray_id: {
        require: false,
        default: null
      }
    },
    data() {
      return {
        isLogin: null,
        userInfo: null,
        avatarImgUrl: null,
        logo: null,
        logo_jump_url: null,
        defaultAvatar
      };
    },
    computed: {
      show_name: function () {
        if (this.userInfo && this.userInfo.nick_name) {
          if (this.userInfo.nick_name.length > 5) {
            return this.userInfo.nick_name.substring(0, 5) + '...';
          } else {
            return this.userInfo.nick_name;
          }
        } else {
          return '';
        }
      }
    },
    methods: {
      userLogoGet(id) {
        let headers = {
          'gray-id': id
        };
        if (this.$route.path.indexOf('/special/detail') != -1) {
          let vhsaas_token = sessionOrLocal.get('vhsaas_token', 'localStorage');
          if (vhsaas_token == null || vhsaas_token == undefined) {
            vhsaas_token = '';
          }
          headers.token = vhsaas_token;
        }
        this.$fetch(
          'userLogoGet',
          {
            webinar_user_id: id
          },
          headers
        )
          .then(res => {
            console.log('用户控制台标识图：', res);
            this.logo = res.data.logo || '';
            this.logo_jump_url = res.data.logo_jump_url
              ? res.data.logo_jump_url
              : process.env.VUE_APP_COMPANY_URL;
          })
          .catch(err => {
            this.logo = '';
            this.logo_jump_url = process.env.VUE_APP_COMPANY_URL;
          });
      },
      loginOut() {
        sessionOrLocal.clear();
        sessionOrLocal.clear('localStorage');
        clearCookies(); // 清空缓存 - cookies缓存
        // 更新当前页面
        this.isLogin = false;
      },
      updateAccount(account) {
        this.userInfo = account;
        this.avatarImgUrl = account ? account.avatar || defaultAvatar : defaultAvatar;
      },
      // 获取标记 logo 主办方信息
      getSignInfo(id) {
        return this.$fetch(
          'watchInterGetWebinarTag',
          {
            webinar_id: id
          },
          {
            platform:
              this.$route.query.type === 'ctrl'
                ? sessionOrLocal.get('platform', 'localStorage') || 17
                : 7
          }
        ).then(res => {
          if (res.data) {
            // this.signInfo = res.data
            this.logo = res.data.logo_url || '';
            this.logo_jump_url = res.data.skip_url
              ? res.data.skip_url
              : process.env.VUE_APP_COMPANY_URL;
          }
        });
      },
      share() {
        this.$emit('share');
      }
    },
    mounted() {
      let userInfo = sessionOrLocal.get('userInfo');
      if (userInfo !== null && userInfo !== 'null') {
        this.userInfo = JSON.parse(userInfo);
        this.avatarImgUrl = this.userInfo ? this.userInfo.avatar || defaultAvatar : defaultAvatar;
      }
      this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
      this.$EventBus.$on('saas_vs_login_out', this.loginOut);
      if (this.$route.path.indexOf('/user/home') !== -1) {
        this.isLogin =
          userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
        if (this.$route.meta.type !== 'owner') {
          // 非控制台查看
          this.userLogoGet(
            this.$route.meta.type === 'owner'
              ? sessionOrLocal.get('userId')
              : this.$route.params.str
          );
        }
      } else if (
        this.$route.path.indexOf('/chooseWay/') !== -1 &&
        this.$route.path.indexOf('/live/chooseWay/') === -1
      ) {
        this.isLogin =
          userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
        let _data = this.$route.params;
        this.arr = [_data.str, _data.role]; // 活动ID，角色
        this.getSignInfo(this.arr[0]);
      } else if (this.$route.path.indexOf('/special/detai') !== -1 && this.user_id) {
        userInfo = sessionOrLocal.get('vhsaas_userInfo', 'localStorage');
        if (userInfo !== null && userInfo !== 'null') {
          this.userInfo = JSON.parse(userInfo);
          this.avatarImgUrl = this.userInfo ? this.userInfo.avatar || defaultAvatar : defaultAvatar;
        }
        this.isLogin =
          userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
        // 根据专题得创建者Id，得到其头像数据
        this.userLogoGet(this.user_id);
      }
      this.$EventBus.$on('saas_vs_login_success', data => {
        this.isLogin = true;
        this.userInfo = data || {};
        this.avatarImgUrl = data ? data.avatar || defaultAvatar : defaultAvatar;
      });
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
        // padding-right: 32px;
      }
    }
    .navbar {
      display: flex;
      flex: 1;
      margin-bottom: 20px;
    }
    .navbar-header {
      flex: 0 0 180px;
      height: 64px;
      background: #fb3a32;
      &.white-bg {
        background: #ffffff;
      }
      .navbar-brand {
        float: left;
        margin: 10px 32px;
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

    .navbar-collapse {
      padding-right: 15px;
      padding-left: 15px;
      overflow-x: visible;
      -webkit-overflow-scrolling: touch;
      border-top: 1px solid transparent;
      -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
      flex: 0 0 220px;
    }
    .collapse {
      display: flex;
      justify-items: center;
      justify-content: flex-end;
    }
    .share {
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      color: #666;
      margin-top: 18px;
      padding-right: 14px;
      span {
        display: block;
        padding-top: 3px;
      }
      &:hover {
        color: #fb3a32;
      }
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

  /deep/.avatar-container.el-dropdown {
    margin-top: 0;
  }
  .avatar-wrapper {
    position: relative;
    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 100%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
      }
    }
    span {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      padding-left: 10px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
  .user-dropdown {
    border-radius: 4px;
    padding: 0 0;
    /deep/.el-dropdown-menu__item {
      padding: 0 10px !important;
      min-width: 160px;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      border-radius: 0 0 4px 4px;
      text-align: left;
      padding: 0 16px;
    }
    li:first-child {
      border-radius: 4px 4px 0 0;
      border-top: 0;
      margin-top: 0;
    }
    .el-dropdown-menu__item--divided {
      margin-top: 0;
      border-top: 0;
    }
    /deep/.el-dropdown-menu__item--divided:before {
      display: none !important;
    }
    .hover-icon {
      margin-right: 12px;
    }
    .iconfont-v3 {
      font-size: 16px;
      vertical-align: bottom;
    }
    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
      background-color: #f7f7f7;
      color: #1a1a1a;
    }
  }
</style>
