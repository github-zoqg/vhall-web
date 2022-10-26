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
        <!--
          题目类型：subject_type（图片题 img-text；文字题 text；）
          选择类型：type（单选 radio；多选 checkbox；）
          排列方式：layout_type（单列 1；多列 2；）
          图文排列方式：layout_css （上图下文：1；左图右文：2）
         -->
        <div class="transcript-page--question" v-for="(item, index) in transcriptInfo.detail" :key="`qt_${index}`">
          <!-- 图片题 （selectType: 1单选；2多选。支持单选 or 多选）-->
          <h1>{{ item.title }}</h1>
          <template v-if="item.detail">
            <div :class="`transcript-page--option ${item.layout_type == 1 ? 'max-width' : 'min-width'} ${item.layout_css == 1 ? 'top-bottom' : 'left-right'}`" v-for="(sonItem, sonIndex) in item.detail.list" :key="`qt_${index}_son${sonIndex}`">
              <img v-if="item.subject_type == 'img-text'" src="https://t-alistatic01.e.vhall.com/upload/users/logo-imgs/ba/e1/bae13a3f7402fded318e89b1b45050b3.jpg"/>
              <div class="transcript-page--text">
                <el-radio></el-radio>
                <div>{{sonItem.key + '、' + sonItem.value}}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      transcriptInfo:  {
        "detail": [
          {
            "id": 2435359,
            "subject_type": "img-text",
            "layout_type": 1,
            "layout_css": 1,
            "title": "单选题1231231",
            "type": "radio",
            "score": 2,
            "detail": {
              "list": [{
                "id": 2314123,
                "key": "A",
                "value": "选项1212",
                "imgUrl": ""
              }, {
                "id": 2314124,
                "key": "B",
                "value": "选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123",
                "imgUrl": ""
              }],
              "min": null,
              "max": null
            },
            "imgUrl": ""
          },
          {
            "id": 24353591,
            "subject_type": "img-text",
            "layout_type": 2,
            "layout_css": 1,
            "title": "单选题1231231",
            "type": "checkbox",
            "score": 2,
            "detail": {
              "list": [{
                "id": 23141231,
                "key": "A",
                "value": "选项1212",
                "imgUrl": ""
              }, {
                "id": 23141241,
                "key": "B",
                "value": "选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123",
                "imgUrl": ""
              }],
              "min": null,
              "max": null
            },
            "imgUrl": ""
          },
          {
            "id": 24353591,
            "subject_type": "img-text",
            "layout_type": 1,
            "layout_css": 2,
            "title": "单选题1231231",
            "type": "checkbox",
            "score": 2,
            "detail": {
              "list": [{
                "id": 23141231,
                "key": "A",
                "value": "选项1212",
                "imgUrl": ""
              }, {
                "id": 23141241,
                "key": "B",
                "value": "选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123",
                "imgUrl": ""
              }],
              "min": null,
              "max": null
            },
            "imgUrl": ""
          },
          {
            "id": 24353591,
            "subject_type": "text",
            "layout_type": 1,
            "layout_css": 1,
            "title": "单选题1231231单选题1231231单选题1231231单选题1231231单选题1231231单选题1231231",
            "type": "checkbox",
            "score": 2,
            "detail": {
              "list": [{
                "id": 23141231,
                "key": "A",
                "value": "选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212选项1212",
                "imgUrl": ""
              }, {
                "id": 23141241,
                "key": "B",
                "value": "选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123选项123123",
                "imgUrl": ""
              }],
              "min": null,
              "max": null
            },
            "imgUrl": ""
          }
        ],
        "imgUrl": null,
        "finishTime": null
      }
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
      // this.getTranscriptInfo();
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
      margin-top: 24px;
      max-height: 200px;
      overflow-y: auto;
      .transcript-page--question {
        h1 {
          margin-bottom: 16px;
          font-weight: bold;
        }
      }
      .transcript-page--option {
        margin-bottom: 16px;
        padding: 0 24px 0 24px;
        img {
          width: 100%;
          height: auto;
          margin-bottom: 8px;;
        }
        .transcript-page--text {
          /deep/.el-radio {
            margin-right: 8px;
          }
          div {
            display: inline-block;
            vertical-align: text-top;
            width: 80%;
          }
        }
        &.max-width {
          width: 100%;
          display: block;
          &.left-right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
              display: inline-block;
              vertical-align: middle;
              width: 50%;
            }
            .transcript-page--text {
              display: inline-block;
              vertical-align: middle;
              width: 50%;
              padding-left: 10px;
            }
          }
        }
        &.min-width {
          width: 50%;
          display: inline-block;
        }
      }
    }
  }
}
</style>
