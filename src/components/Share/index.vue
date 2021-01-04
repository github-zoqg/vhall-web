<template>
  <div class="shareWrap">
    <div class="top">
      <div class="left">
        <p class="title">分享直播</p>
        <div class="icons">
          <img class="icon icon_wechat" src="../../common/images/sys/icon_wechat.png" alt="" @click="toShare('wechat')"/>
          <img class="icon icon_sina" src="../../common/images/sys/icon_sina.png" alt="" @click="toShare('sina')"/>
          <img class="icon icon_qq" src="../../common/images/sys/icon_qq.png" alt="" @click="toShare('qq')"/>
        </div>

      </div>
      <div class="right">
        <p class="title">手机扫码观看</p>
        <img :src="env.staticLinkVo.aliQr + (shareVo.url || url)" alt="二维码加载失败" class="qrcode">
      </div>
    </div>
    <div class="bottom">
      <span class="title">分享链接</span>
      <el-input :value="shareVo.url || url" class="linkUrl" readonly style="width:300px;padding: 0 5px"></el-input>
      <el-button type="primary" size="mini" @click="doCopy">复制</el-button>
    </div>
  </div>
</template>

<script>
import Env from '@/api/env';
export default {
  data(){
    return {
      env: Env
    };
  },
  props: {
    url:{
      type: String,
      required: false
    },
    shareVo: {
      type: Object,
      required: false
    }
  },
  methods: {
    toShare(type) {
      let url = '';
      if(type === 'wechat') {
        // ag: url = http://t.e.vhall.com/v3/#/lives/room/570327731&sharesource=qzone&title=分享标题&pics=&summary=测试用
          url = `//aliqr.e.vhall.com/qr.png?t=${this.shareVo.url || this.url}`
      }
      else if (type === 'sina') {
        // http://service.weibo.com/share/share.php?url=你的分享网址&sharesource=weibo&title=你的分享标题&pic=你的分享图片&appkey=你的key，需要在新浪微博开放平台中申请
        // https://service.weibo.com/share/share.php?url=https://t.e.vhall.com/user/home/16421384&title=我在微吼直播，这是我的主页 主页标题，欢迎围观。主页简介&pic=主页头像地址&appkey=&searchPic=false
        url = `http://service.weibo.com/share/share.php?url=${this.shareVo.url || this.url}`
      }
      else if (type === 'qq') {
        url = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${this.shareVo.url || this.url}`
      }
      window.open(url, '_blank');
    },
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
    width: 400px;
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
    .icon {
      display: inline-block;
      vertical-align: middle;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      margin-right: 12px;
      cursor: pointer;
    }
  }
  .linkUrl{
    // background-color: #e5e5e5;
    border-radius: 4px;
    // padding: 2px 8px;
    font-size: 12px;
    margin: 8px 0px;
  }
  .el-button--mini{
    padding: 4px 10px;
    vertical-align: middle;
    margin-top: -2px;
  }
</style>
