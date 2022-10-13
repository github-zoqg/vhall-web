<template>
  <div class="living-setting">
    <div class="living-setting_type">
      <template v-if="livingPreview==1">
        <!-- PC切换左侧风格 -->
        <div class="type_item" @click="activeTheme(1)">
          <span class="type_item_title">传统风格</span>
          <p class="type_item_check" :class="livingPcForm.style==1 ? 'active' : ''">
            <img src="./image/pc/style_1.png" class="item_check_style" alt="">
            <span class="checked_img" v-if="livingPcForm.style==1"><img src="../../../common/images/icon-choose.png"  alt=""></span>
          </p>
        </div>
        <div class="type_item" @click="activeTheme(2)">
          <span class="type_item_title">简洁风格</span>
          <p class="type_item_check" :class="livingPcForm.style==2 ? 'active' : ''">
            <img src="./image/pc/style_2.png" class="item_check_style" alt="">
            <span class="checked_img" v-if="livingPcForm.style==2"><img src="../../../common/images/icon-choose.png"  alt=""></span>
          </p>
        </div>
        <div class="type_item" @click="activeTheme(3)">
          <span class="type_item_title">时尚风格</span>
          <p class="type_item_check" :class="livingPcForm.style==3 ? 'active' : ''">
            <img src="./image/pc/style_3.png" class="item_check_style" alt="">
            <span class="checked_img" v-if="livingPcForm.style==3"><img src="../../../common/images/icon-choose.png"  alt=""></span>
          </p>
        </div>
      </template>
      <template v-else>
        <!-- WAP切换左侧风格 -->
        <div class="type_item" :class="webinarIsDirector == 1 && item.id == 3 ? 'checked-not-allow' : ''" v-for="(item, index) in themeWapTypeList" :key="index">
          <span class="type_item_title title_center">{{ item.title }}</span>
          <p class="type_item_check item_checked" :class="livingWapForm.style==item.id ? 'active' : ''" @click="activeWapTheme(item)">
            <img :src="require(`./image/wap/style_${index+1}.png`)" class="item_check_style" alt="">
            <span class="checked_img" v-if="livingWapForm.style==item.id"><img src="../../../common/images/icon-choose.png" alt=""></span>
          </p>
          <div class="not-allow" v-if="webinarIsDirector && item.id == 3"></div>
        </div>
      </template>
    </div>
    <!-- 预览区域 -->
    <div class="living-setting_preview">
      <div class="preview_btn">
        <vh-radio-group v-model="livingPreview" size="small" @change="choseLivingPreview">
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
          <div class="preview_box_pc" v-show="livingPreview==1">
            <!-- <transition name="fade" mode="out-in"> -->
              <pc-preview ref="livingPcPreview" :type="livingPcPreviewType" :domainUrl="domain_pc_url" :livingPcForm="livingPcForm" :livingForm="livingForm" :videoUrl="video_url" :isShowInteract="isShowInteract"></pc-preview>
            <!-- </transition> -->
          </div>
          <div class="preview_box_wap" v-show="livingPreview==2">
            <wap-preview ref="livingWapPreview" :type="livingPcPreviewType" :domainUrl="domain_wap_url" :livingWapForm="livingWapForm" :livingForm="livingForm" :videoUrl="video_url" :isShowInteract="isShowInteract"></wap-preview>
            <span v-show="livingWapForm.style==3 && livingPcPreviewType == 1" class="preview_box_wap_tip">注意：用电脑客户端和app发起非无延迟视频直播，
