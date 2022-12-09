<template>
  <div class="offical-show">
    <pageTitle pageTitle="公众号">
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
            <el-form-item label="二维码" prop="img">
              <div class="img-box">
                <upload
                  class="giftUpload"
                  v-model="form.img"
                  :domain_url="domain_url"
                  :saveData="{
                    path: pathUrl,
                    type: 'image'
                  }"
                  :on-success="uploadAdvSuccess"
                  :on-progress="uploadProcess"
                  :on-error="uploadError"
                  :on-preview="uploadPreview"
                  :widthImg="130"
                  :heightImg="130"
                  @handleFileChange="handleFileChange"
                  :before-upload="beforeUploadHnadler"
                  @delete="(form.img = ''), (domain_url = '')"
                >
                  <div slot="tip">
                    <p>建议尺寸：300*300px</p>
                    <p>小于2M(支持jpg、gif、png、bmp)</p>
                  </div>
                </upload>
              </div>
            </el-form-item>
            <el-form-item label="自动弹出">
              <!--{{alertType 0自动弹出；1-手动弹出}}-->
              <div class="switch__box">
                <el-switch
                  v-model="alertType"
                  :active-value="0"
                  :inactive-value="1"
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
              <!-- 公众号 -->
              <div class="gzh_app_mask_container" :style="{ opacity: alertType > 0 ? 0 : 1 }">
                <div class="gzh_pc_mask"></div>
                <!-- 扫码外层 -->
                <div class="gzh_img_layout">
                  <p><i class="iconfont-v3 saasicon_close"></i></p>
                  <div class="gzh_img v-code-preview">
                    <img :src="domain_url" alt="" v-if="domain_url" />
                    <img
                      src="../../../common/images/sys/default_code.jpeg"
                      alt=""
                      v-if="!domain_url"
                    />
                  </div>
                  <p class="gzh_txt">使用微信“扫一扫” 关注公众号</p>
                </div>
              </div>
              <div class="gzh_pc">
                <img
                  class="gzh_bg_default"
                  src="../../../common/images/official/pc@2x.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <!--PC预览,end-->
          <!--手机预览，begin-->
          <div
            :class="['official-app', { 'show-code': !(alertType > 0) }]"
            v-show="switchType === 'app'"
          >
            <span class="title">公众号</span>
            <!-- 公众号 -->
            <div class="gzh_app_mask_container" :style="{ opacity: alertType > 0 ? 0 : 1 }">
              <div class="gzh_app_mask"></div>
              <div class="gzh_app_close">
                <i class="iconfont-v3 saasicon_close"></i>
              </div>
              <div class="gzh_app">
                <div class="gzh_img_layout">
                  <div class="img-code v-code-preview app-preview">
                    <img :src="domain_url" alt="" v-if="domain_url" />
                    <img src="../../../common/images/sys/default_code.jpeg" v-if="!domain_url" />
                  </div>
                  <p class="gzh_txt">长按识别二维码</p>
                </div>
              </div>
              <!-- 非默认图，有文字
              <p class="gzh_txt" v-if="domain_url">扫码关注公众号</p> -->
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
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import upload from '@/components/Upload/main';
  import Env from '@/api/env.js';
  import beginPlay from '@/components/beginBtn';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    data() {
      return {
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
        domain_url: '',
        imgShowUrl: '',
        userId: '',
        status: null,
        alertType: null,
        switchType: 'app',
        showPoster: false,
        form: {
          img: '',
          url: ''
        },
        formRules: {
          img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
          url: [
            { required: false, message: '请输入跳转链接', trigger: 'blur' },
            // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入跳转链接',
              trigger: 'blur'
            },
            { maxlength: 200, message: '跳转链接最多可输入200个字符', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      pathUrl: function () {
        return `interacts/wechat-official-imgs`;
      },
      activeTitle() {
        return this.status
          ? '开启后，进入活动页面时展示公众号'
          : '已开启，进入活动页面时展示公众号';
      },
      autoUpText() {
        return this.alertType > 0
          ? '开启后，进入活动页公众号自动展示'
          : '已开启，进入活动页公众号自动展示';
      }
    },
    watch: {
      domain_url: {
        handler(val) {
          if (val) {
            this.showPoster = true;
          }
        },
        immediate: true
      }
    },
    components: {
      PageTitle,
      upload,
      beginPlay
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
        this.$fetch('setPublicInfo', params)
          .then(res => {
            this.$vhall_paas_port({
              k: status == 1 ? 100290 : 100289,
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
            // 重新获取数据
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
        if (this.domain_url) {
          if (this.switchType == 'pc') {
            this.resizePcImg(this.domain_url);
          } else {
            this.resizeImg(this.domain_url);
          }
        }
      },
      getData() {
        this.$fetch('getPublicInfo', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            if (res && res.code === 200) {
              this.form.img = res.data.img || '';
              this.form.url = res.data.url || '';
              this.domain_url = res.data.img || '';
              if (this.domain_url) {
                if (this.switchType == 'pc') {
                  this.resizePcImg(this.domain_url);
                } else {
                  this.resizeImg(this.domain_url);
                }
              }
              this.status =
                res.data.status === null || res.data.status === undefined || res.data.status === ''
                  ? 1
                  : res.data.status;
              this.alertType =
                res.data.alert_type === null ||
                res.data.alert_type === undefined ||
                res.data.alert_type === ''
                  ? 1
                  : res.data.alert_type;
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
          img: this.form.img ? this.$parseURL(this.form.img).path : '' // 公众号/开屏海报  图片地址
        };
        let type = this.alertType;
        params.alert_type = type; // 公众号-弹窗方式：0自动弹出 1手动弹出
        this.$refs.officialForm.validate(valid => {
          if (valid) {
            this.$fetch('setPublicInfo', params)
              .then(res => {
                this.$vhall_paas_port({
                  k: type == 1 ? 100292 : 100291,
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
      uploadAdvSuccess(res, file) {
        console.log(res, file);
        // this.img = Env.staticLinkVo.uploadBaseUrl + res.data.file_url;
        if (res.data) {
          let domain_url = res.data.domain_url || '';
          let file_url = res.data.file_url || '';
          this.form.img = file_url;
          this.domain_url = domain_url;
          if (this.domain_url) {
            if (this.switchType == 'pc') {
              this.resizePcImg(this.domain_url);
            } else {
              this.resizeImg(this.domain_url);
            }
          }
        }
        // 触发验证
        this.$refs.officialForm.validateField('img');
      },
      beforeUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message({
            message: `二维码图片只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `二维码图片大小不能超过 2MB!`,
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
          message: `二维码图片上传失败`,
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
      resizePcImg(data) {
        let img = new Image();
        img.src = data;
        this.$nextTick(() => {
          let dom = document.querySelector('.pc-poster-wrap .v-poster-preview');
          console.log(222, dom);
          if (dom) {
            img.onload = () => {
              let w = img.width;
              let h = img.height;
              console.log(12, w, h);
              let winWidth = 58;
              let winHeight = 102;
              if (w > h) {
                dom.style.width = '100%';
                dom.style.height = 'auto';
              } else if (w == h) {
                dom.style.width = '100%';
                dom.style.height = 'auto';
              } else {
                dom.style.width = 'auto';
                dom.style.height = 'auto';
              }
            };
          }
        });
      }
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
  .saasicon_shangchuan {
    font-size: 36px;
  }
  .offical-show {
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
        margin-bottom: 32px;
        &:last-child {
          padding-top: 8px;
        }
      }
    }
    .v-preview-content {
      position: relative;
      img {
        width: 400px;
        height: 230px;
        display: block;
        margin: 24px auto 0;
        border-radius: 4px;
      }
      .pc-poster-wrap {
        position: absolute;
        width: 56px;
        height: 102px;
        top: 50px;
        right: 16px;
        background: transparent;
      }
      .v-poster-preview {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 58px;
        max-height: 102px;
        transform: translate(-50%, -50%);
        margin-top: 0px;
        object-fit: cover;
      }
      /* .v-code-preview {
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
      } */
      .gzh_app_mask_container {
        transition: all 0.15s;
      }
      .gzh_pc_mask {
        position: absolute;
        display: block;
        margin: 0;
        right: 0;
        top: 14px;
        text-align: center;
        width: 400px;
        height: 250px;
        background: #000000;
        opacity: 0.6;
      }
      .gzh_img_layout {
        position: absolute;
        display: block;
        margin: 0;
        top: 69px;
        right: calc(50% - 62px);
        width: 124px;
        // height: 138px;
        background: #ffffff;
        border-radius: 4px;
        text-align: center;
        padding-bottom: 10px;
      }
      p {
        text-align: right;
        .saasicon_close {
          font-size: 5px;
          margin-right: 5px;
          margin-top: 5px;
        }
      }
      .v-code-preview {
        width: 98px;
        height: 98px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
          margin: 0 0;
        }
      }
      .gzh_txt {
        font-size: 12px;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 16px;
        text-align: center;
        width: 100%;
        padding: 0 10px;
      }
    }
    .official-app {
      width: 420px;
      height: 690px;
      margin-top: -24px;
      margin-left: -47px;
      background-image: url('../../../common/images/official/phone_yl_1@2x.png');
      background-size: 100%;
      background-position: center;
      &.show-code {
        background-image: url('../../../common/images/official/phone_yl@2x.png');
      }
      background-size: cover;
      position: relative;
      .title {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        background: #f7f7f7;
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
      }
      /*    .img-code{
        position: absolute;
        height: 142px;
        width: 142px;
        left: 53%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: transparent;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      .img-code-btn {
        position: absolute;
        height: 80px;
        width: 80px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      } */
      .poster-img {
        position: absolute;
        height: 520px;
        width: 284px;
        left: 22px;
        top: 78px;
        border-bottom-right-radius: 16px;
        border-bottom-left-radius: 16px;
        overflow: hidden;
        img {
          display: inline-block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          object-fit: cover;
          max-width: 284px;
          max-height: 520px;
        }
      }
      .poster-btn {
        position: absolute;
        right: 20px;
        top: 90px;
      }
      .gzh_app_mask_container {
        transition: all 0.15s;
      }
      .gzh_app_mask {
        position: absolute;
        display: block;
        margin: 0;
        /*  right: calc(50% - 155px);
        top: 56px;
        text-align: center;
        width: 310px;
        height: 566px; */
        right: calc(50% - 155px);
        top: 85px;
        text-align: center;
        width: 310px;
        height: 566px;
        background: #000000;
        border-radius: 0px 0px 26px 26px;
        opacity: 0.6;
      }
      .gzh_app_close {
        position: absolute;
        display: block;
        width: 16px;
        height: 16px;
        font-size: 16px;
        top: calc(50% - 105px);
        right: calc(50% - 81px);
        color: #ffffff;
      }
      .gzh_app {
        position: absolute;
        display: block;
        margin: 0;
        right: calc(50% - 81px);
        text-align: center;
        width: 162px;
        /* top: calc(50% - 95px);
        height: 191px; */
        top: calc(50% - 81px);
        height: 162px;
        background: transparent;
        border-radius: 4px;
      }
      .gzh_img_layout {
        background: #f7f7f7;
        border-radius: 4px;
        padding: 6px 6px;
        text-align: center;
      }
      .app-preview {
        width: 150px;
        height: 150px;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      .gzh_txt {
        font-size: 14px;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 20px;
        text-align: center;
        padding-top: 4px;
        // margin-top: 9px;
      }
    }
  }
  .img-box {
    width: 100%;
    height: 140px;
    /deep/.el-upload--picture-card {
      height: 130px;
    }
    // .picInco{
    //   height: 40px;
    // }
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
