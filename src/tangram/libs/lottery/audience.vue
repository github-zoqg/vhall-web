<template>
  <div class="audience-wrap">
    <div class="audience-icon" v-if="showLottery">
      <img @click="lookLottery" src="../../../common/images/h5-show-phone-logo2x.png" alt="">
    </div>
    <div class="vhall-lottery" v-if="showMess">
      <div class="payment-dialog">
        <div class="payment-title">
          <span class="payment-title--text">{{ processingObj.title ? processingObj.title : '抽奖' }}</span>
          <span class="payment-title--close iconfont iconguanbi" @click="close"></span>
        </div>
        <!-- 抽奖中 -->
        <div class="prize-pending" v-if="currentLotStatus">
          <img :src="processingObj.url ? processingObj.url : defaultImg" alt />
          <p>{{processingObj.text ? processingObj.text : '抽奖进行中....'}}</p>
          <div class="audience-code" v-if="lotteryInfo.lottery_type == 8">
            <p>发送口令<span>“{{lotteryInfo.command}}”</span>参与抽奖吧！</p>
            <el-button class="common-but" @click="participate" :disabled='codeText !="立即参与"'>{{codeText}}</el-button>
          </div>
        </div>
        <!-- 抽奖结束 -->
         <!-- v-if="lotteryInfo.lottery_status==1" -->
        <div class="lottery-result " v-if="!currentLotStatus">
          <div style="text-align: center;">
            <div class="recive-prize"  v-if="lotteryStep == 2" >
              <p class="title">请填写您的领奖信息，方便主办方与您联系。</p>
              <el-form ref="forms" class="form-style">
                <el-form-item :label="item.field" :required='item.is_required == 1' v-for="(item, index) in stepHtmlList" :key="index">
                  <el-input  v-model="reciveInfo[item.field_key]" :placeholder="`请输入${item.field}`"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="Audience-one" v-show="lotteryStep == 1 || lotteryStep == 3">
              <img class="title-img" :src="promptImg" alt="">
              <p :class="{'winning-status': submitWinning}">{{ audienceText }}</p>
            </div>
            <template  v-if="lotteryStep == 4">
              <Result :domains='domains' :lotteryResultObj='lotteryResultObj' :prizeObj='prizeObj' :lotteryEndResult='lotteryEndResult'></Result>
            </template>
            <el-button v-if="showButton" @click="getAward" class="common-but">{{ getReward }}</el-button>
          </div>
        </div>
      </div>
      <!-- 领奖信息 -->
    </div>
  </div>
