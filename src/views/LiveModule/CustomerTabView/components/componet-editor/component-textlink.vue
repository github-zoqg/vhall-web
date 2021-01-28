<template>
  <div class="textlink-wrapbox">
    <div class="textlink-previewbox" v-if="mode == 1">
      <div class="textlink">
        <a href="javascript:void(0);">
          {{ info.text }}
        </a>
      </div>
    </div>
    <div class="textlink-editor-box" v-if="mode == 2">
      <div style="margin-bottom: 10px">
        <div class="label">
          <span style="color:#FB3A32">*</span> 文字
        </div>
        <div class="editorContent">
          <VhallInput
            v-model="info.text"
            @change="changeText"
            :maxlength="30"
            autocomplete="off"
            show-word-limit
          ></VhallInput>
        </div>
      </div>
      <div style="margin-top: 30px">
        <div class="label">
          <span style="color:#FB3A32">*</span> 跳转地址
        </div>
        <div class="editorContent">
          <el-input v-model="info.src" @change="changeLink"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import planFunctionVue from '../../../planFunction.vue'
export default {
  name: 'component-textlink',
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

  data: function() {
    return {
      a: 'test',
    }
  },

  watch: {
  },

  methods: {
    changeLink(e) {
      console.log(this.info.src)
      const result = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(this.info.src)
      this.info.src = this.info.src.trim()
      if(result) {
        this.$emit('updateInfo', this.info)
      } else {
        this.$message.warning('跳转地址，必须以http或https 开头')
      }
    },

    changeText() {
      this.$emit('updateInfo', this.info)
    }
  }
}
</script>
<style lang="less" scoped>
  .textlink-wrapbox{
    .textlink {
      position: relative;
      min-height: 40px;
      line-height: 20px;
      word-break: break-all;
      a{
        color: #3562fa;
      }
    }
  }
  .label{
    display: inline-block;
    font-size: 14px;
    line-height: 40px;
    width: 80px;
    text-align: right;
  }
  .editorContent{
    margin-left: 10px;
    font-size: 14px;
    display: inline-block;
    /deep/ input{
      width: 364px;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      padding: 0 12px;
      border: 1px solid #ccc;
    }
  }
  /* 图片上传 */
  .upload-qrCode{
    height: 180px;
    background: #CCCCCC;

  }
</style>
