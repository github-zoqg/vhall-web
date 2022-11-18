<template>
  <div
    :class="['vmp-exam-list', { 'gray-theme': pageLevel == 'user' }]"
    v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)"
  >
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="isDefaultShow">
      <null-page
        nullType="nullData"
        text="您还没有快问快答，快来创建吧！"
        :height="0"
        v-if="pageLevel == 'user'"
      >
        <vh-button
          type="primary"
          round
          borderRadius="50"
          class="length152"
          v-preventReClick
          @click.prevent.stop="addExam"
        >
          创建
        </vh-button>
      </null-page>
      <null-page nullType="nullData" text="您还没有快问快答，快来创建吧！" :height="0" v-else>
        <vh-button
          type="primary"
          round
          size="medium"
          borderRadius="50"
          v-preventReClick
          @click.prevent.stop="addExam"
        >
          创建
        </vh-button>
        <vh-button
          round
          type="danger"
          ghost
          size="medium"
          borderRadius="50"
          class="length106"
          v-preventReClick
          @click.prevent.stop="openSelectDialog"
          v-if="pageLevel == 'webinar'"
        >
          资料库
        </vh-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <vh-button
          type="primary"
          round
          size="medium"
          borderRadius="50"
          class="length76"
          @click="addExam"
        >
          创建
        </vh-button>
        <vh-button
          round
          type="danger"
          ghost
          size="medium"
          borderRadius="50"
          class="length90 transparent-btn"
          @click="openSelectDialog"
          v-if="pageLevel == 'webinar'"
        >
          资料库
        </vh-button>
        <vh-button
          round
          type="default"
          ghost
          size="medium"
          borderRadius="50"
          class="length106 transparent-btn"
          @click="deleteAll(null)"
          :disabled="!selectChecked.length"
        >
          批量删除
        </vh-button>
        <vh-input
          type="text"
          class="search-data__input"
          size="medium"
          round
          placeholder="请输入名称"
          v-model.trim="keyword"
          clearable
          @clear="initQueryList"
          @keyup.enter.native="initQueryList"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" @click="initQueryList"></i>
        </vh-input>
      </div>
      <!-- 有消息内容 -->
      <div class="list-table-panel">
        <!-- 表格与分页 -->
        <div class="tab-content">
          <vh-table
            ref="tableList"
            :data="resultVo.list"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '56px' }"
            @selection-change="changeTableCheckbox"
          >
            <!-- 多选列 -->
            <vh-table-column type="selection" width="55" align="left" />
            <template v-for="(item, index) in tableColumns">
              <!-- 名称列 -->
              <vh-table-column
                v-if="item.key == 'title'"
                align="left"
                :key="index"
                :width="item.width"
                :label="item.label"
                :show-overflow-tooltip="item.customTooltip"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[item.key] || '-' }}</span>
                </template>
              </vh-table-column>
              <!-- 其它非名称列 -->
              <vh-table-column
                v-if="
                  ((pageLevel === 'user' && item.key !== 'status_str') ||
                    pageLevel === 'webinar') &&
                  item.key !== 'title'
                "
                align="left"
                :key="index"
                :width="item.width"
                :label="item.label"
                :show-overflow-tooltip="item.customTooltip"
              >
                <template slot-scope="scope">
                  <span
                    class="statusTag"
                    :class="scope.row.status_css"
                    v-if="item.key == 'status_str'"
                  >
                    {{ scope.row[item.key] }}
                  </span>
                  <span v-else>{{ scope.row[item.key] || '-' }}</span>
                </template>
              </vh-table-column>
            </template>
            <!-- 操作列 -->
            <vh-table-column label="操作" align="left" class="btn-rows" fixed="right" width="196">
              <template slot-scope="scope">
                <vh-button
                  borderRadius="4"
                  type="text"
                  plain
                  size="mini"
                  class="zdy-theme-gray"
                  @click="preview(scope.row)"
                >
                  预览
                </vh-button>
                <vh-button
                  borderRadius="4"
                  type="text"
                  plain
                  size="mini"
                  class="zdy-theme-gray"
                  @click="cope(scope.row)"
                >
                  复制
                </vh-button>
                <vh-button
                  borderRadius="4"
                  type="text"
                  plain
                  size="mini"
                  :class="`zdy-theme-gray ${scope.row.status > 0 ? 'is-disabled' : ''}`"
                  @click="edit(scope.row)"
                >
                  编辑
                </vh-button>
                <vh-button
                  borderRadius="4"
                  type="text"
                  plain
                  size="mini"
                  :class="`zdy-theme-gray ${scope.row.status > 0 ? 'is-disabled' : ''}`"
                  @click="del(scope.row)"
                >
                  删除
                </vh-button>
              </template>
            </vh-table-column>
            <div slot="empty" style="height: 0"></div>
          </vh-table>
        </div>
        <SPagination
          :total="resultVo.total"
          :currentPage="query.pageNumber"
          @current-change="currentChangeHandler"
          align="center"
          v-if="resultVo.total > query.limit"
        ></SPagination>
      </div>
      <!-- 无消息内容 -->
      <null-page
        class="search-no-data"
        :height="0"
        v-if="resultVo && resultVo.total === 0"
      ></null-page>
    </div>
    <!-- 资料库：选择列表-->
    <select-exam
      ref="selectExamDom"
      @getTableList="getExamList"
      @selectExamPreview="selectExamPreview"
    ></select-exam>
    <!-- 预览快问快答 -->
    <exam-preview ref="examPreviewDom" maxWidth="580px" maxHeight="420px"></exam-preview>
  </div>
