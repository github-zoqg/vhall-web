<template>
  <div class="line-charts">
    <div :style="{ height: '330px', width: '100%' }" ref="visitEchart"></div>
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
    this.initLintEcharts(this.lineDataList);
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
        // visitDataValue.push(item.value.replace(/,/g, ""));
      });
      // console.log(visitDataDate, visitDataValue);

      let that = this;
      let visitEchart = echarts.init(this.$refs.visitEchart);
      // 若开始日期未能达成百分比情况
      /*let minSDate = showTimeDate[0];
      let minVDate = visitDataDate[0];
       if (this.$moment(minVDate).diff(this.$moment(minSDate), 'day') > 0) {
        if (index === 0) {

        }
      } */
      let options = {
        visualMap: {
          show: false,
          type: 'continuous',
          min: 0,
          max: 100,
        },
        grid: {
          left: '85',
          top: '25',
          bottom: '60',
          right: '95'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          formatter: `{b0}<br />${that.type == 3 ? '并发' : that.type == 1 ? that.versionType == 1 ? '流量' : '并发' : '观看人数'}: {c0}${that.type == 3 ? '方' : that.type == 1 ? that.versionType == 1 ? 'GB' : '方' : ''}`,
        },
        xAxis: {
          // name: '日期',
          name: '',
          nameLocation: 'start',
          nameGap: 30,
          type: 'category',
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'solid',
            }
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
            },
            /* formatter:function(value,index){
              console.log(showTimeDate, value);
              if (showTimeDate.includes(`${value}`)) {
                return value;
              } else {
                return '';
              }
            } */
          },
          data: visitDataDate || [],
        },
        dataZoom: [{
            type: 'inside',
            xAxisIndex: 0,
            minSpan: 5
        }, {
            type: 'slider',
            xAxisIndex: 0,
            minSpan: 5,
            height: 20,
            bottom: 10,
            handleSize: '100%'
        }],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#E6E6E6'
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
            symbolSize: 2,   //拐点圆的大小
            smooth:true,
            itemStyle:{
              normal:{
                color: '#fb3a32',
                borderColor: '#fb3a32',  //拐点边框颜色
              }
            },
            lineStyle: {
              color: '#fb3a32'
            },
            data: visitDataValue || [],
            // color: '#fb3a32'
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
