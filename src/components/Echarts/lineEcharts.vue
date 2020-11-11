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
      visitDateList: [
        '2020-10-01',
        '2020-10-02',
        '2020-10-03',
        '2020-10-04',
        '2020-10-05',
        '2020-10-06',
        '2020-10-07',
        '2020-10-08',
        '2020-10-09',
        '2020-10-10',
        '2020-10-11',
        '2020-10-12',
        '2020-10-13',
        '2020-10-14',
        '2020-10-15',
      ],
      visitValueList: [
        '100',
        '12',
        '123',
        '1',
        '200',
        '230',
        '100',
        '56',
        '87',
        '34',
        '280',
        '40',
        '99',
        '156',
        '255',
      ],
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
        visitDataDate.push(item.time);
        visitDataValue.push(item.value);
      });
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
