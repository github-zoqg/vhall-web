<template>
  <div class="offical-show">
    <pageTitle pageTitle="开屏海报">
      <div class="switch__box">
        <el-switch
          class="el-role-switch"
          v-model="status"
          :active-value="0"
          :inactive-value="1"
          active-color="#ff4949"
          inactive-color="#ccc"
          @change="changeOpenStatus"
          :active-text="activeTitle"
        ></el-switch>
      </div>
    </pageTitle>
    <div :class="status ? 'pre--full-mask' : ''">
      <div class="pre--full-cover" v-show="status"></div>
      <div class="form-phone">
        <div class="official-form">
          <el-form label-width="120px" :model="form" ref="officialForm" :rules="formRules">
            <el-form-item label="手机图片" prop="m_img">
              <div class="img-box">
                <upload
                  class="giftUpload"
                  id="poster_wap_cropper"
                  v-model="form.m_img"
                  :domain_url="form.m_img"
                  :saveData="{
                    path: pathUrl,
                    type: 'image'
                  }"
                  :widthImg="231"
                  :heightImg="130"
                  :on-success="wapUploadAdvSuccess"
                  :on-progress="pcUploadProcess"
                  :on-error="pcUploadError"
                  :on-preview="pcUploadPreview"
                  @handleFileChange="handlePcFileChange"
                  :before-upload="beforePcUploadHnadler"
                  @delete="deleteWapImage"
                >
                  <div slot="tip">
                    <p>建议尺寸：750*1334px</p>
                    <p>小于4M(支持jpg、gif、png、bmp)</p>
                  </div>
                </upload>
              </div>
              <div class="image_cropper">
                <div class="image_cropper_item">
                  <span>模糊程度</span>
                  <vh-slider
                    v-model="formWapImage.blurryDegree"
                    :max="10"
                    :disabled="!form.m_img"
                    style="width: 260px"
                  ></vh-slider>
                  <span class="wid_block">{{ formWapImage.blurryDegree }}</span>
                </div>
                <div class="image_cropper_item">
                  <span>背景亮度</span>
                  <vh-slider
                    v-model="formWapImage.lightDegree"
                    :max="20"
                    :disabled="!form.m_img"
                    style="width: 260px"
                  ></vh-slider>
                  <span class="wid_block">{{ formWapImage.lightDegree }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="PC图片" prop="img">
              <div class="img-box">
                <upload
                  class="giftUpload"
                  id="poster_pc_cropper"
                  v-model="form.img"
                  :domain_url="form.img"
                  :saveData="{
                    path: pathUrl,
                    type: 'image'
                  }"
                  :widthImg="231"
                  :heightImg="130"
                  :on-success="uploadAdvSuccess"
                  :on-progress="uploadProcess"
                  :on-error="uploadError"
                  :on-preview="uploadPreview"
                  @handleFileChange="handleFileChange"
                  :before-upload="beforeUploadHnadler"
                  @delete="deletePcImage"
                >
                  <div slot="tip">
                    <p>建议尺寸：1920*1080px</p>
                    <p>小于4M(支持jpg、gif、png、bmp)</p>
                  </div>
                </upload>
              </div>
              <div class="image_cropper">
                <div class="image_cropper_item">
                  <span>模糊程度</span>
                  <vh-slider
                    v-model="formPcImage.blurryDegree"
                    :max="10"
                    :disabled="!form.img"
                    style="width: 260px"
                  ></vh-slider>
                  <span class="wid_block">{{ formPcImage.blurryDegree }}</span>
                </div>
                <div class="image_cropper_item">
                  <span>背景亮度</span>
                  <vh-slider
                    v-model="formPcImage.lightDegree"
                    :max="20"
                    :disabled="!form.img"
                    style="width: 260px"
                  ></vh-slider>
                  <span class="wid_block">{{ formPcImage.lightDegree }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="链接" prop="url">
              <VhallInput
                v-model.trim="form.url"
                v-clearEmoij
                placeholder="请输入http://或https://开头的链接"
                :maxlength="200"
                autocomplete="off"
              ></VhallInput>
            </el-form-item>
            <el-form-item label="自动关闭">
              <!--{{alertType 0手动关闭 1自动关闭}}-->
              <div class="switch__box">
                <el-switch
                  v-model="alertType"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="autoUpText"
                ></el-switch>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="length152" v-preventReClick round @click="preSure">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--  预览页面 -->
        <div class="official-preview">
          <!-- 模拟开关 -->
          <div class="zdy--switch">
            <span
              :class="switchType === 'app' ? 'active' : ''"
              @click.prevent.stop="changeSwitch('app')"
            >
              手机预览
            </span>
            <span
              :class="switchType === 'pc' ? 'active' : ''"
              @click.prevent.stop="changeSwitch('pc')"
            >
              PC预览
            </span>
          </div>
          <!--PC预览,begin-->
          <div class="official-pc" v-show="switchType === 'pc'">
            <!-- status 控制是否阴影 -->
            <div class="v-preview-content">
              <!-- 开屏海报 -->
              <div class="hb_pc">
                <!-- <img class="hb_bg_default hb_bg"  src="../../../common/images/official/poster.png" alt="" /> -->
                <img class="hb_bg_default" src="../../../common/images/poster/pc-2.png" alt="" />
                <!-- 开启 并且有图-->
                <div class="pc-poster-wrap">
                  <el-image
                    v-show="status <= 0 && domain_pc_url"
                    class="hb_img v-poster-preview"
                    :src="form.img"
                    :fit="ImgsSize[formPcImage.imageCropMode - 1]"
                    :class="formPcImage.imageCropMode == 2 ? 'isCover' : ''"
                  ></el-image>
                  <el-image
                    v-show="!domain_pc_url"
                    class="hb_img v-poster-preview"
                    :src="pcPoster"
                    fit="cover"
                  ></el-image>
                </div>
                <!--  <el-button class="poster-btn" size="mini" round @click="closePoster">{{alertType > 0 ? '5s后关闭' : '关闭'}}</el-button> -->
                <div :class="['poster-btn', { five: alertType > 0 }]"></div>
              </div>
            </div>
          </div>
          <!--PC预览,end-->
          <!--手机预览，begin-->
          <div class="official-app" v-show="switchType === 'app'">
            <span class="title">开屏海报</span>
            <!-- 开屏海报 -->
            <div class="hb_app">
              <div class="poster-img">
                <el-image
                  v-show="status <= 0 && domain_wap_url"
                  class="domain_url"
                  :src="domain_wap_url"
                  :fit="ImgsSize[formWapImage.imageCropMode - 1]"
                  :class="formWapImage.imageCropMode == 2 ? 'isCover' : ''"
                ></el-image>
                <el-image
                  v-show="!domain_wap_url"
                  class="default"
                  :src="h5Poster"
                  fit="cover"
                ></el-image>
              </div>
              <el-button class="poster-btn" size="mini" round @click="closePoster">
                {{ alertType > 0 ? '5s 关闭' : '关闭' }}
              </el-button>
            </div>
          </div>
          <!--手机预览,end-->
        </div>
      </div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
    <!-- 裁剪组件 -->
    <cropper
      ref="posterCropper"
      @cropComplete="cropComplete"
      @resetUpload="resetUpload"
      :ratio="posterRadio"
    ></cropper>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import upload from '@/components/Upload/main';
  // import Env from '@/api/env.js';
  import beginPlay from '@/components/beginBtn';
  import {
    sessionOrLocal,
    parseImgOssQueryString,
    cropperImage,
    getImageQuery,
    ImgsSize
  } from '@/utils/utils';
  import cropper from '@/components/Cropper/index';
  import pcPoster from '../../../common/images/poster/pc-1.png';
  import h5Poster from '../../../common/images/poster/phone_poster_default@2x.png';
  export default {
    data() {
      return {
        pcPoster,
        h5Poster,
        ImgsSize,
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
        domain_url: '',
        m_domain_url: '',
        imgShowUrl: '',
        status: 1,
        alertType: null,
        switchType: 'app',
        showPoster: false,
        userId: '',
        posterRadio: 750 / 1344,
        formPcImage: {
          imageCropMode: 1,
          lightDegree: 10,
          blurryDegree: 0,
          backgroundSize: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }
        },
        formWapImage: {
          imageCropMode: 1,
          lightDegree: 10,
          blurryDegree: 0,
          backgroundSize: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }
        },
        form: {
          img: '',
          m_img: '',
          url: ''
        },
        formRules: {
          img: [{ required: true, message: '请上传PC图片', trigger: 'blur' }],
          m_img: [{ required: true, message: '请上传手机图片', trigger: 'blur' }],
          url: [
            { required: false, message: '请输入链接', trigger: 'blur' },
            // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入http://或https://开头的链接？',
              trigger: 'blur'
            },
            { maxlength: 200, message: '跳转链接最多可输入200个字符', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      pathUrl: function () {
        return `interacts/screen-imgs`;
      },
      domain_wap_url() {
        if (!this.form.m_img) return '';
        return `${
          this.form.m_img
        }?x-oss-process=image/crop,x_${this.formWapImage.backgroundSize.x.toFixed()},y_${this.formWapImage.backgroundSize.y.toFixed()},w_${this.formWapImage.backgroundSize.width.toFixed()},h_${this.formWapImage.backgroundSize.height.toFixed()}${
          this.formWapImage.blurryDegree > 0
            ? `,/blur,r_10,s_${this.formWapImage.blurryDegree * 2}`
            : ''
        },/bright,${(this.formWapImage.lightDegree - 10) * 5}&mode=${
          this.formWapImage.imageCropMode
        }`;
      },
      domain_pc_url() {
        if (!this.form.img) return '';
        return `${
          this.form.img
        }?x-oss-process=image/crop,x_${this.formPcImage.backgroundSize.x.toFixed()},y_${this.formPcImage.backgroundSize.y.toFixed()},w_${this.formPcImage.backgroundSize.width.toFixed()},h_${this.formPcImage.backgroundSize.height.toFixed()}${
          this.formPcImage.blurryDegree > 0
            ? `,/blur,r_10,s_${this.formPcImage.blurryDegree * 2}`
            : ''
        },/bright,${(this.formPcImage.lightDegree - 10) * 5}&mode=${
          this.formPcImage.imageCropMode
        }`;
      },
      activeTitle() {
        return this.status ? '开启后，观看直播前展示广告图' : '已开启，观看直播前展示广告图';
      },
      autoUpText() {
        return this.alertType > 0
          ? '已开启，5秒倒计时结束后自动关闭'
          : '开启后，5秒倒计时结束后自动关闭';
      }
    },
    watch: {
      domain_url: {
        handler(val) {
          if (val) {
            console.log(val, 'val');
            this.showPoster = true;
          }
        },
        immediate: true
      }
    },
    components: {
      PageTitle,
      upload,
      beginPlay,
      cropper
    },
    mounted() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getData();
    },
    methods: {
      async changeOpenStatus(e) {
        let status = this.status; // 目标
        this.status = Number(!status);
        let params = {
          webinar_id: this.$route.params.str,
          status: status //是否展示公众号/是否展示开屏海报：0开启1关闭
        };
        this.$fetch('setPosterInfo', params)
          .then(res => {
            this.$vhall_paas_port({
              k: status == 1 ? 100294 : 100293,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.$route.params.str,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              showClose: true,
              message: status > 0 ? '关闭成功' : '开启成功',
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.status = status;
            this.getData();
          })
          .catch(res => {
            this.$message({
              showClose: true,
              message: res.msg || (status > 0 ? '关闭失败' : '开启失败'),
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      closePoster() {
        this.showPoster = false;
      },
      changeSwitch(type) {
        this.switchType = type;
        /* if (this.domain_url) {
        if (this.switchType == 'pc') {
          this.resizePcImg(this.domain_url)
        } else {
          this.resizeImg(this.domain_url)
        }
      } */
      },
      // 图片裁剪数据
      handlerImageInfo(img) {
        if (cropperImage(img)) {
          let obj = parseImgOssQueryString(img);
          const { blur, crop } = obj;
          return {
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
        } else {
          return false;
        }
      },
      getData() {
        this.$fetch('getPosterInfo', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            if (res && res.code === 200) {
              // 图片解析
              if (res.data.img && res.data.m_img) {
                this.form.m_img = getImageQuery(res.data.m_img);
                this.form.img = getImageQuery(res.data.img);
                this.formWapImage = this.handlerImageInfo(res.data.m_img) || this.formWapImage;
                this.formPcImage = this.handlerImageInfo(res.data.img) || this.formPcImage;
              }
              this.form.url = res.data.url || '';
              // this.domain_url = res.data.img || '';
              // this.m_domain_url = res.data.m_img || '';
              /* if (this.domain_url) {
            if (this.switchType == 'pc') {
              this.resizePcImg(this.domain_url)
            } else {
              this.resizeImg(this.domain_url)
            }
          } */
              this.status =
                res.data.status === null || res.data.status === undefined || res.data.status === ''
                  ? 1
                  : res.data.status;
              this.alertType =
                res.data.shutdown_type === null ||
                res.data.shutdown_type === undefined ||
                res.data.shutdown_type === ''
                  ? 1
                  : res.data.shutdown_type;
            }
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '获取基本信息失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      preSure() {
        let params = {
          webinar_id: this.$route.params.str,
          status: this.status, //是否展示公众号/是否展示开屏海报：0开启1关闭
          img: this.$parseURL(this.domain_pc_url).path, // 开屏海报  PC图片地址
          m_img: this.$parseURL(this.domain_wap_url).path // 开屏海报  手机图片地址
          // img: this.form.img ? this.$parseURL(this.form.img).path : '', // 开屏海报  PC图片地址
          // m_img: this.form.m_img ? this.$parseURL(this.form.m_img).path : '' // 开屏海报  手机图片地址
        };
        let type = this.alertType;
        params.shutdown_type = type;
        params.url = this.form.url;
        this.$refs.officialForm.validate(valid => {
          if (valid) {
            this.$fetch('setPosterInfo', params)
              .then(res => {
                this.$vhall_paas_port({
                  k: type == 1 ? 100296 : 100295,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: this.$route.params.str,
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                this.$vhall_paas_port({
                  k: this.form.url ? 100297 : 100298,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: this.$route.params.str,
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                this.$message({
                  message: '保存成功',
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                this.getData();
              })
              .catch(res => {
                this.$message({
                  message: res.msg || '保存失败',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      cropComplete(cropperData, url, mode, index) {
        console.log(cropperData, url, '?????');
        if (index == 1) {
          // 手机
          this.formWapImage.backgroundSize = cropperData;
          this.formWapImage.imageCropMode = mode;
          this.form.m_img = url;
          // 触发验证
          this.$refs.officialForm.validateField('m_img');
        } else {
          this.formPcImage.backgroundSize = cropperData;
          this.formPcImage.imageCropMode = mode;
          this.form.img = url;
          // 触发验证
          this.$refs.officialForm.validateField('img');
        }
      },
      resetUpload(index) {
        let dom = document.querySelector(
          `#poster_${index == 1 ? 'wap' : 'pc'}_cropper .el-upload__input`
        );
        dom.click();
      },
      // pc上传成功
      uploadAdvSuccess(res, file) {
        console.log(res, file);
        // this.img = Env.staticLinkVo.uploadBaseUrl + res.data.file_url;
        if (res.data) {
          this.posterRadio = 192 / 108;
          this.$refs.posterCropper.showModel(res.data.domain_url, 2);
          // let domain_url = res.data.domain_url || ''
          // let file_url = res.data.file_url || '';
          // this.form.img = file_url;
          // this.domain_url = domain_url;
          /* if (this.domain_url) {
          if (this.switchType == 'pc') {
            this.resizePcImg(this.domain_url)
          } else {
            this.resizeImg(this.domain_url)
          }
        } */
        }
      },
      beforeUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isType) {
          this.$message({
            message: `图片只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `图片大小不能超过 4MB!`,
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
          message: `图片二维码图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      handleFileChange(file) {
        console.log(file);
        // this.handleuploadSuccess(file);
      },
      resizeImg(data) {
        let img = new Image();
        img.src = data;
        this.$nextTick(() => {
          let dom = document.querySelector('.poster-img img');
          if (dom) {
            img.onload = () => {
              let w = img.width;
              let h = img.height;
              let winWidth = 284;
              let winHeight = 520;
              if (w != h) {
                if (w > h) {
                  dom.style.width = '100%';
                  dom.style.height = 'auto';
                } else {
                  dom.style.width = 'auto';
                  dom.style.height = 'auto';
                }
              } else {
                dom.style.width = '100%';
                dom.style.height = 'auto';
              }
            };
          }
        });
      },
      deletePcImage() {
        this.form.img = '';
        this.formPcImage.blurryDegree = 0;
        this.formPcImage.lightDegree = 10;
      },
      // 删除
      deleteWapImage() {
        this.form.m_img = '';
        this.formWapImage.blurryDegree = 0;
        this.formWapImage.lightDegree = 10;
      },
      // wap
      wapUploadAdvSuccess(res, file) {
        console.log(res, file);
        // this.img = Env.staticLinkVo.uploadBaseUrl + res.data.file_url;
        if (res.data) {
          this.posterRadio = 750 / 1344;
          this.$refs.posterCropper.showModel(res.data.domain_url, 1);
          // let m_domain_url = res.data.domain_url || ''
          // let m_file_url = res.data.file_url || '';
          // this.form.m_img = m_file_url;
          // this.m_domain_url = m_domain_url;
          /* if (this.domain_url) {
          if (this.switchType == 'pc') {
            this.resizePcImg(this.domain_url)
          } else {
            this.resizeImg(this.domain_url)
          }
        } */
        }
      },
      beforePcUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isType) {
          this.$message({
            message: `图片只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `图片大小不能超过 4MB!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      pcUploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      pcUploadError(err, file, fileList) {
        console.log('pcUploadError', err, file, fileList);
        this.$message({
          message: `PC图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      pcUploadPreview(file) {
        console.log('pcUploadPreview', file);
      },
      handlePcFileChange(file) {
        console.log(file);
      }
      // resizePcImg(data) {
      //   let img = new Image()
      //   img.src = data
      //   this.$nextTick(() => {
      //     let dom = document.querySelector('.pc-poster-wrap .v-poster-preview')
      //     console.log(222, dom)
      //     if (dom) {
      //       img.onload = () => {
      //         let w = img.width
      //         let h = img.height
      //         console.log(12, w, h)
      //         let winWidth = 58
      //         let winHeight = 102
      //         if (w > h) {
      //           dom.style.width = '100%'
      //           dom.style.height = 'auto'
      //         } else if (w == h) {
      //           dom.style.width = '100%'
      //           dom.style.height = 'auto'
      //         } else {
      //           dom.style.width = 'auto'
      //           dom.style.height = 'auto'
      //         }
      //       }
      //     }
      //   })
      // }
    }
  };
</script>
<style lang="less" scoped>
  .switch__box {
    display: inline-block;
  }
  /deep/ .el-switch__label--right,
  /deep/ .el-switch__label--left {
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .offical-show {
    .isCover {
      /deep/ .el-image__inner {
        object-position: left top;
      }
    }
    .show-on {
      position: absolute;
      top: 42px;
      left: 200px;
      /deep/.el-switch__label.is-active {
        color: #1a1a1a;
      }
    }
    .form-phone {
      display: flex;
      padding: 48px 12px;
      background: #fff;
      min-height: 768px;
      border-radius: 4px;
    }
    .official-form {
      width: 482px;
      margin-right: 80px;
      /deep/.el-button {
        margin-top: 100px;
        // padding: 10px 45px;
      }
      /deep/.el-input {
        width: 360px;
      }
      /deep/.el-input__inner {
        padding-left: 12px;
      }
      /deep/.el-switch__label {
        color: #999;
      }
      /deep/.el-form-item {
        &:last-child {
          padding-top: 14px;
        }
      }
    }
    .v-preview-content {
      position: relative;
      /* img {
        width: 331px;
        height: 265px;
        display: block;
        margin: 110px auto 0;
      } */
      img {
        /* width: 400px;
        height: 242px;
        display: block;
        margin: 24px auto 0; */
        width: 442px;
        margin-top: -24px;
        margin-left: -18px;
      }
      .pc-poster-wrap {
        /* position: absolute;
        width: 56px;
        height: 102px;
        top: 50px;
        right: 16px;
        background: transparent; */
        /* 第二次 position: absolute;
        top: 24px;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        width: 106px;
        height: 195px; */
        /* position: absolute;
        top: 15px;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        width: 106px;
        height: 227px;
        border-bottom-right-radius: 22px; */
        position: absolute;
        top: 9px;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        border-bottom-right-radius: 22px;
        width: 400px;
        height: 226px;
      }
      .v-poster-preview {
        /* display: inline-block;
        position:absolute;
        top: 50%;
        left: 50%;
        max-width: 58px;
        max-height: 102px;
        transform: translate(-50%, -50%);
        margin-top: 0px;
        object-fit: cover; */
        /* 第二次 width: 100%;
        height: 100%;
        object-fit: scale-down;
        margin: 0 0; */
        width: 100%;
        height: 100%;
      }
      .v-code-preview {
        position: absolute;
        display: block;
        width: 76px;
        height: 76px;
        margin: 0;
        top: 75px;
        right: 134px;
        background: #ffffff;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
          margin: 0 0;
        }
      }
      .hb_pc {
        .poster-btn {
          position: absolute;
          right: 34px;
          top: 19px;
          width: 40px;
          height: 16px;
          /* right: 6px;
          top: 21px;
          width: 28px;
          height: 12px; */
          background: url('../../../common/images/poster/pc_poster_close@2x.png') no-repeat;
          background-size: 100% 100%;
          &.five {
            background: url('../../../common/images/poster/pc_poster_close5@2x.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    .official-app {
      width: 420px;
      height: 690px;
      margin-top: -24px;
      margin-left: -47px;
      background-image: url('../../../common/images/poster/phone-poster@2x.png');
      background-size: 100%;
      background-position: center;
      background-size: cover;
      position: relative;
      .title {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-weight: 400;
        color: #666666;
        background: #f7f7f7;
        position: absolute;
        top: 42px;
        left: 50%;
        transform: translateX(-50%);
      }
      .poster-img {
        position: absolute;
        display: block;
        margin: 0;
        right: calc(50% - 156px);
        top: 85px;
        text-align: center;
        width: 312px;
        height: 568px;
        border-bottom-right-radius: 26px;
        border-bottom-left-radius: 26px;
        background: rgba(0, 0, 0, 0.5);
        .domain_url {
          display: inline-block;
          position: absolute;
          /*  -o-object-fit: cover;
          object-fit: cover; */
          -o-object-fit: fill;
          object-fit: fill;
          max-height: 568px;
          border-bottom-right-radius: 26px;
          border-bottom-left-radius: 26px;
          right: calc(50% - 156px);
          width: 100%;
          height: 100%;
        }
        .default {
          display: inline-block;
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);
          // object-fit: cover;
          // max-width: 100%;
          // max-height: 100%;
          border-bottom-right-radius: 26px;
          border-bottom-left-radius: 26px;
        }
      }
      .poster-btn {
        position: absolute;
        right: calc(50% - 144px);
        top: 97px;
        width: 80px;
        height: 32px;
        background: #1a1a1a;
        border-radius: 25px;
        opacity: 0.65;
        padding: 0 0;
        margin: 0 0;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        border: 1px solid #1a1a1a;
        &:hover {
          border: 1px solid #1a1a1a;
        }
      }
    }
  }
  .img-box {
    width: 100%;
    height: 140px;
    /deep/.el-upload--picture-card {
      height: 130px;
    }
  }
  .image_cropper {
    width: 100%;
    // margin-top: 10px;
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
  /deep/.length152 {
    margin-top: 0px !important;
  }
  .el-card {
    height: 773px;
  }
  .el-form {
    margin-top: 55px;
  }
</style>
