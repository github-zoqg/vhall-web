<template>
  <div class="add-question">
     <pageTitle :title="`${title}问卷`">
        <!-- <div class="headBtnGroup">
          <el-button round size="medium" @click="returnBack">返回</el-button>
        </div> -->
      </pageTitle>
      <div id="settingBox">
        <!-- <question
          v-if="initQuestion"
          :userId="questionInfo.third_party_user_id"
          :accountId="userId"
          :questionType="'user'"
          :accessToken="questionInfo.access_token"
          :appId="questionInfo.app_id"
          @onCloses="closeQuestion"
          ref="questions"
        ></question> -->
      </div>
  </div>
</template>

<script src="./question.js"></script>

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
