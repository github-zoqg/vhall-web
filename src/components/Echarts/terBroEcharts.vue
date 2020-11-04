<template>
  <div class="terBroCharts">
    <div class="terBro-title">
      <span>{{ isTerBar === 1 ? '终端设备占比' : '浏览器占比'}}</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">{{ isTerBar === 1 ?  '统计观看终端占比情况' : '统计观看浏览器占比情况' }}</div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <div :style="{ height: '300px', width: '100%' }" ref="terBroEchart"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  props: ['isTerBar'],
  data() {
    return {
      isActive: true,
      terColorList: ['#FA9A32', '#4383E4', '#7D43E4', '#FB3A32', '#ccc'],
      broColorList: ['#FB3A32', '#4383E4', '#10D3A8', '#FA9A32', '#ccc'],
      terTopList: ['pc端', '手机端', '平板', '其他'],
      broTopList: ['谷歌浏览器', '搜狐浏览器', '猎豹浏览器', '其他'],
      terDataList: [
            {
              name: 'pc端',
              value: '200',
            },
            {
              name: '手机端',
              value: '100',
            },
            {
              name: '平板',
              value: '20',
            },
            {
              name: '其他',
              value: '10',
            },
          ],
      broDataList: [
            {
              name: '谷歌浏览器',
              value: '500',
            },
            {
              name: '搜狐浏览器',
              value: '10',
            },
            {
              name: '猎豹浏览器',
              value: '20',
            },
            {
              name: '其他',
              value: '100',
            },
          ]
    };
  },
  mounted() {
    this.initTerBroCharts();
  },
  methods: {
    initTerBroCharts() {
      let that = this;
      let terBarCharts = echarts.init(this.$refs.terBroEchart);
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>观看次数  {c}  ({d}%)',
        },
        legend: {
          orient: 'vertical',
          top: 80,
          right: 50,
          data: that.isTerBar === 1 ? that.terTopList : that.broTopList,
        },
        color: that.isTerBar === 1 ? that.terColorList : that.broColorList,
        series: {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          // emphasis: {
          //     label: {
          //         show: true,
          //         fontSize: '30',
          //         fontWeight: 'bold'
          //     }
          // },
          roseType: 'radius',
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            show: false,
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: that.isTerBar === 1 ? that.terDataList : that.broDataList
        },
      };
      terBarCharts.setOption(options);
    },
  },
};
</script>
<style lang="less" scoped>
.terBroCharts {
  // width: 100%;
  margin-top: 24px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  .terBro-title {
    text-align: left;
    span{
      display: inline-block;
      padding: 24px 0 0 32px;
    }
    .el-button.is-circle{
      padding:3px;
    }
  }
}
</style>
