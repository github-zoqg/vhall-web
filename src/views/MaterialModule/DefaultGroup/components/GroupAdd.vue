<template>
  <!-- 新增分组弹窗 -->
  <div class="vmp-group-add">
    <el-dialog :visible="dialogVisible"
      @open="handlOpen"
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="400px"
      title="新增分组">
      <el-form class="add-form"
        :rules="rules"
        :model="formInline"
        ref="viewerForm">
        <el-form-item label="新增"
          prop="count"
          label-width="50px">
          <el-input :placeholder="placeholder"
            v-model.trim.number="formInline.count"
            onkeyup="this.value=this.value.replace(/[^\d]/g,'')">
            <template slot="suffix">组</template>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer"
        class="vmp-group-ft">
        <el-button type="primary"
          :round="true"
          @click="handleSubmit">确定</el-button>
        <el-button :round="true"
          @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'VmpGroupAdd',
  data() {
    const validGroup = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入分组'));
      } else if (value && this.formInline.count > 50) {
        callback(new Error('分组人数超过上限'));
      } else if (value && (value < 1 || value > 50)) {
        callback(new Error('请输入1-50的小组编号'));
      } else {
        callback();
      }
    }
    return {
      dialogVisible: false,
      formInline: {
        count: 1
      },
      rules: {
        count: { required: true, validator: validGroup, trigger: 'blur' }
      }
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    placeholder() {
      const group = this.dataList.length - 1
      return `最多新增${50 - group}组`;
    }
  },
  methods: {
    // 新增分组确定
    handleSubmit() {
      this.$refs.viewerForm.validate((valid) => {
        if (valid) {
          const arrObj = {}
          this.dataList.forEach(item => {

          });
        } else {
          console.log('新增分组校验错误');
          return false;
        }
      });
    },
    handlOpen() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang="less">
.vmp-group-add {
  .el-dialog__body {
    min-height: 32px !important;
  }

  .add-form {
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__label {
        color: #1a1a1a;
        font-weight: 400;
      }
      .el-form-item__content {
        margin-left: 40px;

        .el-input__suffix-inner {
          color: #666;
          padding: 2px 8px;
        }
      }
    }
  }
}
</style>
