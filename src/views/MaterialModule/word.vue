<template>
  <div class="word-wrap">
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
    <!-- 无权限，未创建 -->
    <div v-if="no_show">
      <null-page text="您还没有文档，快来上传吧" nullType="noAuth">
        <el-upload
          class="btn-upload"
          :action=actionUrl
          :headers="{token: token, platform: 17}"
          :data=saveData
          name="resfile"
          :show-file-list=false
          :on-success='uploadSuccess'
          :on-error="uploadError"
          :before-upload="beforeUploadHandler"
          :on-preview="uploadPreview"
        >
          <el-button round type="primary" class="length152">上传</el-button>
        </el-upload>
      </null-page>
    </div>
    <div v-else>
      <div class="head-operat">
        <el-upload
          class="btn-upload"
          :action=actionUrl
          :headers="{token: token, platform: 17}"
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
        <el-button type="primary" round @click="openCheckWord" size="medium" v-if="$route.params.str">资料库</el-button>
        <el-button round @click="wordMultiDel" size="medium">批量删除</el-button>
        <el-input
          class="head-btn search-tag"
          placeholder="请输入文档名称"
          v-model="formParams.keyword"
          @keyup.enter.native="initPage">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="initPage">
          </i>
        </el-input>
      </div>
      <el-card class="word-list">
        <table-list
          ref="tableListWord"
          v-if="totalNum > 0"
          scene="word"
          :manageTableData="tableList"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          max-height="auto"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getTableWordList"
          @changeTableCheckbox="changeTableCheckbox"
        >
        </table-list>
        <null-page text="未搜索到相关内容" nullType="search" v-if="totalNum === 0"></null-page>
      </el-card>
    </div>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
        <doc-preview ref="videoPreview" :docParam='docParam' v-if="docParam"></doc-preview>
      </el-dialog>
    </template>
    <!-- 文档列表 -->
    <select-word ref="dialogWordComp" @reload="getTableWordList"></select-word>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import DocPreview from './DocPreview/index.vue';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import Env from '@/api/env.js';
import SelectWord from './components/selectWord.vue';

import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'word.vue',
  components: {
    PageTitle,
    DocPreview,
    NullPage,
    SelectWord
  },
  data() {
    return {
      no_show: false,
      token: sessionOrLocal.get('token', 'localStorage') || '',
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/interacts/document/upload-webinar-document`,
      formParams: {
        keyword: ''
      },
      totalNum: 0,
      tableList: [],
      tableColumn: [
        {
          label: '文档名称',
          key: 'file_name',
        },
        {
          label: '上传时间',
          key: 'created_at',
        },
        {
          label: '页码',
          key: 'page',
        },
        {
          label: '进度',
          key: 'progress',
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
      docParam: null,
      dialogVisible: false,
      dialogTotal: 0,
      dialogTableList: [],
      dialogMulti: []
    };
  },
  computed: {
    saveData: function() {
      let data = {
        path: 'interacts/docs',
        type: 1, // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
      }
      if(this.$route.params.str) {
        // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
        data.type = 0;
        data.webinar_id = this.$route.params.str;
      } else {
        data.type = 1;
      }
      return data;
    },
  },
  methods: {
    uploadSuccess(res, file, fileList){
      console.log(res, file, fileList);
      if(res.code !== 200) {
        this.$message.error(res.msg || '上传失败');
      } else {
        this.$message.success('上传成功');
        if (this.$route.params.str) {
          // 弹出框提示是否同步
          this.$confirm('是否同步到资料库?', '提示', {
            confirmButtonText: '同步',
            cancelButtonText: '不同步',
            customClass: 'zdy-message-box'
          }).then(() => {
            // 同步到资料库
            this.asyncWord(res);
          }).catch(() => {
            // 取消同步，刷新列表
            this.initPage();
          });
        } else {
          // 判断文件上传情况
          this.initPage();
        }
      }
    },
    asyncWord(resV) {
      let params = {
        document_id: resV.data.document_id,
        tag: 1, // 1：同步到资料库 ，2：同步到活动
        webinar_id: this.$route.params.str
      }
      this.$fetch('asyncWordInfo', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.$message.success('同步成功');
          try {
            this.$nextTick(() => {
              this.$refs.tableListWord.clearSelect();
            })
          } catch(e) {
            console.log(e);
          }
        } else {
          this.$message.error(res.msg || '同步失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error(e.msg || '同步失败');
      }).finally(()=>{
        this.initPage();
      });
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
    // 从资料库选择文档
    openCheckWord() {
      this.dialogVisible = true;
      this.$refs.dialogWordComp.initComp();
    },
    // 批量删除
    wordMultiDel() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.$confirm('删除后将会影响文档演示和观看，确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          let ids = this.multipleSelection.map(item => {
            return item.id;
          });
          this.deleteSend({
            id: ids.join(',')
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
        type: 1,
        webinar_id: this.$route.params.str
      };
      this.$fetch(this.$route.params.str ? 'getWebinarWordList' : 'getWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.totalNum = res.data.total;
          this.no_show = this.totalNum === 0 && this.formParams.keyword === '';
          let list = res.data.list;
          list.map(item => {
            // 转换状态 0待转换 100转换中 200完成 500失败
            let statusStr = {
              0: '等待转码',
              100: '转码中',
              200: '转码完成',
              500: '转码失败'
            }
            item.progress = statusStr[item.status];
          })
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
      that.docParam = rows;
    },
    // 删除
    deleteHandle(that, { rows }) {
      console.log('删除', rows);
      that.$confirm(that.$route.params.str ? '删除后将会影响文档演示和观看，确定删除？' : '删除后将会影响文档演示和观看，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
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
        ids: rows.id,
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
  },
  created() {
    this.initPage();
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
.word-wrap {
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
        padding: 0 10px 10px;
      }
    }
  }
  .head-operat{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .head-btn{
      display: inline-block;
      margin-left: auto;
    }
    .el-input{
      width: 220px;
      .el-input__icon{
        cursor: pointer;
      }
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
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
