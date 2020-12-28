<template>
  <div  class="menu-cont show">
    <div class="recommend-list">
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>北京微吼时代科技有限公司年中总结会</span>
      </div>
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>北京微吼时代科技有限公司年中总结会</span>
      </div>
    </div>
    <div class="tips-box">
      <span class="tips-title">温馨提示：</span>
      <div class="tips-content">请在左侧导航栏中的<span><a href="http://www.baidu.com/">【推荐】</a></span>中添加内容</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'component-recommend'
};
</script>

<style lang="less" scoped>
.recommend-list {
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
}
.recommend-item {
  width: 160px;
  margin: 18px 9px;
  img {
    display: block;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  span {
    display: block;
    text-align: justify;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
}
.tips-box {
  margin-top: 120px;
  margin-left: 20px;
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
</style>
