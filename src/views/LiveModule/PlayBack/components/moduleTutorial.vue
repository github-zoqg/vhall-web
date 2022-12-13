<template>
  <div class="moduleTutorialWrap">
    <div class="content">
      <p class="title">使用场景</p>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">在观看录播课或回放时，学员希望根据精彩看点的提示观看喜欢的内容。</p>
      </article>
      <article class="valueItem">
        <p class="itemTitle"></p>
        <p class="itemValue">
          如何满足呢？使用章节打点功能，对视频进行文档关联后，学员点击目录纲要让视频跳转到相应时间点播放。
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
    background-image: url(../images/tutorial-bg.png);
    background-size: cover;
    height: 500px;
  }
  .content {
    padding: 223px 0 0 455px;
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
