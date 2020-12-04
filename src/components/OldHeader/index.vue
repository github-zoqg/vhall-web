<template>
  <header class="commen-header home-header">
    <nav class="navbar nav-top" role="navigation">
      <div class="navbar-header">
        <a class="navbar-brand" href="/">
          <img src="//t-alistatic01.e.vhall.com/static/img/logo/saas_logo.png?v=20171012"
               onerror="this.src='//t-alistatic01.e.vhall.com/static/img/logo/saas_logo.png?v=20171012'"></a>
      </div>
      <div class="collapse navbar-collapse">
        <div class="pull-right login-reg" >
          <div class=""  v-if="isLogin">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <img  class="head" src="//t-alistatic01.e.vhall.com/static/img/head50.png" alt="" />
                <span class="textofover">ttttttt</span>
                <span class="caret"></span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class=""  v-if="!isLogin">
            <el-button size="mini" round>登录</el-button>
            <el-button type="primary" size="mini" round>注册</el-button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";

export default {
  name: "index.vue",
  data() {
    return {
      isLogin: null
    };
  },
  methods: {
    handleCommand(command) {
      if(command === 'loginOut') {
        this.loginOut();
      }
    },
    loginOut() {
      sessionOrLocal.clear();
      // 更新当前页面
      this.isLogin = false;
    }
  },
  mounted() {
    let userInfo  = sessionOrLocal.get('userInfo');
    this.isLogin = userInfo !== null && userInfo !== undefined && userInfo !== '';
  }
};
</script>

<style lang="less" scoped>
header.commen-header {
  margin-bottom: 0px;
  height: 60px;
  background-color: #ffffff;
  .nav-top {
    height: 60px;
    margin: 0 auto;
    width: 1300px;
    border: none;
  }
  .navbar {
    position: relative;
    min-height: 50px;
    margin-bottom: 20px;
    border: 1px solid transparent;
  }
  .navbar-header {
    float: left;
  }
  .navbar-brand {
    text-decoration: none;
    float: left;
    height: 50px;
    padding: 7px 15px 0 0;
    font-size: 18px;
    line-height: 20px;
    img {
      border: 0;
      margin-right: 67px;
      margin-top: 5px;
      width: 80px;
      height: 36px;
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
