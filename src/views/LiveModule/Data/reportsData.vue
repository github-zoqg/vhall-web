<template>
  <div class="contain-data">
    <div class="title-data">
      <span>数据报告</span>
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
    <title-data></title-data>
    <search-area
      ref="searchArea"
      :searchAreaLayout="searchAreaLayout"
      @onSearchFun="getDataList('search')"
      >
    </search-area>
    <main-data :titleType="titleType"></main-data>
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
          <span :class="isActive ? 'span-active' : ''">直播</span>
          <span :class="isActive ? '' : 'span-active'">回放</span>
        </div>
        <lint-charts></lint-charts>
      </div>
      <div class="statistical-map">
        <div class="map-title">
          <span>观看地域TOP10分布情况</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">统计观看地域TOP10占比情况</div>
            <el-button
              circle
              icon="el-icon-question"
            ></el-button>
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
import titleData from './components/title';
export default {
  data() {
    return {
      titleType: '点播',
      isActive: 1,
      timeData: [
        {
          label: '按时间筛选',
          value: '1',
        },
        {
          label: '按场次筛选',
          value: '2',
        },
      ],
      searchAreaLayout: [],
      searchLayout: [
        {
          type: "3",
          key: "searchIsTime",
          options: [
            {
              label: '按时间筛选',
              value: '1',
            },
            {
              label: '按场次筛选',
              value: '2',
            },
          ]
        },
        {
          type: "1",
        },
        {
          type: "2",
          key: "searchDate",
        },
      ],
      searchArea: [
        {
          type: "3",
          key: "searchIsTime",
          options: [
            {
              label: '按时间筛选',
              value: '1',
            },
            {
              label: '按场次筛选',
              value: '2',
            },
          ]
        },
        {
          type: "3",
          key: "searchOnce",
          options: [
            {
              label: '全部',
              value: '1',
            },
            {
              label: '第1场',
              value: '2',
            },
            {
              label: '第2场',
              value: '3',
            },
            {
              label: '第3场',
              value: '4',
            },
            {
              label: '第4场',
              value: '5',
            },
          ]
        }
      ]
    };
  },
  components: {
    mainData,
    lintCharts,
    mapCharts,
    terCharts,
    titleData
  },
  created() {
    this.searchAreaLayout = this.searchLayout;
  },
  methods: {
    changeTime(item) {
      this.isActive = parseInt(item.active);
    },
    getDataList(params) {
      let searchData = this.$refs.searchArea.searchParams;
      if (parseInt(searchData.searchIsTime) === 2) {
        this.searchAreaLayout = this.searchArea;
      } else {
        this.searchAreaLayout = this.searchLayout;
      }
      console.log(params);
      console.log(searchData);
    }
  },
};
</script>
<style lang="less" scoped>
.contain-data {
  margin: 0 41px;
  padding: 0;
  /deep/.el-button {
    border: none;
    background: transparent;
  }
  /deep/.el-button.is-circle{
    padding:3px;
  }
}
.title-data {
  margin: 20px 0;
  text-align: left;
  line-height: 30px;
  span{
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
  }
  .button-tip {
    vertical-align: top;
  }
}
.change-time {
  display: flex;
  display: none;
  position: relative;
  margin: 34px 0 24px 0;
  ::v-deep .el-input__inner{
    border-radius: 18px;
    height: 35px;
  }
  /deep/.el-input__icon{
    line-height: 37px;
  }
}
.time-kuai {
  height: 35px;
  border: 1px solid #dcdfe6;
  border-radius: 18px;
  background: #fff;
  margin: 0 16px 0 24px;
  span {
    display: inline-block;
    border-radius: 18px;
    padding: 10px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    cursor: pointer;
  }
  .active {
    background: #fb3a32;
    color: #fff;
  }
}
.time-change{
  margin-left: 24px;
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
    padding: 3px 10px;
    border-radius: 14px;
  }
  .span-active {
    border: none;
    background: #fb3a32;
    color: #fff;
  }
}
.statistical-map{
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  margin: 50px 12px 0 12px;
  .map-title {
    text-align: left;
    padding: 24px 0 0 32px;
  }
}
.statistical-ter{
  .bg-purple{
    margin: 0 12px;
  }
}

</style>
