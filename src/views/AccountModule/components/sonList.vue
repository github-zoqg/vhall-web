<template>
  <div class="son--list">
    <!-- 搜索 -->
    <div class="list--search">
      <el-button size="medium" type="primary" round @click.prevent.stop="addSonShow(null)">创建子账号</el-button>
      <el-button size="medium" plain round @click.prevent.stop="toAllocationPage">用量分配</el-button>
      <el-button size="medium" round @click.prevent.stop="multiMsgDel">批量删除</el-button>
      <el-button size="medium" round @click="downloadHandle">导出</el-button>
      <el-input placeholder="搜索子账号信息（账号/昵称/手机号码）" v-model.trim="query.keyword"
                clearable
                @clear="initQuerySonList"
                @keyup.enter.native="initQuerySonList">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="initQuerySonList"></i>
      </el-input>
      <el-select placeholder="全部" round v-model="query.role_id" @change="initQuerySonList">
        <el-option value="">全部</el-option>
        <el-option
          v-for="item in roleList"
          :key="'v_' + item.id"
          :label="item.role_name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 有消息内容 -->
    <div v-if="sonDao && sonDao.total > 0">
      <!-- 表格与分页 -->
      <table-list
        ref="sonTab"
        :isHandle=true
        :manageTableData="sonDao.list"
        :tabelColumnLabel="sonTableColumn"
        :totalNum="sonDao && sonDao.total ? sonDao.total : 0"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=true
        max-height="auto"
        scene="accountList"
        @getTableList="getSonList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else></null-page>
    <!-- 添加/ 观众子账号 -->
    <VhallDialog :title="sonDialog.title" :visible.sync="sonDialog.visible" :lock-scroll='false'
                 width="680px">
      <el-form :model="sonForm" ref="sonForm" :rules="sonFormRules" :label-width="sonDialog.formLabelWidth">
        <el-form-item label="批量创建：" prop="is_batch" v-if="sonDialog.type === 'add'">
          <div class="switch__box">
            <el-switch
              v-model="sonForm.is_batch"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              @change="sonCountGetHandle"
            >
            </el-switch>
            <span class="leve3_title title--999" v-if="sonForm.is_batch">批量创建时，所生成子账号的昵称，密码，角色一致</span>
          </div>
        </el-form-item>
        <el-form-item label="账号数量" v-if="sonForm.is_batch" prop="nums">
          <el-input v-model.trim="sonForm.nums" autocomplete="off"></el-input>
          <span>当前可创建子账号数量{{ sonCountVo.available_num }}个</span>
        </el-form-item>
        <el-form-item label="账号昵称：" prop="nick_name">
          <el-input v-model.trim="sonForm.nick_name" auto-complete="off" placeholder="请输入账号昵称，不输入默认使用账号ID" :maxlength="30"
                    :minlength="1" show-word-limit/>
        </el-form-item>
        <el-form-item label="预设密码：" prop="password">
          <el-input v-model.trim="sonForm.password" auto-complete="off" placeholder="支持数字，大小写英文，最多输入30个字符"
                    :maxlength="30" :minlength="6"/>
        </el-form-item>
        <el-form-item label="账号角色：" prop="role_id">
          <el-select placeholder="请选择角色" clearable round v-model="sonForm.role_id">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model.trim="sonForm.phone" autocomplete="off" :placeholder="phonePlaceholder" class="btn-relative"
                    :maxlength="30" disabled>
            <el-button class="no-border" size="mini" slot="append" @click="resetPhoneOrEmail('phone')">重置</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：">
          <el-input v-model.trim="sonForm.email" autocomplete="off" :placeholder="emailPlaceholder" class="btn-relative"
                    :maxlength="30" disabled>
            <el-button class="no-border" size="mini" slot="append" @click="resetPhoneOrEmail('email')">重置</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick @click="sonSaveSend('sonForm')" size="medium" round>确 定</el-button>
        <el-button @click="sonDialog.visible = false" size="medium" round>取 消</el-button>
      </div>
    </VhallDialog>
    <!-- 添加子账号 -->
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import {sessionOrLocal} from "@/utils/utils";

