<template>
  <div class="vodresetBox">
    <pageTitle pageTitle="课件重制">
      <!-- <div slot="content">
        章节功能支持文档格式：PPT、PPTX，其他格式不支持
      </div> -->
      <div class="title_text">课件重制功能将PPT文档和视频内容合并生成MP4文件，<span @click="introduceDetail">了解一下</span></div>
    </pageTitle>
    <div class="vodreset-from clearFix">
      <el-form :model="vodresetForm" label-width="83px">
        <el-form-item label="布局" class="pattern-item">
          <div class="data-show">
            <div class="data-show-item">
              <p :class="showType === 1 ? 'active' : ''" @click="changeType(1)">
                <img :src="pattern_third" alt="">
                <label  class="img-tangle" v-if="showType === 1"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>三分屏</aside>
            </div>
            <div class="data-show-item">
              <p :class="showType === 2 ? 'active' : ''" @click="changeType(2)">
                <img :src="pattern_mini" alt="">
                <label  class="img-tangle" v-if="showType === 2"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>画中画</aside>
            </div>
            <div class="data-show-item">
              <p :class="showType === 3 ? 'active' : ''" @click="changeType(3)">
                <img :src="pattern_doc" alt="">
                <label  class="img-tangle" v-if="showType === 3"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>纯文档</aside>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-show="showType === 1" label="图片" class="picture-item">
          <div class="img-box">
            <upload
              class="imgUpload"
              v-model="vodresetForm.img"
              :domain_url="domain_url"
              :saveData="{
                  path: '/common/static-imgs',
                  type: 'image',
              }"
              :on-success="uploadAdvSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              @handleFileChange="handleFileChange"
              :before-upload="beforeUploadHnadler"
              @delete="vodresetForm.img = '', domain_url = ''">
              <div slot="tip">
                <p>建议尺寸：320*540px</p>
                <p>小于2M(支持jpg、png)</p>
              </div>
            </upload>
          </div>
        </el-form-item>
        <el-form-item v-show="showType === 2" label="位置" class="picture-item">
          <el-radio-group class="ratio-radio" v-model="vodresetForm.position">
            <el-radio :label="1">左上角</el-radio>
            <el-radio :label="2">右上角</el-radio>
            <el-radio :label="3">左下角</el-radio>
            <el-radio :label="4">右下角</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分辨率" class="ratio-item">
          <el-radio-group class="ratio-radio" v-model="vodresetForm.ratio">
            <el-radio :label="3">高清</el-radio>
            <el-radio :label="6">超清</el-radio>
            <el-radio :label="9">蓝光</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSave" type="primary" class="save-btn" v-preventReClick round>保存</el-button>
        </el-form-item>
      </el-form>
      <div class="preview-box">
        <div class="preview-img-box">
          <img
            :src="showType == 1 ? pattern_third : showType == 2 ? pattern_mini : pattern_doc"
            class="preview-img"
          >
        </div>
        <div class="preview-tip">
          <p>提示：</p>
          <p>1.布局比例默认16:9</p>
          <p>2.分辨率指重制之后的视频分辨率，并非原视频的分辨率</p>
          <p>3.重制课件需要花费一定时间，请耐心等待</p>
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="dialog-tutorial-wrap"
      class="vh-dialog"
      :visible.sync="tutorialVisible"
      width="740px"
      center
      :close-on-click-modal=false
      :close-on-press-escape=false
    >
      <introduce-show></introduce-show>
    </el-dialog>
  </div>
</template>

