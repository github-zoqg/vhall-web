<template>
  <div class="base-data">
    <div class="base-title">
      <span>基础统计</span>
      <el-tooltip effect="dark" placement="right-start">
         <div slot="content">
          1.预约人数：统计预告状态下有多少人预约了当前活动，数据统计不去重<br />2.报名表单：应用在直播整个环节（预告+直播+回放），统计当前活动多少人进行报名，数据去重
          <br>3.试看：回放或点播观看限制设置试看后，统计多少人进行了试看，数据去重<br>4.邀请排名：所有生成过邀请卡的观众都参与此排名；邀请人数相同的，按邀请人首次观看时间排名<br>5.分享用户分享的链接被他人访问1次有效分享数记为1，同设备当天重复访问只统计1次，统计范围：微信、微博、QQ
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
        <div class="base-item" v-if="isStatus===1">
          <p>预约<span>导出</span></p>
          <div class="base-main">
            <b>100</b>人
          </div>
        </div>
        <div class="base-item">
          <p>报名表单<span>导出</span></p>
          <div class="base-main">
            <b>10</b>人
          </div>
        </div>
        <div class="base-item">
          <p>试看<span>导出</span></p>
          <div class="base-main">
            <b>10</b>人
          </div>
        </div>
        <div class="base-item">
          <p>邀请排名<span @click="lookOption('邀请排名')">查看</span></p>
          <div class="base-main">
            <b>10</b>
          </div>
        </div>
        <div class="base-item">
          <p>分享排名<span>导出</span></p>
          <div class="base-main">
            <b>10</b>条
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="base-title">
      <span>互动统计</span>
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
          <p>聊天<span @click="lookOption('聊天')">查看</span></p>
          <div class="base-main">
            <b>100</b>条
          </div>
        </div>
        <div class="base-item" v-if="isStatus===1">
          <p>问答<span @click="lookOption('问答')">查看</span></p>
          <div class="base-main">
            <b>1000000000</b>条
          </div>
        </div>
         <div class="base-item">
          <p>点赞<span></span></p>
          <div class="base-main">
            <b>10</b>万次
          </div>
        </div>
         <div class="base-item" v-if="isStatus===1">
          <p>签到<span @click="lookOption('签到')">查看</span></p>
          <div class="base-main">
            <b>1034</b>人
          </div>
        </div>
         <div class="base-item" v-if="isStatus===1">
          <p>问卷<span @click="lookOption('问卷')">查看</span></p>
          <div class="base-main">
            <b>10</b>人
          </div>
        </div>
         <div class="base-item" v-if="isStatus===1">
          <p>抽奖<span @click="lookOption('抽奖')">查看</span></p>
          <div class="base-main">
            <b>10</b>人
          </div>
        </div>
        <div class="base-item" v-if="isStatus===1">
          <p>发群红包<span @click="lookOption('发群红包')">查看</span></p>
          <div class="base-main">
            <b>10</b>元
          </div>
        </div>
        <div class="base-item">
          <p>打赏<span>导出</span></p>
          <div class="base-main">
            <b>10</b>元
          </div>
        </div>
        <div class="base-item">
          <p>礼物<span>导出</span></p>
          <div class="base-main">
            <b>10</b>元
          </div>
        </div>
         <div class="base-item" v-if="isStatus===1">
          <p>连麦<span>导出</span></p>
          <div class="base-main">
            <b>10</b>条
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
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
        path: '/interaction-detail',
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
    background: #fff;
    padding: 30px 15px;
    /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle{
      padding:3px;
    }
    .liveItem{
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      .base-item{
        height: 175px;
        width: 30%;
        border: 1px solid #ccc;
        margin: 20px 30px 10px 0;
        padding: 10px 10px;
        p{
          position: relative;
          span{
            position: absolute;
            top: 0px;
            right:10px;
            cursor: pointer;
          }
        }
        .base-main{
          height: 100%;
          padding-top: 20%;
          text-align: center;
        }
      }
    }
  }
</style>
