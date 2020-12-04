<template>
  <div class="pay-list">
    <h1>订单支付</h1>
    <el-card class="pay-main">
      <h2>订单信息</h2>
      <div class="table-order table-order_1">
        <div class="order-item">商品名称</div>
        <div class="order-item">购买内容</div>
        <div class="order-item">订单类型</div>
        <div class="order-item">金额</div>
      </div>
      <div class="table-order">
        <div class="order-item">{{ payInfo.type | orderTypeText }}套餐</div>
        <div class="order-item">{{ payInfo.content }}</div>
        <div class="order-item">{{ payInfo.type | orderTypeText }}</div>
        <div class="order-item">{{ payInfo.amount }}</div>
      </div>
      <div class="table-order" v-if="payInfo.arrears">
        <div class="order-item">{{ payInfo.arrears.product_name }}</div>
        <div class="order-item">{{ payInfo.arrears.content }}</div>
        <div class="order-item">{{ payInfo.arrears.type | orderTypeText }}</div>
        <div class="order-item">{{ payInfo.arrears.fee }}</div>
      </div>
      <div class="table-order_2">
        <p>总金额：<span>￥{{ payInfo.amount }}</span></p>
      </div>
      <div class="pay-method">
          <p>支付方式</p>
          <div class="pay-list">
            <div class="pay-item" @click="changeColor('1')" :class="isChecked == '1' ? 'isActive' : ''">
              <icon icon-class="saaszhifubao"></icon>
              <span>支付宝</span>
              <label class="img-tangle" v-show="isChecked== '1'">
                <icon icon-class="saasicon-choose-01"></icon>
              </label>
            </div>
            <div class="pay-item" @click="changeColor('2')" :class="isChecked == '2' ? 'isActive' : ''">
              <icon icon-class="saasweixinzhifu"></icon>
              <span>微信</span>
              <label class="img-tangle" v-show="isChecked== '2'">
                <icon icon-class="saasicon-choose-01"></icon>
              </label>
            </div>
          </div>
          <el-dialog
            title="订单支付中..."
            :visible.sync="dialogBuyVisible"
            :close-on-click-modal="false"
            width="340px"
          >
          <div class="isPay">
            <div class="reBtn">
              <span class="first-span" @click="dialogBuyVisible='false'">选择其他支付方式</span>
              <span class="second-span" @click="finishPay">完成支付</span>
            </div>
          </div>
          </el-dialog>
           <el-dialog
            :visible.sync="dialogweiXinVisible"
            :close-on-click-modal="false"
            width="340px"
            title="支付"
          >
          <div class="isPay">
            <div class="reBtn">
             <img :src="payCode" alt="">
             <p>请用微信扫描二维码,完成支付</p>
            </div>
          </div>
          </el-dialog>
      </div>
    </el-card>
    <div class="down-time" v-if="!time">
      <p><i class="el-icon-warning-outline"></i> 请在<span>{{ time }}</span>内完成支付</p>
    </div>
  </div>
