<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
    </div>
    <div class="version-info">
      <version-info :userInfo="userInfo"></version-info>
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
            @onSearchFun="getLineList('search')"
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
      <div class="content-grid">
        <div class="content-item">
          <div class="grid-content">
            <p>累计直播（个）</p>
            <h1>100</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>最高并发（方）</p>
            <h1>12345</h1>
          </div>
        </div>
         <div class="content-item">
          <div class="grid-content">
            <p>累计使用流量(GB)</p>
            <h1>12345</h1>
          </div>
        </div>
         <div class="content-item">
          <div class="grid-content">
            <p>回放使用流量(GB)</p>
            <h1>12345</h1>
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
    <el-button :plain="true" @click="openPay">提示</el-button>
  </div>
</template>

<script>
import versionInfo from '@/components/DataUsage/index';
import lintCharts from '@/components/Echarts/lineEcharts';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "financeInfo",
  components: {
    versionInfo,
    lintCharts
  },
  data() {
    return {
      userInfo: {},
      lintData: [],
      time: '',
      dataValue: '',
      totalNum: 1000,
      searchAreaLayout: [
        {
          type: "2",
          key: "searchDate",
        },
        {
          type: "3",
          key: "searchVersion",
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
          key: "searchDate",
        },
        {
          type: "3",
          key: "searchVersion",
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
        },
        {
          key: "searchAccount"
        }
      ],
      dataList: [
        {
          value: '1',
          label: '主账号'
        },
        {
          value: '2',
          label: '主账号+子账号'
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [
        {
          liveId: '1',
          costTime: '2020-09-17',
          liveTitle: '哈哈哈',
          wacthPeople: '123',
          wacthNum: '124',
          timeLang: '30:00:00'
        },
        {
          liveId: '2',
          costTime: '2021-09-17',
          liveTitle: 'xixiiii',
          wacthPeople: '111',
          wacthNum: '222',
          timeLang: '50:00:00'
        }
      ],
      tabelColumn: [
        {
          label: '消费时间',
          key: 'costTime',
          width: 120
        },
        {
          label: '活动ID',
          key: 'liveId',
          width: 120
        },
        {
          label: '活动名称',
          key: 'liveTitle',
        },
        {
          label: '消费类型',
          key: 'wacthPeople',
          width: 120
        },
        {
          label: '账号类型',
          key: 'wacthNum',
          width: 120
        },
        {
          label: '最高并发（方）',
          key: 'timeLang',
          width: 200
        }
      ]
    };
  },
  mounted() {
    this.userInfo = JSON.parse(sessionOrLocal.get("userInfo"));
    console.log(this.userInfo, '12324444444');
    this.lintData = JSON.parse(sessionOrLocal.get("dataCenterInfo"));
  },
  methods: {
    getLineList(params) {
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      console.log(formParams, params);
    },
    getAccountList(params) {
      let pageInfo = this.$refs.accountTableList.pageInfo;
      let formParams = this.$refs.searchArea.searchAccount; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
      }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
    },
    openPay() {
       this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        onClose: close,
        message: '<p style="color:#1A1A1A">您有流量欠费3004.32元未支付  <span onclick="payment" style="color:#FA9A32;cursor: pointer;padding-left:10px">立即支付</span></p>',
        type: 'warning'
      });
    },
    payment() {
      console.log("111111111");
    },
    goPayList() {
      this.$router.push({
        name: 'payOrder'
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
      height:100px;
      margin-bottom: 20px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .content-item{
        width: 24%;
        background: #F7F7F7;
        height:100px;
        border-radius: 4px;
        // margin: 22px auto;
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
