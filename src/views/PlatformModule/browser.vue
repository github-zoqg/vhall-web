<template>
  <div class="download-wrap" data-v-36c9cdbc="">
    <div class="download-chrome">
      <icon icon-class="saasbrowser"></icon>
      <div class="right-donwload">
        <p>系统检测到您当前使用的不是Chrome浏览器，请使用Chrome浏览器74及以上版本重新进入直播</p>
        <a href=" https://www.google.cn/chrome/" target="_blank">立即下载Chrome</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'browser.vue',
    created() {
      // 若检测通过，跳转到前一个地址
      // this.$router.go(-1);
    }
  };
</script>

<style lang="less" scoped>
  .download-wrap {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .download-wrap .download-chrome {
    display: inline-block;
    vertical-align: middle;
    margin: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -370px;
    margin-top: -78px;
    width: 740px;
    height: 156px;
  }
  .download-wrap .download-chrome span {
    font-size: 156px;
    color: #dce5ec;
    display: inline-block;
    vertical-align: middle;
    margin-right: 27px;
  }
  .download-wrap .download-chrome .right-donwload {
    display: inline-block;
    vertical-align: middle;
  }
  .download-wrap .download-chrome .right-donwload p {
    font-size: 21px;
    color: #444;
    width: 539px;
  }
  .download-wrap .download-chrome .right-donwload a {
    width: 120px;
    height: 40px;
    display: block;
    background-color: #fc5659;
    border-radius: 4px;
    text-decoration: none;
    color: #ffffff;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    margin-top: 12px;
  }
</style>
