<template>
  <div class="account-set">
    <div class="comp-card-one">
      <icon icon-class="saasicon_qq" style="font-size: 40px;"></icon>
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定QQ</label></li>
        <li><label class="card--txt">当前尚未绑定QQ</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click="bindQQ">绑定</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <icon icon-class="saasicon_wechat" style="font-size: 40px;"></icon>
      <ul class="ul--son--card">
        <li><label class="card--bold" @click="bindWx">绑定微信</label></li>
        <li><label class="card--txt">当前尚未绑定微信</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text">绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "accountSet.vue",
  methods: {
    initComp() {
    },
    bindWx() {},
    bindQQ() {
      window.open(`https://t-saas-dispatch.vhall.com/v3/commons/auth/qq?platform=17&jump_url=${encodeURI('http://localhost:8080/#/account/info')}`)
    }
  }
};
</script>

<style lang="less" scoped>
  .account-set {
    .padding41-40();
  }

</style>
