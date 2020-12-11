<template>
  <div class="wramUp-wrap">
    <pageTitle title="暖场视频">
      <template  slot="default">
        <el-switch
          v-model="warmFlag"
          :active-text="warmFlag ? '已开启，观看页面开播前已显示暖场视频': '开启后，观看页面开播前将显示暖场视频'">
        </el-switch>
      </template>
    </pageTitle>
    <div class="content">
      <el-form :model="warmForm" ref="warmForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择视频" required>
          <div class="selet-video">

          </div>
        </el-form-item>
        <el-form-item label="播放模式" required  prop="resource">
           <el-radio-group v-model="warmForm.resource">
              <el-radio label="单次播放"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="视频封面">
          <upload
            class="upload__avatar"
            v-model="warmForm.imageUrl"
            :domain_url="domain_url"
            :saveData="{
              path: 'saas/users/logo-imgs',
              type: 'image',
            }"
            :disabled='!warmFlag'
            :on-success="handleUploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="warmForm.imageUrl = ''">
            <p slot="tip">最佳头图尺寸：1600*900px <br/>小于2MB(支持jpg、png、gif)</p>
          </upload>
        </el-form-item>
        <el-form-item>
          <el-button :disabled='!warmFlag' type="primary" @click="submitForm('warmForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import Upload from '@/components/Upload/main';
import Env from "@/api/env";
export default {
  components: {
    PageTitle,
    Upload
  },
  data() {
    return {
      warmFlag: false,
      loading: false,
      warmForm: {
        videoUrl: '',
        resource:'单次播放',
        imageUrl: ''
      },
      domain_url: ''
    };
  },
  methods: {
    handleUploadSuccess(res, file) {
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.warmForm.imageUrl = file_url;
        this.domain_url = domain_url;
      }
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
    },
    submitForm(){
      if(this.warmForm.videoUrl == ''){
        this.$message.warning('请上传暖场视频');
      }else{
        this.$confirm('是否保存当前设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          console.log('点击的是确定');
        }).catch(() => {});
      }
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  .layout--right--main();
  .padding48-40();
}
.wramUp-wrap::v-deep{
  .avatar-uploader .el-upload {
     border: 1px dashed #d9d9d9;
     border-radius: 6px;
     cursor: pointer;
     position: relative;
     overflow: hidden;
   }
   .avatar-uploader .el-upload:hover {
     border-color: #409EFF;
   }
   .avatar-uploader-icon {
     font-size: 28px;
     color: #8c939d;
     width: 178px;
     height: 178px;
     line-height: 178px;
     text-align: center;
   }
   .avatar {
     width: 178px;
     height: 178px;
     display: block;
   }
   .selet-video{
     border: 1px dashed #d9d9d9;
     border-radius: 6px;
     width: 200px;
     height: 100px;
   }
}
</style>
