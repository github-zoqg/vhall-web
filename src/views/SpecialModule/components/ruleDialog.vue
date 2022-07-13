<template>
   <el-dialog
      title="设置观看鉴权模式"
      width="590px"
      :visible.sync="visible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      custom-class="choose-viewer"
    >
    <div class="choose-viewer_container">
       <el-radio v-model="viewer" :label="1">无统一限制，采用直播自己的</el-radio> <br/>
        <el-radio v-model="viewer" :label="2">统一观看限制，各直播自己的失效</el-radio><br/>
        <el-radio v-model="viewer" :label="3">统一报名表单，各直播自己的失效</el-radio>
        <div class="subject_btn"><el-button type="primary" size="medium" v-preventReClick round @click="goSetViewer">{{ viewer > 1 ? '去设置' : '确定'}}</el-button></div>
    </div>
   </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      viewer: 1
    }
  },
  methods: {
    goSetViewer() {
      if (this.viewer == 1) {
        this.visible = false;
        return
      } else {
        this.visible = false;
        this.$router.push({
          path: `/special/${this.formData.viewer == 2 ? 'viewer' : 'signup'}`
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .choose-viewer {
    &_container{
      padding: 12px 0 24px 0;
      .el-radio{
        padding-bottom: 16px;
      }
      .subject_btn{
        margin-top: 10px;
      }
    }
  }
</style>
