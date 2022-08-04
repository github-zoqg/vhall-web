<template>
  <div class="living-setting">
    <div class="living-setting_type">
      <template v-if="livingPreview==1">
        <div class="type_item" v-for="(item, index) in themeTypeList" :key="index">
          <span class="type_item_title">{{ item.title }}</span>
          <p class="type_item_check" :class="item.isActive ? 'active' : ''" @click="activeTheme(item)">
            <span class="checked_img" v-if="item.isActive"><img src="../../../common/images/icon-choose.png" alt=""></span>
          </p>
        </div>
      </template>
      <template v-else>
        <div class="type_item" v-for="(item, index) in themeWapTypeList" :key="index">
          <span class="type_item_title">{{ item.title }}</span>
          <p class="type_item_check" :class="item.isActive ? 'active' : ''" @click="activeWapTheme(item)">
            <span class="checked_img" v-if="item.isActive"><img src="../../../common/images/icon-choose.png" alt=""></span>
          </p>
        </div>
      </template>
    </div>
    <!-- 预览区域 -->
    <div class="living-setting_preview">
      <div class="preview_btn">
        <vh-radio-group v-model="livingPreview" size="small">
          <vh-radio-button round :label="1">PC预览</vh-radio-button>
          <vh-radio-button round :label="2">手机预览</vh-radio-button>
        </vh-radio-group>
      </div>
      <div class="preview_box">
        <div class="preview_type">
          <vh-radio-group v-model="livingPcPreviewType" size="mini">
            <vh-radio-button round :label="1">直播间</vh-radio-button>
            <vh-radio-button round :label="2">引导页</vh-radio-button>
          </vh-radio-group>
        </div>
        <div class="preview_container">
          <div class="preview_box_pc" v-if="livingPreview==1">
            <pc-preview :type="livingPcPreviewType" :domainUrl="domain_pc_url"></pc-preview>
          </div>
          <div class="preview_box_wap" v-else>
            <wap-preview :type="livingPcPreviewType"></wap-preview>
          </div>
        </div>
      </div>
    </div>
    <!-- 表单区域 -->
    <div class="living-setting_form">
      <div class="living-setting_form_opera">
        <vh-button size="small" plain round v-preventReClick @click="resetForm">恢复默认</vh-button>
        <vh-button size="small" plain  round v-preventReClick @click="goPreviewLiving">预览</vh-button>
        <vh-button type="primary" size="small" round v-preventReClick @click="saveSettingLivingInfo">保存</vh-button>
      </div>
      <!-- pc主题设置 -->
      <template v-if="livingPreview==1">
        <div class="form_item">
          <p class="form_item_title">主题色</p>
          <div class="theme_colors">
            <span v-for="(item, index) in pageThemeColors" :key="index" :style="{backgroundColor:item}"></span>
          </div>
        </div>
        <div class="form_item">
          <p class="form_item_title">主题背景</p>
          <upload
            class="upload__living"
            id="living_cropper"
            v-model="livingPcForm.theme_url"
            :domain_url="livingPcForm.theme_url"
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
          <vh-slider v-model="livingPcForm.theme_vague" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingPcForm.theme_vague}}</span>
        </div>
        <div class="form_item">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingPcForm.theme_light" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingPcForm.theme_light}}</span>
        </div>
      </template>
      <!-- wap主题设置 -->
      <template v-if="livingPreview==2">
        <div class="form_item">
          <p class="form_item_title">主题色</p>
          <div class="theme_colors">
            <span v-for="(item, index) in pageThemeColors" :key="index" :style="{backgroundColor:item}"></span>
          </div>
        </div>
        <div class="form_item" v-if="choseWapType==3">
          <p class="form_item_title">主题背景</p>
          <upload
            class="upload__living"
            id="living_cropper"
            v-model="livingWapForm.theme_url"
            :domain_url="livingWapForm.theme_url"
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
        <div class="form_item" v-if="choseWapType==3">
          <span class="vague_theme">模糊程度</span>
          <vh-slider v-model="livingWapForm.theme_vague" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingWapForm.theme_vague}}</span>
        </div>
        <div class="form_item" v-if="choseWapType==3">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingWapForm.theme_light" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingWapForm.theme_light}}</span>
        </div>
      </template>
      <!-- 视频区域设置 -->
      <template v-if="livingPcPreviewType==1">
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
        <div class="form_item" v-if="livingPreview == 2">
          <p class="form_item_title">视频区【连麦 + 演示】布局</p>
          <div class="form_item_lay form_item_video">
            <div class="item_lay">
              <p class="active"><img src="./image/main_1.png" alt=""></p>
              <span>上下模式</span>
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
            v-model="livingForm.video_url"
            :domain_url="livingForm.video_url"
            :saveData="{
              path: pathUrl,
              type: 'image',
            }"
            :on-success="handleUploadVideoSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :heightImg="130"
            :widthImg="231"
            :before-upload="beforeUploadHandler"
            @delete="resetVideoUrl">
            <div slot="tip">
              <p>建议尺寸：1920*1080px，小于4M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </div>
        <div class="form_item">
          <span class="vague_theme">模糊程度</span>
          <vh-slider v-model="livingForm.video_vague" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingForm.video_vague}}</span>
        </div>
        <div class="form_item">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingForm.video_light" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingForm.video_light}}</span>
        </div>
      </template>
    </div>
    <cropper @cropComplete="cropComplete" ref="livingCropper" cropperDom="living_cropper"></cropper>
    <living-preview ref="livingPreview"></living-preview>
  </div>
