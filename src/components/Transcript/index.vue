<template>
  <div class="transcript-page">
    <!-- 基本信息层 -->
    <div class="transcript-page--info">
      <div class="transcript-item">
        <span class="transcript-item--title">基本信息</span>
        <vh-button plain borderRadius="50" size="mini" @click="handleDownload">导出数据</vh-button>
      </div>
      <div class="transcript-ctx">
        <div class="transcript-ctx--left">
          <p>
            <label>参会ID:</label>
            <span>{{ transcriptInfo.join_id || '--' }}</span>
          </p>
          <p>
            <label>姓名:</label>
            <span>{{ transcriptInfo.user_name || '--' }}</span>
          </p>
          <p>
            <label>手机号:</label>
            <span>{{ transcriptInfo.mobile || '--' }}</span>
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
            <span>是</span>
          </p>
        </div>
        <div class="transcript-ctx--right">
          <div class="transcript-ctx--right--val">
            <span>1/10</span>
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
      <div ref="answerResult"></div>
    </div>
  </div>
</template>
<script>
  import examServer from '@/utils/examServer';
  export default {
    data() {
      return {
        loading: false,
        transcriptInfo: {
          imgUrl: null,
          finishTime: null
        }
      };
    },
    props: {
      select: {
        required: true,
        type: Object,
        default: () => ({})
      }
    },
    mounted() {
      this.mountAnswerResult();
    },
    methods: {
      mountAnswerResult() {
        const el = this.$refs.answerResult;
        examServer.mount({
          examId: 211,
          el,
          componentName: 'exampc',
          configs: {
            role: 1,
            // pageSize: 1,
            answerType: 3
          }
        });
      },
      // 导出数据
      handleDownload() {
        this.$fetch(
          'exportTranscript',
          this.$params({
            room_id: this.select.room_id,
            paper_id: this.select.paper_id,
            webinar_id: this.select.webinar_id,
            join_id: this.select.join_id
          })
        )
          .then(res => {
            this.$message({
              message: `导出成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
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
      },
      // 获取快问快答成绩单 - 用户ID
      getTranscriptInfo() {
        this.loading = true;
        let params = {
          join_id: this.select.join_id,
          paper_id: this.select.paper_id
        };
        this.$fetch('getTranscriptInfo', this.$params(params))
          .then(res => {
            this.loading = false;
            this.transcriptInfo = res.data;
          })
          .catch(e => {
            this.loading = false;
            this.transcriptInfo = {};
          });
      },
      // 页面初始化
      initComp() {
        console.log('触发成绩单查询。。。');
        // this.getTranscriptInfo();
      }
    },
    created() {
      this.initComp();
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
    // 覆盖表单库样式
    .exam-execute-body {
      padding: 0;
    }
    .exam-execute-header {
      display: none;
    }
  }
</style>
