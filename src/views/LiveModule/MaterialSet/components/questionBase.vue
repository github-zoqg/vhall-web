<template>
  <div>
  <VhallDialog
      title="资料库"
      :visible.sync="dataBaseVisible"
      :close-on-click-modal="false"
      width="50%">
      <div class="data-base">
        <div class="data-search">
          <el-input v-model="keyword" suffix-icon="el-icon-search" placeholder="搜索问卷名称" clearable @change="getTableList" style="width: 200px"></el-input>
        </div>
          <div class="data-base-list">
            <el-table
              :data="tableData"
              style="width: 100%"
              height="300"
              >
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
          </div>
        <div slot="footer" class="dialog-footer">
          <el-button round @click.prevent.stop="dataBaseVisible = false">取 消</el-button>
          <el-button round type="primary" @click.prevent.stop="dataBaseVisible">确 定</el-button>
        </div>
      </div>
    </VhallDialog>
    <pre-question ref="isPreQuestion" :questionId="questionId"></pre-question>
  </div>
</template>
<script>
import preQuestion from '@/components/Question/preQuestion';
export default {
  data() {
    return {
      total: 87,
      dataBaseVisible: false,
      loading: false,
      keyword: '',
      questionId: '',
      totalPages: 1,
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 50
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
    getTableList() {
      let formParams = {
        keyword: this.keyword
      }
      if (this.keyword) {
        this.pageInfo.pageNum= 1;
        this.pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, this.pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.loading = false;
        this.tableData = res.data.list;
        this.totalPages = Math.ceil(res.data.list / this.pageInfo.limit);
      })
    },
     // 预览
    preview(rows) {
      console.log('预览', rows);
      this.questionId = rows.question_id;
      this.$refs.isPreQuestion.dialogVisible = true;
    },
     // 选中
    changeTableCheckbox(val) {
      console.log(val);
    },
  }
};
</script>
<style lang="less" scoped>
.data-base-list {
  width: 100%;
  margin: 24px 0;
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
  padding:24px 0;
}
</style>
