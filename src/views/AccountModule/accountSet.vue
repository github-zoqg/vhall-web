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
        <el-button type="text" @click="bindWx">绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";

export default {
  name: "accountSet.vue",
  methods: {
    initComp() {
    },
    bindWx() {
      sessionOrLocal.set('tag', 'bind', 'localStorage');
      window.open(`https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=pc&jump_url=${process.env.VUE_APP_WEB_URL}`, '_blank');
    },
    bindQQ() {
      sessionOrLocal.set('tag', 'bind', 'localStorage');
      window.open(`https://t-saas-dispatch.vhall.com/v3/commons/auth/qq?jump_url=${process.env.VUE_APP_WEB_URL}`);
    }
  }
};
</script>

<style lang="less" scoped>
  .account-set {
    .padding41-40();
  }

</style>
