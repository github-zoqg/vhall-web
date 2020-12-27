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
        <Upload
          class="upload__avatar"
          v-model="info.imageSrc"
          :saveData="{
              path: 'interacts/menu-qrcode-imgs',
              type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-error="uploadError"
        ></Upload>
      </div>
    </div>
  </div>
</template>
<script>
import Upload from '@/components/Upload/main';
import EventBus from '../../bus'
import eventsType from '../../EventConts'

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
    Upload
  },

  data() {
    return {
      domain_url: '',
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
    display: inline-block;
  }
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      width: 180px;
      height: 180px;
      border: 1px solid #CCCCCC;
    }
    /deep/.box > div {
      width: 180px;
      height: 180px;
    }
  }
</style>
