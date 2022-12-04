<template>
  <div class="vmp-exam-prev">
    <vh-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="380px"
      :modal="false"
      custom-class="vmp-exam-prev-dialog"
    >
      <div class="vh-dialog-title" slot="title"></div>
      <div v-if="dialogVisible" class="content webkit-scrollbar">
        <div ref="ExamPrev"></div>
      </div>
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
    .vmp-exam-prev-dialog {
      height: 460px;
      background: url('~@/common/images/exam/bg_default.png') no-repeat;
      border-radius: 12px;
      background-color: #fff;
      background-position: top;
      background-size: cover;
    }
    .vh-dialog__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2;
    }
    .content {
      padding-top: 10px !important;
      height: 465px;
      overflow-y: auto;
      &::-webkit-scrollbar-track-piece {
        opacity: 0;
      }

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        background-clip: padding-box;
        border-radius: 3px;
      }
    }
    .vh-dialog__body {
      padding: 0 !important;
    }
    .exam-execute-body {
      height: calc(100% - 120px);
      max-height: calc(100% - 120px);
    }
    .vh-dialog__headerbtn {
      top: 14px;
    }
  }
</style>
