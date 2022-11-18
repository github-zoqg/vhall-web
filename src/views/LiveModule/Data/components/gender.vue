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
        terBarCharts: null
      };
    },
    mounted() {
      this.initDataLimit();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeCharts);
    },
    methods: {
      initDataLimit() {
        this.genderList.map(item => {
          item.name = item.item_subject ? item.item_subject.substr(0, 8) : '未选择';
          item.value = item.num || 0;
        });
        this.initTerBroCharts(this.genderList);
      },
      initTerBroCharts(data) {
        // console.log(topList);
        let that = this;
        this.terBarCharts = echarts.init(this.$refs.terBroEchart);
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}</br> 选择人数 {c}'
          },
          legend: {
            orient: 'vertical',
            top: 80,
            right: '30%',
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            formatter: function (name) {
              let topList = [];
              let topValue = 0;
              data.map(item => {
                if (item.name === name) {
                  topValue = item.value;
                }
                topList.push(item.value);
              });
              let sum = topList.reduce((prev, cur) => prev + cur);
              return name + '   ' + ((topValue / sum) * 100).toFixed(2) + '%';
            },
            data: data
          },
          color: ['#FA9A32', '#4383E4', '#ff6250', '#ffd5c1', '#fff8e1'],
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
              position: 'center'
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              show: false,
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: data
          }
        };
        this.terBarCharts.setOption(option);
        window.addEventListener('resize', this.resizeCharts);
      },
      resizeCharts() {
        this.terBarCharts.resize();
      }
    }
  };
</script>
