<template>
  <div>
  <VhallDialog
      title="资料库"
      :visible.sync="dataBaseVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="750px">
      <div class="data-base">
        <div class="data-search" v-show="total || isSearch">
          <el-input v-model.trim="keyword" suffix-icon="el-icon-search" placeholder="搜索问卷名称" clearable @change="getTitle" style="width: 200px"></el-input>
        </div>
        <div class="data-base-list" v-show="total">
            <el-table
              :data="tableData"
              ref="tableList"
              style="width: 100%"
              height="320"
              v-loadMore="moreLoadData"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                fixed
                prop="title"
                label="标题">
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
                  <span style="cursor: pointer;" @click="preview(scope.row)">预览</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="no-live" v-show="!total">
          <noData :nullType="nullText" :text="text" :height="50">
            <el-button type="primary" v-if="nullText == 'nullData'" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
          </noData>
        </div>
        <p class="text" v-show="total || isSearch">已选择<span>{{ checkList.length }}</span>个</p>
        <div slot="footer" class="dialog-footer" v-show="total || isSearch">
          <el-button round size="medium" type="primary" @click.prevent.stop="choseSureQuestion" v-preventReClick>确 定</el-button>
          <el-button round size="medium" @click.prevent.stop="dataBaseVisible = false" v-preventReClick>取 消</el-button>
        </div>
      </div>
  </VhallDialog>
  <template v-if="isShowQuestion">
      <div class="show-question">
        <div class="show-main">
          <p>问卷预览 <i class="el-icon-close" @click="choseShowQueston"></i></p>
          <el-scrollbar>
            <div class="question_main">
              <pre-question  :questionId="questionId"></pre-question>
            </div>
          </el-scrollbar>
          <div class="submit-footer">
            <el-button class="length152" type="primary" disabled size="medium" round>提交</el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import preQuestion from '@/components/Question/preQuestion';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  data() {
    return {
      total: 0,
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还没有问卷，快来创建吧！',
      dataBaseVisible: false,
      isShowQuestion: false,
      loading: false,
      keyword: '',
      questionId: '',
      checkList: [],
      totalPages: 1,
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 10
      }
    };
  },
  components: {
    preQuestion,
    noData
  },
  watch: {
    dataBaseVisible() {
      if (this.dataBaseVisible) {
        this.getTableList();
        this.tableData = [];
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
      done();
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
      this.getTableList();
      this.pageInfo.pageNum = 1;
      this.pageInfo.pos = 0;
      this.$refs.tableList.clearSelection();
    },
    getTableList() {
      let formParams = {
        keyword: this.keyword
      }
      if (this.keyword) {
        this.nullText = 'search';
        this.text = '';
        this.isSearch = true;
      } else {
        this.nullText = 'nullData';
        this.text = '您还没有问卷，快来创建吧！';
        this.isSearch = false;
      }
      let obj = Object.assign({}, this.pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.loading = false;
        this.total = res.data.total;
        let list = res.data.list;
        this.tableData.push(...list);
        console.log(this.tableData, '55555555555');
        this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
      })
    },
    // 选择资料库中的问卷
    choseSureQuestion() {
      let params = {
        room_id: this.$route.query.roomId,
        survey_ids: this.checkList.join(','),
        webinar_id: this.$route.query.id
      }
      this.$fetch('sharedLiveQuestion', params).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功');
          this.dataBaseVisible = false;
          this.$emit("getTableList");
        } else {
          this.$message.error('添加失败');
           this.dataBaseVisible = true;
        }
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
     // 选中
    handleSelectionChange(val) {
      this.checkList = val.map(item => item.question_id);
    },
  }
};
</script>
<style lang="less" scoped>
.data-base{
  position: relative;
  padding-bottom: 20px;
  .data-search{
    /deep/.el-input__inner{
      border-radius: 18px;
      padding-left: 12px;
    }
  }
}

.data-base-list {
  width: 100%;
  margin: 24px 0;
  }
  .text{
    height: 40px;
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
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
    .show-main{
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      width: 700px;
      padding: 24px 32px;
      .question_main{
        max-height: 600px;
        // overflow: auto;
      }
      p{
        font-size: 20px;
        font-weight: 600;
        color: #1A1A1A;
        line-height: 28px;
        padding-bottom: 14px;
        i{
          float: right;
          cursor: pointer;
        }
      }
      .submit-footer{
        text-align: center;
      }
    }
  }
.dialog-footer{
  position: absolute;
  bottom: 25px;
  right: 24px;
}
</style>