简洁风格无法展示文档，建议使用电脑网页端发起。</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 表单区域 -->
    <div class="living-setting_form">
      <div class="living-setting_form_opera">
        <vh-button size="small" plain round v-preventReClick @click="resetForm">恢复默认</vh-button>
        <vh-button size="small" plain  round v-preventReClick @click="goPreviewLiving" v-if="webinarId">预览</vh-button>
        <vh-button type="primary" size="small" round v-preventReClick @click="saveSettingLivingInfo">保存</vh-button>
      </div>
      <!-- pc主题设置 -->
      <template v-if="livingPreview==1">
        <div class="form_item">
          <p class="form_item_title">主题色</p>
          <div class="theme_colors">
            <span v-for="(item, index) in pcThemeColors" :key="index" :class="livingPcForm.backGroundColor == index + 1 ? 'active' : ''" @click="changePcTheme(index)">
              <img :src="require(`./image/pc/theme_${index+1}.png`)" alt="">
            </span>
          </div>
        </div>
        <template v-if="livingPcPreviewType == 1">
          <div class="form_item">
            <p class="form_item_title">主题背景</p>
            <upload
              class="upload__living"
              id="living_pc_cropper"
              v-model="livingPcForm.background"
              :domain_url="livingPcForm.background"
              :on-success="handlePcUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :heightImg="128"
              :widthImg="228"
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
            <vh-slider v-model="livingPcForm.blurryDegree" :disabled="!livingPcForm.background" style="width: 131px" :max="10"></vh-slider>
            <span class="vague_num">{{livingPcForm.blurryDegree}}</span>
          </div>
          <div class="form_item">
            <span class="vague_theme">背景亮度</span>
            <vh-slider v-model="livingPcForm.lightDegree" :disabled="!livingPcForm.background" style="width: 131px" :max="20"></vh-slider>
            <span class="vague_num">{{livingPcForm.lightDegree}}</span>
          </div>
        </template>
      </template>
      <!-- wap主题设置 -->
      <template v-if="livingPreview==2">
        <div class="form_item">
          <p class="form_item_title">主题色</p>
          <div class="theme_colors">
            <span v-for="(item, index) in pcThemeColors" :key="index" :class="livingWapForm.backGroundColor == index + 1 ? 'active' : ''"  @click="changeWapTheme(index)">
              <img :src="require(`./image/wap/theme_${livingWapForm.style}/theme_${index+1}.png`)" alt="">
            </span>
          </div>
        </div>
        <template v-if="livingPcPreviewType == 1">
          <div class="form_item form_item_wap_bg" v-if="livingWapForm.style==3">
            <p class="form_item_title">主题背景</p>
            <upload
              class="upload__living"
              id="living_wap_cropper"
              v-model="livingWapForm.background"
              :domain_url="livingWapForm.background"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :heightImg="330"
              :widthImg="151"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>建议尺寸：750*1642px</p>
                <p>支持jpg、gif、png、bmp，小于4M</p>
              </div>
            </upload>
          </div>
          <div class="form_item" v-if="livingWapForm.style==3">
            <span class="vague_theme">模糊程度</span>
            <vh-slider v-model="livingWapForm.blurryDegree" :disabled="!livingWapForm.background" style="width: 131px" :max="10"></vh-slider>
            <span class="vague_num">{{livingWapForm.blurryDegree}}</span>
          </div>
          <div class="form_item" v-if="livingWapForm.style==3">
            <span class="vague_theme">背景亮度</span>
            <vh-slider v-model="livingWapForm.lightDegree" :disabled="!livingWapForm.background" style="width: 131px" :max="20"></vh-slider>
            <span class="vague_num">{{livingWapForm.lightDegree}}</span>
          </div>
        </template>
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
        <template v-if="isShowVideoBackground || isShowInteract">
          <div class="form_item_br">
            以下设置对PC端和移动端同时生效～
          </div>
          <div class="form_item more__layout" v-if="isShowInteract">
            <div class="form_item_title">
              视频区【连麦】布局
              <p class="title_tip">
                注意：无延迟模式下，暂只支持主次平铺；直播中修改连麦布局，需要刷新发起端才能生效。
              </p>
              <!-- <el-tooltip v-tooltipMove>
                <div slot="content">
                  <p>1.无延迟模式下，只支持主次平铺；</p>
                  <p>2.直播中修改布局，需要主持人刷新页面<br/>或重启客户端后生效</p>
                </div>
                <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999;"></i>
              </el-tooltip> -->
            </div>
            <div class="form_item_lay more__layout">
              <div class="item_lay" @click="choseMicrophone(0)">
                <div class="item_lay_hidden" v-if="isDelay"></div>
                <p :class="livingForm.inavLayout == 'CANVAS_ADAPTIVE_LAYOUT_GRID_MODE' ? 'active' : ''"><img src="./image/main_3.png" alt=""></p>
                <span>均匀排列</span>
              </div>
              <div class="item_lay" @click="choseMicrophone(1)">
                <p :class="livingForm.inavLayout == 'CANVAS_ADAPTIVE_LAYOUT_TILED_MODE' ? 'active' : ''"><img src="./image/main_2.png" alt=""></p>
                <span>主次平铺</span>
              </div>
              <div class="item_lay" @click="choseMicrophone(2)">
                <div class="item_lay_hidden" v-if="isDelay"></div>
                <p :class="livingForm.inavLayout == 'CANVAS_ADAPTIVE_LAYOUT_FLOAT_MODE' ? 'active' : ''"><img src="./image/main_1.png" alt=""></p>
                <span>主次浮窗</span>
              </div>
              <div class="item_lay" @click="choseMicrophone(3)">
                <div class="item_lay_hidden" v-if="isDelay"></div>
                <p :class="livingForm.inavLayout == 'CANVAS_ADAPTIVE_LAYOUT_TILED_EXT1_MODE' ? 'active' : ''"><img src="./image/main_4.png" alt=""></p>
                <span>顶部成员</span>
              </div>
            </div>
          </div>
          <div class="form_item inv_demo__layout" v-if="isShowInteract">
            <div class="form_item_title">
              视频区【连麦+演示】布局<vh-tooltip effect="dark" content="移动端模版选择了简洁风格会导致pc端分离模式不可用" :visible-arrow="false" placement="bottom-end">
                <i class="iconfont-v3 saasicon_help_m dialog__title__icon"></i>
              </vh-tooltip>
              <p class="title_tip">
                注意：非无延迟视频直播且选择了【合并模式】布局，无法用电脑客户端和app发起。
              </p>
            </div>
            <div class="form_item_lay inv_demo__layout">
              <div class="item_lay" @click="choseInteractDemoLayout(0)">
                <div class="item_lay_hidden" v-if="livingWapForm && livingWapForm.style == 3"></div>
                <p :class="livingForm.speakerAndShowLayout != 1 ? 'active' : ''"><img src="./image/inav_main_0.png" alt=""></p>
                <span>分离模式</span>
              </div>
              <div class="item_lay" @click="choseInteractDemoLayout(1)">
                <div class="item_lay_hidden" v-if="webinarIsDirector == 1"></div>
                <p :class="livingForm.speakerAndShowLayout == 1 ? 'active' : ''"><img src="./image/inav_main_1.png" alt=""></p>
                <span>合并模式</span>
              </div>
            </div>
          </div>
          <!-- <div class="form_item" v-if="livingPreview == 2">
            <p class="form_item_title">视频区【连麦 + 演示】布局</p>
            <div class="form_item_lay form_item_video">
              <div class="item_lay">
                <p class="active"><img src="./image/main_1.png" alt=""></p>
                <span>上下模式</span>
              </div>
            </div>
          </div> -->
          <template v-if="isShowVideoBackground">
            <div class="form_item">
              <p class="form_item_title">视频区底色</p>
              <color-set ref="videoColors" :isShowMain="false"  :themeKeys="videoColors" @color="changeVideoColor"  :colorDefault="livingForm.videoBackGroundColor"></color-set>
            </div>
            <div class="form_item">
              <div class="form_item_title">
                视频区背景
                <p class="title_tip">注意：1.请勿手动修改图片后缀，否则有可能导致背景图不生效；2.视频区背景图在无延迟模式下或上麦时不生效</p>
                <!-- <span class="mr">视频区背景</span>
                <el-tooltip placement="right" v-tooltipMove>
                  <div slot="content">
                    <p>1.请勿手动修改图片后缀，否则有可能导致背景<br>&nbsp;&nbsp;&nbsp;图不生效</p>
                    <p>2.视频区背景图在无延迟模式下或上麦时不生效</p>
                  </div>
                  <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999;"></i>
                </el-tooltip> -->
              </div>
              <upload
                class="upload__living"
                id="living_video_cropper"
                v-model="livingForm.videoBackGround"
                :domain_url="livingForm.videoBackGround"
                :on-success="handleUploadVideoSuccess"
                :on-progress="uploadProcess"
                :on-error="uploadError"
                :on-preview="uploadPreview"
                :heightImg="128"
                :widthImg="228"
                :before-upload="file => this.beforeUploadHandler(file, true)"
                @delete="resetVideoUrl">
                <div slot="tip">
                  <p>建议尺寸：1300*730px，小于4M</p>
                  <p>支持jpg、png</p>
                </div>
              </upload>
            </div>
            <div class="form_item">
              <span class="vague_theme">模糊程度</span>
              <vh-slider v-model="livingForm.videoBlurryDegree" :disabled="!livingForm.videoBackGround" style="width: 131px" :max="10"></vh-slider>
              <span class="vague_num">{{livingForm.videoBlurryDegree}}</span>
            </div>
            <div class="form_item">
              <span class="vague_theme">背景亮度</span>
              <vh-slider v-model="livingForm.videoLightDegree" :disabled="!livingForm.videoBackGround" style="width: 131px" :max="20"></vh-slider>
              <span class="vague_num">{{livingForm.videoLightDegree}}</span>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="living-setting_hidden" v-if="webinarId && livingConfig==2"></div>
    <cropper @cropComplete="cropComplete" ref="livingCropper" :ratio="ratio" cropperDom="living_cropper" @deleteComplete="deleteComplete"></cropper>
    <cropper2 @cropComplete="cropComplete2" ref="livingCropper2" :ratio="ratio" @resetUpload="deleteComplete"></cropper2>
    <living-preview ref="livingPreview"></living-preview>
  </div>
