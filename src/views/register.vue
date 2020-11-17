<template>
  <div class="login">
    <div class="login-main">
      <div class="login-header"></div>
      <div class="login-form">
        <div class="login-navs">
          <span>欢迎注册</span>
          <span></span>
        </div>
        <div class="login-line"></div>
        <div class="form-items">
          <el-form ref="form" :model="loginForm">
            <el-form-item>
              <el-input
                placeholder="请输入手机号"
                v-model="loginForm.name">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="codePwd">
              <el-input
                placeholder="动态密码"
                style="width: 185px;"
                v-model="loginForm.pwd">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
              <span class="code" :style="isActive ? 'background: #dedede;color: #333;' : ''" @click="getCode">获取验证码</span>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="设置密码(6-30个字符)"
                v-model="loginForm.age">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary">立 即 注 册</el-button>
            </div>
            <el-form-item class="login-checked">
              <el-checkbox v-model="loginForm.checked">同意遵守<b>《服务条款》</b></el-checkbox>
              <span @click="login">去登录</span>
            </el-form-item>
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
export default {
  data() {
    return {
      isActive: false,
      loginForm: {}
    };
  },
  components: {
    footerSection
  },
  methods: {
    login() {
      console.log('去登录');
    },
    // 获取验证码
    getCode() {
      this.isActive = true;
    }
  }
};
</script>
<style lang="less" scoped>
  .login{
    height: 100%;
    width: 100%;
    min-height: 920px;
    background-image: url(//t-alistatic01.e.vhall.com/static/images/account/loginbg.jpg);
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column;
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
          .codePwd{
            border: 1px solid #ccc;
            height: 40px;
            border-radius: 2px 0 0 2px;
            /deep/.el-input__inner {
              border: none;
              height: 38px;
            }
            .code{
              display: inline-block;
              width: 110px;
              text-align: center;
              height: 32px;
              line-height: 34px;
              background: #fc5659;
              color: #fff;
              // background: #dedede;
            }

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
            b{
              font-weight: normal;
              color: #4da1ff;
            }
            span{
              float: right;
              cursor: pointer;
              color: #666;
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
