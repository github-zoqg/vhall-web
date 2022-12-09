<template>
  <div class="pay-list">
    <h1>订单支付</h1>
    <div class="pay-main">
      <h2>订单信息</h2>
      <div class="table-order table-order_1">
        <div class="order-item">商品名称</div>
        <div class="order-item">购买内容</div>
        <div class="order-item">订单类型</div>
        <div class="order-item" style="text-align: right">金额</div>
      </div>
      <div class="table-order">
        <div class="order-item">{{ payInfo.type | orderTypeText }}套餐</div>
        <div class="order-item">{{ payInfo.content }}</div>
        <div class="order-item">{{ payInfo.type | orderTypeText }}</div>
        <div class="order-item" style="text-align: right">{{ payInfo.amount }}</div>
      </div>
      <div class="table-order" v-if="payInfo.arrears">
        <div class="order-item">{{ payInfo.arrears.product_name }}</div>
        <div class="order-item">{{ payInfo.arrears.content }}</div>
        <div class="order-item">{{ payInfo.arrears.type | orderTypeText }}</div>
        <div class="order-item" style="text-align: right">{{ payInfo.arrears.fee }}</div>
      </div>
      <div class="table-order_2">
        <p>
          总金额：
          <span>￥{{ payInfo.total_amount }}</span>
        </p>
      </div>
      <div class="pay-over-time" v-if="timeOut">
        <p><img src="../../common/images/pay-fail.png" alt="" /></p>
        <p>支付超时</p>
        <span @click="repurchase">重新购买</span>
      </div>
      <div class="pay-method" v-if="time != '00分00秒'">
        <p>支付方式</p>
        <div class="pay-list">
          <div
            class="pay-item"
            @click="changeColor('1')"
            :class="isChecked == '1' ? 'isActive' : ''"
          >
            <icon icon-class="saaszhifubao" class="payColor"></icon>
            <span>支付宝</span>
            <label class="img-tangle" v-if="isChecked == '1'">
              <img src="../../common/images/icon-choose.png" alt="" />
            </label>
          </div>
          <div
            class="pay-item"
            @click="changeColor('2')"
            :class="isChecked == '2' ? 'isActive' : ''"
          >
            <icon icon-class="saasweixinzhifu" class="weixinColor"></icon>
            <span>微信</span>
            <label class="img-tangle" v-if="isChecked == '2'">
              <img src="../../common/images/icon-choose.png" alt="" />
            </label>
          </div>
        </div>
        <el-dialog
          title="支付"
          :visible.sync="dialogBuyVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="340px"
        >
          <div class="isPay">
            <h3>订单支付中...</h3>
            <div class="reBtn">
              <span class="first-span" @click="dialogBuyVisible = false">其他支付方式</span>
              <span class="second-span" @click="finishPay">完成支付</span>
            </div>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogweiXinVisible"
          width="320px"
          title="支付"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="isPay">
            <div class="reBtn">
              <img :src="payCode" alt="" />
              <p class="line-text">请用微信扫描二维码,完成支付</p>
              <el-button size="medium" type="primary" round @click="finishPay">完成支付</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="down-time" v-if="!timeOut">
      <p>
        <i class="iconfont-v3 saasicon-time"></i>
        请在
        <span>{{ time }}</span>
        内完成支付
      </p>
    </div>
  </div>
