<template>
  <div class="vmp-exam-prev">
    <vh-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="title"
      width="380px"
      draggable
      :modal="false"
    >
      <div ref="ExamPrev"></div>
    </vh-dialog>
  </div>
</template>
<script>
  import examServer from '@/utils/examServer';
  export default {
    name: 'ExamPrev',
    data() {
      return {
        dialogVisible: false,
        prevExamId: '',
        title: ''
      };
    },
    methods: {
      open(examId, examTitle) {
        this.title = examTitle;
        this.prevExamId = examId;
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.initComp();
        });
      },
      initComp() {
        const el = this.$refs.ExamPrev;
        examServer.mount({
          examId: this.prevExamId,
          el,
          componentName: 'exampc',
          configs: {
            role: 1,
            pageSize: 1,
            answerType: '1'
          }
        });
      }
    }
  };
</script>
.
<style lang="less">
  .vmp-exam-prev {
    .vh-dialog__body {
      padding: 0;
    }
  }
</style>
