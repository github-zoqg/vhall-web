<template>
  <div class="show-exam exam-base webkit-scrollbar" v-if="dialogVisible">
    <div class="show-main data-base">
      <p class="title">
        选择快问快答
        <i class="el-icon-close cursor-pointer" @click="dialogVisible = false"></i>
      </p>
      <div class="data-search" v-show="!noExamData">
        <VhallInput
          class="search-dialog-tag"
          v-clearEmoij
          v-model="keywordIpt"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="getExamList(false)"
          style="width: 180px"
          @clear="getExamList"
        >
          <i
            slot="prefix"
            class="el-icon-search el-input__icon"
            style="cursor: pointer; line-height: 36px"
            @click="getExamList(false)"
          ></i>
        </VhallInput>
      </div>
      <div class="data-base-list" v-show="!noExamData">
        <vh-table
          :data="examList"
          ref="selectExamTable"
          style="width: 100%"
          height="320px"
          class="scrollbar no-border"
          @selection-change="handleSelectionChange"
          @select-all="checkAllExam"
          v-loadMore="moreLoadData"
        >
          <vh-empty
            slot="empty"
            :image="searchNoData"
            description="暂未搜索到您想要的内容"
          ></vh-empty>

          <vh-table-column type="selection" width="55"></vh-table-column>
          <vh-table-column label="名称">
            <template slot-scope="scope">
              <span class="mediaName" :title="scope.row.title">
                {{ scope.row.title }}
              </span>
            </template>
          </vh-table-column>
          <vh-table-column prop="total_score" label="总分" width="80"></vh-table-column>
          <vh-table-column prop="questions_count" label="题数" width="80"></vh-table-column>
          <vh-table-column label="限时（分）" width="105">
            <template slot-scope="scope">
              <span>{{ scope.row.limit_time_switch == 1 ? scope.row.limit_time : '无' }}</span>
            </template>
          </vh-table-column>
          <vh-table-column width="65" label="操作">
            <template slot-scope="scope">
              <span class="show-hover" style="cursor: pointer" @click="preview(scope.row)">
                预览
              </span>
            </template>
          </vh-table-column>
        </vh-table>
      </div>
      <div class="no-exam" v-show="noExamData">
        <vh-empty :image="searchNoData" description="您还没有快问快答，快来创建吧!">
          <vh-button type="primary" class="create-button" round @click="addExam" v-preventReClick>
            创建
          </vh-button>
        </vh-empty>
      </div>
      <div v-show="!noExamData" slot="footer" class="dialog-footer">
        <p class="text">
          已选择
          <span>{{ checkList.length }}</span>
          个（每次最多选择20个）
        </p>
        <div>
          <vh-button
            round
            size="medium"
            type="primary"
            @click.prevent.stop="choseSureExam"
            :disabled="!checkList.length"
            v-preventReClick
          >
            确 定
          </vh-button>
          <vh-button plain round size="medium" @click.prevent.stop="handleCloseVisiton">
            取 消
          </vh-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { searchNoData } from '@/utils/ossImgConfig';
  import examServer from '@/utils/examServer';
  export default {
    name: 'materialExamSelect',
    data() {
      return {
        vm: null,
        total: 0,
        dialogVisible: false,
        loading: false,
        checkList: [],
        examList: [],
        isCheckAll: false,
        keywordIpt: '',
        queryParams: {
          limit: 10,
          keyword: '',
          pageNum: 1
        },
        searchNoData
      };
    },
    computed: {
      // 暂未创建列表
      noExamData() {
        return this.queryParams.keyword === '' && this.total === 0;
      }
    },
    methods: {
      open() {
        this.dialogVisible = true;
        this.keywordIpt = '';
        this.isCheckAll = false;
        this.examList = [];
        this.checkList = []; // 清空选中列表
        this.getExamList();
      },
      getExamList(clear = true) {
        this.queryParams.pageNum = 1;
        if (clear) {
          this.keywordIpt = '';
        }
        this.examList = [];
        this.queryExamList();
      },
      queryExamList() {
        const keywords = (this.queryParams.keyword = this.keywordIpt);
        const params = {
          limit: this.queryParams.limit,
          pos: (this.queryParams.pageNum - 1) * this.queryParams.limit,
          keywords,
          sort_field: 'paper_edit_time'
        };
        examServer.getExamList(params).then(res => {
          res.data.list.map(item => {
            this.examList.push(item);
          });
          this.total = res.data.total;
          this.firstLoad = true;
        });
      },
      moreLoadData() {
        if (this.examList.length >= this.total) return false;
        this.queryParams.pageNum++;
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
      handleClose(done) {
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        done();
      },
      handleCloseVisiton() {
        this.dialogVisible = false;
      },
      handleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      // 选择资料库中的快问快答
      choseSureExam() {
        if (this.checkList.length > 20) {
          this.messageInfo('每次只能添加20个快问快答', 'error');
          return;
        }
        let params = {
          source_type: 1,
          ids: this.checkList.join(','),
          source_id: this.$route.params.str // 活动ID
        };
        examServer
          .selectExamFromUser(params)
          .then(() => {
            this.messageInfo('添加成功', 'success');
            this.checkList = []; // 清空选中列表
            this.dialogVisible = false;
            this.$emit('added');
          })
          .catch(() => {
            this.messageInfo('添加失败', 'error');
          });
      },
      addExam() {
        this.$router.push({
          path: '/material/addExam'
        });
      },
      // 预览
      preview(rows) {
        this.$emit('prev', rows);
      },
      checkAllExam(selection) {
        // 全选
        this.isCheckAll = selection && selection.length > 0;
        this.checkList = selection.map(item => item.id);
      },
      // 选中
      handleSelectionChange(val) {
        this.checkList = val.map(item => item.id);
      },
      currentChangeHandler(page) {
        this.queryParams.pageNum = page;
        this.queryExamList();
      }
    }
  };
</script>
<style lang="less">
  .search-dialog-tag {
    .el-input__icon {
      line-height: 36px;
    }
    .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
      border-radius: 18px;
    }
    .el-input__prefix {
      cursor: pointer;
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
      }
    }
    .data-search {
      padding-left: 32px;
    }
  }

  .data-base-list {
    width: 100%;
    margin: 16px 0 20px 0;
    padding: 0 32px;
    .mediaName {
      font-size: 14px;
      color: #1a1a1a;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .vh-table th {
      background-color: #f7f7f7;
    }
    .show-hover {
      &:hover {
        color: #fb3a32;
      }
    }
  }
  .text {
    font-size: 14px;
    span {
      color: #fb3a32;
      padding: 0 5px;
    }
    .vh-table th {
      background: #f7f7f7;
      padding: 15px 0;
    }
    .vh-table td {
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
      width: 800px;
      // padding: 24px 32px;
      padding-bottom: 30px;
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
    .vh-table::before {
      height: 0;
    }
  }
  .dialog-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    // position: absolute;
    // bottom: 25px;
    // right: 30px;
  }
  .no-exam {
    height: 360px;
  }
  .cursor-pointer {
    color: #8c8c8c;
    cursor: pointer;
    &:hover {
      color: #595959;
    }
  }
</style>
