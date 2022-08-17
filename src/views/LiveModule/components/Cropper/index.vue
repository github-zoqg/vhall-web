<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="480px">
    <div class="cropper_content">
      <div class="cropper_content_box">
        <vue-cropper ref="cropper"
          :src="option.src"
          :info="option.info"
          :outputSize="option.outputSize"
          :full="option.full"
          :original="option.original"
          :fixed="option.fixed"
          :fixedBox="option.fixedBox"
          :fixedNumber="option.fixedNumber"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
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
      dialogVisible: true,
      cropperImgUrl: '',
      option: {
        src: 'https://t-alistatic01.e.vhall.com/common-static/images/livingSetting.png',
        // info: true,
        // outputSize: 1,
        // full: true,
        // original: false,
        // fixed: true,
        fixedBox: true,
        // fixedNumber: [16, 9],
        // autoCrop: true,
        autoCropWidth: 400,
        autoCropHeight: 225
        // style: {
        //   'width': '400px',
        //   'height': `225px`,
        // aspect-ratio="400/225"
        //   'object-fit': 'scale-down'
        // },
      }
    }
  },
  components: {
    vueCropper
  },
  methods: {
    showModel(url, index) {
      this.option.src = url;
      this.option.index = index;
      this.dialogVisible = true;
    },
    cropperSure() {
      this.cropperData = this.$refs.cropper.getData()
      // const fileObj = this.dataURLtoFile(this.cropperImgUrl)
      this.$emit('cropComplete', this.cropperData, this.option)
      this.dialogVisible = false;
    },
    resetCropper() {
      this.dialogVisible = false;
      this.$emit('deleteComplete', this.option.index)
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
      padding: 5px;
      overflow: hidden;
      .cropper_img{
        height:225px;
        width: 400px;
        margin: 0 auto;
        overflow: hidden !important;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
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
