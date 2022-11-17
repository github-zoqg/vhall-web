<template>
  <div class="exam-add-page">
    <pageTitle :pageTitle="$route.query.examId ? '编辑' : '创建'"></pageTitle>
    <div id="exam-edit"></div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "examAddPage",
  data() {
    return {}
  },
  components: {
    PageTitle
  },
  mounted() {
   const aa = new ExamTemplateServer()
   debugger
   aa.mount({id:'',el:'#exam-edit'})
   console.log("111111",aa)
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.exam-add-page {}
</style>
