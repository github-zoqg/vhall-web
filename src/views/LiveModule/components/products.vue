<template>
  <div class="sell-goods">
    <el-carousel
      :autoplay="false"
      arrow="hover"
      height="453px"
      indicator-position="none"
      :loop="false"
    >
      <el-carousel-item v-for="good in goodsList" :key="good.goods_id">
        <div class="sell-goods-item">
          <div class="sell-image" @click="sellGoodsInfo(good)">
            <el-carousel
              height="235px"
              :autoplay="false">
              <el-carousel-item v-for="(item, i) in good.img_list" :key="i">
                <img :src="item.img_url" alt />
              </el-carousel-item>
            </el-carousel>
          </div>
          <h3 :title="good.name" class="sell-title">
            {{ good.name }}
          </h3>
          <span style="color:#FC5659;font-size:24px;">
            ￥{{ good.discount_price }} &nbsp;
            <span
              style="color: #D2D2D2; font-size: 18px;text-decoration:line-through;"
              >￥{{ good.price }}</span
            >
          </span>
          <p class="sell-info" :title="good.description">
            {{ good.description }}
          </p>
          <el-button @click="comeSelling(good)" class="selling"
            >{{ '立即购买' }}</el-button
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
      goodsList: {
        type: Array,
        default: () => {}
      },
    },
    methods: {
      sellGoodsInfo(good) {
        this.$emit('sellGoodsInfo', good.goods_id);
      },
      // 即将发售
      comeSelling(good) {
        window.location.href = good.goods_url;
      }
    }
  };
</script>

<style lang="less" scoped>
  .sell-goods {
    width: 300px;
    margin-top: 20px;
    height: 453px;
    background: #fff;
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
      /deep/ .el-carousel__arrow.el-carousel__arrow--left,
      /deep/ .el-carousel__arrow.el-carousel__arrow--right{
        display: none!important;
      }
    }

    .sell-title {
      font-size: 19px;
      margin-top: 20px;
      margin-bottom: 10px;
      font-family: @fontSemibold;
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
      font-family: @fontRegular;
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
