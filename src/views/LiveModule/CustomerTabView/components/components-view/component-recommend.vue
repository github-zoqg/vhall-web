<template>
  <div class="menu-cont show">
    <div class="recommend-list">
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>示例-直播技术</span>
      </div>
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>示例-推荐示例</span>
      </div>
    </div>
    <div class="tips-box">
      <span class="tips-title">温馨提示：</span>
      <div class="tips-content">
        请在
        <span><a href="javascript:;" @click="goLink">【广告】</a></span>
        中添加内容
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'component-recommend',
    methods: {
      goLink() {
        this.$router.push({
          path: `/live/advertCard/${this.$route.params.str}`
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .recommend-list {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    user-select: none;
  }
  .recommend-item {
    width: 137px;
    height: 133px;
    overflow: hidden;
    background: #f7f7f7;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 12px;
    img {
      display: block;
      width: 100%;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    span {
      display: block;
      text-align: justify;
      font-size: 14px;
      padding: 0 8px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
    }
  }
  .tips-box {
    margin-top: 80px;
    margin-left: 20px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    .tips-title {
      color: #fb3a32;
      line-height: 20px;
      margin-bottom: 8px;
    }
    a {
      color: #fb3a32;
    }
  }
</style>
