<template>
  <div>
  <VhallDialog
      title="资料库"
      :visible.sync="dataBaseVisible"
      :close-on-click-modal="false"
      width="50%">
      <div class="data-base">
        <div class="data-search">
          <el-input v-model="keyword" suffix-icon="el-icon-search" placeholder="搜索问卷名称" clearable @change="getTitle" style="width: 200px"></el-input>
        </div>
          <div class="data-base-list">
            <el-table
              :data="tableData"
              ref="tableList"
              style="width: 100%"
              height="300"
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
                label="操作">
                <template slot-scope="scope">
                  <span @click="preview(scope.row)">预览</span>
                </template>
              </el-table-column>
            </el-table>
            <p class="text">已选择<span>{{ checkList.length }}</span>个</p>
          </div>
        <div slot="footer" class="dialog-footer">
          <el-button round @click.prevent.stop="dataBaseVisible = false">取 消</el-button>
          <el-button round type="primary" @click.prevent.stop="choseSureQuestion">确 定</el-button>
        </div>
      </div>
  </VhallDialog>
  <template v-if="isShowQuestion">
      <el-dialog class="vh-dialog" title="问卷预览" :visible.sync="isShowQuestion"  width="50%" center>
        <pre-question  :questionId="questionId"></pre-question>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import preQuestion from '@/components/Question/preQuestion';
export default {
  data() {
    return {
      total: 87,
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
        limit: 5
      }
    };
  },
  components: {
    preQuestion
  },
  watch: {
    dataBaseVisible() {
      if (this.dataBaseVisible) {
        this.getTableList();
      }
    }
  },
  computed: {
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.pageInfo.pageNum >= this.totalPages;
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted() {
    // if (this.dataBaseVisible) {
    //   this.getTableList();
    // }
  },
  methods: {
    moreLoadData() {
      if (this.pageInfo.pageNum >= this.totalPages) {
        return false;
      }
      this.pageInfo.pageNum ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
      this.getTableList();
    },
    load() {
      this.loading = true;
      this.pageInfo.pageNum ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit)
      this.getTableList();
    },
    handleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTitle() {
      this.getTableList();
    },
    getTableList() {
      let formParams = {
        keyword: this.keyword
      }
      if (this.keyword) {
        this.pageInfo.pageNum= 1;
        this.pageInfo.pos= 0;
        this.$refs.tableList.clearSelection();
      }
      let obj = Object.assign({}, this.pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.loading = false;
        let list = res.data.list;
        this.tableData.push(...list);
        this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
        console.log(this.totalPages, '1111111111111')
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
     // 预览
    preview(rows) {
      console.log('预览', rows);
      this.questionId = rows.question_id;
      this.isShowQuestion = true;
    },
     // 选中
    handleSelectionChange(val) {
      this.checkList = val.map(item => item.question_id);
    },
  }
};
</script>
<style lang="less" scoped>
.data-base-list {
  width: 100%;
  margin: 24px 0;
  .text{
    padding-top: 30px;
    span{
      color: #fb3a32;
      padding: 0 5px;
    }
  }
  // max-height: 300px;
  /deep/.el-table th{
    background: #f7f7f7;
    padding: 15px 0;
  }
  /deep/.el-table td{
    padding: 15px 0;
  }
  span{
    cursor: pointer;
  }
}
.dialog-footer{
  padding-bottom: 24px;
}
</style>
