<template>
  <div class="income-detail">
    <div class="title-data">
      <p>收益详情</p>
    </div>
    <el-card class="box-card">
      <title-data></title-data>
      <!-- <p>这里是活动名称</p>
      <span>直播时间：2020-09-09 10:00:00  </span> -->
    </el-card>
    <el-card class="box-income">
      <p>收益明细</p>
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
import titleData from '../LiveModule/Data/components/title';
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
          type: '3',
          key: "payType",
          placeholder: '请选择付费类型',
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
          id: '1',
          source: '直播',
          onDate: '2020-10-01',
          outDate: '2021-10-01',
          phone:'11122233345',
        },
        {
          no: '1',
          time: '2020-01-17',
          type: '微信',
          money: '111,000',
          content: '哈哈减肥吧开始讲课',
          id: '2',
          phone:'12345678900',
          source: '录播',
          onDate: '2020-01-01',
          outDate: '2021-01-01'
        }
      ],
      tabelColumn: [
        {
          label: '用户昵称',
          key: 'content',
        },
        {
          label: '手机号',
          key: 'phone',
          width: 120
        },
        {
          label: '付费金额',
          key: 'type',
          width: 150
        },
        {
          label: '付费类型',
          key: 'money',
          width: 120,
        },
        {
          label: '支付时间',
          key: 'time',
          width: 150,
        },
        {
          label: '是否参会',
          key: 'source',
          width: 100
        }
      ]
    };
  },
  components: {
   titleData
  },
  methods: {
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
    height: 100%;
    .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      p{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
        padding-bottom: 4px;
      }
    }
    /deep/.box-card .el-card__body{
      padding: 0;
    }
    /deep/.box-income .el-card__body{
      padding: 24px;
    }
    .box-income{
      height: calc(100% - 196px);
      margin-top: 24px;
      p{
        padding-bottom: 7px;
        font-size: 16px;
        color:#1A1A1A;
        font-weight: 400px;
      }
    }
  }
</style>
