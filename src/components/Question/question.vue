<template>
  <div>
    <div id="settingBox" v-if="!questionId">
    </div>
    <div v-else>
      <div class="preview" v-loading="loading" element-loading-text="加载中" element-loading-background="rgba(255,255,255,.9)">
        <div class="qs-preview-box-content cef-q-wrap" id="qs-preview-box-content"></div>
      </div>
    </div>
    <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      :close-on-click-modal="false"
      :show-close="false"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <p>保存问卷同时共享至资料管理，便于其他活动使用？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="sureMaterialQuestion" round>确 定</el-button>
          <el-button size="medium"  @click="cancelMaterialQuestion"  round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';
export default {
  data() {
    return {
      questionInfo: {},
      questionDataInfo: {},
      showPreview: false,
      isCreate: true,
      $service: null,
      dialogTongVisible: false,
      sureChecked: true,
      isPrevent: true,
      loading: true,
    }
  },
  props: ['questionId','alias'],
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
        uploadUrl: process.env.VUE_APP_BASE_URL,
        isPreview: this.questionId ? true : false,
        nweName: 'nweName'
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        // this.createQuestion(this.$route.query.questionId || this.questionId || '');
        // 预览
        if (this.questionId) {
          this.preview(this.questionId);
          this.loading = false;
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
        this.questionDataInfo = data;
        if (this.type == 1) {
          // 资料库问卷创建
          this.materialQuestion(data.id, data.title, data.description);
        } else {
          if (!this.isPrevent) {
            return;
          }
          this.dialogTongVisible = true;
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        this.questionDataInfo = data;
        if (this.type == 1) {
          // 资料库问卷编辑
          this.materialEditQuestion(data.id, data.title, data.description);
        } {
          this.questionDataInfo = data;
          this.liveMaterialEditQuestion(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.ERROR, data => {
        console.log('问卷错误', data);
      });
    },
    sureMaterialQuestion() {
      if (this.sureChecked) {
        this.copeQuestion(this.questionDataInfo.id);
        this.$vhall_paas_port({
          k: 100339,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.query.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      } else {
        this.$vhall_paas_port({
          k: 100340,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.query.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.liveMaterialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
      }
    },
    cancelMaterialQuestion() {
      this.$vhall_paas_port({
        k: 100340,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.query.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.liveMaterialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
    },
    createQuestion (id) {
      this.isCreate = true;
      document.querySelector('#settingBox').innerHTML = '';
      this.$service.renderPageEdit('#settingBox', id || '');
    },
    copeQuestion(id) {
      const params = {survey_id: id}
      if(this.alias){
        params.alias = this.alias
      }
      this.$fetch('copyQuestion', params).then(res => {
        this.$message({
          message: res.code == 200 ? '同步成功' : '同步失败',
          showClose: true,
          type: res.code == 200 ? 'success' : 'error',
          customClass: 'zdy-info-box'
        });
      })
      this.liveMaterialQuestion(this.questionDataInfo.id, this.questionDataInfo.title, this.questionDataInfo.description);
    },
    materialQuestion(id, title, description) {
      let extension = JSON.parse(this.questionDataInfo.extension)
      let params = {
        survey_id: id,
        title: title,
        description: description,
        img_url: this.questionDataInfo.imgUrl,
        playback_filling: extension.playback_filling
      }
      if(this.alias){
        params.alias = this.alias
      }
      this.$fetch('createQuestion', params).then(res => {
        if (this.type == 1) {
          this.$vhall_paas_port({
            k: 100526,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
          this.$message({
            message: res.code == 200 ? '新建成功' : '新建失败',
            showClose: true,
            type: res.code == 200 ? 'success' : 'error',
            customClass: 'zdy-info-box'
          });
          this.$router.push({
            path: '/material/question',
          });
        }
      })
    },
    materialEditQuestion(id, title, description) {
      let extension = JSON.parse(this.questionDataInfo.extension)
      let params = {
        survey_id: id,
        title: title,
        description: description,
        img_url: this.questionDataInfo.imgUrl,
        playback_filling: extension.playback_filling
      }
      if(this.alias){
        params.alias = this.alias
      }
      this.$fetch('editQuestion', params).then(res => {
        this.$vhall_paas_port({
          k: 100527,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: res.code == 200 ? '编辑成功' : '编辑失败',
          showClose: true,
          type: res.code == 200 ? 'success' : 'error',
          customClass: 'zdy-info-box'
        });
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    liveMaterialQuestion(id, title, description) {
      let extension = JSON.parse(this.questionDataInfo.extension)
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
        img_url: this.questionDataInfo.imgUrl,
        playback_filling: extension.playback_filling,
        privacy_agreement: extension.openPrivacy ? 1: 0,
      }
      if(this.alias){
        params.alias = this.alias
      }
      this.questionDataInfo.detail.forEach(i=>{
        if(i.detail&&i.detail.format == 'phone'){
          params.phone_verification_switch = i.verification=='Y'? 1: 0
        }
      })
      this.$fetch('createLiveQuestion', params).then(res => {
        this.$vhall_paas_port({
          k: 100333,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.query.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: res.code == 200 ? '新建成功' : '新建失败',
          showClose: true,
          type: res.code == 200 ? 'success' : 'error',
          customClass: 'zdy-info-box'
        });
        this.setReportData()
        this.dialogTongVisible = false;
        this.$router.push({
          path: `/live/question/${this.$route.query.webinarId}`,
          query: {
            roomId: this.$route.query.roomId
          }
        });
      })
    },
    liveMaterialEditQuestion(id, title, description) {
      let extension = JSON.parse(this.questionDataInfo.extension)
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
        img_url: this.questionDataInfo.imgUrl,
        playback_filling: extension.playback_filling
      }
      if(this.alias){
        params.alias = this.alias
      }
      this.questionDataInfo.detail.forEach(i=>{
        if(i.detail&&i.detail.format == 'phone'){
          params.phone_verification_switch = i.verification=='Y'? 1: 0
        }
      })
      this.$fetch('editLiveQuestion', params).then(res => {
        this.$vhall_paas_port({
          k: 100334,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.query.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: res.code == 200 ? '编辑成功' : '编辑失败',
          showClose: true,
          type: res.code == 200 ? 'success' : 'error',
          customClass: 'zdy-info-box'
        });
        this.setReportData(id, title, description, this.questionDataInfo.detail)
         this.$router.push({
            path: `/live/question/${this.$route.query.webinarId}`,
            query: {
              roomId: this.$route.query.roomId
            }
          });
      })
    },
    setReportData() {
      const { id, title, description, detail, imgUrl } = this.questionDataInfo
      const playback_filling = JSON.parse(this.questionDataInfo.extension).playback_filling
      let userId = window.sessionStorage.getItem('userId')
      if (title !== '问卷标题') {
        this.$vhall_paas_port({
          k: 100343,
          data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
        })
      }
      if (description !== '问卷简介') {
        this.$vhall_paas_port({
          k: 100344,
          data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
        })
      }
      if (imgUrl) {
        this.$vhall_paas_port({
          k: 100345,
          data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
        })
      }
      this.$vhall_paas_port({
        k: playback_filling == 1 ? 100346 : 100347,
        data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
      })
      detail.map(item => {
        if (item.style === 'name') {
          this.$vhall_paas_port({
            k: 100348,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100349 : 100350,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'sex'){
          this.$vhall_paas_port({
            k: 100351,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100352 : 100353,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          let num = 0;
          item.detail.list.forEach(items => {
            if (items.isAdd) {
              num ++;
            }
          })
          if (num) {
            this.$vhall_paas_port({
              k: 100354,
              data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id, other: num}, ref_url: '', req_url: ''}
            })
          }
        }
        if (item.style === 'email'){
          this.$vhall_paas_port({
            k: 100355,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100356 : 100357,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'area'){
          this.$vhall_paas_port({
            k: 100358,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100359 : 100360,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'birthday'){
          this.$vhall_paas_port({
            k: 100367,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100368 : 100369,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'company'){
          this.$vhall_paas_port({
            k: 100361,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100362 : 100363,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'position'){
          this.$vhall_paas_port({
            k: 100364,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100365 : 100366,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'industry'){
          this.$vhall_paas_port({
            k: 100370,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100371 : 100372,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.style === 'education'){
          this.$vhall_paas_port({
            k: 100373,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100374 : 100375,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        // 单选题
        if (item.type === 'radio') {
          this.$vhall_paas_port({
            k: 100376,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'N' ? 100380 : 100379,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: 100377,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id, num: item.detail.list.length}, ref_url: '', req_url: ''}
          })
          let nums = 0;
          item.detail.list.forEach(items => {
            if (items.isAdd) {
              nums ++;
            }
          })
          if (nums > 0) {
            this.$vhall_paas_port({
              k: 100378,
              data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id, other: nums}, ref_url: '', req_url: ''}
            })
          }

        }
        if (item.type === 'checkbox') {
          this.$vhall_paas_port({
            k: 100381,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100384 : 100385,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: 100382,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id, num: item.detail.list.length}, ref_url: '', req_url: ''}
          })
          let len = 0;
          item.detail.list.forEach(items => {
            if (items.isAdd) {
              len ++;
            }
          })
          if (len > 0) {
            this.$vhall_paas_port({
              k: 100383,
              data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id, other: len}, ref_url: '', req_url: ''}
            })
          }
        }
        // 问答
        if (item.type === 'text' && item.style === 'text') {
          this.$vhall_paas_port({
            k: 100386,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.required === 'Y' ? 100387 : 100388,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
        if (item.type === 'remark') {
          this.$vhall_paas_port({
            k: 100389,
            data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {id: id}, ref_url: '', req_url: ''}
          })
        }
      })
    }
  }
}
</script>
<style lang="less" >
.__vuescroll  .__bar-is-vertical {
  background: #e0e0e0 !important;
}
  .qs-preview-box-content .cef-q-wrap{
    z-index: 3000;
  }
  .async__ctx {
    /deep/.el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #FB3A32;
    }
    /deep/.el-checkbox__inner:hover {
      border-color: #FB3A32;
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #FB3A32;
      border-color: #FB3A32;
    }
  }
  .sureQuestion{
    padding-bottom: 24px;
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
      /deep/.el-checkbox__inner:hover {
        border-color: #FB3A32;
      }
      /deep/.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FB3A32;
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
  .preview{
    min-height: 300px;
  }
</style>
