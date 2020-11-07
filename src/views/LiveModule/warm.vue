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
          <el-upload :disabled='!warmFlag' class="avatar-uploader" action="/mock/user/picupload"
            :show-file-list="false" :limit='1' :on-success="handleuploadSuccess" :before-upload="beforeUpload">
            <img v-if="warmForm.imageUrl" :src="warmForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__text">
              建议尺寸1600*900，大小不超过2MB<br>支持jpg、png、gif格式
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button :disabled='!warmFlag' type="primary" @click="submitForm('warmForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/views/LiveModule/components/pageTitle';
export default {
  components: {
    PageTitle
  },
  data() {
    return {
      warmFlag: false,
      loading: false,
      warmForm: {
        videoUrl: '',
        resource:'单次播放',
        imageUrl: ''
      }
    };
  },
  methods: {
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
    },
    beforeUpload(file){
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`文件格式错误，请重新上传/您上传的文件过大，请重新上传`);
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
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleuploadSuccess(res, file){
      this.warmForm.imageUrl = URL.createObjectURL(file.raw);
    },
  },
};
</script>
<style lang="less" scoped>
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
