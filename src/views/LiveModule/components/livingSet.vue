<template>
  <div class="living-setting">
    <div class="living-setting_type">
      <div class="type_item" v-for="(item, index) in themeTypeList" :key="index">
        <span class="type_item_title">{{ item.title }}</span>
        <p class="type_item_check" :class="item.isActive ? 'active' : ''" @click="activeTheme(item)">
          <span class="checked_img" v-if="item.isActive"><img src="../../../common/images/icon-choose.png" alt=""></span>
        </p>
      </div>
    </div>
    <div class="living-setting_preview">
      <div class="preview_btn">
        <vh-radio-group v-model="livingPreview" size="small">
          <vh-radio-button round :label="1">PC预览</vh-radio-button>
          <vh-radio-button round :label="2">手机预览</vh-radio-button>
        </vh-radio-group>
      </div>
      <div class="preview_box">
        <div class="preview_box_pc">
          <div class="preview_type">
            <vh-radio-group v-model="livingPcPreviewType" size="mini">
            <vh-radio-button round :label="1">直播间</vh-radio-button>
            <vh-radio-button round :label="2">引导页</vh-radio-button>
          </vh-radio-group>
          </div>
        </div>
        <div class="preview_box_wap"></div>
      </div>
    </div>
    <div class="living-setting_form">
      <div class="living-setting_form_opera">
        <vh-button size="small" plain round v-preventReClick @click="resetForm">恢复默认</vh-button>
        <vh-button size="small" plain  round v-preventReClick @click="goPreviewLiving">预览</vh-button>
        <vh-button type="primary" size="small" round v-preventReClick>保存</vh-button>
      </div>
      <div class="form_item">
        <p class="form_item_title">主题色</p>
        <color-set ref="pageThemeColors" :isShowMain="false"  :themeKeys=pageThemeColors  :colorDefault="livingForm.pageStyle"></color-set>
      </div>
      <div class="form_item">
        <p class="form_item_title">主题背景</p>
        <input type="file"  accept="image/*" @change="setImage" id="image" />
        <!-- <upload
          class="upload__living"
          id="living_cropper"
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
        </upload> -->
      </div>
      <div class="form_item">
        <span class="vague_theme">模糊程度</span>
        <vh-slider v-model="livingForm.theme_vague" style="width: 131px"></vh-slider>
        <span class="vague_num">{{livingForm.theme_vague}}%</span>
      </div>
      <div class="form_item">
        <span class="vague_theme">背景亮度</span>
        <vh-slider v-model="livingForm.theme_light" style="width: 131px"></vh-slider>
        <span class="vague_num">{{livingForm.theme_light}}%</span>
      </div>
      <div class="form_item">
        <span class="vague_theme">聊天布局</span>
        <vh-radio-group v-model="livingForm.chatLayout" size="mini">
          <vh-radio-button round :label="1">上下显示</vh-radio-button>
          <vh-radio-button round :label="2">左右显示</vh-radio-button>
        </vh-radio-group>
      </div>
      <div class="form_item_br">
        以下设置对PC端和移动端同时生效～
      </div>
      <div class="form_item">
        <p class="form_item_title">视频区【连麦】布局</p>
        <div class="form_item_lay">
          <div class="item_lay" @click="choseMicrophone(1)">
            <p :class="livingForm.microphone == 1 ? 'active' : ''"><img src="./image/main_1.png" alt=""></p>
            <span>主次浮窗</span>
          </div>
          <div class="item_lay" @click="choseMicrophone(2)">
            <p :class="livingForm.microphone == 2 ? 'active' : ''"><img src="./image/main_2.png" alt=""></p>
            <span>主次平铺</span>
          </div>
          <div class="item_lay" @click="choseMicrophone(3)">
            <p :class="livingForm.microphone == 3 ? 'active' : ''"><img src="./image/main_3.png" alt=""></p>
            <span>均匀排列</span>
          </div>
        </div>
      </div>
      <div class="form_item">
        <p class="form_item_title">视频区底色</p>
        <color-set ref="videoColors" :isShowMain="false"  :themeKeys="videoColors"  :colorDefault="livingForm.videoStyle"></color-set>
      </div>
      <div class="form_item">
        <p class="form_item_title">视频区背景</p>
        <upload
          class="upload__living"
          id="living_cropper"
          v-model="livingForm.video_url"
          :domain_url="video_url"
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
      </div>
      <div class="form_item">
        <span class="vague_theme">模糊程度</span>
        <vh-slider v-model="livingForm.video_vague" style="width: 131px"></vh-slider>
        <span class="vague_num">{{livingForm.video_vague}}%</span>
      </div>
      <div class="form_item">
        <span class="vague_theme">背景亮度</span>
        <vh-slider v-model="livingForm.video_light" style="width: 131px"></vh-slider>
        <span class="vague_num">{{livingForm.video_light}}%</span>
      </div>
    </div>
    <living-preview ref="livingPreview"></living-preview>
    <cropper ref="livingCropper" cropperDom="living_cropper"></cropper>
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
      themeTypeList: [
        {
          title: '简洁白',
          url: '',
          isActive: true
        },
        {
          title: '炫酷黑',
          url: '',
          isActive: false
        },
        {
          title: '科技蓝',
          url: '',
          isActive: false
        },
        {
          title: '喜庆红',
          url: '',
          isActive: false
        },
      ],
      pageThemeColors: ['FFFFFF', '1A1A1A', 'FB2626', 'D9A90B', '1E4EDC'],
      videoColors: ['000000', '262626', '595959', '8F8F8F', 'D9D9D9'],
      domain_url: '',
      video_url: '',
      livingPreview: 1,
      livingPcPreviewType: 1,
      livingForm: {
        pageStyle: '#FFFFFF',
        videoStyle: '#000000',
        theme_url: '',
        theme_vague: 60,
        theme_light: 50,
        chatLayout: 1,
        microphone: 1, //连麦布局
        video_url: '',
        video_vague: 100,
        video_light: 90
      },
      reader: ''
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
    activeTheme(item) {
      this.themeTypeList.map(item => {
        return item.isActive = false
      })
      item.isActive = true;
    },
    resetForm() {
      let obj = {
        src: 'https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202207/d0/e7/d0e737b7c30eced4bc498a93e647eae6.jpg'
      }
      this.$refs.livingCropper.showModel(obj)
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
    choseMicrophone(index) {
      this.livingForm.microphone = index;
    },
    setImage(e) {
      let file = e.target.files[0];
      console.log(file)
      let obj = {}
      this.reader = '';
      const reader = new FileReader();
      reader.onload = (event) => {
        let typeArr = file.type.toLowerCase().split('/');
        obj.src = event.target.result;
        this.$refs.livingCropper.showModel(obj)
        console.log(event, typeArr, '??13142353')
      }
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let obj = {
          src: res.data.domain_url,
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
      // let obj = {
      //   src: file.name
      //   // src: 'https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202207/d0/e7/d0e737b7c30eced4bc498a93e647eae6.jpg'
      // }
      // this.$refs.livingCropper.showModel(obj)
      // return;
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
    padding-top: 16px;
    display: flex;
    &_type{
      display: flex;
      flex-direction: column;
      padding-top: 64px;
      width: 240px;
      padding-left: 24px;
      .type_item{
        padding-bottom: 24px;
        &_title{
          color: #262626;
        }
        &_check{
          margin-top: 12px;
          width: 192px;
          height: 108px;
          background: #d9d9d9;
          border-radius: 4px;
          border: 1px solid transparent;
          cursor: pointer;
          &.active {
            border: 1px solid #fb3a32;
          }
          .checked_img{
            float: right;
            width: 24px;
            height: 24px;
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }
        }
      }
    }
    &_preview{
      width: calc(100% - 516px);
      .preview_btn{
        text-align: center;
      }
      .preview_box{
        margin-top: 16px;
        width: 100%;
        height: 500px;
        padding-right: 24px;
        &_pc{
          height: 500px;
          background: #d9d9d9;
        }
      }
    }
    &_form{
      width: 276px;
      padding-right: 24px;
      &_opera{
        // text-align: center;
        padding-bottom: 40px;
      }
      .form_item{
        padding-bottom: 24px;
        &_title, .vague_theme{
          margin-bottom: 10px;
          color: #262626;
          font-size: 14px;
          line-height: 20px;
        }
        .vh-slider{
          display: inline-block;
          vertical-align: middle;
        }
        .vague_theme{
          padding-right: 12px;
        }
        .vague_num{
          padding-left: 10px;
          font-size: 14px;
          color: #595959;
        }
        &_br{
          color: #8c8c8c;
          font-size: 14px;
          line-height: 22px;
          padding: 8px 0 24px 0;
          text-align: center;
          border-top: 1px solid #f0f0f0;
        }
        &_lay {
          display: flex;
          align-content: center;
          justify-content: space-around;
          >div{
            text-align: center;
            cursor: pointer;
          }
          p{
            width: 68px;
            height: 46px;
            border-radius: 4px;
            margin-bottom: 5px;
            border: 1px solid transparent;
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
            &.active{
              border: 1px solid #FB2626;
            }
          }
          span{
            font-size: 12px;
            color: #666;
            line-height: 18px;
          }
        }
      }
    }
  }
  .upload__living{
    /deep/.el-upload--picture-card {
      width: 228px;
      height: 128px;
    }
    /deep/.box > div {
      width: 228px;
      height: 128px;
    }
  }
</style>
