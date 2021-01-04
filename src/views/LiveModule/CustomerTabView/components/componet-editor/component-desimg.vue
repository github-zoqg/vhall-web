<template>
  <div class="component-wrap-box">
    <!-- 显示区域 -->
    <div class="editor-preview" v-if="mode == 1" v-html="info.content || '默认图文'">
    </div>
    <!-- 编辑区域 -->
    <div class="editor-box" v-if="mode == 2">
      <v-editor
        v-model="info.content"
      ></v-editor>
    </div>
  </div>
</template>
<script>
import vEditor from '../../../../../components/Tinymce'
export default {
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

  components: {
    vEditor
  },

  created() {

  },

  mounted() {
    if( this.content ) {
      // this.desimgContent = this.content
    }
  },

  watch: {
    // info: function(val) {
    //   this.$emit('updateInfo', this.info)
    // }
  },

  methods: {
  }
}
</script>
<style lang="less" scoped>
  .editor-preview{
    /deep/ img{
      max-width: 100%;
    }
  }
  .component-wrap-box{
    width: 100%;
  }
</style>
