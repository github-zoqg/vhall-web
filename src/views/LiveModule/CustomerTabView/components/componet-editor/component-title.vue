<template>
  <div class="title-wrapbox">
    <div class="title-previewbox" v-if="mode == 1">
      {{ info.title }}
    </div>
    <div class="qr-editor-box" v-if="mode == 2">
      <div class="label">
        <span style="color:#FB3A32">*</span>标题
      </div>
      <div class="editorContent">
        <el-input v-model="info.title" @change="changeHandler"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../../bus'
import eventsType from '../../EventConts'

export default {
  name: 'component-title',
  props: {
    // 1. 显示  2. 编辑
    mode: {
      required: true,
      default: 1
    },
    info: {
      required: false
    }
  },

  data() {
    return {
    }
  },

  methods: {
    changeHandler() {
      this.$emit('updateInfo', this.info)
    }
  }
}
</script>
<style lang="less" scoped>
  .label{
    display: inline-block;
  }
  .editorContent{
    margin-left: 10px;
    display: inline-block;
  }
</style>
