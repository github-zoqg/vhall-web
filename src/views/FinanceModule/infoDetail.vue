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
    </el-card>
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
      searchDetail: [
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
              label: '未使用',
              value: 0
            },
             {
              label: '使用中',
              value: 1
            },
             {
              label: '已用完',
              value: 2
            },
            {
              label: '已过期 ',
              value: 3
            },
            {
              label: '已废弃',
              value: 4
            },
          ]
        },
        {
          type: '3',
          key: "source",
          placeholder: '请选择订单来源',
          options: [
            {
              label: '开通购买',
              value: 1
            },
            {
              label: '注册赠送',
              value: 3
            },
             {
              label: '试用赠送',
              value: 4
            }
          ]
        },
        {
          type: '6'
        },
      ],
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
      tabelColumnes: [
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
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    this.tabelColumn = this.tabelColumns;
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
        this.tabelColumn = this.tabelColumns;
        this.searchDetail.map(item => {
          if (item.key === 'orderType') {
            item.options = this.options;
          }
        })
      }
    }
  },
  methods: {
    getRoleList() {
      this.$fetch('getRoleRbacList', {category_id: 1,limit: 50, pos: 0}).then(res => {
       let roleList = res.data.list;
        roleList.map(item => {
          this.orderOptions.push({
            label: item.role_name,
            value: item.id
          })
        })
      })
      this.searchDetail.map(item => {
        if (item.key === 'orderType') {
          item.options = this.orderOptions;
        }
      })
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
      let type;
      if (this.activeIndex == '1') {
        // 购买明细 type必须大于等于7
        type = formParams.orderType || 7;
      } else {
        type = formParams.orderType || '';
      }
      let paramsObj = {
        user_id: this.userId,
      };
      console.log(type, '000000000000000')
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
      paramsObj.type = type;
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.params = obj;
      let url = this.activeIndex == '1' ? "buyDetail" : "orderDetail";
      this.$fetch(url, obj).then(res =>{
        this.totalNum = res.data.total;
        let tableList = res.data.list;
        tableList.map(item=> {
          item.statusText = item.status== 1 ? '成功' : item.status== -1 ? '失败' : '待支付';
          item.source = this.buyMethods(item.source);
          item.type = this.culesType(item.type)[0];
        });
        this.tableList = tableList;
      }).catch(e=>{
        console.log(e);
      });
    },
    buyMethods(source) {
      let arrType = ['其他', '购买', '升级', '注册赠送', ' 试用赠送', '其他'];
      return arrType[source];
    },
    culesType(type) {
      if (this.activeIndex == '1') {
        return this.options.filter(item => item.value == type).map(item => item.label);
      } else {
        return this.orderOptions.filter(item => item.value == type).map(item => item.label);
      }
    },
    delete(that, val) {
      that.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          type: 'warning'
        }).then(() => {
          that.deleteList(val.order_id);
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
      }).catch(e=>{
        console.log(e);
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
      });
    },
    // 导出账单明细
    exportAccount() {
      let url = this.activeIndex == '1' ? 'exporOrder' : 'exportAdmin';
      this.$fetch(url, this.params).then(res => {
        if (res.code == 200) {
          this.params = {};
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
    .el-card__body{
      padding: 5px 24px 51px 24px;
    }
    .search-box{
      padding-top: 30px;
    }
  }
</style>
