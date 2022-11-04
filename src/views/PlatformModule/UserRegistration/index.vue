<template>
  <div :class="['vmp-user-registration', {
    'gray-theme': signUpPageType === 'subject' && isDataPage
  }]"  v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)">
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="isDefaultShow">
      <null-page nullType="nullData" text="暂无专题数据，请去专题下的直播活动查看数据吧！" :height="0"  v-if="signUpPageType === 'subject' && isDataPage">
      </null-page>
      <null-page nullType="nullData" text="暂无数据" :height="0" v-else>
        <el-button type="primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="addUserDialog">快速报名</el-button>
        <el-button type="white-primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="importUserDialog">导入</el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <!-- 专题下，导出数据页效果 -->
        <template v-if="signUpPageType === 'subject' && isDataPage">
          <el-button size="medium" :class="signUpPageType === 'subject' && isDataPage ? 'transparent-btn' : ''" round @click.prevent.stop="addUserDialog">快速报名</el-button>
          <el-button size="medium" :class="signUpPageType === 'subject' && isDataPage ? 'transparent-btn' : ''" plain round v-preventReClick @click.prevent.stop="importUserDialog">导入</el-button>
          <el-button size="medium" type="primary" round v-preventReClick @click.prevent.stop="downloadHandle" v-if="signUpPageType === 'subject' && isDataPage">导出</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="primary" round @click.prevent.stop="addUserDialog">快速报名</el-button>
          <el-button size="medium" :class="signUpPageType === 'subject' && isDataPage ? 'transparent-btn' : ''" plain round v-preventReClick @click.prevent.stop="importUserDialog">导入</el-button>
          <el-button size="medium" :class="signUpPageType === 'subject' && isDataPage ? 'transparent-btn' : ''" round v-preventReClick @click.prevent.stop="downloadHandle" v-if="!(signUpPageType === 'subject' && isDataPage)">导出</el-button>
        </template>
        <VhallInput placeholder="搜索手机号/姓名" v-model.trim="query.keyword"
                  clearable
                  @clear="initQueryUserList"
                  class="search-query"
                  @input="checkoutList"
                  v-clearEmoij
                  @keyup.enter.native="initQueryUserList">
          <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryUserList"></i>
        </VhallInput>
        <el-select placeholder="报名方式" round v-model.trim="query.type" @change="initQueryUserList">
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
        <el-select placeholder="是否观看" round v-model.trim="query.is_enter" @change="initQueryUserList" v-if="signUpPageType ==='webinar'">
          <el-option value="">是否观看</el-option>
          <el-option
            v-for="item in [{
              value: 1,
              label: '是'
            },
            {
              value: 0,
              label: '否'
            }]"
            :key="'v_' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 有消息内容 -->
      <div class="list-table-panel">
        <!-- 表格与分页 -->
        <table-list
          ref="userTable"
          :isHandle=false
          :isCheckout=false
          :manageTableData="userDao.list||[]"
          :tabelColumnLabel="userTableColumn"
          :totalNum="userDao.total||0"
          :pageLimit=query.limit
          :needPagination=true
          width="150px"
          max-height="504px"
          scene="accountList"
          @getTableList="getUserRegistrationList"
        >
        </table-list>
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="userDao && userDao.total === 0"></null-page>
    </div>
    <!-- 快速报名 -->
    <add-user-form v-if="addUserVisible" :visible="addUserVisible" :webinarOrSubjectId="webinarOrSubjectId" :signUpPageType="signUpPageType"
     @close="cancelAddUser"></add-user-form>
    <!-- 导入报名用户excel -->
    <import-dialog v-if="importVisible" :visible="importVisible" :webinarOrSubjectId="webinarOrSubjectId" :signUpPageType="signUpPageType" @close="cancelImport" @success="successImport"></import-dialog>
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import AddUserForm from './components/addUserForm.vue';
import ImportDialog from './components/importDialog.vue';

