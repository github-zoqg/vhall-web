<template>
  <div class="developmentWrap" v-loading="fetching" element-loading-text="获取数据中">
    <pageTitle title="开发设置"></pageTitle>
    <p class="top">
      <el-button type="primary" round @click="createApp">创建应用</el-button>
      <span class="tips">
        使用说明：当添加多个包时，使用<a href="https://www.vhall.com/index.php?r=doc/index/index#verify/access-token_%E8%8E%B7%E5%8F%96SDK%E7%9B%B4%E6%92%AD%E6%93%8D%E4%BD%9Ctoken" target="_blank">获取SDK直播操作token</a>的API时需要传app_key参数以确保双方加密数据一致
      </span>
    </p>
    <table-list
      ref="tableList"
      :manageTableData="tableList"
      :tabelColumnLabel="tabelColumn"
      :tableRowBtnFun="tableRowBtnFun"
      :isHandle="isHandle"
      :totalNum="totalNum"
      @onHandleBtnClick="onHandleBtnClick"
      @getTableList="getTableList"
    >
    </table-list>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  data(){
    return{
      sCheckout: false,
      totalNum: 1000,
      isHandle: true,
      tableList: [
        {
          id: '123456',
          app_name: "哈哈哈哈哈",
          app_key: 'frwe65780ftytuj534511fcabec99383',
          created_time: '30:00:00',
          updated_time: '30:00:00',
          status: '1',
          statusText: '使用中'
        },
        {
          id: '789000',
          app_name: "1435ergrg份未发",
          app_key: '21786da084260b1f11865fcabec99383',
          created_time: '30:00:00',
          updated_time: '30:00:00',
          status: '2',
          statusText: '已停用'
        },
      ],
      tabelColumn: [
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
          key: 'created_time',
          width: 120
        },
        {
          label: '更新时间',
          key: 'updated_time',
          width: 120
        },
        {
          label: '状态',
          key: 'status',
          width: 150
        }
      ],
      tableRowBtnFun: [
        {
          name: '查看',
          methodName: 'viewApp',
        },
        {
          name: '停用',
          methodName: 'stopApp',
        },
        {
          name: '删除',
          methodName: 'deleteApp',
        }
      ],
      fetching: false
    };
  },
  created(){
    this.getTableList({pos: 0});
  },
  components: {
    PageTitle,
  },
  mounted(){

  },
  methods: {
    createApp(){
      /**
       * 1、创建数量有限制，超过默认创建数量后置灰（默认5个）
       * 2、点击后弹窗提示：如需创建更多应用，请咨询您的客户经理或拨打客服电话：400-888-9970
       */
      this.$router.push({path: '/dev/add'});
    },
    onHandleBtnClick(val) {
      this[val.type] && this[val.type](val);
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
        // this.tableList = res.data.list || [];
        // this.totalNum = res.data.total || 0;
      }).catch(error=>{
        this.$message.error(`应用信息获取失败，${error.$message}`);
      }).finally(()=>{
        this.fetching = false;
      });
    },
    viewApp(val){
      console.log('查看', val, `/dev/${val.id}`);
      this.$router.push({path: `/devDetail/${val.rows.id}`});
    },
    stopApp(val){
      this.$confirm('是否确认停用APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
      }).then(()=>{
        this.$message.success('已停用');
      });
    },
    restartApp(val){
      this.$confirm('是否确认启用APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
      }).then(()=>{
        this.$message.success('已启用');
      });
    },
    deleteApp(val){
      this.$confirm('是否确认删除APP？', '提示', {
        confirmButtonText: '确定',
        showClose: true,
      }).then(()=>{
        this.$message.success('已删除');
      });
    },
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
