<template>
  <div class="question-wrap">
    <pageTitle title="问卷">
      <div slot="content">
        修改已收集数据的问卷，按照修改后的问卷重新统计，为确保
        <br>
        问卷统计结果不受影响，建议已推送的问卷需要修改时可以复制一份新的问卷
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button size="medium" type="primary" round class="length104 head-btn set-upload" v-preventReClick @click="addQuestion">创建问卷</el-button>
      <el-button size="medium" round class="length104 head-btn batch-del" @click="deleteAll(null)" :disabled="!selectChecked.length">批量删除</el-button>
      <div class="inputKey">
        <VhallInput v-model.trim="keyword" placeholder="请输入问卷名称" @keyup.enter.native="searchTableList"  @clear="searchTableList" clearable>
          <i slot="suffix" class="iconfont-v3 saasicon_search" @click="searchTableList" style="cursor: pointer; line-height: 36px;"></i>
        </VhallInput>
      </div>
    </div>
    <div class="no-live" v-if="!total && !isSearch">
      <noData :nullType="'nullData'" :text="'您还没有问卷，快来创建吧！'">
        <el-button type="primary"  round @click="addQuestion" v-preventReClick>创建问卷</el-button>
      </noData>
    </div>
    <div class="question-list" v-show="total || isSearch">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" @onHandleBtnClick='onHandleBtnClick' :width="180" @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
      <noData :nullType="'search'" v-if="isSearch"></noData>
    </div>
    <template v-if="isShowQuestion">
      <div class="show-question">
        <div class="show-main">
          <p>问卷预览 <i class="el-icon-close" @click="isShowQuestion=false"></i></p>
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
import PageTitle from '@/components/PageTitle';
import preQuestion from '@/components/Question/preQuestion';
import { sessionOrLocal } from '@/utils/utils';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "question",
  data() {
    return {
      total: 0,
      isSearch: false, //是否是搜索
      selectChecked: [],
      keyword: '',
      questionId: '',
      isShowQuestion: false,
      tabelColumn: [
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
    searchTableList() {
      this.getTableList('search')
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = {
        user_id: this.userId,
        keyword: this.keyword
      }
      if (params == 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
      }
      this.isSearch = this.keyword ? true : false;
      let obj = Object.assign({}, pageInfo, formParams);
      this.$fetch('getQuestionList', this.$params(obj)).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.list || [];
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
      this.$confirm('删除后，此问卷将无法使用，确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.$fetch('deleteQuestion', {survey_ids: id}).then(res => {
            this.getTableList('search');
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(res => {
            this.$message.error(res.msg || '删除失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteAll(id) {
      id = this.selectChecked.join(',');
      this.deleteConfirm(id);
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
.question-list{
  width: 100%;
  .layout--right--main();
  .padding-table-list();
  .min-height();
  /deep/.el-button .el-button--default .el-button--small .el-button--primary {
    margin-right: 20px;
  }
}

.question-wrap{
  height: 100%;
  width: 100%;
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
}
</style>
