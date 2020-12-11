<template>
  <div class="base-data">
    <div class="base-title">
      <span><b></b>基础统计</span>
      <el-tooltip effect="dark" placement="right-start">
         <div slot="content">
          1.预约人数：统计预告状态下有多少人预约了当前活动，数据统计不去重<br />2.报名表单：应用在直播整个环节（预告+直播+回放），统计当前活动多少人进行报名，数据去重
          <br>3.试看：回放或点播观看限制设置试看后，统计多少人进行了试看，数据去重<br>4.邀请排名：所有生成过邀请卡的观众都参与此排名；邀请人数相同的，按邀请人首次观看时间排名<br>5.分享用户分享的链接被他人访问1次有效分享数记为1，同设备当天重复访问只统计1次，统计范围：微信、微博、QQ
        </div>
        <el-button circle icon="el-icon-question" class="button-tip"></el-button>
      </el-tooltip>
    </div>
    <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item" v-if="isStatus!= 4">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_yuyue"></icon>
            <div class="base-text">
              <span>预约（人）</span>
              <h1>123
                 <!-- <count-to :startVal="0"
                  :endVal="mainKeyData.total"
                  :duration="1500"
                  v-if="mainKeyData.total >= 0">
                </count-to> -->
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_baomingbiaodan"></icon>
            <div class="base-text">
              <span>报名表单（人）</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p>导出</p>
          <div class="base-main">
           <icon icon-class="saasicon_shikan"></icon>
            <div class="base-text">
              <span>试看（人）</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="lookOption('邀请排名')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_yaoqingpaiming"></icon>
            <div class="base-text">
              <span>邀请排名（人）</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_fenxiangpaiming"></icon>
            <div class="base-text">
              <span>分享排名（条）</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="base-title">
      <span><b></b>互动统计</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.聊天：统计当前活动总计发送了多少条聊天，支持查看明细<br />2.问答：开启问答后，当前活动总计发送了多少条问答，支持查看明细
          <br>3.点赞：当前活动总计收到多少次点赞，数据统计不去重<br>4.签到：推送签到后，统计多少人进行了签到，支持查看明细<br>5.问卷：推送问卷后，统计多少人填写了问卷，支持查看明细
          <br>6.抽奖：推送抽奖后，统计多少人中奖，支持查看明细<br>7.发群红包：发送红包后，统计发送红包的金额，支持查看明细<br>8.打赏：观众对当前活动打赏的金额统计<br>9.礼物：观众对当前活动赠送礼物的金额统计<br>10.连麦：互动活动支持，统计多少条连麦数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
     <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item">
          <p @click="lookOption('聊天')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_liaotian"></icon>
            <div class="base-text">
              <span>聊天</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('问答')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_wenda"></icon>
            <div class="base-text">
              <span>问答</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
         <div class="base-item">
          <div class="base-main">
            <icon icon-class="saasicon_dianzan"></icon>
            <div class="base-text">
              <span>点赞(次)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('签到')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_qiandao"></icon>
            <div class="base-text">
              <span>签到(人)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('问卷')">查看</p>
         <div class="base-main">
            <icon icon-class="saasicon_wenjuan"></icon>
            <div class="base-text">
              <span>问卷(人)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('抽奖')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_choujiang"></icon>
            <div class="base-text">
              <span>抽奖(人)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('发群红包')">查看</p>
         <div class="base-main">
            <icon icon-class="saasicon_hongbao"></icon>
            <div class="base-text">
              <span>发群红包(元)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_dashang"></icon>
            <div class="base-text">
              <span>打赏(元)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_liwu"></icon>
            <div class="base-text">
              <span>礼物(元)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_lianmai"></icon>
            <div class="base-text">
              <span>连麦(条)</span>
              <h1>351</h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import CountTo from 'vue-count-to';
export default {
  data() {
    return {
    };
  },
  components: {
    // CountTo
  },
  props: {
    isStatus: {
      type: Number,
      default: 1
    }
  },
  methods: {
    lookOption(title) {
      this.$router.push({
        path: '/interactionDetail',
        query: {
          id: 1,
          title: title
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
  .base-data{
    padding: 0 15px;
    /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle{
      padding:3px;
    }
    .base-title{
      margin-bottom: 12px;
      span{
        display: inline-block;
        font-size: 20px;
        color:#333333;
        line-height: 20px;
        b{
          float: left;
          width: 4px;
          height: 18px;
          background:#FB3A32;
          margin-right: 5px;
          margin-top: 2px;
        }
      }
    }
    .liveItem{
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      // justify-content: space-between;
      .base-item{
        height: 120px;
        width: 324px;
        margin-bottom: 24px;
         margin-right: 24px;
        position: relative;
        border-radius: 8px;
        background: #fff;
        p{
          position: absolute;
          font-size: 12px;
          top: 10px;
          right:16px;
          color: #666;
          cursor: pointer;
        }
        .base-main{
          height: 100%;
          margin: 30px 0 0 36px;
          display: flex;
          /deep/.svg-icon{
            font-size: 45px;
          }
          .base-text{
            margin-left: 15px;
            span{
              color:#666;
            }
            h1{
              font-size: 36px;
              color:#1A1A1A;
              font-weight: bold;
              line-height: 42px;
            }
          }
        }
      }
    }
  }
</style>
