<template>
  <div class="map-charts">
    <el-row>
      <el-col :span="16"
        ><div :style="{ height: '400px', width: '100%' }" ref="mapEchart"></div
      ></el-col>
      <el-col :span="8">
        <div class="grid-table">
          <table border="0">
            <tr>
              <th>省份</th>
              <th>观看次数</th>
              <th>占比</th>
            </tr>
            <tr>
              <td>nann</td>
              <td>1111</td>
              <td>10%</td>
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
      mapList: [
        {
          name: '新疆',
          value: 200,
        },
        {
          name: '云南',
          value: 500,
        },
        {
          name: '西藏',
          value: 300,
        },
        {
          name: '黑龙江',
          value: 400,
        },
        {
          name: '内蒙古',
          value: 100,
        },
        {
          name: '青海',
          value: 1000,
        },
      ],
    };
  },
  mounted() {
    this.initMapEcharts();
  },
  methods: {
    initMapEcharts() {
      this.mapDataList = [];
      let that = this;
      let mapChart = echarts.init(this.$refs.mapEchart); //这里是为了获得容器所在位置
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          show: true,
          formatter: function (params) {
            let value = params.value ? params.value : 0;
            let res = params.name + '<br/>观看次数' + '  ' + parseInt(value);
            // let res = params.name + '  ' + (parseInt(value) / (parseInt(that.regionTotal) ? parseInt(that.regionTotal) : 1) * 100).toFixed(2) + '%'+ '<br/>(观看次数占比)' ;
            return res;
          },
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: '10',
          top: 'bottom',
          type: 'continuous',
          text: ['high', 'low'],
          calculable: true,
          color: ['#fb3a32', '#ff6250', '#ffd5c1', '#fff8e1', '#fff'],
          show: false,
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
            data: that.mapList,
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
      margin-right: 60px;
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
