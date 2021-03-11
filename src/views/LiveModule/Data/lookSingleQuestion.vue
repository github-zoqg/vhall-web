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
        <div class="question-gender" v-if="item.ques_title == '性别'">
          <p>{{ item.ques_title }}(单选题)</p>
          <gender-echarts :genderList="item.list"></gender-echarts>
        </div>
        <div class="question-city" v-else-if="item.ques_title == '地域'">
          <p>{{item.ques_title}}统计(城市题目)</p>
          <div class="map-charts">
            <map-echarts :areaDataList="item.list"></map-echarts>
          </div>
        </div>
        <div class="question-subject" v-else>
          <p>{{ item.ques_title }}（{{ item.item_type == 2 ? '多选题' : '单选题'}}）</p>
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
      genderList: [
        {
          name: '女',
          value: '40',
        },
        {
          name: '男',
          value: '30',
        },
      ],
      areaDataList: {
        total: 1050,
        max_number: 400,
        list: [
          {
            name: '新疆',
            value: '100',
          },
          {
            name: '西藏',
            value: '200',
          },
          {
            name: '内蒙古',
            value: '300',
          },
          {
            name: '甘肃',
            value: '400',
          },
          {
            name: '云南',
            value: '50',
          },
        ],
      },
      barDataList: [],
      data: {
        total: 3,
        list: [
          {
            itemTypeChinese: "单选",
            ques_id: 557831,
            title: "性别",
            item_type: 1,
            list: [
              {
                ques_id: 557831,
                item_id: 821385,
                item_subject: "男",
                num: 1
              },{
                ques_id: 557831,
                item_id: 821386,
                item_subject: "女",
                num: 1
              }
            ]
          },
          {
            itemTypeChinese: "城市",
            ques_id: 557832,
            title: "地域",
            item_type: 0,
            list: [
              {
                ques_id: 557831,
                item_id: 821385,
                item_subject: "北京",
                num: 1
              },{
                ques_id: 557831,
                item_id: 821386,
                item_subject: "石家庄",
                num: 1
              }
            ]
          },
          {
            itemTypeChinese: "单选",
            ques_id: 557833,
            title: "什么最大",
            item_type: 1,
            list: [
              {
                ques_id: 557831,
                item_id: 821385,
                item_subject: "其他",
                num: 1
              },{
                ques_id: 557831,
                item_id: 821386,
                item_subject: "吃饭",
                num: 1
              }
            ]
          },
          {
            itemTypeChinese: "多选",
            ques_id: 557834,
            title: "我的爱好",
            item_type: 2,
            list: [
              {
                ques_id: 557831,
                item_id: 821385,
                item_subject: "睡觉",
                num: 2
              },{
                ques_id: 557831,
                item_id: 821386,
                item_subject: "吃饭",
                num: 5
              }
            ]
          }
        ]
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
        subject: this.$route.query.subject || ''
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
    padding-left: 100px;
    font-size: 16px;
    font-weight: 500;
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
