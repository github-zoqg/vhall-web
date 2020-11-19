<template>
  <div class="vhall-reward-wrapper">
    <div class="reward" @click="rewardClick"></div>
    <div class="reward-dialog-wrapper" v-show="showRewardDialog">
      <div class="reward-dialog">
        <div class="reward-title">
          <img
            width="24"
            height="23"
            src="../../assets/images/reward/reward-pay-23.png"
            alt="icon加载失败"
          >
          <span class="reward-title--text">打赏</span>
          <span class="reward-title--close" @click="close"></span>
        </div>
        <div class="reward-dialog-content">
          <div v-show="!wechatPay" class="reward-dialog-normal">
            <div class="reward-money">
              <div
                class="reward-money--item"
                :class="currentTab == item.tab ? 'active':''"
                @click="tabClick(item.tab)"
                v-for="item in money"
                :key="item.value"
              >{{item.value}}元</div>
              <div class="reward-money--item custom-money">
                <input
                  class="custom-money"
                  :class="customMoneyError ? 'error':''"
                  v-model.trim="customMoney"
                  @focus="customMoneyFocus"
                  type="text"
                  :placeholder="defText"
                >
              </div>
            </div>
            <div class="reward-word">
              <input
                class="reward-word-input"
                v-model="rewardWord"
                type="text"
                placeholder="很精彩，赞一个！"
                maxlength="15"
              >
            </div>
            <div class="reward-way">
              <el-radio class="reward-way-radio" v-model="radio" label="1">
                <div class="radio-label">
                  <img
                    src="//t-alistatic01.e.vhall.com/static/images/watch/alipay.png"
                    width="32"
                    height="32"
                    alt="支付宝支付"
                  >
                  <span>支付宝支付</span>
                </div>
              </el-radio>
              <el-radio class="reward-way-radio" v-model="radio" label="2">
                <div class="radio-label">
                  <img
                    src="//t-alistatic01.e.vhall.com/static/images/watch/weixin.png"
                    width="32"
                    height="32"
                    alt="微信支付"
                  >
                  <span>微信支付</span>
                </div>
              </el-radio>
            </div>
            <div class="reward-pay-btn" @click="rewardPay">支付</div>
          </div>
          <div v-show="wechatPay" class="reward-dialog-wechat-qr">
            <img width="180" height="180" :src="wechatPayImg" alt="微信付款二维码">
            <div style="color:#333;">请用微信扫描二维码</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <span class="rss-reward-down" style="display: none; margin-top: 0px;">
      <img class src="//t-alistatic01.e.vhall.com/static/img/reward-pay-down.png">
  </span>-->
