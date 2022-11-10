<template>
  <div v-if="!auth_show">
    <null-page
      text="开发接口为高级功能，联系您的客户经理获取权限后方可使用"
      nullType="setting"
    >
      <el-button
        type="primary"
        round
        @click="openChat"
      >联系客服</el-button>
      <el-button
        type="white-primary"
        round
        @click="openDoc"
      >查看文档</el-button>
    </null-page>
  </div>
  <div
    v-else
    class="dev-show-layout"
    v-loading="fetching"
    element-loading-text="获取数据中"
  >
    <pageTitle pageTitle="开发设置">
      <div class="title_text">低门槛云开发，自由定制您的直播平台，具体对接方案请查看<span @click="document">《文档中心》</span></div>
      <!-- <span class="dev-show-tips">
        使用说明：当添加多个包时，使用<a href="https://www.vhall.com/index.php?r=doc/index/index#verify/access-token_%E8%8E%B7%E5%8F%96SDK%E7%9B%B4%E6%92%AD%E6%93%8D%E4%BD%9Ctoken" target="_blank">获取SDK直播操作token</a>的API时需要传app_key参数以确保双方加密数据一致
      </span> -->
    </pageTitle>
    <!-- 未创建 -->
    <div
      class="all-no-data"
      v-if="totalNum === 0"
    >
      <null-page
        text="暂未创建应用"
        nullType="no-create"
        :height="0"
      >
        <el-button
          type="primary"
          round
          v-preventReClick
          @click="createApp"
        >创建应用</el-button>
      </null-page>
    </div>
    <!-- 有数据 -->
    <div v-else>
      <p class="top">
        <el-button
          type="primary"
          size="medium"
          round
          v-preventReClick
          @click="createApp"
          :readonly="!(available_num > 0)"
        >创建应用</el-button>
        <el-button
          size="medium"
          round
          @click="toCallbackPage"
          class="bg--trans"
        >回调设置</el-button>
      </p>
      <div class="dev-show-list">
        <table-list
          ref="tableList"
          :isCheckout=false
          :manageTableData="tableList"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :isHandle="isHandle"
          :totalNum="totalNum"
          max-height="auto"
          width=144
          scene="development"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getTableList"
        >
        </table-list>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import { sessionOrLocal } from "@/utils/utils";
