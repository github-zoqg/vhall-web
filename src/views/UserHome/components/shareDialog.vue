<template>
  <div>
    <VhallDialog
      title="分享"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      customClass="share-dialog"
      :lock-scroll='false'
      width="510px">
      <div class="content">
        <p>
          <span class="content-key">链接地址</span>
          <el-input placeholder="请输入内容" v-model="link" class="input-with-select" id="linkBox">
            <el-button slot="append" @click="copy">复制</el-button>
          </el-input>
        </p>
        <div class="content-left">
          <div class="icons">
            <i @click="shareQQ"></i>
            <i @click="shareSina"></i>
            <i @click="shareWX"></i>
          </div>
          <div class="code-div">
            <img :src="wxUrl + link" alt=""><br>
            <p class="img-code">手机扫码观看</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" round size="medium">确 定</el-button>
        <el-button @click="dialogVisible = false" round size="medium">取 消</el-button>
      </span>
    </VhallDialog>
    <VhallDialog
      title="分享"
      :visible.sync="wxDialogVisible"
      :close-on-click-modal="false"
      width="20%">
      <div class="wximg-box">
        <img :src="wxUrl + link" alt="">
      </div>
      <p class="wximg-intro">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。</p>
    </VhallDialog>
  </div>
</template>

<script>
import Env from "@/api/env";
import { session } from '../../../components/Player/js/utils';
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
      link: `${process.env.VUE_APP_WEB_URL}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}`,
      wxUrl: `${Env.staticLinkVo.aliQr}`
    };
  },
  methods: {
    copy(){
      const input = document.getElementById('linkBox');
      input.select();
      document.execCommand('copy');
      this.$message.success('复制成功');
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
    height: 372px;
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
    position: relative;
    .content-wrap{
      position: absolute;
      z-index: 2;
      width: 100%;
      bottom: 0;
      height: calc(100% - 50px);
      background: rgba(255, 255, 255, 0.5)
    }
    .el-input-group{
      width: 378px;
      float: right;
      .el-button[data-v-6ce78d46] {
        padding: 9px 25px;
      }
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
  .icons{
    text-align: center;
    width: 200px;
    display: inline-block;
    i{
      display: inline-block;
      width: 40px;
      height: 40px;
      cursor: pointer;
      &:nth-child(1){
        background: url("@{iconpath}/qq.png") center center no-repeat;
        background-size: 100% 100%;
      }
      &:nth-child(2){
        background: url("@{iconpath}/weibo.png") center center no-repeat;
        background-size: 100% 100%;
        margin: 0 16px;
      }
      &:nth-child(3){
        background: url("@{iconpath}/wechat.png") center center no-repeat;
        background-size: 100% 100%;
      }

    }
  }
  .code-div {
    width: calc(100% - 200px);
    display: inline-block;
    vertical-align: middle;
    padding-top: 24px;
    text-align: right;
    img {
      width: 100px;
      height: 100px;
    }
    .img-code {
      margin-top: 10px;
      line-height: 20px;
    }
  }
  .wximg-box {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
      height: 80%;
    }
  }
  .wximg-intro {
    padding-bottom: 24px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
  }
</style>
