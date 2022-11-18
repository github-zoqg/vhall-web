<template>
  <div class="account-detail">
    <pageTitle pageTitle="提现明细"></pageTitle>
    <div class="box-card">
      <search-area
        ref="searchAccount"
        :searchAreaLayout="searchDetail"
        @onExportData="exportAccount()"
        @onSearchFun="getSearchList()"
      ></search-area>
      <div>
        <el-table
          :data="tableList"
          style="width: 100%"
          :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '56px' }"
        >
          <el-table-column prop="account" label="收款账号" min-width="300"></el-table-column>
          <el-table-column prop="service_fee" label="平台分成" width="120"></el-table-column>
          <el-table-column prop="withdraw_fee" label="申请金额" width="120"></el-table-column>
          <el-table-column prop="type" label="提现类型" width="120"></el-table-column>
          <el-table-column label="提现状态" width="120">
            <template slot-scope="scope">
              <span class="buyStatus">
                <i
                  :class="
                    scope.row.status == 1
                      ? 'active-success'
                      : scope.row.status == 2
                      ? 'active-error'
                      : 'active-waiting'
                  "
                ></i>
                {{ scope.row.statusText }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="created_at" width="180"></el-table-column>
          <el-table-column label="实际金额" prop="actual_fee" width="120"></el-table-column>
          <div slot="empty">
            <noData
              :nullType="'nullData'"
              v-if="!totalNum"
              :text="'暂无数据'"
              :height="70"
            ></noData>
          </div>
        </el-table>
        <SPagination
          :total="totalNum"
          v-if="totalNum > 10"
          :currentPage="pageInfo.pageNum"
          @current-change="currentChangeHandler"
          align="center"
        ></SPagination>
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
            key: 'searchTime'
          },
          {
            type: '3',
            key: 'withdraw_status',
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
            key: 'withdraw_type',
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
        tableList: [],
        pageInfo: {
          pageNum: 1,
          limit: 10,
          pos: 0
        }
      };
    },
    components: {
      PageTitle,
      noData
    },
    mounted() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getDetailList();
    },
    methods: {
      getSearchList() {
        let formParams = this.$refs.searchAccount.searchParams;
        this.$vhall_paas_port({
          k:
            formParams.withdraw_status === 1
              ? 100771
              : formParams.withdraw_status === 2
              ? 100772
              : formParams.withdraw_status === 0
              ? 100770
              : 100769,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$vhall_paas_port({
          k:
            formParams.withdraw_type === 1
              ? 100775
              : formParams.withdraw_type === 0
              ? 100774
              : 100773,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.getDetailList('search');
      },
      getDetailList(params) {
        // let pageInfo = this.$refs.tableAccount.pageInfo; //获取分页信息
        let formParams = this.$refs.searchAccount.searchParams; //获取搜索参数
        let paramsObj = {};
        if (params === 'search') {
          this.pageInfo.pageNum = 1;
          this.pageInfo.pos = 0;
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
        let obj = Object.assign({}, this.pageInfo, paramsObj);
        console.log(obj);
        this.params = paramsObj;
        this.$fetch('accountList', this.$params(obj))
          .then(res => {
            console.log(res);
            this.totalNum = res.data.total;
            this.tableList = res.data.list;
            this.rowsList(this.tableList);
            console.log(this.tableList, '111111111111');
          })
          .catch(e => {
            console.log(e);
          });
      },
      rowsList(data) {
        data.map(item => {
          item.type = item.withdraw_type == 1 ? '红包' : '直播';
          item.statusText =
            item.withdraw_status == 1 ? '成功' : item.withdraw_status == 2 ? '失败' : '审核中';
          item.status = item.withdraw_status;
        });
      },
      // 页码改变按钮事件
      currentChangeHandler(current) {
        this.pageInfo.pageNum = current;
        this.pageInfo.pos = parseInt((current - 1) * this.pageInfo.limit);
        this.getDetailList();
      },
      exportAccount() {
        this.$fetch('exportWithdraw', this.$params(this.params))
          .then(res => {
            this.$vhall_paas_port({
              k: 100776,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `账单明细导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `账单明细导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      }
    }
  };
</script>
<style lang="less" scoped>
  .box-card {
    background: #fff;
    padding: 24px 32px;
    border-radius: 4px;
    min-height: 500px;
    .pageBox {
      margin-top: 20px;
    }
    .buyStatus {
      i {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
        margin-top: -3px;
        &.active-success {
          background: #14ba6a;
        }
        &.active-error {
          background: #fb3a32;
        }
        &.active-waiting {
          background: #fa9a32;
        }
      }
    }
  }
</style>
