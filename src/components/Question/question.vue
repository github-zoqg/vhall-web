<template>
  <div>
    <div id="settingBox" v-show="isCreate">
    </div>
    <div class="qs-preview-box-content cef-q-wrap" id="qs-preview-box-content" v-show="showPreview"></div>
  </div>
</template>
<script>
import {VHall_Questionnaire_Service, VHall_Questionnaire_Const} from '@/utils/questionnaire_service';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data() {
    return {
      questionInfo: {},
      showPreview: false,
      isCreate: false
    }
  },
  props: ['questionId'],
  created() {
    this.type = this.$route.query.type;
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getVideoAppid();
  },
  methods: {
    getVideoAppid() {
      this.$fetch('getPassId').then(res => {
        if (res.code == 200 && res.data) {
          this.questionInfo = res.data;
          this.initQuestionSDK();
        }
        console.log(this.questionInfo);
      })
    },
    preview (questionId) {
      this.showPreview = true;
      this.previewId = questionId;
      // this.previewDoc = doc;

      // document.getElementById('#qs-preview-box-content').innerHTML = '';
      this.$service.renderPagePC('#qs-preview-box-content', questionId);
      document.querySelector('#qs-preview-box-content .q-btns').style.display = 'none';
    },
    initQuestionSDK () {
      this.$service = new VHall_Questionnaire_Service({
        auth: {
          // paas的应用id,必填
          app_id: this.questionInfo.app_id,
          // paas的第三方用户id,必填
          third_party_user_id: this.questionInfo.third_party_user_id,
          // paas的授权token,必填
          access_token: this.questionInfo.access_token
        },
        // 是否开启消息提示，非必填,默认是true
        notify: true,
        isPreview: this.questionId ? true : false
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        // this.createQuestion(this.$route.query.questionId || this.questionId || '');
        // 预览
        if (this.questionId) {
          this.preview(this.questionId);
        } else {
          this.createQuestion(this.$route.query.questionId || '');
        }
      });
      this.$service.$on(VHall_Questionnaire_Const.EVENT.SUBMIT, (data) => {
          // this.submitQuestion(data);
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.CREATE, data => {
        // data  回答Id
        // naire_id  问卷Id
        console.log("55555511111111111111")
        if (this.type == 1) {
          // 资料库问卷创建
          this.materialQuestion(data.id, data.title, data.description);
        } else {
          this.liveMaterialQuestion(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        if (this.type == 1) {
          // 资料库问卷编辑
          this.materialEditQuestion(data.id, data.title, data.description);
        } else if (this.type == 2) {
          this.liveMaterialEditQuestion(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.ERROR, data => {
        console.log('问卷错误', data);
      });
    },
    createQuestion (id) {
      this.isCreate = true;
      document.querySelector('#settingBox').innerHTML = '';
      this.$service.renderPageEdit('#settingBox', id || '');
    },
    materialQuestion(id, title, description) {
      this.$fetch('createQuestion', {survey_id: id, title: title, description: description}).then(res => {
        this.$message.success('新建成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    materialEditQuestion(id, title, description) {
      this.$fetch('editQuestion', {survey_id: id, title: title, description: description}).then(res => {
        this.$message.success('编辑成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    liveMaterialQuestion(id, title, description) {
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
      }
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
    liveMaterialEditQuestion(id, title, description) {
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
      }
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
  }
}
</script>
