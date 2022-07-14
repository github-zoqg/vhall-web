<template>
  <div class="vmp-user-registration"  v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)">
    <!-- 全部无结果 -->
    <div class="all-no-data" v-if="userDao && userDao.total === 0  && !query.keyword">
      <null-page nullType="nullData" text="暂无数据" :height="0">
        <el-button type="primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="addUserDialog">快速报名</el-button>
        <el-button type="white-primary" class="length106" size="medium" round v-preventReClick @click.prevent.stop="importUserDialog">导入</el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <el-button size="medium" type="primary" round @click.prevent.stop="addUserDialog">快速报名</el-button>
        <!-- 若当前是知学云账号，不展示用量分配按钮, extends_remark 为1时表示 知学云账号-->
        <el-button size="medium" plain round @click.prevent.stop="importUserDialog">导入</el-button>
        <el-button size="medium" round @click="downloadHandle">导出</el-button>
        <VhallInput placeholder="搜索手机号/姓名" v-model="query.keyword"
                  clearable
                  @clear="initQueryUserList"
                  class="search-query"
                  @input="checkoutList"
                  v-clearEmoij
                  @keyup.enter.native="initQueryUserList">
          <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryUserList"></i>
        </VhallInput>
        <el-select placeholder="报名方式" round v-model="query.type" @change="initQueryUserList" style="width:102px">
          <el-option value="">报名方式</el-option>
          <el-option
            v-for="item in [{
              value: 1,
              label: '线上报名'
            },
            {
              value: 2,
              label: '导入'
            }]"
            :key="'t_' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select placeholder="是否观看" round v-model="query.is_enter" @change="initQueryUserList" style="width:102px">
          <el-option value="">是否观看</el-option>
          <el-option
            v-for="item in [{
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }]"
            :key="'v_' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 有消息内容 -->
      <div>
        <!-- 表格与分页 -->
        <table-list
          ref="userTable"
          :isHandle=false
          :isCheckout=false
          :manageTableData="userDao.list||[]"
          :tabelColumnLabel="userTableColumn"
          :totalNum="userDao.total||0"
          :needPagination=true
          width="150px"
          max-height="auto"
          scene="accountList"
          @getTableList="getUserRegistrationList"
        >
        </table-list>
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="userDao && userDao.total === 0"></null-page>
    </div>
    <!-- 快速报名 -->
    <VhallDialog
      width="460px"
      :visible.sync="addUserVisible"
      title="快速报名"
      class="user-add-dialog"
      append-to-body>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="saveAddUser" size="medium" round>确 定</el-button>
        <el-button @click="cancelAddUser" size="medium" round>取 消</el-button>
      </span>
    </VhallDialog>
    <!-- 导入报名用户excel -->
    <VhallDialog title="导入用户"
      :visible.sync="importFileShow"
      width="468px"
      @close="closeImportViewer">
      <div class="upload-dialog-content">
        <file-upload ref="viewerUpload"
          v-model="fileUrl"
          @delete="deleteFile"
          :saveData="{
              path: pathUrl,
              type: 'exel',
          }"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <div slot="upload-result">
            <!-- 状态1： 有上传过文件，后面重新删除等-变为未上传 -->
            <p slot="tip"
              v-if="uploadResult && uploadResult.status === 'start' && fileUrl">请使用模版上传文件</p>
            <!-- 状态2： 已选择文件，上传中 或者 检测中-->
            <div v-if="uploadResult && uploadResult.status === 'progress'">
              <div class="progress-check-box">
                <div>
                  <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                </div>
                <div>数据检测上传中...</div>
              </div>
              <!-- <div class="progressBox">
                <el-progress :percentage="percent"></el-progress>
              </div> -->
            </div>
            <!-- 状态3： 检测失败 -->
            <div class="change-txt"
              v-if="uploadResult && uploadResult.status === 'error'">
              <p class="p-error">{{uploadResult.text}}</p>
            </div>
            <!-- 状态4:  检测成功 -->
            <div class="change-txt"
              v-if="uploadResult && uploadResult.status === 'success'">
              <p class="p-right">上传成功，共检测到{{importResult && importResult.success}}条有效数据，{{importResult && importResult.fail}}条无效数据</p>
            </div>
          </div>
          <!-- 状态1： 未上传 -->
          <p slot="tip"
            v-if="uploadResult && uploadResult.status === 'start' && !fileUrl">请使用模版上传文件</p>
        </file-upload>
        <p class="uploadtips">
          <span>注：单个文件不超过10000条数据，数据较大时拆分上传手机号和 姓名必填，否则将视为无效数据</span>
          <span class="down-span-text" v-show="importResult && importResult.fail > 0" @click="downErrorHandle">下载查看无效数据</span>
        </p>
        <div class="dialog-right-btn dialog-footer">
          <a class="down-a-btn" href="http://cnstatic01.e.vhall.com/static/download/%E9%A2%84%E6%8A%A5%E5%90%8D%E6%A8%A1%E6%9D%BF.xlsx">下载模板</a>
          <el-button type="primary"
            @click="saveUserList"
            size="medium"
            round
            :disabled="fileResult === 'error' || !isUploadEnd  || saveLoading">确定</el-button>
          <el-button @click="closeImportViewer"
            size="medium"
            round>取消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import FileUpload from '@/components/FileUpload/main';
