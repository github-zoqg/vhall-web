<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="480px">
    <div class="cropper_content">
      <div class="cropper_content_box" :style="{ height: imgHeight + 'px'}">
        <vue-cropper ref="cropper" class="cropper_img"
          :aspect-ratio="1"
          :src="option.src"
        ></vue-cropper>
      </div>
      <div class="cropper_content_btn">
        <div><vh-button size="medium" round v-preventReClick @click="resetCropper">重新上传</vh-button></div>
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
export default {
  props: {
    imgHeight: {
      type: Number,
      default: 234
    }
  },
  data() {
    return {
      dialogVisible: false,
      cropperImgUrl: '',
      option: {
        style: {
          'height': `${this.imgHeight}px`,
          'object-fit': 'scale-down'
        },
        src: ''
      }
    }
  },
  components: {
    vueCropper
  },
  methods: {
    showModel(url, index) {
      this.dialogVisible = true;
      this.option.src = url;
      this.option.index = index;
    },
    cropperSure() {
      this.cropperData = this.$refs.cropper.getData()
      // const fileObj = this.dataURLtoFile(this.cropperImgUrl)
      this.$emit('cropComplete', this.cropperData, this.option)
      this.dialogVisible = false;
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    &_box{
      width: 100%;
      .cropper_img{
        height: 100%;
        width: 100%;
      }
    }
    &_btn {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
