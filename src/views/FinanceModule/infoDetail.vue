<template>
  <div class="account-income">
    <div class="title-data">
      <span>账单明细</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          购买明细指用户从后台主动下单购买相关功能的订单；开通明细指通过工作人<br>员给您开通的相关功能订单
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <el-card class="box-card">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="购买明细" name="1"></el-tab-pane>
        <el-tab-pane label="开通明细" name="2"></el-tab-pane>
        <search-area
          ref="searchDetail"
          :searchAreaLayout="searchDetail"
          @onSearchFun="getDetailList('search')"
        >
        </search-area>
        <table-list
          ref="tableDetail"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="isCheckout"
          :isHandle="isHandle"
          :width="120"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getDetailList"
          >
        </table-list>
      </el-tabs>
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
          type: '3',
          key: "accountType",
          placeholder: '请选择订单类型',
          options: [
            {
              label: '专业版',
              value: '1'
            },
            {
              label: '流量版',
              value: '2'
            },
            {
              label: '无极版',
              value: '3'
            },
            {
              label: '并发包',
              value: '4'
            },
            {
              label: '扩展包',
              value: '5'
            },
            {
              label: '11111',
              value: '6'
            }
          ]
        },
        {
          type: '3',
          key: "accountStatus",
          placeholder: '请选择订单状态',
          options: [
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
          key: "accountResoure",
          placeholder: '请选择订单来源',
          options: [
            {
              label: '下单购买',
              value: '1'
            },
            {
              label: '人工购买',
              value: '2'
            }
          ]
        }
      ],
      isCheckout: false,
      isHandle: true,
      tableList: [
        {
          no: '1',
          id: '123244',
          time: '2020-09-17',
          type: '支付宝',
          money: '123,000',
          content: '哈哈哈哈',
          status: '1',
          source: '直播',
          onDate: '2020-10-01',
          outDate: '2021-10-01'
        },
        {
          no: '1',
          id: '100000',
          time: '2020-01-17',
          type: '微信',
          money: '111,000',
          content: '开始讲课',
          status: '2',
          source: '录播',
          onDate: '2020-01-01',
          outDate: '2021-01-01'
        }
      ],
      tabelColumn: [],
      tabelColumns: [
        {
          label: '订单编号',
          key: 'no',
          width: 120
        },
        {
          label: '交易时间',
          key: 'time',
          width: 120
        },
        {
          label: '订单类型',
          key: 'type',
          width: 100
        },
        {
          label: '交易金额',
          key: 'money',
          width: 120,
        },
        {
          label: '购买内容',
          key: 'content',
          width: 200
        },
        {
          label: '订单状态',
          key: 'status',
          width: 200
        },
        {
          label: '来源',
          key: 'source',
          width: 100
        },
        {
          label: '启用日期',
          key: 'onDate',
          width: 100
        },
        {
          label: '失效日期',
          key: 'outDate',
          width: 100
        }
      ],
      tableRowBtnFun: [
        {
          name: "删除",
          methodName: 'delete'
        }
      ]
    };
  },
  // components: {
  //   tableList,
  //   searchArea
  // },
  created() {
    this.tabelColumn = this.tabelColumns;
  },
  watch: {
    activeIndex(value) {
      if (parseInt(value) === 2) {
        this.isHandle = false;
        this.tabelColumn = this.tabelColumn.filter(item => item.key !== 'money');
      } else {
        this.isHandle = true;
        this.tabelColumn = this.tabelColumns;
      }
    }
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    handleClick(tab) {
      this.activeIndex = tab.name;
    },
    getDetailList(params) {
      let pageInfo = this.$refs.tableDetail.pageInfo; //获取分页信息
      let formParams = this.$refs.searchDetail.searchParams; //获取搜索参数
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
  .account-income{
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
      margin: 0 0 24px 0;
      text-align: left;
      line-height: 30px;
      span{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
      }
      .button-tip{
        vertical-align: top;
      }
    }
  }
</style>
