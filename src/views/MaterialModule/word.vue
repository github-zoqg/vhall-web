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
      <el-upload
        class="btn-upload"
        :action=actionUrl
        :headers="{token: token}"
        :data=saveData
        name="resfile"
        :show-file-list=false
        :on-success='uploadSuccess'
        :on-error="uploadError"
        :before-upload="beforeUploadHandler"
        :on-preview="uploadPreview"
      >
        <el-button round type="primary" size="medium">上传</el-button>
      </el-upload>
      <el-button round @click.prevent.stop="wordMultiDel" size="medium">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="initPage"
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
import Env from '@/api/env.js';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'word.vue',
  data() {
    return {
      token: sessionOrLocal.get('token'),
      saveData: {
        path: 'webinar/document',
        type: 1, // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
      },
      actionUrl: `${Env.BASE_URL}/v3/interacts/document/upload-webinar-document`,
      formParams: {},
      totalNum: 0,
      tableList: [],
      tabelColumn: [
        {
          label: '文档名称',
          key: 'file_name',
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
          methodName: 'deleteHandle'
        }
      ],
      searchAreaLayout: [
        {
          type: "",
          key: "searchTitle",
        }
      ],
      multipleSelection: [],
      showDialog: false,
      docParam: {}
    };
  },
  components: {
    PageTitle,
    DocPreview
  },
  methods: {
    uploadSuccess(res, file, fileList){
      console.log(res, file, fileList);
      if(res.code !== 200) {
        this.$message.error(res.msg || '上传失败');
      } else {
        // 判断文件上传情况
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['doc','docx','xls','xlsx','ppt','pptx','jpeg','jpg','png','bmp'];
      let fileNameArr = file.name.split('.');
      let lastFileKey = fileNameArr[fileNameArr.length - 1];
      console.log(lastFileKey);
      const isType = typeList.includes(lastFileKey.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isType) {
        this.$message.error(`上传文件只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!');
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`标志上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    // 批量删除
    wordMultiDel() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.$confirm('是否确认删除', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          let ids = this.multipleSelection.map(item => {
            return item.document_id;
          });
          this.deleteSend({
            document_id: ids.join(',')
          })
        }).catch(() => {
        });
      } else {
        this.$message({
          type: 'error',
          message: '请至少选择一条记录进行删除'
        });
      }
    },
    // 获取文档列表数据
    getTableWordList(pageInfo = {pos: 0, limit: 10, pageNumber: 1}) {
      let params = {
        pos: pageInfo.pos,
        limit: pageInfo.limit,
        keyword: this.formParams.keyword,
        type: 1
      };
      this.$fetch(this.$route.params.str ? 'getWebinarWordList' : 'getWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.totalNum = res.data.total;
          this.tableList = res.data.list;
        } else {
          this.totalNum = 0;
          this.tableList = [];
        }
      }).catch(e => {
        console.log(e);
        this.totalNum = 0;
        this.tableList = [];
      }).finally(()=>{
      });
    },
    // 预览
    preShow(that, { rows }) {
      console.log('预览', rows);
      that.showDialog = true;
    },
    // 删除
    deleteHandle(that, { rows }) {
      console.log('删除', rows);
      that.$confirm(this.$route.params.str ? '确认删除？' : '该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.deleteSend(rows);
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteSend(rows) {
      let params = {
        ids: rows.document_id,
        tag: this.$route.params.str ? 1 : 2,
        webinar_id: this.$route.params.str
      };
      this.$fetch('delWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.$message.success('删除成功');
          this.$refs.tableListWord.clearSelect();
          this.initPage();
        } else {
          this.$message.error(res.msg || '删除失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error(e.msg || '删除失败');
      }).finally(()=>{
      });
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    initPage() {
      this.getTableWordList();
    }
  }
};
</script>
<style lang="less" scoped>
.btn-upload {
  display: inline-block;
  margin-right: 16px;
  /deep/.el-upload {
    width: auto;
    height: auto;
    line-height: unset;
    background: transparent;
    border: none;
  }
}
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
