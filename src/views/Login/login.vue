<template>
  <div class="loginPage">
    <div class="login">
      <div class="login-main">
      <div class="login-header"></div>
      <div class="login-form" v-if="$route.path==='/login'">
        <div class="login-navs">
          <span @click="changeLogin('1')" :style="isActive == 1 ? 'color: #f33' : 'color: #333'">账号登录</span>
          <span @click="changeLogin('2')" :style="isActive == 2 ? 'color: #f33' : 'color: #333'">快捷登录</span>
          <em class="login-float-bar" :style="isActive == 1 ? 'left: 0' : 'left: 50%'"></em>
        </div>
        <div class="login-line"></div>
        <div class="form-items" v-if="isActive===1" >
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="account">
              <el-input
                placeholder="请输入账号"
                clearable
                v-model="loginForm.account">
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
              </el-input>
            </el-form-item>
            <el-form-item v-show="isLogin">
              <div id="loginCaptcha">
                <el-input
                  v-model="loginForm.text">
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                placeholder="请输入密码"
                maxlength="30"
                :type="isPassWordType ? 'password' : 'text'"
                v-model="loginForm.password">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                <span slot="suffix" @click="passWordType" class="closePwd">
                  <icon class="icon" icon-class="saaseyeclose_huaban1" v-show="isPassWordType"></icon>
                  <icon class="icon" icon-class="saasicon-eye" v-show="!isPassWordType"></icon>
                </span>
              </el-input>
             <p class="errorText" v-show="errorText"><i class="el-icon-error"></i>{{ errorText }}</p>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="loginAccount">登&nbsp;&nbsp;&nbsp;录</el-button>
            </div>
            <el-form-item class="login-checked">
              <el-checkbox v-model="remember">自动登录</el-checkbox>
              <span @click="forgetPassword">忘记密码</span>
            </el-form-item>
            <div class="login-just">
              现在注册，就送20G流量<span @click="$router.push({path: '/register'})">立即注册</span>
            </div>
            <div class="login-other">
              其他登录方式<span @click="openOther">&nbsp;&nbsp;展开 <i :class="isOpenOther ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
              <div class="other-img" v-show="!isOpenOther">
                <img src="../../common/images/icon/qq.png" alt="" @click="thirdLogin('https://t-saas-dispatch.vhall.com/v3/commons/auth/qq?jump_url=')">
                <img src="../../common/images/icon/wechat.png" alt="" @click="thirdLogin('https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=pc&jump_url=')">
                <!-- <img src="../../common/images/icon/weibo.png" alt=""> -->
              </div>
            </div>
          </el-form>
        </div>
        <div class="form-items" v-if="isActive===2">
          <el-form ref="dynamicForm" :model="dynamicForm" :rules="loginRules">
            <el-form-item prop="phoneNumber">
              <el-input
                placeholder="请输入手机号"
                maxlength="11"
                clearable
                v-model="dynamicForm.phoneNumber">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div id="loginCaptcha">
                <el-input
                  v-model="dynamicForm.text">
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="dynamic_code">
              <div class="code">
                <el-input
                style="width:200px"
                  placeholder="动态密码"
                  clearable
                  v-model="dynamicForm.dynamic_code">
                  <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                </el-input>
                <span @click="getDyCode" :class="showCaptcha ? 'isLoginActive' : ''">{{ time == 60 ? '获取验证码' : `${time}秒后发送` }}</span>
              </div>
             <p class="errorText" v-show="errorMsgShow"><i class="el-icon-error"></i>{{ errorMsgShow }}</p>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="loginDynamic">登&nbsp;&nbsp;&nbsp;录</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <div class="login-form" v-else>
        <div class="login-navs">
          <span>欢迎注册</span>
        </div>
        <div class="login-line"></div>
        <div class="form-items">
          <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
              <el-form-item prop="phone">
                <el-input
                  placeholder="请输入手机号"
                  maxlength="11"
                  clearable
                  @input="checkPhone"
                  v-model="registerForm.phone">
                  <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div id="registerCaptcha">
                  <el-input
                    v-model="registerForm.text">
                  </el-input>
                </div>
                <p class="errorText" v-show="errorMsgShow"><i class="el-icon-error"></i>图形验证码错误</p>
              </el-form-item>
              <el-form-item prop="code">
                <div class="code">
                  <el-input
                  style="width:200px"
                    placeholder="动态密码"
                    v-model="registerForm.code">
                  </el-input>
                  <span @click="getRegisterCode" :class="showCaptcha ? 'isLoginActive' : ''">{{ time == 60 ? '获取验证码' : `${time}秒后发送` }}</span>
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  placeholder="设置密码(6-30个字符)"
                  maxlength="30"
                  :type="isPassWordType ? 'password' : 'text'"
                  v-model="registerForm.password">
                  <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                  <span slot="suffix" @click="passWordType" class="closePwd">
                    <icon class="icon" icon-class="saaseyeclose_huaban1" v-show="isPassWordType"></icon>
                    <icon class="icon" icon-class="saasicon-eye" v-show="!isPassWordType"></icon>
                  </span>
                </el-input>
                <p class="errorText" v-show="registerText"><i class="el-icon-error"></i>{{registerText}}</p>
              </el-form-item>
              <div class="login-btn">
                <el-button type="primary" @click="registerAccount" :disabled="!checked">立 即 注 册</el-button>
              </div>
              <el-form-item class="login-checked register-checked">
                <el-checkbox v-model="checked">同意遵守<a href="https://t.e.vhall.com/home/vhallapi/serviceterms" target="_blank" rel="noopener noreferrer">《服务条款及隐私协议》</a></el-checkbox>
                <span @click="$router.push({path: '/login'})">去登录</span>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    </div>
    <div class="login-footer">
      <footer-section></footer-section>
    </div>
  </div>
