<template>
  <div class="redcoupon-wrap">
    <div class="header">
      <div class="back" v-show="wechatPayMobild" @click="backPay" >返回</div>
      <h3>发红包</h3>
      <div class="close iconfont" @click="closeMobild">&#xe725;</div>
    </div>
    <div v-show="!wechatPayMobild" class="pay-form">
      <div class="form-group" :class="{error : redcouponMaxNumError}">
        <label class="label-left" >红包个数：</label><input type="text" v-model="numbers" @input="inputNumbers" @change="changeNumbers" placeholder="填写个数"><label class="label-right">个</label>
      </div>
      <p class="envelope-tips">当前<span class="online">{{onlineAmount}}</span>人在线</p>
      <div class="form-group" :class="{error : redcouponMaxNum}">
        <template v-if="redcouponType === 0">
          <label class="label-left" >总金额：</label><input type="text"   v-model="inputAmount" @change="changeAmount" @input="inputAmounts" placeholder="填写金额"><label class="label-right">元</label>
        </template>
        <template v-if="redcouponType === 1">
        <label class="label-left"  >单个金额：</label><input type="text" v-model="inputAmount" @change="changeAmount" @input="inputAmounts" placeholder="填写金额"><label class="label-right">元</label>
        </template>
      </div>
      <p class="envelope-tips" v-show="redcouponType === 0" >当前为拼手气红包, <span @click="changeType(1)">改为均分红包</span></p>
      <p class="envelope-tips" v-show="redcouponType === 1">当前为均分红包, <span @click="changeType(0)" >改为拼手气红包</span></p>
      <div class="form-group text">
        <input type="text" class="envelope-note" v-model="describe" placeholder="多谢大家支持" maxlength="15">
      </div>
      <div class=" total-money">￥{{amount}}</div>
      <div class="pay-box">
        <div class="Alipay">
          <label >
            <input type="radio" value="ALIPAY" v-model="channel">
            <img width="25" src="//cnstatic01.e.vhall.com/static/img/pay/zfb_14.png">
            <span>支付宝</span>
          </label>
        </div>
        <div class="weixin">
          <label>
            <input type="radio" value="WEIXIN" v-model="channel">
            <img width="25" src="//cnstatic01.e.vhall.com/static/img/pay/wx_07.png">
            <span>微信支付</span>
          </label>
        </div>

      </div>
      <p class="btnsbox">
        <a class="btn btn-light-red" :class="{disabled: PayIng}" @click="redpacketSend">塞钱进红包</a>
      </p>
    </div>
    <div v-show="wechatPayMobild" class="payment-dialog-wechat-qr">
      <div v-show="!paySuccess">
        <div class="title">
        ￥{{this.amount}}
        <p>打开微信，扫一扫付款</p>
      </div>
        <img width="180" height="180" :src="wechatPayImg" alt="微信付款二维码">
      </div>
      <div class="complete" v-show="paySuccess">
        <div class="pay-success">
          <img src="//cnstatic01.e.vhall.com/static/img/envelope-success.png" alt="">
          <p>红包已发出</p>
          <span>已支付</span>
          <div class="total-money">￥{{amount}}</div>
          <p class="btnsbox pay-suce">
            <a class="btn btn-light-red btn-close"  @click="closeMobild">知道了</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import QRcode from 'qrcode';

