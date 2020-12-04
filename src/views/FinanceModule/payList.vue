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
      <div class="table-order_2">
        <p>总金额：<span>￥{{ payInfo.amount }}</span></p>
      </div>
      <div class="pay-method">
          <p>支付方式</p>
          <div class="pay-list">
            <div class="pay-item">
              <label class="img-tangle">
                <i class="el-icon-check"></i>
              </label>
            </div>
            <div class="pay-item">
               <label class="img-tangle">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </div>
          <el-dialog
            :visible.sync="dialogBuyVisible"
            :close-on-click-modal="false"
            width="340px"
          >
          <div class="isPay">
            <p>订单支付中...</p>
            <div class="reBtn">
              <span class="first-span">选择其他支付方式</span>
              <span class="second-span">完成支付</span>
            </div>
          </div>
          </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isChecked: true,
      dialogBuyVisible: false,
      totalFee: 0,
      payInfo: {},
      tableList: []
    };
  },
  created() {
    this.getPayDetail();
  },
  methods: {
    getPayDetail() {
      let params = {
        user_id: this.$route.query.userId,
        order_id: this.$route.query.orderId
      };
      this.$fetch('orderInfo', params).then(res =>{
        this.payInfo = res.data;
      }).catch(e=>{
        console.log(e);
      });
    },
    changeColor(item) {
      this.payList.map(items => {
        items.isChecked = false;
      });
      item.isChecked = true;
      let params = {
        userId: this.$route.query.userId,
        orderId: this.tableList[0].id,
        type: item.type
      };
      this.$fetch('payOrder', params).then(res =>{
        console.log(res.data);
      }).catch(e=>{
        console.log(e);
      });
    },
    choseOtherMethod() {
      console.log("1111111111");
    },
    finishPay() {
      console.log("222222222222");
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
            cursor: pointer;
            .img-tangle{
              position: absolute;
              right: 0;
              top:0;
              width: 0;
              height: 0;
              border: 10px solid transparent;
              border-right-color: #FB3A32;
              border-top-color: #FB3A32;
              i{
                color:#fff;
                position: absolute;
                top: -8px;
                right:-11px;
                font-size: 10px;
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
