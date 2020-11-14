<template>
  <div class="role--list">
    <!-- 搜索 -->
    <div class="role--list--search">
      <el-button size="medium" type="primary" round @click.prevent.stop="addRole">创建角色</el-button>
      <el-button size="medium" round @click.prevent.stop="multiMsgDel">批量删除</el-button>
      <el-input placeholder="搜索角色名称">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
    </div>
    <!-- 有消息内容 -->
    <div v-if="roleDao.total > 0">
      <!-- 表格与分页 -->
      <table-list
        ref="roleTab"
        :isHandle=true
        :manageTableData="roleDao.list"
        :tabelColumnLabel="roleTableColumn"
        :totalNum="roleDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=true
        @getTableList="getRoleList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else></null-page>
    <el-dialog
      width="30%"
      :visible.sync="addShow"
      :title="addForm.executeType === 'edit' ? '编辑角色' : '创建角色'"
      append-to-body>
      1111111111
      <span slot="footer" class="dialog-footer">
          <el-button @click="addShow = false">取 消</el-button>
          <el-button type="primary" @click.prevent.stop="executeRoleSend">确 定</el-button>
        </span>
    </el-dialog>
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
      query: {
        keyword: '',
        pos: 0,
        limit: 1000
      },
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
          key: 'account',
          width: 200
        },
        {
          label: '备注',
          key: 'desc',
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
      addShow: false,
      addForm: {
        id: null,
        name: null,
        type: 'add',
      },
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
        cancelButtonText: '取消'
      }).then(() => {
        that.$fetch('roleDel', {
          msg_id: rows.account_id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.getRoleList();
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
    roleEdit(that, { rows }) {
      that.addShow = true;
      that.addForm.executeType = 'edit';
      that.addForm.id = rows.id;
      that.addForm.name = rows.name;
    },
    // 创建子账号
    addRole() {
      this.addShow = true;
      this.addForm.executeType = 'add';
      this.addForm.id = null;
      this.addForm.name = null;
    },
    // 子账号信息新增 or 修改
    executeRoleSend() {},
    // 获取列表数据
    getRoleList(pageInfo = {pageNum: 1, pageSize: 10}) {
      this.$fetch('getRoleList', {
        user_id: '1111',
        pos: (pageInfo.pageNum-1)*pageInfo.pageSize,
        limit: pageInfo.pageSize
      }).then(res =>{
        res = {
          "code": 200,
          "msg": "查询成功",
          "data": {
            "list": [{
              "account_id": 1,
              "nick_name": "昵称111111",
              "phone": "18310410964",
              "type": 1,
              "role": 1
            },{
              "account_id": 2,
              "nick_name": "昵称2222",
              "phone": "18310410964",
              "role": 1,
              "type": 1
            },{
              "account_id": 3,
              "nick_name": "昵称33333",
              "phone": "18310410964",
              "role": 1,
              "type": 1
            }],
            "total": 50
          }
        };
        let dao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        (dao.list||[]).map(item => {
          item.roleStr = ['默认角色', '角色1'][item['role']];
          item.typeStr = ['并发（动态）' ,'并发（固定）'][item['type']];
        });
        this.roleDao = dao;
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
