<template>
  <div class="wramUp-wrap">
    <pageTitle pageTitle="暖场视频">
      <template  slot="default">
        <div class="switch__box">
          <el-switch
            v-model="warmFlag"
            @change="openCloseWarm"
            :active-text="warmFlag ? '已开启，预告状态观看端显示暖场视频': '开启后，预告状态观看端显示暖场视频'">
          </el-switch>
        </div>
      </template>
    </pageTitle>
    <div class="content">
      <el-form :model="warmForm" ref="warmForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择视频" required>
          <div class="selet-video" @mouseenter="showMenu" @mouseleave="hiddenMenu">
            <div class="mediaSlot" v-if="!selectMedia.paas_record_id" @click="warmFlag && changeVideo()">
              <div>
                <i class="iconfont-v3 saasicon_shangchuan"></i>
              </div>
              视频仅支持MP4格式，文件大小不超过200M<br>
              上传视频标题不能带有特殊字符和空格，需转码完成才能预览和观看<br>
              点播、音频直播不支持暖场视频
            </div>
            <div class="mediaSlot mediaOther" v-else>
              <icon icon-class="saasshipinwenjian"></icon>
              <p class="selectMediaName">{{selectMedia.name}}</p>
            </div>
            <div class="abRight" v-if="selectMedia.paas_record_id&&showChecked">
              <div class="tool" @click.stop="previewVideo">
                <i class="iconfont-v3 saasicon-eye"></i>
                <el-button type="text" class="operaBtn" >预览</el-button>
              </div>
              <div class="tool" @click.stop="deleteVideo">
                <i class="iconfont-v3 saasicon_shanchu"></i>
                <el-button type="text" class="operaBtn" >删除</el-button>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="播放模式" required  prop="resource">
           <el-radio-group v-model="warmForm.resource">
              <el-radio label="单次播放" :disabled='!warmFlag'></el-radio>
            </el-radio-group>
        </el-form-item> -->
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
            @delete="warmFlag && deleteImg()">
            <div slot="tip">
              <p>建议尺寸：1280*720px，小于4M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item>
          <el-button round class="length152" :disabled='!warmFlag' type="primary" @click="submitForm('warmForm')" v-preventReClick>提交</el-button>
        </el-form-item>
      </el-form>
      <div class="white-box" v-show="!warmFlag">
      </div>
    </div>
    <selectMedias ref="selecteMedia" @selected='mediaSelected' :videoSize="videoSize" :videoType="videoType"></selectMedias>
    <!-- 预览 -->
    <template v-if="showDialog">
      <div class="preview-wrap">
        <el-dialog class="vh-dialog" title="" :visible.sync="showDialog" width="30%" center
        :close-on-press-escape=false>
          <video-preview ref="videoPreview" :videoParam='selectMedia'></video-preview>
        </el-dialog>
      </div>
    </template>
    <begin-play :webinarId="$route.params.str"></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import Upload from '@/components/Upload/main';
