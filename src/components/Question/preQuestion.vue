<template>
 <div id="showQuestion" v-if="dialogVisible">
 </div>
  <!-- <VhallDialog
      title="问卷预览"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%">
      <div id="showQuestion"></div>
    </VhallDialog> -->
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';
export default {
  props: ['questionId'],
  data() {
    return {
      dialogVisible: false
    };
  },
  watch: {
    questionId() {
      if (this.questionId) {
        this.getVideoAppid();
      }
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
  },
  methods: {
    getVideoAppid() {
    this.$fetch('getPassId').then(res => {
      this.initQuestion(res.data.app_id, res.data.third_party_user_id, res.data.access_token);
    })
  },
    initQuestion(appId, userId, token) {
      let service = new VHall_Questionnaire_Service({
        auth: {
          appId: appId, //paas的应用id,必填
          accountId: this.userId, //paas的第三方用户id,必填
          owner_id: userId,
          token: token //paas的授权token,必填
        },
        isLoadElementCss: true,
        notify: true //是否开启消息提示，非必填,默认是true
      });
      if (window.sessionStorage.getItem("vhallyunFormAnswerDetail")) {
        window.sessionStorage.removeItem("vhallyunFormAnswerDetail");
      }
      service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        service.renderPagePC("#showQuestion", this.questionId, {
          isPreview: true,
          isPc: true
        }); //预览
      })
    }
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
