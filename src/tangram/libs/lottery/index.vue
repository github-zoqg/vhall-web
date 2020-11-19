<template>
  <div class="vhall-lottery" v-if="payoff">
    <!-- <div style="cursor:pointer;" @click = 'lotteryShow'>抽奖</div> -->
    <div class="payment-dialog" @click="closeUserList">
      <div class="payment-title" :class="lottHeadStyle?'lottery-headleft':'lottery-right'">
        <span class="payment-title--text">{{ dialogTitle }}</span>
        <span v-show="closeShow" class="payment-title--close iconfont iconguanbi" @click="close"></span>
      </div>
      <!-- 发起抽奖 -->
      <div class="lottery-dialog-content" v-if="lotteryContentShow">
        <el-form ref="form" label-width="120px" size="mini" :style="{width: '450px'}">
          <el-form-item label="参与抽奖人员:">
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
            <div class="lottery-payment">
              有
              <span>{{ getPrizeCount }}</span>人可参与抽奖，已中奖者不再参与抽奖
            </div>
          </el-form-item>
          <el-form-item label="中奖人数:">
            <el-input style="width: 210px;" v-model="prizeNum" placeholder="请输入中奖人数"></el-input>
          </el-form-item>
          <el-form-item label="预设中奖:" class="lottery-preset">
            <el-input v-model="userKeywords" style="width: 210px;" placeholder="请输入用户名"></el-input>
            <el-button @click="lotterySearch" class="lottery-search">搜索</el-button>
            <ul v-if="userListShow" class="user-list">
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
          <!-- <el-form-item> -->
          <el-button @click="startReward" class="lottery-start" :disabled="startButtonDisabled">开始抽奖</el-button>
          <!-- </el-form-item> -->
        </el-form>
      </div>
      <!-- 趣味抽奖 -->
      <div class="prize-pending" v-if="prizeShow">
        <img src="../../assets/lottery-loading.gif" alt />
        <p>正在进行抽奖...</p>
        <el-button v-if="prizeEnd" @click="endLottery" class="prize-pending-button">结束抽奖</el-button>
      </div>
      <!-- 抽奖结果 -->
      <div class="lottery-result" v-if="lotteryResultShow">
        <ul>
          <li
            class="awardBgColor"
            v-for="(item,index) in lotteryEndResult"
            :key="index"
          >{{ item.lottery_user_nickname }}</li>
        </ul>
        <div v-show="lotteryChatShow" class="lottery-chat">
          <p>恭喜您中奖了！</p>
          <p>您已填写过个人信息，请等待主办方联系</p>
        </div>
        <el-button v-if="reciveRewardShow" @click="getAward" class="lottery-reward">{{ getReward }}</el-button>
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
        }
      ],
      payoff: false,
      hasAward: false,
      startButtonDisabled: false // 开始按钮禁用状态
    };
  },

  created () {},

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
          const lotteryTitle = document.querySelector('.payment-title--text');
          lotteryTitle.style.color = '#444';
          const lotterySuccess = document.querySelector('.payment-dialog');
          lotterySuccess.style.background = '#fff';
          const paymentTitle = document.querySelector('.payment-title');
          paymentTitle.style.background = '#f4f4f4';
          paymentTitle.style.borderBottom = '1px solid #d9d9d9';
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
      if (this.prizeNum > this.getPrizeCount) {
        this.$message.customerror('中奖人数不可以大于参与抽奖人员数');
        return;
      }
      if (!/^[1-9]\d*$/.test(this.prizeNum)) {
        this.$message.customerror('中奖人数只能为正整数');
        return;
      }
      let deliverId = [];
      if (this.chooseList) {
        this.chooseList.map(item => {
          deliverId.push(item.account_id);
        });
        deliverId = deliverId.join(',');
      } else {
        deliverId = null;
      }
      this.startButtonDisabled = true;
      this.$vhallFetch('add', {
        vss_token: this.vssToken,
        room_id: this.roomId,
        lottery_type: this.joinLottery,
        lottery_number: this.prizeNum,
        lottery_user_ids: deliverId
      }).then(res => {
        this.startButtonDisabled = false;
        if (res.code === 200) {
          console.log(res);
          this.lotteryInfo = res.data;
          this.lotteryContentShow = false;
          this.prizeShow = true;
          // alert('dialogtitle')
          console.log('dialogtitle>>>>>>>>>>>>>', this.dialogTitle);
          this.dialogTitle = '趣味抽奖！';
          this.closeShow = false;
          // EventBus.$on('lottery_push', msg => {
          //   console.log('eeeeeeeeee', msg)
          //   console.log('发起成功！！！')
          // })
        }
      }).catch(() => {
        this.startButtonDisabled = false;
      });
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
      console.log('value', value);
      this.getLotteryCount();
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
        const lotteryTitle = document.querySelector('.payment-title--text');
        lotteryTitle.style.color = '#444';
        const lotterySuccess = document.querySelector('.payment-dialog');
        lotterySuccess.style.background = '#fff';
        const paymentTitle = document.querySelector('.payment-title');
        paymentTitle.style.background = '#f4f4f4';
        paymentTitle.style.borderBottom = '1px solid #d9d9d9';
        const titleCloses = document.querySelector('.payment-title--close');
        titleCloses.style.color = '#666';
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
            const lotteryTitle = document.querySelector('.payment-title--text');
            lotteryTitle.style.color = '#fff';
            const lotterySuccess = document.querySelector('.payment-dialog');
            lotterySuccess.style.background = '#ff3333';
            const paymentTitle = document.querySelector('.payment-title');
            paymentTitle.style.background = '#ff3333';
            paymentTitle.style.borderBottom = '1px solid #ff3333';
            if (awardUserId.lottery_user_phone) {
              this.hasAward = true;
              this.lotteryChatShow = true;
              this.getReward = '确定';
              this.$nextTick(() => {
                const lotteryList = document.querySelector('.lottery-result ul');
                lotteryList.style.marginBottom = 0;
              });
            }
            this.$nextTick(() => {
              // const awardBgColor = document.getElementsByClassName('.awardBgColor');
              const awardBgColor = document.querySelector('.awardBgColor');
              console.log('awaaa', awardBgColor);
              awardBgColor.style.background = '#da3030';
              awardBgColor.style.color = '#fff';
              const titleClose = document.querySelector('.payment-title--close');
              titleClose.style.color = '#fff';
            });
          } else {
            const lotteryTitle = document.querySelector('.payment-title--text');
            lotteryTitle.style.color = '#444';
            const lotterySuccess = document.querySelector('.payment-dialog');
            lotterySuccess.style.background = '#fff';
            const paymentTitle = document.querySelector('.payment-title');
            paymentTitle.style.background = '#f4f4f4';
            paymentTitle.style.borderBottom = '1px solid #d9d9d9';
            this.dialogTitle = '很遗憾,您没有中奖！';
            this.reciveRewardShow = false;
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.vhall-lottery {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .payment-dialog {
    width: 600px;
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
    }

    .lottery-payment {
      font-size: 12px;
      color: #444;

      span {
        color: #eb6663;
      }
    }
    .lottery-preset{
      .el-form-item__content{
        display: flex;
        button{
          margin-left: 8px;
        }
      }
    }
    .lottery-search {
      width: 63px;
      height: 30px;
      border: 0px;
      color: #fff;
      border-radius: 4px;
      background: #fc5659;
      height: 28px;
      vertical-align: middle;
      &:hover {
        background: #c51f1d;
      }
    }

    .lottery-start {
      width: 355px;
      height: 40px;
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
      img {
        display: block;
        width: 272px;
        height: 272px;
        margin: 15px auto;
      }

      p {
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #444;
        padding: 30px 0;
      }

      &-button {
        display: block;
        width: 462px;
        height: 51px;
        color: #fff;
        background: #eb6663;
        font-size: 20px;
        margin: 0 auto;
        border-radius: 8px;
        margin-top: 10px;
        margin-bottom: 16px;
      }
    }

    .lottery-result {
      ul {
        width: 390px;
        margin: 0 auto;
        padding: 23px 20px;
        margin-bottom: 16px;
        max-height: 500px;
        overflow-y: auto;
        li {
          width: 390px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 44px;
          line-height: 44px;
          background: #e9e9e9;
          text-align: center;
          color: #444;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 10px;
        }
      }

      .lottery-chat {
        width: 100%;
        text-align: center;
        margin-bottom: 28px;
        p {
          width: 100%;
          text-align: center;
          color: #ffc217;
          font-size: 12px;
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
