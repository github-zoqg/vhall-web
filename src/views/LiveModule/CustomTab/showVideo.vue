<template>
  <ul class="list-content">
    <li class="v35-activity-card mb">
      <i class="menu-icon del"></i>
      <div class="card-top">
        <span class="liveTag"><img src="../../../common/images/live.gif" alt="">预告|互动直播</span>
        <a>
          <img class="live-play-icon" src="//cnstatic01.e.vhall.com/static/img/mobile/play_.png" alt="" />
          <img class="live-bg" src="//cnstatic01.e.vhall.com/static/img/v35-webinar.png" alt="" />
          <div class="num">
            <div class="view_num"><icon class="num-icon view-icon-h5-2" icon-class="saasel-icon-v3-financial"></icon>66</div>
          </div>
        </a>
      </div>
      <div class="card-bottom">
        <p class="title">直播示例</p>
        <p class="info">
          <time>2018-06-28 16:00</time>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "showImgLink.vue",
  props: {
    // 当前展示组件下标
    p_show_comps_index: {
      type: Number
    },
    // 组件专属ID
    component_id: {
      type: Number
    }
  }
};
</script>

<style lang="less" scoped>
.list-content {
  .flex-display();
  .justify(space-between);
  .wrap(wrap);
}
.v35-activity-card {
  width: calc(50% - 10px);
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
  border-radius: 2px;
  margin: 5px;
  cursor: pointer;
  position: relative;
  .card-top {
    padding: 0 !important;
    position: relative;
    .liveTag {
      position: absolute;
      top: 4px;
      left: 4px;
      background: #000000;
      border-radius: 10px 100px 100px 10px;
      opacity: 0.65;
      z-index: 5;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 15px;
      img {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 8px;
        margin-right: 2px;
      }
    }
    .live-bg {
      width: 100%;
      height: auto;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    }
    a {
      cursor: pointer;
      display: block;
      position: relative;
      overflow: hidden;
    }
  }
  .card-bottom {
    position: relative;
    height: 46px;
    overflow: hidden;
   .title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding: 3px 5px 3px 5px !important;
      font-size: 14px;
    }
    .info {
      margin-top: -3px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding: 3px 5px 3px 5px !important;
      font-size: 12px;
      color: #999;
    }
  }
}
.live-play-icon {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 2;
  border: none !important;
  top: 50% !important;
  margin-top: -20px !important;
  width: 40px !important;
  height: 40px !important;
  max-width: none;
}
.num {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30px;
  text-align: right;
  background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0)), to(#000));
  background: linear-gradient(rgba(0,0,0,0), #000);
  padding-top: 8px;
  opacity: .9;
  padding-right: 6px;
  box-sizing: border-box;
}
.view_num, .live-num {
  color: #ddd;
  display: inline-block;
  position: static !important;
  opacity: 1;
  background-color: transparent;
  line-height: 16px;
}
.num-icon {
  display: inline-block;
  background-size: cover;
  background-position: 100% 100%;
  width: 20px;
  height: 20px;
  vertical-align: -4px;
}
.card-type {
  display: inline-block;
  position: static !important;
  background: transparent !important;
  padding: 2px 1px 2px 8px !important;
  padding: 0 5px;
  color: #ddd;
  bottom: 11px;
  right: 11px;
  top: auto;
  left: auto;
  &:before {
    display: inline-block;
    content: '';
    position: relative;
    top: 2px;
    left: -6px;
    width: 1px;
    height: 14px;
    background-color: #ddd;
  }
}
</style>
