<template>
  <div>
    <div class="content-share">
      <div class="share-div">
        <ul class="icons">
          <li><i @click="toShare('qq')"></i><p>QQ</p></li>
          <li><i @click="toShare('sina')"></i><p>微博</p></li>
          <li><i @click="toShare('wechat')"></i><p>微信</p></li>
        </ul>
        <div class="inputCode">
            <el-input :value="shareVo.pcUrl || url" class="input-with-select" id="linkBox">
          </el-input>
          <span @click="doCopy">复制</span>
        </div>
      </div>
      <div class="code-div">
        <div class="code-img"><img :src="env.staticLinkVo.aliQr + (shareVo.url || url)" alt="二维码加载失败"><br></div>
        <p class="img-code">手机扫码观看</p>
      </div>
    </div>
    <div class="wx-dialog" v-if="wxDialogVisible">
      <div class="wximg-content">
        <p class="title">分享 <i class="iconfont-v3 saasclose" @click="cancelWx"></i></p>
        <div class="wximg-box">
          <img :src="`//aliqr.e.vhall.com/qr.png?t=${this.shareVo.url || this.url}`" alt="">
        </div>
        <p class="wximg-intro">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。</p>
      </div>
    </div>
    <!-- <VhallDialog
      title="分享"
      :visible.sync="wxDialogVisible"
      :close-on-click-modal="false"
      width="320px">
      <div class="wximg-box">
        <img :src="`//aliqr.e.vhall.com/qr.png?t=${this.shareVo.url || this.url}`" alt="">
      </div>
      <p class="wximg-intro">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。</p>
    </VhallDialog> -->
  </div>
</template>

<script>
import Env from "@/api/env";
export default {
  name: 'share',
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
  data(){
    return {
      env: Env,
      dialogVisible: false,
      wxDialogVisible: false
    };
  },
  methods: {
   toShare(type) {
      let url = '';
      if(type === 'wechat') {
        this.wxDialogVisible = true;
      }
      else if (type === 'sina') {
         url = `//service.weibo.com/share/share.php?url=${this.shareVo.url || this.url}`;
        window.open(url, '_blank');
      }
      else if (type === 'qq') {
        url = `//connect.qq.com/widget/shareqq/index.html?url=${this.shareVo.url || this.url}`;
        window.open(url, '_blank');
      }
    },
    cancelWx() {
      this.wxDialogVisible = false;
    },
    doCopy () {
      let url = this.shareVo.pcUrl || this.url;
      this.$copyText(url).then(e => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(error=>{
        this.$message({
          message: `复制失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
  @iconpath: '../../../common/images/icon';
  .content-share{
    .content-wrap{
      position: absolute;
      z-index: 2;
      width: 100%;
      bottom: 0;
      height: calc(100% - 50px);
      background: rgba(255, 255, 255, 0.5)
    }
    .independentForm {
      margin-top: 0px;
    }
    p{
      margin-top: 20px;
      overflow: hidden;
      line-height: 34px;
    }
    .content-key{
      color: #1a1a1a;
    }
    .sub{
      color: #999;
      font-size: 12px;
      margin-top: 0;
      text-indent: 70px;
    }
    /deep/ .el-input__inner{
      border-radius: 4px 0 0 4px;
      padding: 0 6px 0 12px;
    }
    /deep/ .el-input-group__append{
      background: #FB3A32;
      color: #ffffff;
      border-color: transparent;
      border-right: 0;
    }
  }
  .share-div {
     display: inline-block;
     vertical-align: top;
     width: 322px;
     margin-right: 32px;
     .input-with-select {
       background: #F7F7F7;
      //  position: relative;
     }
    //  /deep/.el-input-group__append{
    //    background: #E6E6E6;
    //    color: #666666;
    //   //  border: 1px solid #E6E6E6;
    //    &/deep/.el-button:hover{
    //      border: 1px solid transparent;
    //    }
    //  }
     .zdy-copy-btn {
       background: #E6E6E6;
       color: #666666;
     }
     .inputCode{
      height: 40px;
      width: 322px;
      border: 1px solid #ccc;
      border-radius: 2px;
      /deep/.el-input{
        width: 240px;
      }
       /deep/.el-input__inner {
        border: none;
        height: 38px;
        padding: 0 0 0 12px;
      }
      span{
        display: inline-block;
        width: 80px;
        height: 38px;
        text-align: center;
        line-height: 38px;
        background: #E6E6E6;
        color:#666666;
        vertical-align: top;
        cursor: pointer;
      }
     }
  }
  .icons{
    text-align: left;
    width: 322px;
    display: inline-block;
    margin-bottom: 38px;
    li {
      list-style-type: none;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      i{
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      &:last-child {
        margin-right: 0;
      }
      &:nth-child(1){
        i {
          background: url("@{iconpath}/qq.png") center center no-repeat;
          background-size: 100% 100%;
        }
      }
      &:nth-child(2){
        i {
          background: url("@{iconpath}/weibo.png") center center no-repeat;
          background-size: 100% 100%;
        }
        margin: 0 48px;
      }
      &:nth-child(3){
        i {
          background: url("@{iconpath}/wechat.png") center center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
      margin-top: 6px;
    }
  }
  .code-div {
    display: inline-block;
    vertical-align: top;
    text-align: center;
    width: 148px;
    // border: 1px solid #CCCCCC;
    padding-left:5px;
    .code-img{
      width: 148px;
      height: 148px;
      border: 1px solid #CCCCCC;
      padding: 8px;
      font-size: 0;
      border-radius: 4px;
    }
    img {
      width: 132px;
      height: 132px;
    }
    .img-code {
      margin-top: 8px;
      line-height: 20px;
    }
  }
  .wx-dialog{
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    .wximg-content{
      width: 320px;
      position: absolute;
      top: 40%;
      left: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      padding: 24px 32px;
      border-radius: 4px;
      .title{
        font-size: 20px;
        font-weight: 500;
        color: #1A1A1A;
        line-height: 28px;
        padding-bottom: 24px;
        i{
          float: right;
          cursor: pointer;
        }
      }
    }
  }
  .wximg-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 16px;
    img {
      width: 132px;
      height: 132px;
    }
  }
  .wximg-intro {
    padding-bottom: 24px;
    line-height: 20px;
  }
</style>
