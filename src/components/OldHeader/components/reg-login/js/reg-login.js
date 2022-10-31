import { JSEncrypt } from 'jsencrypt'
import { sessionOrLocal } from '@/utils/utils';
import regRule from '@/utils/reg-rule';
import PwdInput from '../../pwd-input.vue'
import {v1 as uuidV1} from "uuid";
export default {
  name: 'RegLogin',
  components: {
    PwdInput
  },
  props: {
    gray_id: {
      require: false,
      default: null
    }
  },
  data() {
    const validAccount = (rule, value, callback) => {
      console.log(rule)
      this.accError = value === ''
      if (value === '') {
        callback(new Error('请输入手机号/邮箱'))
      } else {
        callback()
      }
    }
    const validPwd = (rule, value, callback) => {
      this.mailError = value === '' || !pattern.exec(value)
      if (value === '') {
        callback(new Error('请输入登录密码'))
      } else if (!regRule['pwd'].exec(value)) {
        callback(new Error('账号密码错误'))
      } else {
        callback()
      }
    }
    const validRegPwd = (rule, value, callback) => {
      if (value === '') {
        callback() // 允许为空
      } else if (!regRule['pwd'].exec(value)) {
        callback(new Error('请设置登录密码（6-30位字符）'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      this.phoneError = value === '' || !(/^1[0-9]{10}$/.test(value))
      this.isShowPhoneErr = value === '' || !(/^1[0-9]{10}$/.test(value))
      if (value === '') {
        this.buttonControl = 'disabled' // 验证失败，禁用
        callback(new Error('请输入手机号'))
      } else {
        if (!(/^1[0-9]{10}$/.test(value))) {
          this.buttonControl = 'disabled' // 验证失败，禁用
          callback(new Error('请输入正确的手机号'))
        } else {
          if (this.phoneKey) {
            this.buttonControl = 'start' // 验证成功，启用
          } else {
            this.buttonControl = 'disabled'
          }
          callback()
        }
      }
    }
    const validateRegPhone = async (rule, value, callback) => {
      this.regPhoneFlag = value === '' || !(/^1[0-9]{10}$/.test(value))
      if (value === '') {
        this.regBtnControl = 'disabled' // 验证失败，禁用
        this.isShowRegPhoneErr = true
        callback(new Error('请输入手机号'))
      } else {
        if (!(/^1[0-9]{10}$/.test(value))) {
          this.regBtnControl = 'disabled' // 验证失败，禁用
          this.isShowRegPhoneErr = true
          callback(new Error('请输入正确的手机号'))
        } else {
          try {
            const result = await this.$fetch('loginCheck', {account: this.regForm.phone, channel: 'C'}, {
              'gray_id': this.gray_id
            })
            if (result && result.code === 200) {
              // 检测结果：check_result 0账号未锁定 1账号锁定; account_exist 账号是否存在：1存在 0不存在
              if (result.data.account_exist > 0) {
                this.regPhoneFlag = true
                this.regBtnControl = 'disabled'
                this.isShowRegPhoneErr = true
                callback(new Error('该手机号已注册'))
              } else {
                this.isShowRegPhoneErr = false
                if (this.phoneKey) {
                  this.regPhoneFlag = false
                  this.regBtnControl = 'start' // 验证成功，启用
                } else {
                  this.regPhoneFlag = true
                  this.regBtnControl = 'disabled'
                }
                callback()
              }
            }
          } catch (e) {
            console.log(e)
            callback()
          }
        }
      }
    }
    const validateCaptchas = (rule, value, callback) => {
      this.captchaError = value === ''
      if (value === '') {
        callback(new Error('请输入动态验证码'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      tag: 2, // 1 - 账号登录；2 - 快捷登录；3 - 注册；
      ruleForm: {
        username: '',
        password: '',
        usernames: '',
        captchas: ''
      },
      ruleFormRules: {
        username: [
          { required: true, validator: validAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validPwd, trigger: 'blur' }
        ],
        usernames: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        captchas: [
          { required: true, validator: validateCaptchas, trigger: 'blur' }
        ]
      },
      accError: false, // 登录1 - 注册是否验证失败
      mailError: false, // 密码是否验证失败
      captchaError: false, // 登录2 - 动态验证码
      loginErrMsg: '', // 登录 - 错误的提示
      typeControl: true, // 云链账号页
      cap: null, // 云盾本身
      key: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      photoCpathaShow: false, // 登录的图片验证码的展示
      buttonControl: 'disabled', // 按钮的置灰 disabled - 禁用；start - 待发送；pending - 发送中
      loginPwdShow: true, // 登录-密码框的显示
      accountChecked: false, // 账户的自动登录
      qqPath: '',
      wxPath: '',
      smsLoginErrMsg: '', // 登录 - 动态验证码
      sendLoginMsgDisabled: false, // 登录 - 是否是发送验证码
      time: 60,
      codeError: false, // 短信码是否验证失败
      regForm: {
        agree: 1,
        phone: '',
        code: '',
        password: ''
      },
      regFormRules: {
        phone: [
          { validator: validateRegPhone, trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validateCaptchas, trigger: 'blur' }
        ],
        password: [
          { required: false, validator: validRegPwd, trigger: 'blur' }
        ]
      },
      regTime: 60,
      regErrMsg: '', // 注册 - 错误的提示
      regPwdShow: true, // 注册 - 密码框的显示
      regBtnControl: 'disabled', // 注册 - 按钮的置灰 disabled - 禁用；start - 待发送；pending - 发送中
      isShowRegPhoneErr: false, // 注册 - 无图片验证码情况下，确认手机号是否展示通过
      smsRegErrMsg: '', // 注册-动态验证码
      sendRegMsgDisabled: false, // 注册 - 是否是发送验证码
      regPhoneErr: '', // 注册 - 手机号提示文字
      checked: false, // 注册 - 是否同意协议， 默认不勾选
      phoneError: true, // 登录 - 手机号验证是否Ok true 表示有异常
      regPhoneFlag: true, // 注册 - 手机号验证是否Ok true 表示有异常
      isShowPhoneErr: false,
      isPasswordFocus: false,
      isLoginPwdFocus: false
    }
  },
  computed: {
    forgetUrl() {
      return `${process.env.VUE_APP_WAP_WATCH}/forgetPwd`
    }
  },
  created() {
    // 创建
    this.ruleForm.password = ''
    this.regForm.password = ''
  },
  mounted() {
    // 实施
    this.handleBindPath()
  },
  methods: {
    handleFocus(key) {
      this[key] = true
    },
    handleBlur(key) {
      this[key] = false
    },
    passWordType() {
      this.regPwdShow = !this.regPwdShow
    },
    loginPwdType() {
      this.loginPwdShow = !this.loginPwdShow
    },
    // 切换 账号登录 or 手机登录
    changeTagHandler(type) {
      this.tag = type
      this.resetForm() // 表单重置
    },
    // 表单面板重置
    resetForm() {
      this.loginErrMsg = ''
      this.smsLoginErrMsg = ''
      this.smsRegErrMsg = ''
      this.phoneKey = ''
      if (this.tag == 3) { // 注册
        this.regPhoneFlag = false
        this.smsRegErrMsg = ''
        this.regForm.code = ''
        // 注册
        this.callCaptcha('#regCaptcha')
        if (this.regTimer) {
          clearInterval(this.regTimer)
          this.regTimer = null
        }
        this.$nextTick(function() {
          this.sendRegMsgDisabled = false
          this.regBtnControl = 'disabled'
          if (this.$refs.regForm) {
            this.$refs.regForm.resetFields()
          }
        })
      } else if (this.tag == 2) { // 快捷
        this.isShowPhoneErr = ''
        this.captchaError = ''
        // 手机号登录
        this.bottomLoginInfo = false
        this.smsErrorMessage = ''
        this.callCaptcha('#captcha')
        if (this.timeinterval) {
          clearInterval(this.timeinterval)
          this.timeinterval = null
        }
        this.$nextTick(function() {
          this.buttonControl = 'disabled'
          this.sendLoginMsgDisabled = false
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
          }
        })
      } else { // 普通
        this.accError = ''
        this.photoCpathaShow = false
        this.loginErrMsg = ''
        this.mailError = ''
        // 上为切换时，间距还原
        this.bottomLoginInfo = true
        this.errorMessage = ''
        this.smsErrorMessage = ''
        this.$nextTick(function() {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
          }
        })
      }
    },
    // 关闭账号登录面板
    closeDialogHandler() {
      this.tag = 2  // 默认快捷登录展示在第一位
      this.resetForm() // 表单重置
    },
    // 校验登录次数 - 专题登录
    checkLoginAccount() {
      this.$fetch('loginCheckC', {
        account: this.ruleForm.username,
        channel: 'C'
      }, {
        token: '',
        platform: 7,
        'gray-id': this.gray_id
      }).then(res => {
        if (res.data.check_result == 1) { // 账号被锁定 再次登录需要图片验证
          this.photoCpathaShow = true
          this.callCaptcha('#photoCaptcha')
          if (this.phoneKey) {
            this.loginErrMsg = ''
            this.loginClick()
          }
        } else {
          this.loginErrMsg = ''
          this.loginClick()
        }
      })
    },
    getLoginKey() {
      return new Promise((resolove, reject) => {
        this.$fetch('getLoginKey', {}, {
          token: '',
          platform: 7,
          'gray-id': this.gray_id
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.loginKey = res.data
          }
          resolove()
        })
      })
    },
    handleEncryptPassword(password) {
      let retPassword = ''
      // 新建JSEncrypt对象
      let encryptor = new JSEncrypt();
      // 设置公钥
      encryptor.setPublicKey(this.loginKey.public_key);
      // 加密数据
      retPassword = encryptor.encrypt(password)
      retPassword = retPassword.replace(/\+/g, '-').replace(/\//g, '_')
      while(retPassword[retPassword.length - 1] === '=') {
        retPassword = retPassword.substr(0,retPassword.length-1)
      }
      return retPassword
    },
    // 超过登录次数 唤起图片验证码
    callCaptcha(element) {
      const that = this
      window.initNECaptcha({
        captchaId: this.key,
        element: element,
        mode: 'float',
        width: 270,
        onReady(instance) {
          console.log('instance', instance)
        },
        onVerify(err, data) {
          console.log(err)
          if (data) {
            that.phoneKey = data.validate
            that.loginErrMsg = ''
            if (element == '#captcha') { // 快捷登录 释放获取验证码按钮
              that.buttonControl = that.phoneError ? 'disabled' : 'start' // 验证失败，禁用
            } else if (element == '#regCaptcha') { // 注册 释放获取验证码按钮
              that.$nextTick(() => {
                that.regForm.text = data.validate
                that.regErrMsg = ''
                if (!that.isShowRegPhoneErr && that.phoneKey) {
                  // 手机号验证通过 且有图形验证码
                  that.regBtnControl = 'start'
                } else {
                  // 手机号验证未通过 或无图形验证码
                  that.regBtnControl = 'disabled'
                }
                // that.regBtnControl = that.regPhoneFlag ? 'disabled' : 'start' // 验证失败，禁用
              })
            }
          } else {
            if (element == '#regCaptcha') {
              // 注册Key
              that.regErrMsg = '图形码未验证通过'
            } else {
              that.loginErrMsg = '图形码未验证通过'
            }
          }
        },
        onload(instance) {
          console.log('load...', instance)
          if (element == '#regCaptcha') {
            // 注册Key
            that.regErrMsg = '图形码未验证通过'
          } else {
            that.loginErrMsg = '图形码未验证通过'
          }
        }
      })
    },
    // 账号登录
    loginClick() {
      // if (!this.checkLoginClick()) return
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.photoCpathaShow && !this.phoneKey) {
            this.loginErrMsg = '请输入图形验证码'
            return
          }
          await this.getLoginKey()
          const retPassword = this.handleEncryptPassword(this.ruleForm.password)
          const params = {
            way: 1,  // 1=账号密码登录=密码登录|2=手机号验证码登录=验证码登录|3=ssotoken登录
            account: this.ruleForm.username,
            password: retPassword,
            captcha: this.phoneKey,
            visitor_id: this.visitor_id,
            uuid: this.loginKey.uuid
          }
          if (this.accountChecked) {
            params.remember = 1
          }
          this.$fetch('loginInfoC', params, {
            token: '',
            platform: 7,
            'gray-id': this.gray_id
          }).then(res => {
            if (res.code == 200) {
              this.loginErrMsg = ''
              this.phoneKey = ''
              this.setUserInfo(res)
              this.fetchUserData()
            } else {
              this.$message({
                message: res.msg,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              })
              // 图片验证码重置
              this.callCaptcha('#photoCaptcha')
            }
          }).catch(e => {
            console.error(e)
            this.$message({
              message: e.msg,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            })
            if (e && e.code == 512042) {
              this.callCaptcha('#photoCaptcha')
            }
            if (e && e.captcha[0] == '图形码未验证通过') {
              this.loginErrMsg = '图形码未验证通过'
            }
          })
        }
      })
    },
    setUserInfo(res) {
      if (res && res.code == 200 && res.data) {
        // 存储用户Token信息
        sessionOrLocal.set('vhsaas_token', res.data.token || '', 'localStorage')
        sessionOrLocal.set('vhsaas_userId', res.data.user_id || '')
        sessionOrLocal.set('vhsaas_loginUUid', res.data.user_id || '')
        sessionOrLocal.set('vhsaas_tokenExpiredTime', res.data.exp_time || '', 'localStorage')
        sessionOrLocal.set('vhsaas_tokenRefresh', new Date().getTime(), 'localStorage')
      }
    },
    // 获取用户信息
    fetchUserData() {
      this.$fetch('getInfoC', {
        scene_id: 2
      }, {
         token: sessionOrLocal.get('vhsaas_token', 'localStorage') || '',
         platform: 7,
         'request-id': uuidV1(),
         'gray-id': this.gray_id
      }).then(res => {
        sessionOrLocal.set('vhsaas_userInfo', res.data || '', 'localStorage')
        // 关闭当前弹出框，更新状态
        this.dialogVisible = false
        // 登录成功，事件派发
        this.$EventBus.$emit('saas_vs_login_success', res.data);
      }).catch(e => {
        console.log(e)
        this.setUserInfo(null)
      })
    },
    // 校验账号登录
    checkLoginClick() {
      if (!this.ruleForm.username) {
        this.loginErrMsg = '请输入您的手机号或邮箱'
        return false
      } else if (!this.ruleForm.password) {
        this.loginErrMsg = '请输入您的账号密码'
        return false
      } else if (this.photoCpathaShow && !this.phoneKey) {
        this.loginErrMsg = '请输入图形验证码'
        return false
      }
      return true
    },
    // 快捷登录 获取动态验证码
    getCaptha() {
      if (this.buttonControl === 'disabled' || this.buttonControl === 'pending') {
        return
      }
      const mobileReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!this.ruleForm.usernames) {
        this.smsLoginErrMsg = '请输入您的手机号'
        // 清空表单验证码错误提示
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate(['captchas'])
        })
        return
      } else if (!mobileReg.test(this.ruleForm.usernames)) {
        this.smsLoginErrMsg = '手机号格式不正确'
        // 清空表单验证码错误提示
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate(['captchas'])
        })
        return
      }
      this.$fetch('sendCodeC', {
        type: 1,
        data: this.ruleForm.usernames,
        validate: this.phoneKey,
        scene_id: 7
      }, {
        token: '',
        platform: 7,
        'gray-id': this.gray_id
      }).then(res => {
        console.log(res)
        this.buttonControl = 'pending'
        this.sendLoginMsgDisabled = true
        if (this.timeinterval) {
          clearInterval(this.timeinterval)
          this.timeinterval = null
        }
        this.timeinterval = setInterval(() => {
          if (this.time > 0) {
            this.time--
          } else {
            if (this.timeinterval) {
              clearInterval(this.timeinterval)
              this.timeinterval = null
            }
            this.sendLoginMsgDisabled = false
            this.time = 60
            this.buttonControl = 'start'
          }
        }, 1000)
      })
    },
    // 快捷登录
    telLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$fetch('loginInfoC', {
            way: 2,  // 1=账号密码登录=密码登录|2=手机号验证码登录=验证码登录|3=ssotoken登录
            phone: this.ruleForm.usernames,
            dynamic_code: this.ruleForm.captchas,
            visitor_id: this.visitor_id
          }, {
            token: '',
            platform: 7,
            'gray-id': this.gray_id
          }).then(res => {
            if (res.code == 200) {
              this.phoneKey = ''
              this.smsLoginErrMsg = ''
              this.setUserInfo(res)
              this.fetchUserData()
            } else {
              this.$message({
                message: res.msg,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              })
              // 图片验证码重置
              this.callCaptcha('#captcha')
            }
          }).catch(e => {
            this.$message({
              message: e.msg || '登录失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            })
            // 图片验证码重置
            this.callCaptcha('#captcha')
          })
        }
      })
    },
    // 注册 获取验证码
    getRegCaptha() {
      if (this.regBtnControl === 'disabled' || this.regBtnControl === 'pending') {
        return
      }
      const mobileReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!this.regForm.phone) {
        this.smsRegErrMsg = '请输入您的手机号'
        return
      } else if (!mobileReg.test(this.regForm.phone)) {
        this.smsRegErrMsg = '手机号格式不正确'
        return
      } else {
        this.smsRegErrMsg = ''
      }
      if (this.regTimer) {
        clearInterval(this.regTimer)
        this.regTimer = null
      }
      if (!this.regTimer) {
        this.$fetch('sendCodeC', {
          type: 1,
          data: this.regForm.phone,
          validate: this.phoneKey,
          scene_id: 8
        }, {
          token: '',
          platform: 7,
          'gray-id': this.gray_id
        }).then(res => {
          console.log(res)
          this.regBtnControl = 'pending'
          this.sendRegMsgDisabled = true
          if (this.regTimer) {
            clearInterval(this.regTimer)
            this.regTimer = null
          }
          this.regTimer = setInterval(() => {
            if (this.regTime > 0) {
              this.regTime--
            } else {
              if (this.regTimer) {
                clearInterval(this.regTimer)
                this.regTimer = null
              }
              this.sendRegMsgDisabled = false
              this.regTime = 60
              this.regBtnControl = 'start'
            }
          }, 1000)
        })
      }
    },
    registerHandler() {
      if (!this.checked) {
        this.$message({
          message: this.$t('请先勾选协议'),
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        })
        return
      }
      this.regForm.captcha = this.phoneKey
      this.regForm.source = 2 // this.$route.query.source || 2
      this.$refs.regForm.validate(async (valid) => {
        if (valid) {
          await this.getLoginKey()
          const retPassword = this.handleEncryptPassword(this.regForm.password)
          this.$fetch('registerC', {
            ...this.regForm,
            password: retPassword,
            uuid: this.loginKey.uuid
          }, {
            token: '',
            'gray-id': this.gray_id
          }).then(res => {
            if (res && res.code === 200) {
              this.regPhoneErr = ''
              this.$message({
                message: this.$t('注册成功'),
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              })
              this.changeTagHandler(2) // 切换至登录, 默认快捷登录
            } else {
              this.$message({
                message: res.msg || this.$t('注册失败'),
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              })
              this.regPhoneErr = res.msg || '注册失败'
              // 图片验证码重置
              this.callCaptcha('#regCaptcha')
            }
          }).catch(e => {
            console.log(e)
	          this.$message({
                message: e.msg || this.$t('注册失败'),
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              })
            // 图片验证码重置
            this.callCaptcha('#regCaptcha')
          })
        }
      })
    },
    // 获取路径参数
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      return r != null ? unescape(r[2]) : null
    },
    // 初始化第三方链接
    handleBindPath() {
      const hostPath = process.env.VUE_APP_BIND_BASE_URL + process.env.VUE_APP_WEB_KEY
      // 前端回传地址
      const specialId = this.getQueryString('id')
      const delay = this.getQueryString('delay')
      const jumpUrlPath = `${process.env.VUE_APP_WAP_WATCH}/cMiddle/${specialId}${delay ? '?delay=' + delay : ''}`
      console.log('jumpUrlPath', jumpUrlPath)
      // 第三方登录地址
      this.wxPath = `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/weixin?source=pc&jump_url=${encodeURIComponent(jumpUrlPath)}`
      this.qqPath = `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/qq?jump_url=${encodeURIComponent(jumpUrlPath)}`
    }
  },
  destroyed() {
    // 死亡
  }
}
