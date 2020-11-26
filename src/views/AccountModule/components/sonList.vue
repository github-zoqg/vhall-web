<template>
  <div class="son--list">
    <!-- 搜索 -->
    <div class="list--search">
      <el-button size="medium" type="primary" round @click.prevent.stop="addSonShow(null)">创建子账号</el-button>
      <el-button size="medium" plain round @click.prevent.stop="toAllocationPage">用量分配</el-button>
      <el-button size="medium" round @click.prevent.stop="multiMsgDel">批量删除</el-button>
      <el-button size="medium" round >导出</el-button>
      <el-input placeholder="搜索子账号信息（ID/昵称/手机号码）" v-model.trim="query.keyword">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
      <el-select placeholder="全部" round  v-model="query.type">
        <el-option
          v-for="item in roleList"
          :key="'v_' + item.id"
          :label="item.role_name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 有消息内容 -->
    <div v-if="sonDao.total > 0">
      <!-- 表格与分页 -->
      <table-list
        ref="sonTab"
        :isHandle=true
        :manageTableData="sonDao.list"
        :tabelColumnLabel="sonTableColumn"
        :totalNum="sonDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=true
        @getTableList="getSonList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else></null-page>
    <!-- 添加观众/ 观众修改 -->
    <el-dialog :title="sonDialog.title" :visible.sync="sonDialog.visible" :lock-scroll='false' class="dialog__group">
      <el-form :model="sonForm" ref="sonForm" :rules="sonFormRules" :label-width="sonDialog.formLabelWidth">
        <el-form-item label="批量创建：" prop="isMulti" v-if="sonDialog.type === 'add'">
          <el-switch
            v-model="sonForm.isMulti"
            active-color="#FB3A32"
            inactive-color="#CECECE"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="账号昵称：" prop="nick_name">
          <el-input v-model.trim="sonForm.nick_name" auto-complete="off" placeholder="请输入帐号昵称" :maxlength="30" :minlength="1" show-word-limit/>
        </el-form-item>
        <el-form-item label="预设密码：" prop="industry">
          <el-input v-model.trim="sonForm.password" auto-complete="off" placeholder="请输入数字、大小写英文（长度1-12个字符）" :maxlength="12" :minlength="1"/>
        </el-form-item>
        <el-form-item label="账号角色：" prop="roleType">
          <el-select placeholder="请选择角色" round  v-model="sonForm.roleType">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model.trim="sonForm.phone" auto-complete="off"/>
          <el-button>重置</el-button>
        </el-form-item>
        <el-form-item label="邮箱地址：">
          <el-input v-model.trim="sonForm.email" auto-complete="off"/>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sonDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="sonSaveSend('sonForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加子账号 -->
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
export default {
  name: "sonList.vue",
  components: {
    NullPage
  },
  data() {
    return {
      query: {
        type: '',
        keyword: '',
        pos: 0,
        limit: 1000
      },
      roleList: [],
      sonDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      sonTableColumn: [
        {
          label: '账号ID',
          key: 'account_id',
          width: 200
        },
        {
          label: '昵称',
          key: 'nick_name',
          width: 'auto'
        },
        {
          label: '手机号码',
          key: 'phone',
          width: 200
        },
        {
          label: '角色',
          key: 'roleStr',
          width: 200
        },
        {
          label: '用量分配',
          key: 'typeStr',
          width: 200
        }
      ],
      tableRowBtnFun: [
        {
          name: "详情",
          methodName: 'toSonDetail'
        },
        {
          name: "编辑",
          methodName: 'editSonShow'
        },
        {
          name: "删除",
          methodName: 'sonDel'
        }
      ],
      ids: [],
      // 创建子账号与编辑子账号
      sonDialog: {
        visible: false,
        title: '添加观众',
        type: 'add',
        row: null,
        formLabelWidth: '100px'
      },
      sonForm: {
        isMulti: false,
        nick_name: '',
        password: '',
        roleType: '',
        phone: '',
        email: ''
      },
      sonFormRules: {
      },
    };
  },
  methods: {
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 跳转消息详情页
    toSonDetail(that, { rows }) {
      that.$router.push({
        path: `/sonDetail/${rows.account_id}`,
      });
    },
    // 跳转到用量分配
    toAllocationPage() {
      // 1表示并发
      this.$router.push({
        path: `/allocation/1`,
      });
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
        this.$message.error('请至少选择一条子账号信息删除');
      } else {
        this.sonDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        });
      }
    },
    // 删除单条消息数据
    sonDel(that, { rows }) {
      that.$confirm('正在直播或有未提现收益的账号不会被删除，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.$fetch('sonDel', {
          msg_id: rows.account_id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.getSonList();
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
    // 新增子账号
    addSonShow() {
      try{
        if (this.$refs.sonForm) {
          this.$refs.sonForm.resetFields();
        }
      }catch (e){
        console.log(e);
      }
      this.sonDialog.type = 'add';
      this.sonDialog.title = '添加子账号';
      this.sonDialog.row = null;
      this.$set(this.sonForm, 'isMulti', false);
      this.$set(this.sonForm, 'nick_name', '');
      this.$set(this.sonForm, 'password', '');
      this.$set(this.sonForm, 'roleType', '');
      this.$set(this.sonForm, 'phone', '');
      this.$set(this.sonForm, 'email', '');
      this.sonDialog.visible = true;
    },
    // 编辑子账号
    editSonShow(that, { rows }) {
      try{
        if (this.$refs.sonForm) {
          this.$refs.sonForm.resetFields();
        }
      }catch (e){
        console.log(e);
      }
      this.sonDialog.type = 'edit';
      this.sonDialog.title = '修改子账号';
      this.sonDialog.row = rows;
      this.$set(this.sonForm, 'isMulti', rows.isMulti);
      this.$set(this.sonForm, 'nick_name', rows.nick_name);
      this.$set(this.sonForm, 'password', rows.password);
      this.$set(this.sonForm, 'roleType', rows.roleType);
      this.$set(this.sonForm, 'phone', rows.phone);
      this.$set(this.sonForm, 'email', rows.email);
      this.sonDialog.visible = true;
    },
    // 添加子账号 or 修改子账号
    sonSaveSend() {
      this.$refs.sonForm.validate((valid) => {
        if (valid) {
          console.log('新增 or 修改子账号：' + JSON.stringify(this.sonForm));
          let params = Object.assign(this.sonDialog.type === 'add' ? {group_id: this.query.group_id} : {id: this.sonDialog.row.id, group_id: this.query.group_id }, this.sonForm);
          this.$fetch(this.sonDialog.type === 'add' ? 'sonAdd' : 'sonEdit', params).then(res => {
            res && res.code === 200 ? this.$message.success(`${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作成功`) : this.$message({
              type: 'error',
              message: res.msg || `${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作失败`
            });
            this.sonDialog.visible = false;
          }).catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message:`${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作失败`
            });
          });
        }
      });
    },
    // 获取列表数据
    getSonList(pageInfo = {pageNum: 1, pageSize: 10}) {
      this.$fetch('getSonList', {
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
        this.sonDao = dao;
      }).catch(e=>{
        console.log(e);
        this.sonDao = {
          total: 0,
          list: []
        };
      });
    },
    async getRoleList() {
      this.$fetch('sonRoleList', {
        role_name: '',
        pos: 0,
        limit: 11
      }).then(res => {
        console.log(res && res.code === 200 && res.data && res.data.list)
        if (res && res.code === 200 && res.data) {
          this.roleList = res.data.list || [];
        } else {
          this.roleList = [];
        }
        if (this.roleList.length > 0) {
          this.getSonList();
        }
      }).catch(e => {
        console.log(e);
        this.roleList = [];
      });
    },
    initComp() {
      this.getRoleList(); // 获取可选角色列表
    }
  }
};
</script>
<style lang="less" scoped>
// 初始化查询子账号列表信息
.son--list {
  .padding41-40();
}
.list--search{
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
