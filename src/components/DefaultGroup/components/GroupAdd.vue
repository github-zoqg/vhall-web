<template>
  <!-- 新增分组弹窗 -->
  <div class="vmp-group-add">
    <el-dialog :visible="dialogVisible"
      @open="handlOpen"
      class="group-change"
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
import { debounce } from "@/utils/utils"
export default {
  name: 'VmpGroupAdd',
  data() {
    const validGroup = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入分组'));
      } else if ((value * 1 + this.groupList.length) > 50) {
        callback(new Error('超出分组上限50'));
      } else if (value < 1 || value > 50) {
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
        count: { required: true, validator: validGroup, trigger: 'change' }
      }
    };
  },
  props: {
    groupList: {
      type: Array,
      default: () => []
    },
    readyList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    placeholder() {
      const group = this.groupList.length
      return `最多新增${50 - group}组`;
    }
  },
  methods: {
    // 确定新增分组
    addGroup() {
      this.$refs.viewerForm.validate((valid) => {
        if (valid) {
          const arr = this.groupList.map(item => {
            return item.group_order_id
          });
          const allGroup = this.groupList.length + this.formInline.count
          let add = 0
          for (let i = 1; i <= allGroup; i++) {
            if (i && !arr.includes(i) && add < this.formInline.count) {
              this.readyList.push({
                group_order_id: i,
                audiences: []
              })
              add++
            }
          }
          this.handleClose()
        } else {
          console.log('新增分组校验错误');
        }
      })
    },
    handleSubmit() {
      debounce(async () => {
        await this.addGroup();
      }, 500)
    },
    /**
     * 打开弹框
     */
    handlOpen() {
      this.dialogVisible = true
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.dialogVisible = false;
      this.formInline.count = 1
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
