<template>
  <div class="forget-password">
    <OldHeader :isShowLogin="false" scene="forgetPwd"></OldHeader>
    <div class="section__main">
      <pageTitle pageTitle="找回密码"></pageTitle>
      <div class="forget__layout">
        <el-steps :active="findStep" class="forget__step" align-center>
          <el-step title="选择找回方式">
            <img
              src="../../common/images/login/step_doing.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-if="findStep === 1"
            />
            <img
              src="../../common/images/login/step_done.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-else-if="findStep <= 4 && findStep > 1"
            />
            <img
              src="../../common/images/login/step_default.png"
              class="step__default"
              slot="icon"
              alt=""
              v-else
            />
          </el-step>
          <el-step title="验证身份">
            <img
              src="../../common/images/login/step_doing.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-if="findStep === 2"
            />
            <img
              src="../../common/images/login/step_done.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-else-if="findStep <= 4 && findStep > 2"
            />
            <img
              src="../../common/images/login/step_default.png"
              class="step__default"
              slot="icon"
              alt=""
              v-else
            />
          </el-step>
          <el-step title="设置新密码">
            <img
              src="../../common/images/login/step_doing.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-if="findStep === 3"
            />
            <img
              src="../../common/images/login/step_done.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-else-if="findStep <= 4 && findStep > 3"
            />
            <img
              src="../../common/images/login/step_default.png"
              class="step__default"
              slot="icon"
              alt=""
              v-else
            />
          </el-step>
          <el-step title="设置成功">
            <img
              src="../../common/images/login/step_doing.png"
              class="step__default active"
              slot="icon"
              alt=""
              v-if="findStep === 4"
            />
            <img
              src="../../common/images/login/step_default.png"
              class="step__default"
              slot="icon"
              alt=""
              v-else
            />
          </el-step>
        </el-steps>
        <!-- 第一步 -->
        <div class="step-1" v-if="findStep === 1">
          <div class="step-ways">
            <div class="step-phone" @click="findPassword('phone')">
              <div class="phone">
                <i class="icon-step-phone"></i>
                通过手机找回
              </div>
              <p class="text">通过注册时填写的手机号找回</p>
            </div>
            <div class="step-email" @click="findPassword('email')">
              <div class="phone">
                <i class="icon-step-email"></i>
                通过邮箱找回
              </div>
              <p class="text">通过注册时填写的邮箱找回</p>
            </div>
          </div>
          <div class="care_div">
            <span class="step__warning"></span>
            <span>注意：子账号找回密码请直接联系父账号所有者</span>
          </div>
        </div>
        <!-- 第二步 -->
        <div class="step-2" v-if="findStep === 2">
          <div class="find-phone" v-if="isType === 'phone'">
            <p class="find-text">
              请填写您的注册手机号获取验证码，完成身份验证；您还可以选择
              <span @click="findPassword('email', 1)">邮箱找回密码</span>
            </p>
            <el-form ref="checkDynamicForm" :model="dynamicForm" :rules="loginRules">
              <el-form-item prop="phone">
                <el-input
                  placeholder="请输入手机号"
                  :maxlength="11"
                  auto-complete="off"
                  v-model.trim="dynamicForm.phone"
                ></el-input>
              </el-form-item>
              <el-form-item id="captcha-box">
                <div id="loginCaptcha" class="captcha">
                  <el-input auto-complete="off" v-model.trim="dynamicForm.text"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="code">
                <div class="code">
                  <el-input
                    placeholder="输入验证码"
                    clearable
                    :maxlength="6"
                    auto-complete="off"
                    v-model.trim="dynamicForm.code"
                  >
                    <template slot="append">
                      <span
                        @click="time == 60 && dynamicForm.phone && getDyCode()"
                        :class="mobileKey && isFindCode ? 'isLoginActive' : ''"
                      >
                        {{ time == 60 ? '获取验证码' : `${time}s 后重新发送` }}
                      </span>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
              <div class="login-btn">
                <el-button type="primary" class="length152" @click.stop="sureFindPassword()" round>
                  提&nbsp;&nbsp;&nbsp;交
                </el-button>
              </div>
            </el-form>
          </div>
          <div class="find-phone" v-if="isType === 'email'">
            <p class="find-text">
              请填写您的邮箱获取验证码，完成身份验证；您还可以选择
              <span @click="findPassword('phone', 1)">手机找回密码</span>
            </p>
            <el-form ref="checkDynamicForm" :model="dynamicForm" :rules="loginRules">
              <el-form-item prop="email">
                <el-input
                  placeholder="请输入邮箱"
                  auto-complete="off"
                  :maxlength="30"
                  v-model.trim="dynamicForm.email"
                >
                  <template slot="append">
                    <span
                      @click="time == 60 && getDyCode()"
                      :class="isFindCode ? 'isLoginActive' : ''"
                    >
                      {{ time == 60 ? '获取验证码' : `${time}s 后重新发送` }}
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  placeholder="输入邮箱验证码"
                  auto-complete="off"
                  :maxlength="6"
                  v-model.trim="dynamicForm.code"
                ></el-input>
              </el-form-item>
              <div class="login-btn">
                <el-button type="primary" class="length152" @click="sureFindPassword" round>
                  确&nbsp;&nbsp;&nbsp;认
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 第三步 -->
        <div class="step-3" v-if="findStep === 3">
          <el-form ref="resetPassword" :model="dynamicForm" :rules="loginRules">
            <el-form-item prop="password">
              <pwd-input
                placeholder="请输入新密码"
                :maxlength="30"
                type="password"
                auto-complete="off"
                v-model.trim="dynamicForm.password"
              ></pwd-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <pwd-input
                placeholder="请再次输入密码"
                type="password"
                :maxlength="30"
                auto-complete="off"
                v-model.trim="dynamicForm.checkPassword"
              ></pwd-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" class="length152" @click="resetPassword()" round>
                提&nbsp;&nbsp;&nbsp;交
              </el-button>
            </div>
          </el-form>
        </div>
        <!-- 第四步 -->
        <div class="step-4" v-if="findStep === 4">
          <i class="icon-set-success"></i>
          <h3>新密码设置成功</h3>
          <p>
            <strong>{{ linkTime }}秒</strong>
            后跳转登录页面
          </p>
        </div>
      </div>
    </div>
    <footer-section></footer-section>
  </div>
