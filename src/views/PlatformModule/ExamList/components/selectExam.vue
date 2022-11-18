<template>
  <div class="show-exam exam-base" v-if="selectDialogVisible">
    <div class="show-main data-base">
      <p class="title">
        选择快问快答
        <i class="el-icon-close" @click="selectDialogVisible = false"></i>
      </p>
      <div class="data-search" v-show="total || isSearch">
        <VhallInput
          class="search-dialog-tag"
          v-clearEmoij
          v-model="keyword"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="searchExamList"
          style="width: 180px"
          @clear="searchExamList"
        >
          <i
            slot="prefix"
            class="el-icon-search el-input__icon"
            style="cursor: pointer; line-height: 36px"
            @click="searchExamList"
          ></i>
        </VhallInput>
      </div>
      <div class="data-base-list" v-show="total || isSearch">
        <vh-table
          :data="tableData"
          ref="selectExamTable"
          style="width: 100%"
          :height="isSearch && total == 0 ? 0 : 320"
          v-loadMore="moreLoadData"
          @selection-change="handleSelectionChange"
          @select-all="checkAllExam"
        >
          <vh-table-column type="selection" width="55"></vh-table-column>
          <vh-table-column fixed="left" label="名称">
            <template slot-scope="scope">
              <span class="mediaName" :title="scope.row.title">
                {{ scope.row.title }}
              </span>
            </template>
          </vh-table-column>
          <vh-table-column prop="total_score" label="总分" width="100"></vh-table-column>
          <vh-table-column prop="questions_count" label="题数" width="100"></vh-table-column>
          <vh-table-column label="限时（分）" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.limit_time_switch == 1 ? scope.row.limit_time : '不限时' }}</span>
            </template>
          </vh-table-column>
          <vh-table-column width="100" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="show-hover" style="cursor: pointer" @click="preview(scope.row)">
                预览
              </span>
            </template>
          </vh-table-column>
        </vh-table>
        <noData :nullType="'search'" :height="50" v-if="isSearch && total == 0"></noData>
      </div>
      <div class="no-live" v-show="!total && !(isSearch && total == 0)">
        <noData :nullType="'nullData'" :text="'您还没有快问快答，快来创建吧！'" :height="10">
          <el-button type="primary" round @click="addExam" v-preventReClick>创建</el-button>
        </noData>
      </div>
      <div v-show="total || (isSearch && total == 0)">
        <p class="text">
          已选择
          <span>{{ checkList.length }}</span>
          个（每次最多选择20个）
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button
            round
            size="medium"
            type="primary"
            @click.prevent.stop="choseSureExam"
            :disabled="!checkList.length"
            v-preventReClick
          >
            确 定
          </el-button>
          <el-button round size="medium" @click.prevent.stop="handleCloseVisiton" v-preventReClick>
            取 消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import noData from '@/views/PlatformModule/Error/nullPage';
  export default {
    data() {
      return {
        vm: null,
        total: 0,
        isSearch: false, //是否是搜索
        selectDialogVisible: false,
        loading: false,
        keyword: '',
        examId: '',
        checkList: [],
        totalPages: 1,
        tableData: [],
        isCheckAll: false,
        pageInfo: {
          pageNum: 1,
          pos: 0,
          limit: 10
        }
      };
    },
    components: {
      noData
    },
    watch: {
      selectDialogVisible() {
        if (this.selectDialogVisible) {
          this.keyword = '';
          this.isCheckAll = false;
          this.pageInfo.pageNum = 1;
          this.pageInfo.pos = 0;
          this.checkList = [];
          this.tableData = [];
          this.getExamList();
        }
      }
    },
    methods: {
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
      handleClose(done) {
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        done();
      },
      handleCloseVisiton() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        this.selectDialogVisible = false;
      },
      moreLoadData() {
        if (this.pageInfo.pageNum >= this.totalPages) {
          return false;
        }
        this.pageInfo.pageNum++;
        this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
        this.getExamList();
      },
      handleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      searchExamList() {
        this.tableData = [];
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        try {
          if (this.$refs.selectExamTable) {
            this.$refs.selectExamTable.clearSelection();
          }
        } catch (e) {}
        this.getExamList();
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
      getExamList() {
        let resData = this.mockExamList();
        resData.list.map(item => {
          item.created_at_str = item.created_at.substring(0, 16);
          item.updated_at_str = item.updated_at.substring(0, 16);
          item.limit_time_str = item.limit_time_switch == 1 ? item.limit_time : '不限时';
          item.status_css = ['no-push', 'answer', 'no-publish', 'publish'][item.status];
          item.status_str = ['未推送', '答题中', '成绩待公布', '成绩已公布'][item.status];
        });
        this.total = resData.total;
        let list = resData.list;
        this.tableData.push(...list);
        if (this.isCheckAll) {
          this.$refs.selectExamTable.toggleAllSelection();
        }
        this.totalPages = Math.ceil(resData.total / this.pageInfo.limit);
        return;
        let formParams = {
          keyword: this.keyword
        };
        this.isSearch = this.keyword ? true : false;
        let obj = Object.assign({}, this.pageInfo, formParams);
        this.$fetch('getExamList', this.$params(obj)).then(res => {
          this.loading = false;
          this.total = res.data.total;
          let list = res.data.list;
          this.tableData.push(...list);
          if (this.isCheckAll) {
            this.$refs.selectExamTable.toggleAllSelection();
          }
          this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
        });
      },
      // 选择资料库中的快问快答
      choseSureExam() {
        if (this.checkList.length >= 21) {
          this.messageInfo('每次只能添加20个快问快答', 'error');
          return;
        }
        let params = {
          source_type: 1,
          ids: this.checkList.join(','),
          source_id: this.$route.params.str // 活动ID
        };
        this.$fetch('selectExamToWebinar', params)
          .then(res => {
            this.messageInfo('添加成功', 'success');
            this.selectDialogVisible = false;
            this.pageInfo.pageNum = 1;
            this.pageInfo.pos = 0;
            this.$emit('getTableList');
          })
          .catch(res => {
            this.messageInfo('添加失败', 'error');
            this.selectDialogVisible = true;
          });
      },
      addExam() {
        this.$router.push({
          path: '/material/addExam',
          query: {
            type: 1
          }
        });
      },
      // 预览
      preview(rows) {
        this.examId = rows.id;
        // this.selectDialogVisible = false;
        this.$emit(
          'selectExamPreview',
          {
            id: this.examId
          },
          'mock'
        );
      },
      checkAllExam(selection) {
        // 全选
        this.isCheckAll = selection && selection.length > 0;
        this.checkList = selection.map(item => item.id);
      },
      // 选中
      handleSelectionChange(val) {
        this.checkList = val.map(item => item.id);
      }
    }
  };
