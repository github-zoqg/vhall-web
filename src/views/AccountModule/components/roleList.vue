<template>
  <div class="role--list">
    <!-- 搜索 -->
    <div class="role--list--search">
      <el-button size="medium" type="primary" round @click.prevent.stop="addRole">创建角色</el-button>
      <el-button size="medium" round @click.prevent.stop="multiMsgDel">批量删除</el-button>
      <el-input placeholder="搜索角色名称" v-model.trim="role_name">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
    </div>
    <!-- 有消息内容 -->
    <div v-if="roleDao.total > 0">
      <!-- 表格与分页 -->
      <son-role-table
        class="son-role-table"
        ref="roleTab"
        :isHandle=true
        :isMultiCheck=true
        :manageTableData="roleDao.list"
        :tabelColumnLabel="roleTableColumn"
        :totalNum="roleDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=false
        @getTableList="getRoleList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </son-role-table>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else></null-page>
    <VhallDialog
      width="680px"
      :visible.sync="roleDialogVisible"
      :title="roleForm.executeType === 'edit' ? '编辑角色' : '创建角色'"
      append-to-body>
      <el-form :model="roleForm" ref="roleForm" :rules="roleFormRules" label-width="120px">
        <el-form-item label="角色名称：" prop="role_name">
          <el-input type="text" placeholder="请输入角色名称" v-model="roleForm.role_name" maxlength="15" show-word-limit />
        </el-form-item>
        <el-form-item label="备注信息：" prop="remark">
          <el-input type="text" placeholder="请输入备注信息" v-model="roleForm.remark" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="权限分配：">
          <div class="switch__box">
            <label class="leve3_title label__r12">直播管理：</label>
            <el-switch
              v-model="roleForm.permission_webinar"
              disabled
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
            >
            </el-switch>
            <span class="leve3_title title--999">允许创建、设置以及发起直播，默认权限不可取消</span>
          </div>
          <div class="switch__box">
            <label class="leve3_title label__r12">内容管理：</label>
            <el-switch
              v-model="roleForm.permission_content"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
            >
            </el-switch>
            <span class="leve3_title title--999">控制子账号是否可生成回放及管理内容</span>
          </div>
          <div class="switch__box">
            <label class="leve3_title label__r12">数据管理：</label>
            <el-switch
              v-model="roleForm.permission_data"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
            >
            </el-switch>
            <span class="leve3_title title--999">控制子账号是否可查看直播/点播的数据及信息</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="executeRoleSend" size="medium" round>确 定</el-button>
        <el-button @click="roleDialogVisible = false" size="medium" round>取 消</el-button>
      </span>
    </VhallDialog>
    <!-- 添加子账号 -->
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import SonRoleTable from '@/components/TableList/sonRoleTable.vue';
export default {
  name: "roleList.vue",
  components: {
    NullPage,
    SonRoleTable
  },
  data() {
    return {
      role_name: '',
      roleDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      roleTableColumn: [
        {
          label: '角色名称',
          key: 'role_name',
          width: 'auto'
        },
        {
          label: '关联账号',
          key: 'child_count',
          width: 200
        },
        {
          label: '备注',
          key: 'remark',
          width: 200
        }
      ],
      tableRowBtnFun: [
        {
          name: "编辑",
          methodName: 'roleEdit',
          hidePattern: 'is_default'
        },
        {
          name: "删除",
          methodName: 'roleDel',
          hidePattern: 'is_default'
        }
      ],
      ids: [],
      roleDialogVisible: false,
      roleForm: {
        id: null,
        name: null,
        type: 'add',
        role_name: '',
        remark: '',
        permission_webinar: 1, // 直播管理开关 1开 0关闭
        permission_content: 1, // 内容管理开关 1开 0关闭
        permission_data: 1 // 数据管理 1开 0关闭
      },
      roleFormRules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 批量选择
    checkMoreRow(val) {
      console.log(val);
      this.ids = val.map(item => {
        return item.account_id;
      });
    },
    // 批量删除
    multiMsgDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一种角色删除');
      } else {
        this.roleDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        });
      }
    },
    // 删除单条消息数据
    roleDel(that, { rows }) {
      that.$confirm('当前角色已绑定账号，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        that.$fetch('sonRoleDel', {
          ids: rows.id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.initComp();
          }else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message:  '删除失败'
          });
        });
      }).catch(() => {
      });
    },
    // 编辑子账号
    async roleEdit(that, { rows }) {
      that.roleDialogVisible = true;
      that.roleForm.executeType = 'edit';
      that.$fetch('sonRoleGet', {
        id: rows.id
      }).then(res =>{
        if (res && res.code === 200 && res.data) {
          that.roleForm = Object.assign(that.roleForm, res.data);
        } else {
          that.$message.error(res.msg || '获取角色信息失败');
        }
      }).catch( e =>{
        console.log(e);
        that.$message.error('获取角色信息失败');
      });
    },
    // 创建子账号
    addRole() {
      this.roleDialogVisible = true;
      this.roleForm.executeType = 'add';
      this.roleForm.id = null;
    },
    // 子账号信息新增 or 修改
    executeRoleSend() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.$fetch(this.roleForm.executeType === 'add' ? 'sonRoleAdd' : 'sonRoleEdit', this.roleForm).then(res =>{
            if (res && res.code === 200) {
              this.$message.success('操作成功');
              this.roleDialogVisible = false;
              this.initComp();
            } else {
              this.$message.error(res.msg || '操作失败');
            }
          }).catch( e =>{
            console.log(e);
            this.$message.error('操作失败');
          });
        }
      });
    },
    // 获取列表数据
    getRoleList() {
      this.$fetch('sonRoleList', this.$params({
        role_name: this.role_name,
        pos: 0,
        limit: 11
      })).then(res =>{
        this.roleDao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
      }).catch(e=>{
        console.log(e);
        this.roleDao = {
          total: 0,
          list: []
        };
      });
    },
    initComp() {
      this.getRoleList();
    }
  }
};
</script>
<style lang="less" scoped>
.role--list {
  .padding41-40();
}
.role--list--search{
  margin-bottom: 20px;
  .el-select{
    float: right;
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    width: 270px;
    float: right;
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
    }
    /deep/ .el-input__suffix{
      cursor: pointer;
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
  }
}
</style>
