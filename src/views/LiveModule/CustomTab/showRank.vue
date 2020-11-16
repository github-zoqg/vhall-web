<template>
  <div  data-unit-type="9" class="unit-templete ranking-list active" title="排行榜">
    <i class="menu-icon del"></i>
    <div class="ranking-title">
      <div class="rank-menu fl">
        <span data-id="0" class="rank-active" data-is="1">邀请榜</span>
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
name: "showImgLink.vue"
};
</script>

<style lang="less" scoped>
.unit-templete {
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  word-wrap: break-word;
  background-image: url(../../../common/images/custom-tab/rank-bg.png) !important;
  min-height: 32px;
  margin: 10px;
  cursor: pointer;
  -webkit-transition: border .3s;
  transition: border .3s;
  border: 1px dashed #58ABFF;
  background: rgba(88,171,255,0.1);
  &.active,&:hover {
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
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
.fl {
  float: left;
}
.fr {
  float: right;
}
.ranking-list {
  .ranking-title {
    display: block;
    margin: 0 30px 0 20px;
    color: #fff;
  }
  .rank-menu {
    margin-left: -18px;
  }
  .ranking-box {
    position: relative;
    background-color: #f2f2f2;
    min-height: 0;
    margin: 30px 0 6px 0;
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
  }
  .menu-cont {
    min-height: 460px;
    display: none;
    width: 100%;
  }

}
</style>
