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
            <div class="pc_header_tag">
              <img src="./image/living/browser@2x.png" alt="">
            </div>
            <div class="pc_container">
              <div class="pc_bg">
                <img :src="domain_url" alt="">
              </div>
              <div class="pc_header">
                <div class="header_left">
                  <div class="left_logo"><img src="./image/living/logo@2x.png" alt=""></div>
                  <div class="left_title">
                    <p class="title">30分钟直播运营实操-教你从0-1快速上手 <span v-if="livingPcPreviewType==1"><img src="./image/living/living.png" alt=""></span><span v-if="livingPcPreviewType==2"><img src="./image/living/subscribe.png" alt=""></span> </p>
                    <p class="host">主办方：直播研究院 &nbsp;&nbsp;  2022-06-24 14:30</p>
                  </div>
                </div>
                <div class="header_right">
                  <div class="right_icon">
                    <span><i class="iconfont-v3 saasicon_guanzhu"></i> 关注</span>
                    <span><i class="iconfont-v3 saasicon-share"></i> 分享</span>
                  </div>
                  <div class="right_login"><span><img src="./image/living/avatar@2x.png" alt=""></span> 登录</div>
                </div>
              </div>
              <div class="pc_watch" v-if="livingPcPreviewType==1">
                <div class="watch_left">
                  <div class="left_top">
                    <!-- 均匀 -->
                    <!-- <div class="left_top__even">
                      <span><img src="./image/living/layout1.png" alt=""></span>
                      <span><img src="./image/living/layout5.png" alt=""></span>
                    </div> -->
                    <!-- 浮窗 -->
                    <!-- <div class="left_top__float">
                      <div class="imgs">
                        <span><img src="./image/living/layout2.png" alt=""></span>
                        <span><img src="./image/living/layout3.png" alt=""></span>
                      </div>
                    </div> -->
                    <!-- 平铺 -->
                    <div class="left_top__tiling">
                      <div class="host">
                        <img src="./image/living/layout1.png" alt="">
                      </div>
                      <div class="imgs">
                        <span><img src="./image/living/layout2.png" alt=""></span>
                        <span><img src="./image/living/layout3.png" alt=""></span>
                        <span><img src="./image/living/layout4.png" alt=""></span>
                        <span><img src="./image/living/layout5.png" alt=""></span>
                      </div>
                    </div>
                  </div>
                  <div class="left_bottom">
                    <span class="left_bottom_setting">
                      <i class="iconfont-v3 saasicon_Settings1"></i> 设置 &nbsp;
                      <i class="iconfont-v3 saasline-user"></i> 12314 &nbsp;
                      <i class="iconfont-v3 saasredu_icon"></i> 345671 &nbsp;
                    </span>
                    <span class="left_bottom_tools"><img src="./image/living/tools@2x.png" alt=""></span>
                  </div>
                </div>
                <div class="watch_right">
                  <div class="right_top">
                    <img src="./image/living/ppt.png" alt="">
                  </div>
                  <div class="right_bottom">
                    <div class="right_bottom_chat">
                      <div class="chat_tab">
                        <p>聊天</p>
                        <span></span>
                      </div>
                      <div class="chat_box">
                        <div class="chat_box_item chat_box_top">
                          <div class="item_img">
                            <p><img src="./image/living/chat1.png" alt=""></p>
                          </div>
                          <div class="item_chat">
                            <p class="chat_role"><span class="host">主持人</span> 蒋老师</p>
                            <p class="chat_title">欢迎线上的各位小伙伴～</p>
                          </div>
                        </div>
                        <div class="chat_box_item chat_box_top">
                          <div class="item_img">
                            <p><img src="./image/living/layout3.png" alt=""></p>
                          </div>
                          <div class="item_chat">
                            <p class="chat_role">邓浩杰</p>
                            <p class="chat_title">期待已久的运营直播实操课～～</p>
                          </div>
                        </div>
                        <div class="chat_box_item">
                          <div class="item_img">
                            <p><img src="../../../common/images/avatar.png" alt=""></p>
                          </div>
                          <div class="item_chat">
                            <p class="chat_role">王觉</p>
                            <p class="chat_title">30分钟直播运营实操特训营，终于开营啦，快来加入吧</p>
                          </div>
                        </div>
                         <div class="chat_box_item">
                          <div class="item_img">
                            <p><img src="./image/living/layout2.png" alt=""></p>
                          </div>
                          <div class="item_chat">
                            <p class="chat_role"><span class="ass">助理</span> 小助理</p>
                            <p class="chat_title">获取PPT，请添加官方企微哦～</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right_bottom_send">
                      <div class="icon">
                        <i class="iconfont-v3 saasline-expression"></i>
                        <i class="iconfont-v3 saasa-line-zhikanzhubanfang"></i>
                      </div>
                      <div class="send">
                        <p><span>参与聊天</span></p>
                        <span class="send_msg"><i class="iconfont-v3 saasline-send"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pc_subscribe" v-else>
                <div class="pc_subscribe_bg"></div>
                <div class="pc_subscribe_bottom">
                  <div class="font_scale">距离开播 <span class="color_bold">10</span> 天<span class="color_bold">08</span> 时<span class="color_bold">46</span> 分<span class="color_bold">25</span> 秒</div>
                  <div class="font_right">已预约 <span class="color_red">233</span> 人<span class="btn">立即预约</span></div>
                </div>
              </div>
              <div class="pc_footer" v-if="livingPcPreviewType==1">微吼提供技术支持 ｜ 反馈与举报</div>
            </div>
          </div>
          <div class="preview_box_wap" v-else>

          </div>
        </div>
      </div>
    </div>
    <div class="living-setting_form">
      <div class="living-setting_form_opera">
        <vh-button size="small" plain round v-preventReClick @click="resetForm">恢复默认</vh-button>
        <vh-button size="small" plain  round v-preventReClick @click="goPreviewLiving">预览</vh-button>
        <vh-button type="primary" size="small" round v-preventReClick @click="saveSettingLivingInfo">保存</vh-button>
      </div>
      <div class="form_item">
        <p class="form_item_title">主题色</p>
        <color-set ref="pageThemeColors" :isShowMain="false"  :themeKeys=pageThemeColors  :colorDefault="livingForm.pageStyle"></color-set>
      </div>
      <div class="form_item" v-if="livingPreview == '1' || choseWapType == 3">
        <p class="form_item_title">主题背景</p>
        <upload
          class="upload__living"
          id="living_cropper"
          v-model="livingForm.theme_url"
          :domain_url="livingForm.theme_url"
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
      <div class="form_item" v-if="livingPreview == '1' || choseWapType == 3">
        <span class="vague_theme">模糊程度</span>
        <vh-slider v-model="livingForm.theme_vague" style="width: 131px" :max="10"></vh-slider>
        <span class="vague_num">{{livingForm.theme_vague}}</span>
      </div>
      <div class="form_item" v-if="livingPreview == '1' || choseWapType == 3">
        <span class="vague_theme">背景亮度</span>
        <vh-slider v-model="livingForm.theme_light" style="width: 131px" :max="20"></vh-slider>
        <span class="vague_num">{{livingForm.theme_light}}</span>
      </div>
      <div class="form_item" v-if="(livingPreview == '1' && livingPcPreviewType==1)">
        <span class="vague_theme">聊天布局</span>
        <vh-radio-group v-model="livingForm.chatLayout" size="mini">
          <vh-radio-button round :label="1">上下显示</vh-radio-button>
          <vh-radio-button round :label="2">左右显示</vh-radio-button>
        </vh-radio-group>
      </div>
      <template v-if="livingPcPreviewType==1">
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
        <div class="form_item" v-if="livingPreview == 2 && livingPcPreviewType==1">
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
            @delete="resetLogoUrl">
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
    <living-preview ref="livingPreview"></living-preview>
    <cropper @cropComplete="cropComplete" ref="livingCropper" cropperDom="living_cropper"></cropper>
  </div>
