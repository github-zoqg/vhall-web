<template>
    <div class="vhall-gift" @mouseout = 'outImage' >
        <div class="gift">
            <img @click = 'giftClick' src="../../assets/images/publish/gift-icon-3.1.4.png" alt="">
        </div>
        <div class="gift-all-content" v-if = 'giftContentControl'>
          <div class="gift-content" v-for = '(item,index) in imageInfo'  :key="index">
            <img v-if = 'giftContentControl' style='cursor:pointer;' @mouseover='mouseImage(index)'  @click='clickImage(index)' :src="dominImage+'/'+item.image_url" alt="">
            <div v-if='imageIndex==index' class="gift-info" >
                <img :src="dominImage+'/'+item.image_url" alt="">
                <div class="gift-right">
                    <p style="white-space: nowrap">名称： <span>{{ item.name }}</span> </p>
                    <p>价格：<span style="color: #ff911a">￥{{ item.price }} </span></p>
                    <button @click = 'sendGift(item)'>赠送</button>
                </div>
                <div class="blank">

                </div>
            </div>
          </div>
        </div>
        <!-- <div class="pay-style" v-if="checkShow">
            <span>支付宝</span>
            <span>微信</span>
            <div @click = "pay">支付</div>
        </div> -->
        <div class="payment-dialog-wrapper" v-show="payoff">
        <div class="payment-dialog" v-if = 'payoff'>
            <div class="payment-title">
              <img
                width="24"
                height="23"
                src="../../assets/images/publish/gift-icon-3.1.4.png"
                alt="icon加载失败"
              >
              <span class="payment-title--text">礼物</span>
              <span class="payment-title--close" @click="close"></span>
            </div>
            <div class="payment-dialog-content">
              <div v-show="!wechatPay" class="payment-dialog-normal">
                <div class="payment-info">
                    <img :src="dominImage+'/'+itemInfo.image_url" alt="">
                    <div>
                        <p>{{ itemInfo.name }}</p>
                        <p>
                            <span>支付金额：</span>
                            <span> {{ itemInfo.price }} </span>
                        </p>
                    </div>
                </div>
                <div class="payment-way">
                  <el-radio class="payment-way-radio" v-model="radio" label="ALIPAY">
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
                  <el-radio class="payment-way-radio" v-model="radio" label="WEIXIN">
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
                <div class="payment-pay-btn" @click="pay">支付</div>
              </div>
              <div v-show="wechatPay" class="payment-dialog-wechat-qr">
                <img width="180" height="180" :src="wechatPayImg" alt="微信付款二维码">
                <div style="color:#333;">请用微信扫描二维码</div>
              </div>
            </div>
          </div>
          </div>
    </div>
