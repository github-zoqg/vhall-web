<template>
  <div class="qrcode-wrapbox">
    <div class="qr-previewbox">
      <div class="qrbox">
        <img :src="info.imageSrc" alt="">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'component-qrcode',
  props: {
    info: {
      required: false
    }
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
      width: 140px;
      height: 140px;
      overflow: hidden;
      text-align: center;
      margin: 0 auto;
      background: #fff;
      margin-bottom: 30px;

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
</style>
