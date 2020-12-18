<template>
  <div class="navbar">
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />
    <!-- 登录用户等 -->
    <div class="right-menu">
      <div class="right-menu-item">
        <a :href="env.staticLinkVo.downOldUrl">旧版控制台</a>
      </div>
      <!-- 下载中心 -->
      <div class="right-menu-item">
        <el-badge is-dot class="item" :hidden="!isDownload > 0">
          <span @click.prevent.stop="toDownloadPage">
             <icon icon-class="saasicon_download"></icon>
          </span>
        </el-badge>
      </div>
      <!-- 帮助中心 -->
      <div class="right-menu-item">
        <span @click.prevent.stop="toHelpPage">
             <icon icon-class="saasicon_help_m"></icon>
          </span>
      </div>
      <!-- 消息中心 -->
      <div class="right-menu-item">
        <el-badge :value="unread_num" :max="99" class="item" :hidden="!unread_num>0">
          <span @click.prevent.stop="toMsgPage">
             <icon icon-class="saasicon_bell_m"></icon>
          </span>
        </el-badge>
      </div>
      <div class="right-menu-item">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatarImgUrl" class="user-avatar" alt="" />
            <span>{{
                userInfo && userInfo.nick_name ? userInfo.nick_name : ''
              }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item divided @click.native="toAccountPage">
              <span><icon icon-class="saasicon_Settings" class="hover-icon"></icon>账户信息</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span><icon icon-class="saasicon_Settings" class="hover-icon"></icon>退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb/index.vue';
import { sessionOrLocal } from "@/utils/utils";
import Env from "@/api/env";

export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      sidebar: {
        opened: true,// 左侧导航是否打开
        withoutAnimation: false // 左侧导航是否动画
      },
      unread_num: 0,
      isDownload: 0,
      avatarImgUrl: '',
      userInfo: null,
      env: Env
    };
  },
  // inject: [],
  methods: {
    toHelpPage() {
      window.open(Env.staticLinkVo.helpLinkUrl, '_blank');
    },
    toMsgPage() {
      this.$router.push({path: '/other/msgList'});
    },
    toDownloadPage() {
      this.isDownload = 0;
      this.$router.push({path: '/other/downloadList'});
    },
    toAccountPage() {
      this.$router.push({path: '/account/info'});
    },
    getUnreadNum() {
      this.$fetch('getUnreadNum', {}).then(res =>{
        this.unread_num = res && res.code === 200 && res.data ? res.data.unread_num : 0;
      }).catch(e=>{
        console.log(e);
        this.unread_num = 0;
      });
    },
    logout() {
      this.$fetch('loginOut', {}).then(res =>{
        if(res && res.code === 200 && res.data) {
          sessionOrLocal.clear();
          sessionOrLocal.clear('localStorage');
          // 监听消息变化
          this.$EventBus.$emit('saas_vs_login_out', true);
          this.$router.push({
            path: '/login'
          });
        } else {
          this.$message.error(res.msg || '退出失败');
        }
      }).catch(e=>{
        console.log(e);
        this.$message.error('退出失败');
      }).finally(() => {
        sessionOrLocal.clear();
        sessionOrLocal.clear('localStorage');
        // 监听消息变化
        this.$EventBus.$emit('saas_vs_login_out', true);
        this.$router.push({
          path: '/login'
        });
      });
    },
    updateAccount(account) {
      this.userInfo = account;
      this.avatarImgUrl = account ?  account.avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png` : `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
    },
    updateDownload() {
      this.isDownload = 1;
    }
  },
  mounted() {
    // 账号信息展示
    let userInfo = sessionOrLocal.get('userInfo');
    if(userInfo !== null) {
      this.userInfo = JSON.parse(userInfo);
      if(this.userInfo) {
        this.avatarImgUrl = this.userInfo.avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
      } else {
        this.avatarImgUrl = `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
      }
     } else {
      sessionOrLocal.clear();
      sessionOrLocal.clear('localStorage');
      this.$router.push({
        path: '/login'
      });
    }
    // 监听消息变化
    this.$EventBus.$on('saas_vs_msg_count', this.getUnreadNum);
    // 监听用户信息变化
    this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
    // 监听控制台是否触发导出
    this.$EventBus.$on('saas_vs_download_change', this.updateDownload);
  },
  created() {
    this.getUnreadNum();
  }
};
</script>
<style lang="less" scoped>
@import '../../common/css/index.less';
.user-dropdown {
  /deep/.el-dropdown-menu__item{
    padding: 0 10px!important;
  }
  /deep/.el-dropdown-menu__item--divided:before {
    display: none!important;
  }
  .hover-icon {
    margin-right: 12px;
  }
}
.navbar {
  height: 64px;
  padding: 15px 17px;
  overflow: hidden;
  position: relative;
  background: #fff;
}
.breadcrumb-container {
  float: left;
}
.right-menu {
  float: right;
  height: 100%;
  .flex-display();
  vertical-align: middle;
  line-height: 32px;
  &:focus {
    outline: none;
  }
  .right-menu-item {
    margin-right: 16px;
    cursor: pointer;
    &:first-child {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1384FF;
    }
  }
  /deep/.el-badge {
    line-height: 20px;
    i {
      color: #666666;
    }
  }
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
  }
  span {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-left: 10px;
  }
  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
}
</style>
