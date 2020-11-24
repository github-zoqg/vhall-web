<template>
  <div>
  <VhallDialog
      title="资料库"
      :visible.sync="dataBaseVisible"
      :close-on-click-modal="false"
      width="50%">
      <div class="data-base">
        <div class="data-search">
          <el-input v-model="searchData" suffix-icon="el-icon-search" placeholder="搜索问卷名称" style="width: 200px"></el-input>
        </div>
        <el-scrollbar>
          <div class="data-base-list">
            <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
            :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @changeTableCheckbox="changeTableCheckbox" @getTableList="getTableList">
            </table-list>
          </div>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button round @click.prevent.stop="dataBaseVisible = false">取 消</el-button>
          <el-button round type="primary" @click.prevent.stop="dataBaseVisible">确 定</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      total: 1,
      dataBaseVisible: false,
      searchData: '',
      tabelColumn: [
        {
          label: '标题',
          key: 'title',
        },
        {
          label: '更新时间',
          key: 'time',
        }
      ],
      tableRowBtnFun: [
        {name:'预览', methodName: 'preview'}
      ],
      tableData: [
        {
          id: '12312413',
          title: '请输入000',
          time: '2020-10-03',
        },
        {
          id: '1212345',
          title: '请输入111',
          time: '2020-10-12',
        },
         {
          id: '12312413',
          title: '请输入000',
          time: '2020-10-03',
        },
        {
          id: '1212345',
          title: '请输入111',
          time: '2020-10-12',
        },
         {
          id: '12312413',
          title: '请输入000',
          time: '2020-10-03',
        },
        {
          id: '1212345',
          title: '请输入111',
          time: '2020-10-12',
        },
         {
          id: '12312413',
          title: '请输入000',
          time: '2020-10-03',
        },
        {
          id: '1212345',
          title: '请输入111',
          time: '2020-10-12',
        }
      ]
    };
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList() {
      let params = {
        title: this.searchData
      };
      console.log(params);
    },
     // 预览
    preview(that, {rows}) {
      console.log('预览', rows);
      that.$parent.$refs.isPreQuestion.dialogVisible = true;
      console.log(that.$parent.$refs.isPreQuestion.dialogVisible);
      // that.$refs.isPreQuestion.dialogVisible = true;
    },
     // 选中
    changeTableCheckbox(val) {
      console.log(val);
    },
  }
};
</script>
<style lang="less" scoped>
.data-base-list {
  width: 100%;
  margin: 24px 0;
  max-height: 300px;
}
.dialog-footer{
  padding:24px 0;
}
</style>
