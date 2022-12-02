<template>
  <div
    :class="['vmp-exam-list', 'gray-theme']"
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
        v-if="scene == 'material'"
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
          class="bigBtn"
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
          class="bigBtn"
          v-preventReClick
          @click.prevent.stop="openSelectDialog"
          v-if="scene == 'webinar'"
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
          v-if="scene == 'webinar'"
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
          @click="deleteAll"
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
          v-model.trim="keywordIpt"
          clearable
          @clear="getExamList"
          @keyup.enter.native="getExamList(false)"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" @click="getExamList(false)"></i>
        </vh-input>
      </div>
      <!-- 有消息内容 -->
      <div class="list-table-panel">
        <!-- 表格与分页 -->
        <div class="tab-content">
          <vh-table
            class="no-border"
            ref="tableList"
            :data="examList"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '56px' }"
            @selection-change="changeTableCheckbox"
          >
            <!-- 多选列 -->
            <vh-table-column type="selection" width="55" align="left" :selectable="selectable" />
            <!-- 名称列 -->
            <vh-table-column
              align="left"
              min-width="220"
              label="名称"
              show-overflow-tooltip
              prop="title"
            />
            <!-- 创建时间 -->
            <vh-table-column
              v-if="scene === 'webinar'"
              align="left"
              min-width="148px"
              label="创建时间"
              prop="created_at"
            />
            <!--  更新时间 -->
            <vh-table-column
              v-if="scene === 'material'"
              align="left"
              min-width="148px"
              label="更新时间"
              prop="updated_at"
            />
            <!-- 总分 -->
            <vh-table-column
              align="left"
              :min-width="scene === 'webinar' ? '76px' : '52px'"
              label="总分"
              prop="total_score"
            />
            <!-- 题数 -->
            <vh-table-column
              align="left"
              :min-width="scene === 'webinar' ? '80px' : '52px'"
              label="题数"
              prop="questions_count"
            />

            <!-- 限时 -->
            <vh-table-column label="限时(分)" :min-width="scene === 'webinar' ? '80px' : '75px'">
              <template slot-scope="scope">
                {{ scope.row.limit_time_switch > 0 ? scope.row.limit_time : '无' }}
              </template>
            </vh-table-column>
            <!--  状态 -->
            <vh-table-column v-if="scene === 'webinar'" label="状态" min-width="120px">
              <template slot-scope="{ row }">
                <i :class="['icon-dot', `status-${row.status}`]" />
                {{ row.status | fmtExamStatus }}
              </template>
            </vh-table-column>
            <!-- 操作列 -->
            <vh-table-column label="操作" align="left" class="btn-rows" width="196">
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
            <null-page slot="empty" class="search-no-data" :height="0"></null-page>
          </vh-table>
        </div>
        <SPagination
          :total="total"
          hide-on-single-page
          :currentPage="queryParams.pageNum"
          @current-change="currentChangeHandler"
          align="center"
        ></SPagination>
      </div>
      <!-- 无消息内容 -->
    </div>
    <!-- 资料库：选择列表-->
    <select-exam ref="selectExamDom" @prev="preview" @added="getExamList"></select-exam>
    <!-- 预览快问快答 -->
    <exam-preview ref="examPrev" maxWidth="580px" maxHeight="420px"></exam-preview>
  </div>
</template>

