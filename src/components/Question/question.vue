<template>
  <div>
    <div id="settingBox" v-show="isCreate">
    </div>
    <div class="qs-preview-box-content cef-q-wrap" id="qs-preview-box-content" v-show="showPreview">
    </div>
    <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="sureQuestion">
        <div class="textPrize">
          <p>确定保存当前问卷？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" v-preventReClick @click="sureMaterialPrize" round>确 定</el-button>
          <el-button size="medium"  @click="dialogTongVisible=false"  round>取 消</el-button>
       </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import {VHall_Questionnaire_Service, VHall_Questionnaire_Const} from '@/utils/questionnaire_service';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data() {
    return {
      questionInfo: {},
      questionDataInfo: {},
      showPreview: false,
      isCreate: false,
      $service: null,
      dialogTongVisible: false,
      sureChecked: true,
      isPrevent: true,
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
      this.$service.renderPagePC('#qs-preview-box-content', questionId);
      document.querySelector('#qs-preview-box-content .q-btns').style.display = 'none';
    },
    initQuestionSDK () {
      console.log(this.questionInfo, '?????????????')
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
        if (this.type == 1) {
          // 资料库问卷创建
          this.materialQuestion(data.id, data.title, data.description);
        } else {
          if (!this.isPrevent) {
            return;
          }
          this.dialogTongVisible = true;
          this.questionDataInfo = data;
          // this.sureMaterialPrize(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        if (this.type == 1) {
          // 资料库问卷编辑
          this.materialEditQuestion(data.id, data.title, data.description);
        } {
          this.liveMaterialEditQuestion(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.ERROR, data => {
        console.log('问卷错误', data);
      });
    },
    sureMaterialPrize() {
      if (this.sureChecked) {
        this.materialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
        this.liveMaterialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
      } else {
        this.liveMaterialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
      }
    },
    createQuestion (id) {
      this.isCreate = true;
      document.querySelector('#settingBox').innerHTML = '';
      this.$service.renderPageEdit('#settingBox', id || '');
    },
    materialQuestion(id, title, description) {
      this.$fetch('createQuestion', {survey_id: id, title: title, description: description}).then(res => {
        if (this.type == 1) {
          this.$message.success('新建成功');
          this.$router.push({
            path: '/material/question',
          });
        }
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
        this.dialogTongVisible = false;
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
<style lang="less">
  .qs-preview-box-content .cef-q-wrap{
    z-index: 3000;
  }
  .sureQuestion{
    padding-bottom: 16px;
    .textPrize{
      padding-left: 50px;
      p{
        font-size: 16px;
        color: #1A1A1A;
        padding-bottom: 15px;
      }
      /deep/.el-checkbox__label{
        color: #666;
      }
      /deep/.el-checkbox__input.is-checked+.el-checkbox__label{
        color: #666;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #FB3A32;
        border-color: #FB3A32;
      }
    }
    .dialog-footer{
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
