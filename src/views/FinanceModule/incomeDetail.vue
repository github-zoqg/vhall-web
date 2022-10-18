<template>
  <div class="income-detail">
    <div class="title-data">
      <p>收益详情</p>
    </div>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <div class="box-income">
      <p>收益明细</p>
      <search-area
        ref="incomeDetils"
        :searchAreaLayout="searchDetail"
        @onExportData="exportAccount()"
        @onSearchFun="getSearchList('search')"
      >
      </search-area>
      <table-list
        ref="tableIncome"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isCheckout="false"
        :isHandle="false"
        :totalNum="totalNum"
        @getTableList="getIncomeDetailList"
        >
      </table-list>
    </div>
  </div>
</template>

<script>
import titleData from '../LiveModule/Data/components/title';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "income",
  data() {
    return {
      totalNum: 1,
      liveDetailInfo: {},
      params: {},
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
              label: '全部',
              value: ''
            },
            {
              label: '礼物',
              value: 13
            },
            {
              label: '门票',
              value: 2
            },
            {
              label: '打赏',
              value: 5
            },
          ]
        }
      ],
      tableList: [],
      tabelColumn: [
        {
          label: '用户昵称',
          key: 'nickname',
        },
        {
          label: '手机号',
          key: 'phone',
          width: '150'
        },
        {
          label: '付费金额',
          key: 'pay_fee',
          width: '110'
        },
        {
          label: '付费类型',
          key: 'type',
          width: '110'
        },
        {
          label: '支付时间',
          key: 'pay_time',
          width: '170'
        },
        {
          label: '是否参会',
          key: 'is_enter',
          width: '110'
        }
      ]
    };
  },
  components: {
   titleData
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getLiveDetail();
    window.scrollTo(0,0)
  },
  mounted() {
    this.getIncomeDetailList();
    console.log(this.$route.params.str);
  },
  methods: {
    //获取直播详情
    getLiveDetail() {
      // webinar/info调整-正常的信息展示使用 0
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str, is_rehearsal: 0}).then(res=>{
        this.liveDetailInfo = res.data;
      }).catch(res => {
        this.$message({
          message: res.msg || `信息获取失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    getSearchList() {
      let formParams = this.$refs.incomeDetils.searchParams;
      this.$vhall_paas_port({
        k: formParams.pay_type == 13 ? 100765 : formParams.pay_type == 2 ? 100766 : formParams.pay_type == 5 ? 100767 : 100764,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.getIncomeDetailList('search')
    },
    getIncomeDetailList(params) {
      let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
      let formParams = this.$refs.incomeDetils.searchParams; //获取搜索参数
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
      paramsObj.webinar_id = this.$route.params.str;
      this.params = paramsObj;
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
      this.$fetch('liveIncomeDetailList', this.$params(obj)).then(res =>{
        this.totalNum = res.data.total;
        this.tableList = res.data.list;
        this.rowsList(this.tableList);
      }).catch(e=>{
        console.log(e);
      });
    },
    rowsList(data) {
      data.map(item => {
        item.type = item.pay_type == '2' ? '门票': item.pay_type == '5' ? '打赏' : '礼物';
        item.is_enter = item.is_enter ? '是' : '否';
      });
      console.log(this.tableList);
      // .map(item => {"red_packet": item.red_packet_type == '1' ? '固定金额': '拼手气' })
    },
    // 导出收益详情
    exportAccount() {
      this.$fetch('exportIncomeDetail', this.$params(this.params)).then(res => {
        this.$vhall_paas_port({
          k:100768,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: `收益详情导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `收益详情单导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    }
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
        font-family: @fontSemibold;
        font-weight: 600;
        color: #1a1a1a;
        padding-bottom: 4px;
      }
    }
    .box-card .el-card__body{
      padding: 0;
    }
    .box-income{
      padding: 24px;
      background: #fff;
      border-radius: 4px;
    }
    .box-income{
      // height: calc(100% - 194px);
      margin-top: 24px;
      p{
        padding-bottom: 20px;
        font-size: 16px;
        color:#1A1A1A;
        font-weight: 400px;
      }
    }
  }
</style>
