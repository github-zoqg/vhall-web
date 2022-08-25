<template>
  <!-- 短链接弹出 -->
  <VhallDialog
    title="短链接"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    @close="closeDialog"
    width="380px">
    <el-form :model="form" ref="form" :rules="formRules">
      <el-form-item label="" prop="link">
        <VhallInput
          placeholder="请输入短链接"
          :maxlength="500"
          autocomplete="off"
          v-clearEmoij
          resize=none
          show-word-limit
          v-model="form.link"
          class="input-with-select"
          type="text"
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
        link: ''
      },
      formRules: {
        link: [
          { required: true, pattern: /([hH][tT][tT][pP]|[hH][tT][tT][pP][sS]):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入以http://或https://开头的链接' , trigger: 'blur'}
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
  inject: ['app'], // 卡片对象
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      this.$emit('close', {
        type: 'link',
        content: ''
      })
    },
    // 保存设置的长链接
    confirmSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$fetch('saveMsgLink', {
            webinar_id: this.$route.params.str,
            link: this.form.link
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                message:  `保存成功`,
                showClose: true, // 是否展示关闭按钮
                type: 'success', //  提示类型
                customClass: 'zdy-info-box' // 样式处理
              });
              this.$emit('close', {
                type: 'link',
                content: this.form.link
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
    this.form.link = this.app.info.link
  }
}
</script>

