<template>
  <div>
    <pageTitle title="聊天严禁词" iconCssType="gary">
      <div slot="content">
        1.聊天、评论，包含关键词自动过滤,适用于所有直播。垃圾信息系统已过滤无需添加
        <br/>
        2.批量上传时每个关键词的长度为1~20个字符，超出范围的会自动丢弃
      </div>
    </pageTitle>
    <div>
      <el-button type="primary" @click.prevent.stop="setKeyWordShow" class="length104" size="medium" round>设置</el-button>
      <a :href="downloadHref" class="btn-a">
        <el-button class="length104" size="medium" round v-if="downloadHref">
          下载模板
        </el-button>
      </a>
    </div>
    <div class="setting-chat-main">
      <el-form :model="chatForm" ref="chatForm" label-width="120px">
        <el-form-item label="严禁词列表">
          <div class="words-white">
            {{checkNames && checkNames.length > 0 ? checkNames.join('，') : '暴力、政治敏感、严禁词，逗号隔开、固定宽度换行'}}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 聊天严禁词弹出框 -->
    <VhallDialog width="800px" title="聊天严禁词设置" :visible.sync="listPanelShow" :lock-scroll=false>
      <div class="chat-dialog-content">
        <!-- 操作栏 -->
        <div class="operaBox">
          <el-button type="primary" @click.prevent.stop="addKeywordShow" size="medium" round>添加</el-button>
          <el-button type="white-primary" @click.prevent.stop="multiUploadKeywordShow" size="medium" round>批量添加</el-button>
          <el-button v-preventReClick @click.prevent.stop="multiKeywordDel" size="medium" round :disabled="!(ids && ids.length > 0)">批量删除</el-button>
          <div class="searchBox">
            <el-input
              placeholder="搜索严禁词"
              v-model="query.keyword"
              clearable
              @clear="getKeywordList"
              @keyup.enter.native="getKeywordList"
              >
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="getKeywordList">
              </i>
            </el-input>
          </div>
        </div>
        <!-- 操作栏 -->
        <table-list
          ref="chatTable"
          :isHandle=true
          :manageTableData="keyWordDao.list"
          :tabelColumnLabel="tableColumn"
          :totalNum="keyWordDao.list.length"
          :tableRowBtnFun="tableRowBtnFun"
          :needPagination=false
          :max-height="380"
          width=120
          @getTableList="getKeywordList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
          v-if="keyWordDao.total > 0"
        >
        </table-list>
        <!-- 无消息内容 -->
        <null-page v-else></null-page>
      </div>
    </VhallDialog>
    <!-- 添加关键词 -->
    <VhallDialog width="468px" :title="addForm.executeType === 'edit' ? '编辑严禁词' : '添加严禁词'" :visible.sync="addShow" append-to-body :lock-scroll=false>
      <div :class="`chat-add-dialog-content ${addForm.executeType}`">
        <el-form :model="addForm" ref="addForm" :rules="dynamicRules" label-width="54px">
          <el-form-item label="严禁词" prop="name">
            <VhallInput
              :type="addForm.executeType === 'add' ? 'textarea' : 'text'"
              :placeholder="addForm.executeType === 'add' ? '可同时添加多个关键词，中间以逗号(不区分中英文)分隔,每个关键词的长度为1~20个字符，超出范围的会自动丢弃' : '每个关键词的长度为1~20个字符'"
              v-model.trim="addForm.name"
              :maxlength="addForm.executeType === 'add' ? 1000 : 20"
              autocomplete="off"
              show-word-limit
            ></VhallInput>
          </el-form-item>
        </el-form>
        <div class="dialog-right-btn">
          <el-button type="primary" v-preventReClick @click.prevent.stop="keywordSend" size="medium" round>确 定</el-button>
          <el-button @click="addShow = false" size="medium" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
    <!-- 批量上传 -->
    <VhallDialog width="468px" title="添加严禁词" :visible.sync="multiUploadShow" append-to-body :lock-scroll=false>
      <div class="upload-dialog-content">
        <file-upload
          ref="chatUpload"
          v-model="fileUrl"
          :saveData="{
             path: pathUrl,
             type: 'exel'
          }"
          :result="importResult"
          :progress="{
            isUploadEnd: isUploadEnd,
            percent: percent
          }"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <p slot="tip" v-if="!isUploadEnd && percent === 0">请使用模版上传文件</p>
          <p slot="tip" v-if="!isUploadEnd && percent > 0"><el-progress :percentage="percent" status="success"></el-progress></p>
        </file-upload>
        <div class="dialog-right-btn">
          <el-button type="primary" v-preventReClick @click="saveUploadKey" size="medium" round>确 定</el-button>
          <el-button @click="closeImportChat" size="medium" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>

  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload/main';
