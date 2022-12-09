<template>
  <div class="order-detail">
    <pageTitle pageTitle="升级版本"></pageTitle>
    <div class="version-info">
      <div class="version-item">
        <span></span>
        <h1>标准版</h1>
        <p>
          按需使用 成本无忧
          <br />
          零门槛玩转直播
        </p>
      </div>
      <div class="version-item">
        <span style="background: #5d81fb"></span>
        <h1 style="color: #5d81fb">专业版</h1>
        <p>
          按量计费 全平台功能任意用
          <br />
          直播营销无难
        </p>
        <h2 style="color: #5d81fb">升级专业版</h2>
      </div>
      <div class="version-item">
        <span style="background: #fbb75d"></span>
        <h1 style="color: #fbb75d">旗舰版</h1>
        <p>
          SDK/API专享二次开发
          <br />
          解锁高端定制
        </p>
        <h2 style="color: #fbb75d; border: 1px solid #fbb75d">立即咨询</h2>
      </div>
    </div>
    <div class="version-card">
      <div class="version-list" v-for="(item, index) in versionList" :key="index">
        <div class="version-title">
          <div class="version-title-item" v-for="(items, indexs) in item.labelList" :key="indexs">
            {{ items.label }}
          </div>
        </div>
        <div class="version-list-text" v-for="(opt, optOndex) in item.textList" :key="optOndex">
          <div class="version-text-item">{{ opt.text }}</div>
          <div class="version-text-item"><i class="el-icon-check" v-if="opt.isStandard"></i></div>
          <div class="version-text-item">
            <i class="el-icon-check" v-if="opt.isProfessional"></i>
          </div>
          <div class="version-text-item"><i class="el-icon-check" v-if="opt.isFlagship"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  export default {
    data() {
      return {
        versionList: [
          {
            labelList: [
              {
                label: '直播互动'
              },
              {
                label: '标准版'
              },
              {
                label: '专业版'
              },
              {
                label: '旗舰版'
              }
            ],
            textList: [
              {
                text: '文档/白板涂鸦演示',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '弹幕聊天',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '公告/禁言/踢出',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '直播打赏',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '邀请卡',
                isStandard: false,
                isFlagship: true,
                isProfessional: false
              },
              {
                text: '嘉宾远程实时切换',
                isStandard: false,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '签到/抽奖/投票',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '私密问答/私信聊天',
                isStandard: false,
                isFlagship: true,
                isProfessional: true
              }
            ]
          },
          {
            labelList: [
              {
                label: '营销推广'
              },
              {
                label: ''
              },
              {
                label: ''
              },
              {
                label: ''
              }
            ],
            textList: [
              {
                text: '社交平台',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '广告位',
                isStandard: false,
                isFlagship: false,
                isProfessional: true
              },
              {
                text: '问卷调查',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              }
            ]
          },
          {
            labelList: [
              {
                label: '数据挖掘'
              },
              {
                label: ''
              },
              {
                label: ''
              },
              {
                label: ''
              }
            ],
            textList: [
              {
                text: '直播数据统计',
                isStandard: true,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '可视化报告',
                isStandard: false,
                isFlagship: true,
                isProfessional: true
              },
              {
                text: '数据导出',
                isStandard: false,
                isFlagship: true,
                isProfessional: false
              }
            ]
          }
        ]
      };
    },
    components: {
      PageTitle
    }
  };
</script>
<style lang="less" scoped>
  .order-detail {
    width: 100%;
    .version-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .version-item {
        width: 32%;
        height: 248px;
        background: #fff;
        border: 4px;
        position: relative;
        text-align: center;
        padding: 40px 0;
        span {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 4px;
          display: inline-block;
          width: 100%;
          height: 4px;
          background: #fc615b;
        }
        h1 {
          font-size: 32px;
          color: #fc615b;
          line-height: 40px;
          font-weight: 500;
          padding-bottom: 24px;
        }
        p {
          font-size: 14px;
          color: #666;
          line-height: 22px;
          font-weight: 400;
        }
        h2 {
          width: 152px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          border: 1px solid #5d81fb;
          margin: auto;
          margin-top: 20px;
          cursor: pointer;
        }
      }
    }
    .version-card {
      margin-top: 40px;
      background: #fff;
      padding: 24px;
      // .version-list{
      //   // padding: 24px;
      // }
      .version-title,
      .version-list-text {
        height: 64px;
        background: #f7f7f7;
        line-height: 64px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .version-title-item {
          width: 25%;
          text-align: center;
          font-size: 18px;
          color: #1a1a1a;
          font-weight: 600;
          &:first-child {
            text-align: left;
            padding-left: 24px;
          }
        }
      }
      .version-list-text {
        background: #fff;
        border-bottom: 1px solid #e6e6e6;
        .version-text-item {
          width: 25%;
          // border: 1px solid #ccc;
          color: #1a1a1a;
          font-size: 14px;
          text-align: center;
          // border-bottom: 1px solid #E6E6E6;
          i {
            color: #fb3a32;
            font-size: 20px;
            font-weight: bolder;
          }
          &:first-child {
            text-align: left;
            padding-left: 24px;
          }
        }
        &:last-child {
          border: 0;
        }
      }
    }
  }
</style>
