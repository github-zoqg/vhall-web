<template>
  <div class="comp-import-dialog">
    <VhallDialog title="导入用户"
      :visible.sync="visibleTemp"
      width="468px"
      @close="cancelImport">
      <div class="upload-dialog-content">
        <file-upload ref="viewerUpload"
          v-model.trim="fileUrl"
          @delete="deleteFile"
          :saveData="{
            path: pathUrl,
            type: 'exel',
          }"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler"
          :disabled="isUploadDisabled">
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
          <!-- 状态5： 未上传 -->
          <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && !fileUrl">请使用模版上传文件</p>
          <!-- 状态6：上传失败，后端有报错 -->
          <p slot="tip" class="p-error" v-if="uploadResult && uploadResult.status === 'error' && !fileUrl">{{uploadResult.text}}</p>
        </file-upload>
        <p class="uploadtips">
          <span>注：单个文件不超过10000条数据，数据较大时拆分上传，手机号和 姓名必填，否则将视为无效数据</span>
          <span class="down-span-text" v-show="importResult && importResult.fail > 0" @click.prevent.stop="downErrorHandle">下载查看无效数据</span>
        </p>
        <div class="dialog-right-btn dialog-footer">
          <a href="javascript:void(0);" class="down-a-btn" @click="downloadTemplate">下载模板</a>
          <el-button type="primary"
            v-preventReClick
            @click.prevent.stop="saveUserList"
            class="loading-btn"
            size="medium"
            round
            :disabled="fileResult === 'error' || !isUploadEnd  || saveLoading || importResult.success == 0"
            :loading="saveLoading">{{ saveLoading ? '执行中' : '确定' }}</el-button>
          <el-button v-preventReClick @click.prevent.stop="cancelImport"
            size="medium"
            round>关闭</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import StaticFileUrlsMap from '../../../../api/StaticFileUrl.js'
