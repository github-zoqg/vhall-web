<template>
  <div class="data-live">
    <pageTitle :pageTitle="$route.meta.title">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据
        <br />
        2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <div
      class="box-card"
      v-loading="loading"
      element-loading-text="加载中，请稍候"
      element-loading-background="rgba(255,255,255,.9)"
    >
      <div class="search">
        <el-select v-model="selectKey" @change="changeSelect" class="vh-data-select">
          <el-option
            v-for="item in selectOptions"
            :key="'v_' + item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
        <search-date
          v-show="selectKey == 1"
          ref="searchDateRef"
          @changeDate="searchTimeList"
        ></search-date>
        <search-input
          v-show="selectKey != 1"
          @changeContent="searchTableList"
          :searchType="selectKey"
        ></search-input>
        <div class="export-data">
          <el-button round size="medium" @click="exportCenterData" :disabled="!tableList.length">
            导出数据
          </el-button>
        </div>
      </div>
      <table-list
        ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :totalNum="totalNum"
        :width="240"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
      ></table-list>
      <div class="no-live" v-show="!totalNum">
        <noData :nullType="'noData'" :text="'暂无数据'"></noData>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import noData from '@/views/PlatformModule/Error/nullPage';
  import { sessionOrLocal } from '@/utils/utils';
  import searchDate from './components/searchDate';
  import searchInput from './components/searchInput';

  export default {
    name: 'dataLive',
    components: {
      PageTitle,
      noData,
      searchDate,
      searchInput
    },
    data() {
      return {
        timeOpt: {
          start_time: '',
          end_time: ''
        },
        selectKey: 1, // 1时间选择 2活动id 3活动名称 4专题id 5专题名称
        isCheckout: false,
        active: 3,
        nullText: 'noData',
        totalNum: 0,
        dateValue: '',
        searchStr: '',
        timeType: 2,
        loading: true,
        tableList: [],
        tabelColumn: [
          {
            label: '活动ID',
            key: 'webinar_id',
            width: '120px'
          },
          {
            label: '活动标题',
            key: 'subject',
            customTooltip: true
          },
          {
            label: '观看人数',
            key: 'total_watch_number',
            width: '120px'
          },
          {
            label: '观看次数',
            key: 'total_watch_times',
            width: '120px'
          },
          {
            label: '观看时长（分）',
            key: 'watch_duration',
            width: '140px'
          }
        ],
        tableRowBtnFun: [
          {
            name: '数据报告',
            methodName: 'dataReport',
            path: '/reportsData',
            index: 100042
          },
          {
            name: '互动统计',
            methodName: 'dataReport',
            path: '/interactionData',
            index: 100043
          },
          {
            name: '用户统计',
            methodName: 'dataReport',
            path: '/userData',
            index: 100044
          }
        ],
        selectOptions: [
          { label: '按活动创建时间', id: 1 },
          { label: '按专题名称', id: 5 },
          { label: '按专题ID', id: 4 },
          { label: '按活动名称', id: 3 },
          { label: '按活动ID', id: 2 }
        ]
      };
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
    },
    mounted() {
      // this.$EventBus.$emit('onceQueryDateLiveData')
      // 时间空间和搜索栏交替使用时，只用回车操作及切换日期时，调用接口获取数据列表
    },
    methods: {
      changeSelect() {
        this.$nextTick(() => {
          this.$EventBus.$emit('changeDateLiveSelect');
        });
      },
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      searchTimeList(opt) {
        const { data, type } = opt;
        const timeArr = [100571, 100572, 100573, 100574];
        this.timeOpt.start_time = data.time[0];
        this.timeOpt.end_time = data.time[1];
        this.$vhall_paas_port({
          k: timeArr[data.timeType],
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
        this.getTableList(type);
      },
      searchTableList(opt) {
        const { data } = opt;
        this.searchStr = data.content;
        this.$vhall_paas_port({
          k: 100576,
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
        this.getTableList('search');
      },
      getTableList(type) {
        const pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        console.log(1, type);

        if (type === 'search') {
          pageInfo.pageNum = 1;
          pageInfo.pos = 0;
          console.log(2);
        }
        console.log(3, pageInfo);
        const extraOptions = this.formatParmas();
        const options = {
          ...extraOptions,
          ...pageInfo
        };
        this.getLiveList(options);
      },
      getLiveList(data) {
        this.loading = true;
        this.$fetch('getActiveDataList', this.$params(data))
          .then(res => {
            this.tableList = res.data.list;
            this.totalNum = res.data.total;
          })
          .catch(error => {
            this.$message({
              message: `获取活动列表失败,${error.msg}`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      createLive() {
        this.$router.push({ path: '/live/edit' });
      },
      // 导出
      exportCenterData() {
        const extraOptions = this.formatParmas();
        this.$fetch('exportWebinar', this.$params({ ...extraOptions }))
          .then(res => {
            this.$vhall_paas_port({
              k: 100575,
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
              message: `活动数据导出成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `活动数据导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      dataReport(that, val) {
        let id = val.rows.webinar_id;
        that.$vhall_paas_port({
          k: val.index,
          data: {
            business_uid: that.userId,
            user_id: '',
            webinar_id: id,
            refer: 3,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        const routeData = that.$router.resolve({
          path: `/live${val.path}/${id}`,
          query: {
            roomId: val.rows.room_id
          }
        });
        window.open(routeData.href, '_blank');
      },
      formatParmas() {
        const opt = {};
        switch (this.selectKey) {
          case 1:
            opt.start_time = this.timeOpt.start_time;
            opt.end_time = this.timeOpt.end_time;
            break;
          case 2:
            opt.like_webinar_id = this.searchStr;
            break;
          case 3:
            opt.title = this.searchStr;
            break;
          case 4:
            opt.project_id = this.searchStr;
            break;
          case 5:
            opt.project_name = this.searchStr;
            break;
        }
        return opt;
      }
    }
  };
</script>
<style lang="less" scoped>
  .el-picker-panel__shortcut:nth-of-type(3) {
    color: #fb3a32;
  }
  .el-picker-panel__shortcut:nth-of-type(1) {
    color: #666;
  }
  .el-tooltip__popper {
    max-width: 400px;
    line-height: 17px;
  }
</style>
<style lang="less" scoped>
  .data-live {
    .box-card {
      background: #fff;
      padding: 24px 32px;
      border-radius: 4px;
      .search {
        position: relative;
        margin-bottom: 24px;
        .vh-data-select {
          width: 160px;
          vertical-align: top;
          margin-right: 16px;
          display: inline-block;
        }
        .data-search,
        .search-input {
          width: 218px;
          vertical-align: top;
          display: inline-block;
        }
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
        // /deep/.el-picker-panel__shortcut:nth-child(2) {
        //   color: #fb3a32;
        // }
      }
      .search-tag {
        width: 180px;
        /deep/ .el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          padding-right: 30px !important;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
        }
      }
    }
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
