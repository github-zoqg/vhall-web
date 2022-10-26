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
          <p><label>参会ID:</label><span>123456</span></p>
          <p><label>姓名:</label><span>ivy一枝花</span></p>
          <p><label>手机号:</label><span>-</span></p>
          <p><label>答题用时:</label><span>02:00</span></p>
          <p><label>正确率:</label><span>100%</span></p>
          <p><label>主动交卷:</label><span>是</span></p>
        </div>
        <div class="transcript-ctx--right">
          <div class="transcript-ctx--right--val">
            <span>1/10</span>
            <span>90</span>
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
        <span class="transcript-item--title">答题情况：答对1，答错1，未答0</span>
      </div>
      <div class="transcript-page--answer-ctx">
        多种题目组合布局
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      transcriptInfo: null
    }
  },
  props: {
    select: {
      required: true,
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // 导出数据
    handleDownload() {},
    // 获取快问快答成绩单 - 用户ID
    getTranscriptInfo() {
      this.loading = true;
      let params = {
        userId: this.select.id
      }
      this.$fetch('getTranscriptInfo', this.$params(params)).then(res => {
        this.loading = false;
        this.transcriptInfo = res.data
      }).catch(e => {
        this.loading = false;
        this.transcriptInfo = {}
      });
    },
    // 页面初始化
    initComp() {
      console.log('触发成绩单查询。。。')
      this.getTranscriptInfo();
    }
  },
  created() {
    this.initComp();
  }
}
</script>
<style lang="less" scoped>
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
    margin-top: 24px;
    .transcript-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eaeaea;
      padding: 12px 0;
    }
    &-ctx {
      color: red;
      margin-top: 24px;
    }
  }
}
</style>
