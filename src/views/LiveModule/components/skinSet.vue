<template>
  <div class="skin--set">
    <div class="sign--set--main">
      <div class="skin--set--left">
        <el-form :model="skinSetForm" ref="signSetForm" :rules="skinSetFormRules" label-width="94px">
          <el-form-item label="皮肤方案">
            <el-radio-group v-model="skinType">
              <el-radio :label="0">默认皮肤</el-radio>
              <el-radio :label="1">自定义皮肤</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="页面设置">
            <color-set :themeKeys=pageBgColors></color-set>
          </el-form-item>
          <el-form-item label="页面风格">
            <color-set :themeKeys=pageThemeColors :openSelect=true></color-set>
          </el-form-item>
          <el-form-item label="标志替换：" prop="logo_url">
            <upload
              class="upload__sign heightMore"
              v-model="skinSetForm.logo_url"
              :saveData="{
                 path: 'webinars/sign_set_url',
                 type: 'image',
              }"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>最佳尺寸：240*78px</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
            <p class="p-notice">开启时支持更换品牌标志</p>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" round @click.prevent.stop="skinSetSave">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview ref="brandSetPreviewComp" class="brand--preview"></brand-set-preview>
      <!-- 保存样式区域 -->
      <textarea id="style-code-bgColor">
        /* 背景色,begin */
            body{
                background-color: $$bgColor$$;
            }
            /*播放器区域*/
            .watch-container {
                background-color: $$bgColor$$;
            }
        /* 背景色,end */
    </textarea>
      <textarea id="style-code-background" style="display: none;">
        /* 播放器背景图设置,begin */
            .watch-container {
                background:url($upload_url$$$background$$) no-repeat;
                background:url($upload_url$$$background$$) no-repeat;
                background-size: 100%;
            }
        /* 播放器背景图设置,end */
    </textarea>
      <textarea id="style-code-logo" style="display: none;">
        /*logo*/
        .watch-header h3,.watch-header .block-userinfo {
            margin-left:68px;
        }
        .watch-header .watch-header-logo{
            display:block;
            margin-top:6px;
            width: 54px;
            height: 54px;
            background:url($upload_url$$$logo$$) no-repeat;
            border-radius:4px;
            background-size:54px 54px;
        }
    </textarea>
      <textarea id="style-code-pageStyle" style="display: none;">
        /* blog begin */
            /*外层容器*/
            .watch-header .block-userinfo .follow-someone-btns {
                background: $$pageStyle$$;
                border-radius: 3px;
            }
            /*博客关注数*/
            .watch-header .block-userinfo .follow-someone-btns a {
                background-color:$$pageStyle$$;
            }
            /*在线人数*/
            .watch-header .block-userinfo .follow-someone-btns a.follow-nums {
                color: $$pageStyle$$;
                background: rgba(255,255,255,0.8);
            }
        /* blog end */
        /*简介title背景色条*/
        .area-bottom .h3 span {
            /*页面风格*/
            border-bottom: 2px solid $$pageStyle$$;
        }
        /*菜单颜色*/
        .area-bottom .desc-tab span.active {
          border-bottom: 2px solid $$pageStyle$$;
        }
        /*商品展示区开始*/
        .product-area .v3-btn-group .v3-btn{
            background-color: $$pageStyle$$;
            border: 1px solid $$pageStyle$$;
        }
        .product-details .v3-btn-group .v3-btn{
            background-color: $$pageStyle$$;
            border: 1px solid $$pageStyle$$;
        }
        .product-area .shop-link span{
            color:$$pageStyle$$;
        }
        .product-details .shop-link span{
            color:$$pageStyle$$;
        }
        .product-details .picture-thumbnail ul li img.active{
            border: solid 1px $$pageStyle$$;
        }
        /*商品展示区结束*/
        /*评论和公告*/
        .type-box .type-list ul li a.active {
            background-color: $$pageStyle$$;
        }

        /*弹窗风格*/
        .popup .popup-btn .popup-btn-yes{
                background:$$pageStyle$$;
        }
        .reward-popup ul li.on{
            background-color:$$pageStyle$$;
        }
        /*预约*/
        .watch-body .join-webinar-btn{
            background-color:$$pageStyle$$;
        }
        /*已预约按钮*/
        .watch-body .join-webinar-btn.is-reserved{
            background-color:$$pageStyle$$;
        }
    </textarea>
      <textarea id="style-code-popStyle" style="display: none;">
        /* 弹窗背景 */
        .popup {
            background: $$popStyle$$;
        }
        /* 弹窗标题 */
        .popup popup-title{
            border-bottom-color:$$popStyle$$;
            background-color:$$popStyle$$;
        }

        /* 弹窗内容 */
        .popup popup-content{
            background-color:rgba(0,0,0,0.85);
        }


    </textarea>
      <textarea id="style-code-popStyle-black" style="display: none;">
        /* 弹窗背景 */
        .popup {
            background: #2b2b32;
            color:#d5d5d5;
        }
        /* 商品弹窗区开始(包括广告弹窗) */

        .v3-div.layui-layer{
            background-color:#2b2b32;
        }
        .v3-div .layui-layer-title{
            background-color:#2b2b32;
        }
        .ad-picture .preview-content img{
            border: solid 1px #515157;
        }
        .preview-title{
            color: #d5d5d5;
        }
        .ad-qrcode .preview-title{
            color: #d5d5d5;
        }
        .ad-qrcode .preview-title span.owner {
            color: #d5d5d5;
        }
        .product-details{
            background-color:#2b2b32;
        }
        .product-details .current-img{
            border: solid 1px #515157;
        }
        .product-details .product-title{
            color: #d5d5d5;
        }
        .product-details .product-des{
            color: #d5d5d5;
        }
        /* 商品弹窗区结束*/
        /* 弹窗标题 */
        .popup .popup-title{
            border-bottom-color:#151518;
            background-color:#151518;
        }
        /* 抽奖 */
        .lottery-loading {
            background: #2b2b32;
        }
        /* 抽奖结果 */
        .popup.lottery-success .lottery-result span {
            background-color: rgba(0,0,0,0.25);
        }
        #popup-gift-info{
            background-color:#2b2b32 !important;
            border-color:#828282 !important;
        }

        .reward-popup .wxpay-qrcode {
            background-color: #2b2b32;
        }

        .popup .popup-content .popup-input {
            background-color: #2b2b32;
            color: #a9a9a9;
            border-color: #828282;
        }
        /* 问卷 */
        .survey-body{
            background-color: #2b2b32 !important;
        }
    </textarea>
      <textarea id="text-and-border-color" style="display: none;">
        .area-bottom .desc-tab span {
            color: #d5d5d5;
        }
        .area-bottom .desc-tab {
            border-bottom: 1px solid #515157;
        }
         /* text code*/
        .watch-header h3{
            color: #fff;
        }

        /*主播*/
        .watch-header .block-userinfo {
            color: #adacac;
        }

        /* 反馈 */
        .watch-header .head-r-toolbar .report {
            color: #adacac;
        }

        /*在线人数和观看次数*/
        .watch-header .watch-pv {
            color: #adacac;
        }

        /* 播放器底部分割线 */
        .watch-container {
            border-bottom-color:#515456;
        }

        /*简介和页脚的分割线*/
        .section-footer .footer{
            border-top-color:#515456;
        }

        /*活动简介标题*/
        .area-bottom .h3 span {
            color:#d5d5d5;
        }

        /*活动简介,背景和边框*/
        .area-bottom .desc-area,.area-bottom .advs-area{
            background: #383838;
            border: 1px solid #515157;
            border-radius: 2px;
        }

        /*商品展示区开始*/
        .product-area{
            background: #383838;
            border: 1px solid #515157;
        }
        .product-area .product-cover{
            border: solid 1px #515157;
        }
        .product-area .product-title{
            color:#d5d5d5;
        }
        .product-area .product-des{
            color:#d5d5d5;
        }
        /*商品展示区结束*/

        /*活动简介中间分隔线*/
        .area-bottom .h3{
            border-bottom-color:#515456;
        }

        /*活动简介文字内容颜色*/
        .area-bottom .desc-area .desc p {
            color: #d5d5d5;
        }

        /*友情链接*/
        .section-footer .about-us a {
            color:rgba(255,255,255,0.8);
            border-right-color:rgba(255,255,255,0.8);
        }

        /* copyright */
        .section-footer p {
            color: #808080;
        }
        /* 主播推荐 */
        .area-bottom .advs-area .advs-list li .advs-title{
            color: #d5d5d5;
        }
        /* 预约简介 */
        .area-bottom .desc-area .desc{
            color: #d5d5d5;
        }
    </textarea>
      <textarea id="style-code" style="display: none;">

        /* text code*/
        .watch-header h3{
            color: #fff;
            margin-left: 30px;
        }

        .watch-header .block-userinfo {
            color: #fff;
        }

        .watch-header .watch-pv {
            color: #fff;
        }
        .watch-header .head-r-toolbar .report {
            color: #fff;
        }
        /*活动简介*/
        .area-bottom .desc-area{
            background: rgba(210,210,210,0.2);
            border: 1px solid #ececec;
            border-radius: 2px;
        }

        .area-bottom .desc-area .desc p {
            color: #fff;
        }

        .section-footer .about-us a {
            color: #fff;
        }

        .section-footer p {
            color: #fff;
        }
    </textarea>
      <textarea id="style-code-pageStyle-for-phone" style="display: none;">
    .product-area .v3-btn.disabled{
        background-color:$$pageStyle$$;
        border: 1px solid $$pageStyle$$;
    }
    .product-details .v3-btn.disabled{
        background-color:$$pageStyle$$;
        border: 1px solid $$pageStyle$$;
    }
    .product-area .v3-btn{
        background-color:$$pageStyle$$;
        border: 1px solid $$pageStyle$$;
    }
    .product-details .v3-btn{
        background-color:$$pageStyle$$;
        border: 1px solid $$pageStyle$$;
    }
        .ctrl-list li.active{
            color:$$pageStyle$$;
        }
        body .phone-menu .phone-menu-box ul li:hover span.tit, body .phone-menu .phone-menu-box ul .active span.tit {
             color: $$pageStyle$$;
        }
        body .phone-menu .phone-menu-box ul .active span.tit:after {
            border-bottom: 2px solid $$pageStyle$$;
        }
        .introduction-tag span{
            background-color:$$pageStyle$$;
        }
        .desc-title .type-tag.live{
            background-color:$$pageStyle$$;
        }
        .gifts-box-button{
            background-color:$$pageStyle$$;
        }
        .btn{
            background-color:$$pageStyle$$;
        }
        .modal-reward .v-money a.reward-btn.active{
            color:$$pageStyle$$;
            border-color:$$pageStyle$$;
        }
        .modal-selMiccdn .sel-miccdn li.active {
            border-color: $$pageStyle$$;
            color: $$pageStyle$$;
        }
        .follow-someone-box .follow-someone{
            border-color:$$pageStyle$$;
            color:$$pageStyle$$;
        }

    </textarea>
    <textarea id="style-code-logo-for-phone" style="display: none;">
        .video-contorl .wap-player-logo{
            position: absolute;
            height: 0.8rem;
            width: 0.8rem;
            background-image:url($upload_url$$$logo$$);
            background-size: 0.8rem 0.8rem;
            margin-top: -0.155rem;
            margin-left: -0.4rem
        }
        .video-contorl .webinar-pv{
            margin-left: 0.5rem;
        }
    </textarea>

    </div>
  </div>
