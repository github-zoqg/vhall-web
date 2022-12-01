<template>
  <div class="transcript-page">
    <vh-dialog
      width="800px"
      title="成绩单"
      custom-class="transcript-dialog webkit-scrollbar"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <header slot="title">
        <label class="dialog-title">成绩单</label>
        <span class="export-btn" @click="handleDownload">导出数据</span>
      </header>
      <!-- 基本信息层 -->
      <div class="transcript-page--info">
        <div class="transcript-page--info-statistics">
          <vh-row>
            <vh-col :span="6">
              <span class="label">参会ID:</span>
              <span class="info">
                {{ transcriptInfo.account_id || '--' }}
              </span>
            </vh-col>
            <vh-col :span="6">
              <span class="label">姓名:</span>
              <span class="info">
                {{ transcriptInfo.user_name || '--' }}
              </span>
            </vh-col>
            <vh-col :span="6">
              <span class="label">正确率:</span>
              <span class="info">{{ transcriptInfo.right_rate || '--' }}%</span>
            </vh-col>
            <vh-col :span="6">
              <span class="label">主动交卷:</span>
              <span class="info">
                {{ transcriptInfo.is_initiative ? '是' : '否' }}
              </span>
            </vh-col>
          </vh-row>
          <vh-row class="m-t-20">
            <vh-col :span="8">
              <p class="label">答题用时</p>
              <p class="statistics">
                {{ transcriptInfo.use_time || '--' }}
              </p>
            </vh-col>
            <vh-col :span="8">
              <p class="label">得分</p>
              <p class="statistics">
                {{ transcriptInfo.score }}
              </p>
            </vh-col>
            <vh-col :span="8">
              <p class="label">个人排名/全部排名</p>
              <p class="statistics">
                {{ transcriptInfo.rank + '/' + transcriptInfo.rank }}
              </p>
            </vh-col>
          </vh-row>
        </div>
        <!-- 答题情况层 -->
        <div class="transcript-page--answer">
          <div class="transcript-item">
            <span class="transcript-item--title">
              答题情况：答对{{ transcriptInfo.right_num || '--' }}，答错{{
                transcriptInfo.error_num || '--'
              }}，未答{{ transcriptInfo.unanswer_num || '--' }}
            </span>
          </div>
          <div v-if="dialogVisible">
            <div ref="answerResult"></div>
          </div>
        </div>
      </div>
    </vh-dialog>
  </div>
</template>
<script>
  import examServer from '@/utils/examServer';
  export default {
    data() {
      return {
        dialogVisible: false,
        loading: false,
        transcriptInfo: {
          imgUrl: null,
          finishTime: null
        },
        examInfo: {}
      };
    },
    methods: {
      open(examInfo) {
        this.examInfo = examInfo;
        this.getTransitionData();
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.mountAnswerResult();
        });
      },
      getTransitionData() {
        examServer
          .getExamUserScope({
            account_id: this.examInfo.account_id,
            account_type: this.examInfo.account_type,
            paper_id: this.examInfo.id
          })
          .then(res => {
            console.log('🚀 ~ file: index.vue ~ line 106 ~ getTransitionData ~ res', res);
            this.transcriptInfo = res.data;
          });
      },
      mountAnswerResult() {
        const el = this.$refs.answerResult;
        examServer.mount({
          examId: this.examInfo.id,
          el,
          componentName: 'exampc',
          configs: {
            role: 1,
            answerType: 3,
            account_type: this.examInfo.account_type,
            account_id: this.examInfo.account_id
          }
        });
      },
      // 导出数据
      handleDownload() {
        this.$fetch(
          'exportTranscript',
          this.$params({
            room_id: this.examInfo.roomId,
            paper_id: this.examInfo.id,
            webinar_id: this.examInfo.webinarId,
            cus_id: this.examInfo.account_id
          })
        )
          .then(res => {
            this.$message({
              message: `导出成功，请去下载中心下载`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      }
    }
  };
</script>
<style lang="less">
  .transcript-page {
    &--info {
      padding: 0 32px;
      height: 460px;
      overflow-y: auto;
      &-statistics {
        background: #fff;
        padding: 16px 24px;
        border-radius: 4px;
        font-size: 14px;
        .label {
          display: inline-block;
          color: #8c8c8c;
          overflow: hidden;
        }
        .info {
          margin-left: 5px;
          color: #262626;
          display: inline-block;
          width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .statistics {
          font-size: 20px;
          line-height: 22px;
          color: #262626;
        }
      }
      .transcript-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eaeaea;
        padding: 12px 0;
      }
      .transcript-ctx {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        &--left {
          width: calc(100% - 300px);
          p {
            padding: 6px 0;
            label {
              display: inline-block;
              vertical-align: middle;
              width: 70px;
            }
            span {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        &--right {
          width: 300px;
          &--val {
            padding: 8px 0;
            span {
              display: inline-block;
              vertical-align: middle;
              width: 50%;
              text-align: left;
            }
          }
          &--label {
            padding: 8px 0;
            label {
              display: inline-block;
              vertical-align: middle;
              width: 50%;
              text-align: left;
            }
          }
        }
      }
    }
    &--answer {
      // 覆盖表单库样式
      .exam-execute-body {
        padding: 0;
      }
      .exam-execute-header {
        display: none;
      }
    }
  }
  .transcript-dialog {
    background-image: url('~@/common/images/exam/bg_transcript.png') !important;
    background-repeat: no-repeat !important;
    background-color: #fff;
    background-position: top;
    background-size: cover;
    .dialog-title {
      font-size: 18px;
      line-height: 26px;
      color: #262626;
    }
    .export-btn {
      margin-left: 10px;
      font-size: 14px;
      line-height: 22px;
      color: #1e4edc;
      cursor: pointer;
    }
    .vh-dialog__body {
      padding: 0;
    }
  }
</style>
