<template>
  <div>
    <header class="commen-header home-header">
      <nav :class="['navbar nav-top all']" role="navigation">
        <div :class="['navbar-header', {'white-bg': isWhiteBg}]">
          <a :href="logo_jump_url" v-if="logo" class="navbar-brand" target="_blank">
            <img v-if="logo" :src="logo">
          </a>
          <a class="navbar-brand" :href="logo_jump_url" target="_blank" v-else>
            <img src="../../common/images/sys/logo-red@2x.png" alt="" v-if="isWhiteBg" />
            <img src="../../common/images/sys/logo@2x.png" alt="" v-else />
          </a>
        </div>
        <div class="navbar-title">
          <div class="navbar-intro" v-if="isSpecial">
            <el-tooltip class="item" effect="dark" :content="specialInfo.title" placement="bottom-start">
              <p>{{ specialInfo.title }}</p>
            </el-tooltip>
            <!-- <p>{{ specialInfo.title }}</p> -->
            <span class="time">{{ (specialInfo && specialInfo.created_at ? specialInfo.created_at : '') | unitTime  }}</span>
            <!-- <div class="share" @click="share">
              <i class="iconfont-v3 saasfenxiang_icon" slot="reference"></i>
              <span>分享</span>
            </div> -->
          </div>
        </div>
        <div class="collapse navbar-collapse" v-if="isShowLogin">
          <div class="share" @click="share" v-if="isSpecial">
            <i class="iconfont-v3 saasfenxiang_icon" slot="reference"></i>
            <span>分享</span>
          </div>
          <div class="pull-right login-reg">
            <div class="" v-if="isLogin">
             <!--  <el-dropdown @command="handleCommand" class="hover-dropdown">
                <span class="el-dropdown-link">
                  <img  class="head" :src="avatarImgUrl" alt="" width="30" height="30"/>
                  <span class="textofover">{{userInfo && userInfo.nick_name ? userInfo.nick_name : '--'}}</span>
                  <span class="caret"></span>
                </span>
                <el-dropdown-menu slot="dropdown" class="zdy-hover-dropdown">
                  <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <el-dropdown class="avatar-container">
                <div class="avatar-wrapper">
                  <div class="user-avatar">
                    <img :src="avatarImgUrl" alt=""/>
                  </div>
                  <span>{{show_name}}</span>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                  <!-- <el-dropdown-item divided @click.native="toLive"><i class="iconfont-v3 saasicon_lives1"></i> 我的直播</el-dropdown-item>
                  <el-dropdown-item divided @click.native="toFinance"><i class="iconfont-v3 saasicon_account1"></i> 账户中心</el-dropdown-item>
                  <el-dropdown-item divided @click.native="toMyHome"><i class="iconfont-v3 saasicon_home1"></i> 我的主页</el-dropdown-item>
                  <el-dropdown-item divided @click.native="toAccount"><i class="iconfont-v3 saasicon_Settings1"></i> 账户设置</el-dropdown-item> -->
                  <el-dropdown-item divided @click.native="loginOut"><i class="iconfont-v3 saasicon_exit"></i> 退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="unlogin"  v-if="!isLogin"  @click="openLoginHandler">
              <span><img :src="defaultAvatar" alt=""></span>
              <!-- <label @click="toLoginPageHandle">登录</label> -->
              <label>登录</label>
              <!-- <el-button size="small" round @click="toLoginPageHandle">登录</el-button>
              <el-button type="primary" size="small" round @click="toRegisterHandle">注册</el-button> -->
            </div>
          </div>
        </div>
      </nav>
    </header>
    <!-- 登录与注册 -->
    <RegLogin ref="regLogin" :gray_id="gray_id"></RegLogin>
  </div>
</template>

<script>
import { sessionOrLocal, clearCookies } from "@/utils/utils";
import RegLogin from './components/reg-login/index'
import { defaultAvatar } from '@/utils/ossImgConfig';

