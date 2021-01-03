<template>
  <div class="vh-chat-editorArea">
    <div class="input-box">
      <div class="label">
        欢迎短语
      </div>
      <div class="input-content">
        <el-input
          v-model="menuInfo.welcome_content"
        ></el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    menuInfo: {
      requred: false
    }
  },
  data() {
    return {
      welcome: ''
    }
  },

  methods: {
    textChange() {
    }
  }
}
</script>
<style lang="less" scoped>
  .vh-chat-editorArea{
    padding:20px;
    .label{
      display: inline-block;
      width: 60px;
      line-height: 40px;
      margin-right: 10px;
      font-size: 14px;
    }
    .input-content{
      display: inline-block;
      width: 350px;
      .el-input__inner{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding:0 12px;
        border-radius: 4px;
        border: 1px solid #CCCCCC;
      }
    }
  }
</style>
