<template>
  <div class="living-setting">
    <div class="living-setting_type">
      <template v-if="livingPreview==1">
        <div class="type_item" v-for="(item, index) in themePcTypeList" :key="index">
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
            <pc-preview :type="livingPcPreviewType" :domainUrl="domain_pc_url" :livingForm="livingForm" :videoUrl="video_url"></pc-preview>
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
            <span v-for="(item, index) in pageThemeColors" :key="index" :class="livingPcForm.bgColor == index + 1 ? 'active' : ''" :style="{backgroundColor:item}" @click="changePcTheme(index)"></span>
          </div>
        </div>
        <div class="form_item">
          <p class="form_item_title">主题背景</p>
          <upload
            class="upload__living"
            id="living_pc_cropper"
            v-model="livingPcForm.background"
            :domain_url="livingPcForm.background"
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
          <vh-slider v-model="livingPcForm.blurryDegree" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingPcForm.blurryDegree}}</span>
        </div>
        <div class="form_item">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingPcForm.lightDegree" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingPcForm.lightDegree}}</span>
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
        <div class="form_item" v-if="livingWapForm.style==3">
          <p class="form_item_title">主题背景</p>
          <upload
            class="upload__living"
            id="living_wap_cropper"
            v-model="livingWapForm.background"
            :domain_url="livingWapForm.background"
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
        <div class="form_item" v-if="livingWapForm.style==3">
          <span class="vague_theme">模糊程度</span>
          <vh-slider v-model="livingWapForm.blurryDegree" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingWapForm.blurryDegree}}</span>
        </div>
        <div class="form_item" v-if="livingWapForm.style==3">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingWapForm.lightDegree" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingWapForm.lightDegree}}</span>
        </div>
      </template>
      <!-- 视频区域设置 -->
      <template v-if="livingPcPreviewType==1">
        <div class="form_item" v-if="livingPreview==1">
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
              <p :class="livingForm.inavLayout == 1 ? 'active' : ''"><img src="./image/main_1.png" alt=""></p>
              <span>均匀排列</span>
            </div>
            <div class="item_lay" @click="choseMicrophone(2)">
              <p :class="livingForm.inavLayout == 2 ? 'active' : ''"><img src="./image/main_2.png" alt=""></p>
              <span>主次平铺</span>
            </div>
            <div class="item_lay" @click="choseMicrophone(3)">
              <p :class="livingForm.inavLayout == 3 ? 'active' : ''"><img src="./image/main_3.png" alt=""></p>
              <span>主次悬浮</span>
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
          <color-set ref="videoColors" :isShowMain="false"  :themeKeys="videoColors" @color="changeVideoColor"  :colorDefault="livingForm.videoColor"></color-set>
        </div>
        <div class="form_item">
          <p class="form_item_title">视频区背景</p>
          <upload
            class="upload__living"
            id="living_video_cropper"
            v-model="livingForm.videoBackGround"
            :domain_url="livingForm.videoBackGround"
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
          <vh-slider v-model="livingForm.videoBlurryDegree" style="width: 131px" :max="10"></vh-slider>
          <span class="vague_num">{{livingForm.videoBlurryDegree}}</span>
        </div>
        <div class="form_item">
          <span class="vague_theme">背景亮度</span>
          <vh-slider v-model="livingForm.videoLightDegree" style="width: 131px" :max="20"></vh-slider>
          <span class="vague_num">{{livingForm.videoLightDegree}}</span>
        </div>
      </template>
    </div>
    <div class="living-setting_hidden" v-if="webinarId && livingConfig==2"></div>
    <cropper @cropComplete="cropComplete" ref="livingCropper" cropperDom="living_cropper" @deleteComplete="deleteComplete"></cropper>
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
  props: {
    livingConfig: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      themePcTypeList: [
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
        {
          title: '荣耀银',
          url: '',
          id: 5,
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
      pageThemeColors: ['#1A1A1A', '#F0F0F0', '#FB2626', '1E4EDC'],
      videoColors: ['000000', '262626', '595959', '8F8F8F', 'D9D9D9'],
      livingPreview: 1,
      livingPcPreviewType: 1,
      webinarId: this.$route.params.str,
      livingWapForm: {
        style: 1,
        bgColor: 1, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      },
      livingPcForm: {
        style: 1,
        bgColor: 1, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      },
      livingForm: {
        videoColor: '#000', //视频区底色
        chatLayout: 1,
        inavLayout: 1, //连麦布局
        inavDocumentLayout: 1, //连麦+演示布局
        videoBackGround: '',
        videoBlurryDegree: 0,
        videoLightDegree: 10,
        videoBackGroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
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
      if (!this.livingPcForm.background) return '';
      return `${this.livingPcForm.background}?x-oss-process=image/crop,x_${this.livingPcForm.backgroundSize.x.toFixed()},y_${this.livingPcForm.backgroundSize.y.toFixed()},w_${this.livingPcForm.backgroundSize.width.toFixed()},h_${this.livingPcForm.backgroundSize.height.toFixed()}${this.livingPcForm.blurryDegree > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingPcForm.blurryDegree * 2}` : ''},x-oss-process=image/bright,${(this.livingPcForm.lightDegree - 10) * 5} `;
    },
    // wap端主题背景
    domain_wap_url() {
      if (!this.livingWapForm.background) return '';
      return `${this.livingWapForm.background}?x-oss-process=image/crop,x_${this.livingWapForm.backgroundSize.x.toFixed()},y_${this.livingWapForm.backgroundSize.y.toFixed()},w_${this.livingWapForm.backgroundSize.width.toFixed()},h_${this.livingWapForm.backgroundSize.height.toFixed()}${this.livingWapForm.blurryDegree > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingWapForm.blurryDegree * 2}` : ''},x-oss-process=image/bright,${(this.livingWapForm.lightDegree - 10) * 5} `;
    },
    video_url() {
      if (!this.livingForm.videoBackGround) return '';
      return `${this.livingForm.videoBackGround}?x-oss-process=image/crop,x_${this.livingForm.videoBackGroundSize.x.toFixed()},y_${this.livingForm.videoBackGroundSize.y.toFixed()},w_${this.livingForm.videoBackGroundSize.width.toFixed()},h_${this.livingForm.videoBackGroundSize.height.toFixed()}${this.livingForm.videoBlurryDegree > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingForm.videoBlurryDegree * 2}` : ''},x-oss-process=image/bright,${(this.livingForm.videoLightDegree - 10) * 5} `;
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
    initLivingSettingInfo() {
      let params = {
        webinar_id: this.webinarId || undefined,
        type: this.webinarId ? 1 : 2
      }
      this.$fetch('getInterWebinarSkin', params).then(res=>{
        if (res.code === 200) {
          const { skin_json_pc, skin_json_wap } = res.data;
          this.livingPcForm.style = skin_json_pc.style;
          this.livingWapForm.style = skin_json_wap.style;
          this.livingPcForm = { ...skin_json_pc }; //pc信息
          this.livingWapForm = { ...skin_json_wap }; //wap信息
          this.livingForm = { ...skin_json_pc }; // 公共信息
        }
      }).catch(err => {
        this.$message.success(err.msg || '获取信息失败')
      })
    },
    activeTheme(item) {
      this.themePcTypeList.map(item => {
        return item.isActive = false
      })
      item.isActive = true;
      this.livingPcForm.style = item.id;
      this.resetFormPcColor(item.id);
    },
    activeWapTheme(item) {
      this.themeWapTypeList.map(item => {
        return item.isActive = false
      })
      item.isActive = true;
      this.livingWapForm.style = item.id;
      this.resetFormWapColor(item.id)
    },
    changePcTheme(index) {
      this.livingPcForm.bgColor = index + 1;
    },
    // 选择视频区底色
    changeVideoColor(color) {
      this.livingForm.videoColor = color;
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
        this.resetFormPcColor(1)
      } else {
        this.resetFormWapColor(1)
      }
    },
    // 默认pc主题颜色
    resetFormPcColor(index) {
      this.livingPcForm = {
        bgColor: 1, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      };
      let microphoneArr = [1, 2, 2, 3]
      this.livingForm = {
        videoColor: '#000', //视频区底色
        chatLayout: index==1 || index == 4 ? 1 : 2,
        inavLayout: microphoneArr[index-1], //连麦布局
        videoBackGround: '',
        videoBlurryDegree: 0,
        videoLightDegree: 10,
        videoBackGroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      }
    },
     // 默认wap主题颜色
    resetFormWapColor(index) {
      this.livingWapForm = {
        bgColor: index, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      };
      // let microphoneArr = [1, 2, 2, 3]
      this.livingForm = {
        videoColor: '#000', //视频区底色
        chatLayout: index==3 ? 2 : 1,
        inavLayout: 1, //连麦布局
        inavDocumentLayout: 1,
        videoBackGround: '',
        videoBlurryDegree: 0,
        videoLightDegree: 10,
        videoBackGroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      }
    },
    saveSettingLivingInfo() {
      let params = {
        webinar_id: this.webinarId || undefined,
        type: this.webinarId ? 1 : 2,
        skin_json_pc: Object.assign({}, this.livingPcForm, this.livingForm),
        skin_json_wap: Object.assign({}, this.livingWapForm, this.livingForm)
      }
      console.log(params, '???1232425')
      this.$fetch('skinUpdate', params).then(res=>{
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      }).catch(err => {
        this.$message.success(err.msg || '保存失败')
      })
    },
    goPreviewLiving(){
      this.$refs.livingPreview.dialogVisible = true
    },
    cropComplete(cropedData, option) {
      console.log(cropedData, option)
      if (option.index == 1) {
        if (this.livingPreview == 1) {
          this.livingPcForm.background = option.src;
          this.livingPcForm.backgroundSize = cropedData;
        } else {
          this.livingWapForm.background = option.src;
          this.livingWapForm.backgroundSize = cropedData;
        }
      } else {
        this.livingForm.videoBackGround = option.src
        this.livingForm.videoBackGroundSize = cropedData;
      }
    },
    deleteComplete(index) {
      let ele = ['living_pc_cropper', 'living_wap_cropper', 'living_video_cropper']
      let dom = document.querySelector(`#${ele[index - 1]} .el-upload__input`);
      dom.click();
    },
    // 主题背景删除
    resetLogoUrl() {
      if (this.livingPreview == 1) {
         this.livingPcForm.background = '';
      } else {
         this.livingWapForm.background = '';
      }
    },
    // 视频区域图片删除
    resetVideoUrl() {
      this.livingForm.videoBackGround = '';
    },
    choseMicrophone(index) {
      this.livingForm.inavLayout = index;
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let index = this.livingPreview == 1 ? 1 : 2;
        this.$refs.livingCropper.showModel(res.data.domain_url, index)
      }
    },
    handleUploadVideoSuccess(res, file) {
       console.log(res, file);
      if(res.data) {
        this.$refs.livingCropper.showModel(res.data.domain_url, 3)
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
    position: relative;
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
      width: 594px;
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
            // border: 4px solid transparent;
            background: #595959;
            margin-right: 10px;
            border-radius: 4px;
            cursor: pointer;
            &.active{
              width: 40px;
              height: 40px;
            }
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
    &_hidden{
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background: rgba(255, 255, 255, 0.5);
    }
    @media (max-width: 1920px) {
      .preview_box_pc{
        transform: scale(0.6);
        transform-origin: top left;
      }
    }
    @media (min-width: 1920px) {
      .preview_box_pc{
        transform: scale(1);
      }
      .living-setting_preview{
        // width: 594px;
         width: 944px;
      }
    }
  }
</style>
