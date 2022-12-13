<template>
  <div class="upload-dialog-content">
    <div class="upload__top">
      <p class="upload__top__top">
        <a href="javascript:void(0);" class="down-a-btn" @click="downloadTemplate">
          <img src="../images/line-download.svg" />
          下载模板
        </a>
        <span class="span__desc">文件最大支持10000条，手机号必填</span>
      </p>
      <p class="upload__top__bottom">
        <span
          class="down-span-text"
          v-show="importResult && importResult.fail > 0"
          @click.prevent.stop="downErrorHandle"
        >
          下载无效数据
        </span>
        <span
          class="down-span-text"
          @click.prevent.stop="downBaseFileHandle"
          v-show="
            (isOneChange && importExcelBase && importExcelBase.import_user_url) || domainFileUrl
          "
        >
          下载原文件
        </span>
      </p>
    </div>
    <file-upload
      ref="viewerUpload"
      v-model.trim="fileUrl"
      @delete="deleteFile"
      :saveData="{
        path: pathUrl,
        type: 'exel'
      }"
      :defaultFileName="fileName"
      :on-success="uploadSuccess"
      :on-progress="uploadProcess"
      :on-error="uploadError"
      :on-preview="uploadPreview"
      :before-upload="beforeUploadHandler"
      :disabled="isUploadDisabled"
    >
      <div slot="upload-result">
        <!-- 状态1： 有上传过文件，后面重新删除等-变为未上传 -->
        <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && fileUrl">
          <span class="default_top">请使用模版上传文件</span>
          <br />
          <span class="default_bottom">下载模板并完善信息后，可进行上传</span>
        </p>
        <!-- 状态2： 已选择文件，上传中 或者 检测中-->
        <div v-if="uploadResult && uploadResult.status === 'progress'">
          <div class="progress-check-box">
            <div>
              <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
            </div>
            <div>数据检测上传中...</div>
          </div>
          <!-- <div class="progressBox">
            <el-progress :percentage="percent"></el-progress>
          </div> -->
        </div>
        <!-- 状态3： 检测失败 -->
        <div class="change-txt" v-if="uploadResult && uploadResult.status === 'error'">
          <p class="p-error">{{ uploadResult.text }}</p>
        </div>
        <!-- 状态4:  检测成功 -->
        <div class="change-txt" v-if="uploadResult && uploadResult.status === 'success'">
          <p class="p-right">
            上传成功，共检测到
            <span class="color-blue">{{ importResult && importResult.success }}</span>
            条有效数据，
            <span class="color-red">{{ importResult && importResult.fail }}</span>
            条无效数据
          </p>
        </div>
      </div>
      <!-- 状态5： 未上传 -->
      <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && !fileUrl">
        <span class="default_top">请使用模版上传文件</span>
        <br />
        <span class="default_bottom">下载模板并完善信息后，可进行上传</span>
      </p>
      <!-- 状态6：上传失败，后端有报错 -->
      <p
        slot="tip"
        class="p-error"
        v-if="uploadResult && uploadResult.status === 'error' && !fileUrl"
      >
        <span class="default_top">请使用模版上传文件</span>
        <br />
        <span class="default_bottom error">{{ uploadResult.text }}</span>
      </p>
    </file-upload>
  </div>
