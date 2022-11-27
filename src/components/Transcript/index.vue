<template>
  <div class="transcript-page">
    <vh-dialog
      width="800px"
      title="成绩单"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <!-- 基本信息层 -->
      <div class="transcript-page--info">
        <div class="transcript-item">
          <span class="transcript-item--title">基本信息</span>
          <vh-button plain borderRadius="50" size="mini" @click="handleDownload">
            导出数据
          </vh-button>
        </div>
        <div class="transcript-ctx">
          <div class="transcript-ctx--left">
            <p>
              <label>参会ID:</label>
              <span>{{ transcriptInfo.account_id || '--' }}</span>
            </p>
            <p>
              <label>姓名:</label>
              <span>{{ transcriptInfo.user_name || '--' }}</span>
            </p>
            <p>
              <label>答题用时:</label>
              <span>
                {{ transcriptInfo.use_time || '--' }}
                <!-- 需要转换数据 -->
              </span>
            </p>
            <p>
              <label>正确率:</label>
              <span>{{ transcriptInfo.right_rate || '--' }}%</span>
            </p>
            <p>
              <label>主动交卷:</label>
              <span>{{ transcriptInfo.is_initiative ? '是' : '否' }}</span>
            </p>
          </div>
          <div class="transcript-ctx--right">
            <div class="transcript-ctx--right--val">
              <span>{{ transcriptInfo.rank + '/' + transcriptInfo.rank }}</span>
              <span>{{ transcriptInfo.score || '--' }}</span>
            </div>
            <div class="transcript-ctx--right--label">
              <label>个人排名/全部排名</label>
              <label>得分</label>
            </div>
          </div>
        </div>
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
</style>
