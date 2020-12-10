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
  computed: {
    title() {
      return this.$route.query.id ? '编辑' : '新建';
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.questionId = this.$route.query.id || '';
    console.log(this.questionId, '11111111111');
    this.getVideoAppid();
  },
  methods: {
    getVideoAppid() {
      this.$fetch('getAppid').then(res => {
        this.initQuestion(res.data.app_id, res.data.access_token);
      })
    },
    initQuestion(id, token) {
      console.log(id, token);
      let params = {
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId
      };
      let service = new VHall_Questionnaire_Service({
        auth: {
          appId: 'd317f559', //paas的应用id,必填
          accountId: this.userId, //paas的第三方用户id,必填
          token: 'vhall' //paas的授权token,必填
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
        // 新建问卷
        params.survey_id = data.id;
        let obj = Object.assign({}, params, data);
        console.log(obj, '1111111111111');
        // this.createQuest(obj);
      })
      // service.$on(VHall_Questionnaire_Const.EVENT.ADDQUESTION, data => {
      //   // params.question_id = data.question_id;
      //   console.log('新建问卷问题', data);
      // })
      service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        // 更新问卷
        params.survey_id = data.id;
        let obj = Object.assign({}, params, data);
        console.log(obj, '22222222222222');
        // this.editQuest(obj);
      })
      setTimeout(() => {
        let text = document.querySelector('.text');
        text.innerHTML = '';
      }, 1000);
    },
    createQuest(params) {
      this.$fetch('createLiveQuestion', params).then(res => {
        this.$message.success('新建成功');
         this.$router.push({
            path: '/live/question',
            query: {
              id: this.$route.query.webinarId,
              roomId: this.$route.query.roomId
            }
          });
      })
    },
    editQuest(params) {
      this.$fetch('editLiveQuestion', params).then(res => {
        this.$message.success('编辑成功');
         this.$router.push({
            path: '/live/question',
            query: {
              id: this.$route.query.webinarId,
              roomId: this.$route.query.roomId
            }
          });
      })
    },
    submitFinish(data) {
      console.log(data, '1111111111111');
    },
    returnBack() {
      this.$router.push({
        path: '/live/question'
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
  .headBtnGroup{
    float: right;
  }

</style>
