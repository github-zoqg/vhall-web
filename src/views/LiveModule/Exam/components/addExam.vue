<template>
  <div class="exam-add-page">
    <pageTitle :pageTitle="$route.query.examId ? '编辑' : '创建'"></pageTitle>
    <div class="exam-create-edit">
      <div ref="ExamCreate"></div>
    </div>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamCreate',
    components: {
      PageTitle
    },
    mounted() {
      this.initComp();
    },
    created() {
      this.initEvent();
    },
    beforeDestroy() {
      this.removeEvent();
    },
    methods: {
      initComp() {
        const el = this.$refs.ExamCreate;
        examServer.mount({
          componentName: 'examedit',
          examId: this.$route.query.examId || '',
          el,
          configs: {
            role: 1,
            source_id: this.$route.query.webinarId || '',
            source_type: 1,
            client: 'console'
          }
        });
      },
      initEvent() {
        examServer.on('SUBMITEDIT', this.examEvent);
      },
      removeEvent() {
        examServer.off('SUBMITEDIT', this.examEvent);
      },
      examEvent() {
        this.$router.replace({
          path: `/live/exam/${this.$route.query.webinarId}`,
          query: {
            roomId: this.$route.query.roomId,
            tab: 1
          }
        });
      }
    }
  };
</script>
