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
          <p @click="exportSubscribeInfo">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_yuyue"></icon>
            <div class="base-text">
              <span>预约（人）</span>
              <h1>
                 <count-to :startVal="0"
                  :endVal="dataInfo.subscribeNum"
                  :duration="1500"
                  v-if="dataInfo.subscribeNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="exportAnswer">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_baomingbiaodan"></icon>
            <div class="base-text">
              <span>报名表单（人）</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.answerNum"
                  :duration="1500"
                  v-if="dataInfo.answerNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="exportPreviewInfo">导出</p>
          <div class="base-main">
           <icon icon-class="saasicon_shikan"></icon>
            <div class="base-text">
              <span>试看（人）</span>
              <h1>
                 <count-to :startVal="0"
                  :endVal="dataInfo.previewNum"
                  :duration="1500"
                  v-if="dataInfo.previewNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="lookOption('邀请排名')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_yaoqingpaiming"></icon>
            <div class="base-text">
              <span>邀请排名（人）</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.inviteNum"
                  :duration="1500"
                  v-if="dataInfo.inviteNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="exportShare">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_fenxiangpaiming"></icon>
            <div class="base-text">
              <span>分享排名（条）</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.shareNum"
                  :duration="1500"
                  v-if="dataInfo.shareNum >= 0">
                </count-to>
              </h1>
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
              <span>聊天(条)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.chatNum"
                  :duration="1500"
                  v-if="dataInfo.chatNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('问答')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_wenda"></icon>
            <div class="base-text">
              <span>问答(条)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.recordNum"
                  :duration="1500"
                  v-if="dataInfo.recordNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
         <div class="base-item">
          <div class="base-main">
            <icon icon-class="saasicon_dianzan"></icon>
            <div class="base-text">
              <span>点赞(次)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.likeNum"
                  :duration="1500"
                  v-if="dataInfo.likeNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('签到')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_qiandao"></icon>
            <div class="base-text">
              <span>签到(人)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.signNum"
                  :duration="1500"
                  v-if="dataInfo.signNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('问卷')">查看</p>
         <div class="base-main">
            <icon icon-class="saasicon_wenjuan"></icon>
            <div class="base-text">
              <span>问卷(人)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.submitNum"
                  :duration="1500"
                  v-if="dataInfo.submitNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('抽奖')">查看</p>
          <div class="base-main">
            <icon icon-class="saasicon_choujiang"></icon>
            <div class="base-text">
              <span>抽奖(人)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.prizeNum"
                  :duration="1500"
                  v-if="dataInfo.prizeNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus!=4">
          <p @click="lookOption('发群红包')">查看</p>
         <div class="base-main">
            <icon icon-class="saasicon_hongbao"></icon>
            <div class="base-text">
              <span>发群红包(元)</span>
              <h1>{{ dataInfo.redpacketMoney }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="exportReward">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_dashang"></icon>
            <div class="base-text">
              <span>打赏(元)</span>
              <h1>{{ dataInfo.rewardMoney }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item">
          <p @click="exportGift">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_liwu"></icon>
            <div class="base-text">
              <span>礼物(元)</span>
              <h1>
              {{ dataInfo.gitMoney }}
              </h1>
            </div>
          </div>
        </div>
         <div class="base-item" v-if="isStatus!=4&&webinarType==3">
          <p @click="exportSpeak">导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_lianmai"></icon>
            <div class="base-text">
              <span>连麦(条)</span>
              <h1>
                <count-to :startVal="0"
                  :endVal="dataInfo.speakNum"
                  :duration="1500"
                  v-if="dataInfo.speakNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CountTo from 'vue-count-to';
export default {
  data() {
    return {
      dataInfo: {
        previewNum: 0,
        answerNum: 0,
        subscribeNum: 0, //预约
        recordNum: 0,
        rewardMoney: 0,
        redpacketMoney: 0,
        gitMoney: 0,
        prizeNum: 0,
        inviteNum: 0,
        shareNum: 0,
        chatNum: 0,
        likeNum: 0,
        signNum: 0,
        submitNum: 0,
        speakNum: 0,
      }
    };
  },
  components: {
    CountTo
  },
  props: {
    isStatus: {
      type: Number,
      default: 1
    },
    webinarType: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    this.roomId = this.$route.query.roomId;
    this.getAllDataInfo();
  },
  methods: {
    getAllDataInfo() {
      // 预约  报名表单（人）  试看（人）
      this.$fetch('getAnswerListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.previewNum = res.data.preview;
        this.dataInfo.subscribeNum = res.data.subscribe;
        this.dataInfo.answerNum = res.data.regform;
      });
      // 邀请排名
      this.$fetch('getInviteListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.inviteNum = res.data.total;
      });
      // 分享排名
      this.$fetch('getShareListInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.shareNum = res.data.total;
      });
      // 聊天
      this.$fetch('getChatListInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.chatNum = res.data.total;
      });
      //问答
      this.$fetch('getRecodrderInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.recordNum = res.data.total;
      });
      // 点赞
      this.$fetch('getRoomLikeInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.likeNum = res.data.total;
      });
      // 签到
      this.$fetch('getSignInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.signNum = res.data.total;  //报错
      });
      // 问卷提交人数
      this.$fetch('getSurveyInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.submitNum = res.data.submit_nums;
      });
      // 获取抽奖人数
      this.$fetch('getPrizeUserInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.prizeNum = res.data.count;
      });
       // 发红包
      this.$fetch('getRedpacketInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.redpacketMoney = res.data.send_amount;
      });
      // 打赏统计
      this.$fetch('getRewardListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.rewardMoney = res.data.total_money;
      });
      // 礼物(元)
      this.$fetch('getGiftIncome', {room_id: this.roomId}).then(res => {
        this.dataInfo.gitMoney = res.data.total_money;
      });
      // 连麦(条)
      if (this.webinarType == 3) {
        this.$fetch('getSpeakListInfo', {room_id: this.roomId}).then(res => {
          this.dataInfo.speakNum = res.data.total;
        });
      }

    },
    // 预约-导出
    exportSubscribeInfo() {
      this.$fetch('exportSubscribe',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 试看-导出
    exportPreviewInfo() {
      this.$fetch('exportPreview',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 分享导出
    exportShare() {
      this.$fetch('exportShareInfo',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    //报名表单导出
    exportAnswer() {
      this.$fetch('exportForm',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
     //打赏---导出
    exportReward() {
      this.$fetch('exportReward',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 礼物---导出
    exportGift() {
      this.$fetch('exportGift',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 连麦---导出
    exportSpeak() {
       this.$fetch('exportSpeak',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    lookOption(title) {
      this.$router.push({
        path: '/live/interactionDetail',
        query: {
          roomId: this.roomId,
          id: this.$route.params.str,
          title: title
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
  .base-data{
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
        width: 323px;
        margin-bottom: 24px;
        margin-right: 24px;
        position: relative;
        border-radius: 8px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:nth-child(4n) {
          margin-right: 24px;
        }
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
            font-size: 38px;
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
              padding-top: 5px;
              span{
                color:#1A1A1A;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (min-width: 1920px) {
    .base-data .liveItem .base-item{
      &:nth-child(3n) {
        margin-right: 24px;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
</style>
