<template>
  <div class="line-wrapbox">
    <div class="line-previewbox" v-if="mode == 1">
      <div class="line"></div>
    </div>
    <div class="qr-editor-box" v-if="mode == 2"></div>
  </div>
</template>
<script>
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';

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
      };
    },

    methods: {
      handleUploadSuccess(e) {
        console.log('二维码上传成功', e);

        this.info.imageSrc = e.data.domain_url;
        this.$emit('updateInfo', {
          ...this.info,
          hrc: e.data.domain_url,
          isDefault: false
        });
      },

      uploadError(e) {
        console.log('upload error', e);
      }
    }
  };
</script>
<style lang="less" scoped>
  .line-wrapbox {
    line-height: 40px;
  }
  .line {
    height: 1px;
    background: #e6e6e6;
    margin: 10px 12px;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    overflow: hidden;
  }
</style>
