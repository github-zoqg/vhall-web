<template>
  <div class="navbar">
    <!-- 是否收缩按钮 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />
    <!-- 登录用户等 -->
    <div class="right-menu">
      <div class="right-menu-item">
        <a>旧版控制台</a>
      </div>
      <!-- 帮助中心 -->
      <div class="right-menu-item">
        <i class="el-icon-message-solid"></i>
      </div>
      <!-- 下载中心 -->
      <div class="right-menu-item">
        <el-badge :value="isDownload" :max="99" class="item" :hidden="!isDownload > 0">
          <i class="el-icon-message-solid" @click.prevent.stop="toDownloadPage"></i>
        </el-badge>
      </div>
      <!-- 消息中心 -->
      <div class="right-menu-item">
        <el-badge :value="unread_num" :max="99" class="item" :hidden="!unread_num>0">
          <i class="el-icon-message-solid" @click.prevent.stop="toMsgPage"></i>
        </el-badge>
      </div>
      <div class="right-menu-item">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img src="../../common/images/avatar.png" class="user-avatar">
            <span>微吼直播</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb/index.vue';
import Hamburger from './Hamburger/index.vue';
import { sessionOrLocal } from "@/utils/utils";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      sidebar: {
        opened: true,// 左侧导航是否打开
        withoutAnimation: false // 左侧导航是否动画
      },
      unread_num: 0,
      isDownload: 0
    };
  },
  // inject: [],
  methods: {
    toMsgPage() {
      this.$router.push({path: '/other/msgList'});
    },
    toDownloadPage() {
      this.$router.push({path: '/other/downloadList'});
    },
    getUnreadNum() {
      this.$fetch('getUnreadNum', {}).then(res =>{
        this.unread_num = res && res.code === 200 && res.data ? res.data.unread_num : 0;
      }).catch(e=>{
        console.log(e);
        this.unread_num = 0;
      });
    },
    // 开启或者关闭 左侧导航部分
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened;
      sessionOrLocal.set('v3-control-sidebar', JSON.stringify(this.sidebar));
      this.$EventBus.$emit('hamburger', this.sidebar.opened);
    },
    async logout() {
      alert('退出');
    }
  },
  created() {
    this.getUnreadNum();
  }
};
</script>

<style lang="less" scoped>
.navbar {
  height: 64px;
  padding: 15px 17px;
  overflow: hidden;
  position: relative;
  background: #fff;
}
.hamburger-container {
  line-height: 32px;
  height: 32px;
  float: left;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;
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
    &:first-child {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
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
    font-family: PingFangSC-Regular, PingFang SC;
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
