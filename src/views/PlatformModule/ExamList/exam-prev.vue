<template>
  <div class="vmp-exam-prev">
    <!-- vh-dialog的关闭弹窗bug -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      width="380px"
      draggable
      :modal="false"
    >
      <span slot="title"></span>
      <div v-if="dialogVisible" class="content">
        <div ref="ExamPrev"></div>
      </div>
    </el-dialog>
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
    .el-dialog__header {
      padding-top: 0 !important;
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
    .el-dialog__body {
      padding: 0 !important;
    }
  }
</style>
