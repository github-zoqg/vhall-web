<template>
  <div class="add-question">
     <pageTitle :title="`${title}问卷`">
        <div class="headBtnGroup">
          <el-button round size="medium" @click="returnBack">返回</el-button>
        </div>
      </pageTitle>
      <div id="settingBox">
      </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: 'question',
  data() {
    return {
      rightComponent: 'fieldSet'
    };
  },
  components: {
    PageTitle,
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.questionId = this.$route.query.id || '';
    this.getVideoAppid();
    // this.initQuestion();
  },
  computed: {
    title() {
      return this.$route.query.id ? '编辑' : '新建';
    }
  },
  methods: {
    getVideoAppid() {
      this.$fetch('getPassId').then(res => {
        this.initQuestion(res.data.app_id, res.data.third_party_user_id, res.data.access_token);
      })
    },
    initQuestion(appId, userId, token) {
      let params = {};
      let service = new VHall_Questionnaire_Service({
        auth: {
          appId: appId, //paas的应用id,必填
          accountId: this.userId, //paas的第三方用户id,必填
          owner_id: userId,
          token: token, //paas的授权token,必填
        },
        isLoadElementCss: true,
        notify: true //是否开启消息提示，非必填,默认是true
      });
      service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        service.renderPageEdit("#settingBox", this.questionId);
        // this.service.renderPagePC("#settingBox"); //预览
      })
      service.$on(VHall_Questionnaire_Const.EVENT.SUBMIT, (data) => {
        console.log("提交成功", data);
        data.question_id = params.question_id;
      });
      service.$on(VHall_Questionnaire_Const.EVENT.CREATE, data => {
        params.survey_id = data.id;
        params.description = data.description;
        params.title = data.title;
        this.createQuest(params);
      })
      service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        params.survey_id = data.id;
        params.description = data.description;
        params.title = data.title;
        this.editQuest(params);
      })
      setTimeout(() => {
        let text = document.querySelector('.text');
        text.innerHTML = '';
      }, 1000);
    },
    createQuest(params) {
      this.$fetch('createQuestion', params).then(res => {
        this.$message.success('新建成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    editQuest(params) {
      this.$fetch('editQuestion', params).then(res => {
        this.$message.success('编辑成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    submitFinish(data) {
      console.log(data, '1111111111111');
    },
    returnBack() {
      this.$router.push({
        path: '/material/question'
      });
    }
  },
};
</script>

<style lang="less" scoped>
  /deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  #settingBox /deep/ .control-area {
    width: 185px;
      .el-button{
        border: 1px solid #FB3A32;
        color:#FB3A32;
      }
    .categroys{
      border-bottom: 1px dashed #FB3A32;
      &:last-child{
        border-bottom: 0;
      }
    }
  }
  #settingBox /deep/.create-wrap .save{
    .el-button{
      background: #FB3A32 !important;
      border: none;
    }
  }
  #settingBox /deep/.question-wrap.click{
    border: 1px solid #FB3A32;
  }
  #settingBox /deep/.show-text:hover{
    border-color:#FB3A32;
  }
  #settingBox /deep/.default-img{
    // img{
    //   background: url('../../common/images/avatar.jpg') no-repeat;
    //   z-index: 100;
    // }

  }
  .headBtnGroup{
    float: right;
  }

</style>
