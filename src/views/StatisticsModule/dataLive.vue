<template>
  <div class="data-live">
    <header-time></header-time>
    <table-list
      :manageTableData="tableList"
      :tabelColumnLabel="tabelColumn"
      :tableRowBtnFun="tableRowBtnFun"
      :isCheckout="isCheckout"
      :isHandle="isHandle"
      :width="width">
    </table-list>
    <pagination-list :total='total' :currentPage='currentPage'></pagination-list>
  </div>
</template>

<script>
import tableList from '@/components/DataList/list.vue';
import headerTime from "./components/headerTime";
import PaginationList from '@/components/Pagination/index.vue';
export default {
  name: "dataLive.vue",
  components: {
    tableList,
    PaginationList,
    headerTime
  },
  data() {
    return {
      isCheckout: false,
      width: 300,
      total: 2,
      isHandle: true,
      currentPage: 1,
      tableList: [
        {
          liveId: '1',
          liveTitle: '哈哈哈',
          wacthPeople: '123',
          wacthNum: '124',
          timeLang: '30:00:00'
        },
        {
          liveId: '2',
          liveTitle: 'xixiiii',
          wacthPeople: '111',
          wacthNum: '222',
          timeLang: '50:00:00'
        }
      ],
      tabelColumn: [
        {
          label: '活动ID',
          key: 'liveId',
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
          methodName: 'dataReport'
        },
        {
          name: '互动统计',
          methodName: 'hudong'
        },
        {
          name: '用户统计',
          methodName: 'tongji'
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped >

</style>
