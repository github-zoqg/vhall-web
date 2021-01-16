<template>
  <div>
    <VhallDialog
      title="提现"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="320px"
    >
      <div class="box-wei">
        <div class="img-box" v-if="qrcode">
          <img :src="`//aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(qrcode)}`" alt="" v-if="qrcode">
          <p>请用微信扫描二维码，绑定收款账户</p>
          <el-button type="primary" class="length120"  round @click="goBangWeixin">确定</el-button>
          <!-- <div class="isUntime">
            <i class="el-icon-refresh-right"></i>
            <p>已超时</p>
            <p>点击重新加载</p>
          </div> -->
        </div>
        <div class="no-bang" v-else>
           <p >您还未绑定账号，请先绑定</p>
           <el-button type="primary" class="length120" round @click="goBangWeixin">立即绑定</el-button>
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="更改绑定微信"
      :visible.sync="dialogChangeVisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="box-wei">
        <h3>
          为了保障您的账号安全，请验证进行安全验证，手机号是当前账号绑定的手机号
        </h3>
        <el-form label-width="72px">
          <el-form-item label="">
           <div id="payCaptcha" class="captcha">
            <el-input
              v-model="withdrawForm.text">
            </el-input>
          </div>
          <p style="color:#fb3a32;padding:0;line-height:25px"  v-show="errorMsgShow"><i class="el-icon-error"></i>图形验证码错误</p>
          </el-form-item>
           <el-form-item label="动态密码">
            <div class="inputCode">
              <el-input v-model="code" style="width: 150px"></el-input>
              <span @click="mobileKey && getBangCode()" :class="mobileKey ? 'isLoginActive' : ''">{{ time == 60 ? '获取验证码' : `${time}秒后发送` }}</span>
            </div>
            <p class="codeTitle" v-if="phone">已向绑定手机号{{ phone | filterPhone }}发送验证码</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="nextBtn withdrawBtn">
        <el-button type="primary" class="length120" round @click="nextBinding"  :disabled="!code"
          >下一步</el-button>
      </div>
    </VhallDialog>
    <VhallDialog
      title="提现申请"
      :visible.sync="dialogCashVisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="money">
        <p>可用金额<span>￥{{ money }}</span></p>
      </div>
      <el-form label-width="70px" :model="withdrawForm" :rules="rules" ref="withdrawForm">
        <el-form-item label="提现金额" prop="money">
          <el-input
            v-model.trim="withdrawForm.money"
            style="width: 265px"
            oninput="this.value=this.value.replace(/[^\d^\.]+/g, '')"
            placeholder="请输入提现金额"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div id="payCaptcha" class="captcha">
            <el-input
              v-model="withdrawForm.text">
            </el-input>
          </div>
          <p class="errorText" style="color:#fb3a32"  v-show="errorMsgShow"><i class="el-icon-error"></i>图形验证码错误</p>
        </el-form-item>
        <el-form-item label="动态密码" prop="code">
          <div class="inputCode">
            <el-input v-model.trim="withdrawForm.code" style="width: 150px"></el-input>
            <span @click="getCode()" :class="showCaptcha ? 'isLoginActive' : ''">{{ time == 60 ? '获取验证码' : `${time}秒后发送` }}</span>
          </div>
          <p class="codeTitle" v-if="phone">已向绑定手机号{{ phone }}发送验证码</p>
        </el-form-item>
        <el-form-item label="到账账户">
          <div class="live-box">
            <img :src="avatar" alt="" /> {{ nickName }}
            <span @click="changeBinding">更改</span>
          </div>
          <div class="xieyi">
            <el-checkbox v-model="checked"
              >同意<span>《用户兑换协议》</span></el-checkbox
            >
          </div>
        </el-form-item>
      </el-form>
      <div class="nextBtn">
        <el-button type="primary" class="length120" round @click="withdraw()" :disabled="!(withdrawForm.code&&withdrawForm.money&&checked)">确认</el-button>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import QRcode from 'qrcode';