</template>
<script>
import livingPreview from './livingPreview.vue';
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';
import cropper from '@/components/Cropper';
export default {
  name: 'livingSet',
  data() {
    return {
      themeTypeList: [
        {
          title: '简洁白',
          url: '',
          id: 1,
          isActive: true
        },
        {
          title: '炫酷黑',
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
      pageThemeColors: ['FFFFFF', '1A1A1A', 'FB2626', 'D9A90B', '1E4EDC'],
      videoColors: ['000000', '262626', '595959', '8F8F8F', 'D9D9D9'],
      livingPreview: 1,
      livingPcPreviewType: 1,
      livingForm: {
        pageStyle: '#FFFFFF',
        videoStyle: '#000000',
        theme_url: 'https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202207/d0/e7/d0e737b7c30eced4bc498a93e647eae6.jpg',
        theme_vague: 0,
        theme_light: 10,
        chatLayout: 1,
        microphone: 1, //连麦布局
        video_url: '',
        video_vague: 0,
        video_light: 10
      },
      reader: '',
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
    livingPreview,
    ColorSet,
    Upload,
    cropper
  },
  mounted() {
  },
  computed: {
    pathUrl() {
      return `interacts/screen-imgs/${this.$moment().format('YYYYMM')}`;
    },
    domain_url() {
      if (!this.livingForm.theme_url) return;
      return `${this.livingForm.theme_url}?x-oss-process=image/crop,x_${this.themeImages.x.toFixed()},y_${this.themeImages.y.toFixed()},w_${this.themeImages.width.toFixed()},h_${this.themeImages.height.toFixed()}${this.livingForm.theme_vague > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingForm.theme_vague * 2}` : ''},x-oss-process=image/bright,${(this.livingForm.theme_light - 10) * 5} `;
    },
    video_url() {
      if (!this.livingForm.video_url) return;
      return `${this.livingForm.video_url}?x-oss-process=image/crop,x_${this.videoImages.x.toFixed()},y_${this.videoImages.y.toFixed()},w_${this.videoImages.width.toFixed()},h_${this.videoImages.height.toFixed()}${this.livingForm.video_vague > 0 ? `,x-oss-process=image/blur,r_10,s_${this.livingForm.video_vague * 2}` : ''},x-oss-process=image/bright,${(this.livingForm.video_light - 10) * 5} `;
    }
  },
  methods: {
    cropComplete(cropedData, option) {
      console.log(cropedData, option)
      if (option.index == 1) {
        this.livingForm.theme_url = option.src
        this.themeImages = cropedData;
      } else {
        this.livingForm.video_url = option.src
        this.videoImages = cropedData;
      }
    },
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
    resetForm() {
      this.chosePcType = 1;
      this.choseWapType = 1;
      this.livingPreview = 1;
      this.livingPcPreviewType = 1;
      this.livingForm = {
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
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.livingForm.theme_url = '';
        this.domain_url = '';
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
    // height: 100%;
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
        // height: 800px;
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
          .pc_header_tag{
            width: 100%;
            height: 32px;
            border-radius: 8px 8px 0 0;
            img{
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .pc_container{
            position: relative;
            width: 100%;
            // height: 480px;
            z-index: 0;
            .pc_bg{
              width: 100%;
              height: 480px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .pc_header{
              height: 48px;
              width: 100%;
              padding: 0 16px;
              background: #262626;
              display: flex;
              align-items: center;
              color: #f0f0f0;
              justify-content: space-between;
              .header_left{
                display: flex;
                align-items: center;
                .left_logo{
                  width: 50px;
                  height: 30px;
                  margin-right: 12px;
                  img{
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
                .left_title{
                  .title{
                    color: #E6E6E6;
                    font-size: 12px;
                    line-height: 20px;
                    span{
                      display: inline-block;
                      width: 34px;
                      height: 12px;
                      img{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                      }
                    }
                  }
                  .host{
                    color: #A6A6A6;
                    font-size: 14px;
                    transform: scale(0.8);
                    transform-origin: center left;
                  }
                }
              }
              .header_right{
                display: flex;
                align-items: center;
                .right_icon{
                  color: #A6A6A6;
                  font-size: 12px;
                  span{
                    padding-right: 10px;
                  }
                  i{
                    vertical-align: text-bottom;
                  }
                }
                .right_login{
                  font-size: 12px;
                  color: #A6A6A6;
                  padding-left: 14px;
                  line-height: 24px;
                  span{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    vertical-align: middle;
                    img{
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                      object-fit: contain;
                    }
                  }
                }
              }
            }
            .pc_watch{
              width: 100%;
              padding: 0 55px;
              margin-top: 12px;
              height: 362px;
              display: flex;
              .watch_left{
                width: calc(100% - 174px);
                height: 100%;
                .left_top{
                  width: 100%;
                  height: 334px;
                  background-color: #000;
                  border-radius: 4px 4px 0 0;
                  &__even{
                    display: flex;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    span{
                      display: inline-block;
                      width: 298px;
                      height: 167px;
                      img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                    }
                  }
                  &__float{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background: url('./image/living/layout1.png') no-repeat 50% 50%;
                    .imgs{
                      position: absolute;
                      left: 0;
                      bottom: 0;
                      height: 84px;
                      span{
                        display: inline-block;
                        width: 149px;
                        height: 84px;
                        img{
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        }
                      }
                    }
                  }
                  &__tiling{
                    .host{
                      width: 446px;
                      height: 250px;
                      margin: 0 auto;
                      img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                    }
                    .imgs{
                      display: flex;
                      span{
                        display: inline-block;
                        width: 149px;
                        height: 84px;
                        img{
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        }
                      }
                    }
                  }
                }
                .left_bottom{
                  width: 100%;
                  height: 28px;
                  background-color: #2a2a2a;
                  border-radius: 0 0 4px 4px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-left: 10px;
                  &_setting{
                    font-size: 14px;
                    color: #A6A6A6;
                    transform: scale(0.8);
                    transform-origin: center left;
                  }
                  &_tools{
                    display: inline-block;
                    width: 112px;
                    height: 20px;
                    transform: scale(0.9);
                    transform-origin: center right;
                    img{
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                    }
                  }
                }
              }
              .watch_right{
                width: 165px;
                margin-left: 9px;
                .right_top{
                  width: 100%;
                  height: 93px;
                  border-radius: 4px 4px 0 0;
                  img{
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 4px 4px 0 0;
                  }
                }
                .right_bottom{
                  width: 100%;
                  height: 269px;
                  background: #2a2a2a;
                  position: relative;
                  border-radius: 0 0 4px 4px;
                  &_chat{
                    width: 100%;
                    .chat_tab{
                      height: 21px;
                      width: 100%;
                      padding: 0 10px;
                      background: #2a2a2a;
                      position: relative;
                      border-bottom: 1px solid #1a1a1a;
                      p{
                        color: #FB2626;
                        font-size: 14px;
                        line-height: 19px;
                        transform: scale(0.6);
                        transform-origin: center left;
                      }
                      span{
                        position: absolute;
                        display: inline-block;
                        width: 15px;
                        height: 2px;
                        bottom: 0;
                        left: 10px;
                        border-radius: 4px;
                        background: #FB2626;
                      }
                    }
                    .chat_box{
                      width: 100%;
                      padding: 0 10px;
                      margin-top: 8px;
                      &_item{
                        display: flex;
                        margin-bottom: -14px;
                        &.chat_box_top{
                          margin-bottom: -2px;
                        }
                        .item_img{
                          p{
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            transform: scale(0.5);
                            transform-origin: top left;
                            img{
                              width: 100%;
                              height: 100%;
                              border-radius: 50%;
                              object-fit: cover;
                            }
                          }
                        }
                        .item_chat{
                          margin-left: -8px;
                          .chat_role{
                            font-size: 16px;
                            transform: scale(0.5);
                            transform-origin: top left;
                            color: #737373;
                            .host{
                              color: #FB2626;
                              // background: #0A7FF5;
                            }
                            .ass{
                              color: #0A7FF5;
                              // background: ;
                            }
                          }
                        }
                        .chat_title{
                          color: #fff;
                          line-height: 22px;
                          padding: 2px 5px;
                          transform: scale(0.5);
                          font-size: 16px;
                          transform-origin: top left;
                          background: rgba(255, 255, 255, 0.08);
                          border-radius: 6px;
                          margin-right: -115px;
                        }
                      }
                    }
                  }
                  &_send{
                    width: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: 40px;
                    background: #2a2a2a;
                    border-top: 1px solid #1a1a1a;
                    padding: 2px 8px;
                    color: rgba(255, 255, 255, 0.65);
                    border-radius: 0 0 4px 4px;
                    .icon{
                      font-size: 18px;
                      transform: scale(0.5);
                      transform-origin: top left;
                      i{
                        padding-right: 8px;
                      }
                    }
                    .send{
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-top: -6px;
                      p{
                        width: 125px;
                        height: 20px;
                        border-radius: 20px;
                        background: #1a1a1a;
                        padding-left: 9px;
                        span{
                          display: inline-block;
                          font-size: 16px;
                          line-height: 40px;
                          transform: scale(0.5);
                          transform-origin: top left;
                        }
                      }
                      &_msg{
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        line-height: 40px;
                        background: #1a1a1a;
                        border-radius: 50%;
                        text-align: center;
                        i{
                          display: inline-block;
                          font-size: 18px;
                          transform: scale(0.5);
                          transform-origin: top center;
                        }

                      }
                    }
                  }
                }
              }
            }
            .pc_subscribe{
              margin-top: 12px;
              padding: 0 55px;
              height: 447px;
              &_bg{
                width: 100%;
                height: 380px;
                border-radius: 4px 4px 0 0;
                background: url('./image/living/ppt.png') no-repeat 50% 50%;
              }
              &_bottom{
                width: 100%;
                height: 32px;
                border-radius:  0 0 4px 4px;
                background: #2a2a2a;
                padding: 0 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color:#E6E6E6;
                line-height: 32px;
                .font_scale{
                  font-size: 20px;
                  transform: scale(0.5);
                  transform-origin: center left;
                }
                .color_bold{
                  font-size: 40px;
                  font-weight: 500;
                  padding-left: 10px;
                }
                .color_red{
                  color: #FB2626;
                  display: inline-block;
                }
                .font_right{
                  font-size: 20px;
                  transform: scale(0.5);
                  transform-origin: center right;
                }
                .btn{
                  display: inline-block;
                  width: 128px;
                  height: 44px;
                  border-radius: 18px;
                  background: #FB2626;
                  color: #fff;
                  margin-left: 20px;
                  line-height: 44px;
                  text-align: center;
                }
              }
            }
            .pc_footer{
              text-align: center;
              font-size: 12px;
              line-height: 18px;
              margin-top: 8px;
              color: #666;
            }
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
