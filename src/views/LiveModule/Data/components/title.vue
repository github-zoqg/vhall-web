<template>
  <div class="container-box">
    <div class="flex-item">
      <div class="box-item">
       <img :src="liveDetailInfo.img_url" alt="">
      </div>
      <div class="box-title">
        <div class="title-status" v-if="liveDetailInfo.webinar_state == 1">
          <img src="../../../../common/images/live.gif" alt="">
          <b>直播</b>
        </div>
        <div class="title-status grayColor" v-else>
          <b>{{ liveDetailInfo.webinar_state | actionText }}</b>
        </div>
        <div class="title-text">
          <p>
            {{ liveDetailInfo.subject }}
          </p>
        </div>
        <div class="box-time">直播时间：{{ liveDetailInfo.start_time }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['liveDetailInfo']
};
</script>
<style lang="less" scoped>
.container-box {
  height: 114px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 30px;
}
.flex-item{
  display: flex;
}
.box-item {
  width: 146px;
  height: 81px;
  margin: 16px 21px 17px 16px;
  border-radius: 4px;
  img {
    width: 100%;
    height: 81px;
    border-radius: 4px;
  }
}
.box-title {
  margin-top: 18px;
  flex: 1;
  width: 70%;
  .title-status {
    width: 52px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: linear-gradient(180deg, #ff584b 0%, #ff2820 100%);
    border-radius: 25px;
    padding: 0 8px;
    img {
      height: 8px;
      // width: 8px;
      vertical-align: top;
      margin: 5px;
      background: #fff;
      transform: rotate(180deg)
    }
    b {
      display: inline-block;
      font-size: 12px;
      font-family: @fontRegular;
      color: #fff;
      vertical-align: top;
      // line-height: 18px;
    }
  }
  .grayColor {
    width: 46px;
    padding: 0 8px;
    background: #000000;
    opacity: 0.6;
    text-align: center;
    padding-left: 10px;
  }
  .title-text {
    padding-right: 50px;
    p {
      font-size: 20px;
      font-weight: 700;
      font-family: @fontRegular;
      color: #1a1a1a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 8px 30px 5px 0;
    }
  }
  .box-time {
    height: 20px;
    font-size: 14px;
    font-family: @fontRegular;
    color: #555;
    line-height: 20px;
  }
}
</style>
