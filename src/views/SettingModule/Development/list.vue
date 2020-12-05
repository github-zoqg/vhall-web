<template>
  <div class="developmentWrap" v-loading="fetching" element-loading-text="获取数据中">
    <pageTitle title="开发设置"></pageTitle>
    <p class="top">
      <el-button type="primary" round @click="createApp" :disabled="!(available_num > 0)">创建应用</el-button>
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
export default {
  data(){
    return{
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
      available_num: 5,
      fetching: false
    };
  },
  created(){
    this.getTableList({pos: 0});
  },
  components: {
    PageTitle,
    DevTable
  },
  mounted(){

  },
  methods: {
    createApp(){
      /**
       * 1、创建数量有限制，超过默认创建数量后置灰（默认5个）
       * 2、点击后弹窗提示：如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970
       */
      this.$fetch('createApp', {}).then(res => {
        console.log('getAppList', res);
        if(res && res.code === 200) {
          this.$router.push({path: `/dev/${res.data.id}`});
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
    getTableList(params) {
      if (params && params === 'search') {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        pageInfo.pageNum= 1;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      // let obj = Object.assign({}, pageInfo);
      this.fetching = true;
      this.$fetch('getAppList', {pos: params.pos, limit: 10}).then(res => {
        console.log('getAppList', res);
        if(res && res.code === 200) {
          let list = res.data.list || [];
          list[0].status = 1;
          list[1].status = 0;
          list.map(item => {
            item.statusStr = ['已停用', '已启用'][item.status];
          });
          this.tableList = list || [];
          this.totalNum = res.data.total || 0;
          this.available_num = res.data.available_num || Number(5-this.totalNum);
        } else {
          this.tableList = [];
          this.totalNum = 0;
          this.available_num = 5;
        }
      }).catch(error=>{
        console.log(error);
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
      }).then(()=>{
        that.appEditStatus(rows, 0);
      });
    },
    restartApp(that, { rows }) {
      that.$confirm('是否确认启用APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
      }).then(()=>{
        that.appEditStatus(rows, 1);
      });
    },
    deleteApp(that, { rows }) {
      that.$confirm('是否确认删除APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
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
          that.$message.success(['停用','启用','删除'][status]);
        } else {
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
