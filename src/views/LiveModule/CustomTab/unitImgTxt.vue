<template>
	<div>
    <tinymce v-model="content" :height="300" menubar='false' :value="contentVal"/>
    {{compVo}}
    <br/>
    {{content}}
    <br/>
    {{contentVal}}

    <v-editor height="220" ref="editor" :tinyVal="desc" class="editor-wrap"></v-editor>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import VEditor from '@/components/EditorTinymce/editor';
export default {
  name: "unitImgTxt.vue",
  components: { Tinymce, VEditor },
  data() {
    return {
      content: '',
      contentVal: '',
      compVo: {},
      showCompId: null,
      desc: '',
      descCount: 0
    };
  },
  methods: {
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： showCompId */
    initDataComp(compVoStr, showCompId) {
      console.log('图文编辑区，每次show区域选中，右侧编辑区域变化', compVoStr);
      this.compVo = JSON.parse(compVoStr);
      this.showCompId = showCompId;
      this.$nextTick(() => {
        this.content = this.compVo.original_params.content || '';
      });
    }
  },
  watch: {
    content() {
      if(this.content !== null) {
        this.$nextTick(() => {
          let compVo = this.compVo;
          compVo.update_params.content = this.content;
          this.$emit('cxtChangeInfo', Object.assign({}, compVo), this.showCompId);
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
