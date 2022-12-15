<template>
  <div class="vh-chat-editorArea">
    <div class="input-box">
      <div class="label">欢迎短语</div>
      <div class="input-content">
        <VhallInput
          v-model="menuInfo.welcome_content"
          v-clearEmoij
          :maxlength="15"
          autocomplete="off"
          show-word-limit
        ></VhallInput>
      </div>
    </div>

    <div class="chat-tips">
      <img src="./chat-tips@2x.png" alt="" />
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
      };
    },

    methods: {
      textChange() {}
    }
  };
</script>
<style lang="less" scoped>
  .vh-chat-editorArea {
    padding: 20px;
    .label {
      display: inline-block;
      width: 60px;
      line-height: 40px;
      margin-right: 10px;
      font-size: 14px;
    }
    .input-content {
      display: inline-block;
      width: 350px;
      .el-input__inner {
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 12px;
        border-radius: 4px;
        border: 1px solid #cccccc;
      }
    }
    .chat-tips {
      margin-top: 24px;
      img {
        max-width: 422px;
      }
    }
  }
</style>
