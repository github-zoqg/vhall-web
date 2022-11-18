<template>
  <div class="terBroCharts">
    <div class="terBro-title">
      <span>{{ isTerBar === 1 ? '观看终端' : '浏览器' }}</span>
      <el-tooltip effect="dark" placement="right" v-tooltipMove>
        <div slot="content">
          {{ isTerBar === 1 ? '统计观看终端占比情况' : '统计观看浏览器占比情况' }}
        </div>
        <i class="iconfont-v3 saasicon_help_m"></i>
        <!-- <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button> -->
      </el-tooltip>
    </div>
    <div :style="{ height: '300px', width: '100%' }" ref="terBroEchart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts';
  export default {
    props: ['isTerBar', 'terDataList'],
    data() {
      return {
        isActive: true,
        terBarCharts: null,
        terColorList: ['#4383E4', '#FA9A32', '#7D43E4', '#FB3A32', '#ccc'],
        broColorList: ['#FB3A32', '#4383E4', '#10D3A8', '#FA9A32', '#7D43E4', '#ccc']
      };
    },
    watch: {
      terDataList: {
        handler(data) {
          this.initTerBroCharts(data);
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeCharts);
    },
    methods: {
      initTerBroCharts(data) {
        let that = this;
        this.terBarCharts = echarts.init(this.$refs.terBroEchart);
        let options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>观看次数  {c}  ({d}%)'
          },
          title: {
            text: '暂无数据',
            x: 'center',
            y: 'center',
            show: !data.length,
            textStyle: {
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#666'
            }
          },
          legend: {
            orient: 'vertical',
            top: 'middle',
            right: 40,
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
          color: that.isTerBar === 1 ? that.terColorList : that.broColorList,
          series: {
            // name: this.legend,
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['30%', '50%'],
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
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: data
          }
        };
        this.terBarCharts.setOption(options);
        window.addEventListener('resize', this.resizeCharts);
      },
      resizeCharts() {
        this.terBarCharts.resize();
      }
    }
  };
</script>
<style lang="less" scoped>
  .terBroCharts {
    // width: 100%;
    margin-top: 24px;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    .terBro-title {
      text-align: left;
      span {
        display: inline-block;
        padding: 24px 0 0 32px;
      }
      .el-button.is-circle {
        padding: 3px;
      }
      i {
        font-size: 14px;
        padding: 0 2px;
      }
    }
    .noPage {
      width: 100%;
      height: 300px;
      text-align: center;
      line-height: 300px;
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
  }
</style>
