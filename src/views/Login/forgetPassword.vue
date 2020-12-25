<template>
  <div class="forget-password">
    <OldHeader></OldHeader>
    <div class="container">
      <div class="find-my-pwd">
        <h3>找回密码</h3>
        <ul class="find-pwd-steps">
          <li :class="findStep > 0 ? 'isActive' : ''">
            <span class="step-num">1</span>
            选择找回方式
            <span class="step-arrow"><icon icon-class="saasicon-test"></icon></span>
          </li>
          <li :class="findStep > 1 ? 'isActive' : ''">
            <span class="step-num">2</span>
            验证用户身份
            <span class="step-arrow"><icon icon-class="saasicon-test"></icon></span>
          </li>
          <li :class="findStep > 2 ? 'isActive' : ''">
            <span class="step-num">3</span>
            设置新密码
            <span class="step-arrow"><icon icon-class="saasicon-test"></icon></span>
          </li>
          <li :class="findStep > 3 ? 'isActive' : ''">
            <span class="step-num">4</span>
            完成
            <span class="step-arrow"></span>
          </li>
        </ul>
        <div class="find-use-ways">
        <div class="step-1" v-if="findStep===1">
          <div class="step-ways">
            <div class="step-phone" @click="findPassword('phone')">
              <div class="phone"><i class="el-icon-mobile-phone"></i> 通过手机找回</div>
              <p class="text">通过注册时填写的手机号找回</p>
            </div>
            <div class="step-email" @click="findPassword('email')">
              <div class="phone"><i class="el-icon-message"></i> 通过邮箱找回</div>
              <p class="text">通过注册时填写的邮箱找回</p>
            </div>
          </div>
          <div class="care_div">
            <icon icon-class="saasweibiaoti1"></icon>
            注意：子账号找回密码请直接联系父账号所有者
          </div>
        </div>
        <div class="step-2" v-if="findStep===2">
          <div class="find-phone" v-if="isType==='phone'">
            <p class="find-text">请填写您的注册手机号获取验证码，完成身份验证；您还可以选择<span @click="findPassword('email')">邮箱找回密码</span></p>
            <el-form ref="checkDynamicForm" :model="dynamicForm" :rules="loginRules" label-width="120px">
            <el-form-item label="手机号码："  prop="phone">
              <el-input
                placeholder="请输入手机号"
                maxlength="11"
                style="width:270px"
                v-model="dynamicForm.phone">
              </el-input>
              <span class="freeCode" @click="getDyCode">{{ time == 60 ? '免费获取验证码' : `${time}秒后发送` }}</span>
            </el-form-item>
            <el-form-item label="图形验证码：">
              <div id="loginCaptcha" class="findCaptcha">
                <el-input
                style="width:270px"
                  v-model="dynamicForm.text">
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="code" label="手机验证码：">
              <el-input
                placeholder="输入验证码"
                style="width:270px"
                v-model="dynamicForm.code">
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click.stop="sureFindPassword()">确&nbsp;&nbsp;&nbsp;认</el-button>
            </div>
          </el-form>
          </div>
          <div class="find-phone" v-if="isType==='email'">
            <p class="find-text">请填写您的邮箱获取验证码，完成身份验证；您还可以选择<span @click="findPassword('phone')">手机找回密码</span></p>
            <el-form ref="checkDynamicForm" :model="dynamicForm" :rules="loginRules" label-width="120px">
            <el-form-item label="邮箱：" prop="email">
              <el-input
                placeholder="请输入邮箱"
                style="width:270px"
                v-model="dynamicForm.email">
              </el-input>
              <span class="freeCode" @click="getDyCode">{{ time == 60 ? '免费获取验证码' : `${time}秒后发送` }}</span>
            </el-form-item>
            <el-form-item prop="code" label="邮箱验证码：">
              <el-input
                placeholder="输入邮箱验证码"
                style="width:270px"
                v-model="dynamicForm.code">
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="sureFindPassword">确&nbsp;&nbsp;&nbsp;认</el-button>
            </div>
          </el-form>
          </div>
        </div>
        <div class="step-3" v-if="findStep===3">
          <el-form ref="resetPassword" :model="dynamicForm" :rules="loginRules" label-width="100px">
            <el-form-item label="新密码：" prop="password">
              <el-input
                placeholder="请输入新密码"
                style="width:270px"
                type="password"
                v-model="dynamicForm.password">
              </el-input>
            </el-form-item>
            <el-form-item prop="checkPossword" label="确认密码：">
              <el-input
                placeholder="请再次输入密码"
                style="width:270px"
                type="password"
                v-model="dynamicForm.checkPassword">
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="resetPassword()">确&nbsp;&nbsp;&nbsp;认</el-button>
            </div>
          </el-form>
        </div>
        <div class="step-4" v-if="findStep===4">
          <div class="possword-success">
            <i class="el-icon-success"></i>
            密码重置成功
          </div>
        </div>
      </div>
      </div>

    </div>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
