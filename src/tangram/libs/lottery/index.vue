<template>
  <div class="vhall-lottery" v-if="payoff">
    <div class="payment-dialog" @click="closeUserList">
      <div class="payment-title" :class="lottHeadStyle?'lottery-headleft':'lottery-right'">
        <span class="payment-title--text">{{ processingObj.title ? processingObj.title : '抽奖' }}</span>
        <span v-show="closeShow" class="payment-title--close iconfont iconguanbi" @click="close"></span>
      </div>
      <!-- 发起抽奖 -->
      <div class="lottery-dialog-content" v-if='lotteryContentShow'>
        <el-form ref="form" label-width="100px" :style="{width: '450px'}">
          <el-form-item label="参与条件">
            <el-select
              style="width: 280px;"
              @change="lotteryChange"
              v-model="joinLottery"
              placeholder="请选择"
            >
              <el-option
                style="width: 280px;"
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-tooltip placement="right" :visible-arrow='false' popper-class='transfer-box' style=" margin-left:4px">
              <div slot="content">
                1、全体参会者：所有参会的观众拥有参与抽奖的资格<br>
                2、参与签到的用户：参与签到的观众有参与抽奖的资格<br>
                3、参与问卷的用户：参与问卷填写的观众有参与抽奖的资格<br>
                4、口令抽奖：开始抽奖后，观众收到抽奖提示，需要输入主办方指定的口令后才能参抽奖
              </div>
              <icon icon-class="saaswenhao"></icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="参与口令" v-show="joinLottery == 8">
            <el-input  maxlength="15" show-word-limit style="width: 280px;" v-model="participationPass" placeholder="有趣的口令会带来更多互动"></el-input>
          </el-form-item>
          <el-form-item label="选择奖品">
              <!-- value-key='prize_name' -->
            <el-select
              style="width: 280px;"
              @change="prizeChange"
              value-key='prize_name'
              v-model="prize"
              placeholder="默认奖品"
            >
              <el-option
                style="width: 280px;"
                v-for="item in prizeList"
                :key="item.prize_id"
                :label="item.prize_name"
                :value="item"
              ></el-option>
            </el-select>
            <el-tooltip placement="right" :visible-arrow='false' popper-class='transfer-box' style=" margin-left:4px">
              <div slot="content">
                1、请在控制台-直播管理-抽奖中进行创建<br>
                2、选择提前设置好的奖品，抽奖结束后中奖结果将显示设置的奖品图片
              </div>
              <icon icon-class="saaswenhao"></icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="中奖人数" style="margin-bottom:0px">
            <el-input style="width: 280px;" v-model="prizeNum" placeholder="请输入中奖人数"></el-input>
            <div class="lottery-payment">
              <span>{{ getPrizeCount }}</span>人可参与抽奖
            </div>
          </el-form-item>
          <!-- 预设中奖 -->
          <el-form-item label="预设中奖" style="margin-bottom:10px">
            <el-input v-model="userKeywords" style="width: 280px;" placeholder="请输入用户名">
              <el-button slot="append"  @click="lotterySearch">搜索</el-button>
            </el-input>
            <ul class="user-list" v-if="userListShow">
              <li v-for="(item,index) in userList" :key="index">
                {{ item.nickname }}
                <span @click="selector(item,index)">选择</span>
              </li>
            </ul>
          </el-form-item>
          <ul v-if="userButtonShow" class="user-lists">
            <li v-for="(item,index) in chooseList" :key="index">
              <span>{{ item.nickname }}</span>
              <span class="iconfont iconguanbi" @click="chooseClose(item,index)"></span>
            </li>
          </ul>
          <el-form-item size="mini" label="重复中奖" class="repeat-winning">
            <el-switch
              v-model="repeatWinning"
              active-color="#FC5659"
              inactive-color="#CECECE">
            </el-switch>
            <span>
             开启后，已中奖者可再次参与抽奖
            </span>
          </el-form-item>
          <el-form-item label="中奖名单" class="repeat-winning">
            <el-switch
              v-model="WinningList"
              active-color="#FC5659"
              inactive-color="#CECECE">
            </el-switch>
            <span>
             开启后，抽奖结束后显示中奖名单
            </span>
          </el-form-item>
          <el-button @click="startReward" class="common-but lottery-start" :disabled="startButtonDisabled">开始抽奖</el-button>
        </el-form>
      </div>

      <!-- 抽奖 -->
      <div class="prize-pending" v-if="prizeShow" >
        <img :src="processingObj.url ? processingObj.url : defaultImg" alt />
        <p>{{processingObj.text ? processingObj.text : '抽奖进行中....'}}</p>
        <el-button @click="endLottery" :disabled='disabledTime!=0' class="common-but lottery-end">
          结束抽奖 <span v-if="disabledTime!=0">({{disabledTime}}s) </span>
        </el-button>
      </div>
      <!-- 抽奖结果 -->
      <template  v-if="lotteryResultShow">
        <Result @startReward='startReward' :domains='domains'
        :userHost='true' :lotteryResultObj='lotteryResultObj'
        :prizeObj='prizeObj'
        :lotteryEndResult='lotteryEndResult'></Result>
      </template>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import prize from './mixins'
