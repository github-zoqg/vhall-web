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
            class="upload-imglink"
            drag
            :show-file-list="false"
            :headers="{token: token, platform: 17}"
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
          </el-upload>
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

  // components: {
  //   Upload
  // },

  data() {
    return {
      domain_url: '',
      saveData: {
        path: 'interacts/menu-qrcode-imgs',
        type: 'image',
      },
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`,
      defaultQr: `//aliqr.e.vhall.com/qr.png?t=${process.env.VUE_APP_WAP_WATCH}/watch/${this.$route.params.str}`,
      token: localStorage.getItem('token') || ''
    }
  },

  methods: {
    handleUploadSuccess(e) {
      console.log('二维码上传成功', e)
      if(e.code == 200) {
        this.info.imageSrc = e.data.domain_url
        this.$emit('updateInfo', {
          ...this.info,
          hrc: e.data.domain_url,
          isDefault: false
        })
      } else {
        this.$message.error(e.msg)
      }
    },

    uploadError(e) {
      console.log('upload error', e)
      this.$message.error(e.msg)
    },
  }
}
</script>
<style lang="less" scoped>
  .qr-editor-box{
    padding-top: 16px;
  }
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
    vertical-align: top;
    margin-right: 12px;
    color: #1A1A1A;
    font-size: 14px;
  }
  .editorContent{
    display: inline-block;
    width: 376px;
    height: 180px;
    border: 1px solid #CCCCCC;
    overflow: hidden;
    position: relative;
    background: #F7F7F7;
    border-radius: 4px;
    .tips{
      position: absolute;
      top: 100px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      color: #999;
    }
    /deep/ .preview{
      border: 0;
      width: 100%;
      height: 100%;
      position: relative;
      img{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        max-height: 100%;
        margin: auto;
      }
    }
    .upload-imglink{
      width: 100%;
      height: 100%;
    }
    /deep/ .el-upload--picture-card, /deep/ .el-upload-dragger{
      width: 100%;
      height: 100%;
      border: 0;
      background: #F7F7F7;
    }
  }
</style>