export default {
  components: {
    OldHeader
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!(/^1[0-9]{10}$/.test(value))) {
          callback(new Error('请输入正确的手机号'));
        }
        callback();
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
      findStep: 1,
      time: 60,
      isType: 'phone',
      codeKey: 0,
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      dynamicForm: {phone: '', password: '', checkPassword: '', code: ''},
      loginRules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    };
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.callCaptcha();
  //   });
  // },
  methods: {
    findPassword(type) {
      this.isType = type;
      this.findStep = 2;
      if (type === 'phone') {
        this.callCaptcha();
      }
    },
    // 第二步获取短信验证码
    getDyCode() {
      if (this.checkMobile()) {
        if (!this.mobileKey) {
          this.$message.error('请先校验图形验证码');
          return;
        }
        this.$fetch('sendCode', {
          type: this.isType === 'phone' ? 1 : 2,
          data: this.isType === 'phone' ? this.dynamicForm.phone : this.dynamicForm.email,
          validate: this.mobileKey,
          scene_id: this.isType === 'phone' ? 5 : 4
        }).then(() => {
          this.countDown();
        });
      }
    },
    // 第二步确定 检测短信验证码
    sureFindPassword() {
      this.$refs['checkDynamicForm'].validate((valid) => {
        if (valid) {
          let params = {
            type: this.isType === 'phone' ? 1 : 2,
            data: this.isType === 'phone' ? this.dynamicForm.phone : this.dynamicForm.email,
            code: this.dynamicForm.code,
            scene_id: this.isType === 'phone' ? 5 : 4
          }
          this.$fetch('codeCheck', params).then(res => {
          if (res.code == 200 && res.data) {
            this.codeKey = res.data.key;
            this.findStep = 3;
          } else {
             this.$message.error(res.msg);
          }
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
      this.$refs['resetPassword'].validate((valid) => {
          if (valid) {
            let params = {
              old_password: '',
              password: this.dynamicForm.password,
              confirm_password: this.dynamicForm.checkPassword,
              scene_id: this.isType === 'phone' ? 5 : 4,
              key: this.codeKey
            };
            this.$fetch('resetPassword', params).then(res => {
              if (res.code == 200) {
                this.findStep = 4;
                setTimeout(() => {
                  this.$router.push({path: '/'});
                }, 1000);
              } else {
                this.$message.error(res.msg);
              }
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
        this.time = 60;
      }
    },
    /**
     * 校验手机号
     */
    checkMobile() {
      return /^1[0-9]{10}$/.test(this.dynamicForm.phone);
    },
    // checkPassWord() {
    //   return /^(\w){6,20}$/.test(this.loginForm.password);
    // },
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
            that.$message.error('图形验证码错误');
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
.forget-password {
  background: #f8f8f8;
  .container{
    width: 960px;
    padding: 0 15px;
    margin: 0 auto;
    .find-my-pwd{
      width: 796px;
      border: 1px solid #d4d3d3;
      margin: 0 auto;
      padding: 30px;
      overflow: hidden;
      background-color: #fff;
      height: 420px;
      h3{
        font-size: 16px;
      }
      .find-pwd-steps{
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        width: 700px;
        margin: 5px auto;
        display: flex;
        justify-content: space-between;
        li{
          list-style: none;
          font-size: 18px;
          color: #808080;
          line-height: 26px;
          &.isActive{
            color: #7abd54;
            .step-num{
              background: #7abd54;
              color: #fff;
            }
          }
        }
        .step-num{
          // color: #fff;
          font-size: 22px;
          font-family: Arial;
          width: 25px;
          height: 26px;
          display: inline-block;
          margin-right: 6px;
          text-align: center;
          line-height: 28px;
          background: #ccc;
          border-radius: 50%;
        }
        .step-arrow{
          color: #ccc;
          /deep/.svg-icon{
            width: 2em;
            font-size: 30px;
            color: #ccc;
            vertical-align: middle;
          }
        }
      }
      .find-use-ways{
        .el-form-item{
            margin-bottom: 18px;
          }
        .step-1{
          overflow: hidden;
          margin: 88px auto 0;
          width: 540px;
          .step-ways{
            display: flex;
            justify-content: space-around;
            .step-phone, .step-email{
              text-align: center;
              .phone {
                width: 210px;
                height: 70px;
                line-height: 70px;
                border: 1px solid #d4d3d3;
                background-color: #f5f5f5;
                overflow: hidden;
                cursor: pointer;
                i{
                  color: #7abd54;
                }
              }
              .text{
                color: #969696;
                font-size: 13px;
                line-height: 30px;
              }
            }
          }
          .care_div{
            text-align: center;
            padding-top: 40px;
            /deep/.svg-icon{
              width: 2em;
              font-size: 24px;
              color: #e33836;
              vertical-align: middle;
            }
            color: #e33836;
            font-size: 16px;
          }
        }
        .step-2{
          padding-top: 25px;
          .find-phone{
            .find-text{
              text-align: center;
              font-size: 13px;
              color: #969696;
              line-height: 30px;
              padding-bottom: 5px;
              span{
                color: #d10714;
                cursor: pointer;
              }
            }
            .freeCode{
              padding: 8px 10px;
              margin-left: 10px;
              border: 1px solid #d4d3d3;
              background: #f5f5f5;
              color: #383838;
              font-size: 12px;
              cursor: pointer;
            }
            .findCaptcha{
              width: 270px;
              height: 36px;
            }
            .login-btn{
              margin-left: 100px;
            }
          }
        }
        .step-3{
          padding-top: 30px;
          .login-btn{
            padding-left: 100px;
          }
        }
        .step-4{
          padding-top: 50px;
          .possword-success{
            text-align: center;
            font-size: 20px;
            i{
              color: #7abd54;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
