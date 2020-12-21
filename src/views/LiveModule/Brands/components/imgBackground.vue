<template>
  <VhallDialog
    title="添加封面背景"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="700px"
  >
    <el-scrollbar class="scrollbar">
      <div class="background-list">
        <div class="list-item" @click.stop="domain_url && choseBackground(-1)">
          <upload
            v-model="imageUrl"
            :domain_url="domain_url"
            :saveData="{
               path: 'interacts/invite-card-imgs',
               type: 'image',
            }"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :restPic="true"
            @handleFileChange="handleFileChange"
            :before-upload="beforeUploadHnadler">
            <p slot="tip">最佳尺寸750*1624<br />支持jpg、png、bmp</p>
          </upload>
          <label class="img-tangle" v-show="isType==0">
            <i class="el-icon-check"></i>
          </label>
        </div>
        <div class="list-item list-imgs is-success" v-for="(item, index) in fileList" :key="index">
          <label class="img-tangle" v-if="isType === index + 1">
            <i class="el-icon-check"></i>
          </label>
          <img :src="item" alt="" @click="choseBackground(index)"/>
        </div>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button round @click.prevent.stop="dialogVisible = false">取 消</el-button>
      <el-button round type="primary" @click.prevent.stop="changePic">选 择</el-button>
    </div>
  </VhallDialog>
</template>
<script>
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      dialogVisible: false,
      advertisement: {},
      imageUrl: '',
      domain_url: '',
      isType: 1,
      fileList: ['https://t-alistatic01.e.vhall.com/static/images/invitation/bg_1@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_2@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_3@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_4@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_5@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_6@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_7@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_8@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0', 'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_9@2x.png?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0'],
    };
  },
  components: {
    upload
  },
  props: ['url'],
  watch: {
   dialogVisible() {
     if (this.dialogVisible) {
        this.domain_url  = this.url || '';
        this.imageUrl = this.url;
        if (this.imageUrl) {
          this.isType = 0;
        }
     }
   }
  },
  methods: {
    choseBackground(index) {
      this.isType = index + 1;
    },
    changePic() {
      this.$emit('onChangePic', this.isType, this.imageUrl, this.domain_url);
      this.dialogVisible = false;
    },
    handleuploadSuccess(res, file) {
      console.log(res, file);
      // this.imageUrl = URL.createObjectURL(file.raw);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.imageUrl = file_url;
        this.domain_url = domain_url;
        this.isType = 0;
      }
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
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
    }
  }
};
</script>
<style lang="less" scoped>
.background-list {
  // border: 1px solid #ccc;
  max-height: 300px;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .list-item {
    width: 140px;
    height: 140px;
    margin: 8px;
    border: 1px solid #ccc;
    position: relative;
    .img-tangle{
      position: absolute;
      right: 0;
      top:0;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right-color: #FB3A32;
      border-top-color: #FB3A32;
      i{
        color:#fff;
        position: absolute;
        top: -8px;
        right:-11px;
        font-size: 10px;
      }
    }
    img {
      width: 100%;
    }
    .upload-demo {
      margin-top: 20px;
      i {
        font-size: 60px;
      }
    }
  }
  .list-imgs{
    position: relative;
    .img-tangle{
      position: absolute;
      right: 0;
      top:0;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right-color: #FB3A32;
      border-top-color: #FB3A32;
      i{
        color:#fff;
        position: absolute;
        top: -8px;
        right:-11px;
        font-size: 10px;
      }
    }
  }
}
/deep/.el-dialog__footer{
  text-align: left;
}
.dialog-footer {
  padding-top: 24px;
  // float: left;
}
</style>

