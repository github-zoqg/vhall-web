<template>
  <div class="qrcode-wrapbox">
    <div class="qr-previewbox" v-if="mode == 1">
      <div class="qrbox">
        <img :src="info.imageSrc" alt="" />
      </div>
    </div>
    <div class="qr-editor-box" v-if="mode == 2">
      <div class="label">
        <span style="color: #fb3a32">*</span>
        二维码
      </div>
      <div class="editorContent">
        <!-- <el-upload
            class="upload-imglink"
            drag
            :show-file-list="false"
            :headers="headersVo"
            name="resfile"
            :data="saveData"
            :action="actionUrl"
            :on-success="handleUploadSuccess"
          >
          <div class="preview" v-show="info.imageSrc && info.imageSrc != defaultQr">
            <img :src="info.imageSrc" alt="">
          </div>
           <div data-v-4d7778f2="" class="noPic" v-show="!info.imageSrc || info.imageSrc == defaultQr">
             <i data-v-4d7778f2="" class="iconfont-v3 saasicon_shangchuan"></i>
              <div data-v-4d7778f2="" class="tips">
                <div data-v-62244b0e="">
                  <p data-v-62244b0e="">建议尺寸：300*300px，小于2M</p>
                  <p data-v-62244b0e="">支持jpg、gif、png、bmp</p>
                </div>
              </div>
            </div>
          </el-upload> -->
        <upload
          class="upload-imglink"
          v-model="domain_url"
          :domain_url="info.imageSrc"
          :saveData="{
            path: 'interacts/menu-qrcode-imgs',
            type: 'image'
          }"
          :on-success="handleUploadSuccess"
          @delete="deleteImg"
          :before-upload="beforeUploadHnadler"
        >
          <div slot="tip">
            <p>建议尺寸：300*300px，小于4M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
      </div>
    </div>
  </div>
</template>
<script>
  import upload from '@/components/Upload/main';
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';
  import { v1 as uuidV1 } from 'uuid';

  export default {
    name: 'component-qrcode',
    props: {
      // 1. 显示  2. 编辑
      mode: {
        required: true,
        default: 1
      },
      info: {
        required: false
      }
    },

    components: {
      upload
    },

    data() {
      return {
        domain_url: '',
        saveData: {
          path: 'interacts/menu-qrcode-imgs',
          type: 'image'
        },
        actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`,
        defaultQr: `//aliqr.e.vhall.com/qr.png?t=${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
        token: localStorage.getItem('token') || ''
      };
    },
    computed: {
      headersVo: function () {
        let vo = { token: this.token, platform: 17, 'request-id': uuidV1() };
        // 取缓存userId相关
        if (window.sessionStorage.getItem('userId')) {
          vo['gray-id'] = window.sessionStorage.getItem('userId');
        }
        return vo;
      }
    },
    methods: {
      handleUploadSuccess(e) {
        console.log('二维码上传成功', e);
        this.domain_url = e.data.domain_url;
        if (e.code == 200) {
          this.info.imageSrc = e.data.domain_url;
          this.$emit('updateInfo', {
            ...this.info,
            hrc: e.data.domain_url,
            isDefault: false
          });
        } else {
          this.$message({
            message: e.msg,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      },
      deleteImg() {
        this.info.imageSrc = this.defaultQr;
        this.domain_url = '';
      },
      beforeUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isType) {
          this.$message({
            message: `上传的图片只能是 ${typeList.join('、')} 格式`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `上传的图片大小不能超过 4M`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadError(e) {
        console.log('upload error', e);
        this.$message({
          message: e.msg,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .qr-editor-box {
    padding-top: 16px;
  }
  .qr-previewbox {
    .qrbox {
      position: relative;
      width: 140px;
      height: 140px;
      overflow: hidden;
      text-align: center;
      margin: 0 auto;
      background: #fff;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
      }
    }
  }
  .label {
    display: inline-block;
    vertical-align: top;
    margin-right: 12px;
    color: #1a1a1a;
    font-size: 14px;
  }
  .editorContent {
    display: inline-block;
    width: 312px;
    height: 180px;
    border: 1px solid #cccccc;
    overflow: hidden;
    position: relative;
    background: #f7f7f7;
    border-radius: 4px;
    .noPic {
      i {
        font-size: 36px;
        color: #999;
      }
    }
    .tips {
      position: absolute;
      top: 93px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      color: #999;
      p {
        line-height: 17px;
      }
    }
    /deep/ .preview {
      border: 0;
      width: 100%;
      height: 100%;
      position: relative;
      img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        max-height: 100%;
        margin: auto;
      }
    }
    .upload-imglink {
      width: 100%;
      height: 100%;
    }
    /deep/ .el-upload--picture-card,
    /deep/ .el-upload-dragger {
      width: 100%;
      height: 180px;
      border: 0;
      background: #f7f7f7;
    }
  }
</style>
