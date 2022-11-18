<template>
  <!-- 选择小组弹窗 -->
  <div class="vmp-group-choose">
    <el-dialog
      :visible="dialogVisible"
      @open="handleOpen"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      width="400px"
      class="group-change"
      title="提示"
    >
      <el-form class="group-form" :rules="rules" ref="groupForm" :model="formInline">
        <el-form-item label="选择小组" prop="selectGroup" label-width="80px">
          <el-select v-model="formInline.selectGroup" style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.group_order_id"
              :label="item.groupName"
              :value="item.group_order_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <div slot="footer" class="vmp-group-ft">
        <el-button type="primary" size="medium" round @click="handleSubmit">确定</el-button>
        <el-button round size="medium" @click="handleClose">取消</el-button>
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
      readyList: {
        type: Array,
        default: () => []
      },
      //所有组合计是否超过最大值
      isMax: {
        type: Boolean,
        default: false
      },
      maxNumber: {
        type: Number,
        default: 2000
      },
      checkList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      const validGroup = (rule, value, callback) => {
        let _this = this;
        if (!value) {
          callback(new Error('请选择分组'));
        } else if (_this.currentGroupNumber(value) + _this.checkList.length > _this.maxNumber) {
          callback('该组人员已超上限，请选择其他小组');
        } else if (_this.isMax) {
          callback(new Error('分组人数超过上限'));
        } else {
          callback();
        }
      };
      return {
        dialogVisible: false,
        formInline: {
          selectGroup: ''
        },
        selectNum: 0, //选择更换的观众数量
        rules: {
          selectGroup: { required: true, validator: validGroup, trigger: 'blur' }
        }
      };
    },
    methods: {
      //当前分组观众数
      currentGroupNumber(group) {
        const filterList = this.readyList.filter(item => {
          return item.group_order_id == group;
        });
        return filterList[0]?.audiences.length;
      },
      // 确认换组
      handleSubmit() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            this.$emit('changeGroupComplete', this.formInline.selectGroup);
          }
        });
      },
      // 对话框打开时，设置可选小组
      handleOpen() {
        this.dialogVisible = true;
        this.formInline.selectGroup = '';
      },
      //关闭弹框
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
  }
  .group-form {
    .el-dialog__headerbtn .el-dialog__close {
      color: #666;
    }
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
  .group-change {
    .el-dialog {
      padding: 0 12px;
      .el-dialog__headerbtn {
        right: 32px;
      }
    }
    .el-dialog__body {
      padding: 14px 20px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #666;
    }
    .el-dialog {
      border-radius: 4px;
    }
    .el-input--suffix .el-input__inner {
      padding-left: 10px;
    }
    .el-input__suffix {
      right: 10px;
    }
  }
</style>
