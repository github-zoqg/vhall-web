<template>
  <div class="wapper wapperClass">
    <div class="left fl">
      <div>
        <img src="../../common/images/login/login-logo.png" alt="" class="logo" />
        <div class="content">
          <p>
            针对不同类型、不同行业企业业务和使用场景，
            <br />
            专注于为企业提供通用型场景化直播解决方案和服务
          </p>
          <img src="../../common/images/login/login-advert.png" alt="" class="bg" />
        </div>
      </div>
    </div>
    <div class="right fr">
      <!-- 登录 -->
      <div class="login-box" v-if="$route.path === '/login'">
        <h3>欢迎登录微吼直播</h3>
        <p class="tab">
          <span @click="changeLogin('1')" :class="isActive == 1 ? 'active' : ''">账号登录</span>
          <em>|</em>
          <span @click="changeLogin('2')" :class="isActive == 2 ? 'active' : ''">手机登录</span>
        </p>
        <!-- 账号登录 -->
        <div class="user-wapper form-items" v-if="isActive === 1">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="account" class="loginUsername">
              <p class="itemLable" :class="{ active: isLoginAccountFocus || loginForm.account }">
                用户名 / 邮箱 / 手机号
              </p>
              <VhallInput
                :placeholder="!isLoginAccountFocus ? '用户名/邮箱/手机号' : ''"
                @focus="handleFocus('isLoginAccountFocus')"
                @blur="handleBlur('isLoginAccountFocus')"
                clearable
                :maxlength="30"
                auto-complete="off"
                v-model.trim="loginForm.account"
              ></VhallInput>
            </el-form-item>
            <!-- 这个 id 有 3 个用来重置样式 -->
            <el-form-item v-show="isLogin" id="captcha-box">
              <div id="loginCaptcha" class="captcha">
                <VhallInput auto-complete="off" v-model.trim="loginForm.text"></VhallInput>
              </div>
            </el-form-item>
            <el-form-item prop="password" class="loginPassword">
              <p class="itemLable" :class="{ active: isLoginPasswordFocus || loginForm.account }">
                密码
              </p>
              <VhallInput
                :placeholder="!isLoginPasswordFocus ? '密码' : ''"
                @focus="handleFocus('isLoginPasswordFocus')"
                @blur="handleBlur('isLoginPasswordFocus')"
                clearable
                :maxlength="30"
                style="ime-mode: disabled"
                :type="isPassWordType ? 'password' : 'text'"
                auto-complete="off"
                onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
                @keyup.enter.native="loginAccount"
                v-model.trim="loginForm.password"
              >
                <span slot="suffix" @click="passWordType" class="closePwd">
                  <icon
                    class="icon"
                    icon-class="saaseyeclose_huaban1"
                    v-show="isPassWordType"
                  ></icon>
                  <icon class="icon" icon-class="saasicon-eye" v-show="!isPassWordType"></icon>
                </span>
              </VhallInput>
              <p class="errorText" v-show="errorText">
                <i class="el-icon-error"></i>
                {{ errorText }}
              </p>
            </el-form-item>
            <el-form-item class="auto-login">
              <el-checkbox v-model="remember">自动登录</el-checkbox>
              <span class="forget" @click="forgetPassword">忘记密码</span>
            </el-form-item>
            <div class="login-btn">
              <el-button class="submit" type="primary" @click="loginAccount" round>
                登&nbsp;&nbsp;&nbsp;录
              </el-button>
            </div>
            <div class="login-just">
              现在注册，就送20G流量
              <span @click="toRegister">立即注册</span>
            </div>
            <div class="login-other inline">
              其他登录方式
              <!-- 旧版 <span @click="openOther">&nbsp;&nbsp;展开 <i :class="isOpenOther ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span> -->
              <div :class="['other-img', !isOpenOther ? 'noVisible' : '']">
                <!-- 旧版
            <img v-show="isOpenOther" src="../../common/images/icon/qq.png" alt="" @click="thirdLogin('/v3/commons/auth/qq?jump_url=')">
            <img v-show="isOpenOther" src="../../common/images/icon/wechat.png" alt="" @click="thirdLogin('/v3/commons/auth/weixin?source=pc&jump_url=')">
            -->
                <span
                  class="third__login__qq"
                  v-show="isOpenOther"
                  @click="thirdLogin('/v3/commons/auth/qq?jump_url=')"
                ></span>
                <span
                  class="third__login__wechat"
                  v-show="isOpenOther"
                  @click="thirdLogin('/v3/commons/auth/weixin?source=pc&jump_url=')"
                ></span>
              </div>
            </div>
            <!-- 隐私协议合规 -->
            <privacy-select
              :scene="isOpenOther ? 'login' : 'login_normal'"
              ref="loginPrivacyCompliance"
              @check="checkResult"
            ></privacy-select>
          </el-form>
        </div>
        <!-- 手机号登录 -->
        <div class="phone-wapper form-items" v-show="isActive == 2">
          <el-form ref="dynamicForm" :model="dynamicForm" :rules="loginRules">
            <el-form-item prop="phoneNumber" class="loginUsername">
              <p
                class="itemLable"
                :class="{ active: isLoginPhoneFocus || dynamicForm.phoneNumber }"
              >
                手机号
              </p>
              <VhallInput
                :placeholder="!isLoginPhoneFocus ? '手机号' : ''"
                @focus="handleFocus('isLoginPhoneFocus')"
                @blur="handleBlur('isLoginPhoneFocus')"
                :maxlength="11"
                auto-complete="off"
                clearable
                v-model.trim="dynamicForm.phoneNumber"
              ></VhallInput>
              <p class="errorText" v-if="isRegister">
                <i class="el-icon-error"></i>
                该手机号未注册，请先注册
              </p>
            </el-form-item>
            <!-- 这个 id 有两个，只为覆盖样式 -->
            <el-form-item id="captcha-box">
              <div id="loginCaptcha" class="captcha">
                <VhallInput auto-complete="off" v-model.trim="dynamicForm.text"></VhallInput>
              </div>
            </el-form-item>
            <el-form-item prop="dynamic_code">
              <div class="code">
                <p
                  class="itemLable"
                  :class="{ active: isLoginPasswordFocus1 || dynamicForm.dynamic_code }"
                >
                  动态密码
                </p>
                <el-input
                  :placeholder="!isLoginPasswordFocus1 ? '动态密码' : ''"
                  @focus="handleFocus('isLoginPasswordFocus1')"
                  @blur="handleBlur('isLoginPasswordFocus1')"
                  @keyup.enter.native="loginDynamic"
                  clearable
                  :maxlength="6"
                  auto-complete="off"
                  v-model.trim="dynamicForm.dynamic_code"
                >
                  <template slot="append">
                    <span
                      @click="time == 60 && getDyCode()"
                      :class="showCaptcha && isValidaLoginPhone ? 'isLoginActive' : ''"
                    >
                      {{ time == 60 ? '获取验证码' : `获取验证码(${time}s)` }}
                    </span>
                  </template>
                </el-input>
              </div>
              <p class="errorText" v-show="errorMsgShow">
                <i class="el-icon-error"></i>
                {{ errorMsgShow }}
              </p>
            </el-form-item>
            <div class="login-btn">
              <el-button class="submit top" type="primary" @click="loginDynamic" round>
                登 录
              </el-button>
            </div>
            <!-- 隐私协议合规 -->
            <privacy-select
              scene="loginDynamic"
              ref="loginDynamicPrivacyCompliance"
              @check="checkResult"
            ></privacy-select>
          </el-form>
        </div>
      </div>
      <!-- 注册 -->
      <div class="login-box register" v-show="$route.path !== '/login'">
        <h3>欢迎注册微吼直播</h3>
        <div class="login-line"></div>
        <div class="form-items">
          <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
            <el-form-item prop="phone" class="phone-box">
              <p class="itemLable" :class="{ active: isPhoneFocus || registerForm.phone }">
                手机号
              </p>
              <el-input
                :placeholder="!isPhoneFocus ? '请输入手机号' : ''"
                :maxlength="11"
                clearable
                @focus="handleFocus('isPhoneFocus')"
                @blur="handleBlur('isPhoneFocus')"
                @input="checkPhone"
                auto-complete="off"
                v-model.trim="registerForm.phone"
              ></el-input>
            </el-form-item>
            <el-form-item id="captcha-box">
              <div id="registerCaptcha" class="captcha">
                <el-input auto-complete="off" v-model.trim="registerForm.text"></el-input>
              </div>
              <!-- <p class="errorText" v-show="errorMsgShow"><i class="el-icon-error"></i>图形验证码错误</p> -->
            </el-form-item>
            <el-form-item prop="code" class="code">
              <div class="code">
                <p class="itemLable" :class="{ active: isCodeFocus || registerForm.code }">
                  动态密码
                </p>
                <VhallInput
                  :placeholder="!isCodeFocus ? '动态密码' : ''"
                  clearable
                  @focus="handleFocus('isCodeFocus')"
                  @blur="handleBlur('isCodeFocus')"
                  :maxlength="6"
                  auto-complete="off"
                  v-model="registerForm.code"
                >
                  <template slot="append">
                    <span
                      @click="time == 60 && getRegisterCode()"
                      :class="showCaptcha && isValidaregisterPhone ? 'isLoginActive' : ''"
                    >
                      {{ time == 60 ? '获取验证码' : `获取验证码(${time}s)` }}
                    </span>
                  </template>
                </VhallInput>
              </div>
            </el-form-item>
            <el-form-item prop="password" class="password">
              <p class="itemLable" :class="{ active: isPasswordFocus || registerForm.password }">
                密码
              </p>
              <pwdinput
                clearable
                @focus="handleFocus('isPasswordFocus')"
                @blur="handleBlur('isPasswordFocus')"
                @keyup.enter.native="registerAccount"
                :placeholder="!isPasswordFocus ? '设置密码（6-30个字符）' : ''"
                :maxlength="30"
                auto-complete="off"
                onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
                style="ime-mode: disabled"
                :isPasswordVisible="!isPassWordType"
                v-model="registerForm.password"
              >
                <span slot="suffix" @click="passWordType" class="closePwd">
                  <icon
                    class="icon"
                    icon-class="saaseyeclose_huaban1"
                    v-show="isPassWordType"
                  ></icon>
                  <icon class="icon" icon-class="saasicon-eye" v-show="!isPassWordType"></icon>
                </span>
              </pwdinput>
              <p class="errorText" v-show="registerText">{{ registerText }}</p>
            </el-form-item>
            <div class="login-btn">
              <el-button class="submit" type="primary" @click="registerAccount" round>
                立即注册
              </el-button>
            </div>
            <el-form-item class="auto-login register-checked">
              <span class="toLogin" @click="$router.push({ path: '/login' })">去登录</span>
            </el-form-item>
            <!-- 隐私协议合规 -->
            <privacy-select
              scene="register"
              ref="registerPrivacyCompliance"
              @check="checkResult"
            ></privacy-select>
          </el-form>
        </div>
      </div>
      <footer-section></footer-section>
    </div>
  </div>
