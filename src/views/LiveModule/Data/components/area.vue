<template>
  <div class="area-list">
    <el-row>
      <el-col :span="14">
        <div :style="{ height: '540px', width: '100%' }" ref="mapEchart"></div>
      </el-col>
      <el-col :span="10">
        <div class="grid-table">
          <el-scrollbar>
            <table border="0">
              <tr>
                <th>省份</th>
                <th>选择人数</th>
                <th>占比</th>
              </tr>
              <tr v-for="(item, index) in areaDataList" :key="index">
                <td>{{ item.name || '城市' }}</td>
                <td>{{ item.value || 0 }}</td>
                <td>{{ ((parseInt(item.value) / total) * 100).toFixed(2) }}%</td>
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
  // import '../../../../../node_modules/echarts/map/js/china.js'; // 引入中国地图数据
  import jsonData from '@/common/json/china.json';
  export default {
    props: ['areaDataList'],
    mounted() {
      this.initDataLimit();
    },
    data() {
      return {
        total: 0,
        maxNum: 10,
        mapChart: null
      };
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeCharts);
    },
    methods: {
      initDataLimit() {
        this.areaDataList.map(item => {
          item.name = item.item_subject || '未选择';
          item.value = item.num;
        });
        this.total = this.areaDataList.reduce((tem, item, index) => {
          return tem + Number(item.value);
        }, 0);
        this.maxNum = Math.max.apply(
          Math,
          this.areaDataList.map(item => {
            return parseInt(item.value);
          })
        );
        this.initMapEcharts(this.areaDataList, this.maxNum);
      },
      initMapEcharts(data, maxNum) {
        echarts.registerMap('chinas', jsonData);
        this.mapChart = echarts.init(this.$refs.mapEchart); //这里是为了获得容器所在位置
        let options = {
          backgroundColor: '#fff',
          tooltip: {
            show: true,
            formatter: function (params) {
              let value = params.value ? params.value : 0;
              // let num = 0;
              // if (!value) {
              //   num = 0;
              // } else {
              //   num = ((parseInt(value) / data.total) * 100).toFixed(2);
              // }
              let res = params.name + '<br/>选择人数' + '  ' + parseInt(params.value || 0);
              return res;
            }
          },
          visualMap: {
            min: 0,
            max: maxNum,
            left: '10',
            top: 'bottom',
            type: 'continuous',
            text: ['high', 'low'],
            calculable: true,
            color: ['#fb3a32', '#ff6250', '#ffd5c1', '#fff8e1', '#fff'],
            show: false
          },
          series: [
            {
              type: 'map',
              mapType: 'chinas',
              label: {
                normal: {
                  textStyle: {
                    color: '#000',
                    fontSize: 14
                  }
                }
              },
              left: '50',
              top: '30',
              itemStyle: {
                normal: {
                  borderColor: '#7f7f7f',
                  label: {
                    show: false
                  },
                  areaStyle: {
                    color: '#f4f4f4'
                  }, //设置地图背景色的颜色设置
                  color: '#f4f4f4',
                  fontSize: '10px',
                  areaColor: '#fff'
                },
                emphasis: {
                  label: {
                    show: true
                  },
                  areaColor: '#e7271f'
                }
              },
              data: data
            }
          ]
        };
        this.mapChart.setOption(options);
        window.addEventListener('resize', this.resizeCharts);
      },
      resizeCharts() {
        this.mapChart.resize();
      }
    }
  };
</script>
<style lang="less" scoped>
  .grid-table {
    max-height: 540px;
    overflow: auto;
    table {
      width: 360px;
    }
    th {
      background: #f7f7f7;
      height: 32px;
      line-height: 32px;
      color: #1a1a1a;
      font-size: 16px;
      padding: 0 10px;
      text-align: left;
    }
    td {
      line-height: 22px;
      color: #666666;
      font-size: 14px;
      padding: 0 10px;
      text-align: left;
    }
  }
</style>
