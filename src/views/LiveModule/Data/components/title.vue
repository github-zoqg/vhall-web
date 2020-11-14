<template>
  <el-card class="container-box">
    <div class="flex-item">
      <div class="box-item">
        <img src="@/common/images/v35-webinar.png" alt="" />
      </div>
      <div class="box-title">
        <div class="title-status" v-if="isStatus === 1">
          <i class="el-icon-share"></i>
          <b>直播</b>
        </div>
        <div class="title-status grayColor" v-else>
          <b>{{ isStatus === 2 ? '回放' : '结束' }}</b>
        </div>
        <div class="title-text">
          <p>
            直播名称当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据,直播名称当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据
          </p>
        </div>
        <div class="box-time">直播时间：2020-10-28 18:00:00</div>
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    isStatus: {
      type: Number,
      default: 1,
    },
  },
};
</script>
<style lang="less" scoped>
.container-box {
  /deep/.el-card__body {
    padding: 0;
  }
  height: 114px;
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
  img {
    width: 100%;
    height: 81px;
  }
}
.box-title {
  margin-top: 18px;
  flex: 1;
  width: 70%;
  .title-status {
    width: 52px;
    height: 18px;
    text-align: center;
    background: linear-gradient(180deg, #ff584b 0%, #ff2820 100%);
    border-radius: 10px;
    i {
      font-size: 12px;
      padding-right: 3px;
    }
    b {
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #fff;
      line-height: 18px;
    }
  }
  .grayColor {
    background: #000000;
    opacity: 0.6;
  }
  .title-text {
    padding-right: 50px;
    p {
      font-size: 20px;
      font-weight: 700;
      font-family: PingFangSC-Regular, PingFang SC;
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
    font-family: PingFangSC-Regular, PingFang SC;
    color: #555;
    line-height: 20px;
  }
}
</style>