</template>

<script>
  import OldHeader from '@/components/OldHeader';
  import PageTitle from '@/components/PageTitle';
  import footerSection from '../../components/Footer/index';
  import PwdInput from '../AccountModule/components/pwdInput.vue';
  import regRule from '@/utils/reg-rule';

  export default {
    components: {
      OldHeader,
      PageTitle,
      footerSection,
      PwdInput
    },
    data() {
      let validatePhone = (rule, value, callback) => {
        this.isFindCode = false;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (!regRule['mobile'].test(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            this.isFindCode = true;
            callback();
          }
        }
      };
      let validateEmail = (rule, value, callback) => {
        if (value === '') {
          this.isFindCode = false;
          callback(new Error('请输入邮箱'));
        } else {
          if (!regRule['email'].test(value)) {
            this.isFindCode = false;
            callback(new Error('请输入正确的邮箱'));
          } else {
            this.isFindCode = true;
            callback();
          }
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dynamicForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        linkTime: 5,
        findStep: 1,
        time: 60,
        isType: 'phone',
        codeKey: 0,
        isFindCode: false,
        captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey: '', // 云盾值
        captcha: null, // 云盾本身
        dynamicForm: { phone: '', password: '', checkPassword: '', code: '' },
        loginRules: {
          phone: [{ validator: validatePhone, trigger: 'blur' }],
          email: [{ validator: validateEmail, trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          checkPassword: [{ validator: validateCheckPass, trigger: 'blur' }]
        }
      };
    },
    methods: {
      findPassword(type, index) {
        this.isType = type;
        this.findStep = 2;
        this.isFindCode = false;
        this.mobileKey = '';
        if (type === 'phone') {
          this.callCaptcha();
        }
        if (index) {
          this.$refs['checkDynamicForm'].resetFields();
        }
      },
      // 第二步获取短信验证码
      getDyCode() {
        if (this.isType === 'phone') {
          if (this.isFindCode) {
            if (!this.mobileKey) {
              this.$message({
                message: '请先校验图形验证码',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
            this.$fetch(
              'sendCode',
              {
                type: this.isType === 'phone' ? 1 : 2,
                data: this.isType === 'phone' ? this.dynamicForm.phone : this.dynamicForm.email,
                validate: this.mobileKey,
                scene_id: this.isType === 'phone' ? 5 : 4
              },
              {
                token: ''
              }
            )
              .then(() => {
                this.countDown();
              })
              .catch(res => {
                this.$message({
                  message: res.msg,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        } else if (this.isType === 'email') {
          if (this.isFindCode) {
            this.$fetch(
              'sendCode',
              {
                type: this.isType === 'phone' ? 1 : 2,
                data: this.isType === 'phone' ? this.dynamicForm.phone : this.dynamicForm.email,
                validate: this.mobileKey,
                scene_id: this.isType === 'phone' ? 5 : 4
              },
              {
                token: ''
              }
            )
              .then(() => {
                this.countDown();
              })
              .catch(res => {
                this.$message({
                  message: res.msg,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        }
      },
      // 第二步确定 检测短信验证码
      sureFindPassword() {
        this.$refs['checkDynamicForm'].validate(valid => {
          if (valid) {
            let params = {
              type: this.isType === 'phone' ? 1 : 2,
              data: this.isType === 'phone' ? this.dynamicForm.phone : this.dynamicForm.email,
              code: this.dynamicForm.code,
              scene_id: this.isType === 'phone' ? 5 : 4
            };
            this.$fetch('codeCheck', params)
              .then(res => {
                if (res.data) {
                  this.codeKey = res.data.key;
                  this.findStep = 3;
                }
              })
              .catch(res => {
                this.mobileKey = '';
                this.callCaptcha();
                this.$message({
                  message: res.msg,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 第三步重置密码
      resetPassword() {
        console.log(this.dynamicForm.checkPassword, this.dynamicForm.password);
        this.$refs['resetPassword'].validate(valid => {
          if (valid) {
            let params = {
              old_password: '',
              password: this.dynamicForm.password,
              confirm_password: this.dynamicForm.checkPassword,
              scene_id: this.isType === 'phone' ? 5 : 4,
              key: this.codeKey
            };
            this.$fetch('resetPassword', params, {
              token: ''
            })
              .then(res => {
                this.findStep = 4;
                let that = this;
                let linkTimer = setInterval(function () {
                  that.linkTime--;
                  if (that.linkTime === 1) {
                    window.clearInterval(linkTimer);
                    that.$router.push({ path: '/' });
                    that.linkTime = 5;
                  }
                }, 1000);
              })
              .catch(res => {
                this.$message({
                  message: res.msg,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          } else {
            console.log('error submit!!');
            return false;
          }
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
          this.mobileKey = '';
          this.callCaptcha();
          this.time = 60;
        }
      },
      /**
       * 初始化网易易盾图片验证码
       */
      callCaptcha() {
        const that = this;
        // eslint-disable-next-line
        initNECaptcha({
          captchaId: this.captchakey,
          element: '#loginCaptcha',
          mode: 'float',
          onReady(instance) {
            console.log('instance', instance);
          },
          onVerify(err, data) {
            if (data) {
              that.mobileKey = data.validate;
              console.log('data>>>', data);
            } else {
              that.mobileKey = '';
              console.log('errr>>>', err);
              that.$message({
                message: '图形验证码错误',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              that.callCaptcha();
              // that.errorMsgShow = true;
            }
          },
          onload(instance) {
            console.log('onload', instance);
            that.captcha = instance;
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  /deep/.footer {
    text-align: center;
    font-weight: 100;
    font-size: 12px;
    line-height: 18px;
    position: unset;
    padding-bottom: 30px;
  }
  /deep/.pageTitle {
    font-size: 24px;
    font-weight: normal;
  }
  .section__main {
    padding-top: 40px;
    width: 1020px;
    height: auto;
    margin: 0 auto;
    padding-bottom: 40px;
  }
  @media (min-width: 1920px) {
    .section__main {
      width: 1374px;
    }
  }
  .forget__layout {
    .layout--right--main();
    min-height: 601px;
    padding: 130px 255px 175px 255px;
  }
  .forget__step {
    .step__default {
      display: block;
      width: 14px;
      height: 14px;
      &.active {
        width: 24px;
        height: 24px;
      }
    }
    /deep/.el-step__icon.is-text {
      border: 0;
    }
  }
  /deep/.el-step__line {
    background-color: #e2e2e2;
  }
  /deep/.el-step__title {
    &.is-process,
    &.is-finish,
    &.is-wait,
    &.is-error,
    &.is-success {
      font-size: 14px;
      font-weight: 400;
      color: #222222;
      line-height: 26px;
    }
  }

  .step-1 {
    overflow: hidden;
    margin: 64px auto 0;
    .step-ways {
      display: flex;
      justify-content: space-around;
      .step-phone,
      .step-email {
        text-align: center;
        .phone {
          overflow: hidden;
          cursor: pointer;
          width: 203px;
          height: 63px;
          background: #ffffff;
          box-shadow: 0px 6px 12px 0px rgba(132, 132, 132, 0.16);
          border-radius: 4px;
          border: 1px solid #f5f5f5;
          line-height: 63px;
          font-size: 16px;
          font-weight: 400;
          color: #222222;
          i {
            display: inline-block;
          }
          .icon-step-phone {
            width: 19px;
            height: 28px;
            vertical-align: middle;
            margin-right: 21px;
            background: url('../../common/images/login/step_phone.png') no-repeat;
            background-size: cover;
          }
          .icon-step-email {
            width: 28px;
            height: 22px;
            vertical-align: middle;
            margin-right: 11px;
            background: url('../../common/images/login/step_mail.png') no-repeat;
            background-size: cover;
          }
        }
        .text {
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
          margin-top: 15px;
        }
      }
    }
    .care_div {
      font-size: 12px;
      font-weight: 400;
      color: #fb3a32;
      line-height: 17px;
      text-align: center;
      margin-top: 64px;
      .step__warning {
        display: inline-block;
        vertical-align: text-bottom;
        width: 19px;
        height: 17px;
        margin-right: 5px;
        background: url('../../common/images/login/step_warning.png') no-repeat;
        background-size: cover;
      }
    }
  }

  .step-2 {
    text-align: center;
    width: 450px;
    margin: 50px auto;
    .find-text {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      margin-bottom: 10px;
      text-align: left;
      span {
        color: #4da1ff;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 32px;
      &:last-child {
        margin-bottom: 0;
      }
      /deep/.el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
    /deep/.el-input-group__append {
      border: 0;
      position: absolute;
      bottom: 1px;
      right: 1px;
      cursor: pointer;
      span {
        border: 0;
        position: absolute;
        bottom: 0;
        right: 0;
        // width: 103px;
        padding: 8px 12px;
        line-height: 18px;
        text-align: center;
        background: #e8e8e8;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 400;
        color: #222222;
        vertical-align: bottom;
        cursor: not-allowed;
        &.isLoginActive {
          background: #fb3a32;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            color: #fff;
            background: #fc615b;
          }
          &:active {
            color: #ffffff;
            background: #e2332c;
          }
        }
        &.isSend {
          background: #e8e8e8;
          color: #666666;
        }
      }
    }
    .login-btn {
      text-align: center;
      margin-top: 50px;
    }
  }

  .step-3 {
    text-align: center;
    width: 450px;
    margin: 50px auto;
    /deep/.el-form-item {
      margin-bottom: 32px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .login-btn {
      text-align: center;
      margin-top: 50px;
    }
  }

  .step-4 {
    .icon-set-success {
      display: block;
      width: 40px;
      height: 40px;
      background: url('../../common/images/login/step_result_success.png') no-repeat;
      background-size: cover;
      margin: 88px auto 23px auto;
    }
    h3 {
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      color: #222222;
      line-height: 26px;
      margin-bottom: 10px;
    }
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #222222;
      line-height: 20px;
      strong {
        color: #fc5659;
      }
    }
  }
  #captcha-box {
    .captcha {
      // 云盾样式重置
      /deep/.yidun_tips {
        color: #999999;
        line-height: 38px !important;
        .yidun_tips__text {
          vertical-align: initial;
        }
      }
      /deep/.yidun_slider {
        .yidun_slider__icon {
          background-image: url(./images/icon-slide1.png) !important;
          background-size: 28px 20px;
          background-position: center;
          margin-top: -5px;
        }
        &:hover {
          .yidun_slider__icon {
            background-image: url(./images/icon-slide.png) !important;
          }
        }
      }
      /deep/ .yidun--success {
        .yidun_control {
          .yidun_slider__icon {
            background-image: url(./images/icon-succeed.png) !important;
          }
          .yidun_slider {
            .yidun_slider__icon {
              background-image: url(./images/icon-succeed.png);
              background-size: 28px 20px;
              background-position: center;
            }
            &:hover {
              .yidun_slider__icon {
                background-image: url(./images/icon-succeed.png);
                background-size: 28px 20px;
                background-position: center;
              }
            }
          }
        }
      }
    }
  }
</style>
