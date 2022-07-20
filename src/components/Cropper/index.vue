<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="800px">
    <div class="cropper_content">
      <div class="cropper_content_box">
        <vue-cropper ref="cropper"
          :src="option.src"
        ></vue-cropper>
      </div>
      <div class="cropper_content_btn">
        <vh-button type="primary" size="medium" round v-preventReClick>确定</vh-button>
        <vh-button size="medium" round v-preventReClick>取消</vh-button>
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
      option: {
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
      this.option.src = obj.src
    },
    initCropper() {
      let image = document.getElementById(this.cropperDom);
      this.cropper = new Cropper(image, {
        guides: true,
        dragMode: 'move', // 移动
        aspectRatio: 420 / 213, //设置裁剪容器的比例
        minContainerHeight: 319.5,
        minContainerWidth: 630,
        zoomOnWheel: true, // 是否允许通过鼠标滚轮来缩放图片
        background: true, // 是否在容器上显示网格背景
        rotatable: false, // 是否允许旋转图片
        ready() {
          this.cropper.crop();
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    height: 500px;
    &_box{
      height: 441px;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
    &_btn {
      height: 50px;
      display: flex;
    }
  }
</style>
