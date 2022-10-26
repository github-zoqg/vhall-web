<template>
  <div class="exam-add-page">
    <pageTitle :pageTitle="$route.query.examId ? '编辑' : '创建'"></pageTitle>
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
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.exam-add-page {}
</style>
