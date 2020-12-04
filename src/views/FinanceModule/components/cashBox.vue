<template>
  <div>
    <VhallDialog
      title="提现"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="320px"
    >
      <div class="box-wei">
        <div class="img-box">
          <img :src="qrcode" alt="">
          <!-- <div class="isUntime">
            <i class="el-icon-refresh-right"></i>
            <p>已超时</p>
            <p>点击重新加载</p>
          </div> -->
        </div>
        <p>您还未绑定账号，请先绑定</p>
      </div>
      <div class="nextBtn">
        <el-button type="primary" round>立即绑定</el-button>
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
        <el-form label-width="85px">
           <el-form-item label="动态密码">
            <div class="inputCode">
              <el-input v-model="code" style="width: 150px"></el-input>
              <span @click="getCode"><i v-show="!getCodeBtnDisable">{{ waitTime }}s</i>{{ codeBtnWord }}</span>
            </div>
            <p class="codeTitle">已向绑定手机号{{ phone | filterPhone }}发送验证码</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="nextBtn">
        <el-button type="primary" round @click="nextBinding"  :disabled="!code"
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
        <p>可用金额<span>￥{{ availableMoney }}</span></p>
      </div>
      <el-form label-width="70px" :model="withdrawForm" :rules="rules" ref="withdrawForm">
        <el-form-item label="提现金额" prop="money">
          <el-input
            v-model="withdrawForm.money"
            style="width: 265px"
            placeholder="请输入提现金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="动态密码" prop="code">
          <div class="inputCode">
            <el-input v-model="withdrawForm.code" style="width: 150px"></el-input>
            <span @click="getCode"><i v-show="!getCodeBtnDisable">{{ waitTime }}s</i>{{ codeBtnWord }}</span>
          </div>
          <!-- <el-input v-model="code" style="width: 150px"></el-input>
          <b class="code" @click="getCode"
            ><i v-show="!getCodeBtnDisable">{{ waitTime }}s</i
            >{{ codeBtnWord }}</b
          > -->
          <p class="codeTitle">已向绑定手机号{{ phone | filterPhone }}发送验证码</p>
        </el-form-item>
        <el-form-item label="到账账户">
          <div class="live-box">
            <img src="../../../common/images/logo.png" alt="" /> 微吼直播
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
        <el-button type="primary" round @click="withdraw()" :disabled="!(withdrawForm.code&&withdrawForm.money&&checked)">确认</el-button>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import QRcode from 'qrcode';
export default {
  // props: ['type'],
  data() {
    let validateMoney = (rule, value, callback) => {
      setTimeout(() => {
          if (!(/^\d+$|^\d*\.\d+$/g.test(value))) {
            callback(new Error('请输入数字值'));
          } else {
            if (value > parseInt(this.availableMoney)) {
              callback(new Error('提现值必须小于可用金额'));
            } else {
              callback();
            }
          }
        }, 1000);
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
      checked: false,
      availableMoney: 40.00,
      waitTime: 60,
      codeBtnWord: '获取验证码',
      getCodeBtnDisable: true,
      qrcode: '',
      phone: 12345678910,
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      link: 'http://172.16.11.8/finance/income',
      rules: {
        money: [
          { validator: validateMoney, trigger: 'blur'  }
        ]
      }
    };
  },
  created(){
    QRcode.toDataURL(
      this.link,
      (err, url) => {
        console.log(err, url);
        this.qrcode = url;
      }
    );
  },
  methods: {
    getCode() {
      if (!this.getCodeBtnDisable) {
        return;
      }
      this.$fetch('withdrawalPhoneCode').then(res => {
        console.log(res.data, '234324536536');
      });
      console.log('1111111111111');
      this.phoneTimer();
    },
    withdraw() {
      this.$refs['withdrawForm'].validate((valid) => {
          if (valid) {
            console.log('验证通过');
          } else {
            console.log('验证未通过');
            return false;
          }
        });
    },
    phoneTimer() {
      const that = this;
      that.waitTime--;
      that.getCodeBtnDisable = false;
      // this.codeBtnWord = `${this.waitTime}s 后重新获取`;
      this.codeBtnWord = ` 后重新获取`;
      console.log('获取时间的值2：' + this.waitTime);
      const timer = setInterval(function () {
        if (that.waitTime > 1) {
          that.waitTime--;
          that.codeBtnWord = ` 后重新获取`;
        } else {
          clearInterval(timer);
          that.codeBtnWord = '获取验证码';
          that.getCodeBtnDisable = true;
          that.waitTime = 60;
        }
      }, 1000);
    },
    changeBinding() {
      this.dialogChangeVisible = true;
      this.dialogCashVisible = false;
    },
    nextBinding() {
      this.dialogChangeVisible = false;
      this.dialogVisible = true;
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
            that.showCaptcha = true;
            console.log('data>>>', data);
          } else {
            that.loginForm.captcha = '';
            that.dynamicForm.captcha = '';
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
  font-size: 16px;
  font-weight: 500;
}
/deep/.el-input__inner:focus {
  border-color: #ccc;
}

/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #666;
}
.box-wei {
  .img-box {
    width: 132px;
    height: 132px;
    background: #f7f7f7;
    margin: 0 auto;
  }
  h3 {
    color: #1a1a1a;
    font-weight: 400;
    padding: 20px 10px;
    line-height: 20px;
  }
  p {
    font-size: 14px;
    color: 999;
    text-align: center;
    padding-top: 8px;
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
  border-radius: 4px;
  /deep/.el-input__inner {
    border: none;
    height: 38px;
  }
  span{
    display: inline-block;
    width: 112px;
    height: 36px;
    // padding-top: 4px;
    text-align: center;
    line-height: 38px;
    background: #F2F2F2;
    color:#666666;
    vertical-align: top;
    cursor: pointer;
  }
  i {
    font-weight: normal;
    color: #ff0000;
  }
}
.money {
  padding: 20px;
  p {
    text-align: center;
    font-size: 14px;
    span {
      color: #1a1a1a;
      font-size: 16px;
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
  padding: 20px;
  .el-button {
    padding: 10px 38px;
  }
}
</style>
