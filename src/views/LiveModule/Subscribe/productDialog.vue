<template>
  <VhallDialog
    title=""
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="770px">
    <div class="info">
      <div class="imageBox">
        <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
      </div>
      <div class="detail">
        <p class="title">手持无绳擦地机机器人扫地人扫地器人扫地人</p>
        <p class="price">
          <span>
            ￥699.00
          </span>
          <span>
            ￥<i>900.00</i>
          </span>
        </p>

        <p class="desc">
          这种模拟人手擦地的高频率震动，搭配两片拖布，效果相当于1分钟里擦了地板1000次，清洁力是一般手动拖地的60-80倍。
        </p>
        <el-button type="primary" class="fullBut">即将发售</el-button>
      </div>
      <img v-for="item in 3" :key="`thumbnail${item}`" @click="thumbnailActive=item" src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="加载失败" :class="{thumbnail: true, active: thumbnailActive==item}">
    </div>
  </VhallDialog>
</template>

<script>
export default {
  data(){
    return {
      dialogVisible: false,
      thumbnailActive: 0
    };
  }
};
</script>

<style lang="less" scoped>
  .imageBox{
    width: 300px;
    height: 300px;
    border: 1px solid #dadada;
    display: inline-block;
    vertical-align: bottom;
    padding: 2px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .detail{
    display: inline-block;
    width: 370px;
    margin-left: 30px;
    .title{
      font-size: 19px;
      color: #333;
      font-weight: bold;
      width: 100%;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      line-height: 24px;
    }
    .price{
      span:nth-child(1){
        font-size: 24px;
        color: #FC5659;
      }
      span:nth-child(2){
        font-size: 18px;
        color:#D2D2D2;
        i{
          text-decoration: line-through;
          font-style: normal;
        }
      }
    }
    .desc{
      font-size: 14px;
      color: #666;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
  .thumbnail{
    width: 50px;
    height: 50px;
    cursor: pointer;
    margin: 10px 0;
    margin-right: 10px;
    &.active{
      border: solid 1px #fc5659;
    }
  }
</style>
