<template>
  <div class="offical-show">
    <pageTitle :title="title"></pageTitle>
    <div class="show-on">
      <el-switch
        v-model="status"
        active-color="#ff4949"
        inactive-color="#ccc"
        :active-text="activeTitle"
        >
      </el-switch>
    </div>
    <el-card>
      <div class="form-phone">
        <div class="official-form">
          <el-form label-width="80px">
            <el-form-item label="二维码">
              <div class="img-box">
                <upload
                    class="giftUpload"
                    v-model="img"
                    :on-success="uploadAdvSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    @handleFileChange="handleFileChange"
                    :before-upload="beforeUploadHnadler"
                    >
                    <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
                  </upload>
              </div>
            </el-form-item>
            <el-form-item label="自动弹出" v-if="title==='公众号展示'">
            <el-switch
              v-model="alert_type"
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
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      img: '',
      url: '',
      status: false,
      alert_type: true
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
    getData() {
      let url = this.title === '公众号展示' ? 'getPublicInfo': 'getPosterInfo';
      this.$fetch(url, {webinar_id: '2345234523'}).then(res => {
        this.img = res.data.img;
        this.url = res.data.url || '';
        this.status = res.data.status === 0 ? true : false;
        this.alert_type = res.data.alert_type === 0 ? true : false;
        console.log(res.data, '111111111111');
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
      this.$fetch(url, obj).then(res => {
         console.log(res.data, '111111111111');
      });
    },
    uploadAdvSuccess(res, file) {
      console.log(res, file);
      this.img = URL.createObjectURL(file.raw);
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