export default {
  name: "index.vue",
  components: {
    RegLogin
  },
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
    isSpecial: {
      require: false,
      default: false
    },
    specialInfo: {
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
    show_name: function() {
      if (this.userInfo && this.userInfo.nick_name) {
        if(this.userInfo.nick_name.length > 5) {
          return this.userInfo.nick_name.substring(0, 5) + '...';
        } else {
          return this.userInfo.nick_name
        }
      } else {
        return '';
      }
    }
  },
  methods: {
    toLoginPageHandle() {
      this.$router.push({
        path: '/login'
      });
    },
    // 打开登录弹出框
    openLoginHandler() {
      this.$refs.regLogin.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.regLogin && this.$refs.regLogin.changeTagHandler(2)
      })
    },
    toRegisterHandle() {
      this.$router.push({
        path: '/register'
      });
    },
    toLive() {
      this.$router.push({
        path: '/live/list'
      });
    },
    toFinance() {
      this.$router.push({
        path: '/finance/info'
      });
    },
    toMyHome() {
      this.$router.push({
        path: '/acc/myHome'
      });
    },
    toAccount() {
      this.$router.push({
        path: '/acc/info'
      });
    },
    handleCommand(command) {
      if(command === 'loginOut') {

        this.loginOut();
      }
    },
    userLogoGet(id) {
      let headers = {
        'gray-id': id
      }
      if (this.$route.path.indexOf('/special/detail') != -1) {
        let vhsaas_token = sessionOrLocal.get('vhsaas_token', 'localStorage')
        if (vhsaas_token == null || vhsaas_token == undefined) {
          vhsaas_token = ''
        }
        headers.token = vhsaas_token
      }
      this.$fetch('userLogoGet', {
        webinar_user_id: id
      }, headers).then(res => {
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
      clearCookies(); // 清空缓存 - cookies缓存
      // 更新当前页面
      this.isLogin = false;
    },
    updateAccount(account) {
      this.userInfo = account;
      this.avatarImgUrl = account ? account.avatar || defaultAvatar : defaultAvatar;
    },
    // 获取标记 logo 主办方信息
    getSignInfo (id) {
      return this.$fetch('watchInterGetWebinarTag', {
        webinar_id: id
      }, {
        platform: this.$route.query.type === 'ctrl' ? sessionOrLocal.get('platform', 'localStorage') || 17 : 7
      }).then(res => {
        if (res.data) {
          // this.signInfo = res.data
          this.logo = res.data.logo_url || '';
          this.logo_jump_url = res.data.skip_url ? res.data.skip_url : process.env.VUE_APP_COMPANY_URL;
        }
      })
    },
    share() {
      this.$emit('share')
    }
  },
  mounted() {
    let userInfo  = sessionOrLocal.get('userInfo');
    if(userInfo !== null && userInfo !== 'null') {
      this.userInfo = JSON.parse(userInfo);
      this.avatarImgUrl = this.userInfo ? this.userInfo.avatar || defaultAvatar : defaultAvatar;
    }
    this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
    this.$EventBus.$on('saas_vs_login_out', this.loginOut);
    if (this.$route.path.indexOf('/user/home') !== -1) {
      this.isLogin = userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
      if(this.$route.meta.type !== 'owner') {
        // 非控制台查看
        this.userLogoGet(this.$route.meta.type === 'owner' ? sessionOrLocal.get('userId') : this.$route.params.str);
      }
    } else if (this.$route.path.indexOf('/chooseWay/') !== -1 && this.$route.path.indexOf('/live/chooseWay/') === -1) {
      this.isLogin = userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
      let _data = this.$route.params
      this.arr = [_data.str, _data.role]; // 活动ID，角色
      this.getSignInfo(this.arr[0]);
    } else if (this.$route.path.indexOf('/special/detai') !== -1 && this.user_id) {
      userInfo  = sessionOrLocal.get('vhsaas_userInfo', 'localStorage');
      if(userInfo !== null && userInfo !== 'null') {
        this.userInfo = JSON.parse(userInfo);
        this.avatarImgUrl = this.userInfo ? this.userInfo.avatar || defaultAvatar : defaultAvatar;
      }
      this.isLogin = userInfo !== null && userInfo !== undefined && userInfo !== '' && userInfo !== 'null';
      // 根据专题得创建者Id，得到其头像数据
      this.userLogoGet(this.user_id);
    }
    this.$EventBus.$on('saas_vs_login_success', data => {
      this.isLogin = true
      this.userInfo = data || {}
      this.avatarImgUrl = data ? data.avatar || defaultAvatar : defaultAvatar;
    })
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
    background: #FB3A32;
    &.white-bg {
      background: #ffffff;
    }
    .navbar-brand {
      float: left;
      margin: 10px 32px;
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
  .navbar-title{
    flex:1;
    max-width: calc(100% - 405px);
    .navbar-intro{
      width: 100%;
    }
    p{
      padding-top: 13px;
      line-height: 24px;
      color: #1a1a1a;
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 100px;
      font-weight: 500;
    }
    .time{
      color: #999;
      font-size: 14px;
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
    flex:0 0 220px;
  }
  .collapse{
    display: flex;
    justify-items: center;
    justify-content: flex-end;
  }
  .share{
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    color: #666;
    margin-top: 18px;
    padding-right: 14px;
    span{
      display: block;
      padding-top: 3px;
    }
    &:hover{
      color: #FB3A32;
    }
  }
  .login-reg {
    padding: 16px 0 0 10px;
    img.head {
      border-radius: 50%;
      /* margin-top: -12px;
      border: none; */
      margin-top: -8px;
      border: none;
      vertical-align: middle;
      display: inline-block;
      margin-right: 8px;
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
     /*  margin-bottom: 13px; */
      margin-bottom: 4px;
    }
    .unlogin{
      span{
        width: 36px;
        height: 36px;
        display: inline-block;
        border-radius: 50%;
        margin-right: 8px;
        cursor: pointer;
        vertical-align: middle;
        margin-top: -5px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
      label {
        font-size: 14px;
        font-weight: 400;
        color: #666;
        line-height: 14px;
        cursor: pointer;
      }
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
  /deep/.el-dropdown-menu__item{
    padding: 0 10px!important;
    min-width: 160px;
    height: 40px;
    line-height: 40px;
    background: #FFFFFF;
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
    display: none!important;
  }
  .hover-icon {
    margin-right: 12px;
  }
  .iconfont-v3{
    font-size: 16px;
    vertical-align: bottom;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #f7f7f7;
    color: #1a1a1a;
  }
}
</style>
