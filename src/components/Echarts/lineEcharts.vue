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
      console.log(data, '????????????????')
      let minLabel = '';
      let maxLabel = '';
      let level = 0;
      let visitDataDate = [];
      let visitDataValue = [];
      data.map(item => {
        visitDataDate.push(item.time);
        visitDataValue.push(item.value);
        // visitDataValue.push(item.value.replace(/,/g, ""));
      });
      // console.log(visitDataDate, visitDataValue);
      if (visitDataDate.length) {
        minLabel = visitDataDate[0], maxLabel = visitDataDate[visitDataDate.length - 1];
        console.log('最小日期：', minLabel, '最大日期：', maxLabel);
        /*1、一周内，每天都显示
          2、一个月内，3天一个刻度
          3、一个季度内，7天一个刻度
          4、一年内，1个月一个刻度 */
        let yearCha = this.$moment(maxLabel).diff(this.$moment(minLabel), 'year');
        let monCha = this.$moment(maxLabel).diff(this.$moment(minLabel), 'month');
        let dayCha = this.$moment(maxLabel).diff(this.$moment(minLabel), 'day');
        console.log('计算', yearCha, monCha, dayCha);
        let showTimeDate = [];
        level = 0;
        try {
          if (yearCha >= 1) {
            level = 365;
            // 超过一年，年刻度
            for(let i =0; i<= (dayCha > 0 ? yearCha + 1 : yearCha); i++) {
              let startTr = this.$moment(this.$moment(maxLabel)).subtract(i, "years").format("YYYY-MM-DD");
              showTimeDate.push(startTr);
            }
            showTimeDate = showTimeDate.reverse();
          } else if (monCha <= 3 && monCha > 0) {
            level = 7;
            let maxDayCount = dayCha % 7 > 0  ? (parseInt(dayCha / 7) + 1) * 7 : dayCha;
            // console.log('maxDayCount', maxDayCount)
            // 一个季度内，7天一个刻度
            for(let i =0; i<= maxDayCount; i += 7) {
              let startTr = this.$moment(this.$moment(maxLabel)).subtract(i, "day").format("YYYY-MM-DD");
              showTimeDate.push(startTr);
            }
            showTimeDate = showTimeDate.reverse();
          } else if (monCha > 3) {
            level = 30;
            // 一年内，1个月一个刻度
            for(let i =0; i<= monCha + 1; i ++) {
              let startTr = this.$moment(this.$moment(maxLabel)).subtract(i, "month").format("YYYY-MM-DD");
              showTimeDate.push(startTr);
            }
            showTimeDate = showTimeDate.reverse();
          } else if (monCha === 0 && dayCha <= 7) {
            level = 0;
            // 一周内，每天都显示
            showTimeDate = visitDataDate;
          } else if (monCha === 0 && dayCha > 7) {
            level = 3;
            // 一个月内，3天一个刻度
            let maxDayCount = dayCha % 3 > 0  ? (parseInt(dayCha / 3) + 1) * 3 : dayCha;
            // console.log('maxDayCount', maxDayCount)
            for(let i =0; i<= maxDayCount; i += 3) {
              let startTr = this.$moment(this.$moment(maxLabel)).subtract(i, "day").format("YYYY-MM-DD");
              showTimeDate.push(startTr);
            }
            showTimeDate = showTimeDate.reverse();
          } else {
            level = 0;
            showTimeDate = visitDataDate;
          }
        }catch(e) {
          console.log(e);
        }
      }

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
          left: '65',
          top: '25',
          bottom: '30',
          right: '32'
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
            interval: minLabel.length < 19 ? level : 'auto',
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
            showSymbol: true,
            symbolSize: 1,   //拐点圆的大小
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
