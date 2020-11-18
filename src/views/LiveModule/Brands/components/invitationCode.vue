<template>
  <div class="show-img">
          <div class="show-container">
            <div class="show-header">
              <div class="show-avator"></div>
              <p>微吼直播</p>
              <p>邀请你一起看直播</p>
            </div>
            <div class="show-text">
              <h1>遇见生活—生活方<br>式生活方式面面观</h1>
              <p>2020北京国际家具展暨智能生活节于6月14-17日在北京中国国际会展中心（新馆）盛大召开。</p>
              <p><i class="el-icon-time"></i></p>
              <span>2020-11-26 14:30</span>
              <p><i class="el-icon-location-information"></i></p>
              <span>北京 中国国际会展中心</span>
            </div>
            <div class="show-footer">
              <div class="show-code"></div>
              <div class="show-action">
                <p>扫 / 描 / 二 / 维 / 码</p>
                <h1>立 即 参 与 活 动</h1>
                <p>长按保存图片后分享</p>
              </div>
            </div>
          </div>
        </div>
</template>
<script>
export default {

};
</script>
<style lang="less" scoped>
  .show-img {
      // width: 520px;
      // height: 980px;
      border-radius: 4px;
      border: 1px solid #E2E2E2;
      background-image: url('../../../../common/images/v35-webinar.png');
      background-size: cover;
      .show-container{
        margin: 70px 32px;
        background: #fff;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        .show-header{
          padding: 40px 36px;
          text-align: center;
          .show-avator{
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin: auto;
            margin-bottom: 10px;
          }
          p{
            padding: 0;
            font-size: 24px;
            color: #666;
            font-weight: 400;
            line-height: 28px;
          }
        }
        .show-text{
          padding: 0 36px;
          text-align: center;
          h1{
            padding: 0;
            font-size: 40px;
            color:#1A1A1A;
            font-weight: 600;
            line-height: 50px;
          }
          p{
            font-size: 24px;
            color:#1A1A1A;
            font-weight: 400;
            line-height: 36px;
            padding: 0;
          }
        }
        .show-footer{
          display: flex;
          padding: 60px 36px 25px 36px;
          .show-code{
            width: 98px;
            height: 98px;
            border: 1px solid #ccc;
            margin-right: 16px;
            margin-left: 20px;
          }
          .show-action{
            h1{
              padding:0;
              font-size: 30px;
              color:#1A1A1A;
              font-weight: 600;
              line-height: 45px;
            }
            p{
              padding:0;
              font-size: 24px;
              color:#1A1A1A;
              font-weight: 400;
            }
          }
        }
      }
    }
</style>