</template>
<script>
import QRcode from 'qrcode';
import { diffToTime } from '@/utils/general.js';
export default {
  data() {
    return {
      isChecked: '',
      dialogBuyVisible: false,
      dialogweiXinVisible: false,
      link: '',
      payCode: '30:00',
      time:'0:0',
      vm: {},
      payInfo: {},
      arrearInfo: {} //欠费订单
    };
  },
  created() {
    this.getPayDetail();
    console.log(this.time, '00000000');
  },
  methods: {
    getPayDetail() {
      let params = {
        user_id: this.$route.query.userId,
        order_id: this.$route.query.orderId
      };
      this.$fetch('orderInfo', params).then(res =>{
        this.payInfo = res.data;
        this.downTime(res.data.current_time.replace(/-/g,'/'), res.data.expire_time.replace(/-/g,'/'));
        // this.time = diffToTime(nowTime.replace(/-/g,'/') , endTime.replace(/-/g,'/'));
        // this.initPayMessage();
        // this.arrearInfo
      }).catch(e=>{
        console.log(e);
      });
    },
    downTime(targetStartDate, targetEndDate) {
      let targetStart = new Date(targetStartDate);
      let targetEnd = new Date(targetEndDate);
      if (targetEnd.getTime() - targetStart.getTime() < 0) {
        return false;
      } else {
        let diff = targetEnd.getTime() - targetStart.getTime();
        targetStart.setTime(targetStart.getTime() + 1000);
        let day = Math.floor(diff / (24 * 3600 * 1000));
        let limit1 = diff % (24 * 3600 * 1000);
        let hour = Math.floor(limit1 / (3600 * 1000));

        let limit2 = limit1 % (3600 * 1000);
        let minute = Math.floor(limit2 / (60 * 1000));

        let limit3 = limit2 % (60 * 1000);
        let second = Math.floor(limit3 / 1000);
        this.time = `${minute}:${second}`;
        if (this.time === '0:0') {
          this.$message.error('支付超时');
        }
        if (diff) {
          // console.log('diffTime', diffTime);
          let diffSetTime = window.setTimeout(() => {
            this.downTime(targetStart, targetEnd);
            window.clearTimeout(diffSetTime);
          }, 1000);
          // return diffTime;
        } else {
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
        order_id:  this.$route.query.orderId,
        type: index
      };
      this.$fetch('payOrder', params).then(res =>{
        if (index == '1') {
          this.dialogBuyVisible = true;
          window.open(res.data.link);
        } else {
          this.dialogweiXinVisible = true;
          this.getweiXinCode(res.data.link);
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    getweiXinCode(link) {
       QRcode.toDataURL(
        link,
        (err, url) => {
          console.log(err, url);
          this.payCode = url;
        }
      );
    },
    initPayMessage() {
      let that = this;
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<p>请在' + that.time + '内完成支付</p>',
        type: 'error'
      });
    },
    finishPay() {
      this.payOrder(this.isChecked);
    }
  }
};
</script>
<style lang="less" scoped>
  .pay-list{
    color: #1A1A1A;
     .el-table td, .el-table th{
        height: 56px;
      }
      .down-time{
        position: fixed;
        width: 100%;
        top: 20px;
        left: 0px;
        p{
          height: 39px;
          line-height: 39px;
          width: 400px;
          text-align: center;
          background: #fc5659;
          color:#fff;
          font-size: 14px;
          margin: auto;
          i{
            font-size: 20px;
            vertical-align: middle;
          }
          span{
            font-size: 16px;

          }
        }
      }
    h1{
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #1A1A1A;
      margin-bottom: 24px;
    }
    .pay-main{
      padding: 8px;
      h2{
        padding-left: 8px;
        font-size: 16px;
        font-weight: 400px;
        padding-bottom: 24px;
      }
      .table-order{
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: left;
        background: #Ffff;
        .order-item{
          height: 56px;
          line-height: 56px;
          width: 25%;
          color: #1A1A1A;
        }
      }
      .table-order_1{
        width: 100%;
        background: #F7F7F7;
        .order-item{
          color: #666666;
        }
      }
      .table-order_2{
         background: #F7F7F7;
         height: 56px;
         p{
          float: right;
          height: 56px;
          line-height: 56px;
          padding-right: 40px;
          span{
            color: #FB3A32;
            font-weight: bold;
          }
        }
      }
      .total{
        background: #F7F7F7;
        border-radius: 2px;
        height: 56px;
        p{
          float: right;
          margin-right: 32px;
          font-size: 14px;
          color:#999;
          line-height: 56px;
          span{
            color:#FB3A32;
            font-size: 14px;
          }
        }
      }
      .pay-method{
        margin: 32px 0 118px 8px;
        p{
          padding-bottom: 24px;
        }
        .pay-list{
          width: 100%;
          display: flex;
          .pay-item{
            width: 280px;
            height: 88px;
            margin-right: 24px;
            border: 1px solid #ccc;
            position: relative;
            text-align: center;
            line-height: 88px;
            cursor: pointer;
            /deep/.svg-icon{
              font-size: 32px;
              vertical-align: middle;
            }
            .img-tangle{
              position: absolute;
              right: 0;
              top:-40%;
              /deep/.svg-icon{
                font-size: 24px;
              }
            }
            &.isActive{
                box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.3);
                border: 1px solid #FB3A32;
              }
            img{
              width: 100%;
              height: 88px;
            }
          }
        }
      }
    }
    .isPay{
      p{
        text-align: center;
      }
      .reBtn{
        text-align: center;
        span{
          display: inline-block;
          width: 120px;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          text-align: center;
          color: #fff;
          border-radius: 2px;
          cursor: pointer;
        }
        .first-span {
          color: #666;
          border: 1px solid #d2d2d2;
        }
        .second-span {
          background: #fc5659;
          border: 1px solid #fc5659;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
  }
</style>
