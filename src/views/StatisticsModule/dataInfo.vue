<template>
  <div class="data-info">
    <div class="title-data">
      <span>{{ $route.name }}</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <search-area
      ref="searchArea"
      :searchAreaLayout="searchAreaLayout"
      @onSearchFun="getDataList('search')"
    >
    </search-area>
    <main-data></main-data>
    <el-card class="statistical-data">
      <div class="statistical-title">用量统计</div>
      <div class="statistical-line">
        <span>观众访问趋势图</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据
          </div>
          <el-button
            circle
            icon="el-icon-question"
            class="button-tip"
          ></el-button>
        </el-tooltip>
        <div class="changeOption">
          <span :class="isActive ? 'span-active' : ''" @click="changeTime('直播')">直播</span>
          <span :class="isActive ? '' : 'span-active'" @click="changeTime('回放')">回放</span>
        </div>
        <lint-charts></lint-charts>
      </div>
      <div class="statistical-map">
        <div class="map-title">
          <span>观看地域TOP10分布情况</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">统计观看地域TOP10占比情况</div>
            <el-button circle icon="el-icon-question"></el-button>
          </el-tooltip>
        </div>
        <map-charts></map-charts>
      </div>
      <el-row class="statistical-ter">
        <el-col :span="12"
          ><div class="bg-purple"><ter-charts :isTerBar="1"></ter-charts></div
        ></el-col>
        <el-col :span="12"
          ><div class="bg-purple"><ter-charts :isTerBar="2"></ter-charts></div
        ></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import mainData from '@/components/Echarts/mainData';
import lintCharts from '@/components/Echarts/lineEcharts';
import mapCharts from '@/components/Echarts/mapEcharts';
import terCharts from '@/components/Echarts/terBroEcharts';
export default {
  name: 'dataInfo',
  components: {
    mainData,
    lintCharts,
    mapCharts,
    terCharts,
  },
  data() {
    return {
      isActive: true,
      searchAreaLayout: [
        {
          type: '1',
        },
        {
          type: '2',
          key: 'searchDate',
        },
        {
          type: '3',
          key: 'searchVersion',
          options: [
            {
              label: '主账号',
              value: 1,
            },
            {
              label: '主账号+子账号',
              value: 2,
            },
          ],
        },
      ],
    };
  },
  methods: {
    getDataList(params) {
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      console.log(formParams, params);
    },
    changeTime(title) {
      this.isActive = title === '直播' ? true : false;
    },
  },
};
</script>

<style lang="less" scoped>
.data-info {
  /deep/.el-button {
    border: none;
    background: transparent;
  }
  /deep/.el-button.is-circle {
    padding: 3px;
  }
  .title-data {
    margin: 10px 0 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
    }
    .button-tip {
      vertical-align: top;
    }
  }
  .statistical-data {
    margin-top: 24px;
    .statistical-title {
      text-align: left;
      font-size: 16px;
      color: #1a1a1a;
      line-height: 22px;
      padding: 12px 0 75px 12px;
    }
  }
  .statistical-line {
    text-align: left;
    padding-bottom: 10px;
    position: relative;
    span {
      font-size: 16px;
      color: #666666;
      margin: 0;
      padding-left: 34px;
    }
  }
  .changeOption {
    border-radius: 100px;
    border: 1px solid #ccc;
    position: absolute;
    top: -10px;
    right: 40px;
    cursor: pointer;
    span {
      display: inline-block;
      font-size: 14px;
      color: #666;
      padding: 8px 16px;
      border-radius: 14px;
    }
    // span + .span-active{

    // }
    .span-active {
      border: none;
      background: #fb3a32;
      color: #fff;
    }
  }
  .statistical-map {
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    margin: 50px 12px 0 12px;
    .map-title {
      text-align: left;
      padding: 24px 0 0 32px;
    }
  }
  .statistical-ter {
    .bg-purple {
      margin: 0 12px;
    }
  }
}
</style>