import PageTitle from '@/components/PageTitle';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import Env from "@/api/env";
export default {
  name: "chat.vue",
  components: {
    PageTitle,
    FileUpload,
    NullPage
  },
  data() {
    return {
      isUploadEnd: false,
      percent: 0,
      chatForm: {},
      checkNames: [],
      keyWordDao: {
        total: 0,
        list: []
      },
      query: {
        keyword: '',
        pos: 0,
        limit: 1000,
        pageNumber: 1
      },
      downloadHref: null,
      // 列表展示开始
      listPanelShow: false,
      isHandle: false, // 是否有操作项
      showChatList: [],
      tableColumn: [
        {
          label: '严禁词',
          key: 'name'
        },
      ],
      tableRowBtnFun: [
        {
          name: "编辑",
          methodName: 'keywordEdit'
        },
        {
          name: "删除",
          methodName: 'keywordDel'
        }
      ],
      ids: [],
      // 添加关键词
      addShow: false,
      addForm: {
        id: null,
        name: null,
        type: 'add',
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
          { maxlength: 1000, message: '最多可输入1000个字符', trigger: 'blur' }
        ]
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
          { maxlength: 20, message: '单个严禁词可输入1~20个字符', trigger: 'blur' }
        ]
      },
      // 批量添加关键词
      multiUploadShow: false,
      fileUrl: '', // 文件地址
      fileResult: '', // 文件上传结果
      importResult: {
        fail: 0,
        success: 0
      }
    };
  },
  computed: {
    dynamicRules() {
      console.log(this.addForm);
      return this.addForm.executeType === 'add' ? this.addFormRules : this.editFormRules;
    },
    pathUrl: function() {
      // return `sys/${window.sessionStorage.getItem('userId')}_v3_${new Date().getTime()}`;
      return `interacts/keyword-docs`;
    }
  },
  methods: {
    // 获取关键字
    getKeywordList() {
      this.$fetch('getKeywordList', this.query).then(res =>{
        this.keyWordDao = res && res.code === 200 && res.data && res.data.list ? res.data : {
          total: 0,
          list: []
        };
        this.checkNames = this.keyWordDao.list.map(item => {
          return item.name;
        });
      }).catch(e=>{
        console.log(e);
        this.keyWordDao = {
          total: 0,
          list: []
        };
      });
    },
    // 打开关键字设置面板
    setKeyWordShow() {
      this.listPanelShow = true;
      this.showChatList = this.keyWordDao.list;
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 批量选择
    checkMoreRow(val) {
      console.log(val);
      this.ids = val.map(item => {
        return item.id;
      });
    },
    // 编辑
    keywordEdit(that, { rows }) {
      that.addShow = true;
      that.$nextTick(() => {
        try{
          if (that.$refs.addForm) {
            that.$refs.addForm.resetFields();
          }
          that.addForm.executeType = 'edit';
          that.$set(that.addForm, 'id', rows.id);
          that.$set(that.addForm, 'name', rows.name);
        }catch (e){
          console.log(e);
        }
      });
    },
    // 关键词新增 or 关键词修改
    keywordSend() {
      // addForm.executeType
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$fetch(this.addForm.executeType === 'add' ? 'multiKeywordAdd' : 'multiKeywordEdit', this.addForm.executeType === 'add' ? {
            keywords: this.addForm.name
          } : {
            keyword_id: this.addForm.id ,
            keyword: this.addForm.name
          }).then(res =>{
            if (this.addForm.executeType === 'add') {
              res.data.success > 0 ? this.$message({
                message: `成功添加了${res.data.success}个关键词`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              }) : this.$message({
                message: '添加失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            } else {
              this.$message({
                message: `修改成功`,
                showClose: true,
                // duration: 0,
                type: 'errror',
                customClass: 'zdy-info-box'
              });
            }
            this.addShow = false;
            this.getKeywordList(); // 刷新列表数据
          }).catch(res => {
            console.log(res);
            this.$message({
              message:  this.addForm.executeType === 'add' ? res.msg || `添加失败` : res.msg || `修改失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }
      });
    },
    // 删除
    keywordDel(that, { rows }) {
      that.$confirm('是否要删除选中的严禁词？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.$fetch('multiKeywordDel', {
          keyword_ids: rows.id
        }).then(res => {
          that.$message({
            message:  `删除成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          that.ids = [];
          that.$refs.chatTable.clearSelect();
          that.getKeywordList();
        }).catch(res => {
          console.log(res);
          that.$message({
            message: res.msg || '删除失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      }).catch(() => {
      });
    },
    // 批量删除
    multiKeywordDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message({
          message: '请至少选择一条严禁词删除',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      } else {
        this.keywordDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        });
      }
    },
    // 打开新增弹出框
    addKeywordShow() {
      this.addShow = true;
      this.$nextTick(() => {
        try{
          if (this.$refs.addForm) {
            this.$refs.addForm.resetFields();
          }
        }catch (e){
          console.log(e);
        }
      });
      this.addForm.executeType = 'add';
      this.addForm.id = null;
      this.addForm.name = null;
    },
    // 打开批量添加弹出框
    multiUploadKeywordShow() {
      this.multiUploadShow = true;
      this.fileUrl = '';
      // 清空面板
      this.importResult = {
        success: 0,
        fail: 0
      }
    },
    // 获取模板下载地址
    getKeywordTemplate() {
      this.$fetch('getKeywordTemplate', {}).then(res =>{
        if(res && res.code === 200) {
          this.downloadHref = res.data.url || '';
        }
      }).catch(e => {
        console.log(e);
      });
    },
    // 下载模板
    downloadHrefHandle() {
      let winDom = window.open('_blank'); // 先打开页面
      winDom.location = `${this.downloadHref}`; // 后更改页面地址
    },
    // 文件上传成功
    uploadSuccess(res, file){
      console.log(res, file);
      this.percent = 0;
      this.isUploadEnd = true;
      if (res.data.file_url) {
        this.fileUrl = res.data.file_url;
        // 文件上传成功，保存信息
        this.$fetch('checkUploadKeyword', {
          file: res.data.file_url
        }).then(resV => {
          this.importResult = resV.data;
          this.fileResult = 'success';
          if (this.$refs.chatUpload) {
             this.$refs.chatUpload.setError('');
          }
        }).catch(e => {
          this.fileResult = 'error';
          // this.$message.error(resV.msg || '导入严禁词信息校验失败！');
          this.isUploadEnd = false;
          this.importResult = null;
          if (this.$refs.chatUpload) {
             this.$refs.chatUpload.setError(res.msg || '导入严禁词信息校验失败');
          }
        });
      }
    },
    closeImportChat() {
      this.multiUploadShow = false;
      this.percent = 0;
      this.isUploadEnd = false;
      this.fileUrl = '';
    },
    saveUploadKey() {
      if(!this.fileUrl) {
        this.$message({
          message: '请先选择文档',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.$fetch('uploadKeywordAdd', {
        file: this.fileUrl
      }).then(resV => {
        this.importResult = resV.data;
        this.multiUploadShow = false;
        this.percent = 0;
        this.isUploadEnd = false;
        this.fileUrl = '';
        /* resV.data.success > 0 ? this.$message({
          message: `成功添加了${resV.data.success}个关键词`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        }) : this.$message({
          message: '添加失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        }); */
        // 重新刷新列表数据
        this.getKeywordList();
      }).catch(res => {
        console.log(res);
        this.$message({
          message: res.msg || '导入聊天严禁词信息失败！',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['xls', 'xlsx'];
      let nameArr = file.name.split('.');
      const isType = typeList.includes(nameArr[nameArr.length - 1]); // typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message: `上传格式只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `上传文件大小不能超过 2MB!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
      this.isUploadEnd = false;
      this.percent = parseInt(event.percent);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      // this.$message.error(`文件上传失败`);
      this.fileResult = 'error';
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    }
  },
  created() {
    this.getKeywordTemplate();
    this.getKeywordList();
  }
};
</script>

<style lang="less" scoped>
.btn-a {
  margin-left: 12px;
  /deep/button {
    background: transparent;
  }
}
.setting-chat-main {
  .layout--right--main();
  margin-top: 24px;
  padding: 48px 60px 48px 56px;
  min-height: 510px;
}
.words-white {
  padding: 10px 12px;
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  min-height: 200px;
  border-radius: 4px;
  border: 1px solid #CCCCCC;
}
.operaBox{
  overflow: hidden;
  margin-bottom: 20px;
  .el-link {
    margin-left: 20px;
  }
  .searchBox{
    float: right;
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
  }
}
/deep/.el-textarea {
  textarea {
    min-height: 150px!important;
  }
}
.chat-dialog-content {
  /*dataList 里面已经包含30间距*/
  padding-bottom: 2px;
}
.chat-add-dialog-content {
  &.add {
    /deep/.el-form-item__label {
      line-height: unset;
    }
  }
  /deep/.el-form-item__label:before {
    display: none;
  }
  overflow: hidden;
  /deep/.el-textarea__inner {
    padding: 8px 12px;
    line-height: 20px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    resize: none;
  }
  /deep/.el-input__count {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.upload-dialog-content {
  overflow: hidden;
}
.dialog-right-btn {
  text-align: right;
  margin-bottom: 24px;
  margin-top: 24px;
}
/deep/.data-list {
   min-height: 418px;
 }
</style>
