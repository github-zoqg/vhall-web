<template>
  <div class="gender-data">
    <div :style="{ height: '240px', width: '100%' }" ref="terBroEchart"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  props: ['genderList'],
  data() {
    return {
    };
  },
  mounted() {
    this.initDataLimit();
  },
  methods: {
    initDataLimit() {
      this.genderList.map(item => {
        item.name = item.item_subject
        item.value = item.num
      })
      this.initTerBroCharts(this.genderList);
    },
    initTerBroCharts(data) {
      // console.log(topList);
      let that = this;
      let terBarCharts = echarts.init(this.$refs.terBroEchart);
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}</br> 填写人数 {c}',
        },
        legend: {
          orient: 'vertical',
          top: 80,
          right: '30%',
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          formatter: function(name) {
            let topList = [];
            let topValue = 0;
            data.map(item => {
              if (item.name === name) {
                topValue = item.value;
              }
              topList.push(item.value);
            });
            let sum = topList.reduce((prev, cur) => prev + cur);
            return name + '   ' + ((topValue/sum) * 100).toFixed(2) + '%';
          },
          data: data,
        },
        color: ['#FA9A32', '#4383E4'],
        series: {
          type: 'pie',
          radius: ['40%', '75%'],
          center: ['40%', '45%'],
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
          data: data,
        },
      };
      terBarCharts.setOption(option);
    },
  }
}
</script>
