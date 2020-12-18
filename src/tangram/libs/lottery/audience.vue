<template>
  <div class="audience-wrap">
    <div class="audience-icon" v-if="showLottery">
      <img @click="lookLottery" src="../../../common/images/h5-show-phone-logo2x.png" alt="">
    </div>
    <div class="vhall-lottery" v-if="showMess">
      <div class="payment-dialog">
        <div class="payment-title">
          <span class="payment-title--text">{{ processingObj.title }}</span>
          <span class="payment-title--close iconfont iconguanbi" @click="close"></span>
        </div>
        <!-- 抽奖进行中 -->
        <div class="prize-pending" v-if="lotteryInfo.lottery_status==0 || !lotteryResultShow">
          <img :src="`${domains.upload}/${processingObj.url}`" alt />
          <p>{{processingObj.text ? processingObj.text : '抽奖进行中....'}}</p>
          <div class="audience-code" v-if="lotteryInfo.lottery_type == 8">
            <p>发送口令<span>“{{lotteryInfo.command}}”</span>参与抽奖吧！</p>
            <el-button class="common-but" @click="participate">立即参与</el-button>
          </div>
        </div>
        <!-- 抽奖结果 -->
        <div class="lottery-result " v-if="lotteryResultShow == 1">
          <div v-if="lotteryInfo.lottery_status==1">
            <div class="recive-prize"  v-if="lotteryStep == 2" >
              <p class="title">请填写您的领奖信息，方便主办方与您联系。</p>
              <el-form ref="forms" class="form-style">
                <el-form-item >
                  <el-input class="beforeStar"  required v-model="reciveInfo.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input class="beforeStar"  v-model="reciveInfo.tel" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input type="textarea" :rows="2" placeholder="请输入地址" v-model="reciveInfo.remarks"> </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="submitInfo" class="common-but reward-submmit">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="Audience-one" v-show="lotteryStep == 1 || lotteryStep == 3">
              <img class="title-img" :src="$img" alt="">
              <p :class="{'winning-status': submitWinning}">{{ audienceText }}</p>
            </div>
            <el-button @click="getAward" class="common-but">{{ getReward }}</el-button>
          </div>
        </div>
      </div>
      <!-- 领奖信息 -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomId: {
      type: String
    },
    domains:{
      type: Object
    },
    isEmbed:{
      type: String
    },
    webinarId:{
      type: [String,Number]
    }
  },
  data() {
    return {
      reciveInfo: {
        // 领奖人信息
        name: '',
        tel: '',
        remarks: ''
      },
      getReward: '查看中奖名单',
      WinningList: false, // 中奖名单
      repeatWinning: false ,// 重复中奖
      participationPass: '', // 口令
      disabledTime: 5, // 5秒禁止点击
      audienceText: '信息提交成功',
      isWinning: false,// 是否中奖
      submitWinning: true, // 信息是否提交成功
      lotteryStep: 1 ,// 领奖到哪一步
      processingObj:{}, // 抽奖的标题信息
      lotteryInfo: {}, // 抽奖的详细信息
      showMess: false,
      prizeShow: false, //抽奖显示页
      chatLoginStatus: false, //是否需要登录
      lotteryResultShow: false, //
      showLottery:false, // 观看端打赏展示
    };
  },
  watch: {
    isWinning(newValue, oldValue){
      console.warn('isWinning',newValue, oldValue, '发生变化');
      if(newValue){
        this.$nextTick(()=>{
          this.audienceText = '中奖啦！恭喜您获得“黑碳科技立体电子魔方';
          this.isWinning = true;
          this.getReward = '点击领奖';
        });
      }else{
        this.$nextTick(()=>{
          this.getReward = '查看中奖名单';
          this.isWinning = false;
          this.audienceText = '很遗憾，您与大奖擦肩而过，感谢您的参与！';
        });
      }
    }
  },
  created() {
    this.checkLottery()
    // 1--是需要登录才能参与互动   0--不登录也能参与互动
    if (sessionStorage.getItem('watch')) {
      if (JSON.parse(sessionStorage.getItem('moduleShow')).modules.chat_login.show == 1) {
        if ( JSON.parse(sessionStorage.getItem('authInfo')).length == undefined || this.isEmbed
        ) {
          // 登录状态
          this.chatLoginStatus = false;
        } else {
          // 非登录状态
          this.chatLoginStatus = true;
        }
      } else {
        this.chatLoginStatus = false;
      }
    }
  },
  methods: {
    close(){
      this.showMess = false
    },
    // 点击领奖
    getAward () {
      // if (this.hasAward) {
      //   this.lotteryResultShow = false; // 抽奖结果
      //   this.lotteryContentShow = false; // 发起抽奖
      //   this.prizeShow = false; // 趣味抽奖
      //   this.payoff = false;
      // }
    },
    // 检测当前是否在抽奖
    checkLottery(){
      this.$fetch('v3CheckLottery', {}).then(res=>{
        if(res.code == 200){
          console.warn(res.data, '检测当前是否在抽奖');
          this.lotteryInfo = res.data
          this.processingObj = {
              url: res.data.icon,
              text: res.data.remark,
              title: res.data.title
          }
          if(res.data){
            this.showLottery = true
          }
          if(res.data.lottery_status == 0){
            // 当前正在抽奖
            this.prizeShow = true
            this.lotteryContentShow = false
          }else{
            // 当前不存在抽奖
            this.lotteryResultShow = true
            this.isWinning = res.data.win == 0
            console.warn(this.isWinning, 'his.isWinning');
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    lookLottery(){
      this.showMess = true
    },
    // 观看端开启
    startLottery (val) {
      this.showMess = true
    },
    getStepText(){
      this.$fetch('v3GetStep',{
        webinar_id: this.webinarId
      }).then(res=>{
        if(res.code == 200){
          console.warn('获取当前页面中奖以后', res.data);
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    endRecive(msg, WinningID){
      console.warn(msg, WinningID, '中奖信息----');
      if (msg.lottery_winners.find(item => item.lottery_user_id == WinningID)) {
        this.lotteryResultShow = true
        this.getStepText()
        this.isWinning = true
        let awardUserId = this.lotteryEndResult.find(
          item => item.lottery_user_id == ownerId
        );
      }
      this.lotteryStep = 1
    },
    participate(){
      if(this.lotteryInfo.lottery_type == 8){
        if(this.chatLoginStatus){
          this.$parent.NoLogin();
        }else{
          window.chatSDK.emit(_data, _content)
        }
      }
      this.$fetch('v3PartLottery', {
        room_id: this.roomId,
        lottery_id: this.lotteryInfo.id
      }).then(res=>{
        if(res.code ==200) {
          console.warn('立即抽奖', res.data);
        } else {
          this.$message.warning(res.msg)
        }
      })
    }
  },
};
</script>
<style lang="less" scoped>
.audience-wrap{
  border: 1px solid red;
  .audience-icon{
    width: 40px;
    height: 40px;
    img{
      display: inline-block;
      width: 100%;
    }
  }
}

.vhall-lottery /deep/{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .el-form-item__label{
    color: #555;
  }
  .payment-dialog {
    width: 468px;
    position: fixed;
    left: 50%;
    margin-left: -300px;
    top: 50%;
    margin-top: -200px;
    background: #fff;
    border-radius: 4px;
    z-index: 777;

    .payment-title {
      color: #333;
      height: 40px;
      line-height: 40px;
      font-weight: 500;
      border-bottom: 1px solid #d9d9d9;
      background: #f4f4f4;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      background: white;

      &--close {
        position: absolute;
        right: 15px;
        /* top: 50%; */
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 11px;
        top: 50%;
        /* background: url('../../assets/images/common/icon.png') no-repeat 0 -91px; */
        /* background-position: 0 -91px; */
        /* background-size: 18px; */
        cursor: pointer;
      }

      .lottery-headleft {
        background: #6d6d6d;
        color: #fff;
        justify-content: flex-start;
      }
    }

    .lottery-dialog-content {
      padding: 30px 15px 25px 15px;
      display: flex;
      justify-content: center;
      .repeat-winning{
        margin-bottom: 12px;;
        .el-switch{
          margin-right: 8px;
        }
        span{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 20px;
        }
      }
    }

    .lottery-payment {
      font-size: 12px;
      color: #444;
      margin-bottom: 0;
      span {
        color: #eb6663;
      }
    }
    .el-input-group__append{
      padding: 0;
      color: #555555;
      width: 63px;
      &:hover {
        color: #fff;
        background: #fc5659;
      }
    }
    .lottery-start {
      color: #fff;
      background: #fc5659;
      display: block;
      border: 0px;
      margin: 0 auto;
      &:hover {
        background: #c51f1d;
      }
    }
    .prize-pending {
      text-align: center;
      margin-bottom: 32px;
      img {
        display: block;
        width: 222px;
        height: 222px;
        margin: 30px auto 15px;
      }
      p {
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #444;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FC5659;
        margin-bottom: 24px;
        line-height: 18px;
      }
    }

    .lottery-result {
      background: #fff;
      margin-bottom: 32px;
      .result-img{
        text-align: center;
        img{
          width: 80px;
          height: 80px;
          margin: 32px auto 8px;
          border-radius: 50%;
        }
        p{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
          margin-bottom: 12px;
        }
      }
      .result-table-head{
        text-align: center;
        background: #F5F5F5;
        width: 396px;
        line-height: 42px;
        margin: 0 auto;
        border-radius: 8px 8px 0px 0px;
        border-bottom: 1px solid #fff;
      }
      ul {
        width: 396px;
        margin: 0 auto;
        margin-bottom: 16px;
        max-height: 500px;
        overflow-y: auto;
        background: #F5F5F5;
        li {
          width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 42px;
          padding-left: 20px;
          line-height: 42px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
          img{
            width: 24px;
            height: 24px;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
      }

      .lottery-chat {
        width: 100%;
        text-align: center;
      }
      .lottery-reward {
        display: block;
        width: 314px;
        height: 40px;
        background: #ffc217;
        color: #fff;
        font-size: 16px;
        margin: 0 auto;
        border: none;
        margin-bottom: 20px;
      }
      .common-but{
        margin: 0 auto!important;
      }
    }

    .recive-prize {
      .title{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        line-height: 20px;
        margin: 32px auto 14px;
        text-align: left;
        width: 356px;
      }
      .form-style {
        width: 356px;
        margin: 0 auto;
      }
      .common-but:hover {
        background: #fe6a6a;
        color: #fff;
      }
    }
  }
}
.audience-code{
  p{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 18px;
    margin-bottom: 24px;
    span{
      color: rgba(252, 86, 89, 1);
    }
  }
}
::v-deep .el-select-dropdown__list .el-select-dropdown__item.selected{
  color: rgba(252, 86, 89, 1)!important;
}
// -------
.Audience-one{
  text-align: center;
  margin: 0 auto;
  img{
    margin: 42px auto 24px;
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  p{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 22px;
    margin-bottom: 48px;
  }
  .winning-status{
    color: #FC5659;
  }
}
</style>
