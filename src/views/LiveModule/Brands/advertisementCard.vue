<template>
  <div class="advertisement-card">
    <div class="title-data">
      <span>广告</span>
    </div>
    <div class="advertisement-main">
      <div class="search-data" v-show="total || isSearch">
        <el-button size="medium" class="length104" type="primary" @click="createAdvise()" round>创建广告</el-button>
        <el-button size="medium" class="head-btn length104 transparent-btn" round @click="createCenter()" v-if="$route.path !='/material/advertCard'">资料库</el-button>
        <el-button size="medium" class="head-btn length104 transparent-btn" round @click="allDelete(null)" :disabled="!adv_ids.length">批量删除</el-button>
        <VhallInput
          class="search-tag"
          placeholder="请输入广告标题"
          v-model="paramsObj.keyword"
          clearable
          v-clearEmoij
          @clear="searchAdvTableList"
          @keyup.enter.native="searchAdvTableList">
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="searchAdvTableList">
          </i>
        </VhallInput>
      </div>
      <div class="no-live" v-if="!total && !isSearch">
        <noData :nullType="'nullData'" :text="'您还没有广告，快来创建吧！'">
          <el-button type="primary"  round @click="createAdvise()" v-preventReClick>创建广告</el-button>
          <el-button type="white-primary" class="length152" round v-if="$route.path !='/material/advertCard'" @click="createCenter()"  v-preventReClick>资料库</el-button>
        </noData>
      </div>
      <div class="advert-card-list" v-show="total || isSearch">
         <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="total"
          :width="120"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getAdvTableList"
          @changeTableCheckbox="changeTableCheckbox"
          >
        </table-list>
        <noData :nullType="'search'" v-if="!total"></noData>
      </div>
      <create-advise ref="adviseSonChild" :advInfo="advInfo" @reload="getAdvTableList" :maxTotal="total"></create-advise>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4&&$route.path !='/material/advertCard'"></begin-play>
  </div>
</template>
<script>
import createAdvise from './components/createAdvise';
import noData from '@/views/PlatformModule/Error/nullPage';
import {sessionOrLocal} from "@/utils/utils";
import beginPlay from '@/components/beginBtn';
export default {
  data() {
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      advInfo: {},
      adv_ids: [],
      paramsObj: {
        keyword: ''
      },
      pos: 0,
      limit: 10,
      total: 0,
      isSearch: false, //是否是搜索
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
    noData,
    beginPlay
  },
  mounted() {
    this.getAdvTableList();
  },
  methods: {
    searchAdvTableList() {
      this.getAdvTableList('search')
    },
    getAdvTableList(param) {
       let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      if (param == 'search') {
        pageInfo.pos = 0;
        pageInfo.pageNum = 1;
      }
      let params = {
        keyword: this.paramsObj.keyword,
        pos: pageInfo.pos,
        limit: pageInfo.limit,
        webinar_id: this.$route.params.str || ''
      };
      this.isSearch = this.paramsObj.keyword ? true : false;
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
      that.advInfo = rows;
      console.log(that.advInfo, '?????????????')
      that.$refs.adviseSonChild.dialogVisible = true;
    },
    delete(that, { rows }) {
      that.deleteConfirm(rows.adv_id);
    },
    deleteConfirm(id) {
      this.$confirm('是否删除当前广告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('deleteAdv',this.$params({
          adv_ids: id,
          webinar_id: this.$route.params.str
        })).then(res => {
          if (res && res.code === 200) {
            this.$message({
              message: `删除成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
              // 刷新页面
            this.$refs.tableList.clearSelect();
            this.getAdvTableList('search');
            this.adv_ids = [];
          } else {
            this.$message({
              message: res.msg || `删除失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          }
        }).catch((res) => {
          this.$message({
            message: res.msg || `删除失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      })
    },
    allDelete(id) {
      id = this.adv_ids.join(',');
      this.deleteConfirm(id);
    },
    changeTableCheckbox(val) {
      console.log(val);
      this.adv_ids = val.map(item => item.adv_id);
    },
    createAdvise(title) {
      if (this.$route.path !='/material/advertCard' && this.total >= 50) {
        this.$message({
          message: `广告推荐个数已达到最大个数限制，请删除后再进行添加`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.advInfo = {};
      this.$refs.adviseSonChild.dialogVisible = true;
    },
    createCenter() {
      this.$refs.adviseSonChild.dialogAdverVisible = true;
      // this.$refs.adviseSonChild.activityData();
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
    margin: 0 0 20px 0;
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
    /* .searchTitle{
      float: right;
      width: 220px;
      /deep/.el-button{
        border-radius: 20px;
      }
      /deep/.el-input__inner{
        border-radius: 20px;
      }
    } */
    .search-tag {
      float: right;
      width: 220px;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        line-height: 36px;
        padding-right: 30px!important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
}
.no-live{
  /deep/.btn-list .el-button {
    &:last-child{
      margin: 0;
    }
  }
}
</style>
