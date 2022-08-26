<template>
  <!-- 短链接弹出 -->
  <VhallDialog
    title="短信签名"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    @close="closeDialog"
    width="380px">
    <el-form :model="form" ref="form" :rules="formRules">
      <el-form-item label="" prop="sign">
        <VhallInput
          type="text"
          v-clearEmoij
          placeholder="请输入短信签名"
          :maxlength="15"
          autocomplete="off"
          show-word-limit
          v-model="form.sign"
          class="input-with-select"
        >
        </VhallInput>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-preventReClick @click="confirmSave" round size="medium">确定</el-button>
      <el-button @click="closeDialog" round size="medium">取消</el-button>
    </div>
  </VhallDialog>
</template>
<script>
export default {
  name: 'msgNotification',
  data() {
    return {
      dialogVisible: false,
      form: {
        sign: ''
      },
      formRules: {
        sign: [
          { required: true, message: '请输入文字内容' , trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      this.$emit('close', {
        type: 'sign',
        content: ''
      })
    },
    // 保存设置的长链接
    confirmSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$fetch('saveMsgSign', {
            webinar_id: this.$route.params.str,
            sign: this.form.sign
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                message:  `保存成功`,
                showClose: true, // 是否展示关闭按钮
                type: 'success', //  提示类型
                customClass: 'zdy-info-box' // 样式处理
              });
              this.$emit('close', {
                type: 'sign',
                content: this.form.sign
              })
            }
          }).catch(err => {
            this.$message({
              message:  `${err.msg || '保存失败'}`,
              showClose: true, // 是否展示关闭按钮
              type: 'error', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
          });
        }
      })
    }
  },
  created() {
    this.dialogVisible= this.visible
  }
}
</script>

