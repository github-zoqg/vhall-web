<template>
  <div class="line-charts">
    <div :style="{ height: '240px', width: '100%' }" ref="visitEchart"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  props: ['lineDataList'],
  data() {
    return {
      isActive: true,
      visitDateList: [],
      visitValueList: [],
    };
  },
  mounted() {
    // this.initLintEcharts();
  },
  watch: {
    lineDataList: {
      handler(data) {
        this.initLintEcharts(data);
      }
    }
  },
  methods: {
    initLintEcharts(data) {
      let visitDataDate = [];
      let visitDataValue = [];
      data.map(item => {
        visitDataDate.push(item.date);
        visitDataValue.push(item.value);
      });
      console.log(visitDataDate, visitDataValue);
      // let that = this;
      let visitEchart = echarts.init(this.$refs.visitEchart);
      let options = {
        visualMap: {
          show: false,
          type: 'continuous',
          min: 0,
          max: 100,
        },
        grid: {
          left: '65',
          top: '25',
          bottom: '30',
          right: '32'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          formatter: '{b0}<br />观看人数: {c0}',
        },
        xAxis: {
          data: visitDataDate,
        },
        yAxis: {
          splitLine: { show: false },
        },
        series: [
          {
            type: 'line',
            showSymbol: false,
            smooth: true,
            data: visitDataValue,
            color: '#fb3a32'
          },
        ],
      };
      visitEchart.setOption(options);
    },
  },
};
</script>
<style lang="less" scoped>
.line-charts {
  width: 100%;
  background: #fff;
}
</style>
