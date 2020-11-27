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
  name: "bindPhoneOrEmail.vue",
  data() {
    return {
      title: '',
      visible: false,
      vo: {
        dialog: 'phone',
        dialogIsEdit: false
      },
      form: {
        account: '', // 邮箱或者手机号
        code: '', // 验证码
      },
      formRules: {}
    };
  },
  methods: {
    initComp(vo) {
      console.log('当前是否展示！！！', vo);
      this.vo = vo;
      if(vo.dialogType === 'phone') {
        this.title = vo.dialogIsEdit ? '修改密保手机' : '关联手机号';
      }else if(vo.dialogType === 'email') {
        this.title = vo.dialogIsEdit ? '修改关联邮箱' : '关联邮箱';
      }
      this.visible = true;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__footer {
  text-align: center;
}
/deep/.el-button.dialog-btn {
  padding: 4px 24px!important;
}
</style>
