<template>
  <div class="comp-add-user-form">
    <VhallDialog
      width="518px"
      :visible.sync="visibleTemp"
      title="快速报名"
      class="user-add-dialog"
      v-if="visibleTemp"
      @close="cancelAddUser"
      append-to-body
    >
      <!-- 一级表单 -->
      <el-button
        type="primary"
        round
        size="mini"
        class="add-btn"
        v-preventReOneClick
        @click.prevent.stop="addItem"
      >
        <i class="iconfont-v3 saasline-plus"></i>
        添加
      </el-button>
      <el-table
        ref="addTable"
        :data="list"
        style="width: 100%"
        :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '40px' }"
        :cell-class-name="setLastCellStyle"
        height="244"
        lazy
      >
        <el-table-column
          type="index"
          label="序号"
          width="70"
          class-name="sort-column"
        ></el-table-column>
        <el-table-column label="手机号" width="185">
          <template slot-scope="scope">
            <div
              :class="[
                'table-item-column',
                {
                  error: scope.row.phone_error
                }
              ]"
            >
              <VhallInput
                v-model.trim="scope.row.phone"
                @input="handleInput(scope.row)"
                autocomplete="off"
                placeholder="请输入手机号"
                :maxlength="15"
                show-word-limit
              ></VhallInput>
            </div>
            <!-- {{scope.row.phone_error}} -->
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <div
              :class="[
                'table-item-column',
                {
                  error: scope.row.name_error
                }
              ]"
            >
              <VhallInput
                v-model.trim="scope.row.name"
                v-clearEmoij
                autocomplete="off"
                placeholder="请输入姓名"
                :maxlength="30"
                show-word-limit
              ></VhallInput>
              <div class="table-item-btn" v-if="scope.$index !== 0">
                <i
                  class="iconfont-v3 saasicon_delete"
                  @click.prevent="removeItem(scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <p class="add-user-notice">注：此报名通道会导致用户信息的不完整，手机号和姓名必填</p>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-preventReClick
          @click.prevent.stop="saveAddUser"
          size="medium"
          round
        >
          确 定
        </el-button>
        <el-button @click.prevent.stop="cancelAddUser" v-preventReClick size="medium" round>
          取 消
        </el-button>
      </span>
    </VhallDialog>
  </div>
</template>

