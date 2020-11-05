<template>
  <div>
    <h1>开关</h1>
    <div class="switch__box">
      <label class="leve3_title label__r12">标题</label>
      <el-switch
        v-model="switchVal"
        active-color="#FB3A32"
        inactive-color="#CECECE">
      </el-switch>
      <span class="leve3_title title--999">提示文本区域</span>
    </div>
    <div class="switch__box">
      <el-switch
        v-model="switchVal"
        active-color="#FB3A32"
        inactive-color="#CECECE">
      </el-switch>
      <span class="leve3_title title--666">提示文本区域</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "cssDemo.vue",
  data() {
    return {
      switchVal: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
@import '../../common/css/base.less';
</style>