</template>

<script>
  import NullPage from '../Error/nullPage.vue';
  import { sessionOrLocal } from '@/utils/utils';
  import ExamPreview from './components/exam-preview/main.vue';
  import SelectExam from './components/selectExam.vue';
  export default {
    name: 'ExamList',
    components: {
      NullPage,
      SelectExam,
      ExamPreview
    },
    props: {
      // 查询层级
      pageLevel: {
        type: String,
        default: 'webinar' // webinar 活动层级；user 用户层级
      }
    },
    data() {
      return {
        vm: null,
        userId: JSON.parse(sessionOrLocal.get('userId')),
        /*--------------------列表部分参数定义--------------------*/
        loading: false,
        total: 0,
        isSearch: false, //是否是搜索
        selectChecked: [],
        keyword: 'asdf',
        query: {
          pos: 0,
          limit: 10,
          pageNumber: 1
        },
        resultVo: {
          total: 0,
          list: []
        },
        tableColumns: [
          {
            label: '名称',
            key: 'title',
            customTooltip: true,
            width: '220'
          },
          {
            label: '创建时间',
            key: 'created_at_str',
            width: '180'
          },
          {
            label: '更新时间',
            key: 'updated_at_str',
            width: '180'
          },
          {
            label: '总分',
            key: 'total_score',
            width: '120'
          },
          {
            label: '题数',
            key: 'questions_count',
            width: '120'
          },
          {
            label: '限时（分）',
            key: 'limit_time_str',
            width: '120'
          },
          {
            label: '状态',
            key: 'status_str',
            width: '120'
          }
        ],
        /*--------------------快速报名参数定义--------------------*/
        addUserVisible: false,
        /*--------------------导入用户参数定义--------------------*/
        importVisible: false
      };
    },
    computed: {
      isDefaultShow() {
        return this.resultVo && this.resultVo.total === 0 && this.keyword == '';
      }
    },
    methods: {
      clear(e) {
        e.stopPropagation();
      },
      checkoutList(newValue) {
        if (!newValue) {
          this.initQueryList();
        }
      },
      // 预览
      preview(rows) {
        this.isShowQuestion = true;
        this.examId = rows.id;
        this.$refs.examPreviewDom &&
          this.$refs.examPreviewDom.openPreview(JSON.stringify({ id: this.examId }), 'mock');
      },
      // 复制 - 单个快问快答
      cope(rows) {
        this.$fetch(
          this.pageLevel == 'user' ? 'copyExamById' : 'copyExamByIdIsWebinar',
          this.pageLevel == 'user'
            ? { id: rows.id }
            : {
                id: rows.id,
                source_id: this.$route.params.str,
                source_type: 1
              }
        ).then(res => {
          this.$message({
            message: res.code == 200 ? '复制成功' : '复制失败',
            showClose: true,
            type: res.code == 200 ? 'success' : 'error',
            customClass: 'zdy-info-box'
          });
          this.initQueryList();
        });
      },
      // 编辑 - 单个快问快答
      edit(rows) {
        if (this.pageLevel == 'webinar' && rows.status > 0) {
          this.messageInfo('已推送的快问快答不支持编辑，建议进行「复制」', 'warning');
          return;
        } else if (rows.status > 0) {
          return;
        }
        this.$router.push({
          path: '/material/addExam',
          query: {
            examId: rows.id,
            type: 1
          }
        });
      },
      // 删除 - 单条记录
      del(rows) {
        if (this.pageLevel == 'webinar' && rows.status > 0) {
          this.messageInfo('已推送的快问快答不支持删除', 'warning');
          return;
        } else if (rows.status > 0) {
          return;
        }
        this.deleteConfirm(rows.id, 2);
      },
      deleteConfirm(id, index) {
        this.$confirm('删除后，此快问快答将无法使用，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box zdy-vh-ui',
          lockScroll: false,
          confirmButtonClass: 'zdy-vh-ui-confirm',
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.$fetch(
              this.pageLevel == 'user' ? 'deleteExam' : 'deleteExamIsWebinar',
              this.pageLevel == 'user'
                ? { ids: id }
                : {
                    ids: id,
                    source_type: 1,
                    source_id: this.$route.params.str
                  }
            )
              .then(res => {
                if (res.data?.is_success == 1) {
                  // 删除成功
                  this.messageInfo('删除成功', 'success');
                  this.initQueryList();
                } else {
                  this.messageInfo(res.msg || '删除失败', 'error');
                }
              })
              .catch(res => {
                this.messageInfo(res.msg || '删除失败', 'error');
              });
          })
          .catch(() => {
            this.messageInfo('已取消删除', 'info');
          });
      },
      // 批量删除
      deleteAll(id) {
        if (this.selectChecked.length < 1) {
          this.messageInfo('请选择要操作的选项', 'warning');
        } else {
          id = this.selectChecked.join(',');
          this.deleteConfirm(id, 1);
        }
      },
      // 选中
      changeTableCheckbox(val) {
        this.selectChecked = val.map(val => val.id);
      },
      // 创建-快问快答
      addExam() {
        if (this.pageLevel == 'user') {
          this.$router.push({
            path: '/material/addExam',
            query: { type: 1 }
          });
        } else {
          this.$router.push({
            path: '/live/addExam',
            query: { webinarId: this.$route.params.str, roomId: this.$route.query.roomId, type: 2 }
          });
        }
      },
      closeClose(done) {
        this.isShowQuestion = false;
      },
      mockExamList() {
        return {
          total: 200,
          list: [
            {
              id: 1,
              title: 'Apple产品功能知识点①',
              created_at: '2022-10-23 00:00:00',
              updated_at: '2022-10-23 00:00:00',
              total_score: 100,
              questions_count: 10,
              limit_time_switch: 1,
              limit_time: 70,
              auto_push_switch: 0,
              status: 1
            },
            {
              id: 2,
              title: 'Apple产品功能知识点2',
              created_at: '2022-10-23 00:00:00',
              updated_at: '2022-10-23 00:00:00',
              total_score: 100,
              questions_count: 10,
              limit_time_switch: 0,
              limit_time: 0,
              auto_push_switch: 0,
              status: 2
            },
            {
              id: 3,
              title: 'Apple产品功能知识点3',
              created_at: '2022-10-23 00:00:00',
              updated_at: '2022-10-23 00:00:00',
              total_score: 100,
              questions_count: 10,
              limit_time_switch: 0,
              limit_time: 0,
              auto_push_switch: 0,
              status: 3
            },
            {
              id: 4,
              title:
                'Apple产品功能知识点Apple产品功能知识点Apple产品功能知识点Apple产品功能知识点4',
              created_at: '2022-10-23 00:00:00',
              updated_at: '2022-10-23 00:00:00',
              total_score: 100,
              questions_count: 10,
              limit_time_switch: 0,
              limit_time: 0,
              auto_push_switch: 0,
              status: 0
            },
            {
              id: 5,
              title:
                'Apple产品功能知识点Apple产品功能知识点Apple产品功能知识点Apple产品功能知识点4',
              created_at: '2022-10-23 00:00:00',
              updated_at: '2022-10-23 00:00:00',
              total_score: 100,
              questions_count: 10,
              limit_time_switch: 0,
              limit_time: 0,
              auto_push_switch: 0,
              status: 0
            }
          ]
        };
      },
      // 页码改变按钮事件
      currentChangeHandler(current) {
        this.query.pageNumber = current;
        this.query.pos = parseInt((current - 1) * this.query.limit);
        this.getExamList();
      },
      // 获取列表数据
      getExamList() {
        let resData = this.mockExamList();
        resData.list.map(item => {
          item.created_at_str = item.created_at.substring(0, 16);
          item.updated_at_str = item.updated_at.substring(0, 16);
          item.limit_time_str = item.limit_time_switch == 1 ? item.limit_time : '不限时';
          item.status_css = ['no-push', 'answer', 'no-publish', 'publish'][item.status];
          item.status_str = ['未推送', '答题中', '成绩待公布', '成绩已公布'][item.status];
        });
        this.resultVo = resData;
        return;
        this.loading = true;
        this.isSearch = this.keyword ? true : false;
        let obj = Object.assign(
          {},
          {
            pos: this.query.pos,
            limit: this.query.limit
          },
          this.pageLevel == 'webinar'
            ? {
                keyword: this.keyword,
                source_id: this.$route.params.str,
                source_type: 1 // 活动ID
              }
            : {
                keyword: this.keyword
              }
        );
        this.$fetch('getExamList', this.$params(obj))
          .then(res => {
            this.loading = false;
            let resData = res.data;
            resData.list.map(item => {
              item.created_at_str = item.created_at.substring(0, 16);
              item.updated_at_str = item.updated_at.substring(0, 16);
              item.limit_time_str = item.limit_time_switch == 1 ? item.limit_time : '不限时';
              item.status_css = ['no-push', 'answer', 'no-publish', 'publish'][item.status];
              item.status_str = ['未推送', '答题中', '成绩待公布', '成绩已公布'][item.status];
            });
            this.resultVo = resData;
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
            this.resultVo = {
              total: 0,
              list: []
            };
          });
      },
      initComp() {
        this.initQueryList();
      },
      initQueryList() {
        // 表格切换到第一页
        this.query.pos = 0;
        this.query.pageNumber = 1;
        this.query.limit = 10;
        this.getExamList();
      },
      //文案提示问题
      messageInfo(msg, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: msg,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      // 打开资料库
      openSelectDialog() {
        this.$refs.selectExamDom.selectDialogVisible = true;
      },
      // 资料库内预览
      selectExamPreview(vo, answerType) {
        this.$refs.examPreviewDom &&
          this.$refs.examPreviewDom.openPreview(JSON.stringify(vo), answerType);
      }
    },
    mounted() {
      this.initComp();
    }
  };
