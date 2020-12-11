<template>
  <div v-if="!auth_show">
    <null-page text="开发接口为高级功能，联系您的客户经理获取权限后方可使用" nullType="noAuth">
      <el-button type="primary" round @click="openChat">联系客服</el-button>
      <el-button round @click="openDoc">查看文档</el-button>
    </null-page>
  </div>
  <div v-else  class="developmentWrap" v-loading="fetching" element-loading-text="获取数据中">
    <pageTitle title="开发设置"></pageTitle>
    <p class="top">
      <el-button type="primary" round @click="createApp" :readonly="!(available_num > 0)">创建应用</el-button>
      <span class="tips">
        使用说明：当添加多个包时，使用<a href="https://www.vhall.com/index.php?r=doc/index/index#verify/access-token_%E8%8E%B7%E5%8F%96SDK%E7%9B%B4%E6%92%AD%E6%93%8D%E4%BD%9Ctoken" target="_blank">获取SDK直播操作token</a>的API时需要传app_key参数以确保双方加密数据一致
      </span>
    </p>
    <dev-table
      ref="tableList"
      :isCheckout=false
      :manageTableData="tableList"
      :tabelColumnLabel="tableColumn"
      :tableRowBtnFun="tableRowBtnFun"
      :isHandle="isHandle"
      :totalNum="totalNum"
      :checkPattern="{
        check_key: 'status',
        check_show_type: 'hidden',
        stopApp: 1,
        restartApp: 0
      }"
      @onHandleBtnClick="onHandleBtnClick"
      @getTableList="getTableList"
    >
    </dev-table>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import DevTable from '@/components/TableList/devTable';
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import {sessionOrLocal} from "@/utils/utils";
export default {
  data(){
    return{
      auth_show: false,
      sCheckout: false,
      totalNum: 1000,
      isHandle: true,
      tableList: [],
      tableColumn: [
        {
          label: '应用名称',
          key: 'app_name'
        },
        {
          label: 'AppKey',
          key: 'app_key',
        },
        {
          label: '创建时间',
          key: 'created_at',
          width: 120
        },
        {
          label: '更新时间',
          key: 'updated_at',
          width: 120
        },
        {
          label: '状态',
          key: 'statusStr',
          width: 150
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
  created(){
    this.initPage();
  },
  components: {
    NullPage,
    PageTitle,
    DevTable
  },
  mounted(){

  },
  methods: {
    getSysConfig() {
      let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      if(permissions) {
        let perVo = JSON.parse(permissions);
        console.log(perVo, '权限-用户');
        if (perVo.is_developer > 0) {
          // 开启
          this.auth_show = true;
          this.getTableList();
        } else {
          this.auth_show = false;
        }
      }
    },
    openChat() {
      window.open(`http://p.qiao.baidu.com/cps/chat?siteId=113762&userId=2052738`, '_blank');
    },
    // 查看文档-开发设置
    openDoc() {
      window.open('https://www.vhall.com/saas/doc/6.html', '_blank');
    },
    initPage() {
      // 取得当前系统配置项
      this.getSysConfig();
    },
    createApp(){
      if(!(this.available_num > 0)) {
        this.$alert('如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-alert-box',
          type: 'warning',
          center: true
        }).then(()=>{
        }).catch(()=>{});
        return;
      }
      /**
       * 1、创建数量有限制，超过默认创建数量后置灰（默认5个）
       * 2、点击后弹窗提示：如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970
       */
      this.$fetch('createApp', {}).then(res => {
        console.log('getAppList', res);
        if(res && res.code === 200) {
          this.$alert('添加成功，请手动添加包名签名信息', '提示', {
            confirmButtonText: '我知道了',
            customClass: 'zdy-alert-box',
            type: 'warning',
            center: true
          }).then(()=>{
            // 添加成功，刷新列表
            this.getTableList();
          }).catch(()=>{});
          // this.$router.push({path: `/dev/${res.data.result}`});
        } else {
          this.$message.error(res.msg || '创建失败');
        }
      }).catch(error=>{
        console.log(error);
      });
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(pageInfo = {pos: 0, limit: 10, pageNumber: 1}) {
      this.fetching = true;
      this.$fetch('getAppList', pageInfo).then(res => {
        console.log('getAppList', res);
        if(res && res.code === 200) {
          let list = res.data.list || [];
          list.map(item => {
            item.statusStr = ['已停用', '已启用'][item.status];
          });
          this.tableList = list || [];
          this.totalNum = res.data.total || 0;
          this.available_num = res.data.available_num;
        } else {
          this.tableList = [];
          this.totalNum = 0;
          this.available_num = 0;
        }
      }).catch(error=>{
        console.log(error);
        this.available_num = 0;
      }).finally(()=>{
        this.fetching = false;
      });
    },
    viewApp(that, { rows }){
      that.$router.push({path: `/dev/${rows.id}`});
    },
    stopApp(that, { rows }) {
      that.$confirm('是否确认停用APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
        customClass: 'zdy-message-box',
        type: 'warning',
        center: true
      }).then(()=>{
        that.appEditStatus(rows, 0);
      });
    },
    restartApp(that, { rows }) {
      that.$confirm('是否确认启用APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
        customClass: 'zdy-message-box',
        type: 'warning',
        center: true
      }).then(()=>{
        that.appEditStatus(rows, 1);
      });
    },
    deleteApp(that, { rows }) {
      that.$confirm('是否确认删除APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
        customClass: 'zdy-message-box',
        type: 'warning',
        center: true
      }).then(()=>{
        that.appEditStatus(rows, 2);
      });
    },
    appEditStatus(rows, status) {
      this.$fetch('appEditStatus', {
        id: rows.id,
        status: status
      }).then(res =>{
        if (res && res.code === 200) {
          this.$message.success(['停用','启用','删除'][status]);
          // 刷新数据
          this.initPage();
        } else {
          this.$message.success(res.msg);
        }
      }).catch( e =>{
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .top{
    margin-bottom: 20px;
  }
  .tips{
    font-size: 14px;

    margin-left: 10px;
    a{
      text-decoration: underline;
    }
  }
  .developmentWrap{
    padding: 32px 24px;
    background: #fff;
  }
</style>
