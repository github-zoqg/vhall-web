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
        prefix-icon="iconfont-v3 saasicon_date"
        :picker-options="pickerOptions"
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
      let params = {
        account_id: this.$route.params.str, // 子账号内容，传递子账号数据
        type: 1 // 1：仅父账号  2：父账号+子账号 注：若是查具体某个子账号的，也传递1
      };
      if (this.timeStr) {
        params.start_time = this.timeStr[0] || '';
        params.end_time = this.timeStr[1] || '';
      }
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'getFlowLineInfo' : 'getTrendLineInfo', params).then(res=>{
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
        // 数据查询错误
        this.tableList = [];
        this.renderLineCharts();
        this.$nextTick(() => {
          if (this.myChart) {
            this.myChart.resize();
          }
        });
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
      let options = {
        visualMap: {
          show: false,
          type: 'continuous',
          min: 0,
          max: 100,
        },
        /* grid: {
          left: '65',
          top: '45',
          bottom: '30',
          right: '32'
        }, */
        grid: {
          // left: '85',
          left:'56',
          top: '25',
          bottom: '60',
          right: '32'
          // right: '95'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          formatter:  `{b} <br/>{a}: {c}（${this.sonVo.vip_info.type > 0 ? 'GB' : '方'}）`
        },
        xAxis: {
          /* name: '日期', */
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
          splitLine: {
            show: false,
            lineStyle: {
              type: 'solid',
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#999999',
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
            },
          },
          data: dateData || [],
        },
        yAxis: [
          {
          /*   name: this.sonVo.vip_info.type > 0 ? '流量' : '并发', */
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
            name: this.sonVo.vip_info.type > 0 ? '流量' : '并发',
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
            data: valData,
            lineStyle: {
              color: '#fb3a32'
            }
          },
        ],
      };
      if (valData && valData.length > 0) {
        options.dataZoom = [
          // 下面这个属性是 里面拖拽
          {
            type: 'inside',
            xAxisIndex: 0,
            minSpan: 5
          },
          {
            type: 'slider', //slider表示有滑动块的，inside表示内置的
            /* xAxisIndex: 0,
            minSpan: 5,
            height: 20,
            bottom: 10,
            handleSize: '100%' */
            show: true,
            height: 8,
            bottom: 10,
            showDataShadow: false,//是否显示数据阴影 默认auto
            borderColor: 'transparent',
            borderRadius: 20,
            backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
            // 拖拽手柄样式 svg 路径
            handleIcon: 'M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z',
            fillerColor: '#E6E6E6',
            handleSize: 14,
            handleStyle: {
              color: '#FFFFFF',
              shadowBlur: 0,
              borderWidth: 2,
              borderColor: '#fb3a32'
            },
            textStyle: {
              color: '#999999',
              fontSize: 12,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
            },
            start: 0,
            end: 100
          }
        ];
      } else {
        options.dataZoom = [];
      }
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
}
.date__query__form {
  margin-bottom: 24px;
  /deep/.el-input__inner{
    border-radius: 18px;
    height: 36px;
    background: transparent;
  }
  /deep/.el-range__close-icon {
    margin-bottom: 5px;
    // line-height: 36px;
  }
  /deep/.el-input__suffix{
    top: 0px;
  }
}
</style>
