<template>
  <div class="add-question">
     <pageTitle title="新建问卷">
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
      rightComponent: 'fieldSet',
      questionArr: [],
      service: {},
      setOptions: {
        "基本信息": [
          {icon: 'saasicon_xingming', label: "姓名", name: 'name'},
          {icon: 'el-icon-male', label: "性别", name: 'gender'},
          {icon: 'el-icon-birthday', label: "生日", name: 'birthday'},
          {icon: 'el-icon-education', label: "教育水平", name: 'educational'},
          {icon: 'el-icon-message', label: "邮箱", name: 'email'},
          {icon: 'el-icon-location', label: "地域", name: 'regional'},
          {icon: 'el-icon-office-building', label: "公司", name: 'company'},
          {icon: 'el-icon-info', label: "职务", name: 'dust'},
          {icon: 'el-icon-info', label: "行业", name: 'industry'},
        ],
        "题目类型": [
          {icon: 'el-icon-user-solid', label: "单选题", type: 'radio'},
          {icon: 'el-icon-user-solid', label: "多选题", type: 'checkBox'},
          {icon: 'el-icon-tickets', label: "问答题", type: 'input'},
          {icon: 'el-icon-caret-bottom', label: "小结", type: 'inputs'},
        ]
      },
    };
  },
  components: {
    PageTitle,
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.questionId = this.$route.query.id || '';
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
      let params = {};
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
        // params.question_id = data.question_id;
        if (this.questionId) {
          this.editQuest();
        } else {
          this.createQuest(data.question_id);
        }

        console.log('新建问卷成功', data);
      })
      // service.$on(VHall_Questionnaire_Const.EVENT.ADDQUESTION, data => {
      //   // params.question_id = data.question_id;
      //   console.log('新建问卷问题', data);
      // })
      // service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
      //   // params.question_id = data.question_id;
      //   console.log('更新问卷成功', data);
      // })
      // let button = document.querySelector('.save .el-button');
      // button.addEventListener('click', (e) => {
      //   this.submitFinish('提交');
      // });
      setTimeout(() => {
        let text = document.querySelector('.text');
        text.innerHTML = '';
      }, 1000);
    },
    createQuest(id) {
      this.$fetch('createQuestion', {survey_id: id}).then(res => {
        console.log(res.data, "我是新增")
      })
    },
    editQuest() {
      this.$fetch('editQuestion', {survey_id: this.questionId}).then(res => {
        console.log(res.data, "我是编辑")
      })
    },
    submitFinish(data) {
      console.log(data, '1111111111111');
    },
    returnBack() {
      this.$router.push({
        path: `/${this.$route.meta.name}/question`
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
