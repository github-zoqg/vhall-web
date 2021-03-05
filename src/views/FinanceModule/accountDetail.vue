<template>
  <div class="account-detail">
    <pageTitle pageTitle="提现明细">
    </pageTitle>
    <div class="box-card">
      <search-area
          ref="searchAccount"
          :searchAreaLayout="searchDetail"
          @onExportData="exportAccount()"
          @onSearchFun="getDetailList('search')"
        >
      </search-area>
      <div>
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
        <noData v-if="totalNum == 0" :nullType="'nullData'" :text="'暂无数据'" :height="100">
        </noData>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data() {
    return {
      totalNum: 0,
      params: {},
      searchDetail: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          type: '3',
          key: "withdraw_status",
          placeholder: '提现状态',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '审核中',
              value: 0
            },
            {
              label: '成功',
              value: 1
            },
            {
              label: '失败',
              value: 2
            }
          ]
        },
        {
          type: '3',
          key: "withdraw_type",
          placeholder: '提现类型',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '直播收益',
              value: 0
            },
            {
              label: '红包收益',
              value: 1
            }
          ]
        }
      ],
      isCheckout: false,
      isHandle: false,
      tableList: [],
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
    PageTitle,
    noData
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
      this.params = paramsObj;
      this.$fetch('accountList', this.$params(obj)).then(res =>{
        console.log(res);
        this.totalNum = res.data.total;
        this.tableList = res.data.list;
        this.rowsList(this.tableList);
        console.log(this.tableList, '111111111111');
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList(data) {
      data.map(item => {
        item.type = item.withdraw_type == 1 ? '红包': '直播';
        item.statusText = item.withdraw_status == 1 ? '成功': item.withdraw_status == 2 ? '失败' : '审核中';
        item.status = item.withdraw_status;
      });
    },
    exportAccount() {
       this.$fetch('exportWithdraw', this.$params(this.params)).then(res => {
        this.$message({
          message: `账单明细导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `账单明细导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .box-card{
    background: #fff;
    padding: 24px 32px;
    border-radius: 4px;
    min-height: 500px;
  }
</style>