</script>
<style lang="less">
  .zdy-vh-ui {
    .zdy-vh-ui-confirm {
      color: #fff;
      background-color: #fb2626;
      border-color: #fb2626;
      &:hover {
        background: #d4151c;
        border-color: #d4151c;
        color: #fff;
      }
      &:active,
      &:focus {
        background: #ad0914;
        border-color: #ad0914;
        color: #fff;
        outline: 0;
      }
    }
    .zdy-confirm-cancel {
      color: #262626;
      border-color: #d9d9d9;
      background: transparent;
      &:hover {
        color: #262626;
        border-color: #8c8c8c;
        background: #fff;
      }
      &:active,
      &:focus {
        color: #262626;
        border-color: #595959;
        background: #fff;
        outline: 0;
      }
    }
  }
</style>
<style lang="less" scoped>
  /* 列表样式-------------------------------------- */
  .all-no-data {
    /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
    padding-top: 105px;
    /deep/.createActive {
      padding-bottom: 30px;
    }
    /deep/.btn-list .el-button {
      margin-right: 0;
    }
  }
  /deep/.all-yes-data {
    .data-list {
      .el-table {
        margin-bottom: 32px;
        .cell {
          line-height: 25px;
        }
      }
    }
  }
  /deep/.search-no-data {
    padding-top: 128px;
    .search {
      padding-bottom: 0;
    }
  }
  /deep/.list--search {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-input {
      width: 180px;
      float: right;
      .el-input__icon {
        line-height: 36px;
      }
      .el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px !important;
      }

      .el-input__prefix {
        cursor: pointer;
      }
    }
    .el-select {
      width: 120px;
      .el-input {
        width: 120px;
      }
      float: right;
      margin-right: 12px;
      .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
      .el-select__caret.el-input__icon.el-icon-arrow-up {
        line-height: 36px;
      }
    }
    .search-data__input {
      margin-left: auto;
      width: 180px;
      height: 36px;
      line-height: 36px;
      .vh-input__prefix {
        top: -2px;
      }
      .vh-input__inner {
        border-radius: 100px;
      }
    }
  }
  .vmp-exam-list--search {
    margin-bottom: 24px;
    .el-select {
      float: right;
      margin-right: 20px;
      /deep/ .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
    }
    .el-input {
      width: 220px;
      float: right;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/ .el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px !important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
    .search-input {
      /deep/.el-input__inner {
        border-radius: 18px;
        height: 36px;
        background: transparent;
        padding-right: 50px;
        &.el-date-editor--daterange {
          padding-right: 10px;
        }
      }
    }
  }
  .vmp-exam-list {
    /deep/.el-table {
      margin-bottom: 32px;
    }
    /deep/.vh-button + .vh-button {
      margin-left: 12px;
    }
    .statusTag {
      font-size: 14px;
      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
      }
      &.no-push::before {
        background: #8c8c8c;
      }
      &.answer::before {
        background: #fb2626;
      }
      &.no-publish::before {
        background: #fc9600;
      }
      &.publish::before {
        background: #0fba5a;
      }
    }
    .pageBox {
      margin-top: 16px;
    }
    /deep/.vh-table__empty-block {
      min-height: 0;
      height: 0;
      line-height: unset;
    }
    /* 灰底 */
    &.gray-theme {
      .all-no-data {
        /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
        padding-top: 137px;
      }
      .list-table-panel {
        background: #ffffff;
        padding: 24px 24px 40px 24px;
      }
      /deep/.search-no-data {
        padding-top: 60px;
        background: #ffffff;
        padding-bottom: 120px;
      }
      .transparent-btn {
        &:hover {
          background-color: transparent;
        }
      }
      /deep/.vh-input__inner {
        background-color: transparent;
      }
    }
    .vh-button--text.is-ghost,
    .vh-button--text.is-plain {
      color: rgba(0, 0, 0, 0.85);
    }
    /deep/.vh-button--text.is-plain.is-disabled:hover,
    /deep/.vh-button--text.is-plain.is-disabled:active,
    /deep/.vh-button--text.is-plain.is-disabled:focus {
      color: rgba(0, 0, 0, 0.25) !important;
    }
  }
  /deep/.vh-table__fixed-right::before,
  /deep/.vh-table__fixed::before {
    height: 0;
  }
</style>