export default {
  name: "sonList.vue",
  components: {
    NullPage
  },
  props: {
    vipType: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    /*let validNums = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入数量'));
      } else {
        if (value > this.sonCountVo.available_num) {
          callback(new Error(`当前可创建子账号数量不能超过${this.sonCountVo.available_num}个`));
        }
        callback();
      }
    };*/
    let verifyEnterPwd = (rule, value, callback) => {
      let pattern = /^([0-9a-zA-Z_`!~@#$%^*+=,.?;'":)(}{/\\|<>&[-]|]){6,30}$/;
      if (value === '') {
        callback(new Error('支持数字，大小写英文，6-30个字符'));
      } else if (!pattern.exec(value)) {
        callback(new Error('支持数字，大小写英文，6-30个字符'));
      } else {
        callback();
      }
    };
    return {
      query: {
        role_id: null,
        keyword: '',
        pos: 0,
        limit: 1000,
        pageNumber: 1
      },
      roleList: [],
      sonDao: {
        total: 0,
        list: []
      },
      sonCountVo: {},
      isHandle: false, // 是否有操作项
      sonTableColumn: [],
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
        is_batch: 0,
        nums: null,
        nick_name: '',
        password: '',
        role_id: '',
        phone: '',
        email: ''
      },
      sonFormRules: {
        nick_name: [
          {required: false, message: '请输入账号昵称，不输入默认使用账号ID', trigger: 'blur'}
        ],
        password: [
          {required: true, trigger: 'blur', validator: verifyEnterPwd, min: 6, max: 30, message: '支持数字，大小写英文，6-30个字符'}
        ],
        role_id: [
          {required: true, message: '请输入账号角色', trigger: 'change'}
        ],
        nums: [
          {required: true, message: '请填写账号数量', trigger: 'blur'}
        ]
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
    toSonDetail(that, {rows}) {
      that.$router.push({
        path: `/sonDetail/${rows.child_id}`,
      });
    },
    // 跳转到用量分配
    toAllocationPage() {
      // 1表示并发
      this.$router.push({
        path: `/allocation`,
      });
    },
    // 批量选择
    checkMoreRow(val) {
      console.log(val);
      this.ids = val.map(item => {
        return item.child_id;
      });
    },
    // 批量删除
    multiMsgDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一条子账号信息删除');
      } else {
        this.sonDel(this, {
          rows: {
            child_id: this.ids.join(',')
          }
        });
      }
    },
    downloadHandle() {
      let params = {
        role_id: this.query.role_id,
        keyword: this.query.keyword,
        pos: 0,
        limit: 999999, // TODO 跟大龙确定，传值大于0，后台下载依然是所有符合条件的全部数据
      };
      this.$fetch('sonChildExport', params).then(res => {
        if (res && res.code === 200) {
          this.$message.success('下载申请成功，请去下载中心下载该项！');
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(res.msg);
        }
      }).catch(e => {
        console.log(e);
      });
    },
    // 获取子账号个数
    sonCountGetHandle() {
      this.$fetch('sonCountGet', {}).then(res => {
        this.sonCountVo = res && res.code === 200 ? res.data || {} : (this.$message.error(res.msg || '获取子账号个数失败'));
      }).catch(e => {
        console.log(e);
        this.sonCountVo = {};
      });
    },
    // 删除单条消息数据
    sonDel(that, {rows}) {
      that.$confirm('正在直播或有未提现收益的账号不会被删除，确定删除？', '提示', {
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        cancelButtonText: '取消'
      }).then(() => {
        that.$fetch('sonDel', {
          child_ids: rows.child_id
        }).then(res => {
          if (res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            try{
              that.$refs.sonTab.clearSelection();
            } catch (e) {
              console.log(e);
            }
            that.initQuerySonList();
          } else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message: '删除失败'
          });
        });
      }).catch(() => {
      });
    },
    // 新增子账号
    addSonShow() {
      try {
        if (this.$refs.sonForm) {
          this.$refs.sonForm.resetFields();
        }
      } catch (e) {
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
    editSonShow(that, {rows}) {
      try {
        if (that.$refs.sonForm) {
          that.$refs.sonForm.resetFields();
        }
      } catch (e) {
        console.log(e);
      }
      that.sonDialog.type = 'edit';
      that.sonDialog.title = '修改子账号';
      that.sonDialog.row = rows;
      that.$set(that.sonForm, 'is_batch', rows.is_batch);
      that.$set(that.sonForm, 'nick_name', rows.nick_name);
      that.$set(that.sonForm, 'password', '');
      that.$set(that.sonForm, 'role_id', rows.role_id);
      that.$set(that.sonForm, 'role_name', rows.role_name);
      that.$set(that.sonForm, 'nums', rows.nums);
      that.$set(that.sonForm, 'phone', rows.phone);
      that.$set(that.sonForm, 'email', rows.email);
      that.sonDialog.visible = true;
    },
    // 添加子账号 or 修改子账号
    sonSaveSend() {
      this.$refs.sonForm.validate((valid) => {
        if (valid) {
          console.log('新增 or 修改子账号：' + JSON.stringify(this.sonForm));
          // 判断子账号个数, 批量验证输入个数。
          if(this.sonForm.is_batch && Number(this.sonForm.nums) >  Number(this.sonCountVo.available_num)) {
            this.$message.error('超过当前可创建的子账号数量');
            return;
          }
          let params = Object.assign(
            this.sonDialog.type === 'add' ? {} : {
              id: this.sonDialog.row.id,
              child_id: this.sonDialog.row.child_id
            }, this.sonForm);
          this.$fetch(this.sonDialog.type === 'add' ? 'sonAdd' : 'sonEdit', params).then(res => {
            if (res && res.code === 200) {
              this.$message.success(`${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作成功`);
              this.sonDialog.visible = false;
              // 新增成功后，重查列表
              this.initQuerySonList();
            } else {
              this.$message({
                type: 'error',
                message: res.msg || `${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作失败`
              });
            }
          }).catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message: `${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作失败`
            });
          });
        }
      });
    },
    // 获取列表数据
    getSonList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      let params = {
        role_id: this.query.role_id,
        // user_id: sessionOrLocal.get('userId'),
        pos: this.query.pos,
        limit: this.query.limit,
        keyword: this.query.keyword,
        scene_id: 1 // 场景id：1子账号列表 2用量分配获取子账号列表
      };
      this.$fetch('getSonList', this.$params(params)).then(res => {
        let dao = res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        (dao.list || []).map(item => {
          if (this.vipType > 0) {
            if (item.is_dynamic > 0) {
              // 流量动态
              item.round = `流量动态`;
            } else {
              // 流量（XXXGB）
              item.round = `流量（${item.vip_info.flow}GB）`;
            }
          } else {
            if (item.is_dynamic > 0) {
              // 流量动态
              item.round = `并发动态`;
              item.extend_day = `并发动态`
            } else {
              // 并发（XXX方）
              item.round = `并发（${item.vip_info.total}方）`;
              item.extend_day = `并发（${item.vip_info.extend_day}方）`
            }
          }
          // item.round = `${item && item.vip_info && item.vip_info.type > 0 ? '流量' : '并发' }（${item && item.is_dynamic > 0 ? '动态' : item.vip_info.type > 0 ? `${item.vip_info.total_flow}GB` : `${item.vip_info.total}方`}）`;
        });
        this.sonDao = dao;
      }).catch(e => {
        console.log(e);
        this.sonDao = {
          total: 0,
          list: []
        };
      });
    },
    // 查询所有可选择角色列表，加上默认最多可查询出11个
    getRoleList() {
      this.$fetch('sonRoleList', {
        role_name: '',
        pos: 0,
        limit: 500
      }).then(res => {
        console.log(res && res.code === 200 && res.data && res.data.list);
        if (res && res.code === 200 && res.data) {
          this.roleList = res.data.list || [];
        } else {
          this.roleList = [];
        }
        if (this.roleList.length > 0) {
          this.initQuerySonList();
        }
      }).catch(e => {
        console.log(e);
        this.roleList = [];
      });
    },
    // 重置选项
    resetPhoneOrEmail(type) {
      this.sonForm[type] = '';
    },
    initComp() {
      this.sonTableColumn = [
        {
          label: '账号',
          key: 'name',
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
          key: 'role_name',
          width: 200
        },
        {
          label: '用量分配',
          key: 'round',
          width: 200
        }
      ]
      // 是并发，展示并发包列
      if (!(this.vipType > 0)) {
        this.sonTableColumn.push({
          label: '扩展用量分配',
          key: 'extend_day',
          width: 200
        })
      }
      this.getRoleList(); // 获取可选角色列表
    },
    initQuerySonList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.sonTab.pageInfo.pageNum = 1;
        this.$refs.sonTab.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.getSonList();
    }
  },
  computed: {
    phonePlaceholder() {
      return this.sonForm.phone ? '' : '无需填写，由子账号自行绑定，父账号可进行重置';
    },
    emailPlaceholder() {
      return this.sonForm.email ? '' : '无需填写，由子账号自行绑定，父账号可进行重置';
    }
  }
};
</script>
<style lang="less" scoped>
// 初始化查询子账号列表信息
.son--list {
  .padding41-40();
  padding-bottom: 40px;
}

.list--search {
  margin-bottom: 20px;

  .el-select {
    float: right;
    margin-right: 20px;

    /deep/ .el-input__inner {
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }

  .el-input {
    width: 270px;
    float: right;

    /deep/ .el-input__inner {
      border-radius: 20px;
      height: 36px;
    }

    /deep/ .el-input__suffix {
      cursor: pointer;

      /deep/ .el-input__icon {
        line-height: 36px;
      }
    }
  }
}
</style>
