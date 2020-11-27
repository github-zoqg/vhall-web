<template>
  <div class="account-income">
    <pageTitle title="账户收益">
      <div slot="content">
        1.账户收益包含直播收益和红包收益<br>2.直播收益：观众对主办方打赏的金额，包含门票、打赏、礼物道具<br>3.红包收益：作为观众身份抢到主办方发送的红包，以及主办方发送红包后未被领取完，会退款到红包收益
      </div>
    </pageTitle>
    <div class="detail" @click="accountDetail">提现明细</div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="live-come">
          <h3>直播收益</h3>
          <div class="live-all">
            <div class="all-come">
              <p>总收益（元）</p>
              <h1>{{ incomeInfo.live_income }}</h1>
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
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </p>
              <h1>{{ incomeInfo.live_balance }}</h1>
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
              <h1>{{ incomeInfo.red_packet_income }}</h1>
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
                   <i class="el-icon-question"></i>
                </el-tooltip>
              </p>
              <h1>{{ incomeInfo.red_packet_balance }}</h1>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="listTab">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="直播收益明细" name="1"></el-tab-pane>
        <el-tab-pane label="红包收益明细" name="2"></el-tab-pane>
        <div class="search-income">
          <search-area
            ref="searchIncome"
            :searchAreaLayout="searchAccount"
            @onSearchFun="getIncomeList('search')"
          >
          </search-area>
        </div>
        <table-list
          ref="tableIncome"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="isCheckout"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getIncomeList"
          >
        </table-list>
      </el-tabs>
    </el-card>
    <cash-box ref="cashBox"></cash-box>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import cashBox from './components/cashBox';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 100,
      incomeInfo: {},
      searchAccount: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          key: "webinar_name"
        }
      ],
      isCheckout: false,
      tableList: [
        {
          webinar_id: '1',
          name: '秒吼吼吼吼',
          total_income: '200',
          ticket_income: '100',
          reward_income: '123',
          gifts_income: '123.00',
          red_packet_user: 'xixiiiiid',
          red_packet_type: '0',
          created_at: '2020-10-01',
          money: '1000.00'
        },
        {
          webinar_id: '2',
          name: '秒吼吼吼222吼',
          total_income: '1000',
          ticket_income: '1000',
          reward_income: '1023',
          gifts_income: '999999',
          red_packet_user: '哈哈哈哈哈',
          red_packet_type: '1',
          created_at: '2020-10-01',
          money: '2000.00'
        }
      ],
      tabelColumn: [],
      liveColumns: [
        {
          label: '活动id',
          key: 'webinar_id',
        },
        {
          label: '标题',
          key: 'name'
        },
        {
          label: '总收益',
          key: 'total_income',
        },
        {
          label: '门票收益',
          key: 'ticket_income',
          width: 120,
        },
        {
          label: '打赏收益',
          key: 'reward_income',
        },
        {
          label: '礼物收益',
          key: 'gifts_income',
        }
      ],
      meneyColumns: [
        {
          label: '活动id',
          key: 'webinar_id',
        },
        {
          label: '标题',
          key: 'name',
        },
        {
          label: '发红包用户',
          key: 'red_packet_user',
        },
        {
          label: '红包类型',
          key: 'red_packet',
        },
        {
          label: '领取时间',
          key: 'created_at',
        },
        {
          label: '领取金额',
          key: 'money',
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
    cashBox,
    PageTitle
  },
  created() {
    this.tabelColumn = this.liveColumns;
  },
  mounted() {
    this.getIncomeInfo();
    this.getIncomeList();
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
    getIncomeInfo() {
      this.$fetch('incomeInfo', {user_id: '16417099'}).then(res =>{
        this.incomeInfo = res.data;
      }).catch(e=>{
        console.log(e);
      });
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    handleClick(tab) {
      this.activeIndex = tab.name;
      this.$refs.searchIncome.searchParams = {};
      this.$refs.tableIncome.pageInfo.pageNum = 1;
      this.$refs.tableIncome.pageInfo.pos = 0;
      this.getIncomeList();
    },
    getIncomeList(params) {
      let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
      let formParams = this.$refs.searchIncome.searchParams; //获取搜索参数
      let paramsObj = {};
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos = 0;
      }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      paramsObj.user_id = '16417099';
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
      let url = this.activeIndex == '1' ? "liveIncomeList" : "packetIncomeList";
      this.$fetch(url, obj).then(res =>{
        if (this.activeIndex == '2') {
            this.rowsList();
        }
        console.log(res);
        // this.totalNum = res.data.total;
        // this.tableList = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList() {
      this.tableList.map(item => {
        item.red_packet = item.red_packet_type == '1' ? '固定金额': '拼手气';
      });
      console.log(this.tableList);
      // .map(item => {"red_packet": item.red_packet_type == '1' ? '固定金额': '拼手气' })
    },
    cash(title) {
      console.log(title);
      let flag = 2;
      // 1 未绑定微信   2绑定微信
      if (flag === 1) {
         this.$refs.cashBox.dialogVisible = true;
      } else if (flag === 2) {
        this.$refs.cashBox.dialogCashVisible = true;
      }
    },
    detail(that, { rows }) {
      that.$router.push({
        name: 'incomeDetail',
        query: {
          webinar_id: rows.webinar_id
        }
      });
    },
    // 账单明细
    accountDetail() {
      // this.$router.push({
      //   name: 'orderDetail'
      // });
      this.$router.push({
        name: 'accountDetail'
      });
    }
  },
};
</script>

<style lang="less" scoped>
  .account-income{
    position: relative;
    .el-card__body{
      padding: 24px 32px;

    }
    .detail{
      position: absolute;
      top:0;
      right:0;
      color:#3B67F9;
      font-size: 14px;
      cursor: pointer;
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
      i{
        color: #000;
        display: inline-block;
        margin-left: 2px;
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
    .search-income{
      margin-top: 24px;
    }
  }
  }
</style>
