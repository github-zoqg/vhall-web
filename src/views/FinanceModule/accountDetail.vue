<template>
  <div class="account-detail">
    <pageTitle title="提现明细">
    </pageTitle>
    <el-card>
      <search-area
          ref="searchAccount"
          :searchAreaLayout="searchDetail"
          @onSearchFun="getDetailList('search')"
        >
      </search-area>
      <table-list
        ref="tableAccount"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isCheckout="isCheckout"
        :isHandle="isHandle"
        :totalNum="totalNum"
        @getTableList="getDetailList"
        >
      </table-list>
    </el-card>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
export default {
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
          key: "withdraw_status",
          placeholder: '请选择提现状态',
          options: [
            {
              label: '审核中',
              value: '0'
            },
            {
              label: '成功',
              value: '1'
            },
            {
              label: '失败',
              value: '2'
            }
          ]
        },
        {
          type: '3',
          key: "withdraw_type",
          placeholder: '请选择提现类型',
          options: [
            {
              label: '直播收益',
              value: '0'
            },
            {
              label: '红包收益',
              value: '1'
            }
          ]
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [
        {
          created_at: '2020-09-17',
          withdraw_type: '0',
          withdraw_fee: '123,000',
          account: 'hahhsdhjkdhfhjkfhdjghkfdjghkdj哈哈哈哈',
          id: '1',
          status: 1,
          type: '直播',
          statusText: '成功',
          withdraw_status: '1',
          actual_fee: '12456',
          service_fee:'111245',
        },
        {
          created_at: '2020-01-17',
          withdraw_type: '2',
          withdraw_status: '2',
          withdraw_fee: '111,000',
          account: '哈哈减肥吧开始讲课',
          id: '2',
          status: 2,
          type: '红包',
          statusText: '红包',
          service_fee:'失败',
          actual_fee: '444444',
        }
      ],
      tabelColumn: [
        {
          label: '收款账号',
          key: 'account',
        },
        {
          label: '平台分成',
          key: 'service_fee',
        },
        {
          label: '申请金额',
          key: 'withdraw_fee',
        },
        {
          label: '提现类型',
          key: 'type',
        },
        {
          label: '提现状态',
          key: 'status',
        },
        {
          label: '申请时间',
          key: 'created_at',
        },
        {
          label: '实际金额',
          key: 'actual_fee',
        }
      ]
    };
  },
  components: {
    PageTitle
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getDetailList();
  },
  methods: {
    getDetailList(params) {
      let pageInfo = this.$refs.tableAccount.pageInfo; //获取分页信息
      let formParams = this.$refs.searchAccount.searchParams; //获取搜索参数
      let paramsObj = {};
      if (params === 'search') {
        pageInfo.pageNum= 1;
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
      paramsObj.user_id = this.userId;
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
      this.$fetch('accountList', obj).then(res =>{
        this.rowsList(res.data.list);
        console.log(res);
        this.totalNum = res.data.total;
        // this.tableList = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList(data) {
      this.tableList = data.map(item => {
        item.type = item.withdraw_type == '1' ? '红包': '直播';
        item.statusText = item.withdraw_status == '1' ? '成功': item.pay_type == '2' ? '失败' : '审核中';
        item.status = item.withdraw_status;
      });
      console.log(this.tableList);
    },
  }
};
</script>
