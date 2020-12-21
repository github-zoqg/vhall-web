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
            <div class="mediaSlot" v-if="!selectMedia" @click="warmFlag && changeVideo()">
            <i class="el-icon-film"></i>
              <p>视频仅支持MP4格式，<br>文件大小不超过200M</p>
            </div>
            <div class="mediaSlot mediaOther" v-else>
              <icon icon-class="saasshipinwenjian"></icon>
              <p>{{selectMedia.name}}</p>
            </div>
            <div class="abRight" v-if="!!selectMedia">
              <el-button type="text" class="operaBtn" @click="previewVideo">预览</el-button>
              <el-button type="text" class="operaBtn" @click="selectMedia=null">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="播放模式" required  prop="resource">
           <el-radio-group v-model="warmForm.resource">
              <el-radio label="单次播放" :disabled='!warmFlag'></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="视频封面">
          <upload
            class="upload__avatar"
            v-model="warmForm.imageUrl"
            :domain_url="domain_url"
            :saveData="{
              path: 'users/logo-imgs',
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
    <selectMedia ref="selecteMedia" @selected='mediaSelected'></selectMedia>
    <!-- 预览 -->
    <template v-if="showDialog">
    <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
      <video-preview ref="videoPreview" :videoParam='selectMedia'></video-preview>
    </el-dialog>
  </template>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import Upload from '@/components/Upload/main';
import Env from "@/api/env";
import selectMedia from './selecteMedia';
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
export default {
  components: {
    PageTitle,
    Upload,
    selectMedia,
    VideoPreview
  },
  data() {
    return {
      warmFlag: false,
      loading: false,
      warmId: '',
      selectMedia: null,
      showDialog: false,
      warmForm: {
        record_id: '',
        resource:'单次播放',
        imageUrl: ''
      },
      domain_url: ''
    };
  },
  created() {
    this.getWarmVideoInfo();
  },
  methods: {
    // 获取暖场视频详情
    getWarmVideoInfo() {
      this.$fetch('warnInfo', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200) {
          this.warmFlag = Boolean(res.data.is_open_warm_video);
          this.warmId = res.data.warm_id;
          this.domain_url = res.data.img_url;
          this.warmForm.imageUrl = res.data.img_url;
          if (res.data.record_id) {
            this.getMediaList(res.data.record_id)
          }
        }
      })
    },
    changeVideo() {
      this.$refs.selecteMedia.dialogVisible = true;
    },
    mediaSelected(media){
      this.selectMedia = media;
      this.warmForm.record_id = media.paas_record_id;
    },
    // 预览
    previewVideo() {
      this.showDialog = true;
    },
    getMediaList(id) {
      let params = {
        pos:0,
        limit: 50
      }
      this.$fetch('dataVideoList', params).then(res=>{
        if(res.code == 200){
          this.selectMedia = res.data.list.filter(item => item.paas_record_id === id)[0];
        }
      });
    },
    handleUploadSuccess(res, file) {
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
      if(this.warmForm.record_id == ''){
        this.$message.error('请上传暖场视频');
      }else{
        this.$confirm('是否保存当前设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          this.setWarmBackground();
          // this.saveWarmInfo();
        }).catch(() => {});
      }
    },
    saveWarmInfo() {
      this.$fetch('warmCreate', {webinar_id: this.$route.params.str, record_id: this.warmForm.record_id}).then(res => {
        if (res.code == 200) {
          this.$message.success('创建暖场视频成功');
        }
      })
    },
    setWarmBackground() {
      let params = {
        webinar_id: this.$route.params.str,
        warm_id: this.warmId,
        img_url: this.domain_url
      }
      this.$fetch('warnEdit', params).then(res => {
        if (res.code == 200) {
          this.saveWarmInfo();
        }
      })
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
     position: relative;
     .abRight{
      position: absolute;
      top: -5px;
      right: 10px;
    }
    .operaBtn{
      font-size: 14px;
      color: #666;
      &:hover{
        color: #FB3A32;
      }
    }
    &:hover{
      border-color: #FB3A32;
    }
    .mediaSlot{
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
      color: #999999;
      font-size: 12px;
      cursor: pointer;
      padding-top: 15px;
      i{
        font-size: 30px;
      }
      /deep/.iconfont-v3{
        font-size: 26px;
      }
    }
    .mediaOther{
      padding-top: 30px;
    }
   }
}
</style>
