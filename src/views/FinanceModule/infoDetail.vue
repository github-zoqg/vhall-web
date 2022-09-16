<template>
  <div class="account-income">
    <pageTitle pageTitle="订单明细">
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
            @onSearchFun="getSearchList('search')"
          >
          </search-area>
        </div>
        <div class="interact-detail">
          <el-table
            @cell-mouse-enter="handleCellMouseEnter"
            @cell-mouse-leave="handleCellMouseLeave"
            :data="tableList"
            v-if="isDetail"
            style="width: 100%"
            :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
           >
            <el-table-column
              :prop="activeIndex==1 ? 'order_id' : 'id'"
              label="订单编号"
              min-width="145"
              >
            </el-table-column>
            <el-table-column
              label="交易时间"
              width="180"
              >
              <template slot-scope="scope">
                <el-tooltip placement="top" :disabled="!isTextOverflow" :content="scope.row.create_time == '' ? '- -' : scope.row.create_time">
                  <p class="custom-tooltip-content">{{ scope.row.create_time == '' ? '- -' : scope.row.create_time }}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="订单类型"
              width="150">
            </el-table-column>
            <el-table-column
              prop="amount"
              v-if="activeIndex==1"
              label="交易金额"
              width="120">
            </el-table-column>
            <el-table-column
              prop="content"
              label="购买内容"
              width="120">
            </el-table-column>
            <el-table-column
              label="订单状态"
              v-if="activeIndex==1"
              width="120">
              <template slot-scope="scope">
                <span class="buyStatus" ><i :class="scope.row.status == 1 ? 'active-success': scope.row.status == -1 ? 'active-error' : 'active-waiting'"></i>{{scope.row.statusText}}</span>
              </template>
            </el-table-column>
             <el-table-column
             v-if="activeIndex==2"
              label="订单状态"
              width="120">
              <template slot-scope="scope">
                <span class="buyStatus" ><i :class="scope.row.status == 1 ? 'active-success': scope.row.status == -1 ? 'active-error' : 'active-waiting'"></i>{{scope.row.statusText}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeIndex==2"
              label="来源"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.source | filterSource}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="启用日期"
              width="180">
              <template slot-scope="scope">
                <el-tooltip placement="top" :disabled="!isTextOverflow" :content="scope.row.start_time == '' ? '- -' : scope.row.start_time">
                  <p class="custom-tooltip-content">{{ scope.row.start_time == '' ? '- -' : scope.row.start_time }}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="失效日期"
              width="180">
              <template slot-scope="scope">
                <el-tooltip placement="top" :disabled="!isTextOverflow" :content="scope.row.end_time == '' ? '- -' : scope.row.end_time">
                  <p class="custom-tooltip-content">{{ scope.row.end_time == '' ? '- -' : scope.row.end_time }}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              width="130"
              v-if="activeIndex==1 && totalNum"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="deleteOrder(scope.row)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click="pay(scope.row)"
                  v-if="!scope.row.status"
                  >立即支付</el-button
                >
              </template>
            </el-table-column>
            <div slot="empty"><noData :nullType="'nullData'" v-if="!totalNum" :text="'暂无数据'"></noData></div>
          </el-table>
          <SPagination
            :total="totalNum"
            v-if="totalNum > 10"
            :currentPage="pageInfo.pageNum"
            @current-change="currentChangeHandler"
            align="center"
          >
          </SPagination>
        </div>
        <!-- <table-list
          v-show="activeIndex==2"
          ref="tableDetail"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumnes"
          :isCheckout="false"
          :isHandle="false"
          :totalNum="totalNum"
          @getTableList="getDetailList"
          >
        </table-list> -->
        <!-- <noData :nullType="'nullData'" v-if="!totalNum&&activeIndex==2" :text="'暂无数据'" :height="100"></noData> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
