<template>
  <div unit-type="3" class="unit-templet video active" title="直播">
    <ul class="list-content">
      <li class="v35-activity-card mb">
        <i class="menu-icon del"></i>
        <div class="card-top">
          <span class='card-status sub'>empty($accountconfig['ui.change_webinar_notice'])?'预告':$accountconfig['ui.change_webinar_notice'];</span>
          <span class="card-status playback">回放</span>
          <span class='card-status live'>直播</span>
          <span class='card-status end'>结束</span>
          <span class='card-status demand'>点播</span>
          <span class='card-status playback'>回放</span>
          <a>
            <img class="live-play-icon" src="//cnstatic01.e.vhall.com/static/img/mobile/play_.png">
            <img src="//cnstatic01.e.vhall.com/static/img/v35-webinar.png">
            <div class="num">
              <div class="view_num"><i class="num-icon view-icon-h5-2"></i>66</div>
              <span class="card-type">付费</span>
              <span class='card-type hide'>免费</span>
              <span class='card-type'>密码</span>
              <span class='card-type'>白名单</span>
              <span class='card-type'>付费</span>
              <span class='card-type'>邀请码</span>
              <span class='card-type'>注册表单</span>
              <span class='card-type'>付费/邀请码</span>
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
    <i class="menu-icon del"></i>
  </div>
</template>

<script>
export default {
name: "showImgLink.vue"
};
</script>

<style lang="less" scoped>
.unit-templet {
  position: relative;
  box-sizing: border-box;
  border: dashed 1px #eee;
  padding: 5px;
  margin: 10px 10px;
  word-wrap: break-word;
  &.active,&:hover {
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
  }
  .content {
    line-height: 1.5;
    color: #666;
    font-size: 12px;
  }
}
.del {
  position: absolute;
  display: block;
  top: -20px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(../../../common/images/custom-tab/delete_icon.png) !important;
  background-size: cover;
  background-position: 100% 100%;
  margin: 8px auto 0 auto;
}
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
    span {
      position: absolute;
      top: 0;
      left: 0;
      padding: 2px 4px;
      line-height: 16px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      background-color: #999999;
      z-index: 2;
    }
    a {
      cursor: pointer;
      display: block;
      position: relative;
      overflow: hidden;
    }
    img {
      border: none;
      width: 100%;
      height: 88px;
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
.view-icon-h5-2 {
  background-image: url(../../../common/images/custom-tab/view2.png);
  background-size: 83%;
  vertical-align: -2px;
  background-repeat: no-repeat;
  margin-right: 5px;
  background-position: 2px 7px;
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