<script>
  import regRule from '@/utils/reg-rule';

  export default {
    name: 'CompAddUserForm',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      // 活动ID 或者 专题ID，跟signUpPageType字段组合使用
      webinarOrSubjectId: {
        type: [Number, String],
        default: 0
      },
      // 报名表单类型：webinar--活动；subject--专题
      signUpPageType: {
        type: [Number, String],
        default: ''
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
            name_error: '',
            phone_error: ''
          }
        ]
      };
    },
    methods: {
      // 设置接口入参，是活动维度 还是 专题维度
      setParamsIdByRoute(params) {
        if (this.signUpPageType === 'webinar') {
          params.webinar_id = this.webinarOrSubjectId;
        } else if (this.signUpPageType === 'subject') {
          params.subject_id = this.webinarOrSubjectId;
        }
        return params;
      },
      setLastCellStyle({ row, column, rowIndex, columnIndex }) {
        return this.list && this.list.length <= 4 && columnIndex == 2 ? 'last-cell' : '';
      },
      // 输入限制，只能输入0-9数字
      handleInput(value) {
        if (value.phone.length == 0) {
          return;
        }
        const pattern = /^[0-9]*$/; // 正整数的正则表达式
        if (!pattern.test(value.phone)) {
          value.phone = '';
        }
      },
      // 删除单条记录
      removeItem(index) {
        if (index !== -1) {
          this.list.splice(index, 1);
        }
      },
      // 添加单条记录
      addItem() {
        this.list.push({
          name: '',
          phone: '',
          name_error: '',
          phone_error: ''
        });
        // 滚动到table最后
        this.$nextTick(() => {
          this.$refs.addTable.bodyWrapper.scrollTop = this.$refs.addTable.bodyWrapper.scrollHeight;
        });
      },
      // 校验单行
      checkItem(row, index) {
        this.checkPhone(row, index);
        this.checkName(row, index);
      },
      // 验证手机号
      checkPhone(row, index) {
        // console.log('当前手机号', row.phone)
        if (!row.phone) {
          row.phone_error = '请输入手机号';
        } else if (!regRule['mobile'].exec(row.phone)) {
          row.phone_error = '手机号格式有误';
        } else {
          // 判断当前是否存在重复数据
          row.phone_error = this.checkRepeatPhone(row);
        }
      },
      // 判断手机号是否重复
      checkRepeatPhone(row) {
        // 获取是否重复数据
        const phones = this.list.map(item => item.phone);
        let countPhones = phones.reduce(function (allPhone, phone) {
          if (phone in allPhone) {
            allPhone[phone]++;
          } else {
            allPhone[phone] = 1;
          }
          return allPhone;
        }, {});
        // console.log('当前是否具备重复数据', countPhones)
        if (countPhones[row.phone] > 1) {
          return '手机号重复';
        } else {
          return '';
        }
      },
      // 验证姓名
      checkName(row, index) {
        if (!row.name) {
          row.name_error = '请输入姓名';
        } else {
          row.name_error = '';
        }
      },
      // 取消快速报名
      cancelAddUser() {
        this.$emit('close', 'close');
      },
      //文案提示问题
      messageInfo(message, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: message,
          type: type ? type : 'warning'
        });
      },
      // 保存 - 快速表单内容
      saveAddUser() {
        // 输入框验证
        this.list.forEach(item => {
          this.checkItem(item);
        });
        // 判断数据未填写完成的
        let nullList = this.list.filter(item => item.name && item.phone);
        // console.log('当前空数组数据', nullList)
        if (nullList && nullList.length != this.list.length) {
          this.messageInfo('请填写后保存');
          return;
        }
        // 验证数据填写未通过的
        let error = this.list.filter(item => item.name_error || item.phone_error);
        if (error && error.length > 0) {
          this.messageInfo('手机号不能重复报名');
          return;
        }
        // 数据存储
        const saveData = this.list.map(item => {
          return {
            name: item.name,
            phone: item.phone
          };
        });
        let params = {
          import: JSON.stringify(saveData)
        };
        this.$fetch('userRegistrationAdd', this.setParamsIdByRoute(params))
          .then(resV => {
            if (resV && resV.code == 200 && resV.data) {
              this.messageInfo('保存成功', 'success');
              this.list = [];
              this.$emit('close', 'closeAndLoading');
            } else {
              this.renderErrorInfo(resV);
            }
          })
          .catch(resV => {
            this.renderErrorInfo(resV);
          });
      },
      // 快速报名保存 - 异常处理
      renderErrorInfo(resV) {
        if (resV.code == 512825) {
          this.messageInfo(resV.msg || '保存失败');
          const repeatPhones = resV.data.list.map(item => {
            return item.phone;
          });
          // 格式化错误提示
          this.list.map(item => {
            if (repeatPhones.includes(item.phone)) {
              item.phone_error = '手机号重复';
            } else {
              item.phone_error = '';
            }
          });
        } else {
          this.messageInfo(resV.msg || '保存失败', 'error');
        }
      }
    },
    created() {
      // 外层控制内层dialog是否开启
      this.visibleTemp = this.visible;
    },
    mounted() {}
  };
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
        /deep/ input.el-input__inner,
        /deep/ input.el-input__inner:focus,
        /deep/ input.invalid,
        /deep/ input.invalid:focus {
          border-color: #fb3a32;
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
    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
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
    /deep/.el-table .last-cell .cell {
      padding-left: 0;
      padding-right: 0;
    }
    /deep/.el-dialog__footer {
      padding: 16px 32px 24px 32px;
    }
    /deep/.el-table .sort-column .cell {
      padding-left: 16px;
    }
    /deep/.el-table__row:hover {
      background-color: #ffffff !important;
    }
    /deep/.el-table__body tr:hover > td {
      background-color: #ffffff !important;
    }
    /deep/.el-table__body tr:hover > td {
      background-color: #ffffff !important;
    }
    /deep/ button.el-button.add-btn.el-button--primary.el-button--mini.is-round {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #ffffff;
      margin-bottom: 12px;
      width: 78px;
      height: 36px;
    }
    /deep/.saasicon_delete {
      font-size: 18px;
    }
    /deep/.dialog-footer {
      button {
        width: 96px;
      }
    }
  }
  .add-btn {
    i.saasline-plus {
      margin-right: 6px;
      font-size: 12px;
    }
  }
</style>
