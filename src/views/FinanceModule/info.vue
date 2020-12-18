<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
    </div>
    <div class="version-info">
      <version-info></version-info>
    </div>
    <div class="statistical-line">
        <el-card class="serach-line">
          <span>用量统计</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据 <br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
          <search-area
            ref="searchArea"
            :searchAreaLayout="searchAreaLayout"
            @onExportData="exportCenterData()"
            @onSearchFun="getLineList()"
          >
          </search-area>
          <lint-charts :lineDataList="lintData"></lint-charts>
        </el-card>
    </div>
    <div class="statistical-line">
      <el-card class="serach-line">
        <span>消费账单</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据 <br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
        <search-area
            ref="searchAccount"
            :searchAreaLayout="searchAccount"
            @onExportData="exportAccount()"
            @onSearchFun="getAccountList('search')"
        >
        </search-area>
      <div class="content-grid" v-if="versionType == '1'">
         <div class="grid-item">
          <div class="grid-content">
            <p>累计直播（个）</p>
            <h1>{{ trendData.webinar_num }}</h1>
          </div>
        </div>
         <div class="grid-item">
          <div class="grid-content">
            <p>最高并发（方）</p>
            <h1>{{ trendData.max_uv }}</h1>
          </div>
        </div>
      </div>
      <div class="content-grid" v-else>
        <div class="content-item">
          <div class="grid-content">
            <p>累计活动（个）</p>
            <h1>{{ trendData.webinar_num | formatMoney }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>累计使用流量（GB）</p>
            <h1>{{ trendData.total_flow | formatMoney }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>直播使用流量（GB）</p>
            <h1>{{ trendData.live_flow | formatMoney }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>回放使用流量（GB）</p>
            <h1>{{ trendData.vod_flow | formatMoney }}</h1>
          </div>
        </div>
      </div>
      <table-list
        ref="accountTableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isCheckout="isCheckout"
        :isHandle="isHandle"
        :totalNum="totalNum"
        @getTableList="getAccountList"
        >
      </table-list>
      </el-card>
    </div>
  </div>
</template>

<script>
import versionInfo from '@/components/DataUsage/index';
import lintCharts from '@/components/Echarts/lineEcharts';
import { sessionOrLocal } from '@/utils/utils';
import { formatMoney } from '@/utils/filter';
// import { getCountDownTime } from '@/utils/general';
export default {
  name: "financeInfo",
  components: {
    versionInfo,
    lintCharts
  },
  data() {
    return {
      lintData: [],
      trendData: {
        webinar_num: 12345678,
        total_flow: 901234567,
        live_flow: 212321478,
        vod_flow: 1231234434
      },
      time: '',
      versionType: '',
      lineParams: {},
      dataParams: {},
      dataValue: '',
      totalNum: 1000,
      vm: {},
      status: 0,
      searchAreaLayout: [
        {
          type: "2",
          key: "searchTime",
        },
        {
          type: "3",
          key: "type",
          options: [
            {
              label: '主账号',
              value: 1
            }
          ]
        }
      ],
      searchAccount:[
        {
          type: "2",
          key: "searchTime",
        },
        {
          type: "3",
          key: "type",
          options: [
            {
              label: '主账号',
              value: 1
            }
          ]
        },
        {
          key: "subject"
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [
        {
          webinar_id: '1',
          pay_date: '2020-09-17',
          subject: '哈哈哈',
          typePay: '123',
          webinar_max_uv: '124',
          typeText: '主账号'
        },
        {
          webinar_id: '2',
          pay_date: '2021-09-17',
          subject: 'xixiiii',
          typePay: '111',
          webinar_max_uv: '222',
          typeText: '主账号'
        }
      ],
      tabelColumn: [],
      tabelColumns: [
        {
          label: '消费时间',
          key: 'pay_date',
        },
        {
          label: '活动ID',
          key: 'webinar_id',
        },
        {
          label: '活动名称',
          key: 'subject',
        },
        {
          label: '消费类型',
          key: 'typePay',
        },
        {
          label: '账号类型',
          key: 'typeText',
        },
      ]
    };
  },
  filters:{
    formatMoney
  },
  created() {
    this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
    if (!this.versionType) {
      this.tabelColumn = this.tabelColumns.concat({
        label: '最高并发（方）',
        key: 'webinar_max_uv'
      })
    } else {
      this.tabelColumn = this.tabelColumns.concat({
        label: '消耗流量（GB）',
        key: 'webinar_flow'
      })
    }
    if (this.parentId) {
      this.searchAreaLayout.map(item => {
        item.key === 'type' ? item.options.push({label: '主账号+子账号',value: 2}) : []
      })
      this.searchAccount.map(item => {
        item.key === 'type' ? item.options.push({label: '主账号+子账号',value: 2}) : []
      })
    }
  },
  mounted() {
    this.status = JSON.parse(sessionOrLocal.get("arrears")).total_fee || 0;
    if (this.status) {
      this.initPayMessage();
    }
    this.getLineList();
    this.getAccountList();
  },
  beforeRouteLeave(to, from, next) {
    if (this.status) {
      this.vm.close();
    }
    next();
  },
  methods: {
    // 用量统计数据
    getLineList(params) {
      let formParams = this.$refs.searchAccount.searchParams; //获取搜索参数
      let paramsObj = {
        account_id: this.userId,
        type: formParams.type || 1
      };
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      let obj = Object.assign({}, paramsObj);
      this.lineParams = obj;
      this.getFlowTrend(obj);
    },
    getFlowTrend(obj) {
      let url = this.versionType == '1' ? 'getFlowLineInfo' : 'getTrendLineInfo';
      this.$fetch(url, obj).then(res =>{
        this.lintData = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取并发-最高  流量-活动个数
    getOnlinePay(obj) {
      let url = this.versionType == '1' ? 'getFlowPayInfo' : 'getTrendHighInfo';
      this.$fetch(url, obj).then(res =>{
        this.trendData = res.data || {};
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取消费账单列表
    getAccountList(params) {
      let pageInfo = this.$refs.accountTableList.pageInfo;
      let formParams = this.$refs.searchAccount.searchParams; //获取搜索参数
      let paramsObj = {
        account_id: this.userId,
        type: formParams.type || 1
      };
      if (params === 'search') {
        pageInfo.pos= 0;
        pageInfo.pageNum = 1;
      }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.dataParams = obj;
      this.getOnlinePay(obj);
      this.getDataList(obj);
    },
    getDataList(obj) {
      let url = this.versionType == '1' ? 'getBusinessList' : 'getAccountList';
      this.$fetch(url, obj).then(res =>{
        let costList = res.data.list;
        this.totalNum = res.data.total;
        costList.map(item => {
          item.typeText = item.type == 1 ? '主账号' : item.type == 2 ? '父账号+子账号' : '子账号';
          item.typePay = item.pay_type == 1 ? '并发 ' : '流量';
        });
        this.tableList = costList;
      }).catch(e=>{
        console.log(e);
      });
    },
    getOrderArrear() {
      let params = {
        user_id: this.userId,
        type: this.versionType == '1' ? 1 : 2
      };
      this.$fetch('orderArrears', params).then(res =>{
        if (res.code == 200) {
          this.$router.push({
            path: '/finance/payOrder',
            query: {
              userId: this.userId,
              orderId: res.data.order_id
            }
          });
        } else {
          this.$message.error(res.msg);
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    initPayMessage() {
      let that = this;
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<p style="color:#1A1A1A">您有流量欠费' + that.status + '元未支付  <span id="openList" style="color:#FA9A32;cursor: pointer;padding-left:10px">立即支付</span></p>',
        type: 'warning'
      });
      let open = document.querySelector('#openList');
      open.addEventListener('click', function(e){
        that.vm.close();
        that.getOrderArrear();
      });
    },
    //导出数据
    // 导出用量统计
    exportCenterData() {
      let url = this.versionType == '1' ? 'exportFlow' : 'exportOnline';
      this.$fetch(url, this.lineParams).then(res => {
        if (res.code == 200) {
           this.lineParams = {};
          this.$message.success(`用量统计导出成功，请去下载中心下载`);
        } else {
          this.$message.error(`用量统计${res.msg}`);
        }
      })
    },
    // 导出消费账单
    exportAccount() {
      let url = this.versionType == '1' ? 'exportFlowDetail' : 'exportOnlineDetail';
      this.$fetch(url, this.lineParams).then(res => {
        if (res.code == 200) {
          this.dataParams = {};
          this.$message.success(`消费账单导出成功，请去下载中心下载`);
        } else {
          this.$message.error(`消费账单${res.msg}`);
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.finance-info{
  /deep/.el-card__body{
    padding: 24px;
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
    }
    .statistical-line {
      text-align: left;
      position: relative;
      margin-top: 20px;
      span {
        display: inline-block;
        font-size: 16px;
        color: #1a1a1a;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }
    }
    .content-grid{
      width: 100%;
      height:100px;
      margin-bottom: 20px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .content-item{
        width: 24%;
        background: #F7F7F7;
        height:100px;
        border-radius: 4px;
      }
      .grid-item{
        width: 49%;
        background: #F7F7F7;
        height:100px;
        border-radius: 4px;
      }
      .grid-content{
        margin: 22px 60px;
        text-align: left;
        h1{
          font-size: 28px;
          color: #1A1A1A;
          line-height: 32px;
          font-weight: bold;
        }
        p{
          font-size: 14px;
          color: #999;
          line-height: 20px;
        }
      }
    }
}
</style>