import beginPlay from '@/components/beginBtn';
import selectMedias from './selecteMedia';
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
export default {
  components: {
    PageTitle,
    Upload,
    selectMedias,
    VideoPreview,
    beginPlay
  },
  data() {
    return {
      showChecked: false, // 是否滑中选择视频
      warmFlag: false,
      loading: false,
      videoSize: '200',
      videoType: 'MP4',
      warmId: '',
      selectMedia: {},
      showDialog: false,
      warmForm: {
        record_id: '',
        imageUrl: ''
      },
      domain_url: ''
    };
  },
  created() {
    this.getWarmVideoInfo();
  },
  beforeRouteLeave (to, from, next) {
    if (this.warmFlag && !this.warmForm.record_id && !this.warmForm.imageUrl) {
       this.$confirm('是否取消暖场视频的设置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.warmFlag = false;
        this.openCloseWarm(1);
        next();
      }).catch(() => {
      });
    } else {
      next();
    }
  },
  methods: {
    // 鼠标离开
    hiddenMenu () {
      this.showChecked = false
    },
    //鼠标滑上去
    showMenu () {
      this.showChecked = true
    },
    // 开启或关闭暖场视频
    openCloseWarm(index) {
      let params = {
        webinar_id: this.$route.params.str,
        is_open_warm_video: Number(this.warmFlag)
      }
      this.$fetch('warmOpen', params).then(res=>{
        if(res.code == 200){
          this.$message({
            message: this.warmFlag ? '开启暖场视频成功' : '关闭暖场视频成功',
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
        }
      }).catch(res => {
        this.$message({
          message: res.msg || (this.warmFlag ? '开启暖场视频失败' : '关闭暖场视频失败'),
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 获取暖场视频详情
    getWarmVideoInfo() {
      this.$fetch('warnInfo', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200) {
          this.warmFlag = Boolean(res.data.is_open_warm_video);
          this.warmId = res.data.warm_id;
          this.domain_url = res.data.img_url;
          this.warmForm.imageUrl = res.data.img_url;
          if (res.data.record_id) {
            this.selectMedia.paas_record_id = res.data.record_id;
            this.selectMedia.name = res.data.record_name;
          }
          this.warmForm.record_id = res.data.record_id;
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
    // 删除
    deleteVideo() {
      this.selectMedia = {};
      this.warmForm.record_id = '';
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
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.$message({
          message: "上传封面图片只能是 ${typeList.join('、')} 格式",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传封面图片大小不能超过 4M",
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
        message: "封面图片上传失败",
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    submitForm(){
      if(this.warmForm.record_id == ''){
        this.$message({
          message: "请上传暖场视频",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }else{
        this.$confirm('是否保存当前设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.saveWarmInfo();
        }).catch(() => {});
      }
    },
    saveWarmInfo() {
      let params = {
        is_open_warm_video: Number(this.warmFlag),
        img_url:  this.warmForm.imageUrl,
        webinar_id: this.$route.params.str,
        warm_id: this.warmId,
        record_id: this.warmForm.record_id
      }
      this.$fetch('warnEdit', this.$params(params)).then(res => {
        this.$message({
          message: `保存暖场视频成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(res => {
        this.$message({
          message: res.msg || "保存暖场视频失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 删除图片
    deleteImg() {
      this.warmForm.imageUrl = '';
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  .layout--right--main();
  .padding48-40();
  position: relative;
  .white-box{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;
  }
}
.demo-ruleForm {
  width: 600px;
}
.switch__box {
  display: inline-block;
}
/deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
  color: #999999;
  pointer-events: none;
  user-select: none;
}
.el-role-switch{
  margin-left: 8px;
  vertical-align: sub;
}
.wramUp-wrap::v-deep{
  .avatar-uploader .el-upload {
     width: 640px;
     height: 180px;
     border: 1px solid #cccccc;
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
   .el-upload:hover {
     border: 1px solid #999!important;
   }
   .selet-video{
     border: 1px solid #cccccc;
     border-radius: 6px;
     width: 640px;
     height: 180px;
     position: relative;
     background: #f7f7f7;
    .abRight{
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      top: 0px;
      right: 0px;
      // line-height: 180px;
      text-align: center;
      display:flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #fff;
      .tool{
        width: 30px;
        line-height: 20px;
        margin: 0px 5px;
        &:hover{
          cursor: pointer;
        }
      }
      span{
        color: #fff;
        font-size: 14px;
      }
      /deep/.saasicon-eye, /deep/.saasicon_shanchu{
        font-size: 18px!important;
        height: 30px;
      }
    }
    .operaBtn{
      font-size: 14px;
      color: #666;
      positioN: relative;
      &:hover{
        color: #FB3A32;
      }
    }
    &:hover{
      border: 1px solid #999;
    }
    .mediaSlot{
      width: 100%;
      text-align: center;
      vertical-align: middle;
      line-height: 18px;
      color: #999999;
      font-size: 12px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .selectMediaName{
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 144px;
        font-size: 14px;
        color: #666;
        padding-top: 12px;
        line-height: 18px;
      }
      .tip{
        width: 100%;
      }
      i{
        font-size: 30px;
      }
      /deep/.iconfont-v3{
        font-size: px;
      }
      /deep/.saasicon_shangchuan{
        font-size: 44px;
      }
      /deep/.saasshipinwenjian{
        color: #FF733C;
      }
      p{
        padding-top: 5px;
      }
    }
   }
}
.vh-dialog{
    /deep/ .el-dialog {
      width: 624px!important;
      background: transparent!important;
      border:none;
      box-shadow: none;
    }
    /deep/ .el-dialog__header {
      width: 642px!important;
      padding: 0px;
      height: 55px;
      background: transparent!important;
      border:none;
      color: #fff;
    }
    /deep/ .el-dialog__headerbtn{
      top: 30px;
      right: -18px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body{
      width: 642px;
      height: 375px;
      border-top: 4px solid #1a1a1a;
      border-bottom: 4px solid #1a1a1a;
      background: #1a1a1a;
      border-radius: 4px;
      padding: 0 4px;
    }
  }
.box{
  text-align: center;
}


</style>
