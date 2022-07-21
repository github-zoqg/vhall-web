<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="480px">
    <div class="cropper_content">
      <div class="cropper_content_box">
        <vue-cropper ref="cropper" class="cropper_img"
          :aspect-ratio="1"
          :src="option.src"
        ></vue-cropper>
      </div>
      <div class="cropper_content_btn">
        <vh-button  size="medium" type="primary" round v-preventReClick @click="cropperSure">确定</vh-button>
        <vh-button size="medium" round v-preventReClick @click="resetCropper">取消</vh-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
 import vueCropper from 'vue-cropperjs'
export default {
  props: ['cropperDom'],
  data() {
    return {
      dialogVisible: false,
      cropperImgUrl: '',
      option: {
        style: {
          'height': '234px',
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
    showModel(obj) {
      console.log(obj, '???1111233456')
      this.dialogVisible = true;
      this.option.src = obj;
    },
    cropperSure() {
      this.cropperImgUrl = this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        const formData = new FormData();
        let files = new window.File([blob], '12345', {
            type: blob.type
          })
        console.log(blob)
        formData.append('croppedImage', files, 'example.png');

        this.$fetch('uploadImage', {
          path: 'interacts/screen-imgs/202207',
          type: 'image',
          resfile: files
        })
      });
      console.log(this.cropperImgUrl, '???!2314')
    },
    resetCropper() {
      this.$refs.cropper.reset()
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    // height: 300px;
    &_box{
      height: 234px;
      width: 100%;
      .cropper_img{
        height: 234px;
        width: 100%;
      }
    }
    &_btn {
      padding: 20px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
