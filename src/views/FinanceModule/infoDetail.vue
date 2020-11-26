<template>
  <div class="account-income">
    <pageTitle title="账单明细">
      <div slot="content">
        购买明细指用户从后台主动下单购买相关功能的订单；开通明细指通过工作人<br>员给您开通的相关功能订单
      </div>
    </pageTitle>
    <el-card class="box-card">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="购买明细" name="1"></el-tab-pane>
        <el-tab-pane label="开通明细" name="2"></el-tab-pane>
        <div class="search-box">
          <search-area
            ref="searchDetail"
            :searchAreaLayout="searchDetail"
            @onSearchFun="getDetailList('search')"
          >
          </search-area>
        </div>
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
import PageTitle from '@/components/PageTitle';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 1000,
      searchDetail: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          type: '3',
          key: "type",
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
              label: '结清并发欠费',
              value: '6'
            }
          ]
        },
        {
          type: '3',
          key: "status",
          placeholder: '请选择订单状态',
          options: [
            {
              label: '失败',
              value: '1'
            },
             {
              label: '成功',
              value: '0'
            },
             {
              label: '成功',
              value: '2'
            },
          ]
        },
        {
          type: '3',
          key: "source",
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
        },
        {
          type: '6'
        },
      ],
      isCheckout: false,
      isHandle: true,
      tableList: [
        {
          order_id: '1',
          id: '123244',
          create_time: '2020-09-17',
          type: '支付宝',
          amount: '123,000',
          content: '哈哈哈哈',
          status: '1',
          statusText: '成功',
          source: '直播',
          start_time: '2020-10-01',
          end_time: '2021-10-01'
        },
        {
          order_id: '2',
          id: '100000',
          create_time: '2020-01-17',
          type: '微信',
          amount: '111,000',
          content: '开始讲课',
          status: '2',
          statusText: '失败',
          source: '录播',
          start_time: '2020-01-01',
          end_time: '2021-01-01'
        }
      ],
      tabelColumn: [],
      tabelColumns: [
        {
          label: '订单编号',
          key: 'order_id',
        },
        {
          label: '交易时间',
          key: 'create_time',
        },
        {
          label: '订单类型',
          key: 'type',
        },
        {
          label: '交易金额',
          key: 'amount',
        },
        {
          label: '购买内容',
          key: 'content',
        },
        {
          label: '订单状态',
          key: 'status',
        },
        {
          label: '来源',
          key: 'source',
        },
        {
          label: '启用日期',
          key: 'start_time',
        },
        {
          label: '失效日期',
          key: 'end_time',
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
    PageTitle
  },
  mounted() {
    this.tabelColumn = this.tabelColumns;
    this.getDetailList();
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
      this.$refs.tableDetail.pageInfo.pos = 0;
      this.$refs.tableDetail.pageInfo.pageNum = 1;
      this.$refs.searchDetail.searchParams = {};
      this.getDetailList();
    },
    getDetailList(params) {
      let pageInfo = this.$refs.tableDetail.pageInfo; //获取分页信息
      let formParams = this.$refs.searchDetail.searchParams; //获取搜索参数
      let paramsObj = {};
      if (params === 'search') {
        pageInfo.pos= 0;
        pageInfo.pageNum = 1;
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
      let obj = Object.assign({}, pageInfo, paramsObj);
      console.log(obj);
      let url = this.activeIndex == '1' ? "buyDetail" : "orderDetail";
      this.$fetch(url, obj).then(res =>{
        this.totalNum = res.data.total;
        let tableList = res.data.list;
        tableList.map(item=> {
          item.statusText = item.status== 1 ? '成功' : '失败';
        });
        // this.tableList = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    delete(that, val) {
      let userId = val.order_id;
      that.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.deleteList(userId);
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteList(id) {
       this.$fetch('deleteDetail', {id: id}).then(res =>{
        console.log(res.data);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(e=>{
        console.log(e);
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .account-income{
    .el-card__body{
      padding: 5px 24px 51px 24px;
    }
    .search-box{
      padding-top: 30px;
    }
  }
</style>
