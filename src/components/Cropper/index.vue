<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="480px">
    <div class="cropper_content">
      <div class="cropper_list">
        <el-radio-group v-model="imageType">
          <el-radio :label="1">全屏拉伸</el-radio>
          <el-radio :label="2">等比缩放自适应</el-radio>
          <el-radio :label="3">等比缩放显示全图</el-radio>
        </el-radio-group>
      </div>
      <div class="cropper_image" v-if="isShowImages">
        <img :src="url" alt="">
      </div>
      <div class="cropper_content_box" v-else>
        <vue-cropper ref="cropper" class="cropper_img"
          :src="url"
          :aspect-ratio="ratio"
          :viewMode='1'
          :autoCropArea="1"
        ></vue-cropper>
      </div>
      <div class="cropper_content_btn">
        <div>
          <vh-button size="medium" plain round v-preventReClick @click="goCropper">{{isShowImages ? '裁剪' : '取消裁剪'}}</vh-button>
          <vh-button size="medium" plain round v-preventReClick @click="resetCropper">重新上传</vh-button>
        </div>
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
    // 比例
    ratio: {
      type: Number,
      default: 16/9
    },
    // 模式
    mode: {
      type: Number || String,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      isShowImages: true,
      imageType: 1,
      cropperImgUrl: '',
      cropperData: {
        x: 0,
        y:0,
        width: 0,
        height: 0
      },
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
      this.index = index || 0;
      this.imageType = Number(this.mode);
      this.dialogVisible = true;
    },
    goCropper() {
      this.isShowImages = !this.isShowImages;
      if (this.isShowImages) {
        this.$refs.cropper.destroy();
      }

    },
    cropperSure() {
      if (!this.isShowImages) {
        this.cropperData = this.$refs.cropper.getData()
      }
      // const fileObj = this.dataURLtoFile(this.cropperImgUrl)
      this.$emit('cropComplete', this.cropperData, this.url, this.index)
      this.url = '';
      this.dialogVisible = false;
    },
    resetCropper() {
      this.dialogVisible = false;
      this.url = '';
      this.$emit('resetUpload', this.index)
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    width: 100%;
    .cropper_list{
      padding-bottom: 10px;
    }
    .cropper_image{
      width: 100%;
      height: 234px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.45);
      img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: scale-down;
      }
    }
    &_box{
      width: 416px;
      height: 234px;
      background: rgba(0, 0, 0, 0.45);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      .cropper_img{
        height:234px;
        width: 400px;
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
