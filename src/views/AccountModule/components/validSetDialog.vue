<template>
  <VhallDialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="30%">
    <div class="content">
      <el-form :model="form" ref="form" :rules="formRules" label-width="120px">
        <el-form-item :label="vo.dialogType === 'email' ? '邮箱地址' : '手机号'" prop="account">
          <el-input v-model.trim="form.account" auto-complete="off" :placeholder="vo.dialogType === 'email' ? '请输入邮箱地址' : '请输入手机号'"/>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model.trim="form.code" auto-complete="off" placeholder="请输入验证码"/>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button class="dialog-btn" type="primary" round size="medium">下一步</el-button>
    </span>
  </VhallDialog>
</template>

<script>
export default {
  name: "validSetDialog.vue",
  data() {
    return {
      title: '',
      visible: false,
      validate: {
        type: 1, // 发送类型： 1手机；2邮箱
        data:
      }
    };
  }
};
</script>

<style scoped>

</style>
