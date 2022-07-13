<template>
  <div class="vmp-user-registration"  v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)">
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="userDao && userDao.total === 0  && !query.keyword">
      <null-page nullType="nullData" text="暂无数据" :height="0">
        <el-button type="primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="addUserDialog">快速报名</el-button>
        <el-button type="white-primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="importUserDialog">导入</el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <el-button size="medium" type="primary" round @click.prevent.stop="addUserDialog">快速报名</el-button>
        <!-- 若当前是知学云账号，不展示用量分配按钮, extends_remark 为1时表示 知学云账号-->
        <el-button size="medium" plain round @click.prevent.stop="importUserDialog">导入</el-button>
        <el-button size="medium" round @click="downloadHandle">导出</el-button>
        <VhallInput placeholder="搜索手机号/姓名" v-model="query.keyword"
                  clearable
                  @clear="initQueryUserList"
                  class="search-query"
                  @input="checkoutList"
                  v-clearEmoij
                  @keyup.enter.native="initQueryUserList">
          <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryUserList"></i>
        </VhallInput>
        <el-select placeholder="报名方式" round v-model="query.type" @change="initQueryUserList" style="width:102px">
          <el-option value="">报名方式</el-option>
          <el-option
            v-for="item in [{
              value: 1,
              label: '线上报名'
            },
            {
              value: 2,
              label: '导入'
            }]"
            :key="'t_' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select placeholder="是否观看" round v-model="query.is_enter" @change="initQueryUserList" style="width:102px">
          <el-option value="">是否观看</el-option>
          <el-option
            v-for="item in [{
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }]"
            :key="'v_' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 有消息内容 -->
      <div>
        <!-- 表格与分页 -->
        <table-list
          ref="userTable"
          :isHandle=false
          :isCheckout=false
          :manageTableData="userDao.list||[]"
          :tabelColumnLabel="userTableColumn"
          :totalNum="userDao.total||0"
          :needPagination=true
          width="150px"
          max-height="auto"
          scene="accountList"
          @getTableList="getUserRegistrationList"
        >
        </table-list>
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="userDao && userDao.total === 0"></null-page>
    </div>
    <!-- 快速报名 -->
    <VhallDialog
      width="460px"
      :visible.sync="addUserVisible"
      title="快速导入"
      class="role-dialog"
      append-to-body>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="saveAddUser" size="medium" round>确 定</el-button>
        <el-button @click="cancelAddUser" size="medium" round>取 消</el-button>
      </span>
    </VhallDialog>
    <!-- 导入 -->
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
export default {
  name: "roleList.vue",
  components: {
    NullPage
  },
  props: {
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
      loading: false,
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
      userDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      userTableColumn: [
        {
          label: '用户信息',
          key: 'name',
          width: 'auto'
        },
        {
          label: '手机号',
          key: 'phone',
          width: 200
        },
        {
          label: '报名方式',
          key: 'entry_source_str',
          width: 100
        },
        {
          label: '报名时间',
          key: 'created_at',
          width: 'auto'
        },
        {
          label: '是否观看',
          key: 'is_enter_str',
          width: 100
        },
        {
          label: '来源',
          key: 'refer',
          width: 'auto'
        }
      ],
      addUserVisible: false,
    };
  },
  methods: {
    checkoutList(newValue) {
      if(!newValue){
        this.initQueryUserList()
      }
    },
    // 开启-快速报名弹窗
    addUserDialog() {
      this.addUserVisible = true;
    },
    // 关闭-快速报名弹窗
    cancelAddUser(){
      this.addUserVisible = false;
    },
    // 子账号信息新增 or 修改
    saveAddUser() {
    },
    // 获取列表数据
    getUserRegistrationList(row) {
     /*  if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      this.loading = true;
      this.$fetch('userRegistrationList', this.$params(this.query)).then(res =>{
        this.loading = false;
        if (res && res.code === 200 && res.data && res.data.list) {
          res.data.list.map(item => {
            item.entry_source_str = item.entry_source == 1 ? '线上报名': '线下';
            item.is_enter_str = item.is_enter == 1 ? '是': '否'
            item.name = item.name || '--'
            item.phone = item.phone || '--'
            item.created_at = item.created_at || '--'
            item.refer = item.refer || '--'
          })
          this.userDao =  res.data;
        } else {
          this.userDao = {
            total: 0,
            list: []
          };
        }
      }).catch(e=>{
        this.loading = false;
        console.log(e);
        this.userDao = {
          total: 0,
          list: []
        };
      }); */
      this.userDao = {
        total: 5,
        list: [
          {
            reg_id: null,
            webinar_id: 12312222,
            subjects_id: 123123123,
            is_reg: 0,
            type: 2,
            is_enter: 1,
            phone: 1234567890123456,
            name: 'asfdsafs11111111111111111111111111111111111111111',
            created_at: '2022-07-13 22:55:11',
            refer: '百度',
            entry_source_str: '线上',
            is_enter_str: ''
          }
        ]
      }
    },
    initComp() {
      this.initQueryUserList();
    },
    initQueryUserList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      this.$nextTick(() => {
        if (this.$refs.userTable) {
          this.$refs.userTable.pageInfo.pageNum = 1;
          this.$refs.userTable.pageInfo.pos = 0;
        }
        this.getUserRegistrationList();
      })
    },
    // 导出
    downloadHandle() {

    }
  },
  mounted() {
    this.initComp()
  }
};
</script>
<style lang="less" scoped>
.all-no-data {
  /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
  padding-top: 105px;
  /deep/.createActive {
    padding-bottom: 30px;
  }
  /deep/.btn-list .el-button {
    margin-right: 0;
  }
}
/deep/.all-yes-data {
  .data-list {
    .el-table {
      margin-bottom: 40px;
      .cell{
        line-height: 25px;
      }
    }
  }
}
/deep/.search-no-data {
  padding-top: 148px;
  .search {
    padding-bottom: 0;
  }
}
/deep/.list--search {
  margin-bottom: 20px;
  .el-input {
    width: 180px;
    float: right;
    .el-input__icon {
      line-height: 36px;
    }
    .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }

    .el-input__prefix {
      cursor: pointer;
    }
  }
  .el-select {
    width: 120px;
    .el-input {
      width: 120px;
    }
    float: right;
    margin-right: 12px;
    .el-input__inner {
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up{
      line-height: 36px;
    }
  }
}
/deep/.el-form-item.switch--item {
  margin-bottom: 14px;
}
/deep/.el-form-item.account--nums {
  .el-input {
    width: 210px;
    margin-right: 12px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 20px;
  }
  strong {
    color: #FB3A32;
  }
}
/deep/.no-execute {
  .el-input.is-disabled .el-input__inner {
    background-color: #F7F7F7;
    border-color: #cccccc;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    cursor: not-allowed;
  }
  .el-input-group__append {
    background-color: #F7F7F7;
    border-color: #cccccc;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    border-left: 0;
    cursor: not-allowed;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    &:hover {
      color: #3562fa;
    }
  }
}
.vmp-user-registration--search{
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
    /deep/ .el-input__icon{
      line-height: 36px;
    }
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix{
      cursor: pointer;
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
