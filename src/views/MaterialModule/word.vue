<template>
  <div class="video-wrap">
    <pageTitle title="文档">
      <div slot="content">
        1.支持的文档格式: doc/docx，xls/xlsx，ppt/pptx，pdf，jpeg/jpg，png，bmp
        <br>
        2.上传的文档内容不能超过200页，不超过100M
        <br>
        3.如果ppt格式转换失败或文档打开失败请尝试用office转为pdf后上传
        <br>
        4.直播过程中发现ppt自动翻页，请检查源文件是否设置自动放映
        <br>
        5.文档转换较慢，请于直播前提前上传
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button round type="primary" class="head-btn set-upload">上传 <input ref="upload" class="set-input" type="file" @change="tirggerFile($event)"> </el-button>
      <el-button round class="head-btn batch-del">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableWordList('search')"
        >
      </search-area>
    </div>
    <el-card class="word-list">
      <table-list
        ref="tableListWord"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :totalNum="totalNum"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableWordList"
        @changeTableCheckbox="changeTableCheckbox"
        >
      </table-list>
    </el-card>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
        <doc-preview ref="videoPreview" :docParam='docParam'></doc-preview>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import DocPreview from './DocPreview/index.vue';
export default {
  name: 'word.vue',
  data() {
    return {
      formParams: {},
      totalNum: 100,
      tableList: [
        {
          time: '2016-04-06',
          page: '1',
          progress: '30',
          wordName: '上区金沙江路 1518 弄',
        },
        {
          time: '2016-05-03',
          page: '20',
          progress: '30',
          wordName: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      tabelColumn: [
        {
          label: '文档名称',
          key: 'wordName',
        },
        {
          label: '进度',
          key: 'progress',
        },
        {
          label: '页码',
          key: 'page',
        },
        {
          label: '上传时间',
          key: 'time',
        }
      ],
      tableRowBtnFun: [
        {
          name: '预览',
          methodName: 'preShow'
        },
        {
          name: '删除',
          methodName: 'delete'
        }
      ],
      searchAreaLayout: [
        {
          type: "",
          key: "searchTitle",
        }
      ],
      fileList: [],
      accept: 'png|jpg|jpeg|bmp|gif|doc|mp4',
      showDialog: false,
      docParam: {}
    };
  },
  components: {
    PageTitle,
    DocPreview
  },
  methods: {
    getTableWordList(params) {
      let pageInfo = this.$refs.tableListWord.pageInfo; //获取分页参数
      if (params === 'serach') {
        pageInfo.pageNum = 1;
        pageInfo.pos = 0;
      }
      let obj = Object.assign({}, pageInfo, this.formParams);
      console.log(obj);
    },
    // 预览
    preShow(that, { rows }) {
      console.log('预览', rows);
      that.showDialog = true;
    },
    // 删除
    delete(that, { rows }) {
      console.log('删除', rows);
        that.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          that.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    changeName() {
      this.getTableWordList('serach');
    },
    uploadSucess(msg) {
      console.log('上传成功', msg);
    },
    before(file) {
      console.log(file, 999);
      this.$fetch('test', { file: file })
        .then((res) => {
          console.log(res, 7);
        })
        .catch((err) => {
          console.log(err, 8);
        });
    },
    closeBefore(done){
      done();
    }
  }
};
</script>
<style lang="less" scoped>
.video-wrap {
  height: 100%;
   .word-list{
    width: 100%;
  }
  /deep/.el-card__body{
    padding: 32px 24px;
  }
  ::v-deep .vh-dialog{
    .el-dialog{
      width: 960px!important;
      height: 623px;
      .el-dialog__body{
        height: calc(100% - 44px);
      }
      .el-dialog__header{
        padding-top: 10px;
      }
      .el-dialog__headerbtn{
        top: 15px;
      }
      .el-dialog--center .el-dialog__body{
        padding: 0px 10px 10px;
      }
    }
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    ::v-deep.set-upload{
      position: relative;
      span{
        input{
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
