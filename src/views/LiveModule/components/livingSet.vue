<template>
  <div class="living-setting">
    <div class="living-setting_form">
       <vh-form :model="livingForm" ref="livingForm" label-width="100px">
          <vh-form-item label="主题色">
            <color-set ref="pageThemeColors"  :themeKeys=pageThemeColors  :colorDefault="livingForm.pageStyle"></color-set>
          </vh-form-item>
          <vh-form-item label="主题背景" prop="theme_url">
            <upload
              class="upload__living"
              v-model="livingForm.theme_url"
              :domain_url="domain_url"
              :saveData="{
                path: pathUrl,
                type: 'image',
              }"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :heightImg="130"
              :widthImg="231"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>建议尺寸：1920*1080px，小于4M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
          </vh-form-item>
          <vh-form-item label="模糊程度">
            <vh-slider v-model="livingForm.theme_vague" style="width: 315px"></vh-slider>
            <span class="isNum">{{livingForm.theme_vague}}%</span>
          </vh-form-item>
          <vh-form-item label="亮度">
            <vh-slider v-model="livingForm.theme_light" style="width: 315px"></vh-slider>
            <span class="isNum">{{livingForm.theme_light}}%</span>
          </vh-form-item>
          <vh-form-item label="聊天布局">
             <vh-radio-group v-model="livingForm.chatLayout">
              <vh-radio :label="0">上下显示</vh-radio>
              <vh-radio :label="1">左右显示</vh-radio>
            </vh-radio-group>
          </vh-form-item>
          <p>-以下设置对pc端和移动端同时生效-</p>
          <vh-form-item label="视频区【连麦】布局">

          </vh-form-item>
           <vh-form-item label="视频区底色">

          </vh-form-item>
          <!-- <vh-form-item label="">
            <vh-button type="primary" v-preventReClick round @click.prevent.stop="skinSetSave">保 存</vh-button>
          </vh-form-item> -->
        </vh-form>
    </div>
    <div class="living-setting_opera">
      <vh-button size="medium" round v-preventReClick>恢复默认</vh-button>
      <vh-button type="white-medium" size="medium" round v-preventReClick @click="goPreviewLiving">预览</vh-button>
      <vh-button type="primary" size="medium" round v-preventReClick>保存</vh-button>
    </div>
    <living-preview ref="livingPreview"></living-preview>
    <cropper ref="livingCropper"></cropper>
  </div>
</template>
<script>
import livingPreview from './livingPreview.vue';
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';
import cropper from '@/components/Cropper'
export default {
  name: 'livingSet',
  data() {
    return {
      pageThemeColors: ['1A1A1A', 'FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      domain_url: '',
      livingForm: {
        pageStyle: '#1A1A1A',
        theme_url: '',
        theme_vague: 60,
        theme_light: 50,
        chatLayout: 0
      }
    }
  },
  components: {
    livingPreview,
    ColorSet,
    Upload,
    cropper
  },
  computed: {
    pathUrl() {
      return `interacts/screen-imgs/${this.$moment().format('YYYYMM')}`;
    }
  },
  created() {
    this.initComp()
  },
  methods: {
    initComp(){
      console.log('我是初始化接口')
    },
    goPreviewLiving(){
      this.$refs.livingPreview.dialogVisible = true
    },
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.livingForm.theme_url = '';
        this.domain_url = '';
      });
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let obj = {
          img: res.data.domain_url,
          url: res.data.file_url
        }
        this.$refs.livingCropper.showModel(obj)
        // let domain_url = res.data.domain_url || ''
        // let file_url = res.data.file_url || '';
        // this.livingForm.theme_url = file_url;
        // this.domain_url = domain_url;
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.$message({
          message: `背景图片只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `背景图片大小不能超过 4MB!`,
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
        message:  `背景图片上传失败`,
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
  .living-setting{
    padding-top: 32px;
    &_form{

    }
  }
  .upload__living{
        /deep/.el-upload--picture-card {
          width: 400px;
          height: 130px;
        }
        /deep/.box > div {
          width: 400px;
          height: 130px;
        }
      }
</style>
