<template>
  <div>
    <question
      :questionId="questionId"
      ref="preQuestions"
      >
    </question>
  </div>
</template>
<script>
import question from './question'
export default {
  props: ['questionId'],
  components: {
    question
  }
}
</script>
<style lang="less" scoped>
#showQuestion /deep/ .line{
  background: #FB3A32;
}
#showQuestion /deep/ .h5-text i{
 color:#FB3A32;
}
#showQuestion /deep/.q-title{
  padding: 0 15px !important;
}
#showQuestion /deep/ .el-button{
 background:#FB3A32;
}
/deep/ .__vuescroll  .__bar-is-vertical {
  background: #e0e0e0 !important;
}
  // #form-pc-preview /deep/.pc-preview{
  //  .line{
  //    background: #FB3A32;
  //  }
  //  .q-text.preview-pc /deep/ .h5-text i{
  //    color:#FB3A32;
  //  }
  //  .option-btn .el-button{
  //    background: #FB3A32;
  //  }
  // }
</style>
