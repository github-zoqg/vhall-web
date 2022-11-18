<template>
  <div class="container sysUnder">
    <div class="left-section sysUnder">
      <div class="inner-content">
        <h1 class="heading">系统正在升级中…</h1>
        <!-- 具体文案 -->
        <p class="subheading">00:00-07:00期间系统升级中，由此给您带来不便，敬请谅解！</p>
      </div>
    </div>
    <div class="right-section">
      <img src="../../../common/images/sys/no-server.png" class="svgImg" alt="" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error.vue',
    beforeCreate() {},
    methods: {
      toReturn() {
        this.$router.push({
          path: '/'
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .left-section.sysUnder {
    width: 416px;
    margin-right: 77px;
  }
  .left-section .inner-content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
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
      color: #1a1a1a;
      line-height: 112px;
    }
    &.sysUnder {
      .heading {
        font-size: 32px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 45px;
      }
    }
    &.network {
      flex-direction: column;
      width: 245px;
      height: auto;
      text-align: center;
      margin-top: calc((100vh - 292px) / 2);
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
  .left-section {
    width: 40%;
  }
  .subheading {
    height: 22px;
    font-size: 16px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 22px;
  }
  .headingNotice {
    margin-top: 16px;
    width: 266px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
  .right-section {
    width: 50%;
  }
  .svgImg {
    position: absolute;
    top: calc(25%);
    max-width: 100%;
    max-height: 100%;
  }
</style>
