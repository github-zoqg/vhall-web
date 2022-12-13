<template>
  <div class="add-question">
    <!-- 头部标题 -->
    <pageTitle :pageTitle="`${title}问卷`">
      <div class="headBtnGroup">
        <el-button type="text" @click="openSet" class="name_set_button">
          修改「问卷」显示名称
        </el-button>
        <i class="iconfont-v3 saasicon_help_m" @click="showPreview"></i>
      </div>
    </pageTitle>
    <!-- 问卷组件 -->
    <question ref="questions" :alias="alias"></question>

    <!-- 别名设置弹框 -->
    <VhallDialog
      title="提示"
      :visible.sync="dialogNameSet"
      :close-on-click-modal="false"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <VhallInput
            v-model="alias"
            :placeholder="'请输入名称'"
            maxlength="8"
            v-clearEmoij
            show-word-limit
          ></VhallInput>
          <p class="setname_tip">
            可将名称修改为「投票」「报名」等，修改后用户观看直播时看到的是修改后的名称。
          </p>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" @click="saveNewName" round>保存</el-button>
          <el-button plain size="medium" @click="saveNewName('cancel')" round>取消</el-button>
        </div>
      </div>
    </VhallDialog>
    <!-- 图列展示弹框 -->
    <VhallDialog
      :visible.sync="dialogPreview"
      :modalClick="true"
      :show-close="true"
      class="zdy-dialog"
      width="740px"
    >
      <div class="img_base">
        <img src="../images/Q_preview.png" alt="" />
      </div>
    </VhallDialog>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import question from '@/components/Question/question';
  export default {
    data() {
      return {
        alias: '',
        dialogNameSet: false,
        dialogPreview: false
      };
    },
    components: {
      PageTitle,
      question
    },
    computed: {
      title() {
        if (this.$route.query.questionId) {
          return '编辑';
        } else {
          return '创建';
        }
      }
    },
    methods: {
      showPreview() {
        this.dialogPreview = true;
        console.log('%c 展示例图', 'color:blue');
      },
      openSet() {
        this.dialogNameSet = true;
        this.alias = this.alias || this.$route.query.alias || '问卷';
        console.log('%c 打开别名设置弹框', 'color:blue');
      },
      saveNewName(data) {
        this.dialogNameSet = false;
        if (data == 'cancel') {
          this.alias = this.$route.query.alias || '问卷';
        }
        console.log(this.$route.query);
      }
    }
  };
</script>
<style lang="less" scoped>
  /deep/ .el-switch__label--right,
  /deep/ .el-switch__label--left {
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  #settingBox /deep/ .control-area {
    width: 185px;
    .el-button {
      border: 1px solid #fb3a32;
      color: #fb3a32;
    }
    .categroys {
      border-bottom: 1px dashed #fb3a32;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  #settingBox /deep/.question-wrap.click {
    border: 1px solid #fb3a32;
  }
  #settingBox /deep/.show-text:hover {
    border-color: #fb3a32;
  }
  #settingBox /deep/.create-wrap .save {
    .el-button {
      background: #fb3a32 !important;
      border: none;
    }
  }
  .headBtnGroup {
    float: right;
    .name_set_button {
      margin-right: 8px;
      color: #3562fa;
    }
  }
</style>
<style lang="less">
  .add-question .zdy-dialog {
    .el-dialog {
      background: transparent;
      box-shadow: none;
    }
    .el-dialog__header {
      list-style: none;
      background: transparent;
      padding: 0;
      height: 48px;
    }
    .el-dialog__body {
      height: 0px;
      padding: 0;
    }
    .el-dialog__headerbtn {
      right: 0px;
      top: 24px;
      .el-dialog__close {
        color: white;
      }
    }
    .img_base {
      padding: 4px;
      border-radius: 4px;
      background: #000;
      img {
        width: 100%;
      }
    }
  }
  .setname_tip {
    margin-top: 10px;
    color: #666 !important;
  }
</style>
