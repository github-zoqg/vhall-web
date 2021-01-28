<template>
  <div class="add-question">
     <pageTitle :pageTitle="`${title}问卷`">
        <!-- <div class="headBtnGroup">
          <el-button round size="medium" @click="returnBack">返回</el-button>
        </div> -->
      </pageTitle>
        <question
          ref="questions"
        ></question>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import question from '@/components/Question/question'
export default {
  components: {
    PageTitle,
    question
  },
  computed: {
    title() {
      if (this.$route.query.questionId) {
        return '编辑'
      } else {
        return '创建'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add-question {
  // /deep/.com-input {
  //   /deep/.limit {
  //     top: 55%;
  //   }
  // }
}
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
  #settingBox /deep/.question-wrap.click{
    border: 1px solid #FB3A32;
  }
  #settingBox /deep/.show-text:hover{
    border-color:#FB3A32;
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
