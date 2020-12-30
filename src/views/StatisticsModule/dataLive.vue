<template>
  <div class="data-live" v-loading="loading" element-loading-text="数据获取中">
    <pageTitle :title="$route.meta.title">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <div class="box-card">
      <search-area
        ref="searchArea"
        :active="active"
        :searchAreaLayout="searchAreaLayout"
        @onExportData="exportCenterData()"
        @onSearchFun="getTableList('search')"
      >
      </search-area>
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
        v-show="totalNum"
      >
      </table-list>
      <div class="no-live" v-show="!totalNum">
        <noData :nullType="nullText" :text="'暂未创建活动'">
         <el-button type="primary" round @click="createLive" v-if="nullText==='noData'">创建直播</el-button>
        </noData>
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
      searchAreaLayout: [
        {
          type: "1",
          options: [
            {
              title: '全部',
              active: 1,
            },
            {
              title: '近7日',
              active: 3,
            },
            {
              title: '近30日',
              active: 4,
            }
          ]
        },
        {
          type: "2",
          key: "searchTime",
        },
        {
          type: "",
          key: "title",
        }
      ],
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      let paramsObj = {};
      if (this.active == 1) {
        paramsObj.start_time = '';
        paramsObj.end_time = '';
      } else {
        paramsObj.start_time = getRangeDays(this.active);
        paramsObj.end_time = getRangeDays(5);
      }
       if (params === 'search') {
          pageInfo.pageNum = 1;
          pageInfo.pos = 0;
        }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
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
        if (params === 'search' && !res.data.total) {
          this.nullText = 'search';
        }
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
      this.$fetch('exportWebinar', this.params).then(res => {
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
      that.$router.push({
        path: `/live${val.path}/${id}`,
        query: {
          roomId: val.rows.room_id
        }
      });
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
  }
}
</style>
