<template>
  <div class="account-income">
    <pageTitle title="账单明细">
      <div slot="content">
        购买明细指用户从后台主动下单购买相关功能的订单；开通明细指通过工作人<br>员给您开通的相关功能订单
      </div>
    </pageTitle>
    <div class="box-card">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="购买明细" name="1"></el-tab-pane>
        <el-tab-pane label="开通明细" name="2"></el-tab-pane>
        <div class="search-box">
          <search-area
            ref="searchDetail"
            :searchAreaLayout="searchDetail"
            @onExportData="exportAccount()"
            @onSearchFun="getDetailList('search')"
          >
          </search-area>
        </div>
        <table-list
          ref="tableDetail"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="false"
          :isHandle="isHandle"
          :width="120"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getDetailList"
          >
        </table-list>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "income",
  data() {
    return {
      activeIndex: '1',
      totalNum: 1000,
      isHandle: true,
      params: {},
      options: [
        {
          label: '流量包',
          value: 'flow'
        },
        {
          label: '并发包',
          value: 'concurrency'
        },
        {
          label: '并发扩展包(人次)',
          value: 'extend_people'
        },
        {
          label: '并发扩展包(天)',
          value: 'extend_day'
        }
      ],
      orderOptions: [
        {
          label: '流量包',
          value: 'flow'
        },
        {
          label: '并发包,',
          value: 'concurrency'
        },
        {
          label: '并发扩展包(人次)',
          value: 'extend_people'
        },
        {
          label: '并发扩展包(天)',
          value: 'extend_day'
        },
      ],
      // 购买明细
      searchList: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          type: '3',
          key: "orderType",
          placeholder: '请选择订单类型',
          options: [
            {
              label: '结清并发欠费',
              value: 7
            },
            {
              label: '结清流量欠费',
              value: 8
            },
            {
              label: '并发包',
              value: 10
            },
            {
              label: '流量包',
              value: 11
            },
            {
              label: '并发扩展包(人/次)',
              value: 12
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
              value: -1
            },
            {
              label: '待支付',
              value: 0
            },
            {
              label: '成功',
              value: 1
            }
          ]
        },
        {
          type: '6'
        },
      ],
      // 开通明细
      searchOrder: [
        {
          type: '2',
          key: "searchTime"
        },
        {
          type: '3',
          key: "orderType",
          placeholder: '请选择订单类型',
          options: []
        },
        {
          type: '3',
          key: "status",
          placeholder: '请选择订单状态',
          options: [
            {
              label: '待生效 ',
              value: 0
            },
             {
              label: '生效中',
              value: 1
            },
             {
              label: '已失效',
              value: -1
            }
          ]
        },
        {
          type: '3',
          key: "source",
          placeholder: '请选择订单来源',
          options: [
            {
              label: '线下购买',
              value: 5
            },
            {
              label: '线上购买',
              value: 6
            },
             {
              label: '商务合作',
              value: 7
            },
            {
              label: '客户试用',
              value: 8
            },
            {
              label: '员工账号',
              value: 9
            },
            {
              label: '研发测试',
              value: 10
            }
          ]
        },
        {
          type: '6'
        },
      ],
      searchDetail: [],
      tableList: [],
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
          label: '启用日期',
          key: 'start_time',
        },
        {
          label: '失效日期',
          key: 'end_time',
        }
      ],
      tabelColumnes: [
        {
          label: '订单编号',
          key: 'id',
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
        },
        {
          name: "立即支付",
          methodName: 'pay'
        }
      ]
    };
  },
  components: {
    PageTitle
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    this.tabelColumn = this.tabelColumns;
    this.searchDetail = this.searchList;
    this.getDetailList();
  },
  watch: {
    activeIndex(value) {
      if (parseInt(value) === 2) {
        // 开通明细
        this.isHandle = false;
        this.tabelColumn = this.tabelColumnes;
        this.getRoleList();
      } else {
        // 购买明细
        this.isHandle = true;
        this.searchDetail = this.searchList;
        this.tabelColumn = this.tabelColumns;
      }
    }
  },
  methods: {
    getRoleList() {
      let arrList = JSON.parse(JSON.stringify(this.options));
      this.$fetch('getRoleRbacList', {category_id: 1,limit: 50, pos: 0}).then(res => {
        res.data.list.map(item => {
          arrList.push({
            label: item.role_name,
            value: item.id
          })
        })
      })
      this.searchOrder.map(item => {
        if (item.key === 'orderType') {
          item.options = arrList;
        }
      })
      this.searchDetail = this.searchOrder;
    },
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
      let paramsObj = {
        user_id: this.userId,
      };
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
      paramsObj.type = formParams.orderType || '';
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.params = paramsObj;
      let url = this.activeIndex == '1' ? "buyDetail" : "orderDetail";
      this.$fetch(url, this.$params(obj)).then(res =>{
        this.totalNum = res.data.total;
        let tableList = res.data.list;
        tableList.map(item=> {
          if (this.activeIndex == '1') {
            item.statusText = item.status== 1 ? '成功' : item.status== -1 ? '失败' : '待支付';
            item.type = this.culesType(item.type);
          } else {
            item.statusText = item.status== 1 ? '生效中' : item.status== -1 ? '已失效' : '待生效';
          }
          item.source = this.buyMethods(item.source);
        });
        this.tableList = tableList;
      }).catch(e=>{
        console.log(e);
      });
    },
    buyMethods(source) {
      let arrType = ['线下购买', '线上购买', '商务合作', '客户试用', ' 员工账号', '研发测试'];
      return arrType[source - 5];
    },
    culesType(type) {
      // 购买
      let name = '';
      this.searchDetail.map(item => {
        if (item.key === 'orderType') {
          item.options.map(items => {
            if (items.value == type) {
              name =  items.label;
            }
          });
        }
      })
      return name;
    },
    delete(that, {rows}) {
      console.log(val, '111111111111');
      that.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          type: 'warning'
        }).then(() => {
          that.deleteList(rows.order_id);
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteList(id) {
       this.$fetch('deleteDetail', {id: id}).then(res =>{
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getDetailList();
      }).catch(e=>{
        console.log(e);
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
      });
    },
    pay(that, {rows})  {
      that.$router.push({
        path: '/finance/payOrder',
        query: {
          userId: that.userId,
          orderId: rows.order_id
        }
      });
    },
    // 导出账单明细
    exportAccount() {
      let url = this.activeIndex == '1' ? 'exporOrder' : 'exportAdmin';
      this.$fetch(url, this.params).then(res => {
        if (res.code == 200) {
          this.$message.success(`${this.activeIndex == 1 ? '购买' : '开通'}账单明细导出申请成功，请去下载中心下载`);
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(`账单明细${res.msg}`);
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
  .account-income{
    .box-card{
      padding: 24px 32px;
      border-radius: 4px;
      background: #fff;
    }
    .search-box{
      padding-top: 30px;
    }
  }
</style>
