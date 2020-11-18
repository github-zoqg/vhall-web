<template>
	<div>
    <tinymce v-model="content" :height="300" menubar='false' :value="contentVal"/>
    {{compVo}}
    <br/>
    {{content}}
    <br/>
    {{contentVal}}
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
export default {
  name: "unitImgTxt.vue",
  components: { Tinymce },
  data() {
    return {
      content: '',
      contentVal: '',
      compVo: {},
      showCompId: null
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
