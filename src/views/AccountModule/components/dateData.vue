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
        :clearable=false
        @change="getDateInfo"
      />
    </div>
   <div class="echarts--line" ref="dateLineChartDom" id="dateLineChartDom"></div>
  </div>
</template>

<script>
import Echarts from 'echarts';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'dateData.vue',
  data() {
    return {
      lineDataList: [],
      myChart: null,
      timeStr: null,
      sonVo: null
    };
  },
  mounted() {
  },
  methods: {
    initComp(sonVo) {
      this.sonVo = sonVo;
      console.log(sonVo, 'dateData');
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.timeStr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      // 按时间查询
      this.getDateInfo();
    },
    getUserPayDetail() {
      console.log(this.vip_info, 'this.vip_info')
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'getFlowLineInfo' : 'getTrendLineInfo', {
        account_id: this.$route.params.str, // 子账号内容，传递子账号数据
        start_time: this.timeStr[0],
        end_time: this.timeStr[1],
        type: 1 // 1：仅父账号  2：父账号+子账号 注：若是查具体某个子账号的，也传递1
      }).then(res=>{
        if (res && res.code === 200) {
          let costList = res.data.list;
          costList.map(item => {
            item.typeText = item.type == 1 ? '主账号' : item.type == 2 ? '父账号+子账号' : '子账号';
            item.typePay = item.pay_type == 1 ? '并发 ' : '流量';
          });
          this.tableList = costList;
          this.renderLineCharts();
          this.$nextTick(() => {
            if (this.myChart) {
              this.myChart.resize();
            }
          });
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    getDateInfo() {
      this.getUserPayDetail();
    },
    renderLineCharts() {
      this.myChart = Echarts.init(this.$refs.dateLineChartDom);
      // 指定图表的配置项和数据
      let dateData = [], valData = [];
      this.tableList.forEach(item => {
        let {time, value} = item;
        dateData.push(time);
        valData.push(Number(value));
      });
      let max = 60;
      if (valData.length > 0) {
        max = Math.max(...valData);
      }
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
          formatter:  `{b} <br/>{a}: {c}（${this.sonVo.vip_info.type > 0 ? 'GB' : '方'}）`
        },
        yAxis: [
          {
            name: this.sonVo.vip_info.type > 0 ? '流量' : '并发',
            min: 0,
            max: max,
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
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
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
                fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
              }

            },
            data: dateData,
          }
        ],
        series: [
          {
            name: this.sonVo.vip_info.type > 0 ? '流量' : '并发',
            type: "line",
            smooth: true,
            data: valData,
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