</template>
<script>
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';
import cropper from './Cropper/index.vue';
import cropper2 from '@/components/Cropper/index'
import { sessionOrLocal } from "@/utils/utils";
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
      themeWapTypeList: [
        {
          title: '传统风格',
          id: 1
        },
        {
          title: '时尚风格',
          id: 2
        },
        {
          title: '简洁风格',
          id: 3
        }
      ],
      skinId: '',
      isDelay: this.$route.query.isDelay == 1 ? true : false,
      webinarType: sessionOrLocal.get("webinarType"), // 1.音频  2.视频 3.互动  5.定时直播	6.分组直播
      webinarState: sessionOrLocal.get('webinarState'), // 2.预告 1.直播 3.结束 5.回放 4.点播
      webinarIsDirector: sessionOrLocal.get(`webinar_is_director__${this.$route.params.str}`) || 0,
      defaultImage: 'https://cnstatic01.e.vhall.com/common-static/images/livingSetting.png',
      pcThemeColors: 5,
      videoColors: ['000000', '262626', '595959', '8C8C8C', 'F5F5F5'],
      livingPreview: 1,
      livingPcPreviewType: 1,
      ratio: 16/9,
      webinarId: this.$route.params.str,
      livingWapForm: {
        style: 1,
        backGroundColor: 2, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0,
          imageCropMode: 2
        }
      },
      livingPcForm: {
        style: 1,
        backGroundColor: 1, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0,
          imageCropMode: 2
        }
      },
      livingForm: {
        videoBackGroundColor: '#000000', //视频区底色
        chatLayout: 1,
        inavLayout: 'CANVAS_ADAPTIVE_LAYOUT_GRID_MODE', //连麦布局
        inavDocumentLayout: 1, //连麦+演示布局
        speakerAndShowLayout: 0, // 视频区【连麦+演示】布局
        finalVideoBackground: '',
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
    cropper2,
    Upload,
    livingPreview
  },
  computed: {
    // pc端主题背景
    domain_pc_url() {
      if (!this.livingPcForm.background) return '';
      return `${this.livingPcForm.background}?x-oss-process=image/crop,x_${this.livingPcForm.backgroundSize.x.toFixed()},y_${this.livingPcForm.backgroundSize.y.toFixed()},w_${this.livingPcForm.backgroundSize.width.toFixed()},h_${this.livingPcForm.backgroundSize.height.toFixed()}${this.livingPcForm.blurryDegree > 0 ? `,x-oss-process=image/blur,r_20,s_${this.livingPcForm.blurryDegree * 4}` : ''},x-oss-process=image/bright,${(this.livingPcForm.lightDegree - 10) * 5} `;
    },
    // wap端主题背景
    domain_wap_url() {
      if (!this.livingWapForm.background) return '';
      return `${this.livingWapForm.background}?x-oss-process=image/crop,x_${this.livingWapForm.backgroundSize.x.toFixed()},y_${this.livingWapForm.backgroundSize.y.toFixed()},w_${this.livingWapForm.backgroundSize.width.toFixed()},h_${this.livingWapForm.backgroundSize.height.toFixed()}${this.livingWapForm.blurryDegree > 0 ? `,x-oss-process=image/blur,r_20,s_${this.livingWapForm.blurryDegree * 4}` : ''},x-oss-process=image/bright,${(this.livingWapForm.lightDegree - 10) * 5} `;
    },
     // 是否显示互动
    isShowInteract() {
      if (this.webinarId) {
        // 活动下 视频、互动、分组模式显示
        return [3,6].includes(Number(this.webinarType)) || (this.webinarType == 2 && this.webinarState != 4);
      } else {
        // 账号下默认不显示
        return false;
      }
    },
    isShowVideoBackground() {
      if (this.webinarId) {
        // 活动下互动和分组模式显示
        return [3,6].includes(Number(this.webinarType)) || (this.webinarType == 2 && this.webinarState != 4);
      } else {
        // 账号下默认显示
        return true;
      }
    },
    video_url() {
      if (!this.livingForm.videoBackGround) return '';
      return `${this.livingForm.videoBackGround}?x-oss-process=image/crop,x_${this.livingForm.videoBackGroundSize.x.toFixed()},y_${this.livingForm.videoBackGroundSize.y.toFixed()},w_${this.livingForm.videoBackGroundSize.width.toFixed()},h_${this.livingForm.videoBackGroundSize.height.toFixed()}${this.livingForm.videoBlurryDegree > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingForm.videoBlurryDegree * 2}` : ''},x-oss-process=image/bright,${(this.livingForm.videoLightDegree - 10) * 5}`;
    }
  },
  methods: {
    initComp(){
      // this.$refs.livingWapPreview.settingTheme(1, 2);
      // this.$refs.livingPcPreview.settingTheme(1, 1);
      this.initLivingSettingInfo()
      console.log('我是初始化接口')
    },
    initLivingSettingInfo() {
      let params = {
        webinar_id: this.webinarId || '',
        type: this.webinarId ? 1 : 2
      }
      this.$fetch('getInterWebinarSkin', this.$params(params)).then(res=>{
        if (res.code == 200) {
          this.skinId = res.data.skin_id;
          const skin_json_pc = JSON.parse(res.data.skin_json_pc);
          const skin_json_wap = JSON.parse(res.data.skin_json_wap);
          console.log(skin_json_pc, skin_json_wap, '???wsjo')
          // this.livingPcForm.style = skin_json_pc.style;
          // this.livingWapForm.style = skin_json_wap.style;
          this.$refs.livingPcPreview.settingTheme(skin_json_pc.style, skin_json_pc.backGroundColor)
          this.$refs.livingWapPreview.settingTheme(skin_json_wap.style, skin_json_wap.backGroundColor, 1)
          this.livingPcForm = { ...skin_json_pc }; //pc信息
          this.livingWapForm = { ...skin_json_wap }; //wap信息

          this.livingPcForm.lightDegree = skin_json_pc.lightDegree && +skin_json_pc.lightDegree
          this.livingPcForm.blurryDegree = skin_json_pc.blurryDegree && +skin_json_pc.blurryDegree

          this.livingWapForm.lightDegree = skin_json_wap.lightDegree && +skin_json_pc.lightDegree
          this.livingWapForm.blurryDegree = skin_json_wap.blurryDegree && +skin_json_pc.blurryDegree

          this.livingForm.chatLayout = skin_json_pc.chatLayout; // 公共信息 聊天布局
          this.livingForm.inavLayout = this.isDelay ? 'CANVAS_ADAPTIVE_LAYOUT_TILED_MODE' : skin_json_pc.inavLayout; // 公共信息 连麦布局
          this.livingForm.speakerAndShowLayout = skin_json_wap.style == 3 ? 1 : skin_json_pc.speakerAndShowLayout; // 公共信息 视频区【连麦+演示】布局 (手机端简洁模式下，只能选择 合并模式)
          this.livingForm.videoBackGround = skin_json_pc.videoBackGround; // 公共信息  视频区背景 图片地址
          this.livingForm.videoBackGroundColor = skin_json_pc.videoBackGroundColor == '#333338' ? '#000000' : skin_json_pc.videoBackGroundColor; // 公共信息  视频区背景 颜色
          this.livingForm.videoBackGroundSize = skin_json_pc.videoBackGroundSize; // 公共信息 视频区背景 裁剪信息
          this.livingForm.videoBlurryDegree = skin_json_pc.videoBlurryDegree && +skin_json_pc.videoBlurryDegree; // 公共信息 视频区背景 模糊度
          this.livingForm.videoLightDegree = skin_json_pc.videoLightDegree && +skin_json_pc.videoLightDegree ; // 公共信息 视频区背景 亮度

          // 备份信息
          this.setBackupData(skin_json_pc, skin_json_wap);
        }
      }).catch(err => {
        this.$message.error(err.msg || '获取信息失败')
      })
    },
    // 切换预览效果
    choseLivingPreview() {},
    // PC端切换风格
    activeTheme(index) {
      this.livingPcForm.style = index;
      if (index == this._livingPcForm.style) {
        this.livingPcForm = {...this._livingPcForm};
        this.livingForm.chatLayout = this._livingForm.chatLayout, // 公共信息 聊天布局
        this.livingForm.inavLayout = this._livingForm.inavLayout, // 公共信息 连麦布局
        this.livingForm.speakerAndShowLayout = this.livingWapForm.style == 3 ? 1 : this._livingForm.speakerAndShowLayout, // 公共信息 视频区【连麦+演示】布局 (手机端简洁模式下，只能选择 合并模式)
        this.livingForm.videoBackGround = this._livingForm.videoBackGround, // 公共信息  视频区背景 图片地址
        this.livingForm.videoBackGroundColor = this._livingForm.videoBackGroundColor, // 公共信息  视频区背景 颜色
        this.livingForm.videoBackGroundSize = this._livingForm.videoBackGroundSize, // 公共信息 视频区背景 裁剪信息
        this.livingForm.videoBlurryDegree = this._livingForm.videoBlurryDegree, // 公共信息 视频区背景 模糊度
        this.livingForm.videoLightDegree = this._livingForm.videoLightDegree, // 公共信息 视频区背景 亮度
        this.$refs.livingPcPreview.settingTheme(index, this.livingPcForm.backGroundColor);
      } else {
        this.resetFormPcColor(index, 0);
      }
    },
    // 手机端切换风格
    activeWapTheme(item) {
      if (this.webinarIsDirector == 1 && item.id == 3) {
        // 当前活动标记为云导播类型，且选择为极简模式时，不可点击
        return;
      }
      this.livingWapForm.style = item.id;
      // 如果接口返回的是当前选中值，默认用备份
      if (item.id == this._livingWapForm?.style) {
        this.livingWapForm = { ...this._livingWapForm};
        this.livingForm.chatLayout = item.id  == 3 ? 2 : 1;
        this.livingForm.inavLayout = this._livingForm.inavLayout;
        // 移动端选择简洁模式，连麦+演示 布局，只能是合并模式
        let speakerAndShowLayout = 0
        if (this.webinarIsDirector == 1) {
          // 当前活动标记为云导播类型，只能是分离模式
          speakerAndShowLayout = 0
        } else if (this.livingWapForm.style == 3) {
          speakerAndShowLayout = 1
        } else {
          speakerAndShowLayout = this._livingForm.speakerAndShowLayout
        }
        this.livingForm.speakerAndShowLayout = speakerAndShowLayout;
        this.livingForm.videoBackGround = this._livingForm.videoBackGround, // 公共信息  视频区背景 图片地址
        this.livingForm.videoBackGroundColor = this._livingForm.videoBackGroundColor, // 公共信息  视频区背景 颜色
        this.livingForm.videoBackGroundSize = this._livingForm.videoBackGroundSize, // 公共信息 视频区背景 裁剪信息
        this.livingForm.videoBlurryDegree = this._livingForm.videoBlurryDegree, // 公共信息 视频区背景 模糊度
        this.livingForm.videoLightDegree = this._livingForm.videoLightDegree, // 公共信息 视频区背景 亮度

        this.$refs.livingWapPreview.settingTheme(item.id, this.livingWapForm.backGroundColor, this.livingPcPreviewType);
      } else {
        this.resetFormWapColor(item.id, 0)
      }
    },
    changePcTheme(index) {
      this.livingPcForm.backGroundColor = index + 1;
      this.$refs.livingPcPreview.settingTheme(this.livingPcForm.style, index+1);
    },
    changeWapTheme(index) {
      this.livingWapForm.backGroundColor = index + 1;
      this.$refs.livingWapPreview.settingTheme(this.livingWapForm.style, index+1, this.livingPcPreviewType);
    },
    // 选择视频区底色
    changeVideoColor(color) {
      this.livingForm.videoBackGroundColor = color;
    },
    // 恢复默认（pc默认黑色，wap默认白色）
    resetForm() {
      if (this.livingPreview == 1) {
        let isPcIndex = this.livingPcForm.style == this._livingPcForm.style ? 1 : 0;
        this.resetFormPcColor(this.livingPcForm.style, isPcIndex)
      } else {
        let isWapIndex = this.livingWapForm.style == this._livingWapForm.style ? 1 : 0;
        this.resetFormWapColor(this.livingWapForm.style, isWapIndex)
      }
    },
    // 备份信息
    setBackupData(skin_json_pc, skin_json_wap) {
      // 备份信息
      this._livingPcForm = { ...skin_json_pc }; //pc信息
      this._livingWapForm = { ...skin_json_wap }; //wap信息
      let speakerAndShowLayout = skin_json_pc.speakerAndShowLayout = 0
      if (this.webinarIsDirector == 1) {
        // 当前活动标记为云导播类型，只能是分离模式
        speakerAndShowLayout = 0
      } else if (skin_json_wap.style == 3) {
        // 极简模式下，只能是合并模式
        speakerAndShowLayout = 1
      } else {
        speakerAndShowLayout = skin_json_pc.speakerAndShowLayout
      }
      this._livingForm = {
        chatLayout: skin_json_pc.chatLayout, // 公共信息 聊天布局
        inavLayout: this.livingForm.inavLayout, // 公共信息 连麦布局
        speakerAndShowLayout: speakerAndShowLayout, // 公共信息 视频区【连麦+演示】布局
        videoBackGround: skin_json_pc.videoBackGround, // 公共信息  视频区背景 图片地址
        videoBackGroundColor: skin_json_pc.videoBackGroundColor, // 公共信息  视频区背景 颜色
        videoBackGroundSize: skin_json_pc.videoBackGroundSize, // 公共信息 视频区背景 裁剪信息
        videoBlurryDegree: skin_json_pc.videoBlurryDegree, // 公共信息 视频区背景 模糊度
        videoLightDegree: skin_json_pc.videoLightDegree, // 公共信息 视频区背景 亮度
      }
    },
    // 共用表单颜色
    commonColor(style, type) {
      let layout = '', speakerAndShowLayout = 0;
      if (this.isDelay) {
        // 不论什么风格，无延迟都是默认
        layout = 'CANVAS_ADAPTIVE_LAYOUT_TILED_MODE';
      } else if (style == 1){
        // 传统风格
        layout = 'CANVAS_ADAPTIVE_LAYOUT_TILED_MODE';
      } else if ((style == 2 && type == 'pc') || (style == 3 && type == 'wap')) {
        // 极简风格
        layout = 'CANVAS_ADAPTIVE_LAYOUT_TILED_EXT1_MODE'
        speakerAndShowLayout = 1
      } else {
        // 时尚风格
        layout = 'CANVAS_ADAPTIVE_LAYOUT_GRID_MODE'
      }
      if (this.livingWapForm.style == 3) {
        // 如果手机端已经选择为极简模式了，PC端只能选择合并模式
        speakerAndShowLayout = 1
      }
      // 如果活动标记为云导播模式，连麦演示只能是分离模式
      if (this.webinarIsDirector == 1) {
        speakerAndShowLayout = 0
      }
      this.livingForm = {
        videoBackGroundColor: '#000000', //视频区底色
        chatLayout: style == 1 ? 1 : 2,
        inavLayout: layout, //连麦布局
        speakerAndShowLayout: speakerAndShowLayout, // 视频区【连麦+演示】布局 (手机端简洁模式下，只能选择 合并模式) — 默认设置
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
    // 默认pc主题颜色
    resetFormPcColor(style, index) {
      // style: 风格
      this.livingPcForm = {
        style: style,
        backGroundColor: style == 1 ? 1 : 2, //主题色
        background: style == 3 ? this.defaultImage : '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0,
          imageCropMode: 2
        }
      };
      this.commonColor(style, 'pc');
      this.$refs.livingPcPreview.settingTheme(style, this.livingPcForm.backGroundColor);
      // 如果当前备份需要恢复默认值，需要重置备份数据
      if (index == 1) {
        this.setBackupData(this.livingPcForm, this.livingWapForm)
      }
    },
     // 默认wap主题颜色
    resetFormWapColor(style, index) {
      this.livingWapForm = {
        style: style,
        backGroundColor: style == 1 ? 2 : 5, //主题色
        background: '',
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0,
          imageCropMode: 2
        }
      };
      this.commonColor(style, 'wap');
      this.$refs.livingWapPreview.settingTheme(style, this.livingWapForm.backGroundColor, this.livingPcPreviewType);
      if (index == 1) {
        this.setBackupData(this.livingPcForm, this.livingWapForm)
      }
    },
    saveSettingLivingInfo() {
      if (this.livingPcForm.background) {
        this.livingPcForm.pcBackground = this.domain_pc_url;
      }
      if (this.livingWapForm.background) {
        this.livingWapForm.wapBackground = this.domain_wap_url;
      }
      this.livingForm.finalVideoBackground = this.video_url;
      let skin_json_pc = Object.assign({}, this.livingPcForm, this.livingForm);
      let skin_json_wap = Object.assign({}, this.livingWapForm, this.livingForm);
      console.log(skin_json_pc, skin_json_wap, '??????????我是直播间设置参数')
      let params = {
        skin_id: this.skinId,
        type: this.webinarId ? 1 : 2,
        skin_json_pc: JSON.stringify(skin_json_pc),
        skin_json_wap: JSON.stringify(skin_json_wap)
      }
      if (this.webinarId) {
        params.webinar_id = this.webinarId;
      }
      console.log(params, '保存参数')
      this.$fetch('skinUpdate', params).then(res=>{
        if (res.code === 200) {
          this.$message.success('保存成功')
          // 备份信息
          this.setBackupData(skin_json_pc, skin_json_wap);
        }
      }).catch(err => {
        this.$message.error(err.msg || '保存失败')
      })
    },
    goPreviewLiving(){
      this.$refs.livingPreview.dialogVisible = true
    },
    toFloorEven(num) {
      const floorNum = Math.floor(num)
      return floorNum % 2 == 1 ? floorNum + 1 : floorNum
    },
    cropComplete(cropedData, url, index) {
      console.log(cropedData, url, index)
      this.livingForm.videoBackGround = url;
      this.livingForm.videoBackGroundSize = {
        ...cropedData,
        width: this.toFloorEven(cropedData.width),
        height: this.toFloorEven(cropedData.height)
      };
    },
    cropComplete2(cropedData, url, mode, index) {
      console.log(cropedData, url, mode, index)
      if (index == 1) {
        this.livingPcForm.background = url;
        this.livingPcForm.backgroundSize = {
          ...cropedData,
          imageCropMode: mode
        };
      } else if (index == 2) {
        this.livingWapForm.background = url;
        this.livingWapForm.backgroundSize = {
          ...cropedData,
          imageCropMode: mode
        };
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
        this.livingPcForm.pcBackground = '';
        this.livingPcForm.blurryDegree = 0;
        this.livingPcForm.lightDegree = 10;
      } else {
        this.livingWapForm.background = '';
        this.livingWapForm.wapBackground = '';
        this.livingWapForm.blurryDegree = 0;
        this.livingWapForm.lightDegree = 10;
      }
    },
    // 视频区域图片删除
    resetVideoUrl() {
      this.livingForm.videoBackGround = '';
      this.livingForm.finalVideoBackground = '';
      this.livingForm.videoBlurryDegree = 0;
      this.livingForm.videoLightDegree = 10;
    },
    choseMicrophone(index) {
      if (this.isDelay) return;
      let arrLayout = ['CANVAS_ADAPTIVE_LAYOUT_GRID_MODE', 'CANVAS_ADAPTIVE_LAYOUT_TILED_MODE', 'CANVAS_ADAPTIVE_LAYOUT_FLOAT_MODE', 'CANVAS_ADAPTIVE_LAYOUT_TILED_EXT1_MODE']
      this.livingForm.inavLayout = arrLayout[index];
    },
    // 视频区【连麦+演示】布局
    choseInteractDemoLayout(val) {
      // 如果活动标记为云导播模式，不可切换为合并模式
      if (this.webinarIsDirector == 1 && val == 1) return;
      // 如果是手机端简洁模式，点击分离模式时，不可切换。
      if (val < 1 && this.livingWapForm.style == 3) return;
      this.livingForm.speakerAndShowLayout = val;
    },
    handlePcUploadSuccess(res, file) {
      if(res.data) {
        this.ratio = 16/9;
        this.$refs.livingCropper2.showModel(res.data.domain_url, 1)
      }
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        this.ratio = 9/19.48;
        this.$refs.livingCropper2.showModel(res.data.domain_url, 2)
      }
    },
    handleUploadVideoSuccess(res, file) {
       console.log(res, file);
      if(res.data) {
        this.ratio = 16/9;
        this.$refs.livingCropper.showModel(res.data.domain_url, 3)
      }
    },
    getImgProfile(file) {
      return new Promise((resolve, reject) => {
        const url = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          resolve({
            width: img.width,
            height: img.height
          })
        }
        img.src = url.createObjectURL(file)
      })
    },
    // isVideo 为 true 表示视频背景图上传的回调
    beforeUploadHandler(file, isVideo){
      console.log(file);
      const typeList = !isVideo ? ['png', 'jpeg', 'gif', 'bmp'] : ['png', 'jpeg'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      let isLt4K = true
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
      if (isVideo) {
        return new Promise((resolve, reject) => {
          this.getImgProfile(file).then(res => {
            const { width, height } = res
            isLt4K = width <= 3840 && height <= 3840
            if (!isLt4K) {
              this.$message({
                message: `图片分辨率最高支持4k，请更换图片!`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              reject(false)
            }
            resolve(true)
          })
        })
      }
      return isType && isLt2M && isLt4K;
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
    /deep/.vh-tooltip.saasicon_help_m {
      color: #8c8c8c;
      &:hover {
        color: #595959;
      }
    }
    .saasicon_help_m {
      margin-left: 8px;
    }
    &_type{
      display: flex;
      flex-direction: column;
      width: 160px;
      padding: 64px 20px 0 20px;
      .type_item{
        padding-bottom: 24px;
        &_title{
          display: inline-block;
          width: 100%;
          color: #262626;
          &.title_center{
            padding-left: 20px;
          }
        }
        &_check{
          margin-top: 12px;
          width: 120px;
          height: 68px;
          border-radius: 4px;
          border: 1px solid transparent;
          cursor: pointer;
          position: relative;
          .item_check_style{
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
          &.item_checked{
            height: 173px;
            width: 80px;
            margin: 12px auto 0;
          }
          &.active {
            border: 1px solid #fb3a32;
            transition: all 0.5s linear;
          }
          .checked_img{
            position: absolute;
            top: -1px;
            right: -1px;
            width: 24px;
            height: 24px;
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }
        }
        &.checked-not-allow {
          position: relative;
          .not-allow {
            position: absolute;
            height: 173px;
            width: 80px;
            background: rgba(255, 255, 255, 0.5);
            left: calc(50% - 40px);
            bottom: 24px;
            cursor: not-allowed;
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
          padding: 12px 32px 48px 32px;
          min-height: 919px;
        }
        &_pc{
          width: 880px;
        }
        &_wap{
          width: 395px;
          height: 832px;
          border-radius: 4px;
          margin: 0 auto;
          transform: scale(0.8);
          transform-origin: center top;
          padding: 98px 10px 10px 10px;
          background-image: url('./image/living/wap_show.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          &_tip {
            display: block;
            margin-top: 34px;
            font-size: 14px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.25);
          }
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
        &.more__layout {
          padding-bottom: 16px;
        }
        .theme_colors{
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span{
            display: inline-block;
            width: 32px;
            height: 32px;
            border: none;
            background: #595959;
            margin-right: 10px;
            border-radius: 4px;
            cursor: pointer;
            &:nth-of-type(2) {
              border: 1px solid #D9D9D9;
            }
            &.active{
              width: 40px;
              height: 40px;
            }
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
              border-radius: 2px;
            }
          }
        }
        &_wap_bg {
          /deep/ .el-upload--picture-card {
            width: 153px;
            height: 332px;
          }
        }
        &_title, .vague_theme{
          margin-bottom: 10px;
          color: #262626;
          font-size: 14px;
          line-height: 20px;
          .saasicon_help_m {
            vertical-align: bottom;
          }
          .mr {
            margin-right: 4px;
          }
        }
        .title_tip{
          font-size: 14px;
          color: #8c8c8c;
          line-height: 22px;
          margin: 10px 0;
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
          .item_lay{
            text-align: center;
            cursor: pointer;
            position: relative;
            &_hidden {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              cursor: default;
              background: rgba(255, 255, 255, 0.5);
            }
          }
          &.more__layout {
            justify-content: space-between;
            flex-wrap: wrap;
            .item_lay{
              margin-bottom: 8px;
            }
          }
          &.inv_demo__layout {
            justify-content: flex-start;
            .item_lay {
              margin-left: 8px;
            }
          }
          p{
            width: 72px;
            height: 50px;
            border-radius: 4px;
            margin-bottom: 5px;
            border: 1px solid #D9D9D9 ;
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
    /deep/ .el-upload--picture-card {
      width: 100%;
      height: 130px;
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
