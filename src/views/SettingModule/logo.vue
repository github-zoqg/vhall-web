<template>
  <!-- 有权限内容 -->
  <div v-if="isAuth">
    <pageTitle title='控制台标志'></pageTitle>
    <el-form :model="logoForm" ref="logoForm">
      <el-form-item label="标志替换：">
        <upload
          class="upload__avatar"
          v-model="logoForm.logoUrl"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <p slot="tip">最佳头图尺寸：1280*720px <br/>小于2MB(支持jpg、gif、png、bmp)</p>
        </upload>
      </el-form-item>
    </el-form>
  </div>
  <!-- 无权限内容 -->
  <no-auth v-else></no-auth>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import NoAuth from '../PlatformModule/Error/noAuth.vue';
import Upload from '@/components/Upload/main';
export default {
  name: "logo.vue",
  components: {
    PageTitle,
    NoAuth,
    Upload
  },
  data() {
    return {
      isAuth: true,
      logoForm: {
        logoUrl: ''
      }
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      this.logoForm.logoUrl = URL.createObjectURL(file.raw);
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`标志上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    }
  }
};
</script>

<style lang="less" scoped>
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      width: 180px;
      height: 180px;
      border: 1px solid #CCCCCC;
      img {
        width: 100%;
        height: auto;
      }
    }
    /deep/.box > div {
      width: 180px;
      height: 180px;
    }
    &.withMore {
      /deep/.el-upload--picture-card {
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    &.heightMore {
      /deep/.el-upload--picture-card {
        img {
          width: auto;
          height: 100%;
        }
      }
    }
  }
</style>
