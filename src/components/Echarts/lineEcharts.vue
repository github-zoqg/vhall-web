<template>
  <div class="line-charts">
    <div :style="{ height: '240px', width: '100%' }" ref="visitEchart"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
import { sessionOrLocal } from '@/utils/utils';
export default {
  props: ['lineDataList', 'type'],
  data() {
    return {
      isActive: true,
      versionType: 0,
      visitDateList: [],
      visitValueList: [],
    };
  },
  mounted() {
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
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
      // console.log(visitDataDate, visitDataValue);
      let that = this;
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
          formatter: `{b0}<br />${that.type == 1 ? that.versionType == 1 ? '流量' : '并发' : '观看人数'}: {c0}${that.type == 1 ? that.versionType == 1 ? 'GB' : '方' : ''}`,
        },
        xAxis: {
          name: '日期',
          nameLocation: 'start',
          nameGap: 30,
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#CCCCCC',
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#999999',
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
            }

          },
          data: visitDataDate,
        },
        yAxis: [
          {
            type: 'value',
            position: 'left',
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CCCCCC',
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              color: '#999999',
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
            }
          }
        ],
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