export default {
  name: "roleList.vue",
  components: {
    NullPage,
    AddUserForm,
    ImportDialog
  },
  props: {
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
      vm: null,
      /*--------------------列表部分参数定义--------------------*/
      loading: false,
      isDataPage: location.href.indexOf('/special/data/') != -1,
      query: {
        pos: 0,
        limit: 20,
        pageNumber: 1,
        is_enter: '',
        type: '',
        keyword: ''
      },
      userDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      baseTableColumn: [
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
      /*--------------------快速报名参数定义--------------------*/
      addUserVisible: false,
      /*--------------------导入用户参数定义--------------------*/
      importVisible: false
    };
  },
  computed: {
    userTableColumn() {
      if (this.signUpPageType === 'webinar') {
        return this.baseTableColumn
      } else {
        return this.baseTableColumn.filter(item => {
          return item.key !== 'is_enter_str'
        })
      }
    },
    isDefaultShow() {
      if (this.signUpPageType === 'webinar') {
        return this.userDao && this.userDao.total === 0 && this.query.keyword == '' && this.query.is_enter =='' && this.query.type == ''
      } else {
        return this.userDao && this.userDao.total === 0 && this.query.keyword == '' && this.query.type == ''
      }
    }
  },
  methods: {
    // 设置接口入参，是活动维度 还是 专题维度
    setParamsIdByRoute(params) {
      if (this.signUpPageType === 'webinar') {
        params.webinar_id = this.webinarOrSubjectId
      } else if (this.signUpPageType === 'subject') {
        params.subject_id = this.webinarOrSubjectId
      }
      return params
    },
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
    cancelAddUser(type){
      this.addUserVisible = false;
      if (type === 'closeAndLoading') {
        this.initQueryUserList()
      }
    },
    // 跳转专题详情页
    toSubjectDetail() {
      this.$router.push({
        path: `/special/details/${this.$route.params.id}`
      })
    },
    // 获取列表数据
    getUserRegistrationList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      this.loading = true;
      this.$fetch('userRegistrationList', this.$params(this.setParamsIdByRoute(this.query))).then(res =>{
        this.loading = false;
        if (res && res.code === 200 && res.data && res.data.list) {
          res.data.list.map(item => {
            item.entry_source_str = item.entry_source == 2 || item.entry_source == 3 ? '导入': '线上报名';
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
      });
    },
    initComp() {
      this.initQueryUserList();
    },
    initQueryUserList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 20;
      // 表格切换到第一页
      this.$nextTick(() => {
        if (this.$refs.userTable) {
          this.$refs.userTable.pageInfo.pageNum = 1;
          this.$refs.userTable.pageInfo.pos = 0;
        }
        this.getUserRegistrationList();
      })
    },
    //文案提示问题
    messageInfo(message) {
      this.vm = this.$message({
        showClose: true,
        duration: 2000,
        message: message,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    // 导出报名用户
    downloadHandle() {
      let params = {
        type: this.query.type,
        keyword: this.query.keyword
      }
      if (this.signUpPageType === 'webinar'&&this.query.is_enter !== '') {
        params.is_enter = this.query.is_enter
      }
      this.$fetch('exportForm', {
        ...this.setParamsIdByRoute({}),
        ...params
      }).then(res => {
        if (this.vm) {
          this.vm.close();
        }
        this.messageInfo('导出申请成功，请去下载中心下载')
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 导入
    importUserDialog() {
      this.importVisible = true
    },
    // 关闭导入用户名称
    cancelImport() {
      this.importVisible = false
    },
    // 导入成功
    successImport() {
      this.importVisible = false
      this.messageInfo('导入成功')
      this.initQueryUserList()
    }
  },
  mounted() {
    this.initComp()
  }
};
</script>
<style lang="less" scoped>
/* 列表样式-------------------------------------- */
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
      margin-bottom: 32px;
      .cell{
        line-height: 25px;
      }
    }
  }
}
/deep/.search-no-data {
  padding-top: 128px;
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
.vmp-user-registration{
  /deep/.el-table {
    margin-bottom: 32px;
  }
  &.gray-theme {
    .all-no-data {
      /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
      padding-top: 137px;
    }
    .list-table-panel {
      background: #ffffff;
      padding: 24px 24px 40px 24px;
    }
    /deep/.search-no-data {
      padding-top: 60px;
      background: #FFFFFF;
      padding-bottom: 120px;
    }
  }
}
</style>
