<template>
  <div class="base-data">
    <div class="base-title">
      <span><b></b>基础统计</span>
      <el-tooltip effect="dark" placement="right-start">
         <div slot="content">
          1.预约人数：统计预告状态下有多少人预约了当前活动，数据统计不去重<br />2.报名表单：应用在直播整个环节（预告+直播+回放），统计当前活动多少人进行报名，数据去重
          <br>3.试看：回放或点播观看限制设置试看后，统计多少人进行了试看，数据去重<br>4.邀请排名：所有生成过邀请卡的观众都参与此排名；邀请人数相同的，按邀请人首次观看时间排名<br>5.分享用户分享的链接被他人访问1次有效分享数记为1，同设备当天重复访问只统计1次，统计范围：微信、微博、QQ
        </div>
        <i class="iconfont-v3 saasicon_help_m"></i>
      </el-tooltip>
    </div>
    <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item" v-if="isStatus!= 4" @click="exportSubscribeInfo">
          <p>导出</p>
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
        <div class="base-item" @click="exportAnswer">
          <p>导出</p>
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
        <div class="base-item" @click="exportPreviewInfo">
          <p>导出</p>
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
        <div class="base-item" @click="lookOption('邀请排名')">
          <p>查看</p>
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
        <div class="base-item" @click="exportShare">
          <p>导出</p>
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
        <i class="iconfont-v3 saasicon_help_m"></i>
      </el-tooltip>
    </div>
    <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item" @click="lookOption('聊天')">
          <p>查看</p>
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
        <div class="base-item" v-if="isStatus!=4" @click="lookOption('问答')">
          <p >查看</p>
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
         <div class="base-item" style="cursor: default;">
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
         <div class="base-item" v-if="isStatus!=4" @click="lookOption('签到')">
          <p>查看</p>
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
         <div class="base-item" v-if="isStatus!=4"  @click="lookOption('问卷')">
          <p>查看</p>
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
         <div class="base-item" v-if="isStatus!=4" @click="lookOption('抽奖')">
          <p>查看</p>
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
        <div class="base-item" v-if="isStatus!=4" @click="lookOption('发群红包')">
          <p>查看</p>
         <div class="base-main">
            <icon icon-class="saasicon_hongbao"></icon>
            <div class="base-text">
              <span>发群红包(元)</span>
              <h1>{{ dataInfo.redpacketMoney }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportReward">
          <p>导出</p>
          <div class="base-main">
            <icon icon-class="saasicon_dashang"></icon>
            <div class="base-text">
              <span>打赏(元)</span>
              <h1>{{ dataInfo.rewardMoney }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item"  @click="exportGift">
          <p>导出</p>
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
         <div class="base-item" v-if="isStatus!=4&&webinarType==3" @click="exportSpeak">
          <p>导出</p>
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
  watch: {
    webinarType() {
      if (this.webinarType == 3) {
        this.speakContactInfo();
      }
    }
  },
  mounted() {
    this.roomId = this.$route.query.roomId;
    this.getAllDataInfo();
     if (this.isStatus != 4) {
      // 点播不需要调用
      this.getOtherInfo();
    }
  },
  methods: {
    getAllDataInfo() {
      // 预约  报名表单（人）  试看（人）
      this.$fetch('getAnswerListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.previewNum = res.data.preview || 0;
        this.dataInfo.subscribeNum = res.data.subscribe || 0;
        this.dataInfo.answerNum = res.data.regform || 0;
      });
      // 邀请排名
      this.$fetch('getInviteListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.inviteNum = res.data.total || 0;
      });
      // 分享排名
      this.$fetch('getShareListInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.shareNum = res.data.total || 0;
      });
      // 聊天
      this.$fetch('getChatListInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.chatNum = res.data.total || 0;
      });
      // 点赞
      this.$fetch('getRoomLikeInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.likeNum = res.data.total || 0;
      });
      // 打赏统计
      this.$fetch('getRewardListInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.rewardMoney = res.data.total_money || 0;
      });
      // 礼物(元)
      this.$fetch('getGiftIncome', {room_id: this.roomId}).then(res => {
        this.dataInfo.gitMoney = res.data.total_money || 0;
      });
    },
    getOtherInfo() {
      //问答
      this.$fetch('getRecodrderInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.recordNum = res.data.total || 0;
      });
       // 签到
      this.$fetch('getSignInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.signNum = res.data.total || 0;
      });
      // 问卷提交人数
      this.$fetch('getSurveyInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.submitNum = res.data.submit_nums || 0;
      });
      // 获取抽奖人数
      this.$fetch('getPrizeUserInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.prizeNum = res.data.count || 0;
      });
       // 发红包
      this.$fetch('getRedpacketInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.dataInfo.redpacketMoney = res.data.send_amount || 0;
      });
    },
    // 连麦(条)
    speakContactInfo() {
      this.$fetch('getSpeakListInfo', {room_id: this.roomId}).then(res => {
        this.dataInfo.speakNum = res.data.total || 0;
      });
    },
    // 预约-导出
    exportSubscribeInfo() {
      this.$fetch('exportSubscribe',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 试看-导出
    exportPreviewInfo() {
      this.$fetch('exportPreview',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 分享导出
    exportShare() {
      this.$fetch('exportShareInfo',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    //报名表单导出
    exportAnswer() {
      this.$fetch('exportForm',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
     //打赏---导出
    exportReward() {
      this.$fetch('exportReward',{webinar_id: this.$route.params.str}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 礼物---导出
    exportGift() {
      this.$fetch('exportGift',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
      })
    },
    // 连麦---导出
    exportSpeak() {
       this.$fetch('exportSpeak',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
        this.$EventBus.$emit('saas_vs_download_change');
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
      i{
          font-size: 14px;
          padding: 0 2px;
        }
    }
    .liveItem{
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      // margin-right: -24px;
      // align-items: center;
      .base-item{
        height: 120px;
        width: 323px;
        margin-bottom: 24px;
        margin-right: 24px;
        position: relative;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:nth-child(4n) {
          margin-right: 24px;
        }
        p{
          position: absolute;
          font-size: 12px;
          top: 14px;
          right:16px;
          color: #666;
        }
        .base-main{
          height: 100%;
          margin: 30px 0 0 36px;
          display: flex;
          /deep/.svg-icon{
            font-size: 38px;
            color: #FB3A32;
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
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
