<template>
  <div class="single-question">
    <pageTitle pageTitle="问卷详情"></pageTitle>
      <div class="question-title">
        <h1>
          {{ $route.query.subject }}
        </h1>
        <p>填写总人数: <span>{{ total }}人</span><b>|</b><span class="export" @click="exportSingleQuerstion">导出数据</span></p>
        <p>提示：客观题支持报表分析展示（包含：性别、地域、单选题、多选题）</p>
      </div>
    <div class="question-item">
      <div v-for="item in questionList" :key="item.ques_id">
        <div class="question-gender" v-if="item.ques_type == '1' && item.ques_style == 'sex'">
          <p><span>性别</span>(单选题)</p>
          <gender-echarts :genderList="item.list"></gender-echarts>
        </div>
        <div class="question-city" v-else-if="item.ques_type == '3'">
          <p><span>地域</span>统计(城市题目)</p>
          <div class="map-charts">
            <map-echarts :areaDataList="item.list"></map-echarts>
          </div>
        </div>
        <div class="question-subject" v-else>
          <p> <span>{{ item.ques_title }}</span>（{{ item.ques_type == 2 ? '多选题' : '单选题'}}）</p>
          <line-echarts :otherList="item.list" :total="total"></line-echarts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageTitle from '@/components/PageTitle';
import mapEcharts from './components/area';
import genderEcharts from './components/gender';
import lineEcharts from './components/lineEcharts';
export default {
  data() {
    return {
      title: '问卷标题',
      total: 0,
      questionList: [],
      genderList: [],
      areaDataList: {
        total: 0,
        max_number: 0,
        list: [],
      },
      barDataList: [],
      data: {
        total: 0,
        list: []
      }
    };
  },
  components: {
    pageTitle,
    mapEcharts,
    genderEcharts,
    lineEcharts
  },
  mounted() {
    this.getQuerstionList();
  },
  methods: {
    getQuerstionList() {
      let params = {
        webinar_id: this.$route.params.str,
        survey_id: this.$route.query.surveyId,
        filled_number: this.$route.query.number || 0,
        // subject: this.$route.query.subject || ''
      }
      this.$fetch('getQuestionDetailList', this.$params(params)).then(res => {
        this.total = res.data.total || 0;
        this.questionList = res.data.list;
      }).catch(res => {
        this.$message({
          message: res.msg || `获取房间下问卷列表错误`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 导出数据
    exportSingleQuerstion() {
      this.$fetch('exportSurveyDetial',{webinar_id: this.$route.params.str, survey_id: this.$route.query.surveyId, subject: this.$route.query.subject}).then(res => {
        this.$message({
          message: `导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      })
    }
  },
};
</script>
<style lang="less" scoped>
.question-title {
  // text-align: center;
  position: relative;
  padding:  24px 32px 10px 32px;
  h1 {
    font-size: 24px;
    color: #1a1a1a;
    font-weight: bold;
    line-height: 40px;
    width: 80%;
    padding-left: 20px;
    text-align: center;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  p {
    width: 80%;
    text-align: center;
    color: #1a1a1a;
    font-size: 14px;
    padding-top: 10px;
    span{
      font-size: 14px;
    }
  }
  .export {
    color: #3562FA;
    cursor: pointer;
  }
  b{
    padding: 0 10px;
    font-weight: normal;
  }
}
.question-gender, .question-city, .question-subject{
  background: #fff;
  padding:  24px 32px;
  border-radius: 4px;
  margin-bottom: 24px;
}
.question-item {
  margin: 24px 0;
  p {
    height: 40px;
    line-height: 40px;
    color: #1A1A1A;
    padding-left: 50px;
    font-size: 16px;
    font-weight: 500;
    span{
      display: inline-block;
      // height: 40px;
      // line-height: 40px;
      max-width: 500px;
      vertical-align: middle;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .terEchart,
  .barEchart {
    display: flex;
    .terList {
      margin-top: 30px;
    }
  }
}
</style>
