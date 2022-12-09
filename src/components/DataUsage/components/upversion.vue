<template>
  <div>
    <VhallDialog
      :title="title === '升级' ? '升级并发套餐' : '购买扩展包'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="560px"
    >
      <el-form label-width="85px">
        <el-form-item label="套餐单价">
          <div class="img-box">
            <h3>
              {{
                title === '升级'
                  ? `￥${currentInfo.concurrency_fee}`
                  : `￥${currentInfo.extend_fee}`
              }}
            </h3>
            <p>{{ title === '升级' ? '元/人/月' : '元/人' }}</p>
            <span>{{ title === '升级' ? '升级套餐' : '扩展包' }}</span>
          </div>
        </el-form-item>
        <!-- :style="{width: title== '升级'? '414px' : '428px'}" -->
        <!-- :style="{width: title== '升级'? '414px' : '428px'}" -->
        <el-form-item :label="title === '升级' ? '升级到并发' : '扩展包'">
          <el-input
            v-model="number"
            oninput="this.value=this.value.replace(/[^\d]/g, '')"
            maxlength="5"
          >
            <i slot="suffix" style="font-style: normal">人</i>
          </el-input>
          <!-- <template slot="append">人</template> -->
          <p class="inputNums" v-if="title === '升级'">
            当前并发{{ currentInfo.total_concurrency }}人 {{ currentInfo.total_concurrency }}-99999
          </p>
          <p class="inputNums" v-if="title === '购买'">请输入100-99999的值</p>
        </el-form-item>
        <el-form-item label="订单信息">
          <div class="informtion">
            <div class="inform-pay">
              <h3>
                支付金额:
                <b>￥{{ totalConcurrency > 0 ? totalConcurrency : 0 }}</b>
              </h3>
              <p v-if="title === '升级'">
                有效期{{ concurrentPrice.left_months }}个月
                <span>
                  ({{ concurrentPrice.upgrade_start }}至{{ concurrentPrice.upgrade_end }})
                </span>
              </p>
            </div>
            <div class="xieyi">
              <el-checkbox v-model="checked">
                同意
                <span @click="goNetwork(title)">《微吼直播服务协议》</span>
              </el-checkbox>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="sum">
        <el-button
          type="primary"
          @click="orderExtent"
          round
          :disabled="!(checked && totalConcurrency)"
        >
          结算
        </el-button>
      </div>
      <div class="instest">
        <div class="speak">提示:</div>
        <div v-if="title === '升级'">升级套餐有效期为当前套餐剩下的完整自然月</div>
        <div v-else>
          1.购买扩展包后，观众人数达到并发上限时，仍允许观众进入
          <br />
          2.扩展包用尽后观众达到并发上限将不再允许进入，请合理购买
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="购买流量包"
      :visible.sync="dialogBuyVisible"
      :close-on-click-modal="false"
      width="560px"
    >
      <el-form label-width="70px">
        <el-form-item label="流量包">
          <div class="img-boxs">
            <div
              class="img-box img-liu"
              v-for="(item, index) in nomalBuyList"
              :key="index"
              :class="item.isChose ? 'active' : ''"
              @click="choseVersion(item)"
            >
              <h3>{{ item.flow }}GB</h3>
              <p>+{{ item.gift_flow }}GB(赠送)</p>
              <b class="isMark">{{ flowInfo.flow_fee }}元/GB</b>
              <label class="img-tangle" v-if="item.isChose">
                <img src="../../../common/images/icon-choose.png" alt="" />
              </label>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="支付金额">
          <div class="informtion">
            <div class="inform-pay">
              <h3>
                支付金额:
                <b>{{ currentPrice }}</b>
              </h3>
              <p>
                有效期至
                <span>{{ concurrentPrice.edition_valid_time }}</span>
              </p>
            </div>
            <div class="xieyi">
              <el-checkbox v-model="checked">
                同意
                <span @click="goNetwork">《微吼直播服务协议》</span>
              </el-checkbox>
            </div>
          </div>
          <!-- <el-input v-model="currentPrice" style="width: 398px" disabled></el-input> -->
          <!-- <div class="xieyi">
            <el-checkbox v-model="checked">同意<span>《微吼直播服务协议》</span></el-checkbox>
          </div> -->
        </el-form-item>
      </el-form>
      <div class="sum">
        <el-button type="primary" @click="buyProfessional" round :disabled="!checked">
          结算
        </el-button>
      </div>
      <div class="instest">
        <div class="speak">提示:</div>
        <div>
          1、量大更优惠，详询400-800-9970
          <br />
          2、优先消耗较早购买/赠送的流量包，消耗完自动启用下一个流量包
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
        flows: 0,
        number: 500,
        currentFlowPrice: '',
        nomalBuyList: [],
        currentInfo: {},
        flowInfo: {}
      };
    },
    watch: {
      dialogBuyVisible() {
        if (this.dialogBuyVisible) {
          this.checked = false;
          this.flowInfo = this.concurrentPrice.flow;
          (this.nomalBuyList = this.flowInfo.plans),
            this.nomalBuyList.map(item => (item.isChose = false));
          this.flows = this.nomalBuyList[0].flow;
          this.nomalBuyList[0].isChose = true;
        }
      },
      dialogVisible() {
        if (this.dialogVisible) {
          this.checked = false;
          this.currentInfo = this.concurrentPrice.concurrency;
          if (this.title == '升级') {
            this.number = this.currentInfo.total_concurrency + 100;
          } else {
            this.number = 100;
          }
        }
      }
    },
    computed: {
      currentPrice() {
        if (this.dialogBuyVisible) {
          return '￥' + this.concurrentPrice.flow.flow_fee * this.flows;
        } else {
          return 0;
        }
      },
      totalConcurrency() {
        if (this.title == '升级') {
          return this.number < this.currentInfo.total_concurrency
            ? 0
            : this.currentInfo.concurrency_fee *
                (this.number - this.currentInfo.total_concurrency) *
                this.concurrentPrice.left_months;
        } else {
          return this.number < 100 ? 0 : this.currentInfo.extend_fee * this.number;
        }
      }
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      console.log(this.flowInfo, '111111111111');
    },
    methods: {
      choseVersion(items) {
        this.flows = items.flow;
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
            this.$message({
              message: `需要大于当前并发人数`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
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
        this.$fetch('orderFlow', params)
          .then(res => {
            this.goPayList(res.data.order_id);
          })
          .catch(res => {
            this.$message({
              message: res.msg || '信息获取异常',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.dialogBuyVisible = false;
          });
      },
      payUpgradeList() {
        let params = {
          user_id: this.userId,
          number: this.number
        };
        this.$fetch('orderUpgrade', params)
          .then(res => {
            this.goPayList(res.data.order_id);
          })
          .catch(res => {
            this.$message({
              message: res.msg || '信息获取异常',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.dialogVisible = false;
          });
      },
      payExtentList() {
        let params = {
          user_id: this.userId,
          number: this.number
        };
        this.$fetch('orderExtend', params)
          .then(res => {
            this.goPayList(res.data.order_id);
          })
          .catch(res => {
            this.dialogVisible = false;
            this.$message({
              message: res.msg || '信息获取失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(e);
          });
      },
      changeInput() {
        if (this.title == '购买' && this.number < 100) {
          this.$message({
            message: `请输入大于100的扩展包`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        if (
          this.title == '升级' &&
          this.number <= this.concurrentPrice.concurrency.total_concurrency
        ) {
          this.$message({
            message: `请输入比当前并发数大的值`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
      },
      goNetwork(title) {
        let k = title === '升级' ? 100691 : title === '购买' ? 100694 : 100705;
        this.$vhall_paas_port({
          k: k,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        let href = `https://e.vhall.com/home/vhallapi/serviceagreement`;
        window.open(href, '_blank');
      }
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
  /deep/.el-input__inner {
    padding: 0 12px;
  }
  /deep/.el-form-item__label {
    color: #1a1a1a;
    font-family: @fontMedium;
  }
  /deep/.el-dialog__body {
    padding: 20px;
  }
  /deep/.el-input-group__append {
    background: #fff;
    padding: 0 5px;
    color: #666;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    font-size: 16px;
    font-family: @fontRegular;
    font-weight: 600;
    color: #fb3a32;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #666;
  }
  /deep/.el-input__suffix {
    right: 12px;
  }
  .img-box {
    width: 182px;
    height: 104px;
    line-height: 20px;
    position: relative;
    // text-align: center;
    background: rgba(255, 235, 235, 0.5);
    border-radius: 4px;
    border: 1px solid #fed8d6;
    h3 {
      margin-top: 33px;
      font-size: 16px;
      color: #fb3a32;
      text-align: center;
      font-weight: 700;
    }
    p {
      font-size: 14px;
      text-align: center;
      color: #999;
    }
    span {
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      background: #fb3a32;
      border-radius: 0px 0px 12px 2px;
      font-size: 12px;
      padding: 1px 8px;
    }
  }
  .img-boxs {
    display: flex;
    justify-content: space-between;
    .img-liu {
      width: 127px;
      height: 120px;
      position: relative;
      // margin-right: 24px;
      cursor: pointer;
      transition: all 0.15s ease-in;
      .isMark {
        display: inline-block;
        font-weight: normal;
        margin-top: 23px;
        color: #fff;
        background: linear-gradient(270deg, #ff7a00 0%, #ffad2d 100%);
        border-radius: 0px 12px 0px 4px;
        font-size: 12px;
        padding: 1px 8px;
      }
      .img-tangle {
        position: absolute;
        right: -1px;
        top: -1px;
        width: 20px;
        height: 20px;
        font-size: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        // border: 1px solid transparent;
      }
      &.active {
        // box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.3);
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border: 1px solid #fb3a32;
      }
    }
  }
  .inputNums {
    line-height: 20px;
    padding-top: 8px;
    color: #999;
  }
  .informtion {
    width: 414px;
    .inform-pay {
      max-height: 90px;
      background: #f7f7f7;
      border-radius: 4px;
      font-family: @fontRegular;
      padding: 5px 0 15px 12px;
      h3 {
        font-size: 14px;
        font-weight: 400;
        color: #1a1a1a;
        height: 30px;
        b {
          font-size: 24px;
          font-weight: 400;
          color: #fb3a32;
        }
      }
      p {
        font-size: 14px;
        color: #666;
        height: 20px;
        margin-bottom: 15px;
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
    }
  }
  .instest {
    display: flex;
    line-height: 20px;
    padding: 20px 0 24px 20px;
    color: #999;
    .speak {
      padding-right: 10px;
      color: #999;
    }
  }
</style>
