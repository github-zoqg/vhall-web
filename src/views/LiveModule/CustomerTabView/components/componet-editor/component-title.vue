<template>
  <div class="title-wrapbox">
    <div class="title-previewbox" v-if="mode == 1">
      {{ info.title }}
    </div>
    <div class="qr-editor-box" v-if="mode == 2">
      <div class="label">
        <span style="color: #fb3a32">*</span>
        标题
      </div>
      <div class="editorContent">
        <VhallInput
          v-model="info.title"
          @change="changeHandler"
          :maxlength="30"
          autocomplete="off"
          show-word-limit
        ></VhallInput>
      </div>
    </div>
  </div>
</template>
<script>
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';

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
      return {};
    },

    methods: {
      changeHandler() {
        this.$emit('updateInfo', this.info);
      }
    }
  };
</script>
<style lang="less" scoped>
  .title-previewbox {
    color: #1a1a1a;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
  }
  .qr-editor-box {
    padding-top: 16px;
  }
  .label {
    display: inline-block;
    color: #1a1a1a;
    span {
      margin-right: 5px;
    }
  }
  .editorContent {
    margin-left: 10px;
    display: inline-block;
    /deep/ input {
      width: 312px;
      line-height: 40px;
      height: 40px;
      padding: 0 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }
</style>
