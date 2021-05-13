<template>
    <div class="container network">
      <img src="../../../common/images/sys/no-network.svg" alt=""/>
      <p class="heading">00:00-07:00期间系统升级中，由此给您带来不便，敬请谅解！</p>
      <p class="index-btn"><el-button type="primary" @click.prevent.stop="toReturn" round>去登录</el-button></p>
    </div>
</template>

<script>
export default {
  name: "Upgrading.vue",
  beforeCreate() {
  },
  methods: {
    toReturn() {
      window.location.href = `${window.location.protocol}${process.env.VUE_APP_ROOM_WATCH}/login`;
    }
  }
};
</script>

<style lang="less" scoped>
.background {
  background: #ffffff;
}
.container {
  position: relative;
  margin: 0 auto;
  width: 52%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .index-btn {
    margin-top: 32px;
    text-align: left;
  }
  .heading {
    font-size: 80px;
    font-family: @fontSemibold;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 112px;
  }
  &.sysUnder {
    .heading {
      font-size: 32px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 45px;
    }
  }
  &.network {
    flex-direction: column;
    width: 245px;
    height: auto;
    text-align: center;
    margin-top: calc((100vh - 292px)/2);
    .heading {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
    .index-btn {
      text-align: center;
    }
  }
}
</style>
