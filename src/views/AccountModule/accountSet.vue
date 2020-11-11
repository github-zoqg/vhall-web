<template>
  <div class="account-set">
    <div class="comp-card-one">
      <img src="../../common/images/avatar.jpg" />
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定QQ</label></li>
        <li><label class="card--txt">当前尚未绑定QQ</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text">绑定</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <img src="../../common/images/avatar.jpg" />
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定微信</label></li>
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
    }
  }
};
</script>

<style lang="less" scoped>
  .account-set {
    padding: 41px 40px 0 40px;
  }

</style>
