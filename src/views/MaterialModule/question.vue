<template>
  <div class="question-wrap">
    <pageTitle title="问卷">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button type="primary" round class="head-btn set-upload" v-preventReClick @click="addQuestion">新建</el-button>
      <el-button round class="head-btn batch-del" @click="deleteAll(null)" v-preventReClick>批量删除</el-button>
      <div class="inputKey">
        <el-input v-model.trim="keyword" suffix-icon="el-icon-search" placeholder="请输入问卷名称" clearable @change="getTableList"></el-input>
      </div>
    </div>
    <el-card class="question-list" v-show="total">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </el-card>
    <div class="no-live" v-show="!total">
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" v-if="nullText == 'nullData'" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
      </noData>
    </div>
    <template v-if="isShowQuestion">
      <el-dialog class="vh-dialog" title="问卷预览" :visible.sync="isShowQuestion" :before-close='closeClose' width="50%" center>
        <pre-question  :questionId="questionId"></pre-question>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import preQuestion from '@/components/Question/preQuestion';
import { sessionOrLocal } from '@/utils/utils';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "question",
  data() {
    return {
      total: 0,
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还没有问卷，快来创建吧！',
      selectChecked: [],
      keyword: '',
      questionId: '',
      isShowQuestion: false,
      tabelColumn: [
        {
          label: '问卷ID',
          key: 'question_id',
        },
        {
          label: '问卷名称',
          key: 'title',
        },
        {
          label: '更新时间',
          key: 'updated_at',
        },
        {
          label: '题目数量',
          key: 'topic_num',
        }
      ],
      tableRowBtnFun: [
        {name:'预览', methodName: 'preview'}, {name:'复制', methodName: 'cope'} ,{name:'编辑', methodName: 'edit'},{name:'删除', methodName: 'del'}
      ],
      tableData: []
    };
  },
  components: {
    PageTitle,
    preQuestion,
    noData
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = {
        user_id: this.userId,
        keyword: this.keyword
      }
      if (this.keyword) {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
        this.nullText = 'search';
        this.text = '';
        this.isSearch = true;
      } else {
        this.nullText = 'nullData';
        this.text = '您还没有问卷，快来创建吧！';
        this.isSearch = false;
      }
      let obj = Object.assign({}, pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.list || [];
        // if (window.sessionStorage.getItem("vhallyunFormAnswerDetail")) {
        //   window.sessionStorage.removeItem("vhallyunFormAnswerDetail");
        // }
      })
    },
    // 预览
    preview(that, {rows}) {
      console.log('预览', rows);
      that.isShowQuestion = true;
      that.questionId = rows.question_id;
      // if (window.sessionStorage.getItem("vhallyunFormAnswerDetail")) {
      //   window.sessionStorage.removeItem("vhallyunFormAnswerDetail");
      // }
    },
    // 复制
    cope(that, {rows}) {
      that.$fetch('copyQuestion', {survey_id: rows.question_id}).then(res => {
        that.$message({
          type: res.code == 200 ? 'success' : 'error',
          message: res.msg,
        });
        that.getTableList();
      })
    },
    // 编辑
    edit(that, {rows}) {
      console.log('编辑', rows);
      that.$router.push({
        path: '/material/addQuestion',
        query: {
          questionId: rows.question_id,
          type: 1
        }
      });
    },
    // 删除
    del(that, {rows}) {
      that.deleteConfirm(rows.question_id);
    },
    deleteConfirm(id) {
      this.$confirm('此操作将删除该文件, 确认继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          this.$fetch('deleteQuestion', {survey_ids: id}).then(res => {
            this.getTableList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteAll(id) {
       if (this.selectChecked.length < 1) {
          this.$message.warning('请选择要操作的选项');
        } else {
          id = this.selectChecked.join(',');
          this.deleteConfirm(id);
        }
    },
    // 选中
    changeTableCheckbox(val) {
      this.selectChecked = val.map(val => val.question_id)
      console.log(this.selectChecked);
    },
    addQuestion() {
      this.$router.push({
        path: '/material/addQuestion',
        query: {
          type: 1 //用来判断区分哪里的问卷
        }
      });
    },
    closeClose(done){
      this.isShowQuestion = false;
    }
  },
};
</script>

<style lang="less" scoped>
.question-wrap{
  height: 100%;
  width: 100%;
  .question-list{
    width: 100%;
  }
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
    }
  }
}
</style>
