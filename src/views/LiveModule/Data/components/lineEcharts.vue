<template>
  <div class="other-echarts">
    <el-row>
      <el-col :span="14"
        > <div :style="{ height: '300px', width: '100%' }" ref="barEchart"></div></el-col>
      <el-col :span="10">
        <div class="grid-table">
          <el-scrollbar>
          <table border="0">
            <tr>
              <th>选项</th>
              <th>填写人数</th>
              <th>占比</th>
            </tr>
            <tr v-for="(item, index) in tableList" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
              <td>{{ ((parseInt(item.value) / total) * 100).toFixed(2)}}%</td>
            </tr>
          </table>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  props: ['otherList'],
  data() {
    return {
     total: 0,
     barEcharts: null,
     tableList: []
    }
  },
  mounted() {
    this.initDataLimit();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    initDataLimit() {
      let Xline = [];
      let Yline = [];
      this.tableList = [];
      this.otherList.map(item => {
        if (parseInt(item.item_id) > 0) {
          Xline.push(item.item_subject)
          Yline.push(item.num)
          this.tableList.push({
            name:item.item_subject,
            value: item.num
          })
        }
      })
      // this.otherList.map(item => {
      //   if (!item.item_id) {
      //     item.name = item.item_subject;
      //     item.value = item.num;
      //   }
      // })
      this.total = Yline.reduce((tem, item, index) =>{return tem + Number(item)}, 0);
      this.initBarEcharts(Xline, Yline);
    },
    initBarEcharts(xData, yData) {
      let that = this;
      this.barEcharts = echarts.init(this.$refs.barEchart, {
        noDataLoadingOption: {
          text: '暂无数据',
          effect:'bubble',
          effectOption : {
            effect: {
                n: 0 //气泡个数为0
            }
          },
          textStyle: {
              fontSize: 24,
              fontWeight: 'bold'
          }
        }
      });
      let option = {
        tooltip: {
          show: true,
          formatter: function (params) {
            let value = params.value ? params.value : 0;
            let res = params.name + '<br/>填写人数' + '  ' + parseInt(params.value || 0);
            return res;
          },
        },
        xAxis: {
          type: 'category',
          data: xData,
        },
        yAxis: {
          type: 'value',
        },
        color: ['#FB3A32'],
        series: [
          {
            data: yData,
            type: 'bar',
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)',
            },
            emphasis: {
              barWidth: '20%'
            }
          },
        ],
      };
      this.barEcharts.setOption(option);
      window.addEventListener('resize', this.resizeCharts)
    },
    resizeCharts() {
      this.barEcharts.resize()
    }
  }
}
</script>
<style lang="less" scoped>
  .grid-table{
    max-height: 300px;
    overflow: auto;
    th{
      background: #F7F7F7;
      height: 32px;
      line-height: 32px;
      color: #1A1A1A;
      font-size: 16px;
      text-align: left;
      padding: 0 10px;
    }
    td{
      line-height: 22px;
      color: #666666;
      font-size: 14px;
      padding: 0 10px;
      text-align: left;
    }
  }
</style>
