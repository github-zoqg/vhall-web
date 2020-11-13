<template>
  <div class="account-income">
    <div class="title-data">
      <span>账户收益</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.账户收益包含直播收益和红包收益<br>2.直播收益：观众对主办方打赏的金额，包含门票、打赏、礼物道具<br>3.红包收益：作为观众身份抢到主办方发送的红包，以及主办方发送红包后未被领取完，会退款到红包收益
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="live-come">
          <h3>直播收益</h3>
          <div class="live-all">
            <div class="all-come">
              <p>总收益（元）</p>
              <h1>2805.00</h1>
            </div>
            <div class="all-come">
              <p>可用金额（元）
                <span @click="cash('直播')">提现</span>
                <el-tooltip effect="dark" placement="right-start">
                  <div slot="content">
                    1. 大于800元的提现审核，用户提交后无需人工审核，实现程序化自动到账<br>
                    2. 小于或等于800的需要线下审核提现<br>
                    3. 不管是人工审核还是自动审核，在admin中都需要有提现记录，进行对账审计
                  </div>
                  <el-button
                    circle
                    icon="el-icon-question"
                    class="button-tip"
                  ></el-button>
                </el-tooltip>
              </p>
              <h1>2805.00</h1>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" >
        <el-card class="money-come">
          <h3>红包收益</h3>
          <div class="live-all">
            <div class="all-come">
              <p>总收益（元）</p>
              <h1>2805.00</h1>
            </div>
            <div class="all-come">
              <p>可用金额（元）
                <span @click="cash('红包')">提现</span>
                <el-tooltip effect="dark" placement="right-start">
                  <div slot="content">
                    1. 大于800元的提现审核，用户提交后无需人工审核，实现程序化自动到账<br>
                    2. 小于或等于800的需要线下审核提现<br>
                    3. 不管是人工审核还是自动审核，在admin中都需要有提现记录，进行对账审计
                  </div>
                  <el-button
                    circle
                    icon="el-icon-question"
                    class="button-tip"
                  ></el-button>
                </el-tooltip>
              </p>
              <h1>2805.00</h1>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="listTab">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="直播收益明细" name="1"></el-tab-pane>
        <el-tab-pane label="红包收益明细" name="2"></el-tab-pane>
        <search-area
          ref="searchIncome"
          :searchAreaLayout="searchAccount"
          @onSearchFun="getIncomeList('search')"
        >
        </search-area>
        <table-list
          ref="tableIncome"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="isCheckout"
          :isHandle="isHandle"
          :width="120"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getIncomeList"
          >
        </table-list>
      </el-tabs>
    </el-card>
    <cash-box :type="1" ref="cashBox"></cash-box>
  </div>
</template>

<script>
import cashBox from './components/cashBox';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 100,
      searchAccount: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          key: "accountTitle"
        }
      ],
      isCheckout: false,
      isHandle: true,
      tableList: [
        {
          id: '1',
          title: '秒吼吼吼吼',
          allIncome: '200',
          money: '100',
          content: '123',
          price: '花'
        },
        {
          id: '2',
          title: '秒吼吼吼222吼',
          allIncome: '1000',
          money: '1000',
          content: '1023',
          price: '火箭'
        }
      ],
      tabelColumn: [],
      liveColumns: [
        {
          label: '活动id',
          key: 'id',
          width: 120
        },
        {
          label: '标题',
          key: 'title'
        },
        {
          label: '总收益',
          key: 'allIncome',
          width: 100
        },
        {
          label: '门票收益',
          key: 'money',
          width: 120,
        },
        {
          label: '打赏收益',
          key: 'content',
          width: 120
        },
        {
          label: '礼物',
          key: 'price',
          width: 120
        }
      ],
      meneyColumns: [
        {
          label: '活动id',
          key: 'id',
          width: 120
        },
        {
          label: '标题',
          key: 'title',
        },
        {
          label: '发红包用户',
          key: 'user',
          width: 200
        },
        {
          label: '红包类型',
          key: 'type',
          width: 120,
        },
        {
          label: '领取时间',
          key: 'time',
          width: 150
        },
        {
          label: '领取金额',
          key: 'money',
          width: 120
        }
      ],
      tableRowBtnFun: [
        {
          name: "详情",
          methodName: 'detail'
        }
      ]
    };
  },
  components: {
    cashBox
  },
  created() {
    this.tabelColumn = this.liveColumns;
  },
  watch: {
    activeIndex(value) {
      if (parseInt(value) === 2) {
        this.isHandle = false;
        this.tabelColumn = this.meneyColumns;
      } else {
        this.isHandle = true;
        this.tabelColumn = this.liveColumns;
      }
    }
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    handleClick(tab) {
      this.activeIndex = tab.name;
      this.$refs.searchIncome.searchParams = {};
      this.$refs.tableIncome.pageInfo.pageNum = 1;
    },
    getIncomeList(params) {
      let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
      let formParams = this.$refs.searchIncome.searchParams; //获取搜索参数
      let paramsObj = {};
      if (params === 'search') {
        pageInfo.pageNum= 1;
      }
      for (let i in formParams) {
        if (i === 'searchTime') {
          paramsObj['searchStartDate'] = formParams[i][0];
          paramsObj['searchEndDate'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
    },
    cash(title) {
      console.log(title);
      this.$refs.cashBox.dialogCashVisible = true;
    },
    detail(that, { rows }) {
      that.$router.push({
        name: 'incomeDetail',
        query: {
          id: rows.no
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
  .account-income{
  /deep/.el-button.is-circle{
    padding:0px 3px;
  }
  /deep/.el-card__body{
    padding: 24px 32px;

  }
  .title-data {
     /deep/.el-button {
      border: none;
      background: transparent;
    }
      margin: 10px 0 30px 0;
      text-align: left;
      line-height: 22px;
      span{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
      }
      .button-tip{
        vertical-align: top;
      }
    }
  .live-come{
    margin-right: 10px;
    height: 170px;
    h3{
      font-size: 16px;
      color: #1A1A1A;
      font-weight: 400;
      padding-bottom: 26px;
    }
  }
  .live-all{
    display: flex;
    .all-come{
      width: 50%;
      padding-left: 24px;
      p{
        font-size: 14px;
        color: #999;
        font-weight: 400px;
        padding-bottom: 5px;
      }
      h1{
        font-size: 28px;
        color:#1A1A1A;
        font-weight: bold;
        line-height: 32px;
      }
      span{
        padding: 2px 8px;
        border-radius: 10px;
        border: 1px solid #FB3A32;
        font-size: 12px;
        color:#FB3A32;
        cursor: pointer;
      }
    }
  }
  .money-come{
    margin-left: 10px;
    height: 170px;
    h3{
      font-size: 16px;
      color: #1A1A1A;
      font-weight: 400;
      padding-bottom: 26px;
    }
  }
  .listTab {
    margin-top: 24px;
  }
  }
</style>
