<template>
  <el-dialog
    title="添加封面背景"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="673px"
  >
    <el-scrollbar class="scrollbar">
      <div class="background-list">
        <div class="list-item">
          <upload
            v-model="imageUrl"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :restPic="handleChange"
            :before-upload="beforeUploadHnadler">
            <p slot="tip">最佳尺寸750*1624<br />支持jpg、png、bmp</p>
          </upload>
          <!-- <el-upload class="upload-demo" action="">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              最佳尺寸750*1624<br />支持jpg、png、bmp
            </div>
          </el-upload> -->
          <!-- <img src="@/common/images/logo.png" alt="" /> -->
        </div>
        <div class="list-item list-imgs is-success" v-for="(item, index) in fileList" :key="index">
          <label class="img-tangle" v-if="item.isChecked">
            <i class="el-icon-check"></i>
          </label>
          <img :src="item.url" alt="" @click="choseBackground(item)"/>
        </div>
      </div>
    </el-scrollbar>
    <div class="sureChose">
      <el-button type="primary" @click="dialogVisible = false" size="medium"
        >选择</el-button
      >
      <el-button @click="dialogVisible = false" size="medium">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      dialogVisible: false,
      advertisement: {},
      imageUrl: '',
      fileList: [
        {
          isChecked: true,
          name: '1',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name:'2',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
    };
  },
  components: {
    upload
  },
  methods: {
    choseBackground(items) {
      this.fileList.map(item => {
        item.isChecked = false;
        items.isChecked = true;
      });
    },
    handleuploadSuccess(res, file) {
      console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
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
    handleChange(file) {
      this.handleuploadSuccess(file);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  padding: 20px 22px 20px 20px;
}
/deep/.el-dialog__header {
  padding: 20px 24px 10px;
}
/deep/.el-dialog__headerbtn {
  right: 35px;
}
/deep/.el-dialog {
  padding-bottom: 60px;
}
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
.sureChose {
  margin-top: 24px;
  float: right;
  /deep/.el-button {
    padding: 10px 33px;
    border-radius: 20px;
  }
}
</style>

