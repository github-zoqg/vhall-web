<template>
  <div class="lives-wrapbox">
    <liveChecked
      :checkedList="info.webinars"
      @link='linkWatch'
    ></liveChecked>
  </div>
</template>
<script>
import liveChecked from './live-checked'
export default {
  props: {
    info: {
      required: false
    }
  },
  components: {
    liveChecked
  },
  data() {
    return{
    }
  },
  methods: {
    linkWatch () {
      window.location.href = process.env.VUE_APP_WEB_URL + `/watch/${this.$route.params.il_id}`
    }
  }
}
</script>
<style lang="less" scoped>
  .lives-wrap{
    width: 100%;
  }
  /deep/ .menus-checkedBox{
    width: 100%;
    min-height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .vh-chose-active-item{
      width: 240px;
      height: 202px;
      margin-right: 16px;
      margin-bottom: 20px;
      .vh-chose-active-item__cover{
        height: 136px;
      }
      .vh-chose-active-item__title{
        font-size: 16px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #000000;
        line-height: 24px;
      }
      .vh-chose-active-item__info{
        height: 18px;
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
      }
    }
  }
</style>
