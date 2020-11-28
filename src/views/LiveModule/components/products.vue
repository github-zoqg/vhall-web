<template>
  <div class="sell-goods">
    <el-carousel
      :autoplay="false"
      arrow="hover"
      height="515px"
      indicator-position="none"
      :loop="false"
    >
      <el-carousel-item v-for="good in goodsList" :key="good.goods_id">
        <div class="sell-goods-item">
          <div class="sell-image" @click="sellGoodsInfo(good)">
            <img src="http://yapi.vhall.domain/api/user/avatar?uid=1187" alt />
          </div>
          <h3 :title="good.name" class="sell-title">
            {{ good.name }}
          </h3>
          <span style="color:#FC5659;font-size:24px;">
            ￥{{ 90 || good.discount_price }} &nbsp;
            <span
              style="color: #D2D2D2; font-size: 18px;text-decoration:line-through;"
              >￥{{ 100 || good.price }}</span
            >
          </span>
          <p class="sell-info" :title="good.description">
            {{ good.description }}
          </p>
          <el-button @click="comeSelling(good)" class="selling"
            >即将发售</el-button
          >
          <a
            :href="good.shop_url"
            v-if="good.shop_url"
            class="go-store"
            >去店铺 ></a
          >
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    props: {
      goodsList: Array,
    },
    methods: {
      sellGoodsInfo(good) {
        this.$emit('sellGoodsInfo', good);
      },
      // 即将发售
      comeSelling(good) {
        window.location.href = good.good_url;
      },
    }
  };
</script>

<style lang="less" scoped>
  .sell-goods {
    /* width: 234px; */
    height: 515px;
    margin-left: 15px;
    width: calc(16% + 60px);
    float: right;
    background: #fff;
    margin-top: 20px;
    margin-bottom: 40px;
    border: 1px solid #d2d2d2;
    box-sizing: content-box;
    cursor: pointer;
    .sell-goods-item {
      margin: 30px;
    }
    .sell-image {
      display: block;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .sell-title {
      font-size: 19px;
      margin-top: 20px;
      margin-bottom: 10px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 26px;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .sell-info {
      font-size: 14px;
      line-height: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      margin-top: 20px;
      margin-bottom: 20px;
      max-width: 230px;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selling {
      width: 100%;
      height: 30px;
      line-height: 8px;
      background: rgba(252, 86, 89, 1);
      color: #fff;
      font-size: 12px;
      border: none;
    }

    .go-store {
      display: block;
      color: rgba(252, 86, 89, 1);
      font-size: 12px;
      width: 50px;
      margin: 0 auto;
      margin-top: 20px;
    }
  }
</style>
