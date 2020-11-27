<template>
  <div class="map-charts">
    <el-row>
      <el-col :span="14"
        ><div :style="{ height: '400px', width: '100%' }" ref="mapEchart"></div
      ></el-col>
      <el-col :span="10">
        <div class="grid-table">
          <table border="0">
            <tr>
              <th>省份</th>
              <th>观看次数</th>
              <th>占比</th>
            </tr>
            <tr v-for="(item, index) in areaDataList.list" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
              <td>{{ ((parseInt(item.value) / areaDataList.total) * 100).toFixed(2)}}%</td>
            </tr>
          </table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts';
import '../../../node_modules/echarts/map/js/china.js'; // 引入中国地图数据
export default {
  data() {
    return {
    };
  },
  props: ['areaDataList'],
  watch: {
    areaDataList: {
      handler(data) {
        console.log(data, '2222222222222222');
        this.initMapEcharts(data);
      }
    }
  },
  mounted() {
    this.initMapEcharts(this.areaDataList);
  },
  methods: {
    initMapEcharts(data) {
      console.log(data, '11111111111111111111');
      // this.mapDataList = [];
      // let that = this;
      let mapChart = echarts.init(this.$refs.mapEchart); //这里是为了获得容器所在位置
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          show: true,
          formatter: function (params) {
            let value = params.value ? params.value : 0;
            let res = params.name + '<br/>观看次数' + '  ' + parseInt(value) + '<br/>观看比列' + '  ' + ((parseInt(value) / data.total) * 100).toFixed(2) + '%';
            return res;
          },
        },
        visualMap: {
          min: 0,
          max: data.max_number || 100,
          left: '10',
          top: 'bottom',
          type: 'continuous',
          text: ['high', 'low'],
          calculable: true,
          color: ['#fb3a32', '#ff6250', '#ffd5c1', '#fff8e1', '#fff'],
          show: true,
        },
        series: [
          {
            type: 'map',
            mapType: 'china',
            label: {
              normal: {
                textStyle: {
                  color: '#000',
                },
              },
            },
            left: '120',
            top: '30',
            itemStyle: {
              normal: {
                borderColor: '#d1d1d1',
                label: {
                  show: true,
                },
                areaStyle: {
                  color: '#f4f4f4',
                }, //设置地图背景色的颜色设置
                color: '#f4f4f4',
                fontSize: '10px',
                areaColor: '#fff',
              },
              emphasis: {
                label: {
                  show: true,
                },
                areaColor: '#e7271f',
              },
            },
            data: data.list,
          },
        ],
      };
      mapChart.setOption(options);
    },
  },
};
</script>
<style lang="less" scoped>
.map-charts {
  .grid-table {
    margin-top: 40px;
    table {
      float: right;
      margin-right: 90px;
      tr {
        height: 30px;
        line-height: 30px;
      }
      th,
      td {
        padding: 0 20px;
        text-align: left;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      th {
        font-size: 16px;
        color: #1a1a1a;
      }
      tr {
        font-size: 14px;
        font-weight: 400;
        color: #666;
      }
    }
  }
}
</style>
