<template>
  <div class="income-detail">
    <div class="title-data">
      <p>收益详情</p>
    </div>
    <title-data></title-data>
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
      totalNum: 1000,
      searchDetail: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          type: '3',
          key: "pay_type",
          placeholder: '请选择付费类型',
          options: [
            {
              label: '礼物',
              value: '13'
            },
            {
              label: '门票',
              value: '2'
            },
            {
              label: '打赏',
              value: '5'
            },
          ]
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [
        {
          pay_time: '2020-09-17',
          pay_type: '5',
          pay_fee: '123,000',
          nickname: 'hahhsdhjkdhfhjkfhdjghkfdjghkdj哈哈哈哈',
          id: '1',
          is_enter: '否',
          phone:'11122233345',
        },
        {
          pay_time: '2020-01-17',
          pay_type: '2',
          pay_fee: '111,000',
          nickname: '哈哈减肥吧开始讲课',
          id: '2',
          phone:'12345678900',
          is_enter: '是',
        }
      ],
      tabelColumn: [
        {
          label: '用户昵称',
          key: 'nickname',
        },
        {
          label: '手机号',
          key: 'phone',
          width: 120
        },
        {
          label: '付费金额',
          key: 'pay_fee',
          width: 150
        },
        {
          label: '付费类型',
          key: 'type',
          width: 120,
        },
        {
          label: '支付时间',
          key: 'pay_time',
          width: 150,
        },
        {
          label: '是否参会',
          key: 'is_enter',
          width: 100
        }
      ]
    };
  },
  components: {
   titleData
  },
  mounted() {
    this.getIncomeDetailList();
    console.log(this.$route.query.webinar_id);
  },
  methods: {
    getIncomeDetailList(params) {
      let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
      let formParams = this.$refs.incomeDetils.searchParams; //获取搜索参数
      let paramsObj = {};
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos = 1;
      }
       for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      paramsObj.user_id = '16417099';
      paramsObj.webinar_id = this.$route.query.webinar_id;
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
      this.$fetch('liveIncomeDetailList', obj).then(res =>{
        this.rowsList();
        console.log(res);
        // this.totalNum = res.data.total;
        // this.tableList = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList() {
      this.tableList.map(item => {
        item.type = item.pay_type == '2' ? '门票': item.pay_type == '5' ? '打赏' : '礼物';
      });
      console.log(this.tableList);
      // .map(item => {"red_packet": item.red_packet_type == '1' ? '固定金额': '拼手气' })
    },
  },
};
</script>

<style lang="less" scoped>
  .income-detail{
    // height: 100%;
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
    .box-card .el-card__body{
      padding: 0;
    }
    .box-income .el-card__body{
      padding: 24px;
    }
    .box-income{
      // height: calc(100% - 194px);
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
