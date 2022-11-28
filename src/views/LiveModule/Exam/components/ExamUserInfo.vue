<template>
  <div class="exam-user-info">
    <div ref="ExamUserInfo"></div>
  </div>
</template>
<script>
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamUserInfo',
    data() {
      return {};
    },
    mounted() {
      this.initComp();
    },
    methods: {
      initComp() {
        const el = this.$refs.ExamUserInfo;
        examServer.mount({
          componentName: 'userInfoEdit',
          el,
          configs: {
            role: 1,
            source_id: this.$route.params.str,
            source_type: 1,
            client: 'console'
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .exam-user-info {
    height: 380px;
    overflow: auto;
  }
</style>