</template>
<script>
import QRcode from 'qrcode';
import EventBus from '@/utils/Events';
export default {
  props: {
    roomId: {
      type: String
    },
    vssToken: {
      required: true
    },
    interactToken: {
      type: String
    }
  },
  data () {
    return {
      dominImage: '',
      payoff: false,
      radio: 'ALIPAY',
      wechatPayImg: '',
      wechatPay: false,
      itemInfo: null,
      checkShow: false,
      imageInfo: [],
      imageIndex: null,
      giftContentControl: false,
      // imgList:['http://t-alistatic01.e.vhall.com/upload/gifts/27/18/27183f4abcc7f33af6616bd0b84c9f14.png'],
      imgList: ['http://t-alistatic01.e.vhall.com/upload/gifts/c7/b9/c7b9281b816ce168dbce382f819572f1.png', 'http://t-alistatic01.e.vhall.com/upload/gifts/ef/3c/ef3caff772cd292c235c3bbd1230204e.png', 'http://t-alistatic01.e.vhall.com/upload/gifts/be/3c/be3c4f56f551158eead7cc55b71183a2.png', 'http://t-alistatic01.e.vhall.com/upload/gifts/27/18/27183f4abcc7f33af6616bd0b84c9f14.png']
    };
  },

  created () {

  },

  mounted () {
    EventBus.$on('pay_success', e => {
      console.log('eeeeeeeeee', e);
      this.wechatPay = false; // 关闭微信二维码弹窗
    });
    this.dominImage = sessionStorage.getItem('imageDomin');
  },

  methods: {
    // 关闭支付
    close () {
      this.payoff = false;
      this.wechatPay = false;
    },
    pay () {
      let serviceCode;
      this.radio === 'ALIPAY' ? serviceCode = 'CASHIER' : serviceCode = 'QR_PAY';
      this.$fetch('sendGift', {
        gift_id: this.itemInfo.id,
        service_code: serviceCode,
        channel: this.radio,
        room_id: this.roomId
        // open_id
      }).then((res) => {
        if (res.code === 200) {
          // console.log(res)
          if (this.radio === 'ALIPAY') {
            let link = document.createElement('a');
            link.href = res.data.pay_data;
            link.target = '_blank';
            link.click();
          } else {
            /* eslint-disable */
            // this.wechatPay = true;
            let a = QRcode.toDataURL(
              res.data.pay_data,
              (err, url) => {
                this.wechatPay = true
                this.wechatPayImg = url
              }
            )
          /* eslint-disable */
          }
        }
      })
    },
    // 获取礼物列表
    getList () {
      // list
      this.$fetch('giftList', {
        room_id: this.roomId
      }).then((res) => {
        if (res.code === 200) {
          this.giftContentControl = !this.giftContentControl
          this.imageInfo = res.data ? res.data.list : []
          console.log('礼物列表',this.giftContentControl);
        }
      })
      // if (this.radio == 1) {
      //     let link = document.createElement('a')
      //     link.href = res.data.pay_data
      //     link.target = '_blank'
      //     link.click()
      // } else {
      //     let a = QRcode.toDataURL(
      //     res.data.pay_data,
      //     (err, url) => {
      //     this.wechatPay = true
      //     this.wechatPayImg = url
      //     }
      //     )
      // }
    },
    // 送礼物
    sendGift (item) {

      this.itemInfo = item
      this.imageIndex = null;
      // this.checkShow = true;
      this.payoff = true
    },
    outImage () {
      // this.imageIndex = null;
    },
    mouseImage (index) {
      this.imageIndex = index
    },
    clickImage (index) {
      this.imageIndex = index
    },
    giftClick () {
      if(JSON.parse(sessionStorage.getItem('authInfo')).length == undefined){
        //登录状态
        this.getList()
      }else {
        //非登录状态
        this.$parent.loginTest();
      }
    },
    praise () {
      this.$fetch('like', {
        room_id: this.roomId,
        num: this.times,
        'interact-token': this.interactToken
      }).then((res) => {
        if (res.code === 200) {
          console.log(res)
        }
      })
    }
  }
}
</script>
<style lang="less">
.vhall-gift {
    .gift {
        float: right;
        img {
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
    }
    .gift-all-content {
      display: inline-block;
    }
    .gift-content {
        position: relative;
        width: 30px;
        height: 33px;
        float: right;
        margin-right: 15px;
        img {
            width: 30px;
            height: 30px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 7px;

            &:hover {
                width: 35px;
                height: 35px;
                border: 1px solid rgba(255,255,255,0.2);
                margin-top: -3px;
                margin-left: 0;
            }
        }

        .gift-info {
            background: rgba(255,255,255,0.95);
            border-radius: 4px;
            position: absolute;
            top: -140px;
            left: -111px;
            z-index: 666;
            width: 210px;
            height: 84px;
            padding: 20px 20px 25px 20px;
            color: #666;
            font-size: 14px;
            white-space: nowrap;
            .blank {
                width: 0;
                height: 0;
                border-right: 10px solid transparent;
                border-left: 10px solid transparent;
                border-top: 10px solid #fff;
                position: absolute;
                bottom: -10px;
                left: 108px;
            }
            img {
                float: left;
                border: 1px solid #d2d2d2;
                width: 88px;
                height: 88px;

                &:hover {
                    margin-top: 0;
                }
            }

            div {
                float: left;
                margin-left: 10px;
                p {
                    width: 100px;
                    height: 25px;
                    line-height: 25px;
                }

                button {
                    margin-top: 6px;
                    height: 26px;
                    line-height: 20px;
                    width: 92px;
                    border: 1px solid #ff3333;
                    background-color: #ff3333;
                    border-radius: 4px;
                    color: #fff;
                    outline: none;
                    margin-right: 10px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
        }
    }
    .pay-style {
        width: 200px;
        height: 200px;
        background: #fff;
        color: #000;
        z-index: 668;
        position: absolute;
        right: 200px;
        bottom: 100px;
    }
    .payment-dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1001;
    .payment-dialog {
      width: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      .payment-title {
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
      .payment-info {
          border: 1px solid #d9d9d9;
          background: #f4f4f4;
          padding: 10px;
          width: 352px;
          height: 152px;

          img {
            width: 140px;
            height: 140px;
            float: left;
          }

          div {
              font-size: 18px;
              float: left;
              padding-left: 20px;

              p:first-of-type {
                color: #000;
                margin-top: 35px;
              }

              p:last-of-type {
                color: #000;
                span:last-of-type {
                    color: #ff3333;
                }
              }
          }
      }
      .payment-dialog-normal {
        padding: 30px 70px 20px;
        /* .payment-money {
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
              background: #f33 url('../../assets/images/payment/payment-li.png')
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
        } */
        .payment-word-input {
          width: 100%;
          box-sizing: border-box;
          margin-top: 15px;
          line-height: 26px;
          border-radius: 3px;
          border: 1px solid #ccc;
          background: #fff;
          padding: 6px 12px;
        }
        .payment-way {
          margin-top: 25px;
          display: flex;

          .payment-way-radio {
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
        .payment-pay-btn {
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
      .payment-dialog-wechat-qr {
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
