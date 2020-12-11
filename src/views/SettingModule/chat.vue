<template>
  <div>
    <pageTitle title="聊天严禁词">
      <div slot="content">
        1.聊天、评论，包含关键词自动过滤,适用于所有直播。垃圾信息系统已过滤无需添加
        <br/>
        2.批量上传时每个关键词的长度为1~20个字符，超出范围的会自动丢弃
      </div>
    </pageTitle>
    <div>
      <el-button type="primary" @click.prevent.stop="setKeyWordShow" class="length104" size="medium" round>设置</el-button>
      <el-button class="length104" size="medium" round  @click="downloadHrefHandle" v-if="downloadHref">下载模板</el-button>
    </div>
    <div class="setting-chat-main">
      <el-form :model="chatForm" ref="chatForm" label-width="120px">
        <el-form-item label="严禁词列表：">
          <div class="words-white">
            {{checkNames.join('，')}}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 聊天严禁词弹出框 -->
    <VhallDialog width="800px" title="聊天严禁词设置" :visible.sync="listPanelShow">
      <div class="chat-dialog-content">
        <!-- 操作栏 -->
        <div class="operaBox">
          <el-button type="primary" @click.prevent.stop="addKeywordShow" size="medium" round>添加</el-button>
          <el-button type="white-primary" @click.prevent.stop="multiUploadKeywordShow" size="medium" round>批量添加</el-button>
          <el-button @click.prevent.stop="multiKeywordDel" size="medium" round>批量删除</el-button>
          <div class="searchBox">
            <el-input
              placeholder="搜索严禁词"
              v-model="query.keyword">
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
          :totalNum="keyWordDao.total"
          :tableRowBtnFun="tableRowBtnFun"
          :needPagination=false
          :max-height="275"
          @getTableList="getKeywordList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
        >
        </table-list>
      </div>
    </VhallDialog>
    <!-- 添加关键词 -->
    <VhallDialog width="350px" :title="addForm.executeType === 'edit' ? '编辑严禁词' : '添加严禁词'" :visible.sync="addShow" append-to-body>
      <div class="chat-add-dialog-content">
        <el-form :model="addForm" ref="addForm" :rules="dynamicRules" label-width="54px">
          <el-form-item label="严禁词" prop="name">
            <el-input
              :type="addForm.executeType === 'add' ? 'textarea' : 'text'"
              :placeholder="addForm.executeType === 'add' ? '可同时添加多个关键词，中间以逗号(不区分中英文)分隔,每个关键词的长度为1~20个字符，超出范围的会自动丢弃' : '每个关键词的长度为1~20个字符'"
              v-model.trim="addForm.name"
              :maxlength="addForm.executeType === 'add' ? 1000 : 20"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <div class="dialog-right-btn">
          <el-button type="primary" v-preventReClick @click.prevent.stop="keywordSend" size="mini" round>确 定</el-button>
          <el-button @click="addShow = false" size="mini" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
    <!-- 批量上传 -->
    <VhallDialog width="468px" title="添加严禁词" :visible.sync="multiUploadShow" append-to-body>
      <div class="upload-dialog-content">
        <file-upload
          v-model="fileUrl"
          :saveData="{
             path: pathUrl,
             type: 'exel'
          }"
          :result="importResult"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <p slot="tip" v-if="fileResult === 'success'">上传成功，共检测到4条数据</p>
          <p slot="tip" v-else>请使用模版上传文件</p>
        </file-upload>
        <div class="dialog-right-btn">
          <el-button type="primary" @click="multiUploadShow = false" size="mini" round>确 定</el-button>
          <el-button @click="multiUploadShow = false" size="mini" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>

  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload/main';
import PageTitle from '@/components/PageTitle';
import Env from "@/api/env";
export default {
  name: "chat.vue",
  components: {
    PageTitle,
    FileUpload
  },
  data() {
    return {
      chatForm: {},
      checkNames: [],
      keyWordDao: {
        total: 0,
        list: []
      },
      query: {
        keyword: '',
        pos: 0,
        limit: 1000
      },
      downloadHref: null,
      // 列表展示开始
      listPanelShow: false,
      isHandle: false, // 是否有操作项
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
             if(res && res.code === 200) {
               this.$message.success('保存成功！');
               this.addShow = false;
               this.getKeywordList(); // 刷新列表数据
             } else {
               this.$message.error(res.msg || '保存失败！');
             }
          }).catch(e => {
            console.log(e);
            this.$message.error('保存失败！');
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
        type: 'warning'
      }).then(() => {
        that.$fetch('multiKeywordDel', {
          keyword_ids: rows.id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.$refs.chatTable.clearSelect();
            that.getKeywordList();
          }else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message:  '删除失败'
          });
        });
      }).catch(() => {
      });
    },
    // 批量删除
    multiKeywordDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一条严禁词删除');
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
      window.open(this.downloadHref);
    },
    // 文件上传成功
    uploadSuccess(res, file){
      console.log(res, file);
      if (res.data.file_url) {
        this.fileUrl = res.data.file_url;
        // 文件上传成功，保存信息
        this.$fetch('uploadKeywordAdd', {
          file: res.data.file_url
        }).then(resV => {
          resV.code === 200 ? this.importResult = resV.data : null;
        }).catch(e => {
          this.$message.error('导入聊天严禁词信息失败！');
        });
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['csv', 'xls', 'xlsx'];
      let nameArr = file.name.split('.');
      const isType = typeList.includes(nameArr[nameArr.length - 1]); // typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传格式只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`文件上传失败`);
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
.setting-chat-main {
  .layout--right--main();
  margin-top: 24px;
  padding: 48px 60px 48px 56px;
  min-height: 510px;
}
.words-white {
  padding: 10px 12px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  /deep/.el-form-item__label:before {
    display: none;
  }
  overflow: hidden;
  /deep/.el-textarea__inner {
    padding: 8px 12px;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    resize: none;
  }
  /deep/.el-input__count {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
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
</style>
