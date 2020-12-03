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
            @onSearchFun="getAccountList('search')"
        >
        </search-area>
      <div class="content-grid" v-if="versionType == 2">
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
      versionType:2,
      dataValue: '',
      totalNum: 1000,
      status: false,
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
            },
            {
              label: '主账号+子账号',
              value: 2
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
            },
            {
              label: '主账号+子账号',
              value: 2
            },
            {
              label: '子账号',
              value: 3
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
      tabelColumn: [
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
        {
          label: '最高并发（方）',
          key: 'webinar_max_uv',
        }
      ]
    };
  },
  filters:{
    formatMoney
  },
  created() {
    if (this.status) {
      let that = this;
      let vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<p style="color:#1A1A1A">您有流量欠费3004.32元未支付  <span id="openList" style="color:#FA9A32;cursor: pointer;padding-left:10px">立即支付</span></p>',
        type: 'warning'
      });
      let open = document.querySelector('#openList');
      open.addEventListener('click', function(e){
        vm.close();
        that.$router.push({
          name: 'payOrder'
        });
      });
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
    this.getLineList();
    this.getAccountList();
  },
  methods: {
    // 用量统计数据
    getLineList(params) {
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      let paramsObj = {
        account_id: this.userId
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
      this.getFlowTrend(obj);
    },
    getFlowTrend(obj) {
      let url = this.versionType == 2 ? 'getTrendInfo' : 'getFlowInfo';
      this.$fetch(url, obj).then(res =>{
        this.lintData = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取并发-最高
    getOnlinePay(obj) {
      let url = this.versionType == 2 ? 'getOnlinePay' : 'getFlowPay';
      this.$fetch(url, obj).then(res =>{
        this.trendData = res.data;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取消费账单列表
    getAccountList(params) {
      let pageInfo = this.$refs.accountTableList.pageInfo;
      let formParams = this.$refs.searchArea.searchAccount; //获取搜索参数
      let paramsObj = {
        account_id: this.userId,
        type: 1
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
      console.log(obj);
      this.getDataList(obj);
      this.getOnlinePay(obj);
    },
    getDataList(obj) {
      let url = this.versionType == 2 ? 'getAccountList' : 'getBusinessList';
      this.$fetch(url, obj).then(res =>{
        let costList = res.data.list;
        // this.totalNum =
        costList.map(item => {
          item.typeText = item.type == 1 ? '主账号' : item.type == 2 ? '父账号+子账号' : '子账号';
          item.typePay = item.pay_type == 1 ? '并发 ' : '流量';
        });
        this.tableList = costList;
      }).catch(e=>{
        console.log(e);
      });
    }
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
