<template>
  <div class="contain-data">
    <pageTitle title="数据报告">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <search-area
      ref="searchArea"
      :searchAreaLayout="searchAreaLayout"
      @onExportData="exportCenterData()"
      @onSearchFun="getDataList('search')"
      >
    </search-area>
    <main-data :mainKeyData="mainKeyData" :titleType="titleType"></main-data>
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
      params: {}, //导出的时候用来记录参数
      mainKeyData: {
        max_onlines: 0,
        total_live_time: 0,
        total: 0
      },
      liveDetailInfo: {},
      allDataList: {},
      lineDataList: [],
      areaDataList: {},
      highMax: 0,
      webianr_id: '',
      deviceDataList: [],
      browerDataList: [],
      isActive: 1,
      switchList: [],
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
          key: "switchId",
          options: []
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
    this.getLiveSwitchInfo();
    this.getLiveDetail();
  },
  mounted() {
    this.searchAreaLayout = this.searchLayout;
    this.$nextTick(() => {
      this.getDataList();
    })
  },
  methods: {
    //获取直播详情
    getLiveDetail() {
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        this.liveDetailInfo = res.data;
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      });
    },
    // 获取直播场次
    getLiveSwitchInfo() {
      this.$fetch('getWebinarSwitchList', {webinar_id: this.$route.params.str}).then(res => {
        this.switchList = res.data.switch_list.map((item, index) => {
          return {
            label: `第${index + 1}场`,
            value: item.id
          }
        });
      })
    },
    getDataList(params) {
      let formParams = this.$refs.searchArea.searchParams;
      let paramsObj = {
        webinar_id: this.$route.params.str,
        switch_id: formParams.switchId || 0
      };
      if (parseInt(formParams.searchIsTime) === 2) {
        formParams.searchTime = '';
        this.searchArea.map(item => {
          item.key === 'switchId' ? item.options = this.switchList : []
        })
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
      if (paramsObj.start_time) {
        paramsObj.start_time = paramsObj.start_time.substring(0, 10);
      }
      this.params = this.$params(paramsObj);
      this.getAllData(paramsObj);
    },
    getAllData(params) {
      let promiseArr = [] //promise异步数组
      let obj = {};
      promiseArr.push(
        this.$fetch('getStatisticsinfo', params).then(res => {
          obj = {
            ...res.data
          };
        })
      )
      promiseArr.push(
        this.$fetch('getWebinarSwitchList', params).then(res => {
          obj.total_live_time = res.data.total_live_time;
          obj.total = res.data.total;
        })
      )
      promiseArr.push(
        this.$fetch('getMaxuv', params).then(res => {
          obj.max_onlines = res.data.max_onlines;
        })
      )
      Promise.all(promiseArr).then(() => {
        this.mainKeyData = { ...obj }
      })
      // 获取用户统计
      this.$fetch('getDateUvinfo', params).then(res => {
        this.allDataList = res.data;
        this.lineDataList = this.allDataList.live;
      });
      // 获取观看地域
      this.$fetch('getProvinceinfo', params).then(res => {
        this.areaDataList = res.data;
      });
      // 获取终端设备
      this.$fetch('getDeviceinfo', params).then(res => {
        this.deviceDataList = res.data.list;
      });
      // 获取浏览器
      this.$fetch('getBrowserinfo', params).then(res => {
        this.browerDataList = res.data.list;
      });
    },
    // 导出
    exportCenterData() {
      this.$fetch('exportWebinarInfo', this.params).then(res => {
        if (res.code == 200) {
          this.$message.success(`活动数据报告导出成功，请去下载中心下载`);
        } else {
          this.$message.error(`活动数据报告${res.msg}`);
        }
      })
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
