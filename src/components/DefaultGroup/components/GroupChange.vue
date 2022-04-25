<template>
  <!-- 选择小组弹窗 -->
  <div class="vmp-group-choose">
    <el-dialog :visible="dialogVisible"
      @open="handleOpen"
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="400px"
      title="提示">
      <el-form class="group-form"
        :rules="rules"
        ref="groupForm"
        :model="formInline">
        <el-form-item label="选择小组"
          prop="selectGroup"
          label-width="80px">
          <el-select v-model="formInline.selectGroup"
            style="width: 100%"
            placeholder="请选择">
            <el-option v-for="item in groupList"
              :key="item.group_order_id"
              :label="item.groupName"
              :value="item.group_order_id"></el-option>
          </el-select>
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
//import { useGroupServer } from 'middle-domain';
export default {
  name: 'VmpGroupChoose',
  props: {
    groupList: {
      type: Array,
      default: () => []
    },
    isMax: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validGroup = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择分组'));
      } else if (this.isMax) {
        callback(new Error('超出分组上限50'));
      } else {
        callback();
      }
    }
    return {
      dialogVisible: false,
      formInline: {
        selectGroup: '',
      },
      rules: {
        selectGroup: { required: true, validator: validGroup, trigger: 'blur' }
      }
    };
  },
  methods: {
    // 确认换组
    handleSubmit() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          this.$emit('changeGroupComplete', this.formInline.selectGroup);
        }
      })
    },
    // 对话框打开时，设置可选小组
    handleOpen() {
      this.dialogVisible = true
      this.formInline.selectGroup = ''
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.dialogVisible = false;
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang="less">
.vmp-group-choose {
  .el-dialog__body {
    min-height: 32px !important;
  }

  .group-form {
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__label {
        color: #1a1a1a;
        font-weight: 400;
      }
      .el-form-item__content {
        margin-left: 70px;
      }
    }
  }
}
</style>
