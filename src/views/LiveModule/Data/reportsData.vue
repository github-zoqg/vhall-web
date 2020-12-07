<template>
  <div class="contain-data">
    <pageTitle title="数据报告">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <title-data></title-data>
    <search-area
      ref="searchArea"
      :searchAreaLayout="searchAreaLayout"
      @onSearchFun="getDataList('search')"
      >
    </search-area>
    <main-data :mainKeyData="mainKeyData" :titleType="titleType" :highData="highMax"></main-data>
    <el-card class="statistical-data">
      <div class="statistical-title">用量统计</div>
      <div class="statistical-line">
        <span>观众访问趋势图</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content">
            当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
        <div class="changeOption">
          <span :class="isActive ? 'span-active' : ''" @click="changeTime('直播')">直播</span>
          <span :class="isActive ? '' : 'span-active'" @click="changeTime('回放')">回放</span>
        </div>
        <lint-charts :lineDataList="lineDataList"></lint-charts>
      </div>
      <div class="statistical-map">
        <div class="map-title">
          <span>观看地域TOP10分布情况</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">统计观看地域TOP10占比情况</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <map-charts :areaDataList="areaDataList"></map-charts>
      </div>
      <el-row class="statistical-ter">
        <el-col :span="12"
          ><div class="bg-purple"><ter-charts :isTerBar="1" :terDataList="deviceDataList"></ter-charts></div
        ></el-col>
        <el-col :span="12"
          ><div class="bg-purple"><ter-charts :isTerBar="2" :terDataList="browerDataList"></ter-charts></div
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
import PageTitle from '@/components/PageTitle';
export default {
  data() {
    return {
      titleType: '直播',
      mainKeyData: {},
      allDataList: {},
      lineDataList: [],
      areaDataList: {},
      highMax: 0,
      webianr_id: '',
      deviceDataList: [],
      browerDataList: [],
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
          key: "searchTime",
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
    titleData,
    PageTitle
  },
  created() {
    this.searchAreaLayout = this.searchLayout;
    this.getBaseData(this.$route.params.str);
    this.getHighUv(this.$route.params.str);
    this.getTrendData(this.$route.params.str);
    this.getProvinceData(this.$route.params.str);
    this.getDeviceData(this.$route.params.str);
    this.getBrowerData(this.$route.params.str);
  },
  methods: {
    getDataList(params) {
      let searchData = this.$refs.searchArea.searchParams;
      let paramsObj = {};
      if (parseInt(searchData.searchIsTime) === 2) {
        this.searchAreaLayout = this.searchArea;
      } else {
        this.searchAreaLayout = this.searchLayout;
      }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      console.log(params);
      console.log(searchData);
    },
    getBaseData(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getStatisticsinfo', params).then(res => {
        this.mainKeyData = res.data;
        console.log(res.data, '1111');
      });
    },
    getHighUv(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getMaxuv', params).then(res => {
        this.highMax = res.data.max_onlines || '';
        this.webianr_id = res.data.webianr_id;
      });
    },
    getTrendData(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getDateUvinfo', params).then(res => {
        this.allDataList = res.data;
        this.lineDataList = this.allDataList.live;
      });
    },
    getProvinceData(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getProvinceinfo', params).then(res => {
        this.areaDataList = res.data;
      });
    },
    getDeviceData(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getDeviceinfo', params).then(res => {
        this.deviceDataList = res.data.list;
      });
    },
    getBrowerData(id) {
      let params = {
        switch_id: 0,
        webinar_id: id
      };
      this.$fetch('getBrowserinfo', params).then(res => {
        this.browerDataList = res.data.list;
      });
    },
    changeTime(title) {
      if (title === '直播') {
        this.isActive = true;
        this.lineDataList = this.allDataList.live;
      } else {
        this.isActive = false;
        this.lineDataList = this.allDataList.record;
      }

    },
  },
};
</script>
<style lang="less" scoped>
.contain-data {
  margin: 0 41px;
  padding: 0;
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