</script>
<style lang="less" scoped>
  .search-dialog-tag {
    /deep/ .el-input__icon {
      line-height: 36px;
    }
    /deep/.el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
      // padding-right: 10px;
    }
  }
  .data-base {
    position: relative;
    z-index: 1000;
    .title {
      padding: 32px;
      font-size: 20px;
      i {
        float: right;
        color: #1a1a1a;
      }
    }
    .data-search {
      padding-left: 24px;
    }
  }

  .data-base-list {
    width: 100%;
    margin: 16px 0 24px 0;
    padding: 0 32px;
    .mediaName {
      font-size: 14px;
      color: #1a1a1a;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.el-table th {
      background-color: #f7f7f7;
    }
    .show-hover {
      &:hover {
        color: #fb3a32;
      }
    }
  }
  .text {
    height: 40px;
    padding-top: 8px;
    font-size: 14px;
    padding-left: 32px;
    span {
      color: #fb3a32;
      padding: 0 5px;
    }
    // max-height: 300px;
    /deep/.el-table th {
      background: #f7f7f7;
      padding: 15px 0;
    }
    /deep/.el-table td {
      padding: 15px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      cursor: pointer;
    }
  }
  .show-exam {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
    .show-main {
      position: absolute;
      top: 48%;
      left: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      width: 760px;
      // padding: 24px 32px;
      padding-bottom: 24px;
      border-radius: 4px;
      .exam_main {
        max-height: 550px;
        position: relative;
      }
      .close-btn {
        z-index: 100;
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        padding: 5px;
        i {
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
      }

      .submit-footer {
        text-align: center;
        padding-top: 20px;
      }
    }
    .data-base {
      width: 800px;
    }
    /deep/.vh-table::before {
      height: 0;
    }
  }
  .dialog-footer {
    position: absolute;
    bottom: 25px;
    right: 30px;
  }
</style>
