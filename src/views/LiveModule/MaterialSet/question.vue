<template>
  <div class="question-wrap">
    <pageTitle title="问卷">
      <div slot="content">
        修改已收集数据的问卷，按照修改后的问卷重新统计，为确保问卷统<br>
        计结果不受影响，建议已推送的问卷需要修改时可以复制一份新的问卷
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button type="primary" size="medium" round class="head-btn set-upload" @click="addQuestion">创建问卷</el-button>
      <el-button round  @click="dataBase" size="medium">资料库</el-button>
      <el-button round class="head-btn batch-del" @click="deleteAll(null)" size="medium" :disabled="!selectChecked.length">批量删除</el-button>
      <div class="inputKey">
        <el-input v-model.trim="keyword" placeholder="请输入问卷名称"  @change="getTableList" maxlength="50" suffix-icon="el-icon-search" clearable></el-input>
      </div>
    </div>
    <div class="question-list" v-show="total">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" :width="180" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </div>
    <div class="no-live" v-show="!total">
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" v-if="nullText == 'nullData'" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
        <el-button size="white-primary" round v-if="nullText == 'nullData'" @click="dataBase" v-preventReClick>资料库</el-button>
      </noData>
    </div>
    <template v-if="isShowQuestion">
      <el-dialog class="vh-dialog" title="问卷预览" :visible.sync="isShowQuestion"  width="50%" center>
        <pre-question   :questionId="questionId"></pre-question>
        <div class="submit-footer">
          <el-button class="length152" type="primary" size="medium" @click="isShowQuestion=false" round>提交</el-button>
        </div>
      </el-dialog>
    </template>
    <base-question ref="dataBase" @getTableList="getTableList"></base-question>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import preQuestion from '@/components/Question/preQuestion';
import baseQuestion from './components/questionBase';
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
      loading: true,
      isShowQuestion: false,
      questionId: '',
      tabelColumn: [
        {
          label: '问卷ID',
          key: 'question_no',
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
    baseQuestion,
    noData
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
        this.nullText = 'search';
        this.text = '';
        this.isSearch = true;
      } else {
        this.nullText = 'nullData';
        this.text = '您还没有问卷，快来创建吧！';
        this.isSearch = false;
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
      that.isShowQuestion = true;
      that.questionId = rows.question_id;
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
      if (rows.publish) {
        that.$confirm('当前问卷已被推送，修改将影响之前收集的数据，确认修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          that.$router.push({
            path: '/live/addQuestion',
            query: {
                questionId: rows.question_id,
                webinarId: that.$route.query.id,
                roomId: that.$route.query.roomId,
                type: 2
              }
            }
          );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
      } else {
        that.$router.push({
          path: '/live/addQuestion',
          query: {
              questionId: rows.question_id,
              webinarId: that.$route.query.id,
              roomId: that.$route.query.roomId,
              type: 2
            }
          }
        );
      }
    },
    // 删除
    del(that, {rows}) {
      that.deleteConfirm(rows.question_id);
    },
    deleteConfirm(id) {
      this.$confirm('删除后，此问卷将无法使用，确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        customClass: 'zdy-message-box'
        }).then(() => {
          this.$fetch('deleteLiveQuestion', {survey_ids: id, webinar_id: this.$route.query.id}).then(res => {
            if (res.code == 200) {
              this.getTableList();
              this.$refs.tableList.clearSelect();
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败');
            }
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
        path: '/live/addQuestion', query: {webinarId: this.$route.query.id, roomId: this.$route.query.roomId, type: 2}});
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
    background: #fff;
    padding: 24px 32px;
    border-radius: 4px;
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
  .submit-footer{
    text-align: center;
  }
}
</style>
