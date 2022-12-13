<template>
  <div class="data-info">
    <!--v-loading="loading" element-loading-text="加载中，请稍候" element-loading-background="rgba(255,255,255,.9)" -->
    <pageTitle :pageTitle="$route.meta.title">
      <div slot="content">
        1.数据更新频率：天，不支持查看当日数据
        <br />
        2.控制台数据统计为真实数据，不统计虚拟数据
        <br />
        3.删除活动或者删除子账号，不影响已统计的历史数据
      </div>
    </pageTitle>
    <div class="search">
      <el-date-picker
        v-model="dateValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        unlink-panels
        @change="getTimeList"
        range-separator="至"
        prefix-icon="iconfont-v3 saasicon_date"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @focus="pickerFocus"
        style="width: 240px; margin-right: 16px"
      />
      <el-select
        filterable
        v-model="versionType"
        v-if="parentId == 0 && childNum == 1"
        @change="getVersionList"
        style="width: 160px; vertical-align: top"
      >
        <el-option
          v-for="(opt, optIndex) in versionOptions"
          :key="optIndex"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <div class="export-data">
        <el-button round size="medium" @click="exportCenterData" class="transparent-btn">
          导出数据
        </el-button>
      </div>
    </div>
    <!-- <search-area
      ref="searchArea"
      :active="active"
      :searchAreaLayout="searchAreaLayout"
      scene="center_data"
      @onExportData="exportCenterData()"
      @onSearchFun="getDataList('search')"
    >
    </search-area> -->
    <main-data :mainKeyData="mainKeyData"></main-data>
    <div class="statistical-data">
      <div class="statistical-title">统计图表</div>
      <div class="statistical-line">
        <span>观看人数访问趋势</span>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content">筛选条件内，观看人数随时间变化的趋势图</div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
        <div class="changeOption">
          <span :class="isActive ? 'span-active' : ''" @click="changeTime('直播')">直播</span>
          <span :class="isActive ? '' : 'span-active'" @click="changeTime('回放')">回放</span>
        </div>
        <lint-charts :lineDataList="lineDataList" :type="3"></lint-charts>
      </div>
      <div class="statistical-map">
        <div class="map-title">
          <span>观看地域TOP10占比</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">统计观看地域TOP10占比情况</div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
        </div>
        <template>
          <map-charts :areaDataList="areaDataList"></map-charts>
        </template>
      </div>
      <el-row class="statistical-ter">
        <el-col :span="12">
          <div class="bg-purple">
            <ter-charts :isTerBar="1" :terDataList="deviceDataList"></ter-charts>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-purple">
            <ter-charts :isTerBar="2" :terDataList="browerDataList"></ter-charts>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import mainData from '@/components/Echarts/mainData';
  import lintCharts from '@/components/Echarts/lineEcharts';
  import mapCharts from '@/components/Echarts/mapEcharts';
  import terCharts from '@/components/Echarts/terBroEcharts';
  import PageTitle from '@/components/PageTitle';
  import { sessionOrLocal } from '@/utils/utils';
  import { getRangeDays } from '@/utils/general';
  export default {
    name: 'dataInfo',
    components: {
      mainData,
      lintCharts,
      mapCharts,
      terCharts,
      PageTitle
    },
    data() {
      let _this = this;
      return {
        isActive: true,
        active: 1,
        timeType: 0,
        loading: true,
        params: {}, //导出的时候用来记录参数
        searchAreaLayout: [
          {
            type: '1',
            options: [
              {
                title: '全部',
                active: 1
              },
              {
                title: '近7日',
                active: 3
              },
              {
                title: '近30日',
                active: 4
              }
            ]
          },
          {
            type: '2',
            key: 'searchTime'
          }
        ],
        versionOptions: [
          {
            label: '主账号',
            value: 1
          },
          {
            label: '主账号+子账号',
            value: 2
          }
        ],
        dateValue: '',
        versionType: 1,
        pickerOptions: {
          shortcuts: [
            {
              text: '全部',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[0].style.color = '#FB3A32';
                picker.$el.firstChild.firstChild.children[1].style.color = '#666';
                picker.$el.firstChild.firstChild.children[2].style.color = '#666';
                const end = '';
                const start = '';
                picker.$emit('pick', [start, end]);
                _this.timeType = 0;
              }
            },
            {
              text: '近7日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                console.log(picker, 'picker');
                picker.$el.firstChild.firstChild.children[1].style.color = '#FB3A32';
                picker.$el.firstChild.firstChild.children[0].style.color = '#666';
                picker.$el.firstChild.firstChild.children[2].style.color = '#666';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                _this.timeType = 1;
              }
            },
            {
              text: '近30日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[2].style.color = '#FB3A32';
                picker.$el.firstChild.firstChild.children[1].style.color = '#666';
                picker.$el.firstChild.firstChild.children[0].style.color = '#666';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                _this.timeType = 2;
              }
            }
          ],
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: time => {
            return this.dealDisabledData(time);
          }
        },
        allDataList: {},
        mainKeyData: {},
        lineDataList: [],
        areaDataList: {},
        browerDataList: [],
        deviceDataList: [],
        pickerClickFlag: false
      };
    },
    created() {
      this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.childNum = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
        'child_num_limit'
      ];
    },
    mounted() {
      this.setTimeStr();
      this.getDataList();
    },
    methods: {
      pickerFocus(e) {
        if (this.pickerClickFlag) return;
        this.pickerClickFlag = true;
        this.$nextTick(() => {
          e.picker.$el.firstChild.firstChild.children[0].style.color = '#666';
          e.picker.$el.firstChild.firstChild.children[1].style.color = '#FB3A32';
        });
      },
      dealDisabledData(time) {
        // return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        return time.getTime() > Date.now() - 8.64e7; //设置选择今天之前的日期（不能选择当天）
      },
      getTimeList() {
        let timeArr = [100563, 100564, 100565];
        this.$vhall_paas_port({
          k: timeArr[this.timeType],
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.getDataList();
      },
      getVersionList() {
        this.$vhall_paas_port({
          k: this.versionType == 1 ? 100569 : 100570,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.getDataList();
      },
      getDataList() {
        let params = {
          // account_id: this.userId,
          type: this.versionType || 1,
          start_time: this.dateValue ? this.dateValue[0] : '',
          end_time: this.dateValue ? this.dateValue[1] : ''
        };
        // let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
        // let paramsObj = {
        //   account_id: this.userId,
        //   end_time: getRangeDays(1)
        // };
        // for (let i in formParams) {
        //   if (i === 'searchTime' && formParams.searchTime) {
        //     paramsObj['start_time'] = formParams[i][0];
        //     paramsObj['end_time'] = formParams[i][1];
        //   } else {
        //     paramsObj[i] = formParams[i];
        //   }
        // }
        // let obj = Object.assign({}, paramsObj);
        this.loading = true;
        this.params = params;
        this.getAllCenterData(params);
      },
      // 获取总数据
      getAllCenterData(params) {
        const lines = this.isActive ? 'live' : 'record';
        this.$fetch('getDataCenterInfo', this.$params(params))
          .then(res => {
            this.allDataList = res.data;
            console.log(this.allDataList);
            this.mainKeyData = this.allDataList.key_data;
            this.lineDataList = this.allDataList.trend[lines];
            this.browerDataList = this.allDataList.browser.list;
            this.areaDataList = this.allDataList.area;
            this.deviceDataList = this.allDataList.device.list;
          })
          .catch(e => {
            console.log(e);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 导出
      exportCenterData() {
        this.$fetch('exportCenterInfo', this.$params(this.params))
          .then(res => {
            this.$vhall_paas_port({
              k: 100566,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `账号维度下数据报告导出成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `账号维度下数据报告导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      changeTime(title) {
        if (title === '直播') {
          this.isActive = true;
          this.lineDataList = this.allDataList.trend.live;
        } else {
          this.isActive = false;
          this.lineDataList = this.allDataList.trend.record;
        }
        this.$vhall_paas_port({
          k: title === '直播' ? 100567 : 100568,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      timeToStr(data) {
        let y, m, d;
        if (data) {
          y = data.getFullYear();
          m = data.getMonth() + 1;
          d = data.getDate();
          return y + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
        }
      },
      // 设置默认值
      setTimeStr() {
        const end = new Date();
        const start = new Date();
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

        this.dateValue = [this.timeToStr(start), this.timeToStr(end)];
      }
    }
  };
</script>
<style lang="less">
  .el-picker-panel__shortcut:nth-of-type(1) {
    color: #fb3a32;
  }
  .el-picker-panel__shortcut:nth-of-type(2) {
    color: #666;
  }
</style>

<style lang="less" scoped>
  .data-info {
    .search {
      margin-bottom: 24px;
      position: relative;
      /deep/.el-input__inner {
        border-radius: 18px;
        height: 36px;
        background: transparent;
      }
      /deep/.el-range-input {
        background: transparent;
      }
      /deep/.el-date-editor .el-range__icon {
        line-height: 29px;
      }
      /deep/.el-date-editor .el-range__close-icon {
        line-height: 28px;
      }
      /deep/.el-input__icon {
        line-height: 36px;
      }
      .export-data {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .statistical-data {
      margin-top: 24px;
      padding: 24px 32px;
      background: #fff;
      border-radius: 4px;
      .statistical-title {
        text-align: left;
        font-size: 16px;
        color: #1a1a1a;
        line-height: 22px;
        padding: 12px 0 37px 12px;
      }
      i {
        padding: 0 2px;
        font-size: 14px;
      }
      .iconfont-v3 {
        color: #999;
      }
    }
    .statistical-line {
      text-align: left;
      // padding-bottom: 10px;
      position: relative;
      border: 1px solid #e6e6e6;
      padding: 38px 0;
      margin: 0 12px;
      border-radius: 4px;
      span {
        font-size: 16px;
        color: #666666;
        margin: 0;
        padding-left: 34px;
      }
    }
    .changeOption {
      border-radius: 100px;
      border: 1px solid #e6e6e6;
      position: absolute;
      top: 34px;
      right: 32px;
      cursor: pointer;
      span {
        display: inline-block;
        font-size: 14px;
        color: #666;
        padding: 8px 16px;
        border-radius: 100px;
      }
      .span-active {
        border: none;
        background: #fb3a32;
        color: #fff;
        border-radius: 100px;
      }
    }
    .statistical-map {
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      margin: 50px 12px 0 12px;
      .map-title {
        text-align: left;
        padding: 24px 0 0 32px;
      }
    }
    .statistical-ter {
      .bg-purple {
        margin: 0 12px;
      }
    }
  }
</style>
