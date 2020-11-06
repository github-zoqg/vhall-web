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
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="9">
        <div class="grid-content">
          <div class="incomt-time">
            <p>直播收益<span>提现</span></p>
          </div>
          <div class="income-main">
            <div class="income-topic">
              <p>总收益（元）</p>
              <h2>2,805,763.00</h2>
            </div>
            <div class="income-topic">
              <p>可用余额（元）</p>
              <h2>12.00</h2>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content">
          <div class="incomt-time">
            <p>红包收益<span>提现</span></p>
          </div>
          <div class="income-main">
            <div class="income-topic">
              <p>总收益（元）</p>
              <h2>700.00</h2>
            </div>
            <div class="income-topic">
              <p>可用余额（元）</p>
              <h2>12.00</h2>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 0,
      searchAccount: [
        {
          type: '2',
          key: "searchDate"
        },
        {
          key: "accountTitle"
        }
      ],
      isCheckout: false,
      isHandle: true,
      tableList: [],
      tabelColumn: [],
      liveColumns: [
        {
          label: '活动id',
          key: 'no',
          width: 120
        },
        {
          label: '标题',
          key: 'time',
          width: 240
        },
        {
          label: '总收益',
          key: 'type',
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
          key: 'status',
          width: 120
        }
      ],
      meneyColumns: [
        {
          label: '活动id',
          key: 'no',
          width: 120
        },
        {
          label: '标题',
          key: 'time',
          width: 240
        },
        {
          label: '发红包用户',
          key: 'type',
          width: 100
        },
        {
          label: '红包类型',
          key: 'money',
          width: 120,
        },
        {
          label: '领取时间',
          key: 'content',
          width: 120
        },
        {
          label: '领取金额',
          key: 'status',
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
  // components: {
  // },
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
    },
    getIncomeList(params) {
      let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
      let formParams = this.$refs.searchIncome.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
      }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
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
    /deep/.el-button {
    border: none;
    background: transparent;
  }
  /deep/.el-button.is-circle{
    padding:3px;
  }
  .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      line-height: 30px;
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
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
      width: 104px;
      height: 35px;
      border-radius: 20px;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 35px;
      background: #fff;
      cursor: pointer;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
      }
    }
    .export-data:hover {
      background: #fb3a32;
      border: none;
      span {
        color: #fff;
      }
    }
  }
</style>
