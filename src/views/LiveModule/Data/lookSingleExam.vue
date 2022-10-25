<template>
  <div class="single-exam-detail">
    <div class="single-exam-detail__header">
      <p class="exam-webinar-title">xxxx快问快答标题名称</p>
      <div class="single-exam-detail__data">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="7">
            <div class="grid-content">
              <span>查看人数</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，仅查看题目未进行作答的人数，人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.showNum"
                  :duration="1500"
                  v-if="examData.showNum >= 0">
                </count-to>
              </h3>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <span>答题人数</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，参与答题的人数（包含主动交卷、人工及系统收卷），人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.submitNum"
                  :duration="1500"
                  v-if="examData.submitNum >= 0">
                </count-to>
              </h3>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <span>满分率</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  （满分人数 / 提交人数）*100%
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
               <span>{{examData.percent}}%，</span>
               <count-to :startVal="0"
                  :endVal="examData.total"
                  :duration="1500"
                  v-if="examData.total >= 0">
                </count-to><span>人</span>
              </h3>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="7">
            <div class="grid-content">
              <span>最高分</span>
              <h3 class="custom-font-barlow">
                {{examData.maxScore}}
              </h3>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <span>最低分</span>
              <h3 class="custom-font-barlow">
                {{examData.minScore}}
              </h3>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <span>平均分</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  本次答题的总分数 / 答题人数
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                {{examData.advScore}}
              </h3>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="single-exam-detail__list">
      sdfsf
    </div>
  </div>
</template>
<script>
import CountTo from 'vue-count-to';
export default {
  data() {
    return {
      examData: {
        showNum: 0, // 查看人数
        submitNum: 0, // 答题人数
        percent: 0, // 满分率
        total: 0, // 总人数
        maxScore: 0, // 最高分
        minScore: 0, // 最低分
        advScore: 0 // 平均分
      }
    };
  },
  components: {
    CountTo
  },
  mounted() {
    this.initComp()
  },
  methods: {
    getSingleExamData() {
      let params = {}
      this.$fetch('getDataCenterInfo', this.$params(params)).then(res =>{
        this.examData = res.data;
      }).catch(e=>{
        console.log(e);
      }).finally(()=>{
        this.loading = false;
      });
    },
    initComp() {
      this.getSingleExamData()
    }
  }
};
</script>
<style lang="less" scoped>
.single-exam-detail {
  /deep/.saasicon_help_m {
    color: #999999;
    &:hover {
      color: #666666;
    }
  }
  .single-exam-detail__header {
    padding: 24px 32px;
    background: #fff;
    border-radius: 4px;
    .exam-webinar-title {
      font-size: 16px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
      text-align: left;
      padding: 12px 0 18px 12px;
      border-bottom: 1px solid #eaeaea;
      padding: 4px 0 12px 0;
      margin-bottom: 24px;
    }
    .row-bg {
      margin: 12px 28px 64px 28px;
    }
    .bg-purple {
      margin-bottom: 26px;
    }
    .activeJustify{
      justify-content: space-around;
    }
    .grid-content {
      text-align: left;
      >span {
        font-size: 14px;
        font-family: @fontRegular;
        color: #999;
        margin: 0;
      }
      i{
        font-size: 14px;
        padding: 0 2px;
      }
      h3{
        padding-top: 6px;
        font-size: 28px;
        font-weight: bold;
        color: #1a1a1a;
        span{
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 0;
        }
      }
    }
  }
}
</style>
