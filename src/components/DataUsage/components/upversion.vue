<template>
  <div>
    <VhallDialog
      :title="title === '升级'? '升级并发套餐' : '购买扩展包'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="560px"
    >
      <el-form label-width="85px">
        <el-form-item label="套餐单价">
          <div class="img-box">
            <h3>{{ title === '升级'?  `￥${ concurrentPrice.concurrency_fee }` : `￥${ concurrentPrice.extend_fee }`}}</h3>
            <p>{{ title === '升级'? '元/人/月' : '元/人'}}</p>
            <span>{{ title === '升级'? '升级套餐' : '扩展包'}}</span>
          </div>
        </el-form-item>
        <el-form-item :label="title === '升级'? '升级到并发' : '扩展包'">
          <el-input v-model="number" style="width: 398px"
            oninput="this.value=this.value.replace(/[^\d]/g, '')"><template slot="append">人</template></el-input
          >
          <p class="inputNums">当前并发20人 20-99999</p>
        </el-form-item>
        <el-form-item label="订单信息">
          <div class="informtion">
            <div class="inform-pay">
              <h3>支付金额: <b>{{ title === '升级'? concurrentPrice.concurrency_fee * number :  concurrentPrice.extend_fee * number }}</b></h3>
              <p>有效期{{ concurrentPrice.left_months }}个月<span> ({{ concurrentPrice.upgrade_start }}至{{ concurrentPrice.upgrade_end }})</span></p>
            </div>
            <div class="xieyi">
              <el-checkbox v-model="checked"
                >同意<span>《微吼直播服务协议》</span></el-checkbox
              >
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="sum">
        <el-button
          type="primary"
          @click="orderExtent"
          round
          size="medium"
          :disabled="!checked"
          >结算</el-button
        >
      </div>
      <div class="instest">
        <div class="speak">说明:</div>
        <div v-if="title==='升级'">
          升级套餐有效期为当前套餐剩下的完整自然月
        </div>
        <div v-else>
          1.购买扩展包后，观众人数达到并发上限时，仍允许观众进入<br />2.扩展包用尽后观众达到并发上限将不再允许进入，请合理购买
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="购买流量包"
      :visible.sync="dialogBuyVisible"
      :close-on-click-modal="false"
      width="560px"
    >
      <el-form label-width="85px">
        <el-form-item label="流量包">
          <div class="img-boxs">
            <div class="img-box img-liu" v-for="(item, index) in nomalBuyList" :key="index" :class="item.isChose ? 'active' : ''" @click="choseVersion(item)">
              <h3>{{ item.title }}</h3>
              <p>{{ item.send }}</p>
              <b class="isMark">{{ item.price }}</b>
              <label class="img-tangle" v-if="item.isChose">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="支付金额">
          <el-input v-model="currentPrice" style="width: 398px" disabled></el-input>
          <div class="xieyi">
            <el-checkbox v-model="checked">同意<span>《微吼直播服务协议》</span></el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div class="sum">
        <el-button
          type="primary"
          @click="buyProfessional"
          round
          :disabled="!checked"
          >结算</el-button
        >
      </div>
      <div class="instest">
        <div class="speak">说明:</div>
        <div>
          1、量大更优惠，详询400-800-9970<br />2、优先消耗较早购买/赠送的流量包，消耗完自动启用下一个流量包<br />3、自启用之日起，购买的流量包有效期为一年 <br />4、流量包到期后自动失效
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';
export default {
  props: ['title', 'concurrentPrice'],
  data() {
    return {
      dialogVisible: false,
      dialogBuyVisible: false,
      checked: false,
      flows: 500,
      number: 120,
      nomalBuyList: [
        {
          title: '500GB',
          send: '+20GB(赠送)',
          price: '8元/GB',
          isChose: true,
          numFlow: 500
        },
        {
          title: '1000GB',
          send: '+50GB(赠送)',
          price: '8元/GB',
          isChose: false,
          numFlow: 1000
        },
        {
          title: '2000GB',
          send: '+20GB(赠送)',
          price: '8元/GB',
          isChose: false,
          numFlow: 2000
        }
      ]
    };
  },
  computed: {
    currentPrice() {
      return '￥' + this.concurrentPrice.flow_fee * this.flows;
    }
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
  },
  methods: {
    choseVersion(items) {
      this.flows = items.numFlow;
      this.nomalBuyList.map(item => {
        item.isChose = false;
        items.isChose = true;
      });
    },
    // 升级扩展、并发
    orderExtent() {
      // type 3:升级并发  4:购买扩展包
      if (this.title == '升级') {
         if (this.number < this.concurrentPrice.total_concurrency) {
          this.$message.error('需要大于当前并发人数');
          return;
        }
        this.payUpgradeList();
      } else {
        this.payExtentList();
      }
    },
    // 购买专业版、流量
    buyProfessional() {
      // type 1:购买专业版  2:购买流量版
      this.payFlowList();
    },
    goPayList(id) {
      this.$router.push({
        path: '/finance/payOrder',
        query: {
          userId: this.userId,
          orderId: id
        }
      });
    },
    payFlowList() {
      let params = {
        user_id: this.userId,
        number: this.flows
      };
      this.$fetch('orderFlow', params).then(res =>{
        this.goPayList(res.data.order_id);
        this.flows = 500;
      }).catch(e=>{
        this.dialogBuyVisible = false;
        console.log(e);
      });
    },
    payUpgradeList() {
      let params = {
        user_id: this.userId,
        number: this.number
      };
      this.$fetch('orderUpgrade', params).then(res =>{
        this.goPayList(res.data.order_id);
        this.number = 120;
      }).catch(e=>{
        this.dialogVisible = false;
        console.log(e);
      });
    },
    payExtentList() {
      let params = {
        user_id: this.userId,
        number: this.number
      };
      this.$fetch('orderExtend', params).then(res =>{
       this.goPayList(res.data.order_id);
      }).catch(e=>{
        this.dialogVisible = false;
        console.log(e);
      });
    },
  }
};
</script>
<style lang="less" scoped>
/deep/.el-upload {
  border: 1px solid #ccc;
}
/deep/.el-dialog__title {
  font-weight: 700;
  font-size: 16px;
  color: #1a1a1a;
  font-family: @fontMedium;
}
/deep/.el-form-item__label {
  color: #1a1a1a;
  font-family: @fontMedium;
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-input__inner{
  border-right-color: transparent;
}
/deep/.el-input-group__append{
  background: #fff;
  padding: 0 5px;
  color: #666;
}
/deep/.el-input.is-disabled .el-input__inner{
  font-size: 16px;
  font-family: @fontRegular;
  font-weight: 600;
  color: #FB3A32;
}
.img-box {
  width: 182px;
  height: 104px;
  line-height: 20px;
  position: relative;
  // text-align: center;
  background: rgba(255, 235, 235, 0.5);
  border-radius: 4px;
  border: 1px solid #FED8D6;
  h3{
    margin-top: 33px;
    font-size: 16px;
    color:#FB3A32;
    text-align: center;
    font-weight: 700;
  }
  p{
    font-size: 14px;
    text-align: center;
    color:#999;
  }
  span{
    position: absolute;
    top:0;
    left:0;
    color:#fff;
    background: #FB3A32;
    border-radius: 0px 0px 12px 2px;
    font-size: 12px;
    padding:1px 8px;
  }
}
.img-boxs{
  display: flex;
  .img-liu{
    width: 116px;
    height: 120px;
    position: relative;
    margin-right: 25px;
    cursor: pointer;
    .isMark{
      display: inline-block;
      font-weight: normal;
      margin-top: 24px;
      color:#fff;
      background: linear-gradient(270deg, #FF7A00 0%, #FFAD2D 100%);
      border-radius: 0px 12px 0px 4px;
      font-size: 12px;
      padding:1px 8px;
    }
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
  }
  .active{
    box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.3);
    border: 1px solid #FB3A32;
  }
}
.inputNums {
  line-height: 20px;
  padding-top: 8px;
}
.informtion {
  width: 398px;
  .inform-pay {
    height: 90px;
    background: #f7f7f7;
    border-radius: 4px;
    font-family: @fontRegular;
    padding: 15px 0 15px 12px;
    h3 {
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      height: 20px;
      b {
        font-size: 16px;
        font-weight: 400;
        color: #fb3a32;
      }
    }
    p {
      font-size: 14px;
      color: #666;
      height: 20px;
      margin-top: 8px;
      span {
        color: #999;
      }
    }
  }
}
.xieyi {
    font-size: 14px;
    color: #666;
    span {
      color: #3562fa;
    }
  }
.sum {
  width: 100%;
  height: 50px;
  .el-button {
    float: right;
    padding: 10px 45px;
    margin-right: 35px;
  }
}
.instest {
  display: flex;
  padding-left: 20px;
  line-height: 20px;
  padding: 10px 0;
  .speak {
    padding-right: 10px;
  }
}
</style>
