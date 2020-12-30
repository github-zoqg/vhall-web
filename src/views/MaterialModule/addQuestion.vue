<template>
  <div class="add-question">
     <pageTitle :title="`${title}问卷`">
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
        return '新增'
      }
    }
  }
}
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
