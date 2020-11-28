<template>
  <div class="data-live">
    <pageTitle :title="$route.meta.title">
      <div slot="content">
        1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <el-card class="box-card">
      <search-area
        ref="searchArea"
        :searchAreaLayout="searchAreaLayout"
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
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
      >
      </table-list>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "dataLive",
  components: {
    PageTitle
  },
  data() {
    return {
      isCheckout: false,
      totalNum: 1000,
      tableList: [
        {
          id: '1',
          liveTitle: "哈哈哈哈哈哈哈哈哈哈哈喜喜iiii哈哈哈哈哈哈哈哈哈",
          wacthPeople: '123',
          wacthNum: '124',
          timeLang: '30:00:00'
        },
        {
          id: '2',
          liveTitle: '嘻嘻嘻',
          wacthPeople: '111',
          wacthNum: '222',
          timeLang: '50:00:00'
        }
      ],
      tabelColumn: [
        {
          label: '活动ID',
          key: 'id',
          width: 150,
        },
        {
          label: '活动标题',
          key: 'liveTitle',
          // width: 240,
        },
        {
          label: '观看人数',
          key: 'wacthPeople',
          width: 150,
        },
        {
          label: '观看次数',
          key: 'wacthNum',
          width: 150,
        },
        {
          label: '观看时长（分）',
          key: 'timeLang',
          width: 150,
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
          type: "1"
        },
        {
          type: "2",
          key: "searchTime",
        },
        {
          type: "",
          key: "searchTitle",
        }
      ],
    };
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
       let paramsObj = {
        account_id: '1234455'
      };
       if (params === 'search') {
          pageInfo.pageNum= 1;
          pageInfo.pos= 0;
          // 如果搜索是有选中状态，取消选择
          // this.$refs.tableList.clearSelect();
        }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
    },
    dataReport(that, val) {
      that.$router.push({
        path: val.path,
        query: {
          id: val.rows.id
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
}
</style>
