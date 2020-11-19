<template>
<div class="download-wrap">
    <div class="download-chrome">
      <span class="iconfont iconyemiancuowu"></span>
      <div class="right-donwload">
        <p v-if="type == 'client'">{{$t('message.compatabilityTipA')}}</p>
        <p v-if="type == 'master'">{{$t('message.compatabilityTipB')}}</p>
        <a :class="{pad: lang == 'en'}" href="https://static01-class.e.vhall.com/vhallclass/browser/81.0.4044.92_chrome_installer.zip"> {{$t('message.downloadBrowser')}} </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      default: 'client'
    }
  },
  data () {
    return {
      lang: window.i18n.locale
    }
  }
}
</script>
<style lang="less">
.download-wrap{
  height: 100%;
  width: 100%;
  position: relative;
  .download-chrome{
    display: inline-block;
    vertical-align: middle;
    margin:auto;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -370px;
    margin-top: -78px;
    width:740px;
    height: 156px;
    span{
      font-size: 156px;
      color: #DCE5EC;
      display: inline-block;
      vertical-align: middle;
      margin-right: 27px;
    }
    .right-donwload{
      display: inline-block;
      vertical-align: middle;
      p{
        font-size: 21px;
        color: #444;
        width: 539px;
      }
      a{
        width:120px;
        height:40px;
        display: block;
        background-color:#FC5659;
        border-radius:4px;
        text-decoration:none;
        color: #FFFFFF;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        margin-top: 12px;
        &.pad{
          padding: 0px 10px;
        }
      }
    }
  }
}
</style>