</template>

<script>
import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';

export default {
  name: "skinSet.vue",
  components: {
    Upload,
    BrandSetPreview,
    ColorSet
  },
  data() {
    return {
      pageBgColors: ['FFFFFF', 'F2F2F2', '1A1A1A'],
      pageThemeColors: ['FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      skinType: null, // 0-默认皮肤；1-自定义皮肤
      skinSetForm: {
        logo: null,
      },
      skinSetFormRules: {
        logo: [
          {require: true, message: '请先选择图片', trigger: 'change'}
        ]
      },
    };
  },
  computed: {
    tmpl: function() {
      let skin_json_pc = {
        "bgColor":"bg-gray",
        "logo":"webinars/skin_img/4c/dc/4cdc01abf8329501fe75b145db8fc6e0.jpeg",
        "pageStyle":"bg-blue",
        "popStyle":"bg-white",
        "background":"webinars/skin_img/4c/dc/4cdc01abf8329501fe75b145db8fc6e0.jpeg",
        "skinName":"自定义"
      };
      let skin_style_code_pc = `
        /* 背景色,begin */
          body{
            background-color: #d2d2d2;
          }
          /*播放器区域*/
          .watch-container {
            background-color: #d2d2d2;
          }
        /* 背景色,end */
        /*logo*/
          .watch-header h3,.watch-header .block-userinfo {
              margin-left:68px;
          }
          .watch-header .watch-header-logo{
              display:block;
              margin-top:6px;
              width: 54px;
              height: 54px;
              background:url($upload_url$webinars/skin_img/4c/dc/4cdc01abf8329501fe75b145db8fc6e0.jpeg) no-repeat;
              border-radius:4px;
              background-size:54px 54px;
          }
        /* 播放器背景图设置,begin */
          .watch-container {
              background:url($upload_url$webinars/skin_img/4c/dc/4cdc01abf8329501fe75b145db8fc6e0.jpeg) no-repeat;
              background:url($upload_url$webinars/skin_img/4c/dc/4cdc01abf8329501fe75b145db8fc6e0.jpeg) no-repeat;
              background-size: 100%;
          }
        /* 播放器背景图设置,end */
        /* blog begin */
          /*外层容器*/
          .watch-header .block-userinfo .follow-someone-btns {
              background: #4b97f7;
              border-radius: 3px;
          }
          /*博客关注数*/
          .watch-header .block-userinfo .follow-someone-btns a {
              background-color:#4b97f7;
          }
          /*在线人数*/
          .watch-header .block-userinfo .follow-someone-btns a.follow-nums {
              color: #4b97f7;
              background: rgba(255,255,255,0.8);
          }
        /* blog end */
        /*简介title背景色条*/
          .area-bottom .h3 span {
              /*页面风格*/
              border-bottom: 2px solid #4b97f7;
          }
        /*菜单颜色*/
          .area-bottom .desc-tab span.active {
            border-bottom: 2px solid #4b97f7;
          }
        /*商品展示区开始*/
          .product-area .v3-btn-group .v3-btn{
              background-color: #4b97f7;
              border: 1px solid #4b97f7;
          }
          .product-details .v3-btn-group .v3-btn{
              background-color: #4b97f7;
              border: 1px solid #4b97f7;
          }
          .product-area .shop-link span{
              color:#4b97f7;
          }
          .product-details .shop-link span{
              color:#4b97f7;
          }
          .product-details .picture-thumbnail ul li img.active{
              border: solid 1px #4b97f7;
          }
        /*商品展示区结束*/
        /*评论和公告*/
          .type-box .type-list ul li a.active {
              background-color: #4b97f7;
          }
        /*弹窗风格*/
          .popup .popup-btn .popup-btn-yes{
                  background:#4b97f7;
          }
          .reward-popup ul li.on{
              background-color:#4b97f7;
          }
        /*预约*/
          .watch-body .join-webinar-btn{
              background-color:#4b97f7;
          }
        /*已预约按钮*/
          .watch-body .join-webinar-btn.is-reserved{
            background-color:#4b97f7;
          }
      `;
      // 无手机端设置的时候，如 => skin_json_wap = {"logo":"","pageStyle":""} skin_style_code_wap为空
      // 有手机端设置的时候，{"logo":"webinars/skin_img/5c/5d/5c5dce7de690e4f1d0fbf845eb13c1a9.jpg","pageStyle":"bg-red"}
      let skin_json_wap = {
        "logo":"webinars/skin_img/5c/5d/5c5dce7de690e4f1d0fbf845eb13c1a9.jpg",
        "pageStyle":"bg-red"
      };
      let skin_style_code_wap = `
        .product-area .v3-btn.disabled{
            background-color:#ff3333;
            border: 1px solid #ff3333;
        }
        .product-details .v3-btn.disabled{
            background-color:#ff3333;
            border: 1px solid #ff3333;
        }
        .product-area .v3-btn{
            background-color:#ff3333;
            border: 1px solid #ff3333;
        }
        .product-details .v3-btn{
            background-color:#ff3333;
            border: 1px solid #ff3333;
        }
        .ctrl-list li.active{
            color:#ff3333;
        }
        body .phone-menu .phone-menu-box ul li:hover span.tit, body .phone-menu .phone-menu-box ul .active span.tit {
             color: #ff3333;
        }
        body .phone-menu .phone-menu-box ul .active span.tit:after {
            border-bottom: 2px solid #ff3333;
        }
        .introduction-tag span{
            background-color:#ff3333;
        }
        .desc-title .type-tag.live{
            background-color:#ff3333;
        }
        .gifts-box-button{
            background-color:#ff3333;
        }
        .btn{
            background-color:#ff3333;
        }
        .modal-reward .v-money a.reward-btn.active{
            color:#ff3333;
            border-color:#ff3333;
        }
        .modal-selMiccdn .sel-miccdn li.active {
            border-color: #ff3333;
            color: #ff3333;
        }
        .follow-someone-box .follow-someone{
            border-color:#ff3333;
            color:#ff3333;
        }
        .video-contorl .wap-player-logo{
          position: absolute;
          height: 0.8rem;
          width: 0.8rem;
          background-image:url($upload_url$webinars/skin_img/5c/5d/5c5dce7de690e4f1d0fbf845eb13c1a9.jpg);
          background-size: 0.8rem 0.8rem;
          margin-top: -0.155rem;
          margin-left: -0.4rem
        }
        .video-contorl .webinar-pv{
            margin-left: 0.5rem;
        }
      `;
      let skin_preview_code_pc = ``;
      let skin_preview_code_wap = ``;
      return {
        skin_json_pc: skin_json_pc,
        skin_style_code_pc: skin_style_code_pc,
        skin_json_wap: skin_json_wap,
        skin_style_code_wap: skin_style_code_wap,
        skin_preview_code_pc: skin_preview_code_pc,
        skin_preview_code_wap: skin_preview_code_wap
      }
    }
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      console.log(res, file);
      this.skinSetForm.logo = res.data.file_url;
      // 触发验证
      this.$refs.skinSetForm.validateField('logo');
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
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.signSetForm.logoUrl = '';
      });
    },
    initComp() {},
    skinSetSave() {
      this.$refs.signSetForm.validate((valid) => {
        if(valid) {
          this.$fetch('userEdit', this.signSetForm).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('保存基本设置成功');
            } else {
              this.$message.error(res.msg || '保存基本设置失败');
            }
          }).catch(err=>{
            console.log(err);
            this.$message.error('保存基本设置失败');
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.skin--set {
  .padding41-40();
}
.sign--set--main {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.skin--set--left{
  width: 50%;
}
.brand--preview {
  width: calc(50% - 48px);
  padding-left: 48px;
}
/deep/.el-form-item__label {
  padding: 0 10px 0 0;
  line-height: 20px;
}
/deep/.el-form-item {
  margin-bottom: 32px;
}
/* 背景上传 */
.upload__skin {
  /deep/.el-upload--picture-card {
    width: 280px;
    height: 130px;
    border: 1px solid #CCCCCC;
    img {
      width: 100%;
      height: auto;
    }
  }
  /deep/.box > div {
    width: 280px;
    height: 130px;
  }
  &.withMore {
    /deep/.el-upload--picture-card {
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  &.heightMore {
    /deep/.el-upload--picture-card {
      img {
        width: auto;
        height: 100%;
      }
    }
  }
}
.p-notice {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 12px;
}
.btnGroup{
  text-align: center;
  margin: 40px auto;
  .el-button{
    color:#FB3A32;
    border-color:#FB3A32;
    width: 150px;
    &:hover{
      background: #ffebeb;
    }
  }
  .el-button--primary{
    background:#FB3A32;
    border-color:#FB3A32;
    color: #fff;
    &:hover{
      background: #fc615b;
    }
  }
  .el-button.is-round{
    padding: 10px 23px;
  }
}
</style>

