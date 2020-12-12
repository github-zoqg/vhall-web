<template>
	<div>
    <v-editor save-type='customTabImg' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" :value="unitImgTxtForm.content"></v-editor>
  </div>
</template>

<script>
import VEditor from '@/components/Tinymce';
export default {
  name: "unitImgTxt.vue",
  components: { VEditor },
  data() {
    return {
      showCompIndex: 0,
      unitImgTxtForm: {
        component_id: '',
        msg: '',
        content: '',
      }
    };
  },
  methods: {
    /*
   * 参数1： compVoStr 参数结果对象，包含保存前数据
   * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('图文编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitTextLinkForm) {
      //   this.$refs.unitTextLinkForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.content !== '' && compVo.compInfo.content !== null && compVo.compInfo.content !== undefined) {
        this.unitImgTxtForm.content = compVo.compInfo.content;
      } else {
        this.unitImgTxtForm.content = '';
        console.log(2222222222222);
      }
      // 默认组件类别 和 组件名称
      this.unitImgTxtForm.component_id = compVo.component_id;
      this.unitImgTxtForm.msg = compVo.name;
      this.showCompIndex = index;
      // 编辑器初始化
      this.$refs.unitImgTxtEditor.resetContent(this.unitImgTxtForm.content);
    },
    sendData(content) {
      console.log(content);
      if (content) {
        this.unitImgTxtForm.content = content;
        this.$emit('cxtChangeInfo', {
          content: JSON.stringify(this.unitImgTxtForm),
          type: 'img-txt',
          compIndex: this.showCompIndex
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
