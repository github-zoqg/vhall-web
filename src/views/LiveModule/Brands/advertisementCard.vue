<template>
  <div class="advertisement-card">
    <div class="title-data">
      <span>广告推荐</span>
    </div>
    <div class="advertisement-main">
      <div class="search-data" v-show="total || isSearch">
        <el-button size="medium" class="length104" type="primary" @click="createAdvise()" v-preventReClick round>创建</el-button>
        <el-button size="medium" class="head-btn length104" round @click="createCenter()" v-if="$route.path !='/material/advertCard'" v-preventReClick>资料库</el-button>
        <el-button size="medium" class="head-btn length104" round @click="allDelete(null)" v-preventReClick>批量删除</el-button>
        <span class="searchTitle">
          <el-input v-model.trim="paramsObj.keyword" placeholder="请输入标题"
          suffix-icon="el-icon-search" clearable @change="initPage()"></el-input>
        </span>
      </div>
      <div class="advert-card-list" v-show="total">
         <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="total"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getAdvTableList"
          @changeTableCheckbox="changeTableCheckbox"
          >
        </table-list>
      </div>
      <div class="no-live" v-show="!total">
        <noData :nullType="nullText" :text="text">
          <el-button type="primary" v-if="nullText == 'nullData'" round @click="createAdvise()" v-preventReClick>创建广告</el-button>
        </noData>
      </div>
      <create-advise ref="adviseSonChild" :title="title" :advInfo="advInfo" @reload="initPage"></create-advise>
    </div>
  </div>
</template>
<script>
import createAdvise from './components/createAdvise';
import noData from '@/views/PlatformModule/Error/nullPage';
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
      total: 0,
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还没有广告，快来创建吧！',
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
    createAdvise,
    noData
  },
  mounted() {
    this.getAdvTableList();
  },
  methods: {
    initPage() {
      this.getAdvTableList();
      // this.$refs.tableList.clearSelection();
      this.pos = 0;
      this.limit = 10;
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
      if (this.paramsObj.keyword) {
          this.nullText = 'search';
          this.text = '';
          this.isSearch = true;
        } else {
          this.nullText = 'nullData';
          this.text = '您还没有广告，快来创建吧！';
          this.isSearch = false;
        }
      this.$fetch('getAdvList', this.$params(params)).then(res => {
        this.total = res.data.total;
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
.advert-card-list {
  .layout--right--main();
  .padding-table-list();
  .min-height();
}
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