import Env from "@/api/env";
export default {
  props: ['money', 'type', 'userInfo'],
  data() {
    let validateMoney = (rule, value, callback) => {
      if (!(/^\d+$|^\d*\.\d+$/g.test(value))) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 1 || value > 800) {
          callback(new Error('请输入大于等于1且小于等于800的数字'));
        } else if (value > parseInt(this.money)) {
          callback(new Error('提现值必须小于可用金额'));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      dialogChangeVisible: false,
      dialogCashVisible: false,
      withdrawForm: {
        code: '',
        money: '',
      },
      code: "",
      phone: '',
      nickName: '微吼直播',
      errorMsgShow: false,
      checked: false,
      time: 60,
      gettime: 60,
      showCaptcha: false,
      showCode: false,
      qrcode: '',
      avatar: '',
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      rules: {
        money: [
          { validator: validateMoney, trigger: 'blur'}
        ]
      }
    };
  },
  watch: {
    dialogCashVisible() {
      if (this.dialogCashVisible) {
        this.time = 60;
        this.mobileKey = '';
        this.phone = '';
        this.errorMsgShow = ''
        this.callCaptcha();
        this.getWeinName();
      } else {
        this.mobileKey = '';
        this.showCaptcha = false;
        this.withdrawForm.money = '';
        this.withdrawForm.code = '';
        this.errorText = '';
        this.phone = '';
        this.callCaptcha();
        window.clearInterval(this.timer);
      }
    },
    dialogChangeVisible() {
      if (this.dialogChangeVisible) {
        this.callCaptcha();
        this.time = 60;
        this.mobileKey = '';
        window.clearInterval(this.timer);
      } else {
        this.callCaptcha();
        this.time = 60;
        this.mobileKey = '';
        window.clearInterval(this.timer);
      }
    },
    dialogVisible() {
      if (this.dialogVisible) {
        this.qrcode = '';
      }
    }
  },
  created() {
    this.avatar = this.userInfo.avatar || require('../../../common/images/avatar.png');
  },
  methods: {
    // 获取用户微信昵称
    getWeinName() {
      this.userInfo.user_thirds.map(item => {
        if (item.type == 3) {
          this.nickName = item.nick_name;
        }
      });
    },
    // 提现短信验证码
    getCode() {
      this.$refs['withdrawForm'].validate((valid) => {
        if (valid) {
          this.showCaptcha = true;
          if (this.mobileKey && this.withdrawForm.money) {
            this.$fetch('withdrawalPhoneCode', {user_id: this.userInfo.user_id, captcha: this.mobileKey}).then(res => {
              this.phone = res.data.phone;
              this.countDown();
            });
          }
        } else {
          return false;
        }
      });
    },
    // 提现
    withdraw() {
      this.$refs['withdrawForm'].validate((valid) => {
          if (valid) {
            this.withdrawMoney();
          } else {
            console.log('验证未通过');
            return false;
          }
        });
    },
    withdrawMoney() {
      let params = {
        user_id: this.userInfo.user_id,
        verification_code: this.withdrawForm.code,
        fee: this.withdrawForm.money,
        type: this.type
      };
      this.$fetch('withdrawal', params).then(res => {
        if (res.code == 200) {
          this.$message.success('提现成功');
          this.dialogCashVisible = false;
          this.$emit('onreload');
        } else {
          this.$message.error(res.msg || '提现失败');
        }
      });
    },
    // 绑定微信短信验证码
    getBangCode() {
      if (!this.mobileKey) {
        this.$message.error('图形验证码错误');
        return;
      }
      this.phone = this.userInfo.phone;
      let params = {
        type: 1,
        data: this.userInfo.phone,
        scene_id: 6,
        validate: this.mobileKey
      };
      this.$fetch('sendCode', params).then(res => {
        if (res.code == 200) {
          this.countDown();
        } else {
          this.callCaptcha();
        }
      });
    },
    // 绑定微信 ---获取绑定微信二维码
    goBangWeixin() {
      this.qrcode = `https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=wab&jump_url=${process.env.VUE_APP_WEB_URL}/weixin`;
      console.log(this.qrcode)
    },
    /**
     * 倒计时函数
     */
    countDown() {
      if (this.time) {
        this.time--;
        this.timer = setTimeout(() => {
          this.countDown();
        }, 1000);
      } else {
        this.time = 60;
      }
    },
    changeBinding() {
      this.qrcode = '';
      this.dialogChangeVisible = true;
      this.dialogCashVisible = false;
      this.time = 60;
      this.callCaptcha();
    },
    nextBinding() {
      this.dialogChangeVisible = false;
      this.dialogVisible = true;
      this.time = 60;
    },
     /**
     * 初始化网易易盾图片验证码
     */
    callCaptcha() {
      const that = this;
      // eslint-disable-next-line
      initNECaptcha({
        captchaId: this.captchakey,
        element: "#payCaptcha",
        mode: 'float',
        onReady(instance) {
          console.log('instance', instance);
        },
        onVerify(err, data) {
          if (data) {
            that.mobileKey = data.validate;
            console.log('data>>>', data);
            that.errorMsgShow = false;
          } else {
            that.mobileKey = '';
            console.log('errr>>>', err);
            that.errorMsgShow = true;
          }
        },
        onload(instance) {
          console.log('onload', instance);
          that.captcha = instance;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px;
}
/deep/.el-dialog__title {
  font-weight: 500;
}
/deep/.el-input__inner:focus {
  border-color: #ccc;
}
/deep/.el-input__inner {
  border-radius: 2px;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #666;
}
/deep/.el-button.is-round{
  padding: 7px 32px;
}
.length120{
  width: 120px;
  text-align: center;
}
.box-wei {
  // padding-bottom: 20px;
  // .el-form-item{
  //   margin-bottom: 20px;
  // }
  .img-box {
    // width: 132px;
    // height: 132px;
    margin: 0 auto;
    text-align: center;
    padding-bottom: 24px;
    img{
      width: 132px;
      height: 132px;
    }
    p{
      padding-bottom: 20px;
    }
  }
  h3 {
    color: #1a1a1a;
    font-weight: 400;
    padding: 20px 0;
    line-height: 20px;
    font-size: 14px;
  }
  p {
    font-size: 14px;
    color: 999;
    text-align: center;
    padding-top: 8px;
  }
  .no-bang{
    padding: 24px 0;
    text-align: center;
    p{
      padding-bottom: 50px;
    }
  }
  .isUntime {
    text-align: center;
    padding-top: 30px;
    cursor: pointer;
    i {
      font-size: 40px;
    }
  }
  .code-data {
    // display: flex;
    padding: 0 10px;
    border: 1px solid #ccc;
    span {
      padding-right: 10px;
      color: #1a1a1a;
      font-weight: 600;
    }
    p {
      // padding-left: 48px;
      line-height: 20px;
      color: #666;
    }
  }
}
.code {
  border: 1px solid #ccc;
  border-left: none;
  cursor: pointer;
  display: inline-block;
  width: 120px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 4px;
  margin-left: -5px;
  background: #f2f2f2;
  font-size: 13px;
  color: #666;
}
.inputCode{
  height: 38px;
  width: 265px;
  border: 1px solid #ccc;
  border-radius: 2px;
  /deep/.el-input__inner {
    border: none;
    height: 38px;
  }
  span{
    display: inline-block;
    width: 113px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    background: #F2F2F2;
    color:#666666;
    vertical-align: top;
    cursor: pointer;
    &.isLoginActive{
      background: #fc5659;
      color: #fff;
    }
  }
  // i {
  //   font-weight: normal;
  //   color: #ff0000;
  // }
}
.money {
  padding: 20px;
  p {
    text-align: center;
    font-size: 14px;
    span {
      color: #1a1a1a;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
.live-box {
  line-height: 22px;
  padding-top: 8px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #ccc;
    vertical-align: top;
  }
  span {
    font-size: 14px;
    color: #3562fa;
    padding-left: 5px;
    cursor: pointer;
  }
}
.xieyi {
  font-size: 14px;
  color: #666;
  span {
    color: #3562fa;
  }
}
.nextBtn {
  text-align: center;
  padding-bottom: 24px;
}
.withdrawBtn{
  padding-top: 20px;
}
</style>