export default {
  name: 'redcoupon',
  data () {
    return {
      onlineAmount: 0,
      paySuccess: true,
      PayIng: false,
      wechatPayMobild: false,
      wechatPayImg: '',
      channel: 'WEIXIN',
      inputAmount: '',
      numbers: '',
      redcouponMaxNum: false,
      redcouponMaxNumError: false,
      redcouponType: 0,
      amount: '0.00',
      describe: '多谢大家支持',
      redcouponMinNum: false
    };
  },
  mounted () {
    // EventBus.$on('red_envelope_push', e => { // 关闭微信二维码弹窗
    //  派发消息类型改变   进行注释删除
    //   console.warn('兼听到红包派发的消息----');
    //   this.paySuccess = true;
    //   this.wechatPayMobild = true;
    // });

    EventBus.$on('red_envelope_ok', e => { // 关闭微信二维码弹窗
      console.warn('兼听到红包派发的消息----');
      this.paySuccess = true;
      this.wechatPayMobild = true;
    });
    EventBus.$on('Join', res => { // 关闭微信二维码弹窗
      this.onlineAmount = res.uv;
    });
    EventBus.$on('Leave', res => { // 关闭微信二维码弹窗
      this.onlineAmount = res.uv;
    });
    EventBus.$on('red_envelope_ok', (e) => {
      this.describe = '多谢大家支持'
      this.amount = '0.00'
      this.numbers = ''
      this.channel = 'WEIXIN'
      this.closeMobild()
    })
    this.$fetch('getOnlineList', {room_id: this.roomId, pos: 0, limit:100}).then(res => {
      console.warn('获取到最大的在线人数----', res.data);
      if(res.code == 200){
        this.onlineAmount = res.data.total;
      }else{
        this.$message.warning(res.msg)
      }
    });
  },
  props: {
    vssToken: {
      required: true
    },
    roomId: {
      required: true
    },
    assistantType: {
      required: true
    }
  },
  methods: {
    backPay () {
      this.wechatPayMobild = false;
      this.paySuccess = false;
    },
    redpacketSend () {
      if (this.numbers < 1 || !this.numbers) {
        this.$message.customerror('红包个数应大于等于1');
        return false;
      }
      if (this.amount === '0.00') { // 如果总金额为0 或者红包单个平均小于0.01元，不执行
        this.$message.customerror('红包金额不能为空');
        return false;
      }
      if (this.redcouponMinNum) {
        this.$message.customerror('每个红包的金额数不能少于0.01元');
        return false;
      }
      if (!this.PayIng) { this.PayIng = true; }
      let serviceCode
      this.channel === 'ALIPAY' ? serviceCode = 'CASHIER' : serviceCode = 'QR_PAY'

      // this.loading = true
      this.$fetch('v3CreateRed', {
        room_id: this.roomId,
        type: this.redcouponType,
        describe: this.describe,
        number: this.numbers,
        amount: parseFloat(this.amount),
        channel: this.channel,
        service_code: serviceCode
      }).then((res) => {
        this.PayIng = false;
        if (res.code === 200) {
          // console.log(res)
          if (this.channel === 'ALIPAY') {
            if (this.assistantType) {
              EventBus.$emit('alipayCashier', res.data.pay_data);
            } else {
              let link = document.createElement('a');
              link.href = res.data.pay_data;
              link.target = '_blank';
              link.click();
            }
          } else {
            /* eslint-disable */
            let a = QRcode.toDataURL(
              res.data.pay_data,
              (err, url) => {
                this.wechatPayMobild = true
                this.paySuccess = false
                this.wechatPayImg = url
              }
            )
            /* eslint-disable */
          }
        }else{
          this.$message.warning(res.msg)
        }
      }).catch(error => {
          console.log(error)
        })
    },
    changeType (val) {
      this.redcouponType = val
      this.changeAmount()
    },
    inputNumbers () {
      const val = this.numbers
      const num = isNaN(parseInt(val)) ? '' : parseInt(val)
      if (num === '') {
        this.amount = '0.00'
        this.numbers = num
        return
      }
      if (num > 100) {
        this.numbers = 100
        this.redcouponMaxNumError = true
        this.$emit('redcouponMaxNum')
        console.log('最多100个')
      } else {
        this.numbers = num
        this.redcouponMaxNumError = false
      }
      this.changeAmount()
    },
    changeNumbers() {
      this.redcouponMaxNumError = false
    },
    changeAmount () {
      this.redcouponMaxNum = false
      const val = this.inputAmount
      let num = isNaN(parseFloat(val)) ? '' : parseFloat(val)
      if(num === '') {
        this.amount = '0.00'
        return
      }
      if (this.redcouponType === 0) { // 随机
        if (num > 20000) {
          num = 20000
        }
        if(!this.numbers) {
          this.amount = '0.00'
          this.inputAmount = num.toFixed(2)
        } else {
          this.amount = this.inputAmount = num.toFixed(2)
        }
      } else {
        if (this.redcouponType === 1) { // 平均
          if (num > 200) {
            this.inputAmount = 200
          } else {
            this.inputAmount = num.toFixed(2)
          }
          this.amount = (this.inputAmount * this.numbers).toFixed(2)
        }
      }

    },

    inputAmounts () {
      const val = this.inputAmount
      let num = isNaN(parseFloat(val)) ? '' : parseFloat(val)
      if(num === '') {
        this.amount = '0.00'
        this.inputAmount = ''
        return
      }
      if (this.redcouponType === 0) { // 随机
        if (num > 20000) {
          this.redcouponMaxNum = true
          this.$emit('MoneyMaxOver', 20000)
          console.log('最大20000')
          num = 20000
        } else {
          this.redcouponMaxNum = false
        }
        if(!this.numbers) {
          this.amount = '0.00'
        } else {
          if(num/this.numbers < 0.01) {
            this.redcouponMaxNum = true
            this.redcouponMinNum = true
            this.$emit('redcouponMinNum', 0.01)
            console.log('小于0.01')
            return
          }
          this.redcouponMinNum = false
          this.amount  = num.toFixed(2)
        }

      } else {
        if (this.redcouponType === 1) { // 平均
          if (num > 200) {
            this.redcouponMaxNum = true
            this.$emit('redCouponMaxOver', 200)
            console.log('单个最大200')
            num = 200
          } else {
            this.redcouponMaxNum = false
          }
        }
        this.amount = (num * this.numbers).toFixed(2)
      }

    },
    closeMobild () {
      this.backPay()
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../public/iconfont/iconfont.css";
.redcoupon-wrap {
  width: 400px;
  height: 420px;
  position: relative;
  border-radius:8px;
  box-shadow:0px 2px 11px 0px rgba(0,0,0,0.5);
  background:rgba(255,255,255,1);
  .header{
    color: #fff;
    line-height: 40px;
    position: relative;
    border-bottom: 1px solid #D9D9D9;
    height: 40px;
    .back {
      position: absolute;
      top: 0px;
      left: 14px;
      cursor: pointer;
      font-size: 12px;
    }
    h3 {
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }
    .close {
      position: absolute;
      top: 0px;
      right: 14px;
      cursor: pointer;
      font-size: 12px;
      color: #333;
    }
  }
  .pay-form{
    padding: 30px 58px 0;
    text-align: center;
    background: #fff;
    line-height: 28px;
    .form-group {
      overflow: hidden;
      &.error {
        background-color: #ffefef;
        border: 1px solid #ff5858;
        color: #ff5858;
        input{
          background-color: #ffebeb;
          color: #ff5858;
        }
      }
      .label-left {
        width: 70px;
        float: left;
        display: block;
        color: #747679;
        font-size: 14px;
        text-align: right;
      }
      input{
        display: block;
        line-height: 28px;
        height: 28px;
        width: 206px;
        font-size: 12px;
        border: 1px solid #CDD0D5;
        border-radius: 4px;
        padding-left: 10px;
        margin-left: 4px;
        float: left;
        outline: none;
      }
      .label-right {
        display: block;
        float: left;
        margin-left: -20px;
        font-size: 12px;
      }
      .envelope-note {
        box-sizing: border-box;
        width: 100%;
        text-align: left;
        padding: 0 14px;
        margin-left: 0px;
        margin-top: 10px;
      }
    }
    .envelope-tips{
      font-size: 12px;
      color: #9d9d9d;
      padding-left: 74px;
      text-align: left;
      span{
        color: #5da6fc;
      }
    }
    .total-money{
      font-size: 32px;
      background: none;
      text-align: center;
      margin: 20px auto 20px;
      line-height: 45px;
    }
    .pay-box {
      display: flex;
      justify-content: space-around;
      width: 255px;
      margin: 14px auto 5px;
      font-size: 12px;
      align-items: center;
      label {
        display: flex;
        align-items: center;
        /*margin-left: 20px;*/
        vertical-align: middle;
        span{
          margin-left: 5px;
        }
        img{
          margin-left: 5px;
        }
      }
    }
  }
  .btnsbox{
    margin-top: 20px;
    .btn{
      display: inline-block;
      width: 284px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      background: #fc5659;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &.disabled{
        opacity: .6;
        cursor: default;
      }
      &.btn-light-red:hover{
        background: #c51f1d;
      }
    }
  }
 .payment-dialog-wechat-qr {
   position: absolute;
   text-align: center;
   top:39px;
   left: 0px;
   bottom: 0px;
   right: 0px;
   .title {
     margin-top: 40px;
     font-size: 30px;
     background: none;
     p{
       margin-bottom: 44px;
       color: #4e4e4e;
       font-size: 12px;
     }
   }
   img {
     display: inline-block;
     vertical-align: middle;
   }
   .complete {
     text-align: center;
     .pay-success{
       margin: 55px 0 0 0;
       img {
         display: inline-block;
         width: 41px;
       }
       p{
         color: #f15c5c;
         font-weight: 700;
         margin: 10px 0px 46px;
       }
       span {
         display: inline-block;
         color: #444;
       }
       .total-money {
         font-size: 32px;
         color: #444;
         line-height: 45px;
       }
       .pay-suce{
         margin-top: 70px;
       }
     }
   }
  }
}
</style>
