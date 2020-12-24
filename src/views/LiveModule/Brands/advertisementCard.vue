<template>
  <div class="advertisement-card">
    <div class="title-data">
      <span>广告推荐</span>
    </div>
    <div class="advertisement-main">
      <div class="search-data">
        <el-button type="primary" @click="createAdvise()" round>创建</el-button>
        <el-button class="head-btn set-upload" round @click="createCenter()" v-if="$route.path !='/material/advertCard'">资料库</el-button>
        <el-button class="head-btn set-upload" round @click="allDelete(null)">批量删除</el-button>
        <span class="searchTitle">
          <el-input v-model="paramsObj.keyword" placeholder="请输入标题"
          suffix-icon="el-icon-search" @change="initPage()"></el-input>
        </span>
      </div>
      <el-card>
         <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getAdvTableList"
          @changeTableCheckbox="changeTableCheckbox"
          >
        </table-list>
      </el-card>
      <create-advise ref="adviseSonChild" :title="title" :advInfo="advInfo" @reload="initPage"></create-advise>
    </div>
  </div>
</template>
<script>
import createAdvise from './components/createAdvise';
export default {
  data() {
    return {
      title: '创建',
      advInfo: {},
      adv_ids: [],
      paramsObj: {
        keyword: ''
      },
      pos: 0,
      limit: 10,
      totalNum: 0,
      tableList: [],
      tabelColumn: [
       {
          label: '图片',
          key: 'img_url',
        },
        {
          label: '标题',
          key: 'subject',
        },
        {
          label: '链接',
          key: 'url',
        },
        {
          label: '创建时间',
          key: 'created_at',
        }
      ],
      tableRowBtnFun:[
        {
          name: '编辑',
          methodName: 'edit'
        },
        {
          name: '删除',
          methodName: 'delete'
        }
      ],
      selectedTableItem: []
    };
  },
  components: {
    createAdvise
  },
  mounted() {
    this.getAdvTableList();
  },
  methods: {
    initPage() {
      this.getAdvTableList();
    },
    getAdvTableList() {
       let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      if (this.paramsObj.keyword) {
        this.$refs.tableList.clearSelect();
        pageInfo.pos = 0;
        pageInfo.pageSize = 1;
      }
      let params = {
        keyword: this.paramsObj.keyword,
        pos: pageInfo.pos,
        limit: pageInfo.limit,
        webinar_id: this.$route.params.str || ''
      };

      this.$fetch('getAdvList', this.$params(params)).then(res => {
        this.totalNum = res.data.total;
        this.tableList = res.data.adv_list;
      });
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    edit(that, { rows }) {
      that.title = '编辑';
      that.advInfo = rows;
      console.log(rows, '111111111')
      that.$refs.adviseSonChild.dialogVisible = true;
    },
    delete(that, { rows }) {
      that.deleteConfirm(rows.adv_id);
    },
    deleteConfirm(id) {
      this.$confirm('是否删除当前广告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$fetch('deleteAdv',this.$params({
          adv_ids: id,
          webinar_id: this.$route.params.str
        })).then(res => {
          if (res && res.code === 200) {
              this.$message.success('删除成功');
              // 刷新页面
            this.adv_ids = [];
            this.$refs.tableList.clearSelect();
            this.initPage();
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        });
      }).catch(() => {});
    },
    allDelete(id) {
      if(this.adv_ids.length <= 0) {
          this.$message.error('请至少选择一条记录删除');
          return;
        } else {
          id = this.adv_ids.join(',');
          this.deleteConfirm(id);
        }
    },
    changeTableCheckbox(val) {
      console.log(val);
      this.adv_ids = val.map(item => item.adv_id);
    },
    createAdvise(title) {
      this.title = '创建';
      this.advInfo = {};
      this.$refs.adviseSonChild.dialogVisible = true;
    },
    createCenter() {
      this.$refs.adviseSonChild.dialogAdverVisible = true;
      this.$refs.adviseSonChild.activityData();
    }
  }
};
</script>
<style lang="less">
.advertisement-card {
  .title-data {
    margin: 10px 0 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
    }
    .button-tip {
      vertical-align: top;
    }
  }
  .advertisement-main{
    .el-card__body{
      padding: 32px 24px;
    }
    .search-data{
      margin-bottom: 30px;
    }
    .searchTitle{
      float: right;
      width: 200px;
      /deep/.el-button{
        border-radius: 20px;
      }
      /deep/.el-input__inner{
        border-radius: 20px;
      }
    }
  }
}
</style>
