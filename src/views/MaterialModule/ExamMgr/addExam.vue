<template>
  <div class="exam-add-page">
    <pageTitle :pageTitle="$route.query.examId ? '编辑' : '创建'"></pageTitle>
    <div class="exam-create-edit">
      <div ref="ExamCreate"></div>
    </div>
  </div>
</template>
<script>
  /**
   * @description 资料库创建问卷
   */
  import PageTitle from '@/components/PageTitle';
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamCreate',
    components: {
      PageTitle
    },
    created() {
      this.initEvent();
    },
    mounted() {
      this.initComp();
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
          path: '/material/exam'
        });
      }
    }
  };
</script>
<style lang="less">
  .exam-add-page {
    .create-examination .examination-items-panel,
    .create-examination .examination-settings-panel,
    .create-examination .examination-pattern,
    .create-examination .create-panel {
      height: calc(100vh - 290px);
      min-height: 360px;
    }
    .examination-settings-panel.live .vh-tab-pane {
      min-height: 100%;
    }
  }
</style>
