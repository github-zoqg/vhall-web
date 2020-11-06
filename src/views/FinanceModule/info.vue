<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
    </div>
    <div class="version-info">
      <version-info :upgrade_version="upgrade_version"></version-info>
      <div class="grid-content" @click="goAccountDetail"><span>账单明细</span></div>
    </div>
    <div class="statistical-line">
        <span>用量统计</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据 <br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
          </div>
          <el-button
            circle
            icon="el-icon-question"
            class="button-tip"
          ></el-button>
        </el-tooltip>
        <search-area
          ref="searchArea"
          :searchAreaLayout="searchAreaLayout"
          @onSearchFun="getLineList('search')"
        >
        </search-area>
        <lint-charts></lint-charts>
    </div>
    <div class="statistical-line">
      <span>消费账单</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据 <br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
      <search-area
          ref="searchAccount"
          :searchAreaLayout="searchAccount"
          @onSearchFun="getAccountList('search')"
      >
      </search-area>
    </div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="9">
        <div class="grid-content">
          <h1>100</h1>
          <p>累计直播（个）</p>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content">
          <h1>12345</h1>
          <p>最高并发（方）</p>
          <span class="open">展开</span>
        </div>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
import versionInfo from '@/components/DataUsage/index';
import lintCharts from '@/components/Echarts/lineEcharts';
// import tableList from '@/components/DataList/list.vue';
// import searchArea from '@/components/SearchArea/index.vue';
export default {
  name: "financeInfo",
  components: {
    versionInfo,
    lintCharts,
    // tableList,
    // searchArea
  },
  data() {
    return {
      upgrade_version: '旗舰版',
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
    goAccountDetail() {
       this.$router.push({
        name: 'infoDetail'
      });
    }
  }
};
</script>

<style lang="less" scoped>
.finance-info{
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
    }
    .statistical-line {
      text-align: left;
      position: relative;
      span {
        font-size: 16px;
        color: #1a1a1a;
        margin: 0;
        // padding-left: 34px;
      }
    }
    .row-bg{
      height:200px;
      background: #fff;
      align-items: center;
      position: relative;
      .grid-content{
        span{
          position: absolute;
          background: #fb3a32;
          top: 10px;
          right:10px;
          padding: 5px 10px;
          border-radius: 10px;
          color:#fff;
          font-size: 14px;
        }
      }
    }
}
</style>
