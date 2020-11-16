<template>
	<div>
    <el-form :model="unitRQCodeForm" ref="unitRQCodeForm" :rules="unitRQCodeFormRules" label-width="94px">
      <el-form-item label="二维码：" prop="rqCode">
        <upload
          :class="'upload__qrCode ' + imgType"
          v-model="unitRQCodeForm.httpRequestStatusCode"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <div slot="tip">
            <p>推荐尺寸：600*600px</p>
            <p>图片不超过100K</p>
            <p>(支持jpg、gif、png、bmp)</p>
          </div>
        </upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
export default {
  name: "rqCode.vue",
  components: {
    Upload
  },
  data() {
    return {
      imgType: 'default', // 默认宽高相等
      unitRQCodeForm: {
        rqCode: ''
      },
      unitRQCodeFormRules: {
      }
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
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
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.imgType = 'widthMore';
        } else if (img.width < img.height) {
          that.imgType = 'heightMore';
        } else {
          that.imgType = 'default';
        }
      };
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    }
  }
};
</script>

<style lang="less" scoped>
/* 二维码上传 */
.upload__qrCode {
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