import env from "@/api/env";
export default {
  name: 'devMgr',
  components: {
    NullPage,
    PageTitle
  },
  data() {
    return {
      lowerGradeInterval: null,
      auth_show: false,
      sCheckout: false,
      totalNum: 0,
      isHandle: true,
      tableList: [],
      msg: null,
      limit: 10,
      pageNumber: 1,
      pos: 0,
      tableColumn: [
        {
          label: '应用名称',
          key: 'app_name',
        },
        {
          label: 'AppKey',
          key: 'app_key',
        },
        {
          label: '创建时间',
          key: 'created_at',
          width: 200
        },
        {
          label: '更新时间',
          key: 'updated_at',
          width: 200
        },
        {
          label: '状态',
          key: 'statusStr',
          width: 100
        }
      ],
      tableRowBtnFun: [
        {
          name: '查看',
          methodName: 'viewApp'
        },
        {
          name: '停用',
          methodName: 'stopApp'
        },
        {
          name: '启用',
          methodName: 'restartApp'
        },
        {
          name: '删除',
          methodName: 'deleteApp'
        }
      ],
      available_num: 0,
      fetching: false
    };
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.initPage();
  },
  // beforeDestroy() {
  //   if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  // },
  // mounted(){
  //   this.handleLowerGradeHeart()
  // },
  methods: {
    getSysConfig() {
      let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      if (permissions) {
        let perVo = JSON.parse(permissions);
        console.log(perVo, '权限-用户');
        if (perVo.is_developer > 0) {
          // 开启
          this.auth_show = true;
          this.search();
        } else {
          this.auth_show = false;
        }
      }
    },
    handleLowerGradeHeart() {
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == this.userId) : null;
        console.log('777777777', res)
        if (activityConfig) {
          this.setLowerGradeConfig(activityConfig.permissions)
        } else if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions)
        }
      });
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      const permission = sessionOrLocal.get('SAAS_VS_PES', 'localStorage')
      const permissionInfo = Object.assign(permission, data)
      if (permissionInfo) {
        let perVo = JSON.parse(permissionInfo);
        // perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
        if (perVo.is_developer > 0) {
          // 开启
          this.auth_show = true;
          this.search();
        } else {
          this.auth_show = false;
        }
      }
    },
    openChat() {
      this.$vhall_paas_port({
        k: 100017,
        data: { business_uid: this.userId, user_id: '', s: '', webinar_id: '', refer: 4, report_extra: {}, ref_url: '', req_url: '' }
      })
      window.open(`${env.staticLinkVo.kf}`, '_blank');
    },
    // 查看文档-开发设置
    openDoc() {
      window.open('https://saas-doc.vhall.com/opendocs/show/876', '_blank');
    },
    document() {
      this.$vhall_paas_port({
        k: 100590,
        data: { business_uid: this.userId, user_id: '', s: '', webinar_id: '', refer: '', report_extra: {}, ref_url: '', req_url: '' }
      })
      window.open('https://saas-doc.vhall.com/opendocs/home', '_blank');
    },
    initPage() {
      // 取得当前系统配置项
      this.getSysConfig();
    },
    toCallbackPage() {
      this.$router.push({
        path: `/dev/callback`,
        query: {
          userId: this.userId
        }
      })
    },
    createApp() {
      if (!(this.available_num > 0)) {
        this.$confirm(`如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
        }).catch(() => { });
        return;
      }
      /**
       * 1、创建数量有限制，超过默认创建数量后置灰（默认5个）
       * 2、点击后弹窗提示：如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970
       */
      this.$fetch('createApp', {}).then(res => {
        console.log('getAppList', res);
        this.$confirm(`添加成功，请手动添加包名签名信息`, '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '我知道了',
          cancelButtonText: '',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel-hide'
        }).then(() => {
          this.$vhall_paas_port({
            k: 100591,
            data: { business_uid: this.userId, user_id: '', s: '', webinar_id: '', refer: '', report_extra: {}, ref_url: '', req_url: '' }
          })
          this.search();
        }).catch(action => {
          // 关闭弹框，调用查询接口
          if (action == 'close') {
            this.search();
          }
        });
      }).catch(res => {
        this.$message({
          message: res.msg || '创建失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    search() {
      if (this.$refs.tableList) {
        this.$refs.tableList.currentChangeHandler(1)
      }
      this.pos = 0;
      this.pageNumber = 1;
      this.getTableList();
    },
    getTableList(row) {
      if (row) {
        this.pos = row.pos;
        this.pageNumber = row.pageNum;
      }
      this.fetching = true;
      this.$fetch('getAppList', {
        pos: this.pos,
        limit: this.limit
      }).then(res => {
        console.log('getAppList', res);
        let list = res.data.list || [];
        list.map(item => {
          item.statusStr = ['已停用', '已启用'][item.status];
        });
        this.tableList = list || [];
        this.totalNum = res.data.total || 0;
        this.available_num = res.data.available_num;
      }).catch(res => {
        console.log(res);
        this.tableList = [];
        this.totalNum = 0;
        this.available_num = 0;
      }).finally(() => {
        this.fetching = false;
      });
    },
    viewApp(that, { rows }) {
      that.$vhall_paas_port({
        k: 100595,
        data: { business_uid: that.userId, user_id: '', s: '', webinar_id: '', refer: '', report_extra: {}, ref_url: '', req_url: '' }
      })
      that.$router.push({ path: `/dev/${rows.id}` });
    },
    stopApp(that, { rows }) {
      that.$confirm('是否确认停用APP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.appEditStatus(rows, 0);
      });
    },
    restartApp(that, { rows }) {
      that.$confirm('是否确认启用APP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.appEditStatus(rows, 1);
      });
    },
    deleteApp(that, { rows }) {
      that.$confirm('是否确认删除APP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.appEditStatus(rows, 2);
      });
    },
    appEditStatus(rows, status) {
      this.$fetch('appEditStatus', {
        id: rows.id,
        status: status
      }).then(res => {
        this.$vhall_paas_port({
          k: [100592, 100593, 100594][status],
          data: { business_uid: this.userId, user_id: '', s: '', webinar_id: '', refer: '', report_extra: {}, ref_url: '', req_url: '' }
        })
        this.$message({
          message: `${['停用', '启用', '删除'][status]}成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        // 刷新数据
        this.search();
      }).catch(res => {
        this.$message({
          message: res.msg || `${['停用', '启用', '删除'][status]}失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  margin-bottom: 20px;
  /deep/.bg--trans {
    background: transparent;
    &:hover {
      color: #fff;
      background: #fb3a32;
      border: 1px solid #fb3a32;
    }
    &:active {
      color: #ffffff;
      background: #e2332c;
      border: 1px solid #e2332c;
    }
  }
}
.tips {
  font-size: 14px;

  margin-left: 10px;
  a {
    text-decoration: underline;
  }
}
.dev-show-layout {
  /deep/.el-button[readonly] {
    background: #f09d99;
    border: 1px solid #f09d99;
    cursor: not-allowed;
    color: #ffffff;
    &:hover,
    &:active {
      background: #f09d99;
      border: 1px solid #f09d99;
      cursor: not-allowed;
      color: #ffffff;
    }
    /* 白色禁用
       background: transparent;
       border: 1px solid #CCCCCC;
       cursor: not-allowed;
       color: #666666;
       &:hover, &:active {
         background: transparent;
         border: 1px solid #CCCCCC;
         cursor: not-allowed;
         color: #666666;
       }*/
  }
  .title_text {
    color: #999;
    font-size: 14px;
    span {
      color: #3562fa;
      cursor: pointer;
    }
  }
}
.all-no-data {
  padding-top: 30px;
  margin-top: 164px;
  /deep/.createActive {
    padding-bottom: 30px;
  }
}
.dev-show-list {
  .layout--right--main();
  .padding-table-list();
  .min-height();
  /deep/.el-table .cell {
    line-height: 25px;
  }
  /deep/button.el-button.el-button--mini {
    font-size: 14px;
  }
}
.dev-show-tips {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  a {
    color: #3562fa;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
