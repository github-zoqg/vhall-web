<template>
  <div class="share-setting">
    <pageTitle pageTitle="分享设置"></pageTitle>
    <div class="share-container">
      <div class="share-left">
        <el-form
          :model="formShareInfo"
          ref="ruleShareForm"
          label-width="90px"
          :rules="ruleShareForm"
        >
          <el-form-item label="标题" prop="title">
            <VhallInput
              v-model="formShareInfo.title"
              class="textType"
              placeholder="请输入分享标题"
              autocomplete="off"
              :maxlength="30"
              v-clearEmoij
              show-word-limit
            ></VhallInput>
            <p class="tip">提示：为了您的内容获得有效传播，建议文字不超过14个字符</p>
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <VhallInput
              v-model="formShareInfo.introduction"
              type="textarea"
              class="desc"
              :maxlength="45"
              placeholder="请输入分享简介"
              autocomplete="off"
              :autosize="{ minRows: 5 }"
              resize="none"
              show-word-limit
            ></VhallInput>
            <p class="tip">提示：因手机型号不同简介会显示不完整，建议不超过32个字符</p>
          </el-form-item>
          <el-form-item label="图片" prop="img_url">
            <upload
              class="giftUpload"
              id="share_cropper"
              :heightImg="138"
              :widthImg="138"
              v-model="formShareInfo.img_url"
              :domain_url="formShareInfo.img_url"
              :on-success="uploadAdvSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :before-upload="beforeUploadHnadler"
              @delete="deleteImg"
            >
              <div slot="tip">
                <p>建议尺寸：150*150px，小于1M</p>
                <p>支持jpg、png</p>
              </div>
            </upload>
            <div class="image_cropper">
              <div class="image_cropper_item">
                <span>模糊程度</span>
                <vh-slider
                  v-model="imageCropper.blurryDegree"
                  :max="10"
                  style="width: 300px"
                ></vh-slider>
                <span class="wid_block">{{ imageCropper.blurryDegree }}</span>
              </div>
              <div class="image_cropper_item">
                <span>背景亮度</span>
                <vh-slider
                  v-model="imageCropper.lightDegree"
                  :max="20"
                  style="width: 300px"
                ></vh-slider>
                <span class="wid_block">{{ imageCropper.lightDegree }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              round
              v-preventReClick
              @click="sureShareSetting('ruleShareForm')"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="share-right">
        <div class="share-title">
          <div class="share-img"><img :src="avatar" alt="" /></div>
          <div class="share-text">
            <div class="top">{{ formShareInfo.title }}</div>
            <div class="bottom">
              <p v-html="formShareInfo.introduction"></p>
              <span><img :src="domain_url || img" alt="" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
    <!-- 裁剪组件 -->
    <cropper
      ref="shareCropper"
      @cropComplete="cropComplete"
      @resetUpload="resetUpload"
      :ratio="1 / 1"
    ></cropper>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import upload from '@/components/Upload/main';
  import beginPlay from '@/components/beginBtn';
  import { defaultAvatar } from '@/utils/ossImgConfig';
  import {
    sessionOrLocal,
    parseImgOssQueryString,
    cropperImage,
    getImageQuery
  } from '@/utils/utils';
  import cropper from '@/components/Cropper/index';
  export default {
    name: 'shareSet',
    components: {
      PageTitle,
      upload,
      beginPlay,
      cropper
    },
    data() {
      return {
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
        imageCropper: {
          blurryDegree: 0,
          lightDegree: 10,
          imageCropMode: 1,
          backgroundSize: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }
        },
        formShareInfo: {
          title: '',
          img_url: '',
          introduction: ''
        },
        reImgUrl: '',
        ruleShareForm: {
          title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
          img_url: [{ required: true, message: '请上传图片', trigger: 'blur' }],
          introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }]
        },
        avatar: defaultAvatar,
        // domain_url: '',
        img: require('../../../common/images/share/img.jpg')
      };
    },
    computed: {
      domain_url() {
        if (!this.formShareInfo.img_url) return '';
        return `${
          this.formShareInfo.img_url
        }?x-oss-process=image/crop,x_${this.imageCropper.backgroundSize.x.toFixed()},y_${this.imageCropper.backgroundSize.y.toFixed()},w_${this.imageCropper.backgroundSize.width.toFixed()},h_${this.imageCropper.backgroundSize.height.toFixed()}${
          this.imageCropper.blurryDegree > 0
            ? `,/blur,r_10,s_${this.imageCropper.blurryDegree * 2}`
            : ''
        },/bright,${(this.imageCropper.lightDegree - 10) * 5}&mode=${
          this.imageCropper.imageCropMode
        }`;
      }
    },
    created() {
      this.getShareInfo();
    },
    methods: {
      getShareInfo() {
        this.$fetch('getShareSettingInfo', { webinar_id: this.$route.params.str })
          .then(res => {
            if (res.code === 200) {
              let title = res.data.title;
              title = title.length - 30 > 0 ? title.substring(0, 30) : title;
              this.formShareInfo = {
                title: title,
                introduction: this.repalceHtml(res.data.introduction)
              };
              if (res.data.img_url) {
                this.handlerImageInfo(res.data.img_url);
              }
            }
          })
          .catch(res => {});
      },
      // 处理图片
      handlerImageInfo(url) {
        this.formShareInfo.img_url = getImageQuery(url);
        console.log(this.formShareInfo.img_url, '??fenx分享图片');
        if (cropperImage(url)) {
          let obj = parseImgOssQueryString(url);
          const { blur, crop } = obj;
          this.imageCropper = {
            backgroundSize: {
              x: Number(crop.x),
              y: Number(crop.y),
              width: Number(crop.w),
              height: Number(crop.h)
            },
            blurryDegree: (blur && Number(blur.s) / 2) || 0,
            lightDegree: obj.bright ? 10 + Number(obj.bright) / 5 : 10,
            imageCropMode: obj.mode
          };
        }
        this.reImgUrl = this.formShareInfo.img_url;
      },
      // 保存设置项
      sureShareSetting(formName) {
        this.formShareInfo.webinar_id = this.$route.params.str;
        let params = {
          ...this.formShareInfo,
          img_url: this.$parseURL(this.domain_url).path
        };
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$fetch('setShareSettingInfo', params)
              .then(res => {
                if (res.code === 200) {
                  this.reImgUrl = this.formShareInfo.img_url;
                  this.$message({
                    message: `保存成功`,
                    showClose: true,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(res => {
                this.$message({
                  message: res.msg || `保存失败`,
                  showClose: true,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          } else {
            return false;
          }
        });
      },
      repalceHtml(str) {
        let desc = null;
        desc = str.replace(/&nbsp;/g, '');
        desc = desc
          .replace(/<[^<>&]+>/g, '')
          .replace(/&(lt|gt|nbsp|amp|quot|middot);/gi, '')
          .replace(/(\r\n)|(\n)/g, '');
        desc = desc.length > 42 ? `${desc.trim().substring(0, 42)}...` : desc.trim();
        return desc;
      },
      deleteImg() {
        this.formShareInfo.img_url = this.reImgUrl;
        this.imageCropper.blurryDegree = 0;
        this.imageCropper.lightDegree = 10;
      },
      cropComplete(cropperData, url, mode) {
        console.log(cropperData, url, '?????');
        this.imageCropper.backgroundSize = cropperData;
        this.imageCropper.imageCropMode = mode;
        this.formShareInfo.img_url = url;
      },
      resetUpload() {
        let dom = document.querySelector('#share_cropper .el-upload__input');
        dom.click();
      },
      uploadAdvSuccess(res, file) {
        console.log(res, file);
        if (res.data) {
          this.$refs.shareCropper.showModel(res.data.domain_url);
          // let domain_url = res.data.domain_url || ''
          // let file_url = res.data.file_url || '';
          // this.formShareInfo.img_url = file_url;
          // this.domain_url = domain_url;
        }
      },
      beforeUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isType) {
          this.$message({
            message: `分享图片只能是 ${typeList.join('、')} 格式`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `分享图片大小不能超过 1M`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `分享图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      }
    }
  };
</script>
<style lang="less" scoped>
  .share-setting {
    width: 100%;
    .share-container {
      display: flex;
      background: #fff;
      border-radius: 4px;
      padding: 48px 32px;
    }
    .share-left {
      width: 500px;
      .tip {
        color: #999;
        line-height: 30px;
        font-size: 14px;
      }
      /deep/.el-form-item {
        margin-bottom: 32px;
      }
      /deep/.el-input__inner {
        padding-left: 12px;
      }
      /deep/ .desc .el-textarea__inner {
        font-family: '-apple-system', 'BlinkMacSystemFon', 'Helvetica Neue', Helvetica,
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
        padding-left: 12px;
        background: transparent;
      }
      /deep/.el-button {
        margin-top: 8px;
      }
      /deep/.el-button.is-round {
        padding: 9px 55px;
      }
      .image_cropper {
        width: 100%;
        margin-top: 10px;
        &_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: #595959;
          }
          .wid_block {
            display: inline-block;
            width: 16px;
          }
        }
      }
    }
    .share {
      &-right {
        width: 420px;
        height: 690px;
        margin-top: -30px;
        margin-left: 30px;
        background-image: url('../../../common/images/share/share.png');
        background-size: 100%;
        background-position: center;
        background-size: cover;
        position: relative;
      }
      &-title {
        position: absolute;
        top: 187px;
        left: 68px;
        display: flex;
      }
      &-img {
        width: 30px;
        height: 30px;
        border-radius: 2px;
        // background: #999;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      &-text {
        width: 194px;
        // height: 90px;
        background: #fefffe;
        margin-left: 8px;
        padding: 6px 10px 8px 5px;
        .top {
          width: 100%;
          color: #1a1a1a;
          font-size: 13px;
          line-height: 20px;
          margin-bottom: 6px;
          overflow: hidden;
          max-height: 36px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-left: 5px;
        }
        .bottom {
          display: flex;
          width: 100%;
          justify-content: space-between;
          p {
            color: #666;
            font-size: 12px;
            transform: scale(0.9);
            width: calc(100% - 42px);
            margin-right: 6px;
            padding: 0;
            text-align: left;
            line-height: 16px;
            overflow: hidden;
            max-height: 46px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          span {
            display: inline-block;
            width: 36px;
            height: 36px;
            border: 1px solid #e6e6e6;
            border-radius: 2px;
            margin-top: 3px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
</style>
