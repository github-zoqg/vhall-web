<template>
  <div class="advertisement-card">
    <div class="title-data">
      <span>广告推荐</span>
    </div>
    <div class="advertisement-main">
      <div class="search-data">
        <el-button type="primary" @click="createAdvise()" round>创建</el-button>
        <el-button class="head-btn set-upload" round @click="createCenter()" v-if="$route.meta.title==='品牌—广告推荐'">资料库</el-button>
        <el-button class="head-btn set-upload" round @click="allDelete">批量删除</el-button>
        <span class="searchTitle">
          <el-input v-model="paramsObj.keyword" placeholder="请输入标题"></el-input>
        </span>
      </div>
      <el-card>
         <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          :restPic="true"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getAdvTableList"
          @changeTableCheckbox="changeTableCheckbox"
          >
        </table-list>
      </el-card>
      <create-advise ref="advise" :title="title" :advInfo="advInfo"></create-advise>
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
      totalNum: 100,
      tableList: [
        {
          img_url: '@/common/images/v35-webinar.png',
          subject: '标题1111',
          url: 'http://vhall.com',
          created_at: "2020-10-10",
        },
        {
          img_url: '@/common/images/v35-webinar.png',
          subject: '标题22222',
          url: 'http://vhall.com',
          created_at: "2020-10-12",
        }
      ],
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
          name: '复制',
          methodName: 'cope'
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
    getAdvTableList() {
      let pageInfo = this.$refs.tableList.pageInfo;
      if (this.paramsObj.keyword) {
        pageInfo.pageNum = 1;
        pageInfo.pos = 0;
        this.$refs.tableList.clearSelect();
      }
      this.paramsObj.webinar_id = '123123';
      let obj = Object.assign({}, pageInfo, this.paramsObj);
      console.log(obj);
      this.$fetch('getAdvList', obj).then(res => {
        // this.totalNum = res.data.total;
        this.tableList = res.data.adv_list;
        console.log(res.data, '111111111111111111');
      });
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    edit(that, { rows }) {
      that.title = '编辑';
      that.advInfo = rows;
      console.log(that.advInfo, '00000000000000');
      that.$refs.advise.dialogVisible = true;
    },
    delete(that, row) {
      console.log(row, '删除');
    },
    allDelete() {
      this.$fetch('deleteAdv', this.adv_ids).then(res => {
         if (res.msg === 'success' && res.code === 200) {
          this.$message.success('删除成功');
        }
      });
    },
    changeTableCheckbox(val) {
      console.log(val);
      this.adv_ids = val.map(item => item.id);
    },
    createAdvise(title) {
      this.title = '创建';
      this.advInfo = {};
      this.$refs.advise.dialogVisible = true;
    },
    createCenter() {
      this.$refs.advise.dialogAdverVisible = true;
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
      font-family: PingFangSC-Semibold, PingFang SC;
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
