<template>
  <div class="offical-show">
    <pageTitle :title="title"></pageTitle>
    <!--<div class="show-on">
      <el-switch
        v-model="status"
        :active-value="1"
        :inactive-value="0"
        active-color="#ff4949"
        inactive-color="#ccc"
        :active-text="activeTitle"
        @change="updateSwitch"
      >
      </el-switch>
    </div>-->
   <!-- <div :class="!status ? 'pre&#45;&#45;full-mask' : ''">
      <div class="pre&#45;&#45;full-cover" v-show="!status"></div>-->
      <div class="form-phone">
        <div class="official-form">
          <el-form label-width="120px" :model="form" ref="officialForm" :rules="formRules" >
            <el-form-item :label="title!=='公众号展示' ? '图片' : '二维码'">
              <div class="img-box">
                <upload
                  class="giftUpload"
                  v-model="img"
                  :domain_url="domain_url"
                  :saveData="{
                     path: pathUrl,
                     type: 'image',
                  }"
                  :on-success="uploadAdvSuccess"
                  :on-progress="uploadProcess"
                  :on-error="uploadError"
                  :on-preview="uploadPreview"
                  @handleFileChange="handleFileChange"
                  :before-upload="beforeUploadHnadler"
                  @delete="img = '', domain_url = ''">
                  <div slot="tip">
                    <p>建议尺寸：{{title !== '公众号展示' ? '750*1334' : '160*160'}}px</p>
                    <p>小于2M(支持jpg、gif、png、bmp)</p>
                  </div>
                </upload>
              </div>
            </el-form-item>
            <el-form-item label="链接" v-if="title !== '公众号展示'" prop="url">
              <VhallInput v-model="form.url" placeholder="请输入跳转链接" :maxlength="200" autocomplete="off" show-word-limit></VhallInput>
            </el-form-item>
            <el-form-item :label="title">
              <!--{{status  - 0开启，1关闭}}-->
              <div class="switch__box">
                <el-switch
                  v-model="status"
                  :active-value="0"
                  :inactive-value="1"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  @change="changeOpenStatus"
                  :active-text="activeTitle"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item label="自动弹出" v-if="title==='公众号展示'">
              <!--{{alertType 0自动弹出；1-手动弹出}}-->
              <div class="switch__box">
                <el-switch
                  v-model="alertType"
                  :active-value="0"
                  :inactive-value="1"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="autoUpText"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item label="自动关闭" v-else>
              <!--{{alertType 0手动关闭 1自动关闭}}-->
              <div class="switch__box">
                <el-switch
                  v-model="alertType"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="autoUpText"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="length152" v-preventReClick  round @click="preSure">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--  预览页面 -->
        <div class="official-preview">
          <!-- 模拟开关 -->
          <div class="zdy--switch">
            <span :class="switchType === 'app' ? 'active' : ''"  @click.prevent.stop="changeSwitch('app')">手机预览</span>
            <span :class="switchType === 'pc' ? 'active' : ''" @click.prevent.stop="changeSwitch('pc')">PC预览</span>
          </div>
          <!--PC预览,begin-->
          <div class="official-pc" v-show="switchType === 'pc'">
            <!-- status 控制是否阴影 -->
            <div class="v-preview-content">
               <!-- 公众号 -->
               <div class="gzh_pc" v-if="title === '公众号展示'">
                 <img class="gzh_bg_default" src="//t-alistatic01.e.vhall.com/static/images/advertising/pcCode.png" alt="" v-if="alertType > 0"/>
                 <img class="gzh_bg" src="//t-alistatic01.e.vhall.com/static/images/advertising/pcCodeAtuo.png" alt="" v-if="!(alertType > 0)"/>
                 <div class="gzh_img v-code-preview" v-if="domain_url && !(alertType > 0)">
                   <img :src="domain_url" alt="" />
                 </div>
               </div>
              <!-- 开屏海报 -->
              <div class="hb_pc" v-if="title !== '公众号展示'">
                <img class="hb_bg_default hb_bg"  src="../../../common/images/official/poster.png" alt="" />
                <div class="pc-poster-wrap"  v-if="domain_url && status <= 0">
                  <img class="hb_img v-poster-preview" :src="domain_url" alt=""/>
                </div>
              </div>
            </div>
          </div>
          <!--PC预览,end-->
          <!--手机预览，begin-->
          <div :class="['official-app', {'null-page' : title !== '公众号展示'}]" v-show="switchType === 'app'">
            <span class="title">{{title === '公众号展示' ? '公众号展示' : '开屏海报展示'}}</span>
            <!-- 公众号 -->
            <div class="gzh_app" v-if="title === '公众号展示'">
              <div class="img-code v-code-preview app-preview" v-if="domain_url && !(alertType > 0)">
                <img :src="domain_url" alt="">
              </div>
            </div>
            <!-- 开屏海报 -->
            <div class="hb_app" v-if="title === '开屏海报' && status <= 0 && showPoster">
              <div class="poster-img" v-show="domain_url">
                <img :src="domain_url" alt="">
              </div>
              <el-button v-show="domain_url" class="poster-btn" size="mini" round @click="closePoster">{{alertType > 0 ? '5s后关闭' : '关闭'}}</el-button>
            </div>
          </div>
          <!--手机预览,end-->
        </div>
      </div>
  <!--  </div>-->
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import Env from '@/api/env.js';
export default {
  data() {
    return {
      img: '',
      domain_url: '',
      imgShowUrl: '',
      status: null,
      alertType: null,
      switchType: 'app',
      showPoster: false,
      form: {
        url: ''
      },
      formRules: {
        url: [
          { required: false, message: '请输入跳转链接', trigger: 'blur'},
          // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入跳转链接' , trigger: 'blur'},
          { maxlength: 200, message: '跳转链接最多可输入200个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    pathUrl: function() {
      return this.title==='公众号展示' ? `interacts/wechat-official-imgs` : `interacts/screen-imgs`;
    },
    title() {
      return this.$route.meta.title === '开屏海报' ? '开屏海报' : '公众号展示';
    },
    activeTitle(){
      if (this.title==='公众号展示') {
        return this.status ? '开启后，进入活动页面时展示公众号' : '已开启，进入活动页面时展示公众号';
      } else {
        return this.status ? '开启后，观看直播前展示广告图' : '已开启，观看直播前展示广告图';
      }
    },
    autoUpText(){
      if (this.title==='公众号展示') {
        return this.alertType > 0 ? '开启后，进入活动页公众号自动展示' : '已开启，进入活动页公众号自动展示';
      } else {
        return this.alertType > 0 ? '已开启，5秒倒计时结束后自动关闭' : '开启后，5秒倒计时结束后自动关闭';
      }
    }
  },
  watch: {
    domain_url: {
      handler (val) {
        if (val) {
          this.showPoster = true
        }
      },
      immediate: true
    }
  },
  components: {
    PageTitle,
    upload
  },
  mounted() {
    this.getData();
  },
  methods: {
    changeOpenStatus (e) {
      if (!e) {
        this.showPoster = true
      }
    },
    closePoster () {
      this.showPoster = false
    },
    changeSwitch(type) {
      this.switchType = type;
      if (this.domain_url) {
        if (this.switchType == 'pc') {
          this.resizePcImg(this.domain_url)
        } else {
          this.resizeImg(this.domain_url)
        }
      }
    },
    getData() {
      this.$fetch(this.title === '公众号展示' ? 'getPublicInfo': 'getPosterInfo', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if(res && res.code === 200) {
          this.img = res.data.img || '';
          this.form.url = res.data.url || '';
          this.domain_url = res.data.img || '';
          if (this.domain_url) {
            if (this.switchType == 'pc') {
              this.resizePcImg(this.domain_url)
            } else {
              this.resizeImg(this.domain_url)
            }
          }
          this.status = res.data.status === null || res.data.status === undefined || res.data.status === '' ? 1 : res.data.status;
          if (this.title === '公众号展示') {
            this.alertType = res.data.alert_type === null || res.data.alert_type === undefined || res.data.alert_type === '' ? 1 : res.data.alert_type;
          } else {
            this.alertType = res.data.shutdown_type === null || res.data.shutdown_type === undefined || res.data.shutdown_type === '' ? 1 : res.data.shutdown_type;
          }
        }
      }).catch(res => {
        console.log(res);
        this.$message({
          message:  res.msg || '获取基本信息失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    preSure() {
      let url = '';
      if (Number(this.status === 0) && !this.img) {
        this.$message({
          message: `${this.title === '公众号展示' ? ' 请上传二维码图片' : '请上传图片'}`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      let params = {
        webinar_id: this.$route.params.str,
        status: this.status, //是否展示公众号/是否展示开屏海报：0开启1关闭
        img: this.img ? this.$parseURL(this.img).path : '' // 公众号/开屏海报  图片地址
      };
      let type = this.alertType;
      if (this.title === '公众号展示') {
        params.alert_type = type; // 公众号-弹窗方式：0自动弹出 1手动弹出
        url = 'setPublicInfo';
      } else {
        params.shutdown_type = type;
        params.url = this.form.url;
        url = 'setPosterInfo';
      }
      this.$refs.officialForm.validate((valid) => {
        if (valid) {
          this.$fetch(url, this.$params(params)).then(res => {
            this.$message({
              message: '保存成功',
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.getData();
          }).catch(res => {
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
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.img = file_url;
        this.domain_url = domain_url;
        if (this.domain_url) {
          if (this.switchType == 'pc') {
            this.resizePcImg(this.domain_url)
          } else {
            this.resizeImg(this.domain_url)
          }
        }
      }
    },
    beforeUploadHnadler(file){
      console.log(file);
     const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message:  `${this.title!=='公众号展示' ? '图片' : '二维码图片'}只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `${this.title!=='公众号展示' ? '图片' : '二维码图片'}大小不能超过 2MB!`,
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
        message: `${this.title!=='公众号展示' ? '图片' : '二维码图片'}上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
      // this.handleuploadSuccess(file);
    },
    resizeImg (data) {
      let img = new Image()
      img.src = data
      this.$nextTick(() => {
        let dom = document.querySelector('.poster-img img')
        if (dom) {
          img.onload = () => {
            let w = img.width
            let h = img.height
            let winWidth = 284
            let winHeight = 520
            if (w != h) {
              if (w > h) {
                dom.style.width = '100%'
                dom.style.height = 'auto'
              } else {
                dom.style.width = 'auto'
                dom.style.height = 'auto'
              }
            } else {
              dom.style.width = '100%'
              dom.style.height = 'auto'
            }
          }
        }
      })
    },
    resizePcImg (data) {
      let img = new Image()
      img.src = data
      this.$nextTick(() => {
        let dom = document.querySelector('.pc-poster-wrap .v-poster-preview')
        console.log(222, dom)
        if (dom) {
          img.onload = () => {
            let w = img.width
            let h = img.height
            console.log(12, w, h)
            let winWidth = 58
            let winHeight = 102
            if (w > h) {
              dom.style.width = '100%'
              dom.style.height = 'auto'
            } else if (w == h) {
              dom.style.width = '100%'
              dom.style.height = 'auto'
            } else {
              dom.style.width = 'auto'
              dom.style.height = 'auto'
            }
          }
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .offical-show{
    /deep/.el-switch__label.is-active {
        color: #1A1A1A;
    }
    .show-on{
      position: absolute;
      top: 42px;
      left: 200px;
      /deep/.el-switch__label.is-active{
        color: #1a1a1a;
      }
    }
    .form-phone{
      display: flex;
      padding: 30px 12px;
      background: #fff;
      min-height: 730px;
    }
    .official-form{
      width: 482px;
      margin-right: 80px;
      /deep/.el-button{
        margin-top: 100px;
        // padding: 10px 45px;
      }
      /deep/.el-input {
        width: 360px;
      }
      /deep/.el-switch__label{
        color: #999;
      }
    }
    .v-preview-content {
      position: relative;
      img {
        width: 331px;
        height: 265px;
        display: block;
        margin: 110px auto 0;
      }
      .pc-poster-wrap{
        position: absolute;
        width: 56px;
        height: 102px;
        top: 50px;
        right: 16px;
        background: transparent;
      }
      .v-poster-preview {
        display: inline-block;
        position:absolute;
        top: 50%;
        left: 50%;
        max-width: 58px;
        max-height: 102px;
        transform: translate(-50%, -50%);
        margin-top: 0px;
        object-fit: cover;
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
    }
    .official-app{
      width: 326px;
      height: 631px;
      background-image: url('../../../common/images/official/phone-model.png');
      background-size: 100%;
      background-position: center;
      &.null-page {
        background-image: url('../../../common/images/official/phone-model.png');
      }
      background-size: cover;
      margin-top: -15px;
      position: relative;
      .title{
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #555;
        background: #f7f7f7;
        position: absolute;
        top: 38px;
        left: 50%;
        transform: translateX(-50%);
      }
      .img-code{
        position: absolute;
        height: 142px;
        width: 142px;
        left: 53%;
        top: 50%;
        /*border: 1px solid #ccc;*/
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
      }
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
          object-fit:cover; 
          max-width: 284px;
          max-height: 520px;
        }
      }
      .poster-btn {
        position: absolute;
        right: 20px;
        top: 90px;
      }
    }
  }
  .img-box{
    width: 100%;
    height: 135px;
  }
  /deep/.length152{
    margin-top: 0px!important;
  }
  .el-card{
    height: 773px;
  }
  .el-form{
    margin-top: 70px;
  }
</style>
