<template>
  <div class="qrcode-wrapbox">
    <div class="qr-previewbox" v-if="mode == 1">
      <div class="qrbox">
        <img :src="info.imageSrc" alt="">
      </div>
    </div>
    <div class="qr-editor-box" v-if="mode == 2">
      <div class="label">
        <span style="color:#FB3A32">*</span>二维码
      </div>
      <div class="editorContent">
        <el-upload
          class="upload-qrCode"
          drag
          :action="actionUrl"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">最佳封面尺寸：300*300px，小于2MB </div>
          <div class="el-upload__tip" slot="tip">(支持格式jpg、png、bmp)</div>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../../bus'
import eventsType from '../../EventConts'

export default {
  name: 'component-line',
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

  data() {
    return {
      domain_url: '',
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`
    }
  },

  methods: {
    handleUploadSuccess(e) {
      console.log('二维码上传成功', e)

      this.info.imageSrc = e.data.domain_url
      this.$emit('updateInfo', {
        ...this.info,
        hrc: e.data.domain_url,
        isDefault: false
      })
    },

    uploadError(e) {
      console.log('upload error', e)
    },
  }
}
</script>
<style lang="less" scoped>
  .qr-previewbox{
    .qrbox {
      position: relative;
      width: 160px;
      height: 160px;
      overflow: hidden;
      text-align: center;
      margin: 0 auto;
      background: #fff;

      img {
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
      }
    }
  }
  .label{
    display: inline-block;
  }
  .editorContent{
    margin-left: 10px;
    display: inline-block;
  }
  /* 图片上传 */
  .upload-qrCode{
    height: 180px;
    background: #CCCCCC;

  }
</style>
