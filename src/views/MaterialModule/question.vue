<template>
  <div class="question-wrap">
    <pageTitle pageTitle="问卷">
      <div slot="content">
        修改已收集数据的问卷，按照修改后的问卷重新统计，为确保
        <br />
        问卷统计结果不受影响，建议已推送的问卷需要修改时可以复制一份新的问卷
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button
        size="medium"
        type="primary"
        round
        class="length104 head-btn set-upload"
        v-preventReClick
        @click="addQuestion"
      >
        创建问卷
      </el-button>
      <el-button
        size="medium"
        round
        class="transparent-btn"
        @click="deleteAll(null)"
        :disabled="!selectChecked.length"
      >
        批量删除
      </el-button>
      <VhallInput
        class="search-tag"
        placeholder="请输入问卷名称"
        v-model="keyword"
        clearable
        v-clearEmoij
        @clear="searchTableList"
        @keyup.enter.native="searchTableList"
      >
        <i class="el-icon-search el-input__icon" slot="prefix" @click="searchTableList"></i>
      </VhallInput>
    </div>
    <div class="no-live" v-if="!total && !isSearch">
      <noData :nullType="'nullData'" :text="'您还没有问卷，快来创建吧！'">
        <el-button type="primary" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
      </noData>
    </div>
    <div class="question-list" v-show="total || isSearch">
      <table-list
        ref="tableList"
        :manageTableData="tableData"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :totalNum="total"
        @onHandleBtnClick="onHandleBtnClick"
        :width="180"
        @getTableList="getTableList"
        @changeTableCheckbox="changeTableCheckbox"
      ></table-list>
      <noData :nullType="'search'" v-if="!total"></noData>
    </div>
    <template v-if="isShowQuestion">
      <div class="show-question" @click="isShowQuestion = false">
        <div class="show-main" @click.stop="isShowQuestion = true">
          <span class="close-btn">
            <i class="el-icon-close" @click.stop="isShowQuestion = false"></i>
          </span>
          <vue-scroll>
            <div class="question_main">
              <pre-question :questionId="questionId"></pre-question>
              <div class="submit-footer">
                <el-button class="length152" type="primary" disabled size="medium" round>
                  提交
                </el-button>
              </div>
              <!-- 隐私协议合规（资料管理下） -->
              <!-- <privacy-select scene="question" compType="2"></privacy-select> -->
            </div>
          </vue-scroll>
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
  import PrivacySelect from '@/views/Login/components/privacy-select.vue';
  export default {
    name: 'question',
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
            customTooltip: true
          },
          {
            label: '更新时间',
            key: 'updated_at'
          },
          {
            label: '题目数量',
            key: 'topic_num'
          }
        ],
        tableRowBtnFun: [
          { name: '预览', methodName: 'preview' },
          { name: '复制', methodName: 'cope' },
          { name: '编辑', methodName: 'edit' },
          { name: '删除', methodName: 'del' }
        ],
        tableData: []
      };
    },
    components: {
      PageTitle,
      preQuestion,
      noData,
      PrivacySelect
    },
    mounted() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getTableList();
    },
    methods: {
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      clear(e) {
        console.log(e, '?????????????????');
        e.stopPropagation();
      },
      searchTableList() {
        if (this.keyword) {
          this.$vhall_paas_port({
            k: 100532,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.getTableList('search');
      },
      getTableList(params) {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let formParams = {
          user_id: this.userId,
          keyword: this.keyword
        };
        if (params == 'search') {
          pageInfo.pageNum = 1;
          pageInfo.pos = 0;
        }
        this.isSearch = this.keyword ? true : false;
        let obj = Object.assign({}, pageInfo, formParams);
        this.$fetch('getQuestionList', this.$params(obj)).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.list || [];
        });
      },
      // 预览
      preview(that, { rows }) {
        console.log('预览', rows);
        that.isShowQuestion = true;
        that.$vhall_paas_port({
          k: 100531,
          data: {
            business_uid: that.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        // document.querySelector('.section__main').style.minHeight = 640 + 'px'
        that.questionId = rows.question_id;
      },
      // 复制
      cope(that, { rows }) {
        const params = { survey_id: rows.question_id };
        if (this.alias) {
          params.alias = this.alias;
        }
        that.$fetch('copyQuestion', params).then(res => {
          that.$vhall_paas_port({
            k: 100528,
            data: {
              business_uid: that.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          that.$message({
            message: res.code == 200 ? '复制成功' : '复制失败',
            showClose: true,
            type: res.code == 200 ? 'success' : 'error',
            customClass: 'zdy-info-box'
          });
          that.getTableList();
        });
      },
      // 编辑
      edit(that, { rows }) {
        console.log('编辑', rows);
        that.$router.push({
          path: '/material/addQuestion',
          query: {
            questionId: rows.question_id,
            type: 1,
            alias: rows.alias
          }
        });
      },
      // 删除
      del(that, { rows }) {
        that.deleteConfirm(rows.question_id, 2);
      },
      deleteConfirm(id, index) {
        this.$confirm('删除后，此问卷将无法使用，确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.$fetch('deleteQuestion', { survey_ids: id })
              .then(res => {
                this.$vhall_paas_port({
                  k: index == 1 ? 100530 : 100529,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: '',
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                this.getTableList('search');
                this.$message({
                  message: `删除成功`,
                  showClose: true,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
              })
              .catch(res => {
                this.$message({
                  message: res.msg || '删除失败',
                  showClose: true,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          })
          .catch(() => {
            this.$message({
              message: `已取消删除`,
              showClose: true,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      deleteAll(id) {
        id = this.selectChecked.join(',');
        this.deleteConfirm(id, 1);
      },
      // 选中
      changeTableCheckbox(val) {
        this.selectChecked = val.map(val => val.question_id);
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
      closeClose(done) {
        this.isShowQuestion = false;
      }
    }
  };
</script>
<style lang="less" scoped>
  .question-list {
    width: 100%;
    height: 100%;
    .layout--right--main();
    .padding-table-list();
    .min-height();
    /deep/.el-button .el-button--default .el-button--small .el-button--primary {
      margin-right: 20px;
    }
  }

  .question-wrap {
    height: 100%;
    width: 100%;
    // /deep/.el-card__body{
    //   width: 100%;
    //   padding: 32px 24px;
    // }
    .head-operat {
      margin-bottom: 20px;
      .head-btn {
        display: inline-block;
      }
      /* .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
    } */
      .search-tag {
        float: right;
        width: 220px;
        /deep/ .el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          line-height: 36px;
          padding-right: 30px !important;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
        }
      }
    }
    .show-question {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      .show-main {
        // position: absolute;
        // top: 48%;
        // left: 50%;
        // background: #fff;
        // transform: translate(-50%, -50%);
        // width: 760px;
        // padding-bottom: 24px;
        // // padding: 0 32px 24px 32px;
        // border-radius: 4px;
        // overflow-y: auto;
        height: 90%;
        border-radius: 4px;
        background: #fff;
        position: relative;
        z-index: 101;
        .question_main {
          // max-height: 550px;
          position: relative;
          width: 760px;
          padding-bottom: 24px;
        }
        .close-btn {
          z-index: 100;
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          padding: 5px;
        }
        i {
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .submit-footer {
          text-align: center;
          padding-top: 20px;
        }
      }
    }
  }
</style>
