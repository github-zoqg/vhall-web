<template>
  <div class="vodresetBox">
    <pageTitle pageTitle="课件重制">
      <div class="title_text">课件重制功能将文档和视频内容合并生成MP4文件，<span @click="introduceDetail">了解一下</span></div>
    </pageTitle>
    <div class="vodreset-from clearFix">
      <el-form :model="vodresetForm" label-width="83px">
        <el-form-item label="布局" class="pattern-item">
          <div class="data-show">
            <div class="data-show-item">
              <p :class="layout === 1 ? 'active' : ''" @click="changeType(1)">
                <img :src="layout1" alt="">
                <label  class="img-tangle" v-if="layout === 1"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>三分屏</aside>
            </div>
            <div class="data-show-item">
              <p :class="layout === 3 ? 'active' : ''" @click="changeType(3)">
                <img :src="layout3pos3" alt="">
                <label  class="img-tangle" v-if="layout === 3"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>画中画</aside>
            </div>
            <div class="data-show-item">
              <p :class="layout === 2 ? 'active' : ''" @click="changeType(2)">
                <img :src="layout2" alt="">
                <label  class="img-tangle" v-if="layout === 2"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
              <aside>纯文档</aside>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-show="layout === 1" label="图片" class="picture-item">
          <div class="img-box">
            <upload
              class="imgUpload"
              v-model="vodresetForm.img_url"
              :domain_url="domain_url"
              :saveData="{
                  path: pathUrl,
                  type: 'image',
              }"
              :on-success="uploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              @handleFileChange="handleFileChange"
              :before-upload="beforeUploadHnadler"
              @delete="vodresetForm.img_url = '', domain_url = ''">
              <div slot="tip">
                <p>建议尺寸：320*540px</p>
                <p>小于2M(支持jpg、png)</p>
              </div>
            </upload>
          </div>
        </el-form-item>
        <el-form-item v-show="layout === 3" label="位置" class="picture-item">
          <el-radio-group class="ratio-radio" v-model="vodresetForm.position">
            <el-radio :label="1">左上角</el-radio>
            <el-radio :label="3">右上角</el-radio>
            <el-radio :label="2">左下角</el-radio>
            <el-radio :label="4">右下角</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分辨率" class="ratio-item">
          <el-radio-group class="ratio-radio" v-model="vodresetForm.quality">
            <el-radio :label="1">高清</el-radio>
            <el-radio :label="2">超清</el-radio>
            <el-radio :label="3">蓝光</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSave" type="primary" class="save-btn" v-preventReClick round>保存</el-button>
        </el-form-item>
      </el-form>
      <div class="preview-box">
        <div class="preview-img-box">
          <img
            :src="preview_src"
            class="preview-img"
          >
          <div v-show="layout == 1" class="custom-img-box">
            <img class="custom-img" v-if="domain_url" :src="domain_url">
          </div>
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
      class="vh-saas-dialog"
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
  import pattern_mini_left_top from './images/pattern_mini_left_top.png'
  import pattern_mini_left_bottom from './images/pattern_mini_left_bottom.png'
  import pattern_mini_right_top from './images/pattern_mini_right_top.png'
  import pattern_mini_right_bottom from './images/pattern_mini_right_bottom.png'
  import pattern_doc from './images/pattern_doc.png'
  export default {
    components: {
      PageTitle,
      introduceShow,
      upload
    },
    data() {
      return {
        layout1: pattern_third,
        layout3pos1: pattern_mini_left_top,
        layout3pos2: pattern_mini_left_bottom,
        layout3pos3: pattern_mini_right_top,
        layout3pos4: pattern_mini_right_bottom,
        layout2: pattern_doc,
        tutorialVisible: false,
        layout: 1,
        vodresetForm: {
          img_url: '',
          quality: 2,
          position: 3
        },
        userId: window.sessionStorage.getItem('userId'),
        domain_url: '',
        pathUrl: `interacts/vodreset-imgs/${dayjs().format('YYYYMM')}`
      }
    },
    computed: {
      preview_src() {
        return this[`layout${ this.layout }${ this.layout == 3 ? `pos${this.vodresetForm.position}` : '' }`]
      }
    },
    methods: {
      handleSave() {
        let otherParams = {}

        this.layout == 1 && (otherParams = { img_url: this.vodresetForm.img_url, quality: this.vodresetForm.quality })
        this.layout == 2 && (otherParams = { quality: this.vodresetForm.quality })
        this.layout == 3 && (otherParams = { position: this.vodresetForm.position, quality: this.vodresetForm.quality })

        this.$fetch('recordRemark', {
          record_id: this.$route.query.record_id,
          layout: this.layout,
          ...otherParams
        }).then(res => {
          if (res.code == 200) {
            let arrType = [100428, 100430, 100429]
            let arrQuality = [100431, 100432, 100433]
            this.$vhall_paas_port({
              k: 100427,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$vhall_paas_port({
              k: arrType[this.layout - 1],
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$vhall_paas_port({
              k: arrQuality[this.vodresetForm.quality - 1],
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$message({
              message: `课件重制成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            })
            if (this.$route.query.switch_id) {
              this.$router.push({
                path: `/live/playback/${this.$route.params.str}/group/${this.$route.query.switch_id}`,
              })
            } else {
              this.$router.push({
                path: `/live/playback/${this.$route.params.str}`,
              })
            }
          }
        }).catch(err => {
          this.$message({
            message: err.msg || `保存失败`,
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          })
        })
      },
      changeType(index) {
        this.layout = index;
      },
      introduceDetail() {
        this.$vhall_paas_port({
          k: 100434,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.tutorialVisible = true;
      },
      uploadSuccess(res, file) {
        if(res.data) {
          let domain_url = res.data.domain_url || ''
          let file_url = res.data.file_url || '';
          this.vodresetForm.img_url = file_url;
          this.domain_url = domain_url;
        }
      },
      beforeUploadHnadler(file){
        const typeList = ['png', 'jpeg'];
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 2;
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
            message: `图片大小不能超过 2MB!`,
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
        position: relative;
        .preview-img {
          width: 100%;
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        }
        .custom-img-box {
          width: 93px;
          height: 146px;
          position: absolute;
          bottom: 15px;
          right: 9px;
        }
        .custom-img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
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
  }
  /deep/ .el-dialog__wrapper .dialog-tutorial-wrap {
    padding: 0px 0px 30px;
    background: transparent!important;
    border: none;
    box-shadow: none;
    @media (max-width: 1440px) {
      margin-top: 9vh!important;
    }
    @media (max-width: 1366px) {
      margin-top: 2vh!important;
      margin-bottom: 0;
    }
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