</template>
<script>
import footerSection from '../../components/Footer/index';
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!(/^1[0-9]{10}$/.test(value))) {
          callback(new Error('请输入正确的手机号'));
        }
        callback();
      }
    };
    return {
      remember: 0,
      isPassWordType: true,
      errorText: '',
      registerText: '',
      isLogin: false, //账号、密码是否已经输入正确
      loginForm: {
        account: '',
        password: ''
      },
      dynamicForm: {phoneNumber: ''},
      registerForm: {
        agree: 1,
        phone: '',
        code: '',
        password: ''
      },
      registerRules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      loginRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phoneNumber: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        dynamic_code: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ]
      },
      checked: true,
      showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      errorMsgShow: '',
      time: 60,
      isActive: 1,
      isOpenOther: true
    };
  },
  components: {
    footerSection
  },
  watch: {
    '$route.path': function() {
      this.callCaptcha();
      this.registerText = '';
      this.errorText = '';
      this.errorMsgShow = '';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.callCaptcha();
    });
  },
  methods: {
    openOther() {
      this.isOpenOther = !this.isOpenOther;
    },
     // 第三方登录
    thirdLogin(url) {
      window.location.href = `${url}${process.env.VUE_APP_WEB_URL}`;
    },
    passWordType() {
      this.isPassWordType = !this.isPassWordType;
    },
    // 忘记密码
    forgetPassword() {
      this.$router.push({path: '/forgetPassword'});
    },
    changeLogin(index) {
      this.isActive = parseInt(index);
      this.isActive === 1 ? this.$refs['dynamicForm'].resetFields() : this.$refs['loginForm'].resetFields();
      this.mobileKey = '';
      this.showCaptcha = false;
      this.errorMsgShow = '';
      this.errorText = '';
    },
    getDyCode() {
      // 获取短信验证码
      if (this.checkMobile(this.dynamicForm.phoneNumber) && this.mobileKey) {
        this.$fetch('sendCode', {
          type: 1,
          data: this.dynamicForm.phoneNumber,
          validate: this.mobileKey,
          scene_id: 7
        }).then(() => {
          this.countDown();
        });
      }
    },
    // 账号登录
    loginAccount() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.checkedAccount();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 快捷登录
    loginDynamic() {
      this.$refs.dynamicForm.validate((valid) => {
        if (valid) {
          this.checkedAccount();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 登录账号锁定检测
    checkedAccount() {
      let account = this.isActive == 1 ? this.loginForm.account : this.dynamicForm.phoneNumber;
      this.$fetch('loginCheck', {account: account}).then(res => {
        if (res && res.code === 200) {
          //检测结果check_result  : 1 锁定    0未锁定
          if (this.isActive == 1) {
            if (res.data.check_result && !this.mobileKey) {
              this.isLogin = true;
            } else {
              this.login(this.loginForm);
            }
          } else {
            // 账号是否存在：1存在 0不存在
            if (res.data.account_exist) {
              this.dynamicForm.account = account;
              this.login(this.dynamicForm);
            } else {
              this.errorText = '账号不存在';
            }
          }
        } else {
          this.errorText = res.msg;
          // this.$message.error(res.msg || '登录验证失败');
        }
      });
    },
    login(params) {
      params.captcha = this.mobileKey;
      params.remember = this.remember ? 1 : 0;
      this.$fetch('loginInfo', params).then(res => {
        if(res && res.code === 200) {
          this.mobileKey = '';
          this.errorText = '';
          this.errorMsgShow = '';
          sessionOrLocal.set('token', res.data.token || '', 'localStorage');
          // 存储控制台-channel_id频道
          sessionOrLocal.set('SAAS_V3_CHANNEL_ID', res.data.channel_id || '', 'localStorage');
          // 存储控制台-channel_id频道
          sessionOrLocal.set('SAAS_V3_SSO_TOKEN', res.data.sso_token || '', 'localStorage');
          this.$router.push({path: '/'});
        } else {
          if (this.isActive == 1) {
            console.log(res.msg, '1111111111111111');
            this.errorText = res.msg || '登录失败！';
          } else {
            this.errorMsgShow = res.msg || '登录失败！';
          }
          sessionOrLocal.set('token', '', 'localStorage');
          this.callCaptcha();
        }
      });
    },
    // 注册判断手机号是否已经注册
    checkPhone() {
      if (this.checkMobile(this.registerForm.phone)) {
         this.$fetch('loginCheck', {account: this.registerForm.phone}).then(res => {
          if (res && res.code === 200) {
            if (res.data.account_exist) {
              this.registerText = '该手机号已注册';
            } else {
              this.registerText = '';
            }
          } else {
            this.registerText = res.msg || '注册失败';
          }
        });
      }
    },
    getRegisterCode() {
      if (this.checkMobile(this.registerForm.phone) && this.mobileKey) {
        this.$fetch('sendCode', {
          type: 1,
          data: this.registerForm.phone,
          validate: this.mobileKey,
          scene_id: 8
        }).then(() => {
          this.countDown();
        });
      }
    },
    registerAccount() {
      this.registerForm.captcha = this.mobileKey;
      this.registerForm.source = this.$route.query.source || 1;
      this.$fetch('register', this.registerForm).then(res => {
        if(res && res.code === 200) {
          this.$message.success('注册成功');
          this.mobileKey = '';
          setTimeout(() => {
            this.$router.push({path:'/login'})
          }, 1000)
        } else {
          this.registerText = res.msg || '注册失败';
        }
      }).catch(e => {
        console.log(e);
        this.registerText = res.msg || '注册失败';
      });
    },
    /**
     * 倒计时函数
     */
    countDown() {
      if (this.time) {
        this.time--;
        setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        this.time = 60;
      }
    },
    /**
     * 校验手机号
     */
    checkMobile(phone) {
      return /^1[0-9]{10}$/.test(phone);
    },
    checkPassWord() {
      return /^(\w){6,20}$/.test(this.loginForm.password);
    },
    /**
     * 初始化网易易盾图片验证码
     */
    callCaptcha() {
      const that = this;
      // eslint-disable-next-line
      initNECaptcha({
        captchaId: this.captchakey,
        element: `#${this.$route.path==='/login' ? 'loginCaptcha' : 'registerCaptcha'}`,
        mode: 'float',
        onReady(instance) {
          console.log('instance', instance);
        },
        onVerify(err, data) {
          if (data) {
            that.mobileKey = data.validate;
            that.showCaptcha = true;
            console.log('data>>>', data);
            that.errorMsgShow = '';
            that.errorText = '';
            that.registerText = '';
          } else {
            that.loginForm.captcha = '';
            that.dynamicForm.captcha = '';
            that.errorMsgShow = '图形验证码错误';
            that.errorText = '图形验证码错误';
            that.registerText = '图形验证码错误';
            // that.callCaptcha();
          }
        },
        onload(instance) {
          console.log('onload', instance);
          that.captcha = instance;
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.loginPage{
  height: 100%;
  .login-footer{
      position: relative;
      z-index: 1;
    }
}
  .login{
    height: 100%;
    width: 100%;
    min-height: 800px;
    margin-bottom: -139px;
    text-align: center;
    font-size: 0;
    background-image: url(//t-alistatic01.e.vhall.com/static/images/account/loginbg.jpg);
    background-size: cover;
    position: relative;
    .login-main{
      text-align: left;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -350px;
      margin-left: -204px;
      width: 400px;
      .login-header{
        font-size: 0;
        margin: 0 auto;
        width: 162px;
        height: 92px;
        background: url(../../common/images/login_logo.png) no-repeat;
        margin-bottom: 20px;
        background-size: contain;
        background-position: center;
        margin-top: 40px;
      }
      .login-form{
        background-color: #fff;
        border-radius: 4px;
        min-height: 400px;
        .el-form-item{
          margin-bottom: 18px;
        }
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
          /deep/.el-input__inner{
            border-radius: 2px 0 0 2px;
            height: 40px;
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
          .register-checked{
            padding-bottom: 20px;
            a{
              color: #4da1ff;
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
          .errorText{
            line-height: 20px;
            color:#fc5659;
            font-size: 12px;
            i{
              color: #fc5659;
              padding-right: 5px;
            }
          }
        }
      }
    }
    .code{
      border-radius: 4px;
      border: 1px solid #CCC;
      // height: 36px;
      /deep/.el-input__inner{
        width: 210px;
        border: 0;
        // line-height: 36px;
      }
      span{
        // float: right;
        background: #dedede;
        padding: 6px 12px;
        border-radius: 2px;
        color: #fff;
        height: 36px;
        cursor: pointer;
        &.isLoginActive{
          background: #fc5659;
        }
      }
    }
    .closePwd{
      cursor: pointer;
    }
  }
</style>
