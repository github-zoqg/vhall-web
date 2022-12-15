<template>
  <div class="moduleTutorialWrap">
    <div class="content">
      <p class="title">使用场景</p>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">
          在系列培训、峰会论坛等场景，场次多、场地多是常见现象。如何让观众在同一个页面找到自己想看的内容？
        </p>
      </article>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">
          企业前期宣传时，使用专题功能，只需要将专题链接一键分享推广，用户访问后进入专题页面，可以任意观看不同分会场活动。
        </p>
      </article>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="less" scoped>
  .moduleTutorialWrap {
    background-image: url('../../../common/images/introduce.png');
    background-size: cover;
    height: 500px;
  }
  .content {
    padding: 186px 0 0 445px;
    .title {
      width: 95px;
      height: 24px;
      background: #fb3d32;
      border-radius: 12px;
      color: #ffffff;
      line-height: 24px;
      font-size: 16px;
      font-family: HiraginoSansGB-W6, HiraginoSansGB;
      text-align: center;
    }
    .valueItem {
      .itemTitle {
        width: 33px;
        height: 3px;
        margin-top: 22px;
        // background-image: linear-gradient(to right, color-stop1, color-stop2);

        background: linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, #fb3b32 100%);
      }
      .itemValue {
        width: 230px;
        padding-top: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 20px;
      }
    }
  }
</style>
