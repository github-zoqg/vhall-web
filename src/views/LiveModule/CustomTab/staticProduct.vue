<template>
  <div class="menu-cont show">
    <div class="goods-list">
      <img src="//cnstatic01.e.vhall.com/static/images/menu/good-bg-new.png" alt="" />
      <div class="goods-info">
        <span class="goods-title">黑科技立体电子魔方</span>
        <div class="price">
          <span>￥280</span>
          <span>￥<i>370</i></span>
        </div>
        <span class="goods-btn">查看详情</span>
      </div>
    </div>
    <div class="tips-box">
      <span class="tips-title">温馨提示：</span>
      <div class="tips-content">请在左侧导航栏中的<span><a href="http://www.baidu.com/">【商品展示】</a></span>中添加内容</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "staticProduct.vue"
};
</script>

<style lang="less" scoped>
.goods-list {
  margin-top: 0;
  margin-left: 12px;
  overflow: hidden;
}
.goods-list img {
  width: 100px;
  float: left;
  border-radius: 4px;
  overflow: hidden;
}
.goods-list .goods-info {
  float: left;
  width: calc(100% - 112px);
  margin-left: 12px;
}
.goods-info .goods-title {
  display: block;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1A1A1A;
  line-height: 20px;
}
.goods-info .price {
  margin-top: 9px;
  span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
}
.price span:nth-child(1) {
  font-size: 18px;
  color: #FB3A32;
  margin-right: 8px;
}
.price span:nth-child(2) i {
  font-style: inherit;
  text-decoration: line-through;
}
.goods-info .goods-btn {
  display: inline-block;
  text-align: center;
  width: 88px;
  height: 32px;
  background: #FB3A32;
  border-radius: 20px;
  line-height: 32px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  margin-top: 16px;
}
.tips-box {
  margin-top: 125px;
  margin-left: 12px;
}
span.tips-title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FB3A32;
  line-height: 20px;
}
.tips-content {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1A1A1A;
  line-height: 20px;
  margin-top: 4px;
}
</style>
