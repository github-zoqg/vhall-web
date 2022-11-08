<template>
  <div>
    <VhallDialog
      title="分享"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      customClass="share-dialog"
      width="572px">
      <div class="content">
        <div class="share-div">
          <ul class="icons">
            <li><i @click="shareQQ"></i><p>QQ</p></li>
            <li><i @click="shareSina"></i><p>微博</p></li>
            <li><i @click="shareWX"></i><p>微信</p></li>
          </ul>
          <div class="inputCode">
            <el-input  v-model="pcLink" class="input-with-select" id="linkBox"></el-input>
            <span @click="copy">复制</span>
          </div>
        </div>
        <div class="code-div">
          <div class="code-img"> <img :src="wxUrl + link" alt="二维码加载失败"></div>
          <p class="img-code">手机扫码观看</p>
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="分享"
      :visible.sync="wxDialogVisible"
      :close-on-click-modal="false"
      width="320px">
      <div class="wximg-box">
        <img :src="wxUrl + link" alt="">
      </div>
      <p class="wximg-intro">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。</p>
    </VhallDialog>
  </div>
</template>

<script>
import Env from "@/api/env";
import { sessionOrLocal } from '../../../utils/utils';
export default {
  created() {},
  props: {
    baseInfo: {
      type: Object,
    }
  },
  data(){
    return {
      dialogVisible: false,
      wxDialogVisible: false,
      pcLink: `${process.env.VUE_APP_WAP_WATCH}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}`,
      link: `${process.env.VUE_APP_WAP_WATCH}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}`,
      wxUrl: `${Env.staticLinkVo.aliQr}`
    };
  },
  methods: {
    copy(){
      const input = document.getElementById('linkBox');
      input.select();
      this.$vhall_paas_port({
        k: 100800,
        data: {business_uid: this.$parent.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      document.execCommand('copy');
      this.$message({
        message:  `复制成功`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    shareQQ() {
       /* https://connect.qq.com/widget/shareqq/index.html?title=我在微吼直播，这是我的主页 这是我的标题标题标题这是我的标题标题标题这是我的标题标题标题，欢迎围观。&url=https://e.vhall.com/user/home/58205605&summary=
一百50个字内的简介信息，嘿嘿额嘿嘿额呵呵&pics=https://cnstatic01.e.vhall.com/upload/webinars/img_url/ac/dc/acdc02b16e0b47ba259a2c2044002a5d.jpg" */
      const url = `//connect.qq.com/widget/shareqq/index.html?title=${this.baseInfo.title}&url=${this.link}&summary=${this.baseInfo.intro}&pics=${this.baseInfo.pic}`;
      window.open(url, '_blank');
    },
    shareSina() {
      // https://service.weibo.com/share/share.php?url=https://t.e.vhall.com/user/home/16421384&title=我在微吼直播，这是我的主页 主页标题，欢迎围观。主页简介&pic=主页头像地址&appkey=&searchPic=false
      const url = `//service.weibo.com/share/share.php?url=${this.link}&title=${this.baseInfo.title}。${this.baseInfo.intro}&pic=${this.baseInfo.pic}&appkey=&searchPic=false`;
      window.open(url, '_blank');
    },
    shareWX() {
      this.wxDialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
  @iconpath: '../../../common/images/icon';
  /deep/ .share-dialog {
    max-height: 314px;
    height: auto;
    padding-bottom: 32px;
    border-radius: 4px;
  }
  /deep/ .smallSwtich{
    margin-left: 12px;
    vertical-align: text-bottom;
    .el-switch__core{
      height: 16px;
      &::after{
        width: 12px;
        height: 12px;
      }
    }
    &.is-checked{
      .el-switch__core{
        &::after{
          margin-left: -13px;
        }
      }
    }
  }
  .content{
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
    margin-bottom: 40px;
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
      margin-top: 10px;
      line-height: 20px;
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