</template>
<script>
  import Env from '@/api/env';
  export default {
    data() {
      return {
        isChecked: '1',
        timeOut: false,
        dialogBuyVisible: false,
        dialogweiXinVisible: false,
        payCode: '',
        diffSetTime: null,
        time: '00分00秒',
        method: 'ALIPAY',
        payInfo: {},
        arrearInfo: {} //欠费订单
      };
    },
    created() {
      this.getPayDetail();
    },
    destroyed() {
      // window.clearTimeout(this.diffSetTime);
    },
    methods: {
      getPayDetail() {
        let params = {
          user_id: this.$route.query.userId,
          order_id: this.$route.query.orderId
        };
        this.$fetch('orderInfo', params)
          .then(res => {
            this.payInfo = res.data;
            this.downTime(
              res.data.current_time.replace(/-/g, '/'),
              res.data.expire_time.replace(/-/g, '/')
            );
          })
          .catch(res => {
            this.$message({
              message: res.msg || '获取信息失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      },
      downTime(targetStartDate, targetEndDate) {
        let targetStart = new Date(targetStartDate);
        let targetEnd = new Date(targetEndDate);
        if (targetEnd.getTime() - targetStart.getTime() < 0) {
          this.timeOut = true;
          return false;
        } else {
          console.log(this.timeOut, '???????????????????');
          let diff = targetEnd.getTime() - targetStart.getTime();
          targetStart.setTime(targetStart.getTime() + 1000);
          let day = Math.floor(diff / (24 * 3600 * 1000));
          let limit1 = diff % (24 * 3600 * 1000);
          let hour = Math.floor(limit1 / (3600 * 1000));

          let limit2 = limit1 % (3600 * 1000);
          let minute = Math.floor(limit2 / (60 * 1000));
          minute = minute > 9 ? minute : `0${minute}`;
          let limit3 = limit2 % (60 * 1000);
          let second = Math.floor(limit3 / 1000);
          second = second > 9 ? second : `0${second}`;
          this.time = `${minute}分${second}秒`;
          if (diff) {
            let diffSetTime = window.setTimeout(() => {
              this.downTime(targetStart, targetEnd);
              window.clearTimeout(diffSetTime);
            }, 1000);
          } else {
            this.timeOut = true;
            this.time = '00分00秒';
            return this.time;
          }
        }
      },
      changeColor(index) {
        this.isChecked = index;
        this.payOrder(index);
      },
      payOrder(index) {
        let params = {
          user_id: this.$route.query.userId,
          order_id: this.$route.query.orderId,
          type: index
        };
        if (index == 1) {
          params.show_url = `${process.env.VUE_APP_WEB_URL}/finance/infoDetail`;
        }
        this.$fetch('payOrder', params)
          .then(res => {
            if (index == '1') {
              this.dialogBuyVisible = true;
              this.method = 'ALIPAY';
              window.open(res.data.link);
            } else {
              this.dialogweiXinVisible = true;
              this.method = 'WEIXIN';
              this.getweiXinCode(res.data.link);
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || '操作失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      },
      getweiXinCode(link) {
        this.payCode = `${Env.staticLinkVo.aliQr}${link}`;
      },
      repurchase() {
        this.$router.push({
          path: '/finance/info'
        });
      },
      // 点击完成支付
      finishPay() {
        this.$router.push({
          path: '/finance/infoDetail'
        });
        // let params = {
        //   channel: this.method,
        //   biz_order_no: `${this.method.toLowerCase()}_${this.payInfo.order_id}`,
        //   total_fee: this.payInfo.amount,
        //   pay_time: this.payInfo.create_time,
        //   pay_status: 'SUCCESS'
        // }
        // this.$fetch('finishPayList', params).then(res => {
        //   this.$router.push({
        //     path: '/finance/infoDetail'
        //   });
        // }).catch(res => {
        //   this.$message({
        //     message: res.msg || "操作异常",
        //     showClose: true,
        //     // duration: 0,
        //     type: 'error',
        //     customClass: 'zdy-info-box'
        //   });
        //   console.log(res);
        // })
      }
    }
  };
</script>
<style lang="less" scoped>
  .pay-list {
    color: #1a1a1a;
    .el-table td,
    .el-table th {
      height: 56px;
    }
    /deep/.el-card {
      box-shadow: none;
    }
    .down-time {
      position: fixed;
      top: 6px;
      left: 40%;
      z-index: 100;
      p {
        height: 52px;
        line-height: 52px;
        width: 400px;
        text-align: center;
        background: #fb3a32;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        i {
          font-size: 20px;
          vertical-align: middle;
        }
        span {
          display: inline-block;
          font-size: 14px;
          width: 63px;
        }
      }
    }
    .pay-over-time {
      text-align: center;
      margin-top: 20px;
      span {
        font-size: 12px;
        color: #fb3a32;
        cursor: pointer;
      }
    }
    h1 {
      font-size: 22px;
      font-family: @fontSemibold;
      color: #1a1a1a;
      margin-bottom: 24px;
    }
    .pay-main {
      // padding: 8px;
      background: #fff;
      padding: 24px;
      border-radius: 4px;
      h2 {
        padding-left: 8px;
        font-size: 16px;
        font-weight: 400px;
        padding-bottom: 24px;
      }
      .table-order {
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: left;
        background: #ffff;
        .order-item {
          height: 56px;
          line-height: 56px;
          width: 25%;
          color: #1a1a1a;
        }
      }
      .table-order_1 {
        width: 100%;
        background: #f7f7f7;
        .order-item {
          color: #666666;
        }
      }
      .table-order_2 {
        background: #f7f7f7;
        height: 56px;
        p {
          float: right;
          height: 56px;
          line-height: 56px;
          padding-right: 24px;
          span {
            color: #fb3a32;
            font-weight: bold;
          }
        }
      }
      .total {
        background: #f7f7f7;
        border-radius: 2px;
        height: 56px;
        p {
          float: right;
          margin-right: 32px;
          font-size: 14px;
          color: #999;
          line-height: 56px;
          span {
            color: #fb3a32;
            font-size: 14px;
          }
        }
      }
      .pay-method {
        margin: 32px 0 118px 8px;
        p {
          padding-bottom: 24px;
        }
        .pay-list {
          width: 100%;
          display: flex;
          .pay-item {
            width: 280px;
            height: 88px;
            margin-right: 24px;
            border: 1px solid #ccc;
            position: relative;
            text-align: center;
            line-height: 88px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.15s ease-in;
            /deep/.svg-icon {
              font-size: 32px;
              vertical-align: middle;
            }
            .payColor {
              color: #02a9f1;
            }
            .weixinColor {
              color: #09bb07;
            }
            .img-tangle {
              position: absolute;
              right: -0;
              top: -25px;
              width: 20px;
              height: 20px;
              font-size: 0;
              img {
                width: 100%;
                height: 100%;
              }
            }
            &:hover {
              box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
              // border: 1px solid transparent;
            }
            &.isActive {
              box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
              border: 1px solid #fb3a32;
            }
            img {
              width: 100%;
              height: 88px;
            }
          }
        }
      }
    }
    .isPay {
      padding-bottom: 24px;
      p {
        text-align: center;
      }
      h3 {
        padding-bottom: 24px;
        font-size: 16px;
        color: #1a1a1a;
        text-align: center;
      }
      .reBtn {
        text-align: center;
        span {
          display: inline-block;
          width: 120px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          text-align: center;
          color: #fff;
          border-radius: 20px;
          cursor: pointer;
        }
        .first-span {
          color: #666;
          border: 1px solid #d2d2d2;
        }
        .second-span {
          background: #fb3a32;
          border: 1px solid #fb3a32;
          color: #fff;
          margin-left: 10px;
        }
        img {
          width: 132px;
          height: 125px;
        }
        .line-text {
          padding-top: 15px;
        }
      }
    }
  }
</style>
