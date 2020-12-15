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
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="addQuestion">新建</el-button>
      <el-button round  @click="dataBase">资料库</el-button>
      <el-button round class="head-btn batch-del" @click="deleteAll(null)">批量删除</el-button>
      <div class="inputKey">
        <el-input v-model="keyword" placeholder="请输入问卷名称" @change="getTableList"></el-input>
      </div>
    </div>
    <el-card class="question-list">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </el-card>
    <pre-question ref="isPreQuestion" :questionId="questionId"></pre-question>
    <base-question ref="dataBase"></base-question>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import preQuestion from '@/components/Question/preQuestion';
import baseQuestion from './components/questionBase';
export default {
  name: "question",
  data() {
    return {
      total: 100,
      selectChecked: [],
      keyword: '',
      questionId: '',
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
      tableData: [
        {
          survey_id: '12312413',
          title: '请输入000',
          updated_at: '2020-10-03',
          topic_num: 100
        },
        {
          survey_id: '1212345',
          title: '请输入111',
          updated_at: '2020-10-12',
          topic_num: 200
        }
      ]
    };
  },
  components: {
    PageTitle,
    preQuestion,
    baseQuestion
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = {
        webinar_id: this.$route.query.id,
        room_id: this.$route.query.roomId,
        keyword: this.keyword
      }
      if (this.keyword) {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
      this.$fetch('getLiveQuestionList', this.$params(obj)).then(res => {
        this.tableData = res.data.list || [];
        this.total = res.data.total;
      })
    },
    // 预览
    preview(that, {rows}) {
      console.log('预览', rows);
      that.questionId = rows.question_id;
      that.$refs.isPreQuestion.dialogVisible = true;
    },
    // 复制
    cope(that, {rows}) {
      let params = {
        survey_id: rows.question_id,
        webinar_id: that.$route.query.id,
        room_id: that.$route.query.roomId
      }
      that.$fetch('copyLiveQuestion', params).then(res => {
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
        path: '/live/addQuestion',
        query: {
          id: rows.question_id,
          webinarId: that.$route.query.id,
          roomId: that.$route.query.roomId
        }
        }
      );
    },
    // 删除
    del(that, {rows}) {
       that.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.deleteAll(rows.question_id);
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteAll(id) {
      if (!id) {
        if (this.selectChecked.length < 1) {
          this.$message.warning('请选择要操作的选项');
        } else {
          id = this.selectChecked.join(',');
        }
      }
      this.$fetch('deleteLiveQuestion', {survey_ids: id, webinar_id: this.$route.query.id}).then(res => {
        this.getTableList();
        this.$refs.tableList.clearSelect();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })
    },
    // 选中
    changeTableCheckbox(val) {
      this.selectChecked = val.map(val => val.question_id)
      console.log(this.selectChecked);
    },
    addQuestion() {
      this.$router.push({
        path: '/live/addQuestion', query: {webinarId: this.$route.query.id, roomId: this.$route.query.roomId}});
    },
    dataBase() {
      this.$refs.dataBase.dataBaseVisible = true;
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
