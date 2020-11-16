<template>
  <div class="components-container">
    <div>
      <tinymce v-model="content" :height="300"/>
      <tinymce v-model="content2" :height="300" menubar='false' />

    </div>
    <div class="editor-content" v-html="content" />
    <div class="editor-content" v-html="content2" />

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content:
        `第一个编辑器`,
      content2:
        `第二个编辑器`
    };
  }
};
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
