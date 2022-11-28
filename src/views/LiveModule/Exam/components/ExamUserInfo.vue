<template>
  <div class="exam-user-info">
    <div ref="ExamUserInfo"></div>
  </div>
</template>
<script>
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamUserInfo',
    pops: {
      webinarId: {
        type: String
      }
    },
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
          id: this.$route.params.str,
          el,
          configs: {
            role: 1,
            source_id: this.webinarId,
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
