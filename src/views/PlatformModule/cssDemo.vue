<template>
  <div class="components-container">
    <div>
    </div>
    <div class="editor-content" v-html="content" />
    <div class="editor-content" v-html="content2" />

  </div>
</template>

<script>

export default {
  name: 'TinymceDemo',
  components: {  },
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