</template>
<script>
import QRcode from 'qrcode';
import EventBus from '@/utils/Events';
export default {
  props: {
    roomId: {
      required: true
    }
  },
  data () {
    return {
      showRewardDialog: false,
      radio: '1', // 支付类型 1支付宝 2微信
      currentTab: 0, // 选中金额tab
      money: [
        {
          value: '1.88',
          tab: 0
        },
        {
          value: '8.88',
          tab: 1
        },
        {
          value: '88.88',
          tab: 2
        }
      ],
      customMoney: '', // 自定义金额
      customMoneyError: false, // 是否显示错误提示
      rewardWord: '很精彩，赞一个！', // 显示打赏文字
      wechatPay: false,
      wechatPayImg: '',
      defText: '打赏其他金额'
    };
  },
  mounted () {
    EventBus.$on('pay_success', e => {
      console.log('eeeeeeeeee', e);
      this.wechatPay = false; // 关闭微信二维码弹窗
    });
  },
  methods: {
    // 点击打赏
    rewardClick () {
      if (JSON.parse(sessionStorage.getItem('authInfo')).length == undefined) {
        this.showRewardDialog = true;
      } else {
        this.$parent.loginTest();
      }
    },
    rewardPay () {
      let money = null;
      let moneyReg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if ([0, 1, 2].indexOf(this.currentTab) >= 0) {
        money = this.money[this.currentTab].value;
      } else {
        money = this.customMoney;
      }
      console.log('3w4xdfsd', money);
      if (!money) {
        this.customMoneyError = true;
        this.customMoneyTemp = this.customMoney;
        this.customMoney = '金额不能为空';
        return;
      }
      if (!moneyReg.test(money)) {
        this.customMoneyError = true;
        this.customMoneyTemp = this.customMoney;
        this.customMoney = '金额格式错误';
        return;
      }

      let data = {
        reward_amount: money,
        room_id: this.roomId
      };
      if (this.radio == 1) {
        Object.assign(data, {
          channel: 'ALIPAY',
          service_code: 'CASHIER'
        });
      } else {
        Object.assign(data, {
          channel: 'WEIXIN',
          service_code: 'QR_PAY'
        });
      }
      this.$vhallFetch('reward', {...data, describe: this.rewardWord}).then(res => {
        if (res.code === 200) {
          if (this.radio == 1) {
            let link = document.createElement('a');
            link.href = res.data.pay_data;
            link.target = '_blank';
            link.click();
          } else {
            QRcode.toDataURL(
              res.data.pay_data,
              (err, url) => {
                this.wechatPay = true;
                this.wechatPayImg = url;
                console.log(err);
              }
            );
          }
        }
      });
    },
    close () {
      this.showRewardDialog = false;
      this.wechatPay = false;
    },
    customMoneyFocus () {
      this.customMoneyError = false;
      this.currentTab = 3;
      this.customMoney = this.customMoneyTemp;
    },
    tabClick (item) {
      this.currentTab = item;
      this.customMoney = this.defText;
    }
  }
};
</script>
<style lang="less">
.vhall-reward-wrapper {
  width: 100%;
  height: 100%;
  .reward {
    width: 100%;
    height: 100%;
    display: inline-block;
    background: url('../../assets/images/reward/rewardpay-3.1.4.png') center
      no-repeat;
    background-size: 32px 32px;
    cursor: pointer;
    &:hover {
      background-image: url('../../assets/images/reward/rewardpay-hover-3.1.4.png');
    }
  }
  .reward-dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1001;
    .reward-dialog {
      width: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      .reward-title {
        color: #333;
        height: 40px;
        line-height: 40px;
        font-weight: 500;
        border-bottom: 1px solid #d9d9d9;
        background: #f4f4f4;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        &--text {
          margin-left: 5px;
        }
        &--close {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: url('../../assets/images/common/icon.png') no-repeat 0 -91px;
          background-position: 0 -91px;
          background-size: 18px;
          cursor: pointer;
        }
      }
      .reward-dialog-normal {
        padding: 30px 70px 20px;
        .reward-money {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          font-size: 12px;
          &--item {
            width: 150px;
            margin-bottom: 10px;
            border-radius: 3px;
            line-height: 40px;
            display: inline-block;
            text-align: center;
            background: #e9e9e9;
            color: #a9a9a9;
            cursor: pointer;
            &.active {
              background: #f33 url('../../assets/images/reward/reward-li.png')
                no-repeat 20px center;
              color: #fff;
            }
            .custom-money {
              width: 124px;
              line-height: 26px;
              height: 26px;
              vertical-align: top;
              border-radius: 3px;
              color: #333;
              border: 1px solid #ccc;
              background: #fff;
              padding: 6px 12px;
              font-size: 12px;
              &.error {
                border: 1px solid #ff3333;
                color: #ff3333;
              }
            }
          }
        }
        .reward-word-input {
          width: 100%;
          box-sizing: border-box;
          margin-top: 15px;
          line-height: 26px;
          border-radius: 3px;
          border: 1px solid #ccc;
          background: #fff;
          padding: 6px 12px;
        }
        .reward-way {
          margin-top: 25px;
          display: flex;

          .reward-way-radio {
            display: flex;
            align-items: center;
          }
          .radio-label {
            display: inline-block;
            display: flex;
            align-items: center;
            span {
              margin-left: 10px;
            }
          }
        }
        .reward-pay-btn {
          width: 200px;
          margin: 30px auto 0;
          background: #e93a2f;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
      }
      .reward-dialog-wechat-qr {
        height: 335px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
