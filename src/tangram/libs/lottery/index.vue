<template>
  <div class="vhall-lottery">
     <!-- v-if="payoff" -->
    <!-- <div style="cursor:pointer;" @click = 'lotteryShow'>抽奖</div> -->
    <div class="payment-dialog" @click="closeUserList">
      <div class="payment-title" :class="lottHeadStyle?'lottery-headleft':'lottery-right'">
        <span class="payment-title--text">{{ dialogTitle }}</span>
        <span v-show="closeShow" class="payment-title--close iconfont iconguanbi" @click="close"></span>
      </div>
      <!-- 发起抽奖 -->
      <div class="lottery-dialog-content" v-if='false'>
         <!-- v-if="lotteryContentShow" -->
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
          <el-form-item label="参与口令" v-show="joinLottery == 4">
            <el-input  maxlength="15" show-word-limit style="width: 280px;" v-model="participationPass" placeholder="有趣的口令会带来更多互动"></el-input>
          </el-form-item>
          <el-form-item label="选择奖品">
            <el-select
              style="width: 280px;"
              @change="lotteryChange"
              v-model="joinLottery"
              placeholder="默认奖品"
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
                1、请在控制台-直播管理-抽奖中进行创建<br>
                2、选择提前设置好的奖品，抽奖结束后中奖结果将显示设置的奖品图片
              </div>
              <icon icon-class="saaswenhao"></icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="中奖人数" style="margin-bottom:0px">
            <el-input style="width: 280px;" v-model="prizeNum" placeholder="请输入中奖人数"></el-input>
            <div class="lottery-payment">
              <span>{{ getPrizeCount }}</span>人参与抽奖
            </div>
          </el-form-item>
          <el-form-item label="预设中奖" class="lottery-preset">
            <el-input v-model="userKeywords" style="width: 280px;" placeholder="请输入用户名">
              <el-button slot="append"  @click="lotterySearch">搜索</el-button>
            </el-input>
             <!-- v-if="userListShow" -->
            <ul class="user-list">
              <li v-for="(item,index) in userList" :key="index">
                {{ item.nickname }}
                <span @click="selector(item,index)">选择</span>
              </li>
            </ul>
          </el-form-item>
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
          <ul v-if="userButtonShow" class="user-lists">
            <li v-for="(item,index) in chooseList" :key="index">
              <span>{{ item.nickname }}</span>
              <span class="iconfont iconguanbi" @click="chooseClose(item,index)"></span>
            </li>
          </ul>
          <el-button @click="startReward" class="common-but lottery-start" :disabled="startButtonDisabled">开始抽奖</el-button>
        </el-form>
      </div>
      <!-- 趣味抽奖 -->
      <div class="prize-pending"  v-if="prizeShow">
        <img src="../../assets/lottery-loading.gif" alt />
        <p>正在进行抽奖...</p>
        <el-button v-if="prizeEnd" @click="endLottery" :disabled='disabledTime!=0' class="common-but lottery-end">
          结束抽奖 <span v-if="disabledTime!=0">({{disabledTime}}s) </span>
        </el-button>
      </div>
      <!-- 抽奖结果 -->
      <div class="lottery-result">
         <!-- v-if="lotteryResultShow" -->
         <!-- 抽奖结果  权限角色 -->
         <template v-if="false">
            <div class="result-img">
              <img :src="$img" alt="">
              <p>黑碳科技立体电子魔方</p>
            </div>
            <div class="result-table">
                <div class="result-table-head">
                  <strong>中奖名单</strong>
                </div>
                <ul>
                  <li class="awardBgColor"
                    v-for="(item,index) in lotteryEndResult"
                    :key="index">
                    <img :src="$img" alt="" />
                    <span class="nickname ellsips">{{ item.lottery_user_nickname }}</span>
                  </li>
                </ul>
                <el-button @click="startReward" class="common-but lottery-start" :disabled="startButtonDisabled">开始抽奖</el-button>
            </div>
         </template>
         <!-- 抽奖结果  观众 -->
         <template v-if="true">
           <!-- lotteryChatShow -->
            <div class="lottery-chat Audience-lottery">
              <div class="Audience-one">
                <img class="title-img" :src="$img" alt="">
                <p :class="{'winning-status': isWinning}">{{ audienceText }}</p>
              </div>
              <!-- 领奖信息 -->
              <div class="recive-prize" v-if="reciveAwardShow">
                <el-form ref="forms" size="mini" class="form-style">
                  <el-form-item>
                    <el-input style="width: 200px;" v-model="reciveInfo.name" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width: 200px;" v-model="reciveInfo.tel" placeholder="请输入手机号"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width: 200px;" v-model="reciveInfo.remarks" placeholder="请输入备注（如地址等）"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="submitInfo" class="reward-submmit">提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-button @click="getAward" class="common-but">{{ getReward }}</el-button>
            </div>
         </template>
        <el-button v-if="reciveRewardShow" @click="getAward" class="lottery-reward">{{ getReward }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomId: {
      type: String
    },
    vssToken: {
      required: true
    }
  },
  data () {
    return {
      getReward: '点击领奖',
      lotteryChatShow: false, // 已填写过领奖信息的提示
      closeShow: true, // 关闭按钮的显示
      deliverItem: {},
      reciveAwardShow: false, // 领奖信息的展示
      reciveInfo: {
        // 领奖人信息
        name: '',
        tel: '',
        remarks: ''
      },
      reciveRewardShow: false, // 点我领奖的显示
      prizeEnd: true,
      getPrizeCount: 0, // 可参与抽奖的人数
      lotteryEndResult: null, // 抽奖的结果
      lotteryInfo: null, // 抽奖的信息
      lottHeadStyle: true,
      dialogTitle: '发起抽奖',
      lotteryResultShow: false, // 抽奖结果
      lotteryContentShow: false, // 发起抽奖
      prizeShow: false, // 趣味抽奖
      userListShow: false,
      userButtonShow: false,
      chooseList: [],
      userList: [],
      joinLottery: '1',
      prizeNum: '',
      userKeywords: '',
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
          value: '4',
          label: '口令抽奖'
        }
      ],
      payoff: false,
      hasAward: false,
      startButtonDisabled: false, // 开始按钮禁用状态
      WinningList: false, // 中奖名单
      repeatWinning: false ,// 重复中奖
      participationPass: '', // 口令
      disabledTime: 5, // 5秒禁止点击
      audienceText: '很遗憾，您与大奖擦肩而过，感谢您的参与！',
      isWinning: true
    };
  },

  created () {
  this.disTimeSet = setInterval(() => {
    this.disabledTime--;
    if(this.disabledTime<=0){
      clearInterval(this.disTimeSet);
    }
  }, 1000);
  },

  mounted () {},
  watch: {
    chooseList (newValue, oldValue) {
      newValue.length > 0
        ? (this.userButtonShow = true)
        : (this.userButtonShow = false);
    }
  },

  methods: {
    // 结束抽奖
    endLottery () {
      this.$vhallFetch('lotteryEnd', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_id: this.lotteryInfo.id
      }, {}, 2000).then(res => { // 解决17887
        if (res.code === 200) {
          this.dialogTitle = '抽奖结果';
          this.closeShow = true;
          console.log(res);
          this.lotteryEndResult = res.data.lottery_users;
          this.prizeShow = false;
          this.lotteryResultShow = true;
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
      this.$vhallFetch('search', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_type: this.joinLottery,
        keyword: this.userKeywords
        // lottery_user_ids:null
      }).then(res => {
        if (res.code === 200) {
          const userList = res.data ? res.data.list : [];
          this.userList = userList.filter((u) => {
            return !this.chooseList.find((c) => {
              return c.account_id == u.account_id;
            });
          });
          this.userListShow = true;
        } else {
          this.$message.customerror(res.msg);
        }
      });
    },
    // 开始抽奖
    startReward () {
      this.prizeShow = true;

      // if (this.prizeNum > this.getPrizeCount) {
      //   this.$message.customerror('中奖人数不可以大于参与抽奖人员数');
      //   return;
      // }
      // if (!/^[1-9]\d*$/.test(this.prizeNum)) {
      //   this.$message.customerror('中奖人数只能为正整数');
      //   return;
      // }
      // let deliverId = [];
      // if (this.chooseList) {
      //   this.chooseList.map(item => {
      //     deliverId.push(item.account_id);
      //   });
      //   deliverId = deliverId.join(',');
      // } else {
      //   deliverId = null;
      // }
      // this.startButtonDisabled = true;
      // this.$vhallFetch('add', {
      //   vss_token: this.vssToken,
      //   room_id: this.roomId,
      //   lottery_type: this.joinLottery,
      //   lottery_number: this.prizeNum,
      //   lottery_user_ids: deliverId
      // }).then(res => {
      //   this.startButtonDisabled = false;
      //   if (res.code === 200) {
      //     console.log(res);
      //     this.lotteryInfo = res.data;
      //     this.lotteryContentShow = false;
      //     this.prizeShow = true;
              // this.disTimeSet = setInterval(() => {
              //   this.disabledTime--;
              // if(this.disabledTime<=0){
              //   clearInterval(this.disTimeSet)
              // }
              // }, 1000);
      //     // alert('dialogtitle')
      //     console.log('dialogtitle>>>>>>>>>>>>>', this.dialogTitle);
      //     this.dialogTitle = '趣味抽奖！';
      //     this.closeShow = false;
      //     // EventBus.$on('lottery_push', msg => {
      //     //   console.log('eeeeeeeeee', msg)
      //     //   console.log('发起成功！！！')
      //     // })
      //   }
      // }).catch(() => {
      //   this.startButtonDisabled = false;
      // });
    },
    // 关闭
    close () {
      console.log('x');
      this.lotteryResultShow = false; // 抽奖结果
      this.lotteryContentShow = false; // 发起抽奖
      this.reciveAwardShow = false; // 领奖信息
      this.prizeShow = false; // 趣味抽奖
      this.payoff = false;
    },
    // 有多少人可参与到抽奖中  lotteryCount
    getLotteryCount () {
      this.$vhallFetch('lotteryCount', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_type: this.joinLottery
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.getPrizeCount = res.data.count || 0;
          // this.lotteryInfo = res.data;
          // this.lotteryContentShow = false;
          // this.prizeShow = true;
        }
      });
    },
    // 点击下拉框改变可参与的人数
    lotteryChange (value) {
      console.log('选择方式变化value', value);
      // this.getLotteryCount();
    },
    // 点击抽奖
    lotteryShow () {
      this.payoff = true;
      this.lotteryContentShow = true;
      this.lotteryResultShow = false;
      this.prizeShow = false;
      this.prizeNum = '';
      this.userKeywords = '';
      this.chooseList = [];
      this.getLotteryCount();
    },
    // 观看端开启
    startLottery (val) {
      this.payoff = val;
      this.lotteryResultShow = false;
      // this.lotteryContentShow = true;
      this.prizeShow = val;
      this.prizeEnd = false;
      this.dialogTitle = '趣味抽奖！';
      console.log('valll', val);
    },
    // 提交领奖人信息
    submitInfo () {
      console.log('ssssss', this.deliverItem);
      if (!this.reciveInfo.tel || !this.reciveInfo.name) return this.$message.customerror('手机号与姓名不能为空');
      const phone = this.reciveInfo.tel.replace(/\s/g, '');// 去除空格
      const regs = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!regs.test(phone)) return this.$message.customerror('手机号格式错误');
      // lotteryAward
      this.$vhallFetch('lotteryAward', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_id: this.deliverItem.lottery_id,
        lottery_user_name: this.reciveInfo.name,
        lottery_user_phone: this.reciveInfo.tel,
        lottery_user_remark: this.reciveInfo.remarks
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.reciveAwardShow = false;
          this.payoff = false;
          this.reciveInfo = {};
          this.$message.customsuccess('提交成功');
        } else {
          this.$message.customerror(res.msg);
        }
      });
    },
    // 点击领奖
    getAward () {
      if (this.hasAward) {
        this.lotteryResultShow = false; // 抽奖结果
        this.lotteryContentShow = false; // 发起抽奖
        this.prizeShow = false; // 趣味抽奖
        this.payoff = false;
      } else {
        this.reciveAwardShow = true;
        this.dialogTitle = '请填写个人信息，方便主办方联系您！';
        this.lotteryResultShow = false;
      }
    },
    // 抽奖结果通知
    endRecive (item, ownerId) {
      this.reciveAwardShow = false;
      this.lotteryChatShow = false;
      this.getReward = '点击领奖';
      // lotteryUsersGet
      this.deliverItem = item;
      this.payoff = true;

      // this.lotteryResultShow = true;
      // this.prizeShow = false;
      this.prizeEnd = false;
      this.$vhallFetch('lotteryUsersGet', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_id: item.lottery_id,
        offset: 0,
        limit: 999
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.lotteryEndResult = res.data ? res.data.list : [];
          this.prizeShow = false;
          this.lotteryResultShow = true;
          console.log('lotteryEndResult', this.lotteryEndResult);
          console.log('owerId', ownerId);
          if (
            this.lotteryEndResult.find(item => item.lottery_user_id == ownerId)
          ) {
            let awardUserId = this.lotteryEndResult.find(
              item => item.lottery_user_id == ownerId
            );
            this.lotteryEndResult = [];
            this.lotteryEndResult.push(awardUserId);
            console.log('awardUserId', awardUserId);
            console.log('lotteryEndResult', this.lotteryEndResult);
            this.reciveRewardShow = true;
            this.dialogTitle = '恭喜您中奖了！';
            if (awardUserId.lottery_user_phone) {
              this.hasAward = true;
              this.lotteryChatShow = true;
              this.getReward = '确定';
            }
          } else {
            // this.dialogTitle = '很遗憾,您没有中奖！';
            // this.reciveRewardShow = false;
          }
        }
      });
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
    .user-list {
      position: absolute;
      top: 28px;
      background: #fff;
      width: 208px;
      max-height: 500px;
      overflow-y: auto;
      /* background: yellow; */
      border: 1px solid lightgray;
      z-index: 1;
      float: left;
      li {
        float: left;
        width: 208px;
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
      /* background: yellow; */
      /* border-bottom: 1px solid lightgray; */
      overflow: hidden;
      margin-left: 50px;
      padding-bottom: 15px;
      li {
        margin-bottom: 5px;
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
          color: #EB6663;
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
        .Audience-one{
          img{
            margin: 42px auto 24px;
            display: block;
            width: 100px;
            height: 100px;
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
    }

    .recive-prize {
      .form-style {
        width: 200px;
        margin: 0 auto;
        margin-top: 20px;
      }

      .reward-submmit {
        width: 200px;
        height: 40px;
        display: block;
        margin: 0 auto;
        color: #fff;
        border: none;
        background: #4b97f7;
      }

      .reward-submmit:hover {
        background: #fe6a6a;
      }
    }
  }
}
</style>
