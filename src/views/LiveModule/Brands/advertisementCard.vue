<template>
  <div class="advertisement-card">
    <div class="title-data">
      <span>广告推荐</span>
    </div>
    <div class="advertisement-main">
      <div class="search-data">
        <el-button type="primary" @click="createAdvise('advise')">创建</el-button>
        <el-button type="primary" @click="createAdvise('data')">资料库</el-button>
        <el-button type="primary">批量删除</el-button>
        <span class="searchTitle">
          <el-input v-model="searchTitle" placeholder="请输入标题"></el-input>
        </span>
      </div>
      <table-list
        ref="tableListBox"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :isHandle="isHandle"
        :width="width"
        :totalNum="totalNum"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
        @changeTableCheckbox="changeTableCheckbox"
        >
      </table-list>
      <create-advise ref="advise"></create-advise>
      <data-box ref="data"></data-box>
    </div>
  </div>
</template>
<script>
import createAdvise from './components/createAdvise';
import dataBox from './components/dataCenter';
export default {
  data() {
    return {
      searchTitle: '',
      isCheckout: true,
      isHandle: true,
      totalNum: 100,
      width: 150,
      tableList: [
        {
          img: '@/common/images/v35-webinar.png',
          title: '标题1111',
          url: 'http://vhall.com',
          time: "2020-10-10",
        },
        {
          img: '@/common/images/v35-webinar.png',
          title: '标题22222',
          url: 'http://vhall.com',
          time: "2020-10-12",
        }
      ],
      tabelColumn: [
       {
          label: '图片',
          key: 'img',
          width: 120
        },
        {
          label: '标题',
          key: 'title',
          width: 200
        },
        {
          label: '链接',
          key: 'url',
          width: 150
        },
        {
          label: '创建时间',
          key: 'time',
          width: 120
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
    dataBox
  },
  methods: {
    getTableList() {
      let pageInfo = this.$refs.tableListBox.pageInfo;
      console.log(pageInfo);
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    edit(that, row) {
      console.log(row, '编辑');
    },
    delete(that, row) {
      console.log(row, '删除');
    },
    changeTableCheckbox(val) {
      console.log(val);
    },
    createAdvise(ref) {
      this.$refs[ref].dialogVisible = true;
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
    .search-data{
      margin-bottom: 30px;
    }
    .searchTitle{
      float: right;
      width: 200px;
    }
  }
}
</style>
