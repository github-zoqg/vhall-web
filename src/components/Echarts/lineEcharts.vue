<template>
  <div class="line-charts">
    <div :style="{ height: '330px', width: '100%' }" ref="visitEchart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    props: ['lineDataList', 'type'],
    data() {
      return {
        isActive: true,
        visitEchart: null,
        visitDateList: [],
        visitValueList: []
      };
    },
    watch: {
      lineDataList: {
        handler(data) {
          this.initLintEcharts(data);
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeCharts);
    },
    methods: {
      initLintEcharts(data) {
        let visitDataDate = [];
        let visitDataValue = [];
        data.map(item => {
          visitDataDate.push(item.time);
          visitDataValue.push(item.value);
          // visitDataValue.push(item.value.replace(/,/g, ""));
        });

        // console.log(visitDataDate, visitDataValue);
        let that = this;
        this.visitEchart = echarts.init(this.$refs.visitEchart);
        let options = {
          visualMap: {
            show: false,
            type: 'continuous',
            min: 0,
            max: 100
          },
          grid: {
            // left: '85',
            left: '56',
            top: '25',
            bottom: '60',
            right: '32'
            // right: '95'
          },
          tooltip: {
            trigger: 'axis',
            show: true,
            formatter: `{b0}<br />${
              that.type == 1
                ? '流量'
                : that.type == 3
                ? '观看人数'
                : that.type == 2
                ? '时长'
                : '并发'
            }:{c0}${that.type == 1 ? 'GB' : that.type == 3 ? '' : that.type == 2 ? '分钟' : '方'}`
          },
          title: {
            text: '暂无数据',
            x: 'center',
            y: 'center',
            show: !visitDataValue.length,
            textStyle: {
              fontSize: 14,
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#666'
            }
          },
          xAxis: {
            // name: '日期',
            name: '',
            nameLocation: 'start',
            nameGap: 30,
            type: 'category',
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'solid'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#CCCCCC'
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#999999',
                fontSize: 12,
                fontFamily:
                  '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
              }
              /* formatter:function(value,index){
              console.log(showTimeDate, value);
              if (showTimeDate.includes(`${value}`)) {
                return value;
              } else {
                return '';
              }
            } */
            },
            data: visitDataDate || []
          },
          yAxis: [
            {
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
                  color: '#CCCCCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                formatter: '{value}',
                color: '#999999',
                fontSize: 12,
                fontFamily:
                  '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
              }
            }
          ],
          series: [
            {
              type: 'line',
              showSymbol: false,
              symbolSize: 2, //拐点圆的大小
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#fb3a32',
                  borderColor: '#fb3a32' //拐点边框颜色
                }
              },
              lineStyle: {
                color: '#fb3a32'
              },
              data: visitDataValue || []
              // color: '#fb3a32'
            }
          ]
        };
        if (visitDataValue && visitDataValue.length > 0) {
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
              showDataShadow: false, //是否显示数据阴影 默认auto
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
                fontFamily:
                  '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'
              },
              start: 0,
              end: 100
            }
          ];
        } else {
          options.dataZoom = [];
        }
        this.visitEchart.setOption(options);
        window.addEventListener('resize', this.resizeCharts);
      },
      resizeCharts() {
        this.visitEchart.resize();
      }
    }
  };
</script>
<style lang="less" scoped>
  .line-charts {
    width: 100%;
    background: #fff;
  }
</style>
