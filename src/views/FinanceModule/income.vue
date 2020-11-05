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
    <el-tabs v-model="activeIndex" @tab-click="handleClick">
      <el-tab-pane label="购买明细" name="1"></el-tab-pane>
      <el-tab-pane label="开通明细" name="2"></el-tab-pane>
      <div class="change-time">
        <el-date-picker
          v-model="time"
          type="date"
          style="width: 200px"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-select v-model="typeValue" placeholder="请选择订单类型" style="width: 160px">
        <el-option
          v-for="item in typeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
        </el-select>
        <el-select v-model="statusValue" placeholder="请选择订单状态" style="width: 160px">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="sourceValue" placeholder="请选择订单来源" style="width: 160px">
          <el-option
            v-for="item in sourceData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button>查询</el-button>
        <div class="export-data">
          <span>导出数据</span>
        </div>
      </div>
      <table-list
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isCheckout="isCheckout"
        :isHandle="isHandle"
        :width="120"
        :tableRowBtnFun="tableRowBtnFun"
        >
      </table-list>
    </el-tabs>
  </div>
</template>

<script>
import tableList from '@/components/DataList/list.vue';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      time: '',
      typeValue: '',
      statusValue: '',
      sourceValue: '',
      typeData: [
        {
          label: '专业版',
          value: '1'
        },
        {
          label: '流量版',
          value: '2'
        }
      ],
      statusData: [
        {
          label: '成功',
          value: '1'
        },
        {
          label: '失败',
          value: '2'
        }
      ],
      sourceData: [
        {
          label: '下单购买',
          value: '1'
        },
        {
          label: '人工购买',
          value: '2'
        }
      ],
      isCheckout: false,
      isHandle: true,
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
  components: {
    tableList
  },
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
    handleClick(tab) {
      this.activeIndex = tab.name;
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
      .button-tip{
        vertical-align: top;
      }
    }
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
      width: 104px;
      height: 35px;
      border-radius: 20px;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 35px;
      background: #fff;
      cursor: pointer;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
      }
    }
    .export-data:hover {
      background: #fb3a32;
      border: none;
      span {
        color: #fff;
      }
    }
  }
</style>
