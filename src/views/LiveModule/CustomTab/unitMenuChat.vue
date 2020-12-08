<template>
  <div>
    <el-form :model="form" ref="form" :rules="formRules" label-width="80px">
      <el-form-item label="欢迎短语" prop="welcome_content">
        <el-input v-model.trim="form.welcome_content" auto-complete="off" placeholder="请输入欢迎语（该文字将出现在聊天区）" :maxlength="15" show-word-limit/>
      </el-form-item>
    </el-form>
    <div class="panel-chat">
      <div class="unit-row chat-img">
        <img src="../../../common/images/custom-tab/que-chat-new.png">
      </div>
      <div class="unit-row chat-img">
        <img src="../../../common/images/custom-tab/private-chat-new.png">
      </div>
      <div class="unit-row que-img">
        <img src="../../../common/images/custom-tab/que01.png">
      </div>
      <div class="unit-row que-img">
        <img src="../../../common/images/custom-tab/que02.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "unitMenuChat.vue",
  components: {
  },
  data() {
    return {
      form: {
        welcome_content: ''
      },
      formRules: {}
    };
  },
  methods: {
  },
  watch: {
  }
};
</script>

<style lang="less" scoped>
.panel-chat {
  width: 100%;
  height: 567px;
  background: #F7F7F7;
  margin: 0 auto;
  text-align: center;
  padding: 24px 4px;
  text-align: center;
  img {
    width: 353px;
  }
}
.chat-img {
  display: block;
}
.que-img {
  display: none;
}
</style>
