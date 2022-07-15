<template>
  <div class="comp-add-user-form">
    <VhallDialog
      width="518px"
      :visible.sync="visibleTemp"
      title="快速报名"
      class="user-add-dialog"
      v-if="visibleTemp"
      @close="cancelAddUser"
      append-to-body>
      <!-- 一级表单 -->
      <el-button type="primary" round size="mini" class="add-btn" @click.prevent.stop="addItem"><i class="iconfont-v3 saasline-plus" @click.prevent="removeItem(item)"></i>添加</el-button>
      <el-table
        ref="addTable"
        :data="list"
        style="width: 100%"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'40px'}"
        height="244"
        lazy>
        <el-table-column
          type="index"
          label="序号"
          width="70"
          class-name="sort-column">
        </el-table-column>
        <el-table-column
          label="手机号"
          width="185">
          <template slot-scope="scope">
            <div :class="['table-item-column', {
              'error': scope.row.phone_error
            }]">
              <VhallInput v-model.trim="scope.row.phone" autocomplete="off" placeholder="请输入手机号" :maxlength="15" show-word-limit @blur="checkItem(scope.row, scope.$index)"></VhallInput>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名">
          <template slot-scope="scope">
            <div :class="['table-item-column', {
              'error': scope.row.name_error
            }]">
              <VhallInput v-model.trim="scope.row.name" autocomplete="off" placeholder="请输入姓名" :maxlength="30" show-word-limit @blur="checkItem(scope.row, scope.$index)"></VhallInput>
              <div class="table-item-btn" v-if="scope.$index !== 0">
                <i class="iconfont-v3 saasicon_delete" @click.prevent="removeItem(scope.$index)"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <p class="add-user-notice">注：此报名通道会导致用户信息的不完整，手机号和姓名必填</p>
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
    },
    // 活动ID
    webinar_id: {
      type: [Number, String],
      default: 0
    },
    // 专题ID
    subject_id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      visibleTemp: null,
      vm: null,
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
    // 校验单行
    checkItem(row, index) {
      this.checkPhone(row, index)
      this.checkName(row, index)
    },
    // 验证手机号
    checkPhone(row, index) {
      if (!row.phone) {
        row.phone_error = '请输入手机号'
      } else if (!/^[0-9]{1,15}$/.exec(row.phone)){
        row.phone_error = '手机号格式有误'
      } else {
        // 判断当前是否存在重复数据
        let phoneList = []
        this.list.map((item, index) => {
          // console.warn(item, phoneList)
          if (phoneList.includes(item.phone)) {
            item.phone_error = '手机号不能重复'
          } else {
            phoneList.push(item.phone)
            item.phone_error = ''
          }
        })
      }
    },
    // 验证姓名
    checkName(row, index) {
      if (!row.name) {
        row.name_error = '请输入姓名'
      } else {
        row.name_error = ''
      }
    },
    // 取消快速报名
    cancelAddUser() {
      this.$emit('close', 'close')
    },
    //文案提示问题
    messageInfo(message, type) {
      if (this.vm) {
        this.vm.close();
      }
      this.vm = this.$message({
        showClose: false,
        duration: 2000,
        message: message,
        type: type ? type : 'warning'
      });
    },
    // 保存 - 快速表单内容
    saveAddUser() {
      // 判断数据未填写完成的
      let nullList = this.list.filter(item => item.name && item.phone)
      if (nullList && nullList.length != this.list.length) {
        this.messageInfo('请填写后保存')
        return
      }
      // 验证数据填写未通过的
      let error = this.list.filter(item => item.name_error || item.phone_error)
      if (error && error.length > 0) {
        this.messageInfo('手机号不能重复报名')
        return
      }
      // 数据存储
      const saveData = this.list.map(item => {
        return {
          name: item.name,
          phone: item.phone
        }
      })
      let params = {
        import: JSON.stringify(saveData)
      }
      if (this.webinar_id) {
        params.webinar_id = this.webinar_id
      } else if (this.subject_id) {
        params.subject_id = this.subject_id // 跟活动ID传值，二选一
      }
      this.$fetch('userRegistrationAdd', params).then(resV => {
        if (resV && resV.code == 200 && resV.data) {
          this.messageInfo('保存成功', 'success')
          this.$emit('close', 'closeAndLoading')
        } else {
          this.messageInfo(resV.msg || '保存失败', 'error')
        }
      }).catch(resV => {
        this.messageInfo(resV.msg || '保存失败', 'error')
      });
    },
  },
  created() {
    // 外层控制内层dialog是否开启
    this.visibleTemp =  this.visible
  },
  mounted() {}
}
</script>
<style scoped lang="less">
/* 快速报名样式-------------------------------------- */
.user-add-dialog {
  // 滚动条的宽度
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
  }
  // 滚动条的滑块
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 3px;
    transition: all 0.3s;
    cursor: pointer;
    display: none;
    background-color: #cccccc;
    &:hover {
      background-color: #cccccc;
    }
    &:active {
      background-color: #cccccc;
    }
  }
  &:hover {
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
      display: block;
    }
  }
  /deep/.el-form-item {
    margin-bottom: 24px;
  }
  /deep/.el-dialog__footer {
    padding: 14px 32px 24px 32px;
  }
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
    i {
      color: #999999;
    }
  }
  .add-user-notice {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    padding-top: 14px;
  }
  /deep/.el-table__body-wrapper {
    padding-top: 6px;
  }
  /deep/.el-table td, /deep/.el-table th.is-leaf {
    border-bottom: 0;
  }
  /deep/.el-table td {
    padding: 6px 0;
  }
  /deep/.el-table th {
    padding: 10px 0;
  }
  /deep/.el-table .cell {
    padding-left: 0;
    padding-right: 12px;
  }
  /deep/.el-dialog__footer {
    padding: 16px 32px 24px 32px;
  }
  /deep/.el-table .sort-column .cell{
    padding-left: 16px;
  }
  /deep/.el-table__row:hover {
    background-color: #ffffff !important;
  }
  /deep/.el-table__body tr:hover>td {
    background-color: #ffffff !important;
  }
  /deep/.el-table__body tr:hover>td {
    background-color: #ffffff !important;
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

