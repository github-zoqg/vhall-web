<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
    </div>
    <div class="version-info">
      <version-info :upgrade_version="upgrade_version"></version-info>
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
        <el-date-picker
          v-model="time"
          type="date"
          style="width: 200px"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-select v-model="dataValue" placeholder="请选择" style="width: 140px">
        <el-option
          v-for="item in dataList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
        <button class="export-data">导出数据</button>
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
      <el-date-picker
        v-model="time"
        type="date"
        style="width: 200px"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-select v-model="dataValue" placeholder="请选择" style="width: 140px">
      <el-option
        v-for="item in dataList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input v-model="searchTopic" placeholder="请输入标题" style="width: 180px"></el-input>
      <button class="export-data">导出数据</button>
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
      :manageTableData="tableList"
      :tabelColumnLabel="tabelColumn"
      :isCheckout="isCheckout"
      :isHandle="isHandle"
      >
    </table-list>
  </div>
</template>

<script>
import versionInfo from '@/components/DataUsage/index';
import lintCharts from '@/components/Echarts/lineEcharts';
import tableList from '@/components/DataList/list.vue';

export default {
  name: "financeInfo",
  components: {
    versionInfo,
    lintCharts,
    tableList
  },
  data() {
    return {
      upgrade_version: '旗舰版',
      time: '',
      dataValue: '',
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
    .export-data {
      position: absolute;
      right: 0;
      top: 0px;
      width: 104px;
      height: 35px;
      border-radius: 20px;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 35px;
      background: #fff;
      outline: 0;
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
