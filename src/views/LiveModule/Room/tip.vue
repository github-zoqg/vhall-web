<template>
<div class="tip-wrap">
    <div class="tip-content">
      <div class="image-container" />
      <p v-html="text"></p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      default: '当前地址已失效，请联系主办方了解详情'
    }
  }
};
</script>
<style lang="less">
.tip-wrap{
  height: 100vh;
  width: 100%;
  position: relative;
  .tip-content{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -370px;
    margin-top: -78px;
    width:740px;
    height: 156px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .image-container{
      height: 130px;
      width: 148px;
      background: url('./img/publish/invalid_url.png') no-repeat;
    }
    p{
      font-family: '\5FAE\8F6F\96C5\9ED1';
      user-select: none;
    }
  }
}
</style>
