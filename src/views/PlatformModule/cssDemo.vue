<template>
  <div class="components-container">
    {{content}}
    <v-editor :isReturn=true @returnChange="sendData1" ref="unitImgTxtEditor" :value="content"></v-editor>
    {{content2}}
    <v-editor :isReturn=true @returnChange="sendData2" ref="unitImgTxtEditor" :value="content2"></v-editor>
  </div>
</template>

<script>
import VEditor from '@/components/Tinymce';
export default {
  name: 'TinymceDemo',
  components: { VEditor },
  data() {
    return {
      content:
        `第一个编辑器`,
      content2:
        `第二个编辑器`
    };
  },
  methods: {
    sendData1(content) {
     this.content = content;
    },
    sendData2(content) {
      this.content2 = content;
    }
  }
};
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
