<template>
  <VhallDialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="480px">
    <div class="content">
      <el-form :model="form" ref="form" :rules="formRules" label-width="120px">
        <p class="info" v-show="showVo.step === 1">{{showVo.executeType === 'pwd' ? pwdTitle : showVo.executeType === 'phone' ? phoneTitle : emailTitle}}</p>
        <el-form-item label="邮箱地址" key="email" prop="email" v-if="showVo.executeType === 'email' && showVo.step === 1">
          <el-input v-model.trim="form.email" auto-complete="off" placeholder="请输入邮箱地址" disabled/>
        </el-form-item>
        <el-form-item label="手机号" key="phone" prop="phone" v-if="showVo.executeType !== 'email' && showVo.step === 1">
          <el-input v-model.trim="form.phone" auto-complete="off" placeholder="请输入手机号" disabled/>
        </el-form-item>
        <el-form-item label="图形码" v-show="showVo.step === 1 && showVo.executeType !== 'email'">
          <div id="setCaptcha">
            <el-input  v-model.trim="form.imgCode"> </el-input>
          </div>
          <p class="errorText" v-show="errorMsgShow">图形码错误</p>
        </el-form-item>
        <el-form-item label="验证码" key="code"  prop="code" v-if="showVo.step === 1">
          <el-input v-model.trim="form.code" auto-complete="off" placeholder="请输入验证码">
            <el-button class="no-border" size="mini" slot="append" @click="getDyCode('phone')"
                       :class="showCaptcha ? 'isLoginActive' : ''"
                       :disabled="isDisabledClick">
              {{ time === 10 ? '发送验证码' : `${time}s` }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="1邮箱地址" key="new_email"  prop="new_email" v-if="showVo.executeType === 'email' && (showVo.step === 2 || showVo.is_null)">
          <el-input v-model.trim="form.new_email" auto-complete="off" placeholder="请输入邮箱地址"/>
        </el-form-item>
        <el-form-item label="1手机号" key="new_phone"  prop="new_phone" v-if="showVo.executeType === 'phone' && (showVo.step === 2 || showVo.is_null)">
          <el-input v-model.trim="form.new_phone" auto-complete="off" placeholder="请输入邮箱地址"/>
        </el-form-item>
        <el-form-item label="图形码" v-if="showVo.executeType === 'phone' && (showVo.step === 2 || showVo.is_null)">
          <div id="setCaptcha1">
            <el-input  v-model.trim="form.imgCode1"> </el-input>
          </div>
          <p class="errorText" v-show="errorMsgShow1">图形码错误</p>
        </el-form-item>
        <el-form-item label="1验证码"  key="new_code"  prop="new_code" v-if="showVo.executeType !== 'pwd' && (showVo.step === 2 || showVo.is_null)">
          <el-input v-model.trim="form.new_code" auto-complete="off" placeholder="请输入验证码">
            <el-button class="no-border" size="mini" slot="append" @click="getDyCode2()" :class="showCaptcha1 ? 'isLoginActive' : ''" :disabled="isDisabledClick1">{{ time1 === 60 ? '发送验证码' : `${time1}s` }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="原密码"  key="old_pwd"  prop="old_pwd" v-if="showVo.executeType === 'pwd' && showVo.step === 2 && !showVo.is_null">
          <el-input v-model.trim="form.old_pwd" auto-complete="off" placeholder="输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码"  key="pasword"  prop="password" v-if="showVo.executeType === 'pwd' && showVo.step === 2">
          <el-input v-model.trim="form.password" auto-complete="off" placeholder="输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再输一次"  key="new_password"  prop="new_password" v-if="showVo.executeType === 'pwd' && showVo.step === 2">
          <el-input v-model.trim="form.new_password" auto-complete="off" placeholder="再输入一次"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button class="dialog-btn" type="primary" round size="medium" v-if="showVo.executeType !== 'pwd' && showVo.step === 1" @click="changePhoneOrEmailStep">下一步1</el-button>
      <el-button class="dialog-btn" type="primary" round size="medium" v-if="showVo.executeType === 'pwd'" @click="changePwdStep">确定2</el-button>
      <el-button class="dialog-btn" round size="medium" v-if="showVo.executeType === 'pwd'" @click="cancelPwdStep">取消3</el-button>
      <el-button class="dialog-btn" type="primary" round size="medium" v-if="showVo.executeType !== 'pwd' && showVo.step === 2" @click="sendBindHandle">立即绑定4</el-button>
    </span>
  </VhallDialog>
</template>

<script>
export default {
  name: "validSetDialog.vue",
  data() {
    let verifyEnterPwd = (rule, value, callback) => {
      let pattern = /^([0-9a-zA-Z_`!~@#$%^*+=,.?;'":)(}{/\\|<>&[-]|]){6,30}$/;
      if (value === '') {
        callback(new Error('请输入密码！'));
      } else if (!pattern.exec(value)) {
        callback(new Error('6-30位不包含空格及特殊符号的密码！'));
      } else {
        callback();
      }
    };
    let verifyAgainEnterPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'));
        // this.isReset = true;
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致！'));
        // this.isReset = true;
      } else {
        callback();
        // this.isReset = false;
      }
    };
    return {
      pwdTitle: "为了保证您的账号安全，修改密码请先验证绑定的手机号,验证成功后进行下一步操作",
      phoneTitle: '为了保证您的账号安全，修改手机号前请先验证已绑定的手机号',
      emailTitle: '为了保证您的账号安全，修改邮箱前请先验证已绑定的邮箱',
      showVo: {
        executeType: null, //当前弹出层类型
        step: null, // 当前步骤
        is_null: true // true表示未设置过
      },
      visible: false,
      validate: {
        type: 1, // 发送类型： 1手机；2邮箱
        data: null,// 根据type值不同 分别传手机号、邮箱
        validate: null,// 图形验证码数据
        scene_id: null// 1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-验证码
      },
      form: {
        old_pwd: null,
        password: null, // 目标-密码
        new_password: null,
        email: null,
        new_email: null, // 目标-邮箱
        phone: null,
        new_phone: null, // 目标-手机号
        code: null,
        new_code: null, // 目标-验证码
        imgCode: null,
        imgCode1: null
      },
      formRules: {
        password: [
          {required: true, trigger: 'blur', validator: verifyEnterPwd, min: 6, max: 30,}
        ],
        new_password: [
          {required: true, trigger: 'blur', validator: verifyAgainEnterPwd, min: 6, max: 30,}
        ],
        phone: [
          {required: true, min: 6, max: 30, pattern: /^1[0-9]{10}$/, message: '请输入手机号', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        new_phone: [
          {required: true, min: 6, max: 30, pattern: /^1[0-9]{10}$/, message: '请输入手机号', trigger: 'blur'}
        ],
        new_code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      },
      downTimer: null,
      time: 10, // 倒计时
      isDisabledClick: false,
      showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      codeKey: null, // 短信、邮箱验证码校验接口返回key值
      errorMsgShow: '',

      downTimer1: null,
      time1: 10, // 倒计时
      isDisabledClick1: false,
      showCaptcha1: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
      captchakey1: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey1: '', // 云盾值
      captcha1: null, // 云盾本身
      codeKey1: null, // 短信、邮箱验证码校验接口返回key值
      errorMsgShow1: ''
    };
  },
  computed: {
    title () {
      return this.isCheckScened(1);
    }
  },
  methods: {
    checkMobile(type) {
      return /^1[0-9]{10}$/.test(this.form[type]);
    },
    getDyCode(type) {
      // 获取短信验证码
      let data = this.form.phone;
      let flag = false;
      if (this.showVo.executeType !== 'email') {
        if (this.checkMobile(type) && this.mobileKey) {
          flag = true;
        } else {
          this.$message.error('请先确认手机号且验证图形码正确');
        }
        data = this.form.phone;
      } else {
        // 验证邮箱
        flag = true;
        data = this.form.email;
      }
      if (flag) {
        this.$fetch('sendCode', this.$params({
          type: this.showVo.executeType !== 'email' ? 1 : 2, // 1手机  2邮箱
          data: data ,
          validate: this.mobileKey,
          scene_id: this.getScene_id()
        })).then((res) => {
          if(res && res.code === 200) {
            this.countDown();
          } else {
            this.$message.error(res.msg || '验证码发送失败');
          }
        }).catch(e => {
          console.log(e);
          this.$message.error('验证码发送失败');
        });
      }
      /*this.isDisabledClick = true;
      if(this.downTimer) {
        window.clearTimeout(this.downTimer);
      }
     this.countDown();*/
    },
    getScene_id() {
      let scene_id = 1, data = this.form.phone;
      if (this.showVo.executeType === 'pwd' && this.vo && this.vo.phone) {
        scene_id = 1;
      } else if (this.showVo.executeType === 'phone' && this.vo && this.vo.phone) {
        scene_id = 2;
      } else if (this.showVo.executeType === 'phone' && this.vo && !this.vo.phone) {
        scene_id = 2;
      } else if (this.showVo.executeType === 'email' && this.vo && this.vo.email) { // 邮箱，并且邮箱不为空
        scene_id = 3;
      } else if (this.showVo.executeType === 'email' && this.vo && !this.vo.email) { // 邮箱，并且邮箱为空
        scene_id = 3;
      }
      return scene_id;
    },
    getDyCode2() {
      // scene_id场景ID：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回
      // 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-验证码
      this.$fetch('sendCode', this.$params({
        type: this.showVo.executeType !== 'email' ? 1 : 2, // 1手机  2邮箱
        data: this.showVo.executeType !== 'email' ? this.form.new_phone : this.form.new_email ,
        validate: this.codeKey,
        scene_id: this.getScene_id()
      })).then((res) => {
        if(res && res.code === 200) {
          this.countDown1();
        } else {
          this.$message.error(res.msg || '验证码发送失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error('验证码发送失败');
      });
    },
    countDown1() {
      this.isDisabledClick1 = this.time1 > 1;
      if (this.time1 > 1) {
        this.time1--;
        this.downTimer1 = setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        this.time1 = 10;
      }
    },
    countDown() {
      this.isDisabledClick = this.time > 1;
        if (this.time > 1) {
        this.time--;
        this.downTimer = setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        this.time = 60;
      }
    },
    isCheckScened() {
      // 1 表示提供标题
      let title = '';
      if (this.showVo.executeType === 'pwd' && this.vo && this.vo.phone) {
        title = !(this.vo && this.vo.has_password > 0) ? '设置密码' : '修改密码';
      } else if (this.showVo.executeType === 'phone' && this.vo && this.vo.phone) {
        title = '修改密保手机';
      } else if (this.showVo.executeType === 'phone' && this.vo && !this.vo.phone) {
        title = '设置密保手机';
      } else if (this.showVo.executeType === 'email' && this.vo && this.vo.email) {
        title = '修改关联邮箱';
      } else if (this.showVo.executeType === 'email' && this.vo && !this.vo.email) {
        title = '设置关联邮箱';
      } else {
        title = '';
      }
      return title;
    },
    changePwdStep() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.showVo.step === 1) {
            // 第一步，验证码，获取验证码是否正确得到key，验证通过，继续下一步
            let params = {
              type: 1, // 密码修改-默认手机号校验
              data: this.form.phone,
              code: this.form.code,
              scene_id: 1
            };
            this.$fetch('codeCheck', params).then(res => {
              if (res && res.code === 200) {
                if (res.data.check_result > 0) {
                  this.codeKey = res.data.key || '';
                  // 验证码第一步，继续下一步
                  this.showVo.step = 2;
                } else {
                  this.$message.error(res.msg || '验证失败，无法操作');
                }
              } else {
                this.$message.error(res.msg || '验证失败，无法操作');
              }
            }).catch(e => {
              console.log(e);
              this.$message.error('验证失败，无法操作');
            });
          } else {
            // 第二步密码保存 => 存储密码
            console.log('changePwdStep ---- 保存密码');
            let params = {
              old_password: this.form.old_pwd,
              password: this.form.password,
              confirm_password: this.form.new_password,
              scene_id: !(this.vo && this.vo.has_password > 0) ? 9 : 1,
              key: this.codeKey
            };
            this.$fetch('resetPassword', params).then(res => {
              if (res && res.code === 200) {
                this.$message.success('操作成功');
                this.visible = false;
              }
            }).catch(e => {
              console.log(e);
            });
          }
        }
      });
    },
    // 取消修改密码
    cancelPwdStep() {
      if(this.showVo.step === 2) {
        // 返回上一步
        this.showVo.step = 1;
      } else {
        // 关闭弹出框
        this.visible = false;
      }
    },
    changePhoneOrEmailStep() {
      // 验证验证码，获得Key值，验证成功后，进入下一步
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.showVo.step === 1) {
            // 第一步，验证码，获取验证码是否正确得到key，验证通过，继续下一步
            let params = {
              type: this.showVo.executeType === 'phone' ? 1 : 2,
              data: this.showVo.executeType === 'phone' ? this.form.phone : this.form.email,
              code: this.form.code,
              scene_id: this.showVo.executeType === 'phone' ? 2 : 3
            };
            this.$fetch('codeCheck', params).then(res => {
              if (res && res.code === 200) {
                if (res.data.check_result > 0) {
                  this.codeKey = res.data.key || '';
                  // 验证码第一步，继续下一步
                  this.showVo.step = 2;
                } else {
                  this.$message.error(res.msg || '验证失败，无法操作');
                }
              } else {
                this.$message.error(res.msg || '验证失败，无法操作');
              }
            }).catch(e => {
              console.log(e);
              this.$message.error('验证失败，无法操作');
            });
          } else {
            // 重置邮箱或者手机号
            this.visible = false;
          }
        }
      });
    },
    checkNewCodeResult() {
      let params = {
        type: this.showVo.executeType === 'phone' ? 1 : 2,
        data: this.showVo.executeType === 'phone' ? this.form.new_phone : this.form.new_email,
        code: this.form.new_code,
        scene_id: this.getScene_id()
      };
      this.$fetch('codeCheck', params).then(res => {
        if (res && res.code === 200) {
          if (res.data.check_result > 0) {
            this.newCodeKey = res.data.key || '';
            this.bindSave();
          } else {
            this.$message.error(res.msg || '验证失败，无法操作');
          }
        } else {
          this.$message.error(res.msg || '验证失败，无法操作');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error('验证失败，无法操作');
      });
    },
    bindSave() {
      let params = {
        type: this.showVo.executeType === 'phone' ? 1 : 2,
        account: this.showVo.executeType === 'phone' ? this.form.new_phone : this.form.new_email,
        code: this.form.new_code,
        scene_id: this.showVo.executeType === 'phone' ? 2 : 3,
        key: this.newCodeKey
      };
      // 确认绑定新功能
      this.$fetch('bindInfo', params).then(res => {
        if (res && res.code === 200) {
          this.$message.success('绑定成功！');
          this.visible = false;
        } else {
          this.$message.error(res.msg || '绑定失败！');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error('绑定失败');
      });
    },
    // 绑定手机号 或者 邮箱
    sendBindHandle() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 先验证验证码结果，再实际绑定为新手机号 或 新邮箱
          this.checkNewCodeResult();
        }
      });
    },
    initComp(vo, btnType) {
      // btnType => pwd 密码；email 邮箱； phone手机号
      // 场景ID：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-验证码 9设置密码（密码不存在情况）
      vo = {
        has_password: 0,
        phone: '',
        email: ''
      };
      this.vo = vo;
      this.showVo.executeType = btnType;
      if(!vo) {
        this.$alert('信息获取失败，请您检查网络或重新登录', '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'zdy-alert-box',
          type: 'warning',
          center: true
        });
        return;
      } else if (btnType === 'pwd' && vo && !vo.phone) {
        // 无密码
        this.$alert('为了保证您的账号安全，请您先绑定手机号', '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'zdy-alert-box',
          type: 'warning',
          center: true
        });
        return;
      } else if (btnType === 'pwd' && vo && vo.phone) {// 密码，并且手机号不为空
        this.showVo.step = 1;
        this.showVo.is_null = !(vo && vo.has_password > 0);
      } else if (btnType === 'phone' && vo && vo.phone) { // 手机号，并且手机号不为空
        this.showVo.step = 1;
        this.showVo.is_null = false;
      } else if (btnType === 'phone'  && vo && !vo.phone) { // 手机号，并且手机号为空
        this.showVo.step = 2;
        this.showVo.is_null = true;
      } else if (btnType === 'email' && vo && vo.email) { // 邮箱，并且邮箱不为空
        this.showVo.step = 1;
        this.showVo.is_null = false;
      } else if (btnType === 'email' && vo && !vo.email) { // 邮箱，并且邮箱为空
        this.showVo.step = 2;
        this.showVo.is_null = true;
      } else {
        return;
      }
      if(this.$refs.form) {
        this.$refs.form.resetFields();
        // 验证码归位
      }
      if(this.downTimer) {
        window.clearTimeout(this.downTimer);
        this.time = 60;
      }
      if(this.downTimer1) {
        window.clearTimeout(this.downTimer1);
        this.time1 = 60;
      }
      this.visible = true;
      // 为表单赋值
      this.form.phone = vo.phone || '';
      this.form.email = vo.email || '';
      this.$nextTick(() => {
        if(this.showVo.executeType !== 'email') {
          this.callCaptcha();
          this.callCaptcha('1');
        }
      });
    },
    /**
     * 初始化网易易盾图片验证码
     */
    callCaptcha(val = '') {
      const that = this;
      // eslint-disable-next-line
      initNECaptcha({
        captchaId: this.captchakey,
        element: `#setCaptcha${val}`,
        mode: 'float',
        onReady(instance) {
          console.log('instance', instance);
        },
        onVerify(err, data) {
          if (data) {
            that[`mobileKey${val}`] = data.validate;
            that[`showCaptcha${val}`] = true;
            console.log('data>>>', data);
            that[`errorMsgShow${val}`] = '';
          } else {
            that.form[`captcha${val}`] = '';
            console.log('errr>>>', err);
            that.form[`errorMsgShow${val}`] = true;
          }
        },
        onload(instance) {
          console.log('onload', instance);
          that[`captcha${val}`] = instance;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
.errorText {
  color: #E2332C;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
.el-input-group__append {
  /deep/.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    background: transparent;
    color: #666666;
  }
}
.info {
  margin-bottom: 16px;
}
</style>
