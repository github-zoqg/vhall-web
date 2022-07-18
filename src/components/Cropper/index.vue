<template>
  <el-dialog
    title="裁剪图片"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="800px">
    <div class="cropper_content">
      <div class="cropper_content_box">
        <vueCropper ref="cropper"
          :img="option.img"
          :fixedBox="option.fixedBox"
          :fixed="option.fixed"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
        ></vueCropper>
      </div>
      <div class="cropper_content_btn"></div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      option: {
        img: '',
        outputSize: 1,
        outputType: 'jpeg',
        info: true,
        canScale: false,
        autoCrop: true,
        autoCropWidth: 345,
        autoCropHeight: 245,
        fixedBox: false,
        fixed: true
      }
    }
  },
  methods: {
    showModel(obj) {
      console.log(obj, '???1111233456')
      this.dialogVisible = true;
      this.option.img = obj.img
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper_content{
    height: 500px;
    &_box{
      height: 400px;
    }
  }
</style>
