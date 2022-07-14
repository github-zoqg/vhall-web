<template>
  <div class="comp-add-user-form">
    <VhallDialog
      width="518px"
      :visible.sync="visible"
      title="快速报名"
      class="user-add-dialog"
      append-to-body>
      <!-- 一级表单 -->
      <el-button type="primary" round size="mini" class="add-btn" @click.prevent.stop="addItem"><i class="iconfont-v3 saasline-plus" @click.prevent="removeItem(item)"></i>添加</el-button>
      <el-table
        ref="addTable"
        :data="list"
        style="width: 100%"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        height="250"
        lazy>
        <el-table-column
          type="index"
          label="序号"
          width="70">
        </el-table-column>
        <el-table-column
          label="手机号"
          width="185">
          <template slot-scope="scope">
            <div :class="['table-item-column', {
              'error': scope.row.phone_error
            }]">
              <VhallInput v-model.trim="scope.row.phone" autocomplete="off" placeholder="请输入手机号" :maxlength="15" show-word-limit @blur="checkPhone(scope.row, scope.$index)"></VhallInput>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名">
          <template slot-scope="scope">
            <div :class="['table-item-column', {
              'error': scope.row.name_error
            }]">
              <VhallInput v-model.trim="scope.row.name" autocomplete="off" placeholder="请输入姓名" :maxlength="30" show-word-limit @blur="checkName(scope.row, scope.$index)"></VhallInput>
              <div class="table-item-btn" v-if="scope.$index !== 0">
                <i class="iconfont-v3 saasicon_delete" @click.prevent="removeItem(scope.$index)"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="saveAddUser" size="medium" round>确 定</el-button>
        <el-button @click="cancelAddUser" size="medium" round>取 消</el-button>
      </span>
    </VhallDialog>
  </div>
</template>
<script>
export default {
  name: "CompAddUserForm",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [
        {
          name: '',
          phone: '',
          name_error: false,
          phone_error: false
        }
      ]
    }
  },
  methods: {
    // 删除单条记录
    removeItem(index) {
      if (index !== -1) {
        this.list.splice(index, 1)
      }
    },
    // 添加单条记录
    addItem() {
      this.list.push( {
        name: '',
        phone: '',
        name_error: false,
        phone_error: false
      })
      // 滚动到table最后
      this.$nextTick(() => {
        this.$refs.addTable.bodyWrapper.scrollTop  =this.$refs.addTable.bodyWrapper.scrollHeight;
      })
    },
    // 验证手机号
    checkPhone(row, index) {},
    // 验证姓名
    checkName(row, index) {

    },
    // 取消快速报名
    cancelAddUser() {
      this.$emit('close')
    },
    // 保存 - 快速表单内容
    saveAddUser() {
    },
  },
  created() {},
  mounted() {}
}
</script>
<style scoped lang="less">
.user-add-dialog {
  .table-item-column {
    display: flex;
    align-items: center;
    justify-content: center;
    &.error {
      /deep/ input.el-input__inner,/deep/ input.el-input__inner:focus,/deep/ input.invalid,/deep/ input.invalid:focus {
        border-color: #FB3A32;
      }
    }
  }
  .table-item-btn {
    padding-left: 8px;
  }
}
.add-btn {
  margin-bottom: 16px;
  i.saasline-plus {
    margin-right: 6px;
    font-size: 12px;
  }
}
</style>