<script>
  import introduceShow from './components/vodresetTutorial'
  import PageTitle from '@/components/PageTitle';
  import upload from '@/components/Upload/main';
  import pattern_third from './images/pattern_third.png'
  import pattern_mini from './images/pattern_mini.png'
  import pattern_doc from './images/pattern_doc.png'
  export default {
    components: {
      PageTitle,
      introduceShow,
      upload
    },
    data() {
      return {
        pattern_third,
        pattern_mini,
        pattern_doc,
        tutorialVisible: false,
        showType: 1,
        vodresetForm: {
          img: '',
          ratio: 6,
          position: 2
        },
        domain_url: ''
      }
    },
    created() {

    },
    methods: {
      handleSave() {

      },
      changeType(index) {
        this.showType = index;
      },
      introduceDetail() {
        this.tutorialVisible = true;
      },
      uploadAdvSuccess(res, file) {
        console.log(res, file);
        if(res.data) {
          let domain_url = res.data.domain_url || ''
          let file_url = res.data.file_url || '';
          this.vodresetForm.img = file_url;
          this.domain_url = domain_url;
        }
      },
      beforeUploadHnadler(file){
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase())
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isType) {
          this.$message({
            message:  `图片只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `图片大小不能超过 4MB!`,
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList){
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList){
        console.log('pcUploadError', err, file, fileList);
        this.$message({
          message: `PC图片上传失败`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file){
        console.log('pcUploadPreview', file);
      },
      handleFileChange(file) {
        console.log(file);
      }
    }
  }
</script>

<style lang="less" scoped>
  .title_text{
    color: #999;
    font-size: 14px;
    span{
      color: #3562FA;
      cursor: pointer;
    }
  }
  .vodreset-from {
    height: 587px;
    background: #fff;
    padding: 60px 48px 16px 0px;
    position: relative;
    border-radius: 4px;
    .el-form {
      width: 521px;
      margin-right: 40px;
      float: left;
    }
    .preview-box {
      float: left;
      width: 394px;
      .preview-img-box {
        width: 100%;
        img {
          width: 100%;
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        }
      }
      .preview-tip {
        margin-top: 16px;
        width: 349px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;

      }
    }
    .pattern-item {
      margin-bottom: 32px;
    }
    .picture-item {
      margin-bottom: 32px;
    }
    .ratio-item {
      margin-bottom: 40px;
    }
    .ratio-radio {
      /deep/ .el-radio__inner {
        width: 16px;
        height: 16px;
        &:after {
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: #FFF;
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%) scale(1);
          transition: transform .15s ease-in;
        }
      }
      /deep/ .el-radio__input.is-checked+.el-radio__label {
        color: #666;
      }
    }
    .save-btn {
      margin-left: 41px;
    }
  }
  /deep/ .el-dialog__wrapper .dialog-tutorial-wrap {
    padding: 0px 0px 30px;
    background: transparent!important;
    border: none;
    box-shadow: none;
    .el-dialog__headerbtn {
      top: 24px;
      right: 0;
      margin-bottom: 8px;
      .el-dialog__close {
        color: #FFFFFF;
      }
    }
    .el-dialog__body {
      padding: 0;
      border-radius: 8px;
    }
  }
  .data-show {
    margin-right: 100px;
    display: flex;
    p {
      background-color: #fff;
      width: 136px;
      margin-right: 16px;
      border-radius: 2px;
      position: relative;
      height: 88px;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease-in;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        border-radius: 4px;
      }
      .img-tangle{
        position: absolute;
        right: -1px;
        top:-1px;
        width: 20px;
        height: 20px;
        font-size: 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
      &:hover {
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        // border: 1px solid transparent;
        border: 1px solid #f2f2f2;
      }
      &.active{
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border: 1px solid #FB3A32;
        background: #F2F2F2;
      }
    }
    aside {
      width: 136px;
      text-align: center;
      line-height: 20px;
      margin-top: 8px;
      color: #666;
    }
  }
  .img-box{
    width: 438px;
    height: 180px;
    .imgUpload {
      height: 180px;
    }
    /deep/ .el-upload--picture-card {
      height: 180px;
      .box > div {
        height: 178px;
        text-align: center;
      }
    }
    /deep/ .mask {
      top: 0;
    }

  }
</style>