import noData from '@/views/PlatformModule/Error/nullPage';
import tableCellTooltip from '@/components/TableList/mixins/tableCellTooltip'
export default {
  name: "income",
  mixins: [tableCellTooltip],
  data() {
    return {
      activeIndex: '1',
      totalNum: 0,
      isDetail: false,
      isHandle: true,
      params: {},
      pageInfo: {
        pageNum: 1,
        limit: 10,
        pos: 0
      },
      options: [
        {
          label: '全部',
          value: '',
        },
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
        },
        {
          label: '时长包',
          value: 'duration'
        },
        {
          label: '短信',
          value: '19'
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
        {
          label: '时长包',
          value: 'duration'
        }
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
          placeholder: '订单类型',
          options: [
            {
              label: '全部',
              value: ''
            },
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
              label: '并发扩展包',
              value: 12
            },
            {
              label: '专业版',
              value: 13
            },
            {
              label: '回放流量包',
              value: 14
            },
            {
              label: '免费回放流量包',
              value: 15
            },
            {
              label: '并发预充值',
              value: 16
            }
          ]
        },
        {
          type: '3',
          key: "status",
          placeholder: '订单状态',
          options: [
            {
              label: '全部',
              value: ''
            },
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
          placeholder: '订单类型',
          options: []
        },
        {
          type: '3',
          key: "status",
          placeholder: '订单状态',
          options: [
            {
              label: '全部',
              value: ''
            },
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
          placeholder: '订单来源',
          options: [
            {
              label: '全部',
              value: ''
            },
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
      tabelColumnes: [
        {
          label: '订单编号',
          key: 'id',
          width: 90
        },
        {
          label: '交易时间',
          key: 'create_time',
        },
        {
          label: '订单类型',
          key: 'type',
          width: 90
        },
        {
          label: '购买内容',
          key: 'content',
          width: 95,
          customTooltip: true
        },
        {
          label: '订单状态',
          key: 'status',
          width: 95
        },
        {
          label: '来源',
          key: 'source',
          width: 95
        },
        {
          label: '启用日期',
          key: 'start_time',
        },
        {
          label: '失效日期',
          key: 'end_time'
        }
      ]
    };
  },
  computed: {
    showSmsModule: function () {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['message_notice'];
      // 不是知学云账号 & 开启了 短信通知配置项权限
      return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
    }
  },
  components: {
    PageTitle,
    noData
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
        this.getRoleList();
      } else {
        // 购买明细
        this.searchDetail = this.searchList;
      }
    },
  },
  methods: {
    getRoleList() {
      let arrList = JSON.parse(JSON.stringify(this.options));
      if (!this.showSmsModule) {
        // 如果是知学云，不考虑短信数据
        arrList = arrList.filters(item => Number(item.value) != 19)
      }
      this.$fetch('getRoleRbacList', {category_id: 1,limit: 50, pos: 0}).then(res => {
        res.data.list.map(item => {
          arrList.push({
            label: item.role_name,
            value: item.id,
            k: item.id
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
      this.pageInfo.pos = 0;
      this.pageInfo.pageNum = 1;
      this.isDetail = false;
      // this.$refs.tableDetail.pageInfo.pos = 0;
      // this.$refs.tableDetail.pageInfo.pageNum = 1;
      this.$refs.searchDetail.searchParams = {};
      this.getDetailList();
    },
    getSearchList() {
      let formParams = this.$refs.searchDetail.searchParams;
      console.log(formParams, '?????????')
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          this.$vhall_paas_port({
            k: this.activeIndex == 1 ? 100708 : 100724,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (i === 'orderType') {
          let k = 100709;
          let typeOrder = [100710, 100711, '', 100712, 100713, 100714, 100715, 100716, 100466, 100467]
          let typeDetail = [100730, 100731, 100732, 100733, 100734, 100735, 100736, 100737, 100726, 100727, 100728, 100729]
          if (this.activeIndex == 1) {
            k = formParams.orderType ? typeOrder[formParams.orderType - 7] : 100709
          } else {
            if (typeof(formParams.orderType) == 'number') {
              if (formParams.orderType > 8) {
                k = 104000
              } else {
                k = typeDetail[formParams.orderType]
              }

            } else {
              let type = formParams.orderType;
              k = type === 'flow' ? 100726 : type === 'concurrency' ? 100727 : type === 'extend_people' ? 100728 :  type === 'extend_day' ? 100729 : 100725
            }
          }
          this.$vhall_paas_port({
            k: k,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (i === 'status') {
          let k = this.activeIndex == 1 ? 100717 : 100738;
          if (formParams.status === 1) {
            k = this.activeIndex == 1 ? 100720 : 100740
          } else if (formParams.status === -1) {
            k = this.activeIndex == 1 ? 100718 : 100741
          } else if (formParams.status === 0) {
             k = this.activeIndex == 1 ? 100719 : 100739
          }
          this.$vhall_paas_port({
            k: k,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (i === 'source' && this.activeIndex == 2) {
          let sourceArr = [100743, 100744, 100745, 100746, 100747, 100748]
          this.$vhall_paas_port({
            k: formParams.source ? sourceArr[formParams.source - 5] : 100742,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
      }
      this.getDetailList('search')
    },
    getDetailList(params) {
      // let pageInfo = {};
      // if (this.activeIndex == 1) {
      //   pageInfo = this.pageInfo;
      // } else {
      //   pageInfo = this.$refs.tableDetail.pageInfo;
      // }
      let formParams = this.$refs.searchDetail.searchParams; //获取搜索参数
      let paramsObj = {
        user_id: this.userId,
      };
      if (params === 'search') {
        this.pageInfo.pos= 0;
        this.pageInfo.pageNum = 1;
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
      paramsObj = this.formatSmsQuery(paramsObj); // 短信查询入参格式化
      let obj = Object.assign({}, this.pageInfo, paramsObj);
      this.params = paramsObj;
      let url = this.activeIndex == 1 ? "buyDetail" : "orderDetail";
      this.$fetch(url, this.$params(obj)).then(res =>{
        this.totalNum = res.data.total;
        let tableList = res.data.list;
        if (res.data.total > 0) {
          tableList.map(item=> {
            if (this.activeIndex == 1) {
              item.statusText = item.status== 1 ? '成功' : item.status== -1 ? '失败' : '待支付';
              item.type = this.culesType(item.type);
            } else {
              item.statusText = item.status== 1 ? '生效中' : item.status== -1 ? '已失效' : '待生效';
              // item.source = this.buyMethods(item.source);
            }
          });
        }
        this.tableList = tableList;
        this.isDetail = true;
        console.log(this.tableList, '????kaitongmingxi开通明细')
        if (this.tableList.length == 0) {
          //兼容有无数据来修改element样式
          document.querySelector('.el-table').style.position = 'inherit'
        }else {
          document.querySelector('.el-table').style.position = 'relative'
        }

      }).catch(e=>{
        console.log(e);
      });
    },
    formatSmsQuery(obj) {
      try {
        if (this.activeIndex != 1) {
          // 如果当前是 开通明细，当前是短信包，传递一个serviceType传递，否则不需要
          if (obj.type == 19) {
            delete obj.orderType;
            delete obj.type;
            obj.serviceType = 19;
          } else {
            delete obj.serviceType;
          }
        }
      } catch(e) {
        // 去除无效key
      }
      return obj
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageInfo.pageNum = current;
      this.pageInfo.pos = parseInt((current - 1) * this.pageInfo.limit);
      this.getDetailList();
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
    deleteOrder(rows) {
      this.$confirm('订单删除后将无法找回，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.deleteList(rows.order_id);
        }).catch(() => {
          this.$message({
            message:  `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
    },
    deleteList(id) {
      this.$fetch('deleteDetail', {id: id}).then(res =>{
        this.$vhall_paas_port({
          k: 100721,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {orderId: id}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: '删除成功',
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getDetailList();
      }).catch(e=>{
        console.log(e);
        this.$message({
          message: e.msg || '删除失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    pay(rows)  {
      this.$vhall_paas_port({
        k: 100722,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$router.push({
        path: '/finance/payOrder',
        query: {
          userId: this.userId,
          orderId: rows.order_id
        }
      });
    },
    // 导出账单明细
    exportAccount() {
      let url = this.activeIndex == '1' ? 'exporOrder' : 'exportAdmin';
      this.$fetch(url, this.$params(this.params)).then(res => {
        this.$vhall_paas_port({
          k: this.activeIndex == '1' ? 100707 : 100723,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: `${this.activeIndex == 1 ? '购买' : '开通'}账单明细导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `${this.activeIndex == 1 ? '购买' : '开通'}账单明细导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
  }
};
</script>

<style lang="less" scoped>
  .account-income{
    .interact-detail {
      min-height: 550px;
    }
    .box-card{
      padding: 0 0 40px 0;
      border-radius: 4px;
      background: #fff;
    }
    /deep/.el-tabs__content{
      padding: 0 24px;
      min-height: 500px;
    }
    .search-box{
      padding-top: 30px;
    }
    .pageBox{
      margin-top: 20px;
    }
    /deep/.el-table .cell{
      width: 100%;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
    /deep/.el-table__fixed-right{
      height: 100% !important;
      &::before{
        background-color: #Fff;
        height: 0;
      }
    }
    /deep/.el-select{
      width: 140px!important;
    }
    .buyStatus{
      i{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
        margin-top: -3px;
        &.active-success {
          background: #14BA6A;
        }
        &.active-error {
          background: #FB3A32;
        }
        &.active-waiting {
          background: #FA9A32;
        }
      }
    }
  }
</style>
