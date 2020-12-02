<template>
  <!-- lotteryChatShow -->
  <div>
    <div class="lottery-chat Audience-lottery">
      <div class="Audience-one" v-show="lotteryStep == 1">
        <img class="title-img" :src="$img" alt="">
        <p :class="{'winning-status': isWinning}">{{ audienceText }}</p>
      </div>
      <!-- 领奖信息 -->
      <!-- reciveAwardShow -->
      <div class="recive-prize" v-if="lotteryStep == 2">
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
      <div class="Audience-one Audience-three" v-show="lotteryStep == 3">
        <img class="title-img" :src="$img" alt="">
        <p :class="{'winning-status': submitWinning}">{{ audienceText }}</p>
      </div>
      <el-button @click="getAward" class="common-but">{{ getReward }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reciveInfo: {
        // 领奖人信息
        name: '',
        tel: '',
        remarks: ''
      },
      WinningList: false, // 中奖名单
      repeatWinning: false ,// 重复中奖
      participationPass: '', // 口令
      disabledTime: 5, // 5秒禁止点击
      audienceText: '信息提交成功',
      isWinning: false,
      submitWinning: true, // 信息是否提交成功
      lotteryStep: 3 // 领奖到哪一步
    };
  },
};
</script>
<style lang="less" scoped>

</style>
