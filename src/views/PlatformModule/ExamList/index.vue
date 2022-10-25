<template>
  <div :class="['vmp-exam-list', { 'gray-theme': pageLevel == 'user' }]"  v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)">
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="isDefaultShow">
      <null-page nullType="nullData" text="您还没有快问快答，快来创建吧！" :height="0"  v-if="pageLevel == 'user'">
        <el-button type="primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="addExam">创建</el-button>
        <el-button type="white-primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="openSelectDialog">资料库</el-button>
      </null-page>
      <null-page nullType="nullData" text="您还没有快问快答，快来创建吧！" :height="0" v-else>
        <el-button type="primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="addExam">创建</el-button>
        <el-button type="white-primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="openSelectDialog">资料库</el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <el-button type="primary" size="medium" round class="head-btn set-upload" @click="addExam">创建</el-button>
        <el-button round  @click="openSelectDialog" class="transparent-btn" size="white-medium">资料库</el-button>
        <el-button round class="transparent-btn" @click="deleteAll(null)" size="medium" :disabled="!selectChecked.length">批量删除</el-button>
        <VhallInput placeholder="请输入名称" v-model.trim="keyword"
          clearable
          @clear="initQueryList"
          class="search-query"
          @input="checkoutList"
          v-clearEmoij
          @keyup.enter.native="initQueryList">
          <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryList"></i>
        </VhallInput>
      </div>
      <!-- 有消息内容 -->
      <div class="list-table-panel">
        <!-- 表格与分页 -->
        <table-list
          ref="tableList"
          :manageTableData="resultVo.list||[]"
          :tabelColumnLabel="baseTableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="resultVo.total||0"
          :pageLimit=query.limit
          :needPagination=true
          maxHeight="100%"
          width="240"
          fixedBtn='right'
          @getTableList="getExamList"
          @onHandleBtnClick="onHandleBtnClick"
          @changeTableCheckbox="changeTableCheckbox"
        >
        </table-list>
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="resultVo && resultVo.total === 0"></null-page>
    </div>
  </div>
</template>

