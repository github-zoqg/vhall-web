<template>
<div v-loading="loading">
   <div id="showQuestion">
      <question
        v-if="initQuestion"
        :userId="questionInfo.third_party_user_id"
        :accountId="userId"
        :questionType="'user'"
        :accessToken="questionInfo.access_token"
        :appId="questionInfo.app_id"
        :preQuestionId="questionInfo.questionId"
        ref="preQuestions"
      ></question>
   </div>
</div>
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';
import question from '@/tangram/libs/question/saas'; // 问卷
export default {
  props: ['questionId'],
  data() {
    return {
      loading: true,
      dialogVisible: false,
      userId: '',
      questionInfo: {},
      initQuestion: false
    };
  },
  components: {
    question
  },
  watch: {
    questionId() {
      if (this.questionId) {
        this.getVideoAppid();
      }
    }
  },
  created() {
    this.getVideoAppid();
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
  },
  methods: {
    getVideoAppid() {
      this.$fetch('getPassId').then(res => {
        if (res.code == 200 && res.data) {
          this.initQuestion = true
          this.questionInfo = res.data;
          console.log(this.$refs, '???????????????')
          this.questionInfo.questionId = this.questionId;
          this.loading = false;
          // this.$refs.preQuestions.showPreview = true;
          // this.$refs.preQuestions.preview(this.questionId);
        }
      })
    },
    // initQuestion(appId, userId, token) {
    //   let service = new VHall_Questionnaire_Service({
    //     auth: {
    //       appId: appId, //paas的应用id,必填
    //       accountId: this.userId, //paas的第三方用户id,必填
    //       owner_id: userId,
    //       token: token //paas的授权token,必填
    //     },
    //     isLoadElementCss: true,
    //     notify: true //是否开启消息提示，非必填,默认是true
    //   });
    //   if (window.sessionStorage.getItem("vhallyunFormAnswerDetail")) {
    //     window.sessionStorage.removeItem("vhallyunFormAnswerDetail");
    //   }
    //   service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
    //     service.renderPagePC("#showQuestion", this.questionId, {
    //       isPreview: true,
    //       isPc: true
    //     }); //预览
    //     this.loading = false;
    //   })
    // }
  }
};
</script>
<style lang="less" scoped>
#showQuestion /deep/ .line{
  background: #FB3A32;
}
#showQuestion /deep/ .h5-text i{
 color:#FB3A32;
}
#showQuestion /deep/ .el-button{
 background:#FB3A32;
}
  // #form-pc-preview /deep/.pc-preview{
  //  .line{
  //    background: #FB3A32;
  //  }
  //  .q-text.preview-pc /deep/ .h5-text i{
  //    color:#FB3A32;
  //  }
  //  .option-btn .el-button{
  //    background: #FB3A32;
  //  }
  // }
</style>
