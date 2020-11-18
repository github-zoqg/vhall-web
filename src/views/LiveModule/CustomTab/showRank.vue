<template>
  <div>
    <div class="ranking-title">
      <div class="rank-menu fl">
        <span data-id="0" data-is="1">邀请榜</span>
        <span data-id="1" data-is="1">打赏榜</span>
      </div>
      <span class="bang-rule fr">排行榜规则</span>
    </div>
    <div class="ranking-box">
      <div data-id="0" class="rank-con show">富文本编辑结果展示区</div>
      <div data-id="1" class="rank-con"></div>
    </div>
    <div class="rank-band">
      <img src="//cnstatic01.e.vhall.com/static/images/menu/bang01.png" alt="" />
      <img style="display: none;" src="//cnstatic01.e.vhall.com/static/images/menu/bang02.png" alt="" />
    </div>
  </div>
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
.fl {
  float: left;
}
.fr {
  float: right;
}
.ranking-title {
  display: block;
  margin: 0 0 0 20px;
  color: #fff;
  height: 20px;
}
.rank-menu {
  margin-left: -18px;
}
.ranking-box {
  clear: both;
  background-color: #f2f2f2;
  min-height: 0;
  margin: 20px 0 6px 0;
}
.rank-con {
  display: none;
  margin: 0 10px;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
  &.show {
    display: block;
  }
}
.rank-band {
  padding: 10px 0;
  background-color: #fff;
  img {
    width: 100%;
    height: auto;
  }
}
.menu-cont {
  min-height: 460px;
  display: none;
  width: 100%;
}
.bang-rule:after {
  content: '';
  display: inline-block;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  transition: -webkit-transform .2s;
  -webkit-transition: -webkit-transform .2s;
  transition: transform .2s;
  transition: transform .2s, -webkit-transform .2s;
  width: 12px;
  height: 12px;
  background-image: url(../../../common/images/custom-tab/arror-detail.png);
  background-size: cover;
  background-position: 100% 100%;
  margin-left: 7px;
  vertical-align: -1px;
}
</style>
