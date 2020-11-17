<template>
	<div>
    <tinymce v-model="content" :height="300" menubar='false'/>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
export default {
  name: "unitImgTxt.vue",
  components: { Tinymce },
  data() {
    return {
      content: `默认图文`
    };
  }
};
</script>

<style scoped>

</style>
