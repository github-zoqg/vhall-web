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
                <span @click="cash('直播')">{{ incomeInfo.in_live_withdraw ? '提现中' : '提现' }}</span>
                <el-tooltip effect="dark" placement="right-start">
                  <div slot="content">
                   Q1: 平台提现额度为多少？<br>
                    A1: 平台余额1元以上方可提现。线上最大支持单笔提现额度为800元。<br>应国家税务局要求，个人用户单次提现超过800元将产生个人所得税，<br>请发送以下资料至：finance@vhall.com<br>
                    ● 个人用户：微吼账号、姓名、身份证号、银行账户姓名、账号、开户行、提现类型（直播收益或红包收益）<br>
                    ● 公司用户：微吼账号、营业执照扫描件加盖公章、银行账户名称、账号、开户行<br>
                    *公司/个人信息与银行信息必须对应<br>
                    Q2: 平台提现有手续费么，手续费具体为多少？<br>
                    A2: 平台目前提现付费采用分成模式，平台分成5%<br>
                    Q3: 提现申请后，几天内到账<br>
                    A3: 从提现当天算起，7-15个工作日内到账，最终以实际到账时间为准。<br>
                    Q4: 提现还有什么其他注意事项？<br>
                    A4: 在提现周期内不能再次提现，到账后方可重新进行提现操作
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
                <span @click="cash('红包')">{{ incomeInfo.in_red_withdraw ? '提现中' : '提现' }}</span>
                <el-tooltip effect="dark" placement="right-start">
                  <div slot="content">
                   Q1: 红包提现额度为多少？<br>
                    A1: 红包余额1元以上方可提现，线上最大支持单笔提现额度为800元。<br>应国家税务局要求，个人用户单次提现超过800元将产生个人所得税，<br>请发送以下资料至：finance@vhall.com<br>
                    ● 个人用户：微吼账号、姓名、身份证号、银行账户姓名、账号、开户行、提现类型（直播收益或红包收益）<br>
                    ● 公司用户：微吼账号、营业执照扫描件加盖公章、银行账户名称、账号、开户行<br>
                    *公司/个人信息与银行信息必须对应<br>
                    Q2: 平台提现有手续费么，手续费具体为多少？<br>
                    A2: 无手续费<br>
                    Q3: 提现申请后，几天内到账<br>
                    A3: 从提现当天算起，7-15个工作日内到账，最终以实际到账时间为准。<br>
                    Q4: 提现还有什么其他注意事项？<br>
                    A4: 在提现周期内不能再次提现，到账后方可重新进行提现操作
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
            @onExportData="exportAccount()"
            :searchAreaLayout="searchAccount"
            @onSearchFun="getIncomeList('search')"
          >
          </search-area>
        </div>
        <table-list
          ref="tableIncome"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="false"
          :isHandle="isHandle"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getIncomeList"
          >
        </table-list>
      </el-tabs>
    </el-card>
    <cash-box ref="cashBox" :money="money" :userInfo="userInfo" :type="type" @onreload="onreload"></cash-box>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import cashBox from './components/cashBox';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 100,
      money: 0,
      phone: 0,
      type: 0,
      params: {},
      isHandle: true,
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
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.userInfo = JSON.parse(sessionOrLocal.get("userInfo"));
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
      this.$fetch('incomeInfo', {user_id: this.userId}).then(res =>{
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
      paramsObj.user_id = this.userId;
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.params = obj;
      let url = this.activeIndex == '1' ? "liveIncomeList" : "packetIncomeList";
      this.$fetch(url, obj).then(res =>{
        this.totalNum = res.data.total;
        this.tableList = res.data.list;
        if (this.activeIndex == '2') {
          this.rowsList(this.tableList);
        }
        console.log(res);
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList(data) {
      data.map(item => {
        item.red_packet = item.red_packet_type == '1' ? '固定金额': '拼手气';
      });
    },
    cash(title) {
      if (this.incomeInfo.in_live_withdraw || this.incomeInfo.in_red_withdraw) {
        this.$alert('您有进行中的提现，无法再次提现', '提示', {
          confirmButtonText: '知道了',
          customClass: 'zdy-message-box',
          callback: action => {}
        });
        return;
      }
      if (title === '直播' && parseInt(this.incomeInfo.live_balance) < 1) {
        this.$message.warning('当前余额不足1元，不支持提现');
        return false;
      } else if (title === '直播' && parseInt(this.incomeInfo.live_balance) > 800) {
        this.$message.warning('需要线下审核提现');
        return false;
      }
      if (title === '红包' && parseInt(this.incomeInfo.red_packet_balance) < 1) {
        this.$message.warning('当前余额不足1元，不支持提现');
        return false;
      } else if (title === '红包' && parseInt(this.incomeInfo.red_packet_balance) > 800) {
        this.$message.warning('需要线下审核提现');
        return false;
      }
      let flag = this.isBangWeixin();
      // （false）未绑定微信   绑定微信(true)
      if (flag) {
        this.$refs.cashBox.dialogCashVisible = true;
        this.phone = this.userInfo.phone;
        this.money = title === '直播' ? this.incomeInfo.live_balance : this.incomeInfo.red_packet_balance;
        this.type = title === '直播' ? 0 : 1;
      } else {
        this.$refs.cashBox.dialogVisible = true;
      }
    },
    onreload() {
      this.getIncomeInfo();
    },
    isBangWeixin() {
      return this.userInfo.user_thirds.some(item => item.type == 3);
    },
    detail(that, { rows }) {
      that.$router.push({
        path: `/finance/incomeDetail/${rows.webinar_id}`
      });
    },
    // 提现明细
    accountDetail() {
      this.$router.push({
        path: '/finance/accountDetail'
      });
    },
    // 导出收益明细
    exportAccount() {
      let url = this.activeIndex == '1' ? 'exportLiveIncome' : 'exportRedPacket';
      this.$fetch(url, this.params).then(res => {
        if (res.code == 200) {
          this.params = {};
          this.$message.success(`${this.activeIndex == '1' ? '直播' : '红包'}收益明细导出申请成功，请去下载中心下载`);
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(`收益明细${res.msg}`);
        }
      })
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
