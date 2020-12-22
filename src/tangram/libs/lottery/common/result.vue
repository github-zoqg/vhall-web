<template>
  <div class="lottery-result">
    <div class="result-img">
      <img :src="prizeObj && prizeObj.image_url ? prizeObj.image_url : defaultPrizeImg" alt="">
      <p>{{prizeObj&&prizeObj.award_name ? prizeObj.award_name : '奖品'}}</p>
    </div>
    <div class="result-table">
        <div class="result-table-head">
          <strong>中奖名单</strong>
        </div>
        <ul>
          <li class="awardBgColor" v-for="(item,index) in lotteryEndResult" :key="index">
            <img :src="item.lottery_user_avatar ? item.lottery_user_avatar : defaultImg" alt="" />
            <span class="nickname ellsips">{{ item.lottery_user_nickname }}</span>
          </li>
        </ul>
        <el-button v-if="userHost" @click="startReward" class="common-but lottery-start" :disabled="startButtonDisabled">开始抽奖</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomId: { // 房间id
      type: String
    },
    domains:{
      type: Object
    },
    prizeObj:{ // 奖品信息
      type: Object
    },
    lotteryEndResult:{
      type: Array
    },
    userHost: {
      type: [String, Boolean]
    }
  },
  data() {
    return {
      defaultImg: require('@/common/images/avatar_min.png'),
      defaultPrizeImg: require('./../img/win.png'),
      startButtonDisabled: false, // 开始按钮禁用状态
    }
  },
  methods: {
    startReward(){
      this.$emit('startReward')
    }
  },
}
</script>
<style lang="less" scoped>
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
        background: #F5F5F5;
        width: 396px;
        color: #333;
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
</style>
