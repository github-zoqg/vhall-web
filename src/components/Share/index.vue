<template>
  <div class="shareWrap">
    <div class="top">
      <div class="left">
        <p class="title">分享直播</p>
        <div class="icons">
          <i class="icon">
            <icon icon-class="saasweixin"></icon>
          </i>
          <i class="icon">
            <icon icon-class="saasweibo"></icon>
          </i>
          <i class="icon">
            <icon icon-class="saasqq"></icon>
          </i>
        </div>

      </div>
      <div class="right">
        <p class="title">手机扫码观看</p>
        <img :src="qrcode" alt="二维码加载失败" class="qrcode">
      </div>
    </div>
    <div class="bottom">
      <span class="title">分享链接</span>
      <span class="linkUrl">{{url}}</span>
      <el-button type="primary" size="mini" @click="doCopy">复制</el-button>
    </div>
  </div>
</template>

<script>
import QRcode from 'qrcode';
export default {
  data(){
    return {
      qrcode: '',
    };
  },
  props: {
    url:{
      type: String,
      required: true
    }
  },
  created(){
    let a = QRcode.toDataURL(
      this.url,
      (err, url) => {
        console.log(err, url);
        this.qrcode = url;
      }
    );
  },
  methods: {
    doCopy () {
      this.$copyText(this.url).then(e => {
        this.$message.success('复制成功！');
      }).catch(error=>{
        this.$message.error('复制失败！');
      });
    },
  }
};
</script>

<style lang="less" scoped>
  .shareWrap{
    display: inline-block;
    // padding: 20px;
    background: #fff;
  }
  .title{
    font-size: 14px;
    color: #666;
  }
  .left,.right{
    display: inline-block;
    vertical-align: top;
  }
  .left{
    margin-right: 30px;
  }
  .right{
    float: right;
  }
  .qrcode{
    display: block;
    width: 88px;
    height: 88px;
    margin-bottom: 10px;
    border: 1px solid #d8d8d8;
    margin-top: 10px;
  }
  .bottom{
    margin-top: 12px;
  }
  .top{
    border-bottom: 1px solid #e5e5e5;
    overflow: hidden;
  }
  .icons{
    margin-top: 20px;
  }
  .linkUrl{
    background-color: #e5e5e5;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 12px;
    margin: 0 6px;
  }
  .el-button--mini{
    padding: 4px 10px;
    vertical-align: middle;
    margin-top: -2px;
  }
  .icon{
    width: 44px;
    height: 44px;
    color: #fff;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    line-height: 44px;
    margin-right: 30px;
    cursor: pointer;
    .iconContainer{
      font-size: 24px;
    }
    &:nth-child(1){
      background: rgb(97, 233, 44);
    }
    &:nth-child(2){
      background: rgb(255, 51, 51);
    }
    &:nth-child(3){
      background: rgb(80, 149, 255);
      margin-right: 0px;
    }
  }
</style>
