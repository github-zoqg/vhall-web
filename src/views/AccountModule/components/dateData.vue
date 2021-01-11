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
        :picker-options="pickerOptions"
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
      sonVo: null,
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      }
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    dealDisabledData(time) {
      // 设置选择的日期小于当前的日期,小于返回true,日期不可选
      // return time.getTime() < Date.now() - 8.64e7
      //return time.getTime() < Date.now() - 8.64e7;//设置选择今天以及今天之后的日
      return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      //return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
      // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      // 设置当天23：59：59可选
      // let currentTime = this.getNowMonthDay() + ` 23:59:59`
      // return time.getTime() > new Date(currentTime).getTime()
    },
    initComp(sonVo) {
      this.sonVo = sonVo;
      console.log(sonVo, 'dateData');
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
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

      let minLabel = dateData[0], maxLabel = dateData[dateData.length - 1];
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
      let level = 0;
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
          showTimeDate = dateData;
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
          showTimeDate = dateData;
        }
      }catch(e) {
        console.log(e);
      }

      let options = {
        visualMap: {
          show: false,
          type: 'continuous',
          min: 0,
          max: 100,
        },
        grid: {
          left: '65',
          top: '45',
          bottom: '30',
          right: '32'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          formatter:  `{b} <br/>{a}: {c}（${this.sonVo.vip_info.type > 0 ? 'GB' : '方'}）`
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
            interval: minLabel.length < 19 ? level : 'auto',
            textStyle: {
              color: '#999999',
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
            }

          },
          data: dateData,
        },
        yAxis: [
          {
            name: this.sonVo.vip_info.type > 0 ? '流量' : '并发',
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
            name: this.sonVo.vip_info.type > 0 ? '流量' : '并发',
            type: 'line',
            showSymbol: false,
            smooth: true,
            data: valData,
            color: '#fb3a32'
          },
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
  /* .padding41-40(); */
  padding: 24px 24px 0 24px;
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