</template>
<script>
  import { JSEncrypt } from 'jsencrypt';
  import Cookies from 'js-cookie';
  import { sessionOrLocal, getQueryString } from '@/utils/utils';
  import regRule from '@/utils/reg-rule';
  import footerSection from '../../components/Footer/index';
  import PrivacySelect from './components/privacy-select.vue';
  import pwdinput from './components/pwdInput';

  export default {
    components: {
      footerSection,
      pwdinput,
      PrivacySelect
    },
    data() {
      var validatePhone = (rule, value, callback) => {
        // this.registerText = '';
        this.isValidaregisterPhone = false;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (!/^1[0-9]{10}$/.test(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            this.isValidaregisterPhone = true;
            callback();
          }
        }
      };
      var validAccout = (rule, value, callback) => {
        this.errorText = '';
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };

      const validpassword = (rule, value, callback) => {
        console.log(rule);
        this.errorText = '';
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!regRule['pwd'].exec(value)) {
          callback(new Error('账号密码错误'));
        } else {
          callback();
        }
      };

      const validateRegPwd = (rule, value, callback) => {
        if (value === '') {
          if (this.registerText) {
            callback();
          } else {
            callback(new Error('请输入密码'));
          }
        } else if (!regRule['pwd'].exec(value)) {
          if (this.registerText) {
            callback();
          } else {
            callback(new Error('请设置登录密码（6-30位字符）'));
          }
        } else {
          callback();
        }
      };

      var validateLoginPhone = (rule, value, callback) => {
        this.errorMsgShow = '';
        this.isValidaLoginPhone = false;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (!/^1[0-9]{10}$/.test(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            this.$fetch('loginCheck', { account: value, channel: 'B' }, { token: '' })
              .then(res => {
                if (!res.data.account_exist) {
                  callback(new Error('该手机号未注册，请先注册'));
                } else {
                  this.isValidaLoginPhone = true;
                  callback();
                }
              })
              .catch(res => {
                this.errorMsgShow = res.msg || '登录失败';
              });
          }
        }
      };

      return {
        isPhoneFocus: false,
        isCodeFocus: false,
        isPasswordFocus: false,
        isLoginPasswordFocus: false,
        isLoginAccountFocus: false,
        isLoginPhoneFocus: false,
        isLoginPasswordFocus1: false,
        remember: 0,
        isPassWordType: true,
        errorText: '',
        registerText: '',
        isRegister: false,
        isLogin: false, //账号、密码是否已经输入正确
        loginForm: {
          account: '',
          password: ''
        },
        dynamicForm: { phoneNumber: '' },
        registerForm: {
          agree: 1,
          phone: '',
          code: '',
          password: ''
        },
        registerRules: {
          phone: [{ validator: validatePhone, trigger: 'blur' }],
          password: [{ validator: validateRegPwd, trigger: 'blur' }],
          code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
        },
        loginRules: {
          account: [{ required: true, validator: validAccout, trigger: 'blur' }],
          password: [{ required: true, validator: validpassword, trigger: 'blur' }],
          phoneNumber: [{ validator: validateLoginPhone, trigger: 'blur' }],
          dynamic_code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
        },
        loginChecked: false, // 登录(账号密码登录)——默认未选中
        loginDynamicChecked: false, // 登录(快捷短信登录)——默认未选中
        registerChecked: false, // 注册——默认未选中
        showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
        captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey: '', // 云盾值
        captcha: null, // 云盾本身
        errorMsgShow: '',
        isValidaLoginPhone: false,
        isValidaregisterPhone: false,
        time: 60,
        isActive: 1,
        isOpenOther: true,
        vm: null
      };
    },
    watch: {
      '$route.path': function () {
        this.callCaptcha();
        this.registerText = '';
        this.errorText = '';
        this.errorMsgShow = '';
        this.isValidaregisterPhone = false;
        this.isValidaLoginPhone = false;
      }
    },
    created() {
      this.judgeIsWap();
      window.addEventListener('resize', () => {
        this.judgeIsWap();
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.callCaptcha();
      });
    },
    methods: {
      // 手机适配
      judgeIsWap() {
        const uA = navigator.userAgent.toLowerCase();
        const ipad = uA.match(/ipad/i) == 'ipad';
        const iphone = uA.match(/iphone os/i) == 'iphone os';
        const midp = uA.match(/midp/i) == 'midp';
        const uc7 = uA.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
        const uc = uA.match(/ucweb/i) == 'ucweb';
        const android = uA.match(/android/i) == 'android';
        const windowsce = uA.match(/windows ce/i) == 'windows ce';
        const windowsmd = uA.match(/windows mobile/i) == 'windows mobile';
        if (!(ipad || iphone || midp || uc7 || uc || android || windowsce || windowsmd)) {
          // PC 端
        } else {
          // 移动端
          document.getElementById('app').style.minWidth = 'auto';
        }
      },
      handleFocus(key) {
        this[key] = true;
      },
      handleBlur(key) {
        this[key] = false;
      },
      openOther() {
        this.isOpenOther = !this.isOpenOther;
      },
      // 第三方登录
      thirdLogin(url) {
        window.location.href = `${process.env.VUE_APP_BIND_BASE_URL}${url}${process.env.VUE_APP_WEB_URL}`;
      },
      passWordType() {
        this.isPassWordType = !this.isPassWordType;
      },
      // 忘记密码
      forgetPassword() {
        this.$router.push({ path: '/forgetPassword' });
      },
      changeLogin(index) {
        this.isActive = parseInt(index);
        this.isActive === 1
          ? this.$refs['dynamicForm'].resetFields()
          : this.$refs['loginForm'].resetFields();
        this.mobileKey = '';
        this.showCaptcha = false;
        this.errorMsgShow = '';
        this.errorText = '';
        this.callCaptcha();
        if (index == 1) {
          // 去填写 账号登录，重置 账号登录 状态
          this.loginChecked = false;
          this.$refs.loginPrivacyCompliance && this.$refs.loginPrivacyCompliance.resetChecked();
        } else if (index == 2) {
          // 去填写 验证码登录，重置 账号登录 状态
          this.loginDynamicChecked = false;
          this.$refs.loginDynamicPrivacyCompliance &&
            this.$refs.loginDynamicPrivacyCompliance.resetChecked();
        }
      },
      getDyCode() {
        // 获取短信验证码
        if (this.checkMobile(this.dynamicForm.phoneNumber) && this.mobileKey) {
          this.$fetch(
            'sendCode',
            {
              type: 1,
              data: this.dynamicForm.phoneNumber,
              validate: this.mobileKey,
              scene_id: 7
            },
            {
              token: ''
            }
          ).then(() => {
            this.countDown();
          });
        }
      },
      // 账号登录
      loginAccount() {
        if (!this.loginChecked) {
          this.messageInfo('请先阅读并同意隐私政策及用户服务协议', 'warning');
          return;
        }
        this.$refs.loginForm.validate(valid => {
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
        if (!this.loginDynamicChecked) {
          this.messageInfo('请先阅读并同意隐私政策及用户服务协议', 'warning');
          return;
        }
        this.$refs.dynamicForm.validate(valid => {
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
        this.$fetch('loginCheck', { account: account, channel: 'B' }, { token: '' })
          .then(res => {
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
          })
          .catch(res => {
            this.$message({
              message: res.msg || `登录验证失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      getLoginKey() {
        return new Promise((resolove, reject) => {
          this.$fetch(
            'getLoginKey',
            {},
            {
              token: ''
            }
          ).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.loginKey = res.data;
            }
            resolove();
          });
        });
      },
      handleEncryptPassword(password) {
        let retPassword = '';
        // 新建JSEncrypt对象
        let encryptor = new JSEncrypt();
        // 设置公钥
        encryptor.setPublicKey(this.loginKey.public_key);
        // 加密数据
        retPassword = encryptor.encrypt(password);
        retPassword = retPassword.replace(/\+/g, '-').replace(/\//g, '_');
        while (retPassword[retPassword.length - 1] === '=') {
          retPassword = retPassword.substr(0, retPassword.length - 1);
        }
        return retPassword;
      },
      async login(params) {
        params = JSON.parse(JSON.stringify(params));
        params.captcha = this.mobileKey;
        params.remember = this.remember ? 1 : 0;
        if (this.isActive == 1) {
          await this.getLoginKey();
          params.password = this.handleEncryptPassword(params.password);
          params.uuid = this.loginKey.uuid;
        }
        let retParams = this.$params(params);
        this.$fetch(
          'loginInfo',
          {
            ...retParams
          },
          {
            token: '',
            credentials: true
          }
        )
          .then(res => {
            this.mobileKey = '';
            this.errorText = '';
            this.errorMsgShow = '';
            sessionOrLocal.set('token', res.data.token || '', 'localStorage');
            sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage');
            sessionOrLocal.set('tokenExpiredTime', res.data.exp_time || '', 'localStorage');
            // 存储控制台-channel_id频道
            sessionOrLocal.set('SAAS_V3_CHANNEL_ID', res.data.channel_id || '', 'localStorage');
            // 存储控制台-channel_id频道
            sessionOrLocal.set('SAAS_V3_SSO_TOKEN', res.data.sso_token || '', 'localStorage');
            // 用户登录完成后，用户ID写入Cookie
            Cookies.set('gray-id', res.data.user_id, { expires: 30 });
            // 登录完成后，获取当前用户的权限
            this.$fetch(
              'planFunctionGet',
              {},
              {
                'gray-id': res.data.user_id
              }
            )
              .then(vRes => {
                let permissions = vRes.data.permissions;
                if (permissions) {
                  // 设置全部权限
                  sessionOrLocal.set('SAAS_VS_PES', permissions, 'localStorage');
                  let isOld = localStorage.getItem('isOld');
                  if (getQueryString('form') && getQueryString('form') == 1) {
                    location.href = `${location.origin}${process.env.VUE_APP_WEB_KEY}?form=1`;
                    // this.$router.push({path: '/', query:{'form': 1}});
                  } else {
                    location.href = `${location.origin}${process.env.VUE_APP_WEB_KEY}`;
                    // this.$router.push({path: '/'});
                  }
                } else {
                  this.$message({
                    message: vRes.msg || `用户权限获取失败`,
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(vRes => {
                console.log(vRes);
                this.$message({
                  message: vRes.msg || `用户权限获取失败`,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          })
          .catch(res => {
            if (this.isActive == 1) {
              this.errorText = res.msg || '登录失败！';
            } else {
              this.errorMsgShow = res.msg || '登录失败！';
            }
            sessionOrLocal.set('token', '', 'localStorage');
            this.mobileKey = '';
            this.callCaptcha();
          });
      },
      // 注册判断手机号是否已经注册
      checkPhone() {
        if (this.checkMobile(this.registerForm.phone)) {
          this.$fetch(
            'loginCheck',
            { account: this.registerForm.phone, channel: 'B' },
            { token: '' }
          )
            .then(res => {
              if (res.data.account_exist) {
                // 清除密码验证
                try {
                  if (this.$refs.registerForm) {
                    this.$refs.registerForm.clearValidate('password');
                  }
                } catch (e) {}
                this.registerText = '该手机号已注册';
                this.isValidaregisterPhone = false;
              } else {
                this.registerText = '';
                this.isValidaregisterPhone = true;
                // 开启密码验证
                try {
                  if (this.$refs.registerForm) {
                    this.$refs.registerForm.validateField('password');
                  }
                } catch (e) {}
              }
            })
            .catch(res => {
              this.registerText = res.msg || '注册失败';
              // 清除密码验证
              try {
                if (this.$refs.registerForm) {
                  this.$refs.registerForm.clearValidate('password');
                }
              } catch (e) {}
            });
        }
      },
      getRegisterCode() {
        if (this.checkMobile(this.registerForm.phone) && this.mobileKey) {
          this.$fetch(
            'sendCode',
            {
              type: 1,
              data: this.registerForm.phone,
              validate: this.mobileKey,
              scene_id: 8
            },
            {
              token: ''
            }
          ).then(() => {
            this.countDown();
          });
        }
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      registerAccount() {
        if (!this.registerChecked) {
          this.messageInfo('请先阅读并同意隐私政策及用户服务协议', 'warning');
          return;
        }
        if (!this.registerText) {
          this.$refs.registerForm.validate(async valid => {
            if (valid) {
              let params = JSON.parse(JSON.stringify(this.registerForm));
              await this.getLoginKey();
              params.password = this.handleEncryptPassword(params.password);
              params.captcha = this.mobileKey;
              params.source = this.$route.query.source || 1;
              params.uuid = this.loginKey.uuid;
              this.$fetch('register', params, {
                token: ''
              })
                .then(res => {
                  this.$message({
                    message: `注册成功`,
                    showClose: true,
                    // duration: 0,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                  this.mobileKey = '';
                  setTimeout(() => {
                    this.$router.push({ path: '/login' });
                  }, 1000);
                })
                .catch(res => {
                  console.log(res);
                  this.callCaptcha();
                  this.mobileKey = '';
                  this.registerText = res.msg || '注册失败';
                });
            } else {
              return false;
            }
          });
        }
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
          element: `#${this.$route.path === '/login' ? 'loginCaptcha' : 'registerCaptcha'}`,
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
              /*// 开启密码验证
            try {
              if (that.$refs.registerForm) {
                that.$refs.registerForm.validateField('password');
              }
            } catch(e) {}*/
            } else {
              that.loginForm.captcha = '';
              that.dynamicForm.captcha = '';
              that.errorMsgShow = '图形验证码错误';
              that.errorText = '图形验证码错误';
              // 清除密码验证
              try {
                if (that.$refs.registerForm) {
                  that.$refs.registerForm.clearValidate('password');
                }
              } catch (e) {}
              that.registerText = '图形验证码错误';
            }
          },
          onload(instance) {
            console.log('onload', instance);
            that.captcha = instance;
          }
        });
      },
      /* 隐私合规选择结果标记 */
      checkResult(obj) {
        this[`${['login', 'login_normal'].includes(obj.scene) ? 'login' : obj.scene}Checked`] =
          obj.checked;
      },
      toRegister() {
        this.registerChecked = false;
        this.$refs.registerPrivacyCompliance && this.$refs.registerPrivacyCompliance.resetChecked();
        this.$router.push({ path: '/register' });
      }
    }
  };
</script>
<style lang="less" scoped>
  .wapper {
    width: 100%;
    height: 100%;
    min-height: 800px;
    background-color: #fff;
    position: relative;
    font-family: '-apple-system', 'BlinkMacSystemFon', 'Helvetica Neue', Helvetica, 'PingFang SC',
      'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif !important;
    /deep/ .el-input__clear {
      height: 17px;
      line-height: 17px;
      vertical-align: middle;
    }

    /deep/ .el-input .el-input__suffix {
      display: flex;
      align-items: center;
      .closePwd {
        width: 25px;
        display: inline-block;
      }
    }
  }

  .left {
    width: 50%;
    height: 100%;
    overflow: hidden;
    /*  background: linear-gradient(180deg,#22d28f,#00ab92); */
    background: url('../../common/images/login/login-bg.png') no-repeat 100% 100%;
    background-image: -webkit-linear-gradient(-45deg, #ff6b3b, #e8302f);
    position: relative;
  }

  .left .logo {
    display: block;
    position: absolute;
    top: 40px;
    left: 40px;
    width: 120px;
    z-index: 1;
  }

  .left .content {
    position: absolute;
    top: 28%;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
  }
  .left p {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    line-height: 32px;
    letter-spacing: 2px;
  }
  .left .bg {
    display: block;
    width: 56%;
    margin: 65px auto 0;
  }

  .right {
    width: 50%;
    height: 100%;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-box {
    width: 340px;
  }

  .login-box h3 {
    font-size: 32px;
    font-weight: 400;
    color: #333333;
    line-height: 45px;
  }

  .login-box .phone-wapper,
  .login-box .user-wapper {
    height: 299px;
  }

  .user-wapper .login-btn {
    margin-top: 8px;
  }

  .login-box .tab {
    margin-top: 40px;
    font-weight: 400;
  }

  .login-box .tab:before {
    content: '';
    height: 100%;
    vertical-align: middle;
    display: inline-block;
  }

  .login-box .tab span {
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    font-size: 22px;
    font-weight: 400;
    color: #666666;
    line-height: 30px;
  }

  .login-box .tab span.active {
    color: #fb3a32;
  }

  .login-box .tab em {
    margin: 0 10px;
    font-size: 16px;
    color: #333333;
    vertical-align: middle;
    display: inline-block;
  }

  .login-box #captcha {
    margin-top: 30px;
  }

  /deep/.el-form-item {
    width: 340px;
    position: relative;
    margin-top: 24px;
    margin-bottom: 0;
    &.phone-box {
      margin-top: 46px;
    }
    &.code {
      margin-top: 27px;
    }
    &#captcha-box {
      margin-top: 36px;
    }
    &.password {
      margin-top: 39px;
      margin-bottom: 24px;
    }
    &.loginUsername {
      margin-top: 33px;
    }
    &.loginPassword {
      margin-top: 33px;
    }
    .el-form-item__content {
      line-height: 1;
    }
    .closePwd {
      cursor: pointer;
      line-height: 32px;
    }
    input {
      width: 100%;
      height: 32px;
      line-height: 32px;
      border: none;
      outline-style: none;
      font-size: 16px;
      font-weight: 400;
      color: #1a1a1a;
      background-color: transparent;
      border-bottom: 1px solid #cccccc;
      border-radius: unset;
      padding: 0 0;
      &:hover {
        border-bottom-color: #666;
      }
      &:active {
        color: #1a1a1a;
        border-color: #666;
      }
    }
    input::-webkit-input-placeholder {
      font-size: 16px;
      color: #999999;
    }
    input:-ms-input-placeholder,
    input::-ms-input-placeholder {
      font-size: 16px;
      color: #999999;
    }
    input::placeholder {
      font-size: 16px;
      color: #999999;
    }
    &.auto-login {
      font-size: 13px;
      color: #999;
      margin-top: 20px;
      /deep/.el-checkbox__label {
        display: inline-block;
        padding-left: 5px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        vertical-align: top;
        a {
          color: #4da1ff;
        }
      }
      span.forget {
        float: right;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        cursor: pointer;
        &:hover {
          color: #1a1a1a;
        }
      }
      span.toLogin {
        float: right;
        font-size: 12px;
        font-weight: 400;
        color: #4da1ff;
        line-height: 17px;
        cursor: pointer;
      }
    }
    &.register-checked {
      text-align: center;
      margin-top: 16px;
      span.toLogin {
        float: unset;
        color: #3562fa;
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
      .yidun.yidun--light {
        .yidun_feedback {
          background-position: 0px -240px;
          height: 30px;
        }
        .yidun_refresh {
          background-position: 0px -339px;
        }
      }
    }
  }
  .form-items {
    .login-btn {
      .el-button {
        margin-top: 0px;
        padding-top: 11px;
        padding-bottom: 11px;
        border-radius: 22px;
      }
    }
    .itemLable {
      color: #999999;
      font-size: 12px;
      position: absolute;
      top: 0;
      opacity: 0;
      transition: all 0.5s;
      -webkit-transition: all 0.5s;
      &.active {
        opacity: 1;
        top: -14px;
      }
    }
  }
  .submit {
    margin-top: 16px;
    width: 340px;
    border-radius: 4px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    &.top {
      margin-top: 24px;
    }
  }

  .login-just {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
    text-align: center;
    margin-top: 16px;
    span {
      color: #3562fa;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .login-other {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    text-align: center;
    margin-top: 36px;
    span {
      cursor: pointer;
    }
    &.inline {
      display: flex;
      align-items: center;
      justify-content: center;
      .other-img {
        margin-top: 0;
        margin-left: 16px;
        img {
          &:first-child {
            margin-right: 16px;
          }
        }
        span {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          width: 24px;
          height: 24px;
          cursor: pointer;
          &:first-child {
            margin-right: 16px;
          }
        }
        span.third__login__qq {
          background: url('./images/qq@2x.png') center center no-repeat;
          background-size: 100% 100%;
          margin-right: 16px;
          &:hover {
            background: url('./images/qq_hover@2x.png') center center no-repeat;
            background-size: 100% 100%;
          }
        }
        span.third__login__wechat {
          background: url('./images/wechat@2x.png') center center no-repeat;
          background-size: 100% 100%;
          &:hover {
            background: url('./images/wechat_hover@2x.png') center center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }

  .other-img {
    margin-top: 16px;
    transition: height 0.5s;
    overflow: hidden;
    height: 26px;
    line-height: 26px;
    img {
      width: 24px;
      height: 24px;
      cursor: pointer;
      &:first-child {
        margin-right: 8px;
      }
    }
    &.noVisible {
      height: 0px;
    }
  }

  .login-box .ipt-box .pwd-btn {
    width: 90px;
    height: 34px;
    border-radius: 2px;
    background-color: #dedede;
    text-align: center;
    line-height: 34px;
    font-size: 13px;
    color: #fff;
    position: absolute;
    right: 0;
    bottom: 3px;
  }

  .login-box .ipt-box .pwd-btn.active {
    background-color: #52cc90;
    cursor: pointer;
  }

  .login-box .ipt-box .mu-text-field-focus-line {
    margin: 0;
    height: 2px;
    border: none;
    background-color: #52cc90;
    position: absolute;
    left: 0;
    right: 0;
    margin-top: -1px;
    transform: scaleX(0);
    transition: 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .login-box .ipt-box .mu-text-field-focus-line.focus {
    transform: scaleX(1);
  }

  .login-box .ipt-box .iconfont {
    position: absolute;
    right: 0;
    bottom: 5px;
    color: #d1d1d1;
    font-size: 18px;
    cursor: pointer;
  }

  .login-box .goregister {
    margin-top: 10px;
  }

  .login-box .goregister a {
    float: left;
    font-size: 14px;
    color: #52cc90;
  }
  @media screen and (max-width: 1200px) {
    .left {
      display: none;
    }

    .right {
      width: 100%;
    }
  }

  .phone-wapper {
    #loginCaptcha {
      margin-bottom: 8px;
    }
    .login-btn {
      margin-top: 32px;
    }
  }

  /deep/.el-input-group__append {
    border: 0;
    position: absolute;
    bottom: 3px;
    right: 0;
    span {
      border: 0;
      position: absolute;
      bottom: 3px;
      right: 0;
      width: 103px;
      background: #f2f2f2;
      border-radius: 2px;
      font-size: 13px;
      font-weight: 400;
      color: #222222;
      padding: 8px 0;
      line-height: 18px;
      text-align: center;
      cursor: not-allowed;
      &.isLoginActive {
        background: #fb3a32;
        border-radius: 2px;
        color: #ffffff;
        cursor: pointer;
      }
      &.isSend {
        background: #f2f2f2;
        color: #222222;
      }
    }
  }
  .errorText {
    line-height: 20px;
    color: #fc5659;
    font-size: 12px;
    position: absolute;
    i {
      color: #fc5659;
      padding-right: 5px;
    }
  }
  /deep/.el-checkbox__label {
    padding-left: 8px !important;
  }
</style>