</template>
<script>
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';
import cropper from '@/components/Cropper';
import skins from '@/common/skins/index';
import livingPreview from './livingPreview.vue';
import pcPreview from './living_pc_preview.vue'
import wapPreview from './living_wap_preview.vue'
export default {
  name: 'livingSet',
  data() {
    return {
      themeTypeList: [
        {
          title: '炫酷黑',
          url: '',
          id: 1,
          isActive: true
        },
        {
          title: '简洁白',
          url: '',
          id: 2,
          isActive: false
        },
        {
          title: '科技蓝',
          url: '',
          id: 3,
          isActive: false
        },
        {
          title: '喜庆红',
          url: '',
          id: 4,
          isActive: false
        },
      ],
      themeWapTypeList: [
        {
          title: '传统风格',
          url: '',
          id: 1,
          isActive: true
        },
        {
          title: '时尚风格',
          url: '',
          id: 2,
          isActive: false
        },
        {
          title: '极简风格',
          url: '',
          id: 3,
          isActive: false
        }
      ],
      chosePcType: 1,
      choseWapType: 1,
      pageThemeColors: ['#1A1A1A', '#F0F0F0', '#FB2626', '1E4EDC'],
      videoColors: ['000000', '262626', '595959', '8F8F8F', 'D9D9D9'],
      livingPreview: 1,
      livingPcPreviewType: 1,
      livingWapForm: {
        pageStyle: '#FFFFFF', //主题色
        theme_url: '',
        theme_vague: 0,
        theme_light: 10
      },
      livingPcForm: {
        pageStyle: '#1A1A1A', //主题色
        theme_url: '',
        theme_vague: 0,
        theme_light: 10
      },
      livingForm: {
        videoStyle: '#000000', //视频区底色
        chatLayout: 1,
        microphone: 1, //连麦布局
        video_url: '',
        video_vague: 0,
        video_light: 10
      },
      themeImages: {
        x: 0,
        y:0,
        width: 0,
        height: 0
      },
      videoImages: {
        x: 0,
        y:0,
        width: 0,
        height: 0
      }
    }
  },
  components: {
    pcPreview,
    wapPreview,
    ColorSet,
    cropper,
    Upload,
    livingPreview
  },
  computed: {
    pathUrl() {
      return `interacts/screen-imgs/${this.$moment().format('YYYYMM')}`;
    },
    // pc端主题背景
    domain_pc_url() {
      if (!this.livingPcForm.theme_url) return;
      return `${this.livingPcForm.theme_url}?x-oss-process=image/crop,x_${this.themeImages.x.toFixed()},y_${this.themeImages.y.toFixed()},w_${this.themeImages.width.toFixed()},h_${this.themeImages.height.toFixed()}${this.livingPcForm.theme_vague > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingPcForm.theme_vague * 2}` : ''},x-oss-process=image/bright,${(this.livingPcForm.theme_light - 10) * 5} `;
    },
    // wap端主题背景
    domain_wap_url() {
      if (!this.livingWapForm.theme_url) return;
      return `${this.livingWapForm.theme_url}?x-oss-process=image/crop,x_${this.themeImages.x.toFixed()},y_${this.themeImages.y.toFixed()},w_${this.themeImages.width.toFixed()},h_${this.themeImages.height.toFixed()}${this.livingWapForm.theme_vague > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingWapForm.theme_vague * 2}` : ''},x-oss-process=image/bright,${(this.livingWapForm.theme_light - 10) * 5} `;
    },
    video_url() {
      if (!this.livingForm.video_url) return;
      return `${this.livingForm.video_url}?x-oss-process=image/crop,x_${this.videoImages.x.toFixed()},y_${this.videoImages.y.toFixed()},w_${this.videoImages.width.toFixed()},h_${this.videoImages.height.toFixed()}${this.livingForm.video_vague > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingForm.video_vague * 2}` : ''},x-oss-process=image/bright,${(this.livingForm.video_light - 10) * 5} `;
    }
  },
  mounted() {
    // 设置主题
    window.skins = skins;
    skins.setTheme(skins.themes.themeDefaultBlack, 'preview_container');
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
      this.chosePcType = item.id;
    },
    activeWapTheme(item) {
      this.themeWapTypeList.map(item => {
        return item.isActive = false
      })
      item.isActive = true;
      this.choseWapType = item.id;
    },
    getImageQuery(url) {
      if (url.indexOf('?') != -1) {
        let arr = url.split('?');
        return arr[0]
      } else {
        return url
      }
    },
    // 恢复默认（pc默认黑色，wap默认白色）
    resetForm() {
      if (this.livingPreview == 1) {
        this.livingPcForm = {
          pageStyle: '#1A1A1A', //主题色
          theme_url: '',
          theme_vague: 0,
          theme_light: 10
        }
      } else {
        this.livingWapForm = {
          pageStyle: '#FFFFFF', //主题色
          theme_url: '',
          theme_vague: 0,
          theme_light: 10
        }
      }
      this.livingForm = {
        videoStyle: '#000000',
        chatLayout: 1,
        microphone: 1, //连麦布局
        video_url: '',
        video_vague: 0,
        video_light: 10
      }
    },
    // 重置主题颜色
    resetFormColor() {

    },
    saveSettingLivingInfo() {
      let params = {
        pageStyle: '#FFFFFF',
        videoStyle: '#000000',
        theme_url: '',
        theme_vague: 0,
        theme_light: 10,
        chatLayout: 1,
        microphone: 1, //连麦布局
        video_url: '',
        video_vague: 0,
        video_light: 10
      }
      console.log(params)
    },
    goPreviewLiving(){
      this.$refs.livingPreview.dialogVisible = true
    },
    cropComplete(cropedData, option) {
      console.log(cropedData, option)
      if (option.index == 1) {
        if (this.livingPreview == 1) {
          this.livingPcForm.theme_url = option.src;
        } else {
          this.livingWapForm.theme_url = option.src;
        }
        this.themeImages = cropedData;
      } else {
        this.livingForm.video_url = option.src
        this.videoImages = cropedData;
      }
    },
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.livingForm.theme_url = '';
      });
    },
    resetVideoUrl() {
      this.$nextTick(()=> {
        this.livingForm.video_url = '';
      });
    },
    choseMicrophone(index) {
      this.livingForm.microphone = index;
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        this.$refs.livingCropper.showModel(res.data.domain_url, 1)
        // let domain_url = res.data.domain_url || ''
        // let file_url = res.data.file_url || '';
        // this.livingForm.theme_url = file_url;
        // this.domain_url = domain_url;
      }
    },
    handleUploadVideoSuccess(res, file) {
       console.log(res, file);
      if(res.data) {
        this.$refs.livingCropper.showModel(res.data.domain_url, 2)
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
    padding-top: 16px;
    display: flex;
    &_type{
      display: flex;
      flex-direction: column;
      width: 160px;
      padding: 64px 20px 0 20px;
      .type_item{
        padding-bottom: 24px;
        &_title{
          color: #262626;
        }
        &_check{
          margin-top: 12px;
          width: 120px;
          height: 68px;
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
      width: 944px;
      .preview_btn{
        text-align: center;
      }
      .preview_box{
        margin-top: 16px;
        width: 100%;
        // height: 100%;
        margin-right: 24px;
        background: #f0f0f0;
        .preview_type{
          display: flex;
          justify-content: flex-end;
          padding: 24px 32px 8px 0;
        }
        .preview_container{
          padding: 12px 32px;
        }
        &_pc{
          width: 880px;
        }
      }
    }
    &_form{
      width: 270px;
      padding: 0 20px;
      &_opera{
        padding-bottom: 40px;
        .vh-button+.vh-button{
          margin-left: 10px;
        }
      }
      .form_item{
        padding-bottom: 24px;
        .theme_colors{
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span{
            display: inline-block;
            width: 32px;
            height: 32px;
            border: 2px solid transparent;
            background: #595959;
            margin-right: 10px;
            border-radius: 4px;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
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
          align-items: center;
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
        &_video{
          justify-content: flex-start;
        }
      }
    }
    @media (max-width: 1366px) {
      .preview_box_pc{
        transform: scale(0.6);
        transform-origin: top left;
      }
      .living-setting_preview{
        width: 594px;
      }
    }
  }
</style>
