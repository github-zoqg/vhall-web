<template>
  <div class="data-live" v-loading="loading" element-loading-text="数据获取中">
    <pageTitle :title="$route.meta.title">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <div class="box-card">
      <div class="search">
        <el-date-picker
          v-model="dateValue"
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          @change="searchTableList"
          range-separator="至"
          start-placeholder="开始日期"
          prefix-icon="iconfont-v3 saasicon_date"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 240px;margin-right:16px"
        />
        <VhallInput
          class="search-tag"
          placeholder="请输入活动标题"
          v-model.trim="title"
          clearable
          @change="searchTableList"
          @keyup.enter.native="searchTableList">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="searchTableList">
          </i>
        </VhallInput>
        <div class="export-data">
          <el-button round  size="medium" @click="exportCenterData">导出数据</el-button>
        </div>
      </div>
      <table-list
        ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :totalNum="totalNum"
        :width="320"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
      >
      </table-list>
      <div class="no-live" v-show="!totalNum">
        <noData :nullType="'noData'" :text="'暂未数据'"></noData>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
import { getRangeDays } from '@/utils/general';
export default {
  name: "dataLive",
  components: {
    PageTitle,
    noData
  },
  data() {
    return {
      isCheckout: false,
      active: 3,
      nullText: 'noData',
      totalNum: 0,
      dateValue: '',
      title: '',
      params: {}, //导出的时候用来记录参数
      loading: true,
      tableList: [],
      tabelColumn: [
        {
          label: '活动ID',
          key: 'webinar_id',
        },
        {
          label: '活动标题',
          key: 'subject',
        },
        {
          label: '观看人数',
          key: 'total_watch_number',
        },
        {
          label: '观看次数',
          key: 'total_watch_times',
        },
        {
          label: '观看时长（分）',
          key: 'watch_duration',
          width: '200px'
        }
      ],
      tableRowBtnFun: [
        {
          name: '数据报告',
          methodName: 'dataReport',
          path: '/reportsData',
        },
        {
          name: '互动统计',
          methodName: 'dataReport',
          path: '/interactionData',
        },
        {
          name: '用户统计',
          methodName: 'dataReport',
          path: '/userData',
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '全部',
            onClick(picker) {
              const end = '';
              const start = '';
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '近7日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近30日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }],
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      }
    };
  },
  created() {
    this.initPage()
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    dealDisabledData(time) {
      // return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
    },
    initPage() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.dateValue = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
    },
    searchTableList() {
      this.getTableList('search');
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let paramsObj = {
        title: this.title,
        start_time: this.dateValue ? this.dateValue[0] : '',
        end_time: this.dateValue ? this.dateValue[1] : ''
      };
      if (params === 'search') {
        pageInfo.pageNum = 1;
        pageInfo.pos = 0;
      }
      this.params = paramsObj;
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.getLiveList(obj, params);
    },
     getLiveList(data, params){
      this.loading = true;
      this.$fetch('getActiveDataList', this.$params(data)).then(res=>{
        this.tableList = res.data.list;
        this.totalNum = res.data.total;
      }).catch(error=>{
        this.$message.error(`获取活动列表失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    createLive() {
      this.$router.push({path: '/live/edit'})
    },
    // 导出
    exportCenterData() {
      this.$fetch('exportWebinar', this.$params(this.params)).then(res => {
        if (res.code == 200) {
          this.$message.success(`活动数据导出成功，请去下载中心下载`);
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(`活动数据${res.msg}`);
        }
      })
    },
    dataReport(that, val) {
      let id = val.rows.webinar_id;
      const routeData = that.$router.resolve({
        path: `/live${val.path}/${id}`,
        query: {
          roomId: val.rows.room_id
        }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped >
.data-live{
  /deep/.el-card__body{
    padding: 24px 32px;
  }
  .box-card{
    background: #fff;
    padding: 24px 32px;
    border-radius: 4px;
    .search{
      position: relative;
      margin-bottom: 24px;
      /deep/.el-input__inner{
        border-radius: 18px;
        height: 36px;
        background: transparent;
      }
      /deep/.el-range-input{
        background: transparent;
      }
      /deep/.el-date-editor .el-range__icon{
        line-height: 29px;
      }
      /deep/.el-date-editor .el-range__close-icon {
        line-height: 28px;
      }
      /deep/.el-input__icon{
        line-height: 36px;
      }
    }
    .search-tag {
      width: 180px;
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 50px!important;
      }
      /deep/ .el-input__suffix {
        cursor: pointer;
        /deep/ .el-input__icon {
          width: auto;
          margin-right: 5px;
          line-height: 36px;
        }
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
