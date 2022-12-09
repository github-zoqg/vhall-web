<template>
  <div class="moduleTutorialWrap">
    <div class="content">
      <p class="title">使用场景</p>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">通过微吼直播平台生成的回放进行本地下载时只有视频内容。</p>
      </article>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">
          用户希望下载时文档与视频合并为一个MP4文件。使用课件重制功能对回放内容编辑后，您可下载至本地进行离线观看。
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
    background-image: url(../images/vodresetbg.png);
    background-size: cover;
    height: 500px;
    border-radius: 8px;
  }
  .content {
    padding: 185px 0 0 455px;
    .title {
      width: 95px;
      height: 24px;
      background: #fb3d32;
      border-radius: 12px;
      color: #ffffff;
      line-height: 24px;
      font-size: 16px;
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
        font-weight: 500;
        color: #000000;
        line-height: 20px;
      }
    }
  }
</style>
