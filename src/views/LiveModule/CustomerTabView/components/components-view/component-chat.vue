<template>
  <div class="phone-chat-template">
    <img
      src="//cnstatic01.e.vhall.com/static/images/menu/chat-temp-new-h5.png"
      alt=""
      class="phone-chat-img"
    />
    <span class="phone-welcome">
      <span>游客***</span>
      {{ menuInfo.welcome_content || '欢迎你的到来观看' }}
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      menuInfo: {
        requred: false
      }
    },
    name: 'component-chat'
  };
</script>

<style lang="less" scoped>
  .phone-chat-template {
    position: relative;
    box-sizing: border-box;
    width: 286px;
    margin: 0 auto;
  }
  .phone-chat-img {
    width: 100%;
    height: auto;
    border-radius: 0 0 4px 13px;
  }
  .phone-welcome {
    display: inline-block;
    position: absolute;
    left: 50%;
    bottom: 29%;
    min-width: 230px;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    padding: 6px 35px 7px 35px;
    border-radius: 30px;
    background-color: #202020;
    text-align: center;
    color: #ccc;
    font-size: 12px;
    box-sizing: border-box;
    opacity: 0.9;
  }
</style>
