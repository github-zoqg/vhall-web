<template>
  <div class="question-wrap">
    <pageTitle pageTitle="问卷">
      <div slot="content">
        修改已收集数据的问卷，按照修改后的问卷重新统计，为确保问卷统<br>
        计结果不受影响，建议已推送的问卷需要修改时可以复制一份新的问卷
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button type="primary" size="medium" round class="head-btn set-upload" @click="addQuestion">创建问卷</el-button>
      <el-button round  @click="dataBase" class="transparent-btn" size="white-medium">资料库</el-button>
      <el-button round class="transparent-btn" @click="deleteAll(null)" size="medium" :disabled="!selectChecked.length">批量删除</el-button>
      <div class="inputKey">
        <VhallInput v-model="keyword" v-clearEmoij placeholder="请输入问卷名称"  @keyup.enter.native="searchTableList" maxlength="50" @clear="searchTableList" clearable>
          <i slot="prefix" class="el-icon-search el-input__icon" @click="searchTableList" style="cursor: pointer; line-height: 36px;"></i>
        </VhallInput>
      </div>
    </div>
    <div class="question-list" v-show="total || isSearch">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" :width="180" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
      <noData :nullType="'search'" v-if="!total"></noData>
    </div>
    <div class="no-live" v-show="!total && !isSearch">
      <noData :nullType="'nullData'" :text="'您还没有问卷，快来创建吧！'">
        <el-button type="primary" round @click="addQuestion" v-preventReClick>创建问卷</el-button>
        <el-button size="white-primary" class="transparent-btn" round @click="dataBase" v-preventReClick>资料库</el-button>
      </noData>
    </div>
    <template v-if="isShowQuestion">
      <div class="show-question" @click="isShowQuestion = false">
        <div class="show-main" @click.stop="isShowQuestion=true">
          <span class="close-btn"><i class="el-icon-close" @click.stop="isShowQuestion=false"></i></span>
          <vue-scroll>
            <div class="question_main">
              <pre-question  :questionId="questionId"></pre-question>
              <div class="submit-footer">
                <el-button class="length152" type="primary" disabled size="medium" round>提交</el-button>
              </div>
              <!-- 隐私协议合规（活动下） -->
              <!-- <privacy-select scene="question" compType="2"></privacy-select> -->
            </div>
          </vue-scroll>
        </div>
      </div>
    </template>
    <base-question ref="dataBase" @getTableList="getTableList"></base-question>
    <begin-play :webinarId="$route.params.str"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import preQuestion from '@/components/Question/preQuestion';
import baseQuestion from './components/questionBase';
import noData from '@/views/PlatformModule/Error/nullPage';
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
import PrivacySelect from '@/views/Login/components/privacy-select.vue';
export default {
  name: "question",
  data() {
    return {
      total: 0,
      isSearch: false, //是否是搜索
      selectChecked: [],
      keyword: '',
      userId: JSON.parse(sessionOrLocal.get("userId")),
      loading: true,
      isShowQuestion: false,
      questionId: '',
      tabelColumn: [
        {
          label: '问卷名称',
          key: 'title',
          customTooltip: true
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
    noData,
    beginPlay,
    PrivacySelect
  },
  created() {
    this.webinarId = this.$route.params.str;
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    searchTableList() {
      if (this.keyword) {
        this.$vhall_paas_port({
          k: 100342,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.getTableList('search')
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = {
        webinar_id: this.webinarId,
        room_id: this.$route.query.roomId,
        keyword: this.keyword
      }
      if (params == 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
      }
      this.isSearch = this.keyword ? true : false;
      let obj = Object.assign({}, pageInfo, formParams);
      this.$fetch('getLiveQuestionList', this.$params(obj)).then(res => {
        this.tableData = res.data.list || [];
        this.total = res.data.total;
      })
    },
    // 预览
    preview(that, {rows}) {
      console.log('预览', rows);
      that.$vhall_paas_port({
        k: 100341,
        data: {business_uid: that.userId, user_id: '', webinar_id: that.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      that.isShowQuestion = true;
      that.questionId = rows.question_id;
    },
    // 复制
    cope(that, {rows}) {
      that.$vhall_paas_port({
        k: 100336,
        data: {business_uid: that.userId, user_id: '', webinar_id: that.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      let params = {
        survey_id: rows.question_id,
        webinar_id: that.$route.params.str,
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
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          that.$router.push({
            path: '/live/addQuestion',
            query: {
                questionId: rows.question_id,
                alias: rows.alias,
                webinarId: that.webinarId,
                roomId: that.$route.query.roomId,
                type: 2
              }
            }
          );
        }).catch(() => {
          this.$message({
            message: `已取消修改`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
      } else {
        that.$router.push({
          path: '/live/addQuestion',
          query: {
              questionId: rows.question_id,
              alias: rows.alias,
              webinarId: that.webinarId,
              roomId: that.$route.query.roomId,
              type: 2
            }
          }
        );
      }
    },
    // 删除
    del(that, {rows}) {
      that.deleteConfirm(rows.question_id, 2);
    },
    deleteConfirm(id, index) {
      this.$confirm('删除后，此问卷将无法使用，确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.$fetch('deleteLiveQuestion', {survey_ids: id, webinar_id: this.webinarId}).then(res => {
            this.$vhall_paas_port({
              k: index === 1 ? 100338 : 100337,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            if (res.code == 200) {
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.getTableList('search');
            }
          }).catch(res => {
            this.$message({
              message: res.msg || '删除失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
        }).catch(() => {
          this.$message({
            message:  `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
    },
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
      this.selectChecked = val.map(val => val.question_id)
      console.log(this.selectChecked);
    },
    addQuestion() {
      this.$router.push({
        path: '/live/addQuestion', query: {webinarId: this.webinarId, roomId: this.$route.query.roomId, type: 2}});
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
  .bg-button{
    /deep/button.el-button.el-button--medium{
      background: transparent;
    }
  }

  // /deep/.el-dialog__wrapper {
  //   z-index: 2001 !important;
  // }
  // /deep/.v-modal{
  //   z-index: 2000 !important;
  // }
  // .el-select-dropdown .el-popper{
  //   z-index: 2003 !important;
  // }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        line-height: 36px;
        padding-right: 30px!important;
      }
      /deep/.el-input__prefix{
        cursor: pointer;
      }
    }
  }
  .show-question{
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
    .show-main{
      height: 90%;
      border-radius: 4px;
      background: #fff;
      position: relative;
      z-index: 101;
      .question_main{
        // max-height: 550px;
        position: relative;
        width: 760px;
        padding-bottom: 24px;
      }
      .close-btn{
        z-index: 100;
        position: absolute;
        top:16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        padding: 5px;
      }
      i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
      }
      .submit-footer{
        text-align: center;
        padding-top: 20px;
      }
    }
  }
}
</style>
