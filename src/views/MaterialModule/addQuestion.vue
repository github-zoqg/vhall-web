<template>
  <div class="add-question">
    <pageTitle :pageTitle="`${title}问卷`">
      <div class="headBtnGroup">
        <el-button type="text" @click="openSet" class="name_set_button">修改「问卷」显示名称</el-button>
        <i class="iconfont-v3 saasicon_help_m" @click="showPreview"></i>
      </div>
    </pageTitle>
    <question
      ref="questions"
      :alias='alias'
    ></question>

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
          :placeholder="('请输入标记文字')"
          maxlength="8"
          v-clearEmoij
          show-word-limit
        ></VhallInput>
          <p class="setname_tip">可将名称修改为「投票」「报名」等，修改后用户观看直播时看到的是修改后的名称。</p>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" @click="saveNewName" round>确定</el-button>
          <el-button plain size="medium" @click="saveNewName" round>取消</el-button>
        </div>
      </div>
    </VhallDialog>
    <!-- 图列展示弹框 -->
    <VhallDialog
      title="提示"
      :visible.sync="dialogPreview"
      :modalClick="true"
      :show-close="false"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <img src="" alt="">
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import question from '@/components/Question/question'
export default {
  data(){
    return {
      alias: '',
      dialogNameSet: false,
      dialogPreview: false
    }
  },
  components: {
    PageTitle,
    question
  },
  name: 'addQuestion.vue',
  computed: {
    title() {
      if (this.$route.query.questionId) {
        return '编辑'
      } else {
        return '创建'
      }
    }
  },
  methods:{
    showPreview(){
      this.dialogPreview = true
      console.log('%c 展示例图','color:blue')
    },
    openSet(){
      this.dialogNameSet = true;
      this.alias = '';
      console.log('%c 打开别名设置弹框','color:blue')

    },
    saveNewName(){
      this.$route.query.alias = this.alias;
      this.dialogNameSet = false;
      console.log(this.$route.query)
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
    .name_set_button{
      margin-right: 8px;
      color: #3562FA;
    }
  }
  .setname_tip{
    margin-top: 10px;
  }

</style>
