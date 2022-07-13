<template>
   <el-dialog
      title="设置观看鉴权模式"
      width="590px"
      style="overflow: hidden;"
      :visible.sync="visible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :before-close="cancelSelect"
      custom-class="choose-viewer"
    >
   </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: true
    }
  }
}
</script>
