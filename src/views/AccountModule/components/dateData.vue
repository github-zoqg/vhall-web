<template>
  <div class="date--data">
    <div class="date__query__form">
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="timeStr"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 240px"
      />
    </div>
   <div class="echarts--line" ref="dateLineChartDom" id="dateLineChartDom"></div>
  </div>
</template>

<script>
import Echarts from 'echarts';
export default {
  name: 'dateData.vue',
  data() {
    return {
      lineDataList: [
        {
          time: '2020-11-07',
          value: '50'
        },
        {
          time: '2020-11-07',
          value: '50'
        }
      ],
      myChart: null,
      timeStr: null
    };
  },
  mounted() {
  },
  methods: {
    initComp() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.timeStr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      // 按时间查询
      this.getDateInfo();
    },
    getDateInfo() {
      // 样式重置
      this.renderLineCharts();
      this.$nextTick(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      });
    },
    renderLineCharts() {
      this.myChart = Echarts.init(this.$refs.dateLineChartDom);
      // 指定图表的配置项和数据
      //数据
      let options = {
        grid: {
          left: '65',
          top: '45',
          bottom: '30',
          right: '32'
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{a}: {c}（方）'
        },
        yAxis: [
          {
            name: '并发',
            min: 0,
            max: 60,
            interval: 15,
            type: 'value',
            position: 'left',
            splitLine: {
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
              fontFamily: 'PingFangSC-Regular, PingFang SC'
            }
          }
        ],
        xAxis: [
          {
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
                fontFamily: 'PingFangSC-Regular, PingFang SC'
              }

            },
            data: ['2020-07-12', "2020-07-13", "2020-07-14", "2020-07-15", "2020-07-16", "2020-07-17", "2020-07-18"],
          }
        ],
        series: [
          {
            name: '并发',
            type: "line",
            smooth: true,
            data: [22, 37, 51, 55, 32, 11, 1],
            itemStyle: {
              normal: {
                borderWidth: 5,
                color: '#FB3A32',
              }
            }
          }
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(options);
    }
  }
};
</script>

<style lang="less" scoped>
.date--data {
  .padding41-40();
}
.echarts--line {
  display: block;
  width: 100%;
  height: 311px;
  box-sizing: border-box;
  border: 1px solid #E6E6E6;
  padding: 16px 32px 32px 49px;
}
.date__query__form {
  margin-bottom: 24px;
}
</style>
