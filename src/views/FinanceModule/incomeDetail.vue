<template>
  <div class="income-detail">
    <div class="title-data">
      <span>收益详情</span>
    </div>
    <el-card class="box-card">
      <p>这里是活动名称</p>
      <span>直播时间：2020-09-09 10:00:00  </span>
    </el-card>
    <el-card class="box-card">
      <span>收益明细</span>
      <search-area
        ref="incomeDetils"
        :searchAreaLayout="searchDetail"
        @onSearchFun="getIncomeDetailList('search')"
      >
      </search-area>
      <table-list
        ref="tableIncome"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isCheckout="isCheckout"
        :isHandle="isHandle"
        :width="120"
        :totalNum="totalNum"
        @getTableList="getIncomeDetailList"
        >
      </table-list>
    </el-card>
  </div>
</template>

<script>
// import tableList from '@/components/DataList/list.vue';
// import searchArea from '@/components/SearchArea/index.vue';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 1000,
      searchDetail: [
        {
          type: '2',
          key: "searchDate"
        },
        {
          type: '2',
          key: "payType",
          options: [
            {
              label: '礼物',
              value: '1'
            },
            {
              label: '门票',
              value: '2'
            },
            {
              label: '打赏',
              value: '3'
            },
          ]
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [
        {
          no: '1',
          time: '2020-09-17',
          type: '支付宝',
          money: '123,000',
          content: 'hahhsdhjkdhfhjkfhdjghkfdjghkdj哈哈哈哈',
          status: '1',
          source: '直播',
          onDate: '2020-10-01',
          outDate: '2021-10-01'
        },
        {
          no: '1',
          time: '2020-01-17',
          type: '微信',
          money: '111,000',
          content: '哈哈减肥吧开始讲课',
          status: '2',
          source: '录播',
          onDate: '2020-01-01',
          outDate: '2021-01-01'
        }
      ],
      tabelColumn: [
        {
          label: '用户昵称',
          key: 'no',
          width: 120
        },
        {
          label: '手机号',
          key: 'time',
          width: 240
        },
        {
          label: '付费金额',
          key: 'type',
          width: 100
        },
        {
          label: '付费类型',
          key: 'money',
          width: 120,
        },
        {
          label: '支付时间',
          key: 'content',
          width: 120
        },
        {
          label: '是否参会',
          key: 'status',
          width: 120
        }
      ]
    };
  },
  // components: {
  //   tableList,
  //   searchArea
  // },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    handleClick(tab) {
      this.activeIndex = tab.name;
    },
    getIncomeDetailList(params) {
      let pageInfo = this.$refs.incomeDetils.pageInfo; //获取分页信息
      let formParams = this.$refs.searchIncome.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
      }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
    }
  },
};
</script>

<style lang="less" scoped>
  .income-detail{
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
    }
  }
</style>
