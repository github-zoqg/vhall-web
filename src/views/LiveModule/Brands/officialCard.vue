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
          <el-form label-width="120px">
            <el-form-item label="二维码">
              <div class="img-box">
                <upload
                  class="giftUpload"
                  v-model="img"
                  :saveData="{
                     path: 'webinars/img_url',
                     type: 'image',
                  }"
                  :on-success="uploadAdvSuccess"
                  :on-progress="uploadProcess"
                  :on-error="uploadError"
                  :on-preview="uploadPreview"
                  @handleFileChange="handleFileChange"
                  :before-upload="beforeUploadHnadler"
                  @delete="img = ''">
                  <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
                </upload>
              </div>
            </el-form-item>
            <el-form-item :label="title">
              <el-switch
                v-model="status"
                :active-value="1"
                :inactive-value="0"
                active-color="#ff4949"
                inactive-color="#ccc"
                :active-text="activeTitle"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="自动弹出" v-if="title==='公众号展示'">
              <el-switch
                v-model="alert_type"
                :active-value="1"
                :inactive-value="0"
                active-color="#ff4949"
                inactive-color="#ccc"
                :active-text="activeTitle"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="海报链接" v-else>
              <el-input v-model="url" placeholder="请输入跳转链接"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round @click="preSure">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="official-phone">
          <div class="img-code" v-if="img">
            <img :src="img" alt="">
          </div>
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
      url: '',
      imgShowUrl: '',
      status: 0,
      alert_type: 0
    };
  },
  computed: {
    title() {
      return this.$route.meta.title === '品牌—开屏海报' ? '开屏海报' : '公众号展示';
    },
    activeTitle(){
      if (this.title==='公众号展示') {
        return this.status ? '已开启，进入活动页面时展示公众号' : '开启后，进入活动页面时展示公众号';
      } else {
        return this.status ? '已开启，观看直播前展示广告图' : '开启后，观看直播前展示广告图';
      }
    },
    autoUpText(){
      if(this.alert_type){
        return '已开启，进入活动页公众中自动展示';
      }else{
        return "开启后，进入活动页公众中自动展示";
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
   /* // 修改公众号状态
    updateSwitch() {
      let status = this.status; // 目标
      this.status = Number(status) === 1 ? 1 : 0;
      this.$fetch('setPosterInfo', {
        webinar_id: this.$route.params.str,
        status: status,
        img: 'afs',
        alert_type: this.alert_type || 0
      }).then(res => {
        if (res && res.code === 200 && status) {
          this.$message.success('开启成功');
          this.status = 1;
          this.getData();
        }else if (res && res.code === 200 && !status) {
          alert(1);
          this.$message.success('关闭成功');
          this.status = 0;
          this.getData();
        } else {
          this.$message.error(res.msg || status ? `开启失败` : `关闭失败`);
        }
      }).catch(er => {
        console.log(er);
        this.$message.error(status ? `开启失败，` : `关闭失败`);
      });
    },*/
    getData() {
      this.$fetch(this.title === '公众号展示' ? 'getPublicInfo': 'getPosterInfo', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if(res && res.code === 200) {
          this.img = res.data.img;
          this.url = res.data.url || '';
          this.status = res.data.status;
          this.alert_type = res.data.alert_type;
        }
      }).catch(e => {
        console.log(e);
      });
    },
    preSure() {
      let obj = {};
      let url = '';
      obj.img = this.img;
      obj.status = this.status ? 0 : 1;
      if (this.title === '公众号展示') {
        obj.alert_type = this.alert_type ? 0 : 1;
        url = 'setPublicInfo';
      } else {
        obj.url = this.url;
        url = 'setPosterInfo';
      }
      obj.webinar_id = this.$route.params.str;
      console.log(obj);
      this.$fetch(url, obj).then(res => {
        if(res && res.code === 200) {
          this.$message.success('保存成功');
          this.getData();
        } else {
          this.$message.error(res.msg || '保存失败');
        }
      });
    },
    uploadAdvSuccess(res, file) {
      console.log(res, file);
      this.img = Env.staticLinkVo.uploadBaseUrl + res.data.file_url;
      // 触发验证
      // this.$refs.signSetForm.validateField('img');
    },
    beforeUploadHnadler(file){
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
      this.$message.error(`图片上传失败`);
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
    .official-phone{
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
    }
  }
</style>