</template>
<script>
  import StaticFileUrlsMap from '../../../../api/StaticFileUrl.js';
  import FileUpload from '@/components/FileUpload/main';
  export default {
    name: 'CompImportDialog',
    components: {
      FileUpload
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      cardInfo: {
        type: Object,
        require: true
      },
      importExcelBase: {
        type: Object,
        require: true
      },
      isOneChange: {
        type: Object,
        require: true
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
        downloadUrl: StaticFileUrlsMap.getSmsNoticeDownTemplateUrl(process.env.VUE_APP_NODE_ENV), // 下载模板地址
        fileUrl: '', // 文件地址
        domainFileUrl: '', // 上传文件全地址
        fileName: '', // 文件名称
        fileResult: '', // 文件上传结果
        importResult: null,
        saveLoading: false, //导入确定按钮是否可点击
        checkImportKey: null,
        checkImportTimer: null,
        pollingTimerId: 1,
        pollingTimerVo: {},
        saveImportKey: null
      };
    },
    computed: {
      pathUrl: function () {
        return `webinars/notice-user-docs`;
      },
      isUploadDisabled: function () {
        return this.uploadResult.status === 'progress';
      },
      setDisabled: function () {
        return (
          this.fileResult === 'error' ||
          !this.isUploadEnd ||
          (this.importResult && this.importResult.success == 0)
        );
      }
    },
    watch: {
      setDisabled: {
        handler() {
          this.$emit('setBtnDisabled', this.setDisabled);
        },
        immediate: true
      }
    },
    methods: {
      // 下载模板
      downloadTemplate() {
        const xHttp = new window.XMLHttpRequest();
        xHttp.open('GET', this.downloadUrl, true);
        xHttp.responseType = 'blob';
        xHttp.onload = () => {
          const url = window.URL.createObjectURL(xHttp.response);
          const aDom = document.createElement('a');
          aDom.href = url;
          aDom.download = '消息通知导入.xlsx';
          aDom.click();
        };
        xHttp.send();
      },
      // 关闭导入
      cancelImport() {
        this.isUploadEnd = false;
        this.fileUrl = '';
        this.domainFileUrl = '';
        this.uploadResult = {
          status: 'start',
          text: '请上传文件'
        };
        this.$emit('close', 'close');
      },
      // 删除选中的文件
      deleteFile() {
        this.fileUrl = '';
        this.isUploadEnd = false;
        this.uploadResult = {
          status: 'start',
          text: '请上传文件'
        };
        this.$emit('uploadKey', {
          key: '',
          isEdit: this.importExcelBase?.import_user_ur != this.fileUrl,
          isOneChange: false
        });
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      // 上传前检测
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['xls', 'xlsx'];
        let nameArr = file.name.split('.');
        const isType = typeList.includes(nameArr[nameArr.length - 1]); // typeList.includes(file.type.toLowerCase());
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
        return isType;
      },
      // 轮询结果 type：import-导入；save-保存
      intervalCheck() {
        let that = this;
        if (this.checkImportTimer) {
          clearTimeout(this.checkImportTimer);
        }
        this.startPolling();
        this.checkImportTimer = setTimeout(function () {
          that.clearPageTimes();
        }, 120000); // 2分钟之后失效
      },
      stopPolling() {
        this.pollingTimerVo = {};
        this.pollingTimerId = 1;
      },
      async startPolling() {
        const that = this;
        const id = this.pollingTimerId++;
        this.pollingTimerVo[id] = true;
        const pollingFn = async function () {
          // 若发现setTimeout存在，即退出
          if (!that.pollingTimerVo[id]) return;
          const progressResult = await that.$fetch('noticeCheckImport', {
            key: that.checkImportKey
          }); // 模拟请求
          if (progressResult && progressResult.code == 200) {
            if (progressResult.data.status == 1) {
              // 预检/导入 完成
              that.clearPageTimes();
              that.isUploadEnd = true;
              that.fileResult = 'success';
              that.uploadResult = {
                status: 'success',
                text: '检测成功'
              };
              that.importResult = {
                success: progressResult.data.success_num,
                fail: progressResult.data.fail_num
              };
              if (that.$refs.viewerUpload) {
                that.$refs.viewerUpload.setError('');
              }
            } else if (progressResult.data.status == 2) {
              // 预检/导入 失败（轮询不在继续，直接终止）
              that.importIntervalError(that, progressResult.msg);
            } else if (progressResult.data.status == 512053) {
              that.importIntervalError(that, '您选择的模板不正确');
            } else {
              // 未开始
            }
            // // 文件上传拿到结果，检测按钮是否可点击...
            // that.$emit('setBtnDisabled', {
            //   isDisabled: that.fileResult === 'error' || !that.isUploadEnd  || that.importResult.success == 0
            // });
          }
          console.log('看看当前几秒轮询一次', id);
          setTimeout(pollingFn, 2000); // 2秒一轮询
        };
        // 第一次调用预检的时候，2秒后再轮询第一次
        const timerTemp = setTimeout(() => {
          timerTemp && clearTimeout(timerTemp);
          pollingFn();
        }, 2000);
      },
      importIntervalError(that, msg) {
        // 预检/导入 失败（轮询不在继续，直接终止）
        that.clearPageTimes();
        // 如果预检失败，重置外部的key，让其不可保存
        that.$emit('uploadKey', {
          key: '',
          isEdit: this.importExcelBase?.import_user_ur != this.fileUrl,
          isOneChange: false
        });
        that.isUploadEnd = true;
        that.fileResult = 'error';
        that.uploadResult = {
          status: 'error',
          text: msg || '预检失败，请重新上传'
        };
        that.importResult = null;
        if (that.$refs.viewerUpload) {
          that.$refs.viewerUpload.setError(msg || '预检失败，请重新上传');
        }
      },
      // 文件上传成功 & 文档预检
      uploadSuccess(res, file) {
        console.log('文件上传', res, file);
        if (res.data.file_url) {
          this.fileUrl = res.data.file_url;
          this.fileName = file.name;
          this.domainFileUrl = res.data.domain_url;
          // 文件上传成功，检测观众
          this.isUploadEnd = false;
          this.$fetch('importNoticeExcel', {
            webinar_id: this.cardInfo.webinar_id,
            config_type: this.cardInfo.config_type,
            file: this.fileUrl,
            file_name: this.fileName
          })
            .then(resV => {
              if (resV && resV.code == 200 && resV.data) {
                this.checkImportKey = resV.data.key;
                this.$emit('uploadKey', {
                  key: resV.data.key,
                  isEdit: this.importExcelBase?.import_user_ur != this.fileUrl,
                  isOneChange: false
                });
                // 开启轮询
                this.intervalCheck();
              } else {
                this.renderCheckImportError(resV.msg, true);
              }
            })
            .catch(resV => {
              this.renderCheckImportError(resV.msg, true);
            });
        } else {
          this.domainFileUrl = '';
          this.renderCheckImportError(res.msg, false);
        }
      },
      /* 报名导入预检-失败处理（代码冗余缩短） */
      renderCheckImportError(msg, isSetError) {
        this.clearPageTimes();
        this.isUploadEnd = true;
        this.fileResult = 'error';
        this.uploadResult = {
          status: 'error',
          text: msg
        };
        if (isSetError) {
          this.importResult = null;
          if (this.$refs.viewerUpload) {
            this.$refs.viewerUpload.setError(msg || '检测失败，请重新上传');
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
        };
        this.percent = parseInt(event.percent);
      },
      // 文件上传失败
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        // this.$message.error(`文件上传失败`);
        this.uploadResult = {
          status: 'error',
          text: err.msg || '文件上传失败'
        };
        this.fileResult = 'error';
      },
      // 文件预览
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      // 下载无效数据
      downErrorHandle() {
        this.$fetch(
          'downloadNoticeFailFile',
          this.$params({
            webinar_id: this.cardInfo.webinar_id,
            config_type: this.cardInfo.config_type,
            key: this.checkImportKey || ''
          })
        )
          .then(resV => {
            if (resV && resV.code == 200) {
              this.$EventBus.$emit('saas_vs_download_change');
              this.messageInfo('无效数据导出申请成功，请去下载中心下载', 'success');
            } else {
              this.messageInfo(resV.msg || '无效数据导出申请异常', 'error');
            }
          })
          .catch(resV => {
            this.messageInfo(resV.msg || '无效数据导出申请异常', 'error');
          });
      },
      // 下载源文件
      downBaseFileHandle() {
        const xHttp = new window.XMLHttpRequest();
        xHttp.open(
          'GET',
          this.domainFileUrl
            ? this.domainFileUrl
            : `${
                StaticFileUrlsMap.getDownBaseUrl(process.env.VUE_APP_NODE_ENV) +
                this.importExcelBase.import_user_url
              }`,
          true
        );
        xHttp.responseType = 'blob';
        xHttp.onload = () => {
          const url = window.URL.createObjectURL(xHttp.response);
          const aDom = document.createElement('a');
          aDom.href = url;
          aDom.download = '消息通知导入.xlsx';
          aDom.click();
        };
        xHttp.send();
      },
      // 清除定时器
      clearPageTimes() {
        if (this.checkImportTimer) {
          clearTimeout(this.checkImportTimer);
        }
        // 若未得到理想轮询结果，5分钟后自动停止轮询
        this.stopPolling();
      },
      // 重置选中文件
      resetSelectFile() {
        // 导入用户面板选中展示，若当前存在上传后的数据，直接展示（如果是每次打开发送设置弹窗时）；否则重置为空
        if (this.isOneChange && this.importExcelBase && this.importExcelBase.import_user_url) {
          this.fileUrl = `${this.importExcelBase?.import_user_url || ''}`;
          this.fileName = this.importExcelBase?.import_result?.file_name || '';
          this.domainFileUrl = '';
          this.fileResult = 'success';
          this.isUploadEnd = true;
          this.uploadResult = {
            status: 'success',
            text: '检测成功'
          };
          this.importResult = {
            success: this.importExcelBase?.import_result?.success_num || 0,
            fail: this.importExcelBase?.import_result?.fail_num || 0
          };
        } else {
          this.fileUrl = null;
          this.domainFileUrl = '';
          this.fileName = '';
          this.fileResult = '';
          this.importResult = null;
        }
      }
    },
    created() {
      // 外层控制内层dialog是否开启
      this.visibleTemp = this.visible;
      console.log('当前界面弹出框是否展示', this.visibleTemp);
      if (this.visibleTemp) {
        this.resetSelectFile();
      }
    },
    mounted() {},
    beforeDestroy() {
      this.clearPageTimes();
    }
  };