</template>
<script>
import Result from './common/result'
import Msg from '../chat/js/msg-class';
import getAvatar from '../chat/js/get-avatar';
import { formatTime, handleTime } from '../chat/js/handle-time';
export default {
  components:{
      Result
  },
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
  computed:{
    showButton(){
      console.warn('this.lotteryStep的值发生变化------', this.lotteryStep, this.lotteryInfo.publish_winner);
      return this.lotteryStep==1 || this.lotteryStep==2 || this.lotteryInfo.publish_winner == 1 && this.lotteryStep==3
    }
  },
  data() {
    return {
      reciveInfo: {},// 领奖人信息
      getReward: '查看中奖名单',
      currentLotStatus: false, // 当前抽奖状态   true 代表正在抽奖    false代表未抽奖/抽奖已结束
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
      showLottery:false, //  观看端打赏展示
      promptImg: require('./img/win.png'),
      lotteryResultObj:{},
      defaultImg: require('./img/prize.gif'),
      stepHtmlList: [], // 领奖页信息
      codeText: '立即参与1'
    };
  },
  watch: {
    isWinning(newValue, oldValue){
      console.warn('isWinning',newValue, oldValue, '发生变化');
      if(newValue){
        this.$nextTick(()=>{
          this.audienceText = `中奖啦！恭喜您获得 ${this.lotteryInfo.award_snapshoot.award_name}`;
          this.promptImg = require('./img/win.png')
          this.isWinning = true;
          this.getReward = '点击领奖';
        });
      }else{
        this.$nextTick(()=>{
          this.getReward = '查看中奖名单';
          this.isWinning = false;
          this.promptImg = require('./img/noWin.png')
          this.audienceText = '很遗憾，您与大奖擦肩而过，感谢您的参与！';
          this.getReward = '查看中奖名单';
        });
      }
    }
  },
  created() {
    this.checkLottery()
    // 1--是需要登录才能参与互动   0--不登录也能参与互动
    if (sessionStorage.getItem('watch')) {
      if (JSON.parse(sessionStorage.getItem('moduleShow')).modules.chat_login.show == 1) {
        if ( sessionStorage.getItem('userInfo') || this.isEmbed
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
      this.lotteryStep = 1
    },
    // 点击领奖
    getAward () {
      console.warn(this.lotteryStep, '提交到哪一步');
      if(this.lotteryStep == 1){
        this.lotteryStep = 2
        if(this.getReward != '立即领奖'){
          console.warn('点击   进入下一步查看中奖名单');
          return
        }
        this.getReward = '提交';
      }else if(this.lotteryStep == 2){
        try {
          this.stepHtmlList.forEach((ele, index)=>{
            if(ele.is_required == 1 ){
              if(this.reciveInfo[ele.field_key] == ''){
                throw ele.field
              }
              if(ele.field_key == 'phone'){
                const phone = this.reciveInfo[ele.field_key].replace(/\s/g, '')
                let regs = /^1(3|4|5|6|7|8|9)\d{9}$/;
                if (!regs.test(phone)) {
                  throw '手机号格式错误'
                }
              }
            }
          })
        } catch (error) {
          this.$message.error(`请输入必填信息: ${error}`)
          return
        }
        let _lottery_user_remark = {}
        Object.keys(this.reciveInfo).map(ele=>{
          if(ele != 'name' && ele!='phone'){
            _lottery_user_remark[ele] = this.reciveInfo[ele]
          }
        })
        console.warn(this.lotteryInfo);
        this.$fetch('saveLotteryInfo', {
          room_id: this.roomId,
          lottery_id:  this.lotteryInfo.id,
          lottery_user_name: this.reciveInfo['name'],
          lottery_user_phone: this.reciveInfo['phone'],
          lottery_user_remark: _lottery_user_remark
        }).then(res => {
          this.$nextTick(()=>{
            this.lotteryStep = 3
            console.warn('走到第三步----', this.lotteryStep);
            this.getReward = '查看中奖名单';
            if (res.code === 200) {
              this.audienceText = '信息提交成功';
              this.lotteryInfo.take_award = 1
              this.promptImg = require('./img/summit.png')
            } else {
              this.audienceText = '信息提交失败';
              this.lotteryInfo.take_award = 0
              this.$message.warning(res.msg)
              this.promptImg = require('./img/submit_fail.png')
            }
          })
        });
      }else if(this.lotteryStep == 3){
        console.warn();
        this.$fetch('v3GetWineList', {
          room_id: this.roomId,
          lottery_id: this.lotteryInfo.id
        }).then(res=>{
          if (res.code === 200) {
            this.lotteryEndResult = res.data.list
            this.prizeObj = res.data.award_snapshoot
            this.lotteryStep = 4
            console.warn('获取到的中奖人列表---', res.data);
          } else {
            this.$message.warning(res.msg)
          }
        })
      }
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
          if(res.data.award_snapshoot.id){
            this.showLottery = true
          }
          if(res.data.lottery_status == 0){
            // 当前正在抽奖
            this.prizeShow = true
            this.lotteryContentShow = false
            this.currentLotStatus = true
          }else{
            // 当前不存在抽奖
            this.currentLotStatus = false
            this.isWinning = res.data.win == 1
            if(this.isWinning){
              this.getStepText()
            }
            console.warn(this.isWinning, 'his.isWinning');
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    lookLottery(){
      this.showMess = true
      console.warn(this.lotteryInfo, '获取当前的抽奖信息', this.currentLotStatus);
      if(this.currentLotStatus){
        // 抽奖中
        if(this.lotteryInfo.submit_command == 1 && this.lotteryInfo.lottery_type == 8){
          // 提交过口令
          this.codeText = '您已参与过'
        }else if(this.lotteryInfo.submit_command == 0 && this.lotteryInfo.lottery_type == 8){
          // 未提交过口令
          this.codeText = '立即参与'
        }
      }else{
        // 抽奖结束
        if(this.lotteryInfo.win == 1){
          // 已中奖
          if(this.lotteryInfo.take_award == 1){
            // 已领奖
            this.lotteryStep = 3
            this.promptImg = require('./img/summit.png')
            this.getReward = '查看中奖名单';
            this.audienceText = '信息已提交'
            this.submitWinning = true
          }else{
            // 未领奖
            this.getAward()
            this.lotteryStep = 1
            this.promptImg = require('./img/win.png')
            this.getReward = '点击领奖';
            this.audienceText = `中奖啦！恭喜您获得 ${this.lotteryInfo.award_snapshoot.award_name}`
            this.submitWinning = true
          }
        }else{
          // 未中奖
          this.lotteryStep = 3
          this.promptImg = require('./img/noWin.png')
          this.getReward = '查看中奖名单';
          this.submitWinning = false
          this.audienceText = '很遗憾，您与大奖擦肩而过，感谢您的参与！'
        }
      }
    },
    // 观看端开启--消息
    startLottery (msg, val) {
      this.showMess = true
      this.currentLotStatus = true
      console.warn('监听收到发起消息',msg);
      this.lotteryInfo = {}
      this.lotteryInfo.award_snapshoot = msg.award_snapshoot
      this.processingObj.url = msg.icon
      this.processingObj.text = msg.remark
      this.processingObj.title = msg.title
      if(msg.lottery_type == 8) {
        // 口令抽奖
        this.lotteryInfo.lottery_type = 8
        this.lotteryInfo.id = msg.lottery_id
        this.lotteryInfo.command = msg.command
      }
    },
    // 结束抽奖--消息
    endRecive(msg, WinningID){
      // 初始化消息
      this.currentLotStatus = false
      this.lotteryInfo.publish_winner = msg.publish_winner  // 当前是否显示 查看中奖名单
      console.warn(msg, WinningID, '中奖信息----',this.isWinning, msg.lottery_winners, this.lotteryInfo);
      if (msg.lottery_winners.find(item => item.lottery_user_id == WinningID)) {
        this.getStepText()
        this.audienceText = `中奖啦！恭喜您获得 ${this.lotteryInfo.award_snapshoot.award_name}`;
        this.isWinning = true
        this.lotteryInfo.id = msg.lottery_id
        this.lotteryInfo.win = 1
        this.$nextTick(()=>{
          this.lotteryStep = 1
          this.getReward = '立即领奖'
        })
      }else{
        this.$nextTick(()=>{
          this.lotteryStep = 3
          this.promptImg = require('./img/noWin.png')
          this.getReward = '查看中奖名单';
          this.submitWinning = false
          this.lotteryInfo.id = msg.lottery_id
          this.audienceText = '很遗憾，您与大奖擦肩而过，感谢您的参与！'
        })
      }
    },
    // 获取领奖页 页面信息
    getStepText(){
      this.$fetch('v3GetStep',{
        webinar_id: this.webinarId
      }).then(res=>{
        if(res.code == 200){
          console.warn('获取当前页面中奖以后', res.data);
          this.stepHtmlList = res.data
          res.data.forEach(element => {
            this.reciveInfo[element.field_key] = ''
          });
          this.reciveInfo = Object.assign({},this.reciveInfo)
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    participate(){
      if(this.lotteryInfo.lottery_type == 8){
        if(this.chatLoginStatus){
          this.$parent.NoLogin();
        }else{
          this.$fetch('v3PartLottery', {
            room_id: this.roomId,
            lottery_id: this.lotteryInfo.id
          }).then(res=>{
            if(res.code ==200) {
              this.lotteryInfo.submit_command = 1
              let _data = {
                type: 'text',
                text_content: this.lotteryInfo.command
              }
              let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
              let _content = {
                nickname: userInfo.nick_name, // 昵称
                avatar: userInfo.avatar, // 头像
              };
              this.showMess = false
              let tempData = new Msg({
                avatar: getAvatar(_content.avatar),
                nickName: _content.nickname,
                type: 'text',
                content: _data,
                sendId: userInfo.user_id,
                sendTime: formatTime(new Date()),
                client: 'pc',
                replyMsg: [],
                atList: []
              });
              this.$EventBus.$emit('codeText', tempData);
              window.chatSDK.emit(_data, _content)
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      }
    }
  },
};
</script>
<style lang="less" scoped>
.audience-wrap{
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
      text-align: center;
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
        padding: 0;
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
      .form-style ::v-deep{
        width: 356px;
        margin: 0 auto;
        .el-form-item{
          margin-bottom: 12px;
        }
        .el-form-item__label{
          width: 70px;
        }
        .el-form-item__content{
          width: calc(100% - 70px);
          display: inline-block;
        }
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
