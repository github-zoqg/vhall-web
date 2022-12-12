<template>
  <div class="vmp-exam-prev">
    <vh-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="380px"
      modal
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
      min-height: 287px;
      background: url('~@/common/images/exam/bg_default.png') no-repeat;
      border-radius: 12px;
      background-color: #fff;
      background-position: top;
      background-size: cover;
      .exam-execute-header {
        min-height: 38px;
      }
      // 重置内部元素
      .exam-execute-body {
        height: calc(460px - 134px) !important;
        max-height: calc(460px - 134px) !important;
        margin-right: 2px;
      }
    }
    .vh-dialog__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2;
    }
    .content {
      padding-top: 25px !important;
      padding-top: 24px !important;
      // height: 465px;
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

    .vmp-transcripts {
      &.vmp-transcripts-other {
        // 百分比 or 正确率
        height: 409px;
        padding-top: 27px;
        button.vh-button--primary {
          margin: 57px auto 64px auto;
        }
      }
      &.vmp-transcripts-extreme {
        // 满分 or 0分
        button.vh-button--primary {
          margin: 24px auto 24px auto;
        }
        .trophy-wrap {
          margin-top: 30px;
        }
      }
    }
    .vh-dialog__headerbtn {
      top: 28px;
    }
    .exam-execute-footer {
      border-radius: 0 0 12px 12px;
    }
  }
</style>
