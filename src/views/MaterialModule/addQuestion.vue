<template>
  <div class="add-question">
     <pageTitle :title="`${title}问卷`">
        <div class="headBtnGroup">
          <el-button round size="medium" @click="returnBack">返回</el-button>
        </div>
      </pageTitle>
      <div id="settingBox">
        <question
          v-if="initQuestion"
          :userId="questionInfo.third_party_user_id"
          :accountId="userId"
          :questionType="'user'"
          :accessToken="questionInfo.access_token"
          :appId="questionInfo.app_id"
          @onCloses="closeQuestion"
          ref="questions"
        ></question>
      </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
import question from '@/tangram/libs/question/saas'; // 问卷
export default {
  name: 'addQuestionMgr',
  data() {
    return {
      rightComponent: 'fieldSet',
      userId: '',
      questionInfo: {},
      initQuestion: false
    };
  },
  components: {
    PageTitle,
    question
  },
  created() {
    console.log(99999)
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.questionId = this.$route.query.id || '';
    this.getVideoAppid();
  },
  computed: {
    title() {
      return this.$route.query.id ? '编辑' : '新建';
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        let a = this.$refs.questions.$service
        console.log(10000000 ,a)
      }, 5000)
    })
    // this.$refs.questions.createQuestion(this.$route.query.id);
    // this.$nextTick(() => {
    //   // this.createQuestion(this.$route.query.id);
    //   this.$refs.questions.createQuestion(this.$route.query.id);
    // })
  },
  methods: {
    getVideoAppid() {
      this.$fetch('getPassId').then(res => {
        if (res.code == 200 && res.data) {
          this.initQuestion = true
          this.questionInfo = res.data;
        }
        console.log(this.questionInfo);
      })
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
    // 关闭问卷
    closeQuestion (msg) {
      // console.log(12)
      // this.showQA = false;
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