import FileUpload from '@/components/FileUpload/main';
export default {
  name: "CompImportDialog",
  components: {
    FileUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 活动ID 或者 专题ID，跟signUpPageType字段组合使用
    webinarOrSubjectId: {
      type: [Number, String],
      default: 0
    },
    // 报名表单类型：webinar--活动；subject--专题
    signUpPageType: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      visibleTemp: false,
      vm: null,
      isUploadEnd: false,
      uploadResult: {
        status: 'start',
        text: '请选择模板文件'
      },
      percent: 0,
      downloadUrl: StaticFileUrlsMap.getSignDownTemplateUrl(process.env.VUE_APP_NODE_ENV, true), // 下载模板地址
      fileUrl: '', // 文件地址
      fileResult: '', // 文件上传结果
      importResult: null,
      saveLoading: false,//导入确定按钮是否可点击
      checkImportKey: null,
      checkImportTimer: null,
      pollingTimerId: 1,
      pollingTimerVo: {},
      saveImportKey: null
    }
  },
  computed: {
    pathUrl: function() {
      return `webinars/form-user-docs`;
    },
    isUploadDisabled: function() {
      return this.uploadResult.status === 'progress'
    }
  },
  methods: {
    // 设置接口入参，是活动维度 还是 专题维度
    setParamsIdByRoute(params) {
      if (this.signUpPageType === 'webinar') {
        params.webinar_id = this.webinarOrSubjectId
      } else if (this.signUpPageType === 'subject') {
        params.subject_id = this.webinarOrSubjectId
      }
      return params
    },
    // 下载模板
    downloadTemplate() {
      const xHttp = new window.XMLHttpRequest();
      xHttp.open('GET', this.downloadUrl, true);
      xHttp.responseType = 'blob';
      xHttp.onload = () => {
        const url = window.URL.createObjectURL(xHttp.response);
        const aDom = document.createElement('a');
        aDom.href = url;
        aDom.download = '报名表单.xlsx';
        aDom.click();
      }
      xHttp.send();
    },
    // 关闭导入
    cancelImport() {
      this.isUploadEnd = false;
      this.fileUrl = '';
      this.uploadResult = {
        status: 'start',
        text: '请上传文件'
      }
      this.$emit('close', 'close')
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
      this.intervalType = type
      if (this.checkImportTimer) {
        clearTimeout(this.checkImportTimer);
      }
      this.startPolling(type);
      this.checkImportTimer = setTimeout(function() {
        that.clearPageTimes();
      }, 120000); // 2分钟之后失效
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
        console.log('当前触发监听的type', that.intervalType, that.pollingTimerVo[id])
        // 若发现setTimeout存在，即退出
        if (!that.pollingTimerVo[id]) return;
        const progressResult = await that.$fetch('userRegistrationImportProgress', {
          key: that.intervalType === 'import' ? that.checkImportKey : that.saveImportKey
        }); // 模拟请求
        if (progressResult && progressResult.code == 200) {
          if (progressResult.data.status == 2) {
            // 预检/导入 完成
            that.clearPageTimes();
            if (that.intervalType === 'import') {
              that.isUploadEnd = true;
              that.fileResult = 'success';
              that.uploadResult = {
                status: 'success',
                text: '检测成功'
              }
              that.importResult = {
                success: progressResult.data.success,
                fail: progressResult.data.fail
              };
              if (that.$refs.viewerUpload) {
                that.$refs.viewerUpload.setError('');
              }
            } else {
              that.visibleTemp = false;
              that.isUploadEnd = false;
              that.saveLoading = false
              that.fileUrl = '';
              that.uploadResult = {
                status: 'start',
                text: '请上传文件'
              }
              // 导入成功，关闭弹窗，刷新列表
              that.$emit('success')
            }
          } else if (progressResult.data.status == 3) {
            // 预检/导入 失败（轮询不在继续，直接终止）
            that.clearPageTimes();
            if (that.intervalType === 'import') {
              that.isUploadEnd = true;
              that.fileResult = 'error';
              that.uploadResult = {
                status: 'error',
                text: progressResult.msg || `${that.intervalType === 'import' ? '预检' : '导入'}失败，请重新上传`
              }
              that.importResult = null;
              if (that.$refs.viewerUpload) {
                that.$refs.viewerUpload.setError(progressResult.msg || `${that.intervalType === 'import' ? '预检' : '导入'}失败，请重新上传`);
              }
            } else {
              that.saveLoading = false
              that.$message({
                message: progressResult.msg || '导入观众信息失败',
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
        console.log('看看当前几秒轮询一次', id)
        setTimeout(pollingFn, 5000); // 5秒一轮询
      };
      // 第一次调用预检的时候，5秒后再轮询第一次
      const timerTemp = setTimeout(() => {
        timerTemp && clearTimeout(timerTemp)
        pollingFn();
      }, 5000)
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
      this.clearPageTimes();
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
        text: err.msg || '文件上传失败'
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
        file: fileUrl
      }
      return this.setParamsIdByRoute(params)
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
    },
    // 清除定时器
    clearPageTimes() {
      if (this.checkImportTimer) {
        clearTimeout(this.checkImportTimer);
      }
      // 若未得到理想轮询结果，5分钟后自动停止轮询
      this.stopPolling();
    }
  },
  created() {
    // 外层控制内层dialog是否开启
    this.visibleTemp =  this.visible
    if (this.visibleTemp) {
      this.fileUrl = null;
      this.fileResult = '';
      this.importResult = null;
    }
  },
  mounted() {},
  beforeDestroy() {
    this.clearPageTimes();
  }

}
</script>
<style scoped lang="less">
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
      cursor: pointer;
    }
  }

  .dialog-right-btn {
    text-align: right;
    margin-bottom: 24px;
    margin-top: 18px;
  }
  /deep/.dialog-footer {
    button {
      width: 92px;
      text-align: center;
    }
    button.el-button.loading-btn {
      padding: 4px 0;
    }
  }
  a.down-a-btn {
    float: left;
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

