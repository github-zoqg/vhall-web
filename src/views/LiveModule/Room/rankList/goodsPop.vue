<template>
  <!-- 商品信息弹框 -->
  <div class="vhall-goods-dialog">
    <span @click = 'closeDialog' class="iconfont iconguanbi"></span>
    <div class="dialog-left">
      <img class="big-image" :src="bigImageUrl" alt="" />
      <div>
        <template v-if="goodsAllInfo.img_list.length > 0">
          <div
            @click="changeBigImage(item, index)"
            class="mini-image"
            v-for="(item,index) in goodsAllInfo.img_list"
            :key="index"
          >
            <img :src="item.img_url" alt="" />
          </div>
        </template>
      </div>
    </div>
    <div class="dialog-right">
      <h3>{{ goodsAllInfo.name }}</h3>
      <p class="goods-price">
        <span>￥{{ goodsAllInfo.discount_price }}</span>
        <span>￥{{ goodsAllInfo.price }}</span>
      </p>
      <p class="goods-description">{{ goodsAllInfo.description }}</p>
      <el-button @click="nowPurchase" class="right-now-buy">立即购买</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsAllInfo: {
      required: true
    }
  },
  data () {
    return {
      bigImageUrl: '',
      dominImage: ''
    };
  },
  created () {
  },
  watch: {
    goodsAllInfo: {
      handler (val) {
        if(val) {
          this.bigImageUrl = this.goodsAllInfo.img_list[0].img_url
          return val
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog () {
      this.$emit('closeGoodPop');
    },
    // 立即购买
    nowPurchase () {
      window.location.href = this.goodsAllInfo.goods_url;
    },
    // 切换图片按钮
    changeBigImage (item, index) {
      this.bigImageUrl = item.img_url
      const [...selectPhoto] = document.querySelectorAll('.mini-image');
      selectPhoto.map((item, index) => {
        item.style.border = 'none';
      });
      selectPhoto[index].style.border = '1px solid #fc5659';
    }
  }
};
</script>
<style lang="less">
  .vhall-goods-dialog {
    width: 750px;
    height: 400px;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background: #fff;
    z-index: 100;
    overflow: hidden;
    padding: 18px;
    border-radius: 6px;

    .iconguanbi {
      float: right;
      font-size: 12px;
      color: #888;
      margin-right: 6px;
      margin-top: 5px;
      cursor: pointer;
    }
    .dialog-left {
      float: left;

      .big-image {
        width: 300px;
        height: 300px;
        border: solid 1px #dadada;
      }

      .mini-image {
        float: left;
        margin-right: 10px;
        width: 50px;
        height: 50px;
        /* border: solid 1px #fc5659; */
        /* &:hover {
        width: 48px;
        height: 48px;
        border: solid 1px #fc5659;
      } */
        img {
          width: 50px;
          height: 50px;
          cursor: pointer;
        }
      }
      div {
        div:first-of-type {
          border: 1px solid #fc5659;
        }
      }
    }

    .dialog-right {
      float: left;
      margin-top: 139px;
      margin-left: 20px;
      width: 390px;
      h3 {
        max-width: 390px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .goods-description {
        width: 390px;
        font-size: 12px;
        word-break: break-all;
      }

      .right-now-buy {
        width: 200px;
        height: 30px;
        border-radius: 2px;
        border: none;
        background: #fc5659;
        color: #fff;
        line-height: 7px;
        margin-top: 30px;
      }

      .goods-price {
        margin-top: 15px;
        margin-bottom: 15px;
        span:first-of-type {
          font-size: 24px;
          font-weight: 500;
          color: #fc5659;
          margin-right: 2px;
        }

        span:last-of-type {
          padding-left: 3px;
          font-size: 18px;
          font-weight: 500;
          color: #d2d2d2;
          text-decoration: line-through;
          font-family: helvetica;
        }
      }
    }
  }
</style>
