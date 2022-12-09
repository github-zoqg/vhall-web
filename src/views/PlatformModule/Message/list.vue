<template>
  <div>
    <pageTitle pageTitle="消息中心"></pageTitle>
    <!-- 有消息内容 -->
    <div v-if="msgDao.total > 0">
      <div class="message--title">
        <el-button
          size="medium"
          round
          @click.prevent.stop="multiMsgDel"
          :disabled="ids && ids.length === 0"
        >
          批量删除
        </el-button>
        <el-button
          size="medium"
          round
          @click.prevent.stop="executeUseRead"
          :disabled="ids && ids.length === 0"
        >
          标记已读
        </el-button>
      </div>
      <!-- 表格与分页 -->
      <div class="message-list">
        <table-list
          ref="msgTable"
          :isHandle="true"
          :manageTableData="msgDao.list"
          :tabelColumnLabel="msgTableColumn"
          :totalNum="msgDao.total"
          :tableRowBtnFun="tableRowBtnFun"
          width="114"
          min-height="auto"
          scene="msg_list"
          @getTableList="getMsgList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
        ></table-list>
      </div>
    </div>
    <!-- 无消息内容 -->
    <null-page null-type="nullData" v-else></null-page>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import NullPage from '../Error/nullPage.vue';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    name: 'msgList.vue',
    components: {
      PageTitle,
      NullPage
    },
    data() {
      return {
        msgDao: {
          total: 0,
          list: []
        },
        isHandle: false, // 是否有操作项
        userId: JSON.parse(sessionOrLocal.get('userId')),
        msgTableColumn: [
          {
            label: '标题',
            key: 'title',
            width: 'auto'
          },
          {
            label: '接收时间',
            key: 'created_at',
            width: 200
          },
          {
            label: '消息类型',
            key: 'msgTypeStr',
            width: 100
          },
          {
            label: '消息类型',
            key: 'msgStatusStr',
            width: 100
          }
        ],
        tableRowBtnFun: [
          {
            name: '查看',
            methodName: 'toMsgDetail'
          },
          {
            name: '删除',
            methodName: 'msgDel'
          }
        ],
        ids: []
      };
    },
    methods: {
      // 表格操作列回调函数， val表示每行
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      // 删除单条消息数据
      msgDel(that, { rows }) {
        that.confirmDelete(rows.msg_id, 2);
      },
      confirmDelete(ids, index) {
        this.$confirm('是否要删除选中的消息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.$fetch('msgDel', {
              msg_id: ids
            })
              .then(res => {
                if (res && res.code === 200) {
                  this.$vhall_paas_port({
                    k: index === 1 ? 100835 : 100834,
                    data: {
                      business_uid: this.userId,
                      userId: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                  this.$message.success(`删除成功`);
                  this.ids = [];
                  this.$refs.msgTable.clearSelect();
                  this.getMsgList();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg || '删除失败'
                  });
                }
              })
              .catch(e => {
                console.log(e);
                this.$message({
                  type: 'error',
                  message: '删除失败'
                });
              });
          })
          .catch(() => {});
      },
      // 跳转消息详情页
      toMsgDetail(that, { rows }) {
        that.$vhall_paas_port({
          k: 100833,
          data: {
            business_uid: that.userId,
            userId: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        that.$router.push({
          path: `/other/msgDetail/${rows.msg_id}`
        });
      },
      // 获取消息中心列表数据
      getMsgList(pageInfo = { pageNum: 1, pos: 0, limit: 10 }) {
        if (pageInfo.pos == 0) {
          // 表格切换到第一页
          try {
            this.$refs.msgTable.pageInfo.pageNum = 1;
            this.$refs.msgTable.pageInfo.pos = 0;
          } catch (e) {
            console.log(e);
          }
        }
        this.$fetch('getMsgList', {
          pos: pageInfo.pos,
          limit: pageInfo.limit
        })
          .then(res => {
            let dao =
              res && res.code === 200 && res.data
                ? res.data
                : {
                    total: 0,
                    list: []
                  };
            (dao.list || []).map(item => {
              item.msgTypeStr = ['', '财务消息', '用户消息', '活动消息'][item['msg_type']]; // 1.财务消息2.用户消息3.活动消息
              item.msgStatusStr = ['未读', '已读'][item['msg_status']]; // 消息状态0未读1已读
            });
            this.msgDao = dao;
          })
          .catch(e => {
            console.log(e);
            this.msgDao = {
              total: 0,
              list: []
            };
          });
      },
      // 批量选择
      checkMoreRow(val) {
        console.log(val);
        this.ids = val.map(item => {
          return item.msg_id;
        });
      },
      // 标记为已读取
      executeUseRead() {
        console.log(this.ids);
        if (!(this.ids && this.ids.length > 0)) {
          this.$message({
            message: `请至少选择一条信息标记为已读`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.$confirm('确定要标记选中内容为已读？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              this.$fetch('executeUseRead', {
                msg_id: this.ids.join(',')
              })
                .then(res => {
                  if (res && res.code === 200) {
                    this.$vhall_paas_port({
                      k: 100836,
                      data: {
                        business_uid: this.userId,
                        userId: '',
                        webinar_id: '',
                        refer: '',
                        s: '',
                        report_extra: {},
                        ref_url: '',
                        req_url: ''
                      }
                    });
                    this.$message({
                      message: `操作成功`,
                      showClose: true,
                      // duration: 0,
                      type: 'success',
                      customClass: 'zdy-info-box'
                    });
                    this.ids = [];
                    this.$refs.msgTable.clearSelect();
                    // 重新从第一页查询
                    this.getMsgList();
                    // 通知右上角导航，需要更新未度消息
                    this.$EventBus.$emit('saas_vs_msg_count', true);
                  } else {
                    this.$message({
                      message: res.msg || '操作失败',
                      showClose: true,
                      // duration: 0,
                      type: 'error',
                      customClass: 'zdy-info-box'
                    });
                  }
                })
                .catch(res => {
                  console.log(res);
                  this.$message({
                    message: res.msg || '操作失败',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                });
            })
            .catch(() => {});
        }
      },
      // 批量删除
      multiMsgDel() {
        if (!(this.ids && this.ids.length > 0)) {
          this.$message({
            message: `请至少选择一条信息删除`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.confirmDelete(this.ids.join(','), 1);
          // this.msgDel(this, {
          //   rows: {
          //     msg_id: this.ids.join(',')
          //   }
          // });
        }
      }
    },
    created() {
      this.getMsgList();
    },
    mounted() {
      this.$EventBus.$on('saas_vs_msg_num', this.getMsgList);
    }
  };
</script>
<style lang="less" scoped>
  .message-list {
    .layout--right--main();
    .min-height();
    .padding-table-list();
  }
  .message--title {
    margin-bottom: 24px;
    /deep/.el-button {
      background: transparent;
      &:hover {
        background: #fb3a32;
        border: 1px solid #fb3a32;
      }
      &:active {
        background: #e2332c;
        border: 1px solid #e2332c;
      }
      &.is-disabled {
        border: 1px solid #e6e6e6;
        background: transparent;
        color: #b3b3b3;
        &:hover,
        &:active {
          background: transparent;
        }
      }
    }
  }
</style>
