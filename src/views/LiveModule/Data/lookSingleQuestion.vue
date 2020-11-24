<template>
  <div class="single-question">
    <pageTitle title="问卷详情"></pageTitle>
    <el-card>
      <div class="question-title">
        <h1>
          这是问卷标题，固定宽度，超过折行显示这是问卷标题，固定宽度，超过折行显示这是问卷标题，固定宽度，超过折行显示这是问卷标题，固定宽度，超过折行显示这是问卷标题，固定宽度，超过折行显示
        </h1>
        <p>填写人数:<span>100</span></p>
        <div class="export">
          <el-button type="primary" round>导出数据</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="question-item">
      <div class="question-gender">
        <p>性别统计(单选题)</p>
        <div class="terEchart">
          <div
            :style="{ height: '300px', width: '50%' }"
            ref="terBroEchart"
          ></div>
          <div class="terList">
            <table border="0">
              <tr>
                <th>性别</th>
                <th>填写人数</th>
                <th>占比</th>
              </tr>
              <tr v-for="(item, index) in genderList" :key="index">
                <td>{{ item.name }}</td>
                <td>100</td>
                <td>{{ (item.value / 100) * 100 }}%</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="question-city">
        <p>地域统计(城市题目)</p>
        <div class="map-charts">
          <map-echarts :areaDataList="areaDataList"></map-echarts>
        </div>
      </div>
      <div class="question-subject">
        <p>这里是题目名称1（单选题）</p>
        <div class="barEchart">
          <div :style="{ height: '300px', width: '50%' }" ref="barEchart"></div>
          <div class="terList">
            <table border="0">
              <tr>
                <th>性别</th>
                <th>填写人数</th>
                <th>占比</th>
              </tr>
              <tr v-for="(item, index) in barDataList" :key="index">
                <td>{{ item.name }}</td>
                <td>100</td>
                <td>{{ (item.value / 100) * 100 }}%</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import pageTitle from '@/components/PageTitle';
import mapEcharts from '@/components/Echarts/mapEcharts';
import echarts from 'echarts';
export default {
  data() {
    return {
      genderList: [
        {
          name: '女',
          value: '40',
        },
        {
          name: '男',
          value: '30',
        },
      ],
      areaDataList: {
        total: 1050,
        max_number: 400,
        list: [
          {
            name: '新疆',
            value: '100',
          },
          {
            name: '西藏',
            value: '200',
          },
          {
            name: '内蒙古',
            value: '300',
          },
          {
            name: '甘肃',
            value: '400',
          },
          {
            name: '云南',
            value: '50',
          },
        ],
      },
      barDataList: [],
    };
  },
  components: {
    pageTitle,
    mapEcharts,
  },
  mounted() {
    this.initEchart();
    this.initBarEcharts();
  },
  methods: {
    initEchart() {
      let that = this;
      let terBarCharts = echarts.init(this.$refs.terBroEchart);
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}</br> 填写比例 ({d}%)',
        },
        color: ['#4383E4', '#FA9A32', '#7D43E4', '#FB3A32', '#ccc'],
        series: {
          // name: this.legend,
          type: 'pie',
          radius: '50%',
          center: ['35%', '40%'],
          avoidLabelOverlap: false,
          // emphasis: {
          //     label: {
          //         show: true,
          //         fontSize: '30',
          //         fontWeight: 'bold'
          //     }
          // },
          // roseType: 'radius',
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            show: false,
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: that.genderList,
        },
      };
      terBarCharts.setOption(option);
    },
    initBarEcharts() {
      let that = this;
      let barEcharts = echarts.init(this.$refs.barEchart);
      let option = {
        xAxis: {
          type: 'category',
          data: ['母婴用品', '牛奶用品', '选项3', '选项4', '选项5', '选项6', '选项7'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
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
      barEcharts.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
.question-title {
  // text-align: center;
  position: relative;
  h1 {
    font-size: 20px;
    color: #1a1a1a;
    font-weight: bold;
    line-height: 40px;
    width: 80%;
    padding-left: 20px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  p {
    width: 80%;
    text-align: center;
  }
  .export {
    position: absolute;
    right: 0;
    top: 5px;
  }
}
.question-item {
  margin: 24px 0;
  p {
    height: 40px;
    line-height: 40px;
  }
  .terEchart,
  .barEchart {
    display: flex;
    .terList {
      margin-top: 30px;
    }
  }
}
</style>
