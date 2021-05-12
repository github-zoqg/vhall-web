<template>
  <div class="share-setting">
    <pageTitle pageTitle="分享设置"></pageTitle>
    <div class="share-container">
      <div class="share-left">
        <el-form :model="formShareInfo" ref="ruleForm" label-width="80px">
        <el-form-item label="分享标题">
          <VhallInput
            v-model="formShareInfo.title"
            class="textType"
            placeholder="请输入分享标题"
            autocomplete="off"
            :maxlength="30"
            v-clearEmoij
            show-word-limit
          ></VhallInput>
          <p class="tip">提示：为了您的内容获得有效传播，建议文字不超过14个字符</p>
        </el-form-item>
        <el-form-item label="分享简介">
          <VhallInput
              v-model="formShareInfo.desciption"
              type="textarea"
              class="desc"
              :maxlength="50"
              placeholder="请输入分享简介"
              autocomplete="off"
              :autosize="{ minRows: 5 }"
              resize="none"
              show-word-limit
            ></VhallInput>
            <p class="tip">提示：因手机型号不同，简介内容会显示不完整，建议不超过32个字符</p>
        </el-form-item>
        <el-form-item label="分享图标">
          <upload
            class="giftUpload"
            :heightImg="138"
            :widthImg="138"
            v-model="formShareInfo.img_url"
            :domain_url="domain_url"
            :on-success="uploadAdvSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHnadler"
            @delete="deleteImg"
          >
            <div slot="tip">
              <p>建议尺寸：150*150px，小于1M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary length152" round v-preventReClick @click="sureShareSetting">保存</el-button>
        </el-form-item>
      </el-form>
      </div>
      <div class="share-right"></div>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
export default {
  name: 'shareSet',
  components: {
    PageTitle,
    upload
  },
  data() {
    return {
      formShareInfo: {
        title: '',
        img_url: '',
        desciption: ''
      },
      domain_url: ''
    }
  },
  methods: {
    // 保存设置项
    sureShareSetting() {
      console.log('1111111111')
    },
    deleteImg() {
      this.domain_url = '';
      this.formShareInfo.img_url = '';
    },
    uploadAdvSuccess(res, file) {
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.formShareInfo.img_url = file_url;
        this.domain_url = domain_url;
      }
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isType) {
        this.$message({
          message: `分享图片只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `分享图片大小不能超过 1M`,
          showClose: true,
          // duration: 0,
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
      console.log('uploadError', err, file, fileList);
      this.$message({
        message: `分享图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    }
  }
}
</script>
<style lang="less" scoped>
  .share-setting{
    width: 100%;
    .share-container{
      display: flex;
    }
    .share-left{
      width: 45%;
      .tip{
        color: #999;
      }
      /deep/ .desc .el-textarea__inner{
        font-family: "-apple-system", "BlinkMacSystemFon", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      }
    }
    .share-right{
      width: 420px;
      height: 690px;
      margin-top: -30px;
      margin-left: 100px;
      background-image: url('../../../common/images/poster/phone-poster@2x.png');
      background-size: 100%;
      background-position: center;
      background-size: cover;
      position: relative;
    }
  }
</style>