<script>
import NullPage from '../Error/nullPage.vue';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "ExamList",
  components: {
    NullPage
  },
  props: {
    // 查询层级
    pageLevel: {
      type: String,
      default: 'webinar' // webinar 活动层级；user 用户层级
    }
  },
  data() {
    return {
      vm: null,
      userId: JSON.parse(sessionOrLocal.get("userId")),
      /*--------------------列表部分参数定义--------------------*/
      loading: false,
      total: 0,
      isSearch: false, //是否是搜索
      selectChecked: [],
      keyword: '',
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
      resultVo: {
        total: 0,
        list: []
      },
      baseTableColumn: [
        {
          label: '名称',
          key: 'title',
          customTooltip: true,
          width: '240'
        },
        {
          label: '创建时间',
          key: 'created_at',
          width: '180'
        },
        {
          label: '更新时间',
          key: 'updated_at',
          width: '180'
        },
        {
          label: '总分',
          key: 'score',
          width: '120'
        },
        {
          label: '题数',
          key: 'topic_num',
          width: '120'
        },
        {
          label: '限时（分）',
          key: 'timer',
          width: '120'
        }
      ],
      tableRowBtnFun: [
        {name:'预览', methodName: 'preview'},
        {name:'复制', methodName: 'cope'} ,
        {name:'编辑', methodName: 'edit'},
        {name:'删除', methodName: 'del'}
      ],
      /*--------------------快速报名参数定义--------------------*/
      addUserVisible: false,
      /*--------------------导入用户参数定义--------------------*/
      importVisible: false
    };
  },
  computed: {
    isDefaultShow() {
      return this.resultVo && this.resultVo.total === 0 && this.keyword == ''
    }
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsList = this.$options.methods;
      methodsList[val.type](this, val);
    },
    clear(e) {
      e.stopPropagation()
    },
    checkoutList(newValue) {
      if(!newValue){
        this.initQueryList()
      }
    },
    // 预览
    preview(that, {rows}) {
      that.isShowQuestion = true;
      that.examId = rows.exam_id;
    },
    // 复制 - 单个快问快答
    cope(that, {rows}) {
      const params = {survey_id: rows.exam_id}
      if(this.alias){
        params.alias = this.alias
      }
      that.$fetch('copyExamById', params).then(res => {
        that.$message({
          message: res.code == 200 ? '复制成功' : '复制失败',
          showClose: true,
          type: res.code == 200 ? 'success' : 'error',
          customClass: 'zdy-info-box'
        });
        that.getTableList();
      })
    },
    // 编辑 - 单个快问快答
    edit(that, {rows}) {
      console.log('编辑', rows);
      that.$router.push({
        path: '/material/addExam',
        query: {
          examId: rows.exam_id,
          type: 1,
          alias: rows.alias,
        }
      });
    },
    // 删除 - 单条记录
    del(that, {rows}) {
      that.deleteConfirm(rows.exam_id, 2);
    },
    deleteConfirm(id, index) {
      this.$confirm(index == 1 ? '删除后，此题目将无法使用，确认删除？' : '删除后，此快问快答将无法使用，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.$fetch('deleteExam', {survey_ids: id}).then(res => {
            this.getTableList('search');
            this.$message({
              message: `删除成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
          }).catch(res => {
            this.$message({
              message: res.msg || '删除失败',
              showClose: true,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
        }).catch(() => {
          this.$message({
            message:  `已取消删除`,
            showClose: true,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
    },
    // 批量删除
    deleteAll(id) {
      if (this.selectChecked.length < 1) {
        this.$message({
          message: `请选择要操作的选项`,
          showClose: true,
          // duration: 0,
          type: 'warning',
          customClass: 'zdy-info-box'
        });
      } else {
        id = this.selectChecked.join(',');
        this.deleteConfirm(id, 1);
      }
    },
    // 选中
    changeTableCheckbox(val) {
      this.selectChecked = val.map(val => val.exam_id)
      console.log(this.selectChecked);
    },
    // 创建-快问快答
    addExam() {
      if (this.pageLevel == 'user') {
        this.$router.push({
          path: '/material/addExam',
          query: {type: 1}
        });
      } else {
        this.$router.push({path: '/live/addExam', query: {webinarId: this.$route.params.str, roomId: this.$route.query.roomId, type: 2}});
      }
    },
    closeClose(done){
      this.isShowQuestion = false;
    },
    // 获取列表数据
    getExamList(row) {
      this.loading = true;
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      this.isSearch = this.keyword ? true : false;
      let obj = Object.assign({}, {
        pos: this.query.pos,
        limit: this.query.limit
      }, this.pageLevel == 'webinar' ? {
          keyword: this.keyword,
          webinar_id:this.$route.params.str,
          room_id:this.$route.query.roomId
        } : {
          keyword: this.keyword
      });
      this.$fetch('getExamList', this.$params(obj)).then(res =>{
        this.loading = false;
        this.resultVo = res.data ?? {
          total: 0,
          list: []
        }
      }).catch(e=>{
        this.loading = false;
        console.log(e);
        this.resultVo = {
          total: 0,
          list: []
        }
      });
      // this.loading = false;
      // this.resultVo = {"msg":"操作成功！","code":200,"data":{"pos":0,"limit":10,"total":10,"list":[{"description":"问卷简介","alias":"11","webinar_id":237221962,"question_id":718358,"question_no":"WJ1584831762566090752","topic_num":1,"title":"a1","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:32","updated_at":"2022-10-25 16:58:32"},{"description":"","alias":"问卷","webinar_id":237221962,"question_id":718350,"question_no":"WJ1584831758220791808","topic_num":1,"title":"标题","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"","alias":"问卷t1","webinar_id":237221962,"question_id":718351,"question_no":"WJ1584831758795411456","topic_num":1,"title":"标题","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"问卷简介","alias":"啊","webinar_id":237221962,"question_id":718352,"question_no":"WJ1584831759281950720","topic_num":1,"title":"t-2","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题型001所有题","alias":"问卷","webinar_id":237221962,"question_id":718353,"question_no":"WJ1584831760309555200","topic_num":13,"title":"所有题型001","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"问卷简介","alias":"问卷","webinar_id":237221962,"question_id":718354,"question_no":"WJ1584831760783511552","topic_num":1,"title":"问卷标题","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"","alias":"aaa","webinar_id":237221962,"question_id":718355,"question_no":"WJ1584831761228107776","topic_num":1,"title":"标题ttt","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"","alias":"ttt","webinar_id":237221962,"question_id":718356,"question_no":"WJ1584831761664315392","topic_num":1,"title":"标题t","img_url":"","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"问卷简介","alias":"","webinar_id":237221962,"question_id":718357,"question_no":"WJ1584831762108911616","topic_num":1,"title":"问卷标题","img_url":"null","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:31","updated_at":"2022-10-25 16:58:31"},{"description":"","alias":"","webinar_id":237221962,"question_id":718349,"question_no":"WJ1584831757772001280","topic_num":1,"title":"标题","img_url":"","has_tpl":0,"playback_filling":1,"user_id":"16422680","app_id":"fd8d3653","publish":0,"is_public":0,"source_id":null,"created_at":"2022-10-25 16:58:30","updated_at":"2022-10-25 16:58:30"}]},"request_id":"815ab4d0-5447-11ed-99b9-cd8ac6028a26"}.data
    },
    initComp() {
      this.initQueryList();
    },
    initQueryList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      this.$nextTick(() => {
        if (this.$refs.tableList) {
          this.$refs.tableList.pageInfo.pageNum = 1;
          this.$refs.tableList.pageInfo.pos = 0;
        }
        this.getExamList();
      })
    },
    //文案提示问题
    messageInfo(message) {
      if (this.vm) {
        this.vm.close();
      }
      this.vm = this.$message({
        showClose: true,
        duration: 2000,
        message: message,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    // 打开资料库
    openSelectDialog() {},
  },
  mounted() {
    this.initComp();
  }
};
</script>
<style lang="less" scoped>
/* 列表样式-------------------------------------- */
.all-no-data {
  /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
  padding-top: 105px;
  /deep/.createActive {
    padding-bottom: 30px;
  }
  /deep/.btn-list .el-button {
    margin-right: 0;
  }
}
/deep/.all-yes-data {
  .data-list {
    .el-table {
      margin-bottom: 32px;
      .cell{
        line-height: 25px;
      }
    }
  }
}
/deep/.search-no-data {
  padding-top: 128px;
  .search {
    padding-bottom: 0;
  }
}
/deep/.list--search {
  margin-bottom: 20px;
  .el-input {
    width: 180px;
    float: right;
    .el-input__icon {
      line-height: 36px;
    }
    .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }

    .el-input__prefix {
      cursor: pointer;
    }
  }
  .el-select {
    width: 120px;
    .el-input {
      width: 120px;
    }
    float: right;
    margin-right: 12px;
    .el-input__inner {
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up{
      line-height: 36px;
    }
  }
}
.vmp-exam-list--search{
  margin-bottom: 20px;
  .el-select{
    float: right;
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    width: 220px;
    float: right;
    /deep/ .el-input__icon{
      line-height: 36px;
    }
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix{
      cursor: pointer;
    }
  }
  .search-input {
    /deep/.el-input__inner{
      border-radius: 18px;
      height: 36px;
      background: transparent;
      padding-right: 50px;
      &.el-date-editor--daterange {
        padding-right: 10px;
      }
    }
  }
}
.vmp-exam-list{
  /deep/.el-table {
    margin-bottom: 32px;
  }
  &.gray-theme {
    .all-no-data {
      /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
      padding-top: 137px;
    }
    .list-table-panel {
      background: #ffffff;
      padding: 24px 24px 40px 24px;
    }
    /deep/.search-no-data {
      padding-top: 60px;
      background: #FFFFFF;
      padding-bottom: 120px;
    }
  }
}
</style>
