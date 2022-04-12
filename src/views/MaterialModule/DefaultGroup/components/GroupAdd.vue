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
      <el-form class="add-form">
        <el-form-item label="新增"
          label-width="40px">
          <el-input :placeholder="placeholder"
            v-model.trim.number="count"
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
          @click="handleThrottleSubmit()">确定</el-button>
        <el-button :round="true"
          @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'VmpGroupAdd',
  data() {
    return {
      dialogVisible: false,
      count: 1
    };
  },
  beforeCreate() {
    //this.groupServer = useGroupServer();
  },
  computed: {
    placeholder() {
      return `最多新增${50}组`;
    }
  },
  mounted() {
    //this.handleThrottleSubmit = _.throttle(this.handleSubmit, 300, { trailing: false });
  },
  methods: {
    // 新增分组确定
    handleSubmit: async function() {
      const c = parseInt(this.count);
      if (isNaN(c) || c < 1) {
        this.$message.warning('参数错误');
        return false;
      }
      try {
        const result = await this.groupServer.groupCreate({
          number: c,
          way: 2
        });
        if (result && result.code === 200) {
          this.count = 1;
          this.handleClose();
        } else {
          this.$message.warning(result.msg || '新增分组失败');
        }
      } catch (ex) {
        this.$message.warning(ex.messge || '新增分组出现异常');
      }
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
