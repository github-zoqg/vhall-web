<template>
  <div class="role--list"  v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)">
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="roleDao && roleDao.total === 0  && role_name === ''">
      <null-page nullType="nullData" text="暂未创建角色" :height="0">
        <el-button type="primary" round v-preventReClick @click.prevent.stop="addRole">创建角色</el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="role--list--search">
        <el-button size="medium" type="primary" round @click.prevent.stop="addRole">创建角色</el-button>
        <el-button size="medium" round @click.prevent.stop="multiMsgDel" :disabled="!(this.ids && this.ids.length > 0)">批量删除</el-button>
        <el-input placeholder="搜索角色名称" v-model.trim="role_name"
                  clearable
                  @clear="initQuerySonList"
                  class="search-query"
                  @keyup.enter.native="initQuerySonList">
          <i class="el-icon-search el-input__icon" slot="suffix" @click="initQuerySonList"></i>
        </el-input>
      </div>
      <!-- 有消息内容 -->
      <div>
        <!-- 表格与分页 -->
        <table-list
          ref="roleTab"
          :isHandle=true
          :manageTableData="roleDao.list"
          :tabelColumnLabel="roleTableColumn"
          :totalNum="roleDao.total"
          :tableRowBtnFun="tableRowBtnFun"
          :needPagination=true
          width="114px"
          max-height="auto"
          scene="roleList"
          @getTableList="getRoleList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
        >
        </table-list>
        <!-- <son-role-table
          class="son-role-table"
          ref="roleTab"
          :isHandle=true
          :isCheckout=true
          :checkoutKey="'child_count'"
          :manageTableData="roleDao.list"
          :tabelColumnLabel="roleTableColumn"
          :totalNum="roleDao.total"
          :tableRowBtnFun="tableRowBtnFun"
          width="120px"
          max-height="auto"
          @getTableList="getRoleList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
        >
        </son-role-table> -->
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="roleDao && roleDao.total === 0"></null-page>
    </div>
    <VhallDialog
      width="520px"
      :visible.sync="roleDialogVisible"
      :title="roleForm.executeType === 'edit' ? '编辑角色' : '创建角色'"
      :lock-scroll=false
      class="role-dialog"
      append-to-body>
      <el-form :model="roleForm" ref="roleForm" :rules="roleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <VhallInput type="text" placeholder="请输入角色名称" autocomplete="off"  v-model="roleForm.role_name" :maxlength="15" show-word-limit></VhallInput>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark"  class="remark--item">
          <VhallInput type="text" placeholder="请输入备注信息" autocomplete="off" v-model="roleForm.remark" :maxlength="30" show-word-limit></VhallInput>
        </el-form-item>
        <el-form-item label="直播管理" prop="permission_webinar" class="switch--item">
          <div class="switch__box">
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
        </el-form-item>
        <el-form-item label="内容管理" prop="permission_content" class="switch--item">
          <div class="switch__box">
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
        </el-form-item>
        <el-form-item label="数据管理" prop="permission_data" class="switch--item">
          <div class="switch__box">
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
export default {
  name: "roleList.vue",
  components: {
    NullPage
  },
  data() {
    return {
      loading: false,
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
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
          methodName: 'roleEdit'
        },
        {
          name: "删除",
          methodName: 'roleDel'
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
        if (item.child_count > 0) {
          that.$alert('当前角色已关联子账号，请先解绑关系后再进行删除', '提示', {
            confirmButtonText: '我知道了',
            customClass: 'zdy-alert-box',
            center: true,
            lockScroll: false
          }).then(()=>{
          }).catch(()=>{});
        } else {
          return item.id;
        }
      });
    },
    // 批量删除
    multiMsgDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message({
          message:  `请至少选择一种角色删除`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
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
      if (rows.child_count > 0) {
        that.$alert('当前角色已关联子账号，请先解绑关系后再进行删除', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-alert-box',
          center: true,
          lockScroll: false
        }).then(()=>{
        }).catch(()=>{});
      } else {
        that.$confirm('确定删除当前角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          that.$fetch('sonRoleDel', {
            ids: rows.id
          }).then(res => {
            that.$message({
              message:  `删除成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            that.ids = [];
            try {
              that.$refs.roleTab.clearSelect();
            } catch(e) {
              console.log(e);
            }
            that.initComp();
          }).catch(res => {
            console.log(res);
            that.$message({
              message: res.msg || '删除失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }).catch(() => {
        });
      }
    },
    // 编辑子账号
    async roleEdit(that, { rows }) {
      that.roleDialogVisible = true;
      that.roleForm.executeType = 'edit';
      that.$fetch('sonRoleGet', {
        id: rows.id
      }).then(res =>{
        if (res.data) {
          that.roleForm = Object.assign(that.roleForm, res.data);
        }
      }).catch( res =>{
        console.log(res);
        that.$message({
          message:  res.msg || '获取角色信息失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 创建子账号
    addRole() {
      this.roleDialogVisible = true;
      this.roleForm.executeType = 'add';
      this.roleForm.id = null;
      this.$nextTick(() => {
        this.$refs.roleForm.resetFields();
        // 开关重置
        this.roleForm.permission_content = 1; // 内容管理开关 1开 0关闭
        this.roleForm.permission_data = 1; // 数据管理 1开 0关闭
      });
    },
    // 子账号信息新增 or 修改
    executeRoleSend() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.$fetch(this.roleForm.executeType === 'add' ? 'sonRoleAdd' : 'sonRoleEdit', this.roleForm).then(res =>{
            this.$message({
              message:  `操作成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.roleDialogVisible = false;
            this.initComp();
          }).catch( res =>{
            console.log(res);
            this.$message({
              message: res.msg || '操作失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }
      });
    },
    // 获取列表数据
    getRoleList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      this.loading = true;
      this.$fetch('sonRoleList', {
        role_name: this.role_name,
        pos: this.query.pos,
        limit: this.query.limit
      }).then(res =>{
        this.loading = false;
        this.roleDao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
      }).catch(e=>{
        this.loading = false;
        console.log(e);
        this.roleDao = {
          total: 0,
          list: []
        };
      });
    },
    initComp() {
      this.initQuerySonList();
    },
    initQuerySonList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.roleTab.pageInfo.pageNum = 1;
        this.$refs.roleTab.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.getRoleList();
    }
  }
};
</script>
<style lang="less" scoped>
.all-no-data {
  /* 基于外边框已经有距离： padding: 24px 24px 40px 24px; */
  padding-top: 30px;
  margin-top: 164px;
  /deep/.createActive {
    padding-bottom: 30px;
  }
}
.all-yes-data {
  padding: 24px 24px 40px 24px;
  /deep/.data-list {
    /deep/.el-table {
      margin-bottom: 40px;
      .cell{
        line-height: 25px;
      }
    }
  }
}
.search-no-data {
  padding-top: 148px;
  /deep/.search {
    padding-bottom: 0;
  }
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
    width: 220px;
    float: right;
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
      padding-right: 50px;
    }
    /deep/ .el-input__suffix{
      cursor: pointer;
      /deep/ .el-input__icon{
        width: auto;
        margin-right: 5px;
        line-height: 36px;
      }
    }
  }
  .search-input {
    /deep/.el-input__inner{
      border-radius: 18px;
      height: 36px;
      background: transparent;
      padding-right: 50px;
      &.el-date-editor--daterange {
        padding-right: 10px;
      }
    }
  }
}
.role-dialog {
  /deep/.el-form-item {
    margin-bottom: 24px;
  }
  /deep/.remark--item {
    margin-bottom: 14px;
  }
  /deep/.switch--item {
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  /deep/.el-dialog__footer {
    padding: 14px 32px 24px 32px;
  }
}
</style>
