<template>
  <div  class="menu-cont show">
    <div class="recommend-list">
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>示例-直播技术</span>
      </div>
      <div class="recommend-item">
        <img src="//cnstatic01.e.vhall.com/static/images/menu/recommend-bg-new.png" alt="" />
        <span>示例-推荐示例</span>
      </div>
    </div>
    <div class="tips-box">
      <span class="tips-title">温馨提示：</span>
      <div class="tips-content">请在左侧导航栏中的<span><a href="javascript:;">【推荐】</a></span>中添加内容</div>
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
  user-select: none;
}
.recommend-item {
  width: 137px;
  height: 133px;
  overflow: hidden;
  background: #F7F7F7;
  border-radius: 4px;
  overflow:hidden;
  margin: 0 12px;
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
    padding: 0 8px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
  }
}
.tips-box {
  margin-top: 80px;
  margin-left: 20px;
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  .tips-title{
    color: #FB3A32;
    line-height: 20px;
    margin-bottom: 8px;
  }
  a{
    color: #FB3A32;
  }
}
</style>
