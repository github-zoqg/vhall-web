<template>
  <div class="pay-list">
    <h1>订单支付</h1>
    <el-card class="pay-main">
      <h2>订单信息</h2>
      <el-table
        :data="tableList"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height: '56px'}"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="物品名称"
          >
        </el-table-column>
        <el-table-column
          prop="content"
          label="购买内容"
          >
        </el-table-column>
        <el-table-column
          prop="type"
          label="订单类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fee"
          label="金额"
          width="180">
        </el-table-column>
      </el-table>
      <div class="total">
        <p>总金额: <span>￥{{totalFee}}.00</span> </p>
      </div>
        <div class="pay-method">
          <p>支付方式</p>
          <div class="pay-list">
            <div class="pay-item" :class="isChecked ? 'isActive' : ''" @click="changeColor">
              <label class="img-tangle" v-show="isChecked">
                <i class="el-icon-check"></i>
              </label>
              <img src="../../common/images/v35-webinar.png" alt="">
            </div>
            <div class="pay-item" :class="isChecked ? '' : 'isActive'" @click="changeColor">
               <label class="img-tangle" v-show="!isChecked" >
                <i class="el-icon-check"></i>
              </label>
              <img src="../../common/images/v35-webinar.png" alt="">
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
      tableList: []
    };
  },
  created() {
    if (this.$route.query.type == '1') {
      // 专业版
      this.payProfessionalList();
    } else if (this.$route.query.type == '2') {
      //流量版
      this.payFlowList();
    }else if (this.$route.query.type == '3') {
      //升级并发
      this.payUpgradeList();
    } else {
      //购买扩展买
      this.payExtentList();
    }
  },
  methods: {
    changeColor() {
      this.isChecked = !this.isChecked;
    },
    payProfessionalList() {
      this.tableList = [];
      let params = {
        user_id: this.$route.query.userId
      };
      this.$fetch('orderProfessional', params).then(res =>{
        this.totalFee = res.data.total_fee;
        this.tableList.push({
          id: res.data.order_id,
          name: res.data.product_name,
          content: res.data.content,
          type: res.data.type,
          fee: res.data.total_fee
        });
        console.log(res.data);
      }).catch(e=>{
        console.log(e);
      });
    },
    payFlowList() {
      this.tableList = [];
      let params = {
        user_id: this.$route.query.userId,
        number: this.$route.query.number
      };
      this.$fetch('orderFlow', params).then(res =>{
        this.totalFee = res.data.total_fee;
        this.tableList.push({
          id: res.data.order_id,
          name: res.data.product_name,
          content: res.data.content,
          type: res.data.type,
          fee: res.data.total_fee
        });
        // console.log(res.data);
      }).catch(e=>{
        console.log(e);
      });
    },
    payUpgradeList() {
      this.tableList = [];
      let params = {
        user_id: this.$route.query.userId,
        number: this.$route.query.number
      };
      this.$fetch('orderUpgrade', params).then(res =>{
        this.totalFee = res.data.total_fee;
        this.tableList.push({
          id: res.data.order_id,
          name: res.data.product_name,
          content: res.data.content,
          type: res.data.type,
          fee: res.data.total_fee
        });
        // console.log(res.data);
      }).catch(e=>{
        console.log(e);
      });
    },
    payExtentList() {
      this.tableList = [];
      let params = {
        user_id: this.$route.query.userId,
        number: this.$route.query.number
      };
      this.$fetch('orderExtend', params).then(res =>{
        this.totalFee = res.data.total_fee;
        this.tableList.push({
          id: res.data.order_id,
          name: res.data.product_name,
          content: res.data.content,
          type: res.data.type,
          fee: res.data.total_fee
        });
        // console.log(res.data);
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
     /deep/.el-table td, .el-table th{
        padding: 16px 0;
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