import Result from './common/result'
export default {
  components :{
    Result
  },
  props: {
    roomId: {
      type: String
    },
    domains:{
      type: Object
    }
  },
  data () {
    return {
      processingObj:{}, //正在进行中的抽奖信息
      getReward: '查看中奖名单',
      lotteryChatShow: false, // 已填写过领奖信息的提示
      closeShow: true, // 关闭按钮的显示
      getPrizeCount: 0, // 可参与抽奖的人数
      lotteryEndResult: null, // 抽奖的结果
      lotteryInfo: null, // 抽奖的信息
      lottHeadStyle: true,
      lotteryResultShow: false, // 抽奖结果
      lotteryContentShow: false, // 发起抽奖
      prizeShow: false, // 趣味抽奖
      userListShow: false,
      userButtonShow: false,
      chooseList: [], // 预中奖人员
      userList: [], //
      prizeNum: '', // 设置的中奖人数
      userKeywords: '',
      joinLottery: '1',
      options: [
        {
          value: '1',
          label: '全体参会者'
        },
        {
          value: '2',
          label: '参与问卷的用户'
        },
        {
          value: '3',
          label: '参与签到的用户'
        },
        {
          value: '8',
          label: '口令抽奖'
        }
      ],
      prize: {},
      prizeList: [], // 奖品列表
      payoff: false,
      hasAward: false,
      startButtonDisabled: false, // 开始按钮禁用状态
      WinningList: false, // 中奖名单
      repeatWinning: false ,// 重复中奖
      participationPass: '', // 口令
      disabledTime: 5, // 5秒禁止点击
      lotteryResultObj: {}, // 中奖信息
      prizeObj: {}, // 奖品信息
      defaultImg: require('./img/prize.gif')
    };
  },
  mixins: [prize],
  created () {
    this.getPrizeList()
    this.disTimeSet = setInterval(() => {
      this.disabledTime--;
      if(this.disabledTime<=0){
        clearInterval(this.disTimeSet);
      }
    }, 1000);
  },
  watch: {
    chooseList (newValue, oldValue) {
      newValue.length > 0
        ? (this.userButtonShow = true)
        : (this.userButtonShow = false);
    },
    repeatWinning(newValue){
      console.warn(newValue, '是否开启重复中奖');
      this.getLotteryCount()
    }
  },

  methods: {
    // 结束抽奖
    endLottery () {
      this.$fetch('v3EndLottery', {
        room_id: this.roomId,
        lottery_id: this.lotteryInfo.id
      }, {}, 2000).then(res => {
        if (res.code === 200) {
          console.warn('抽奖完成', res.data);
          this.closeShow = true;
          this.lotteryResultShow = true;
          this.lotteryEndResult = res.data.lottery_users; // 中奖用户人信息列表
          this.lotteryResultObj.url = res.data.award_snapshoot.image_url
          this.lotteryResultObj.text = res.data.award_snapshoot.award_name
          this.prizeShow = false;
        }
      });
    },
    // 移除选中的列表中的元素
    chooseClose (items, indexs) {
      this.chooseList.splice(indexs, 1);
    },
    // 搜索的列表
    selector (item) {
      this.chooseList.push(item);
      this.userButtonShow = true;
      this.userListShow = false;
    },
    closeUserList () {
      this.userListShow = false;
    },
    // 搜索预设中奖的人员
    lotterySearch () {
      if (!this.userKeywords) return this.$message.customerror('请输入中奖人用户名');
      this.getLotteryCount()
    },
    // 关闭
    close () {
      this.lotteryResultShow = false; // 抽奖结果
      this.lotteryContentShow = false; // 发起抽奖
      this.prizeShow = false; // 趣味抽奖
      this.payoff = false;
    },
    // 点击下拉框改变可参与的人数
    lotteryChange (value) {
      console.log('选择方式变化value', value);
      this.getLotteryCount();
    },
    // 点击抽奖
    async lotteryShow () {
      console.warn('点击的是抽奖----');
      this.payoff = true;
      this.lotteryContentShow = true;
      this.lotteryResultShow = false;
      this.prizeShow = false;
      this.prizeNum = '';
      this.userKeywords = '';
      this.chooseList = [];
      await this.ClearUserList()
      this.checkLottery()
    },
    // 点击领奖
    getAward () {
      if (this.hasAward) {
        this.lotteryResultShow = false; // 抽奖结果
        this.lotteryContentShow = false; // 发起抽奖
        this.prizeShow = false; // 趣味抽奖
        this.payoff = false;
      }
    }
  }
};
</script>
<style lang="less" scope>
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
    // height: 700px;
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
          font-family: @fontRegular;
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
    .user-list {
      position: absolute;
      top: 36px;
      background: #fff;
      width: 192px;
      max-height: 500px;
      overflow-y: auto;
      /* background: yellow; */
      border: 1px solid lightgray;
      z-index: 1;
      float: left;
      li {
        float: left;
        width: 180px;
        height: 30px;
        font-size: 12px;
        line-height: 30px;
        color: #666;
        text-indent: 15px;

        span {
          cursor: pointer;
          color: #c5c5c5;
          float: right;
          margin-right: 10px;
        }

        span:hover {
          color: #eb6663;
        }
      }
    }
    .user-lists {
      overflow: hidden;
      margin-left: 50px;
      padding-bottom: 15px;
      li {
        margin-bottom: 5px;
        background: #F5F5F5;
        border-radius: 4px;
        float: left;
        width: 115px;
        height: 30px;
        line-height: 30px;
        color: #666;
        margin-right: 5px;
        text-indent: 6px;
        background: #eee;
        span {
          cursor: pointer;
          color: #c5c5c5;
        }
        span:first-of-type {
          padding: 0 10px;
          display: block;
          width: 93px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          float: left;
          color: #444;
          font-size: 12px;
        }
        span:last-of-type {
          float: left;
          display: block;
          cursor: pointer;
          text-align: center;
          transform: scale(0.5);
          width: 15px;
        }
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
        font-family: @fontRegular;
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
          font-family: @fontRegular;
          font-weight: 400;
          color: #222222;
          line-height: 22px;
          margin-bottom: 12px;
        }
      }
      .result-table-head{
        text-align: center;
        color: #333;
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
          font-family: @fontRegular;
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
        .Audience-one{
          img{
            margin: 42px auto 24px;
            display: block;
            width: 100px;
            height: 100px;
          }
          p{
            font-size: 16px;
            font-family: @fontRegular;
            font-weight: 400;
            color: #222222;
            line-height: 22px;
            margin-bottom: 48px;
          }
          .winning-status{
            color: #FC5659;
          }
        }
      }
    }

    .recive-prize {
      .title{
        font-size: 14px;
        font-family: @fontRegular;
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
::v-deep .el-select-dropdown__list .el-select-dropdown__item.selected{
  color: rgba(252, 86, 89, 1)!important;
}
</style>
