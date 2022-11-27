<template>
  <div class="contain-data">
    <pageTitle pageTitle="数据报告">
      <div slot="content">
        <p>1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据</p>
        <p>2.控制台数据统计为真实数据，不统计虚拟数据</p>
        <p>3.删除活动或者删除子账号，不影响已统计的历史数据</p>
      </div>
    </pageTitle>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <div class="search">
      <el-select
        filterable
        v-model="type"
        @change="changeType"
        v-if="liveDetailInfo.webinar_state != 4"
        style="width: 160px; vertical-align: top; margin-right: 16px"
      >
        <el-option
          v-for="(opt, optIndex) in timeData"
          :key="optIndex"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-date-picker
        v-model="dateValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        unlink-panels
        @change="getDataList"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        v-if="type == '1'"
        prefix-icon="iconfont-v3 saasicon_date"
        style="width: 240px"
      />
      <el-select
        filterable
        clearable
        v-model="switchId"
        v-if="type == '2'"
        @change="getDataList"
        style="width: 160px; vertical-align: top"
      >
        <el-option value="-1" label="全部正式直播"></el-option>
        <el-option
          v-for="(opt, optIndex) in switchList"
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
    <main-data :mainKeyData="mainKeyData" :titleType="titleType"></main-data>
    <div class="statistical-data">
      <div class="statistical-title">统计图表</div>
      <div class="statistical-line" v-if="titleType != 4">
        <span>并发趋势图</span>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content">筛选条件内，并发随时间变化的趋势图</div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
        <lint-charts :lineDataList="limitDataList" :type="0"></lint-charts>
      </div>
      <div class="statistical-line statistical-dark">
        <span>观看人数趋势</span>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content">筛选条件内，观看人数随时间变化的趋势图</div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
        <div class="changeOption" v-if="titleType != 4">
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
        <map-charts :areaDataList="areaDataList"></map-charts>
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
  import titleData from './components/title';
  import PageTitle from '@/components/PageTitle';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    data() {
      let _this = this;
      return {
        titleType: 1,
        active: 2,
        params: {}, //导出的时候用来记录参数
        mainKeyData: {
          max_onlines: 0,
          total_live_time: 0,
          total: 0
        },
        liveDetailInfo: {},
        allDataList: {},
        limitDataList: [],
        lineDataList: [],
        areaDataList: {},
        highMax: 0,
        webianr_id: '',
        timeType: 1,
        userId: JSON.parse(sessionOrLocal.get('userId')),
        deviceDataList: [],
        browerDataList: [],
        isActive: 1,
        switchId: '',
        dateValue: '',
        switchList: [],
        type: '1',
        versionType: 0,
        timeData: [
          {
            label: '按时间筛选',
            value: '1'
          },
          {
            label: '按场次筛选',
            value: '2'
          }
        ],
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
                const end = '';
                const start = '';
                picker.$emit('pick', [start, end]);
                _this.timeType = 0;
              }
            },
            {
              text: '今日',
              onClick(picker) {
                console.log(picker, '>>???????????????');
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[1].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime());
                start.setTime(start.getTime());
                picker.$emit('pick', [start, end]);
                _this.timeType = 1;
              }
            },
            {
              text: '近7日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[2].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();

                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                _this.timeType = 2;
              }
            },
            {
              text: '近30日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[3].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                _this.timeType = 3;
              }
            }
          ],
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: time => {
            return this.dealDisabledData(time);
          }
        }
      };
    },
    components: {
      mainData,
      lintCharts,
      mapCharts,
      terCharts,
      titleData,
      PageTitle
    },
    created() {
      this.initPage();
      this.getLiveDetail();
      this.versionType = JSON.parse(sessionOrLocal.get('versionType'));
    },
    mounted() {
      // this.getLiveDetail();
    },
    methods: {
      dealDisabledData(time) {
        return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      },
      initPage() {
        // 初始化设置日期为今天
        const end = new Date();
        const start = new Date();
        end.setTime(end.getTime());
        start.setTime(start.getTime());
        this.dateValue = [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')];
      },
      //获取直播详情
      getLiveDetail() {
        // webinar/info调整-正常的信息展示使用 0
        this.$fetch('getWebinarInfo', { webinar_id: this.$route.params.str, is_rehearsal: 0 })
          .then(res => {
            this.liveDetailInfo = res.data;
            if (this.liveDetailInfo.webinar_state != 4) {
              this.getLiveSwitchInfo();
              this.titleType = 1;
            } else {
              this.titleType = 4;
            }
            this.getDataList();
          })
          .catch(res => {
            this.$message({
              message: res.msg || `获取信息失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      },
      // 获取直播场次
      getLiveSwitchInfo() {
        this.$fetch('getWebinarSwitchList', { webinar_id: this.$route.params.str }).then(res => {
          this.switchList = res.data.switch_list.map((item, index) => {
            return {
              label: `第${res.data.switch_list.length - index}场 ${item.type == 2 ? '(彩排)' : ''}`,
              value: item.id
            };
          });
        });
      },
      getDataList(params) {
        if (this.type == 1) {
          let timeArr = [100435, 100436, 100437, 100438];
          this.$vhall_paas_port({
            k: timeArr[this.timeType],
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        let paramsObj = {
          webinar_id: this.$route.params.str,
          switch_id: this.switchId || 0,
          start_time: this.dateValue ? this.dateValue[0] : '',
          end_time: this.dateValue ? this.dateValue[1] : ''
        };
        this.params = this.$params(paramsObj);
        this.getAllData(this.$params(paramsObj));
      },
      getAllData(params) {
        let promiseArr = []; //promise异步数组
        let obj = {};
        let total = {};
        if (this.liveDetailInfo.webinar_state != 4) {
          promiseArr.push(
            this.$fetch('getMaxuv', params).then(res => {
              total.max_onlines = res.data.max_onlines;
            })
          );
        }
        promiseArr.push(
          this.$fetch('getWebinarSwitchList', params).then(res => {
            total.total_live_time = res.data.total_live_time;
            total.total = res.data.total;
          })
        );
        promiseArr.push(
          this.$fetch('getStatisticsinfo', params).then(res => {
            obj = {
              ...res.data
            };
          })
        );
        Promise.all(promiseArr).then(() => {
          this.mainKeyData = { ...obj, ...total };
        });
        // 获取用户统计
        this.$fetch('getDateUvinfo', params).then(res => {
          this.allDataList = res.data;
          if (this.liveDetailInfo.webinar_state == 4) {
            this.lineDataList = this.allDataList.record;
          } else {
            const lines = this.isActive ? 'live' : 'record';
            this.lineDataList = this.allDataList[lines];
          }
        });
        // 获取并发趋势图
        this.$fetch('getWebinarinfo', params).then(res => {
          this.limitDataList = res.data.list;
        });
        // 获取观看地域
        this.$fetch('getProvinceinfo', params).then(res => {
          this.areaDataList = res.data;
        });
        // 获取终端设备
        this.$fetch('getDeviceinfo', params).then(res => {
          this.deviceDataList = res.data.list || [];
        });
        // 获取浏览器
        this.$fetch('getBrowserinfo', params).then(res => {
          this.browerDataList = res.data.list || [];
        });
      },
      // 导出
      exportCenterData() {
        this.$fetch('exportWebinarInfo', this.params)
          .then(res => {
            this.$vhall_paas_port({
              k: 100441,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.$route.params.str,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `活动数据报告导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `活动数据报告导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      changeType() {
        if (this.type == 1) {
          this.switchId = '';
        } else {
          this.dateValue = '';
        }
        this.$vhall_paas_port({
          k: this.type == 1 ? 100439 : 100440,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.getDataList();
      },
      changeTime(title) {
        if (title === '直播') {
          this.isActive = true;
          this.lineDataList = this.allDataList.live;
        } else {
          this.isActive = false;
          this.lineDataList = this.allDataList.record;
        }
      }
    }
  };
</script>
<style lang="less">
  .el-picker-panel__shortcut:nth-of-type(2) {
    color: #fb3a32;
  }
  .el-picker-panel__shortcut:nth-of-type(1) {
    color: #666;
  }
</style>
<style lang="less" scoped>
  .contain-data {
    // margin: 0 41px;
    padding: 0;
    .search {
      position: relative;
      margin-bottom: 24px;
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
  }
  .statistical-data {
    background: #fff;
    padding: 24px 32px;
    border-radius: 4px;
    margin-top: 24px;
    .statistical-title {
      text-align: left;
      font-size: 16px;
      color: #1a1a1a;
      line-height: 22px;
      padding: 12px 0 50px 12px;
    }
    i {
      font-size: 14px;
      padding: 0 2px;
    }
  }
  .statistical-line {
    text-align: left;
    padding-bottom: 10px;
    position: relative;
    // padding-left: 32px;
    // padding-right: 32px;
    // /deep/.line-charts {
    //   padding: 0 32px;
    // }
    span {
      font-size: 16px;
      color: #666666;
      margin: 0;
      padding-left: 34px;
    }
    i {
      font-size: 14px;
    }
  }
  .statistical-dark {
    padding-top: 30px;
  }
  .changeOption {
    // width: 120px;
    height: 32px;
    border-radius: 100px;
    border: 1px solid #ccc;
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    span {
      display: inline-block;
      text-align: center;
      width: 59px;
      height: 32px;
      line-height: 26px;
      font-size: 14px;
      color: #666;
      padding: 3px 10px;
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
  /deep/.saasicon_help_m {
    color: #999999;
  }
</style>
