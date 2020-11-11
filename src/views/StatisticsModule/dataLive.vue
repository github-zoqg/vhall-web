<template>
  <div class="data-live">
    <div class="title-data">
      <span>{{ $route.name }}</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
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
        :isHandle="isHandle"
        :width="width"
        :totalNum="totalNum"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
        >
      </table-list>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "dataLive",
  // components: {
  //   tableList,
  //   searchArea,
  // },
  data() {
    return {
      isCheckout: false,
      width: 300,
      totalNum: 1000,
      isHandle: true,
      tableList: [
        {
          id: '1',
          liveTitle: "哈哈哈哈哈",
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
          width: 120
        },
        {
          label: '活动标题',
          key: 'liveTitle',
        },
        {
          label: '观看人数',
          key: 'wacthPeople',
          width: 120
        },
        {
          label: '观看次数',
          key: 'wacthNum',
          width: 120
        },
        {
          label: '观看时长（分）',
          key: 'timeLang',
          width: 200
        }
      ],
      tableRowBtnFun: [
        {
          name: '数据报告',
          methodName: 'dataReport',
          path: '/reports-data',
        },
        {
          name: '互动统计',
          methodName: 'dataReport',
          path: '/interaction-data',
        },
        {
          name: '用户统计',
          methodName: 'dataReport',
          path: '/user-data',
        }
      ],
      searchAreaLayout: [
        {
          type: "1"
        },
        {
          type: "2",
          key: "searchDate",
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
      if (params === 'search') {
        pageInfo.pageNum= 1;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
    },
    dataReport(that, val) {
      that.$router.push({
        path: val.path,
        query: {
          id: val.rows.id
        }
     });
    },
     //复选框操作
    changeTableCheckbox(val) {
      // let len = val.length;
      // let idList = [];
      // this.selectedTableItem.map(item => idList.push(item.mrId));
      this.selectedTableItem = val;
    }
  }
};
</script>

<style lang="less" scoped >
.data-live{
  /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle{
      padding:3px;
    }
    /deep/.el-card__body{
    padding: 5px 24px 51px 24px;
  }
    .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      line-height: 30px;
      span{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
      }
      .button-tip {
        vertical-align: top;
      }
    }
}
</style>
