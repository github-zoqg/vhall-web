<template>
  <div class="height-question">
  <div class="show-question question-base" v-if="dataBaseVisible">
      <div class="show-main data-base">
        <p class="title">选择问卷 <i class="el-icon-close" @click="dataBaseVisible=false"></i></p>
        <div class="data-search" v-show="total || isSearch">
          <VhallInput class="search-dialog-tag" v-clearEmoij v-model="keyword" placeholder="搜索问卷名称" clearable  @keyup.enter.native="getTitle" style="width: 220px" @clear="getTitle">
            <i slot="prefix" class="el-icon-search el-input__icon" style="cursor: pointer; line-height: 36px;" @click="getTitle"></i>
          </VhallInput>
        </div>
        <div class="data-base-list" v-show="total || isSearch">
            <el-table
              :data="tableData"
              ref="tableList"
              style="width: 100%"
              :height="(isSearch && total == 0) ? 0 : 320"
              v-loadMore="moreLoadData"
              @selection-change="handleSelectionChange"
              @select-all="checkAllQuestion"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                fixed
                label="标题">
                <template slot-scope="scope">
                  <span class="mediaName" :title="scope.row.title">
                    {{scope.row.title}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                prop="updated_at"
                label="更新时间">
              </el-table-column>
              <el-table-column
                fixed
                prop="topic_num"
                label="题目数量">
              </el-table-column>
              <el-table-column
                width="100"
                fixed
                label="操作">
                <template slot-scope="scope">
                  <span class="show-hover" style="cursor: pointer;" @click="preview(scope.row)">预览</span>
                </template>
              </el-table-column>
            </el-table>
            <noData :nullType="'search'" :height="50" v-if="isSearch && total == 0"></noData>
        </div>
        <div class="no-live" v-show="!total && !(isSearch && total == 0)">
          <noData :nullType="'nullData'" :text="'您还没有问卷，快来创建吧！'" :height="10">
            <el-button type="primary" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
          </noData>
        </div>
        <div v-show="total || (isSearch && total == 0)">
          <p class="text">已选择<span>{{ checkList.length }}</span>个问卷</p>
          <div slot="footer" class="dialog-footer">
            <el-button round size="medium" type="primary" @click.prevent.stop="choseSureQuestion" :disabled="!checkList.length" v-preventReClick>确 定</el-button>
            <el-button round size="medium" @click.prevent.stop="handleCloseVisiton" v-preventReClick>取 消</el-button>
          </div>
        </div>
      </div>
  </div>
  <template v-if="isShowQuestion">
      <div class="show-question" @click="isShowQuestion = false">
        <div class="show-main" @click.stop="isShowQuestion=true">
          <span class="close-btn"><i class="el-icon-close" @click.stop="isShowQuestion=false"></i></span>
          <el-scrollbar>
            <div class="question_main">
              <pre-question  :questionId="questionId"></pre-question>
            </div>
          </el-scrollbar>
          <div class="submit-footer">
            <el-button class="length152" type="primary" disabled size="medium" round>提交</el-button>
          </div>
        <!-- 隐私协议合规（活动下） -->
              <!-- <privacy-select scene="question" compType="2"></privacy-select> -->
            </div>
      </div>
  </template>
  </div>
</template>
<script>
// import PrivacySelect from '@/views/Login/components/privacy-select.vue';
import preQuestion from '@/components/Question/preQuestion';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  data() {
    return {
      total: 0,
      isSearch: false, //是否是搜索
      dataBaseVisible: false,
      isShowQuestion: false,
      loading: false,
      keyword: '',
      questionId: '',
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
    preQuestion,
    noData,
    // PrivacySelect
  },
  watch: {
    dataBaseVisible() {
      if (this.dataBaseVisible) {
        this.keyword = '';
        this.isCheckAll = false;
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        this.checkList = [];
        this.tableData = [];
        this.getTableList();
      }
    }
  },
  mounted() {
    // if (this.dataBaseVisible) {
    //   this.getTableList();
    // }
  },
  methods: {
    handleClose(done) {
      this.pageInfo.pageNum = 1;
      this.pageInfo.pos = 0;
      done();
    },
    handleCloseVisiton() {
      this.pageInfo.pageNum = 1;
      this.pageInfo.pos = 0;
      // console.log(document.querySelector('.dataBaseDialog .el-table__fixed').scrollTop)
      // document.querySelector('.el-table__body-wrapper is-scrolling-none').scrollTop = 0
      this.dataBaseVisible = false;
    },
    moreLoadData() {
      if (this.pageInfo.pageNum >= this.totalPages) {
        return false;
      }
      this.pageInfo.pageNum ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
      this.getTableList();
    },
    handleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTitle() {
      this.tableData = [];
      this.pageInfo.pageNum = 1;
      this.pageInfo.pos = 0;
      try {
        if (this.$refs.tableList) {
      this.$refs.tableList.clearSelection();
        }
      } catch(e) {}
      this.getTableList();
    },
    getTableList() {
      let formParams = {
        keyword: this.keyword
      }
      this.isSearch = this.keyword ? true : false;
      let obj = Object.assign({}, this.pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.loading = false;
        this.total = res.data.total;
        let list = res.data.list;
        this.tableData.push(...list);
        if(this.isCheckAll) {
          this.$refs.tableList.toggleAllSelection();
        }
        console.log(this.tableData, '55555555555');
        this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
      })
    },
    // 选择资料库中的问卷
    choseSureQuestion() {
      if (this.checkList.length >= 21) {
        this.$message({
          message: `每次只能添加20个问卷`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      let params = {
        room_id: this.$route.query.roomId,
        survey_ids: this.checkList.join(','),
        webinar_id: this.$route.params.str
      }
      this.$fetch('sharedLiveQuestion', params).then(res => {
        this.$vhall_paas_port({
          k: 100335,
          data: {business_uid: this.$parent.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: `添加成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.dataBaseVisible = false;
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        this.$emit("getTableList");
      }).catch(res => {
        this.$message({
          message: res.msg || `添加失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        this.dataBaseVisible = true;
      })
    },
    choseShowQueston() {
      this.isShowQuestion = false;
      this.dataBaseVisible = true;
    },
    addQuestion() {
      this.$router.push({
        path: '/material/addQuestion',
        query: {
          type: 1
        }
      });
    },
     // 预览
    preview(rows) {
      console.log('预览', rows);
      this.questionId = rows.question_id;
      this.isShowQuestion = true;
      this.dataBaseVisible = false;
    },
    checkAllQuestion(selection) {
      // 全选
      this.isCheckAll = selection && selection.length > 0;
      this.checkList = selection.map(item => item.question_id);
    },
     // 选中
    handleSelectionChange(val) {
      this.checkList = val.map(item => item.question_id);
    },
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
      padding-right: 30px!important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
      // padding-right: 10px;
    }
  }
.data-base{
  position: relative;
  z-index: 1000;
  .title{
    padding: 32px;
    font-size: 20px;
    i{
      float: right;
      color: #1A1A1A;
    }
  }
  .data-search{
    padding-left: 24px;
  }
}

.data-base-list {
  width: 100%;
  margin: 24px 0;
  padding: 0 32px;
  .mediaName{
    font-size: 14px;
    color: #1A1A1A;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/.el-table th{
    background-color: #f7f7f7;
  }
  .show-hover{
    &:hover{
      color: #fb3a32;
    }
  }
}
  .text{
    height: 40px;
    padding-top: 8px;
    font-size: 14px;
    padding-left: 32px;
    span{
      color: #fb3a32;
      padding: 0 5px;
    }
  // max-height: 300px;
  /deep/.el-table th{
    background: #f7f7f7;
    padding: 15px 0;
  }
  /deep/.el-table td{
    padding: 15px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span{
    cursor: pointer;
  }
}
.show-question{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, .3);
    .show-main{
      position: absolute;
      top: 48%;
      left: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      width: 760px;
      // padding: 24px 32px;
      padding-bottom: 24px;
      border-radius: 4px;
      .question_main{
        max-height: 550px;
        position: relative;
      }
      .close-btn{
        z-index: 100;
        position: absolute;
        top:16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        padding: 5px;
        i{
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
      }

      .submit-footer{
        text-align: center;
        padding-top: 20px;
      }
    }
    .data-base{
      width: 750px;
    }
  }
.dialog-footer{
  position: absolute;
  bottom: 25px;
  right: 30px;
}
</style>
