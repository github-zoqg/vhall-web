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
      <el-card>
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
                  <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
                </upload>
              </div>
            </el-form-item>
            <el-form-item label="链接" v-if="title !== '公众号展示'" prop="url">
              <el-input v-model="form.url" placeholder="请输入跳转链接"></el-input>
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
              <el-button type="primary" round @click="preSure">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--  预览页面 -->
        <div class="official-preview">
          <!-- 模拟开关 -->
          <div class="zdy--switch">
            <span :class="switchType === 'pc' ? 'active' : ''" @click.prevent.stop="changeSwitch('pc')">PC预览</span>
            <span :class="switchType === 'app' ? 'active' : ''"  @click.prevent.stop="changeSwitch('app')">手机预览</span>
          </div>
          <!--PC预览,begin-->
          <div class="official-pc" v-show="switchType === 'pc'">
            <div class="v-preview-content" :style="status > 0 ? 'opacity: 0.2;' : ''">
                <img src="//t-alistatic01.e.vhall.com/static/images/advertising/pcCodeAtuo.png" alt="" v-if="!(alertType > 0)" />
                <img src="//t-alistatic01.e.vhall.com/static/images/advertising/pcCode.png" alt="" v-if="alertType > 0" />
                <img :src="domain_url" class="v-code-preview" alt="" v-if="title==='公众号展示' && domain_url && Number(status) === 0 && !(alertType > 0)" />
            </div>
            <div class="v-preview-content" v-if="title!=='公众号展示' && domain_url && Number(status) === 0">
              <img src="../../../common/images/official/poster.png" alt="" />
              <img :src="domain_url + '?x-oss-process=image/resize,m_fill,w_160,h_160,limit_0'" alt="" class="v-poster-preview" v-if="domain_url && !(this.status > 0)">
            </div>
          </div>
          <!--PC预览,end-->
          <!--手机预览，begin-->
          <div class="official-app" v-show="switchType === 'app'">
            <div class="img-code" v-if="title==='公众号展示' && domain_url && Number(status) === 0 && !(alertType > 0)">
              <img :src="domain_url" alt="">
            </div>
            <div class="img-code-btn" v-if="title==='公众号展示' && domain_url && Number(status) === 0 && alertType > 0">
              <img src="../../../common/images/official/mobileCode_btn.png" alt="" />
            </div>

            <div class="poster-img" v-if="title!=='公众号展示' && domain_url && Number(status) === 0">
              <img :src="domain_url" alt="">
            </div>
            <el-button class="poster-btn" size="mini" round v-if="title!=='公众号展示' && domain_url && Number(status) === 0">{{alertType > 0 ? '5s后关闭' : '关闭'}}</el-button>
          </div>
           <!--手机预览,end-->
        </div>
      </div>
    </el-card>
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
      switchType: 'pc',
      form: {
        url: ''
      },
      formRules: {
        url: [
          { required: false, message: '请填写标志链接', trigger: 'blur'},
          { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
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
  components: {
    PageTitle,
    upload
  },
  mounted() {
    this.getData();
  },
  methods: {
    changeSwitch(type) {
      this.switchType = type;
    },
    getData() {
      this.$fetch(this.title === '公众号展示' ? 'getPublicInfo': 'getPosterInfo', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if(res && res.code === 200) {
          this.img = res.data.img || '';
          this.url = res.data.url || '';
          this.domain_url = res.data.img || '';
          this.status = res.data.status === null || res.data.status === undefined || res.data.status === '' ? 1 : res.data.status;
          if (this.title === '公众号展示') {
            this.alertType = res.data.alert_type === null || res.data.alert_type === undefined || res.data.alert_type === '' ? 1 : res.data.alert_type;
          } else {
            this.alertType = res.data.shutdown_type === null || res.data.shutdown_type === undefined || res.data.shutdown_type === '' ? 1 : res.data.shutdown_type;
          }
        }
      }).catch(e => {
        console.log(e);
      });
    },
    preSure() {
      let url = '';
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
        params.url = this.url;
        url = 'setPosterInfo';
      }
      this.$refs.officialForm.validate((valid) => {
        if (valid) {
          this.$fetch(url, this.$params(params)).then(res => {
            if(res && res.code === 200) {
              this.$message.success('保存成功');
              this.getData();
            } else {
              this.$message.error(res.msg || '保存失败');
            }
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
        this.$message.error(`${this.title!=='公众号展示' ? '图片' : '二维码图片'}只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`${this.title!=='公众号展示' ? '图片' : '二维码图片'}大小不能超过 2MB!`);
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`${this.title!=='公众号展示' ? '图片' : '二维码图片'}上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
      // this.handleuploadSuccess(file);
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
    }
    .official-form{
      width: 450px;
      margin-right: 200px;
      /deep/.el-button{
        margin-top: 100px;
        // padding: 10px 45px;
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
      .v-poster-preview {
        position: absolute;
        width: 58px;
        height: 102px;
        top: -61px;
        right: 16px;
      }
      .v-code-preview {
        position: absolute;
        display: block;
        width: 76px;
        height: 76px;
        margin: 0;
        top: 75px;
        right: 134px;
      }
    }
    .official-app{
      width: 326px;
      height: 631px;
      background-image: url('../../../common/images/h5-show-phone.png');
      background-size: cover;
      margin-top: -15px;
      position: relative;
      .img-code{
        position: absolute;
        height: 142px;
        width: 142px;
        left: 50%;
        top: 50%;
        border: 1px solid #ccc;
        transform: translate(-50%, -50%);
        img{
          width: 142px;
          height: 142px;
        }
      }
      .img-code-btn {
        position: absolute;
        height: 80px;
        width: 80px;
        right: 20px;
        top: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .poster-img {
        position: absolute;
        height: 142px;
        width: 142px;
        left: 95px;
        top: 150px;
        border: 1px solid #ccc;
        transform: translate(-50%, -50%);
        img {
          width: 291px;
          height: 490px;
        }
      }
      .poster-btn {
        position: absolute;
        right: 20px;
        top: 90px;
      }
    }
  }
</style>
