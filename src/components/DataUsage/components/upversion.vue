<template>
  <div>
    <el-dialog
      :title="title === '升级'? '升级并发套餐' : '购买扩展包'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form label-width="85px" :model="advertisement">
        <el-form-item label="套餐单价">
          <div class="img-box"></div>
        </el-form-item>
        <el-form-item :label="title === '升级'? '升级到并发' : '扩展包'">
          <el-input v-model="advertisement.nums" style="width: 300px"
            ><template slot="append">人</template></el-input
          >
          <p class="inputNums">当前并发20人 20-99999</p>
        </el-form-item>
        <el-form-item label="订单信息">
          <div class="informtion">
            <div class="inform-pay">
              <h3>支付金额: <b>￥6753.00</b></h3>
              <p>有效期10个月<span> (2020-10-13至2020-12-10)</span></p>
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
          @click="dialogVisible = false"
          round
          size="medium"
          :disabled="!checked"
          >结算</el-button
        >
      </div>
      <div class="instest">
        <div class="speak">说明</div>
        <div v-if="title==='升级'">
          升级套餐有效期为当前套餐剩下的完整自然月
        </div>
        <div v-else>
          1.购买扩展包后，观众人数达到并发上限时，仍允许观众进入<br />2.扩展包用尽后观众达到并发上限将不再允许进入，请合理购买
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="升级并发套餐"
      :visible.sync="dialogBuyVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form label-width="85px" :model="advertisement">
        <el-form-item label="套餐单价">
          <div class="img-box"></div>
        </el-form-item>
        <el-form-item label="升级到并发">
          <el-input v-model="advertisement.nums" style="width: 300px"
            ><template slot="append">人</template></el-input
          >
          <p class="inputNums">当前并发20人 20-99999</p>
        </el-form-item>
        <el-form-item label="订单信息">
          <div class="informtion">
            <div class="inform-pay">
              <h3>支付金额: <b>￥6753.00</b></h3>
              <p>有效期10个月<span> (2020-10-13至2020-12-10)</span></p>
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
          @click="dialogVisible = false"
          round
          size="medium"
          :disabled="!checked"
          >结算</el-button
        >
      </div>
      <div class="instest">
        <div class="speak">说明</div>
        <div>
          1.时间和符号和经济实力尽快<br />2.扩展包是否是哦分是关键还是肯德基
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['title'],
  data() {
    return {
      dialogVisible: false,
      dialogBuyVisible: false,
      checked: false,
      advertisement: {
        nums: 120,
      },
    };
  },
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
  font-family: PingFangSC-Medium, PingFang SC;
}
/deep/.el-form-item__label {
  color: #1a1a1a;
  font-family: PingFangSC-Medium, PingFang SC;
}
/deep/.el-dialog__body {
  padding: 20px;
}
.img-box {
  width: 182px;
  height: 104px;
  border: 1px solid #ccc;
}
.inputNums {
  line-height: 20px;
  padding-top: 8px;
}
.informtion {
  width: 300px;
  .inform-pay {
    height: 90px;
    background: #f7f7f7;
    border-radius: 4px;
    font-family: PingFangSC-Regular, PingFang SC;
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
  .xieyi {
    font-size: 14px;
    color: #666;
    span {
      color: #3562fa;
    }
  }
}
.sum {
  width: 100%;
  height: 50px;
  .el-button {
    float: right;
    padding: 10px 45px;
  }
}
.instest {
  display: flex;
  padding-left: 20px;
  line-height: 20px;
  margin-top: 10px;
  .speak {
    padding-right: 10px;
  }
}
</style>