</script>
<style scoped lang="less">
  /* 导入报名用户样式-------------------------------------- */
  .upload-dialog-content {
    overflow: hidden;
    width: 100%;
    /* 文件上传 */
    /deep/.el-upload--picture-card {
      width: 612px;
      height: 118px;
      .noPic {
        height: 100px;
      }
    }
    .p-error {
      font-weight: 400;
      margin-top: -5px;
      color: #fb3a32;
      font-size: 14px;
      .default_bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #e34d59;
      }
    }
    .color-blue {
      color: #1e4edc;
    }
    .color-red {
      color: #fb2626;
    }
    /deep/.el-progress__text /deep/i {
      font-size: 18px;
    }
    /deep/.el-upload--picture-card i.excel {
      margin: 16px auto 0 auto;
    }
    /deep/.el-upload--picture-card i.saasicon_shangchuan {
      font-size: 28px;
      color: #595959;
    }
    /deep/.mask {
      background: rgba(0, 0, 0, 0.55);
      i {
        color: #fff;
        font-size: 18px;
      }
      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #fff;
      }
    }
    /deep/.file-name {
      margin: 8px 20px 4px 20px;
      line-height: 22px;
    }
    /deep/.p-right {
      font-style: normal;
      font-weight: 400;
      font-size: 12px !important;
      line-height: 20px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
    }
    .default_top {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 4px;
    }
    .default_bottom {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
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
          stroke-dasharray: 90, 150;
          stroke-dashoffset: 0;
          stroke-width: 2;
          stroke: #fb3a32;
          stroke-linecap: round;
        }
      }
    }
    .progressBox {
      /deep/ .el-progress-bar__inner {
        background-color: #14ba6a;
      }
    }
    .upload__top {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      .down-span-text {
        cursor: pointer;
        margin-right: 12px;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: #1e4edc;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    a.down-a-btn {
      text-decoration: none;
      cursor: pointer;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #1e4edc;
      margin-right: 12px;
      img {
        width: 13px;
        height: 13px;
        margin-right: 4px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -4px;
      }
    }
    .span__desc {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-align: justify;
      color: rgba(0, 0, 0, 0.45);
    }
  }
</style>
