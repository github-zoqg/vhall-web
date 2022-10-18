<template>
  <div class="qrcode-wrapbox">
    <div class="qr-previewbox" v-if="mode == 1">
      <div>
        <img :src="info.imageSrc ? info.imageSrc : defaultImg" style="width: 100%" alt="">
      </div>
    </div>
    <div class="qr-editor-box" v-if="mode == 2">
      <div style="margin-top: 16px">
        <div class="label">
          <span style="color:#FB3A32">*</span>图片地址
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
          <div class="preview" v-show="info.imageSrc">
            <img :src="info.imageSrc" alt="">
          </div>
           <div data-v-4d7778f2="" class="noPic" v-show="!info.imageSrc">
              <i data-v-4d7778f2="" class="iconfont-v3 saasicon_shangchuan"></i>
              <div data-v-4d7778f2="" class="tips">
                <div data-v-62244b0e="">
                  <p data-v-62244b0e="">建议尺寸：400*225px，小于2M</p>
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
              path: 'interacts/menu-link-imgs',
              type: 'image',
            }"
            :on-success="handleUploadSuccess"
            @delete="deleteImg"
            :before-upload="beforeUploadHnadler">
            <div slot="tip">
              <p>建议尺寸：400*225px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </div>
      </div>
      <div></div>
      <div style="margin-top: 30px">
        <div class="label">
          <span style="color:#FB3A32">*</span>跳转链接
        </div>
        <div class="editorContent">
          <el-input v-model="info.src" @change="changeLink" placeholder="请输入http://或https://开头的跳转地址"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../../bus'
import eventsType from '../../EventConts'
import {v1 as uuidV1} from "uuid";
import upload from '@/components/Upload/main';

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
  components: {
    upload
  },
  data() {
    return {
      domain_url: '',
      defaultImg: '//cnstatic01.e.vhall.com/static/images/menu/image-unit.png',
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`,
      saveData: {
        path: 'interacts/menu-link-imgs',
        type: 'image'
      },
      token: localStorage.getItem('token') || ''
    }
  },
  computed: {
    headersVo: function() {
      let vo = {token: this.token, platform: 17, 'request-id': uuidV1()}
      // 取缓存userId相关
      if (window.sessionStorage.getItem('userId')) {
        vo['gray-id'] = window.sessionStorage.getItem('userId')
      }
      return vo
    },
  },
  mounted() {
    console.log('上传相关地址', this.actionUrl)
  },
  methods: {
    handleUploadSuccess(e) {
      console.log('二维码上传成功', e)
      if(e.code == 200) {
        this.domain_url = e.data.domain_url
        this.info.imageSrc = e.data.domain_url
        this.$emit('updateInfo', {
          ...this.info,
        })
      } else {
        this.$message({
          message: e.msg ,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    },

    changeLink() {
      const result = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(this.info.src)
      this.info.src = this.info.src.trim()
      if(result) {
        this.$emit('updateInfo', this.info)
      } else {
        this.$message.warning('请输入http://或https://开头的链接')
      }
    },
    deleteImg() {
      this.info.imageSrc = this.defaultImg;
      this.domain_url = '';
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
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
          message: `上传的图片大小不能超过 2M`,
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
      console.log('upload error', e)
      this.$message({
        message: e.msg ,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
  }
}
</script>
<style lang="less" scoped>
  .qr-previewbox{
    img{
      width: 100%;
      height: 100%;
    }
  }
  /deep/.el-upload--picture-card i.saasicon_shangchuan {
    font-size: 36px;
    color: #999;
  }
  /deep/.noPic{
    .saasicon_shangchuan{
      font-size: 36px;
      color: #999;
    }
  }
  /deep/.tips {
    p {
      font-size: 12px;
      color: #999;
      text-align: center;
      line-height: 16px;
    }
  }
  .label{
    display: inline-block;
    vertical-align: top;
  }
  .editorContent{
    margin-left: 10px;
    width: 321px;
    height: 180px;
    display: inline-block;
    position: relative;

    /deep/ .el-upload--picture-card{
      width: 100%;
      height: 100%;
      border: none;

    }
    /deep/ .el-upload-dragger{
      border: none;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    /deep/ .el-input__inner{
      line-height: 40px;
      height: 40px;
      padding: 0 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }.tips{
      position: absolute;
      top: 93px;
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
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    /deep/ .el-upload--picture-card, /deep/ .el-upload-dragger{
      width: 100%;
      height: 100%;
      border: 0;
      background: #F7F7F7;
    }
  }
  .preview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      max-width: 100%;
    }
  }
  .label{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #1A1A1A;
    span{
      margin-right: 5px;
    }
  }
  /* 图片上传 */
  .upload-qrCode{
    height: 180px;
    background: #CCCCCC;

  }

  .editorContent .el-upload--picture-card, .editorContent .el-upload-dragger {
    width: 100%;
    height: 180px;
    border: 0;
    background: #F7F7F7;
}
</style>
