<template>
  <div class="exam-table-panel">
    <exam-list ref="webinarExamList" pageLevel="webinar"></exam-list>
  </div>
</template>

<script>
  import ExamList from '../../../PlatformModule/ExamList/index.vue';
  export default {
    components: {
      ExamList
    },
    data() {
      return {};
    },
    created() {},
    methods: {
      initComp() {
        this.$refs.webinarExamList && this.$refs.webinarExamList.initComp();
      }
    },
    mounted() {
      this.initComp();
    }
  };
</script>

<style lang="less" scoped>
  .exam-table-panel {
    padding: 24px 24px 40px 24px;
  }
</style>