<script>
  import NullPage from '../Error/nullPage.vue';
  import ExamPreview from './exam-prev.vue';
  import SelectExam from './components/selectExam.vue';
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamList',
    components: {
      NullPage,
      SelectExam,
      ExamPreview
    },
    props: {
      // 查询层级
      scene: {
        type: String,
        default: 'webinar' // webinar 活动层级；material 资料库
      }
    },
    data() {
      return {
        vm: null,
        /*--------------------列表部分参数定义--------------------*/
        loading: false,
        total: 0,
        selectChecked: [],
        keywordIpt: '',
        queryParams: {
          pos: 0,
          limit: 10,
          keyword: '',
          pageNum: 1
        },
        examList: []
      };
    },
    computed: {
      isDefaultShow() {
        return this.total === 0 && this.queryParams.keyword === '';
      }
    },
    filters: {
      fmtExamStatus(status) {
        status = parseInt(status);
        const statusMap = ['未推送', '答题中', '成绩待公布', '成绩已公布'];
        return statusMap[status] || '-';
      }
    },
    created() {
      this.initComp();
    },
    methods: {
      initComp() {
        this.getExamList();
      },
      selectable(examInfo) {
        return this.scene === 'material' || examInfo.status === 0;
      },
      getExamList(clear = true) {
        this.queryParams.pageNum = 1;
        if (clear) {
          this.keywordIpt = '';
        }
        this.queryExamList();
      },
      queryExamList() {
        const keywords = (this.queryParams.keyword = this.keywordIpt);
        let params = {
          limit: this.queryParams.limit,
          pos: (this.queryParams.pageNum - 1) * this.queryParams.limit,
          keywords
        };
        // 活动下列表增加活动id
        if (this.scene === 'webinar') {
          params.source_id = this.$route.params.str;
          params.source_type = 1;
          params.sort_field = 'updated_at';
        } else {
          params.sort_field = 'created_at';
        }
        examServer.getExamList(params).then(res => {
          this.examList = res.data.list || [];
          this.total = res.data.total;
          this.firstLoad = true;
        });
      },
      // 复制 - 单个快问快答
      cope(examObj) {
        examServer?.copyExam(examObj.id).then(res => {
          this.$message.success('复制成功');
          this.getExamList();
        });
      },
      //编辑 - 单个快问快答
      edit(examObj) {
        if (this.scene === 'webinar') {
          if (examObj.status === 0) {
            this.$router.push({
              path: '/live/addExam',
              query: {
                webinarId: this.$route.params.str,
                roomId: this.$route.query.roomId,
                type: 2,
                examId: examObj.id
              }
            });
          } else {
            this.$message({
              message: '已推送的快问快答不支持编辑，建议进行「复制」',
              type: 'warning'
            });
          }
        } else {
          this.$router.push({
            path: '/material/addExam',
            query: {
              examId: examObj.id
            }
          });
        }
      },
      clear(e) {
        e.stopPropagation();
      },
      // 预览
      preview(examObj) {
        const prevCom = this.$refs.examPrev;
        prevCom.open(examObj.id, examObj.title);
      },
      // 删除 - 单条记录
      del(examObj) {
        if (this.scene === 'material' || examObj.status === 0) {
          this.deleteConfirm(examObj.id);
        } else {
          this.$message({
            message: '已推送的快问快答不支持删除',
            type: 'warning'
          });
        }
      },
      deleteConfirm(ids) {
        if (this.pageLevel == 'user') {
          this.sendDelRequest(ids);
        } else {
          this.$confirm('删除后，此快问快答将无法使用，确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box zdy-vh-ui',
            lockScroll: false,
            confirmButtonClass: 'zdy-vh-ui-confirm',
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              this.sendDelRequest(ids);
            })
            .catch(() => {
              this.messageInfo('已取消删除', 'info');
            });
        }
      },
      sendDelRequest(ids) {
        // 用户级别的
        examServer
          ?.delExam(ids)
          .then(res => {
            this.$message.success('删除成功');
            this.getExamList();
          })
          .catch(res => {
            this.messageInfo(res.msg || '删除失败', 'error');
          });
      },
      deleteAll() {
        if (this.selectChecked.length < 1) {
          this.messageInfo('请选择要操作的选项', 'warning');
        } else {
          const ids = this.selectChecked.join(',');
          this.deleteConfirm(ids);
        }
      },
      // 选中
      changeTableCheckbox(val) {
        this.selectChecked = val.map(val => val.id);
      },
      // 创建-快问快答
      addExam() {
        if (this.scene == 'material') {
          this.$router.push({
            path: '/material/addExam',
            query: { type: 1 }
          });
        } else {
          this.$router.push({
            path: '/live/addExam',
            query: {
              webinarId: this.$route.params.str,
              roomId: this.$route.query.roomId,
              type: 2
            }
          });
        }
      },
      // 页码改变按钮事件
      currentChangeHandler(page) {
        this.queryParams.pageNum = page;
        this.queryExamList();
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
        this.$refs.selectExamDom.open();
      }
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
  .bigBtn {
    width: 160px;
  }
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
    .icon-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      line-height: 40px;
      margin-right: 2px;
      vertical-align: 2px;
      &.status-0 {
        background-color: #8c8c8c;
      }
      &.status-1 {
        background-color: #0a7ff5;
      }
      &.status-2 {
        background-color: #fc9600;
      }
      &.status-3 {
        background-color: #0fba5a;
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
</style>
