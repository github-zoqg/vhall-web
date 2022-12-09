<template>
  <el-dialog
    title="图片处理"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="480px"
  >
    <div class="cropper_content">
      <div class="cropper_list">
        <el-radio-group v-model="imageType">
          <el-radio :label="1">全屏拉伸</el-radio>
          <el-radio :label="2">等比缩放自适应</el-radio>
          <el-radio :label="3">等比缩放显示全图</el-radio>
        </el-radio-group>
      </div>
      <div class="cropper_content_wrapper">
        <div class="cropper_image" v-if="isShowImages">
          <img :src="url" alt="" />
        </div>
        <div class="cropper_content_box" v-else>
          <vue-cropper
            ref="cropper"
            class="cropper_img"
            :src="url"
            :aspect-ratio="ratio"
            :viewMode="1"
            :style="{ width: '400px', height: '234px' }"
            :autoCropArea="1"
          ></vue-cropper>
        </div>
      </div>
      <div class="cropper_content_btn">
        <div>
          <!-- 一个按钮会有样式问题 裁剪&取消裁剪-->
          <vh-button size="medium" plain round @click="changeValue" v-if="isShowImages">
            裁剪
          </vh-button>
          <vh-button size="medium" plain round @click="changeValue" v-if="!isShowImages">
            取消裁剪
          </vh-button>
          <vh-button size="medium" plain type="text" v-preventReClick @click="resetCropper">
            重新上传
          </vh-button>
        </div>
        <div>
          <vh-button size="medium" type="primary" round v-preventReClick @click="cropperSure">
            确定
          </vh-button>
          <vh-button size="medium" ghost type="info" round v-preventReClick @click="cancelCropper">
            取消
          </vh-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import vueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';

  export default {
    props: {
      // 比例
      ratio: {
        type: Number,
        default: 16 / 9
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
          y: 0,
          width: 0,
          height: 0
        },
        url: '',
        index: 1
      };
    },
    components: {
      vueCropper
    },
    methods: {
      showModel(url, index) {
        this.url = url;
        this.index = index || 0;
        this.dialogVisible = true;
        this.imageType = 1;
        this.isShowImages = true;
        console.log(url, '???!2324');
      },
      async changeValue() {
        this.isShowImages = !this.isShowImages;
      },
      cancelCropper() {
        this.dialogVisible = false;
        this.isShowImages = true;
        this.$refs.cropper && this.$refs.cropper.destroy();
      },
      cropperSure() {
        if (!this.isShowImages) {
          this.cropperData = this.$refs.cropper.getData();
        }
        /**
         * cropperData:裁剪数据
         * url: 图片地址
         * imageType: 选择的图片方式
         * index: 一个页面可能用到多次裁剪组件，用来区分
         */
        this.$emit('cropComplete', this.cropperData, this.url, Number(this.imageType), this.index);
        this.$refs.cropper && this.$refs.cropper.destroy();
        this.url = '';
        this.dialogVisible = false;
      },
      resetCropper() {
        this.dialogVisible = false;
        this.url = '';
        this.$refs.cropper && this.$refs.cropper.destroy();
        this.$emit('resetUpload', this.index);
      }
    }
  };
</script>
<style lang="less" scoped>
  .cropper_content {
    width: 100%;
    &_wrapper {
      width: 100%;
      height: 234px;
      position: relative;
    }
    .cropper_list {
      padding-bottom: 10px;
    }
    .cropper_image {
      width: 100%;
      height: 234px;
      border-radius: 4px;
      background: #8c8c8c;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: scale-down;
      }
    }
    &_box {
      width: 416px;
      height: 234px;
      background: #8c8c8c;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      .cropper_img {
        height: 234px;
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
