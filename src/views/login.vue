<template>
  <div class="login">
    <div class="login-main">
      <div class="login-header"></div>
      <div class="login-form">
        <div class="login-navs">
          <span @click="accountLogin('1')" :style="isActive == 1 ? 'color: #f33' : 'color: #333'">账号登录</span>
          <span @click="accountLogin('2')" :style="isActive == 2 ? 'color: #f33' : 'color: #333'">快捷登录</span>
          <em class="login-float-bar" :style="isActive == 1 ? 'left: 0' : 'left: 50%'"></em>
        </div>
        <div class="login-line"></div>
        <div class="form-items" v-if="isActive===1">
          <el-form ref="form" :model="loginForm">
            <el-form-item>
              <el-input
                placeholder="请输入账号"
                v-model="loginForm.account">
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="请输入密码"
                v-model="loginForm.password">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                <i slot="suffix" class="el-input__icon el-icon-view"></i>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="loginAccount">登&nbsp;&nbsp;&nbsp;录</el-button>
            </div>
            <el-form-item class="login-checked">
              <el-checkbox v-model="remember">自动登录</el-checkbox>
              <span>忘记密码</span>
            </el-form-item>
            <div class="login-just">
              现在注册，就送20G流量<span>立即注册</span>
            </div>
            <div class="login-other">
              其他登录方式<span @click="openOther">&nbsp;&nbsp;展开 <i :class="isOpenOther ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
              <div class="other-img" v-show="!isOpenOther">
                <img src="../common/images/icon/qq.png" alt="">
                <img src="../common/images/icon/wechat.png" alt="">
                <img src="../common/images/icon/weibo.png" alt="">
              </div>
            </div>
          </el-form>
        </div>
        <div class="form-items" v-if="isActive===2">
          <el-form ref="form" :model="loginForm">
            <el-form-item>
              <el-input
                placeholder="请输入内容"
                v-model="loginForm.name">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="请输入内容"
                v-model="loginForm.age">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary">登&nbsp;&nbsp;&nbsp;录</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <footer-section></footer-section>
    </div>
  </div>
</template>
<script>
import footerSection from '../components/Footer/index';
import { sessionOrLocal } from '../utils/utils';
export default {
  data() {
    return {
      remember: 0,
      loginForm: {
        remember: 0
      },
      isActive: 1,
      isOpenOther: true
    };
  },
  components: {
    footerSection
  },
  methods: {
    openOther() {
      this.isOpenOther = !this.isOpenOther;
    },
    accountLogin(index) {
      this.isActive = parseInt(index);
    },
    // 登录
    loginAccount() {
      this.loginForm.remember = this.remember ? 1 : 0;
      this.$fetch('loginInfo', this.loginForm).then(res => {
        sessionOrLocal.set('token', res.data.token);
        sessionOrLocal.set('userInfo', res.data);

      });
    }
  }
};
</script>
<style lang="less" scoped>
  .login{
    height: 100%;
    width: 100%;
    // min-height: 720px;
    background-image: url(//t-alistatic01.e.vhall.com/static/images/account/loginbg.jpg);
    background-size: cover;
    position: relative;
    .login-main{
      text-align: left;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -300px;
      margin-left: -204px;
      width: 400px;
      .login-header{
        font-size: 0;
        margin: 0 auto;
        width: 162px;
        height: 92px;
        background: url(../common/images/login_logo.png) no-repeat;
        margin-bottom: 40px;
        background-size: contain;
        background-position: center;
        margin-top: 40px;
      }
      .login-form{
        background-color: #fff;
        border-radius: 4px;
        min-height: 400px;
        .login-navs{
          position: relative;
          line-height: 54px;
          height: 54px;
          span{
            width: 50%;
            font-size: 16px;
            display: inline-block;
            text-align: center;
            color: #333;
            cursor: pointer;
            &.active{
            color: #f33;
            }
          }
          .login-float-bar{
            width: 200px;
            position: absolute;
            height: 1px;
            background: #fc5659;
            top: 100%;
            &::before{
              content: "";
              width: 8px;
              height: 8px;
              position: absolute;
              top: 50%;
              margin-top: -5px;
              left: 50%;
              margin-left: -6px;
              border: 1px solid #fc5659;
              -webkit-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              transform: rotate(45deg);
              background: #fff;
              border-bottom-color: transparent;
              border-right-color: transparent;
            }
          }
        }
        .login-line{
          margin: 0;
          height: 1px;
          background: #dcdcdc;
        }
        .form-items{
          padding: 0 50px;
          padding-top: 37px;
          .el-input__inner{
            border-radius: 2px 0 0 2px;
            height: 38px;
          }
          .el-input--prefix .el-input__inner {
            padding-left: 40px;
          }
          .login-btn{
            width: 100%;
            margin-top: 50px;
            .el-button{
              display: inline-block;
              width: 100%;
              font-size: 16px;
            }
          }
          .login-checked{
            width: 100%;
            span{
              float: right;
              cursor: pointer;
              color: #666;
            }
          }
          .login-just{
            text-align: center;
            font-size: 13px;
            color: #333;
            height: 30px;
            span{
              color: #fc5659;
              cursor: pointer;
            }
          }
          .login-other{
            text-align: center;
            font-size: 13px;
            color: #999;
            padding-bottom: 20px;
            span{
              padding-left: 5px;
              cursor: pointer;
            }
            .other-img{
              text-align: center;
              padding: 10px 0;
              img{
                margin-right: 10px;
                width: 20px;
                height: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .login-footer{
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translate(-50%);
    }
  }
</style>
