<template>
  <el-dialog
    title="图片处理"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="480px">
    <div class="cropper_content" v-if="dialogVisible">
      <div class="cropper_content_box">
        <vue-cropper ref="cropper" class="cropper_img"
          :src="url"
          :aspect-ratio="ratio"
          :viewMode='1'
          :autoCropArea="1"
        ></vue-cropper>
      </div>
      <div class="cropper_content_btn">
        <div><vh-button size="medium" type='text' plain round v-preventReClick @click="resetCropper">重新上传</vh-button></div>
        <div>
          <vh-button  size="medium" type="primary" round v-preventReClick @click="cropperSure">确定</vh-button>
          <vh-button size="medium" plain round v-preventReClick @click="dialogVisible=false">取消</vh-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
 import vueCropper from 'vue-cropperjs'
 import 'cropperjs/dist/cropper.css';
 
export default {
  props: {
    // 比例
    ratio: {
      type: Number,
      default: 16/9
    }
  },
  data() {
    return {
      dialogVisible: false,
      cropperImgUrl: '',
      url: '',
      index: 1
    }
  },
  components: {
    vueCropper
  },
  methods: {
    showModel(url, index) {
      this.url = url;
      this.index = index;
      this.dialogVisible = true;
    },
    cropperSure() {
      this.cropperData = this.$refs.cropper.getData()
      // const fileObj = this.dataURLtoFile(this.cropperImgUrl)
      this.$emit('cropComplete', this.cropperData, this.url, this.index)
      this.url = '';
      this.dialogVisible = false;
    },
    resetCropper() {
      this.dialogVisible = false;
      this.url = '';
      this.$emit('deleteComplete', this.index)
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    width: 100%;
    &_box{
      width: 416px;
      height: 234px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      .cropper_img{
        height:234px;
        width: 416px;
        margin: 0 auto;
      }
    }
    &_btn {
      padding: 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