export default {
  name: "roleList.vue",
  components: {
    NullPage,
    FileUpload
  },
  data() {
    return {
      vm: null,
      /*--------------------列表部分参数定义--------------------*/
      loading: false,
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
      userDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      userTableColumn: [
        {
          label: '用户信息',
          key: 'name',
          width: 'auto'
        },
        {
          label: '手机号',
          key: 'phone',
          width: 200
        },
        {
          label: '报名方式',
          key: 'entry_source_str',
          width: 100
        },
        {
          label: '报名时间',
          key: 'created_at',
          width: 'auto'
        },
        {
          label: '是否观看',
          key: 'is_enter_str',
          width: 100
        },
        {
          label: '来源',
          key: 'refer',
          width: 'auto'
        }
      ],
      /*--------------------快速报名参数定义--------------------*/
      addUserVisible: false,
      /*--------------------导入用户参数定义--------------------*/
      importFileShow: false,
      isUploadEnd: false,
      uploadResult: {
        status: 'start',
        text: '请选择模板文件'
      },
      percent: 0,
      downloadUrl: 'https://cnstatic01.e.vhall.com/static/download/%E6%8A%A5%E5%90%8D%E5%AF%BC%E5%85%A5.xlsx',
      fileUrl: '', // 文件地址
      fileResult: '', // 文件上传结果
      importResult: null,
      saveLoading: false,//导入确定按钮是否可点击
      checkImportKey: null,
      checkImportTimer: null,
      pollingTimerId: 1,
      pollingTimerVo: {},
      saveImportKey: null
    };
  },
  computed: {
    pathUrl: function() {
      return `webinars/form-user-docs`;
    }
  },
  methods: {
    checkoutList(newValue) {
      if(!newValue){
        this.initQueryUserList()
      }
    },
    // 开启-快速报名弹窗
    addUserDialog() {
      this.addUserVisible = true;
    },
    // 关闭-快速报名弹窗
    cancelAddUser(){
      this.addUserVisible = false;
    },
    // 保存
    saveAddUser() {
    },
    // 获取列表数据
    getUserRegistrationList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      this.loading = true;
      this.$fetch('userRegistrationList', this.$params(this.query)).then(res =>{
        this.loading = false;
        if (res && res.code === 200 && res.data && res.data.list) {
          res.data.list.map(item => {
            item.entry_source_str = item.entry_source == 1 ? '线上报名': '线下';
            item.is_enter_str = item.is_enter == 1 ? '是': '否'
            item.name = item.name || '--'
            item.phone = item.phone || '--'
            item.created_at = item.created_at || '--'
            item.refer = item.refer || '--'
          })
          this.userDao =  res.data;
        } else {
          this.userDao = {
            total: 0,
            list: []
          };
        }
      }).catch(e=>{
        this.loading = false;
        console.log(e);
        this.userDao = {
          total: 0,
          list: []
        };
      });
    },
    initComp() {
      this.initQueryUserList();
    },
    initQueryUserList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      this.$nextTick(() => {
        if (this.$refs.userTable) {
          this.$refs.userTable.pageInfo.pageNum = 1;
          this.$refs.userTable.pageInfo.pos = 0;
        }
        this.getUserRegistrationList();
      })
    },
    //文案提示问题
    messageInfo() {
      this.vm = this.$message({
        showClose: true,
        duration: 2000,
        message: '导出申请成功，请去下载中心下载',
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    // 导出
    downloadHandle() {
      let params = null
      if (this.webinar_id) {
        params = { webinar_id: this.webinar_id }
      } else if (this.subject_id) {
        params = { subject_id: this.subject_id }
      } else {
        console.log('没有入参，不能导出')
        return
      }
      this.$fetch('exportForm', params).then(res => {
        if (this.vm) {
          this.vm.close();
        }
        this.messageInfo()
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 导入
    importUserDialog() {
      this.importFileShow = true;
      this.fileUrl = null;
      this.fileResult = '';
      this.importResult = null;
    },
    // 关闭导入用户名称
    closeImportViewer() {
      this.importFileShow = false;
      this.isUploadEnd = false;
      this.fileUrl = '';
      this.uploadResult = {
        status: 'start',
        text: '请上传文件'
      }
    },
    // 删除选中的文件
    deleteFile() {
      this.fileUrl = ''
      this.isUploadEnd = false
      this.uploadResult = {
        status: 'start',
        text: '请上传文件'
      }
    },
    // 上传前检测
    beforeUploadHandler(file) {
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
          message: `上传文件大小不能超过 2M!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    // 轮询结果 type：import-导入；save-保存
    intervalCheck(type) {
      let that = this
      this.startPolling(type);
      if (this.checkImportTimer) {
        clearTimeout(this.checkImportTimer);
      }
      this.checkImportTimer = setTimeout(function() {
        clearTimeout(that.checkImportTimer);
        // 若未得到理想轮询结果，到时间后自动停止轮询
        that.stopPolling();
      }, 60000);
    },
    stopPolling() {
      this.pollingTimerVo = {};
      this.pollingTimerId = 1;
    },
    async startPolling(type) {
      const that = this;
      const id = this.pollingTimerId++;
      this.pollingTimerVo[id] = true;
      const pollingFn = async function() {
        // 若发现setTimeout存在，即退出
        if (!that.pollingTimerVo[id]) return;
        const progressResult = await this.$fetch('userRegistrationImportProgress', {
          key: type === 'import' ? this.checkImportKey : this.saveImportKey
        }); // 模拟请求
        if (progressResult && progressResult.code == 200) {
          if (progressResult.data.status == 2) {
            // 预检/导入 完成
            that.stopPolling();
            that.checkImportTimer && clearTimeout(that.checkImportTimer);
            if (type === 'import') {
              this.isUploadEnd = true;
              this.fileResult = 'success';
              this.uploadResult = {
                status: 'success',
                text: '检测成功'
              }
              this.importResult = {
                success: progressResult.data.success_count,
                fail: progressResult.data.fail_count
              };
              if (this.$refs.viewerUpload) {
                this.$refs.viewerUpload.setError('');
              }
            } else {
              this.importFileShow = false;
              this.isUploadEnd = false;
              this.saveLoading = false
              this.fileUrl = '';
              this.uploadResult = {
                status: 'start',
                text: '请上传文件'
              }
            }
          } else if (progressResult.data.status == 3) {
            // 预检/导入 失败（轮询不在继续，直接终止）
            that.stopPolling();
            that.checkImportTimer && clearTimeout(that.checkImportTimer);
            if (type === 'import') {
              this.isUploadEnd = true;
              this.fileResult = 'error';
              this.uploadResult = {
                status: 'error',
                text: progressResult.msg
              }
              this.importResult = null;
              if (this.$refs.viewerUpload) {
                this.$refs.viewerUpload.setError(res.msg || `${type === 'import' ? '预检' : '导入'}失败，请重新上传`);
              }
            } else {
              this.saveLoading = false
              this.$message({
                message: res.msg || '导入观众信息失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            }
          } else {
            // 未开始 or 进行中
          }
        }
        setTimeout(pollingFn, 10000); // 10秒一轮询
      };
      pollingFn();
    },
    // 文件上传成功 & 文档预检
    uploadSuccess(res, file) {
      console.log(res, file);
      if (res.data.file_url) {
        this.fileUrl = res.data.file_url;
        // 文件上传成功，检测观众
        this.$fetch('userRegistrationCheckImport', this.getImportOrSaveParams(this.fileUrl)).then(resV => {
          if (resV && resV.code == 200 && resV.data) {
            this.checkImportKey = resV.data.key
            // 开启轮询
            this.intervalCheck('import')
          } else {
            this.renderCheckImportError(resV.msg, 'import', true)
          }
        }).catch(resV => {
          this.renderCheckImportError(resV.msg, 'import', true)
        });
      } else {
        this.renderCheckImportError(res.msg, 'import', false)
      }
    },
    /* 报名导入预检-失败处理（代码冗余缩短） */
    renderCheckImportError(msg, type, isSetError) {
      this.isUploadEnd = true;
      this.fileResult = 'error';
      this.uploadResult = {
        status: 'error',
        text: msg
      }
      if (isSetError) {
        this.importResult = null;
        if (this.$refs.viewerUpload) {
          this.$refs.viewerUpload.setError(msg || `${type === 'import' ? '检测' : '导入'}失败，请重新上传`);
        }
      }
    },
    // 文件上传中
    uploadProcess(event, file, fileList) {
      console.log('uploadProcess', event, file, fileList);
      this.isUploadEnd = false;
      this.uploadResult = {
        status: 'progress',
        text: '上传中，请稍候'
      }
      this.percent = parseInt(event.percent)
    },
    // 文件上传失败
    uploadError(err, file, fileList) {
      console.log('uploadError', err, file, fileList);
      // this.$message.error(`文件上传失败`);
      this.uploadResult = {
        status: 'error',
        text: '文件上传失败'
      }
      this.fileResult = 'error';
    },
    // 文件预览
    uploadPreview(file) {
      console.log('uploadPreview', file);
    },
    // 下载无效数据
    downErrorHandle() {
      this.$EventBus.$emit('saas_vs_download_change');
      this.$message({
        message: `无效数据导出申请成功，请去下载中心下载`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    /* 调用报名导入，预检/导入时候，入参组装 */
    getImportOrSaveParams(fileUrl) {
      let params = {
        file_url: fileUrl
      }
      if (this.webinar_id) {
        params.webinar_id = this.webinar_id
      } else if (this.subject_id) {
        params.subject_id = this.subject_id // 跟活动ID传值，二选一
      }
      return params
    },
    /* 报名导入-保存 */
    saveUserList() {
      if (!this.fileUrl) {
        this.$message({
          message: `请先选择模板`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.saveLoading = true
      // 数据存储
      this.$fetch('userRegistrationImport', this.getImportOrSaveParams(this.fileUrl)).then(resV => {
        if (resV && resV.code == 200 && resV.data) {
          this.saveImportKey = resV.data.key
          // 开启轮询
          this.intervalCheck('save')
        } else {
          this.renderSaveError(resV.msg)
        }
      }).catch(resV => {
        this.renderSaveError(resV.msg)
      });
    },
    /* 报名导入-失败处理（代码冗余缩短） */
    renderSaveError(msg) {
      this.saveLoading = false
      this.$message({
        message: msg || '导入观众信息失败',
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    }
  },
  mounted() {
    this.initComp()
  }
};
</script>
<style lang="less" scoped>
/* 列表样式-------------------------------------- */
.all-no-data {
  /* 基于外边框已经有距离： padding: 24px 24px 24px 24px; */
  padding-top: 105px;
  /deep/.createActive {
    padding-bottom: 30px;
  }
  /deep/.btn-list .el-button {
    margin-right: 0;
  }
}
/deep/.all-yes-data {
  .data-list {
    .el-table {
      margin-bottom: 40px;
      .cell{
        line-height: 25px;
      }
    }
  }
}
/deep/.search-no-data {
  padding-top: 148px;
  .search {
    padding-bottom: 0;
  }
}
/deep/.list--search {
  margin-bottom: 20px;
  .el-input {
    width: 180px;
    float: right;
    .el-input__icon {
      line-height: 36px;
    }
    .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }

    .el-input__prefix {
      cursor: pointer;
    }
  }
  .el-select {
    width: 120px;
    .el-input {
      width: 120px;
    }
    float: right;
    margin-right: 12px;
    .el-input__inner {
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up{
      line-height: 36px;
    }
  }
}
.vmp-user-registration--search{
  margin-bottom: 20px;
  .el-select{
    float: right;
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    width: 220px;
    float: right;
    /deep/ .el-input__icon{
      line-height: 36px;
    }
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix{
      cursor: pointer;
    }
  }
  .search-input {
    /deep/.el-input__inner{
      border-radius: 18px;
      height: 36px;
      background: transparent;
      padding-right: 50px;
      &.el-date-editor--daterange {
        padding-right: 10px;
      }
    }
  }
}
/* 快速报名样式-------------------------------------- */
.user-add-dialog {
  /deep/.el-form-item {
    margin-bottom: 24px;
  }
  /deep/.el-dialog__footer {
    padding: 14px 32px 24px 32px;
  }
}
/* 导入报名用户样式-------------------------------------- */
.upload-dialog-content {
  overflow: hidden;
  /* 文件上传 */
  .p-right {
    font-weight: 400;
    margin-top: -5px;
    color: #888;
    font-size: 14px;
  }
  .p-error {
    font-weight: 400;
    margin-top: -5px;
    color: #fb3a32;
    font-size: 14px;
  }
  /deep/.el-progress__text /deep/i {
    font-size: 18px;
  }
  .progress-check-box {
    div {
      display: inline-block;
      vertical-align: middle;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #666666;
      &:first-child {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
    }
    .circular {
      height: 20px;
      width: 20px;
      animation: loading-rotate 2s linear infinite;
      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90,150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #FB3A32;
        stroke-linecap: round;
      }
    }

  }
  .progressBox {
    /deep/ .el-progress-bar__inner {
      background-color: #14ba6a;
    }
  }
  .uploadtips {
    padding-top: 16px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    .down-span-text {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #3562FA;
    }
  }

  .dialog-right-btn {
    text-align: right;
    margin-bottom: 24px;
    margin-top: 18px;
  }
  a.down-a-btn {
    float: left;
    display: inline-block;
    text-decoration: none;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 36px;
    color: #3562FA;
    cursor: pointer;
  }
}
</style>
