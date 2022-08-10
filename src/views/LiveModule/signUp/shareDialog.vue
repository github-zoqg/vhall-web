<template>
  <div>
    <VhallDialog
      title="分享"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      customClass="share-dialog"
      width="572px">
      <div class="content">
        <div v-show="!shareSwtich" class="content-wrap"></div>
        <p class="independentForm">
          <span class="title">
            <span class="content-key">独立表单</span>
            <el-switch
              class="smallSwtich"
              :width='28'
              :height="16"
              v-model="shareSwtich"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              @change="switchExtraForm"
            >
            </el-switch>
            <el-tooltip
              placement="right"
              v-tooltipMove
              content="">
                <pre slot="content">开启独立报名功能后，可为报名表单生成独立的链接地
址。通过分享链接，用户填写报名表单后就能观看直播
和回放。注意：只有活动观看限制设置为“免费”时，
该功能才能生效！</pre>
              <i style="color: #999999;padding-left: 5px" class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
          </span>
        </p>
        <div class="icon-content">
          <div class="share-div">
            <ul class="icons">
              <li><i @click="shareQQ"></i><p>QQ</p></li>
              <li><i @click="shareSina"></i><p>微博</p></li>
              <li><i @click="shareWX"></i><p>微信</p></li>
            </ul>
            <div class="inputCode">
              <el-input v-model.trim="sinaLink" class="input-with-select" id="linkBox"></el-input>
              <span @click="copy">复制</span>
            </div>
            <p class="sub">「报名来源」需在地址最后边增加：?refer=值</p>
          </div>
          <div class="code-div">
            <div class="code-img"> <img :src="wxUrls + sinaLink" alt="二维码加载失败"></div>
            <p class="img-code">手机扫码观看</p>
          </div>
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="分享"
      :visible.sync="wxDialogVisible"
      :close-on-click-modal="false"
      width="320px">
      <div class="wximg-box">
        <img :src="wxUrl" alt="">
      </div>
      <p class="wximg-intro">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。</p>
    </VhallDialog>
  </div>
</template>

<script>
import Env from "@/api/env";
export default {
  created() {},
  props: {
    baseInfo: {
      type: Object,
    },
    // 活动ID 或者 专题ID，跟signUpPageType字段组合使用
    webinarOrSubjectId: {
      type: [Number, String],
      default: 0
    },
    // 报名表单类型：webinar--活动；subject--专题
    signUpPageType: {
      type: [Number, String],
      default: ''
    }
  },
  data(){
    return {
      dialogVisible: false,
      wxDialogVisible: false,
      shareSwtich: true,
      wxUrl: '',
      wxUrls: `${Env.staticLinkVo.aliQr}`,
      link: `${process.env.VUE_APP_WAP_WATCH}${this.signUpPageType === 'subject' ? '/special/entryform/' : '/lives/entryform/'}${this.webinarOrSubjectId}`,
      sinaLink: `${process.env.VUE_APP_WAP_WATCH}${this.signUpPageType === 'subject' ? '/special/entryform/' : '/lives/entryform/'}${this.webinarOrSubjectId}`
    };
  },
  watch:{
    baseInfo: {
      handler(newVal){
        this.shareSwtich = !!this.baseInfo.open_link;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    copy(){
      const input = document.getElementById('linkBox');
      input.select();
      document.execCommand('copy');
      let userId = this.$parent.userId
      if (this.signUpPageType === 'webinar') {
        this.$vhall_paas_port({
          k: 100187,
          data: {business_uid: userId, user_id: '', webinar_id: this.$parent.webinar_id, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.$message({
        message: `复制成功`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    // 独立表单开关事件
    switchExtraForm(value) {
      const val = value ? 1 : 0;
      let userId = this.$parent.userId
      if (this.signUpPageType === 'webinar') {
        this.$vhall_paas_port({
          k: value ? 100185 : 100186,
          data: {business_uid: userId, user_id: '', webinar_id: this.$parent.webinar_id, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.$emit('setBaseInfo', { open_link: val } );
    },
    shareQQ() {
      const url = `//connect.qq.com/widget/shareqq/index.html?url=${this.link}`;
      window.open(url, '_blank');
    },
    shareSina() {
      const url = `//service.weibo.com/share/share.php?url=${this.sinaLink}&summary=${this.baseInfo.intro}&title=${this.baseInfo.title}&pic=undefined&appkey=&searchPic=false`;
      window.open(url, '_blank');
    },
    shareWX() {
      this.wxDialogVisible = true;
      const url = `${Env.staticLinkVo.aliQr}${this.link}`;
      this.wxUrl = url;
    }
  }
};
</script>

<style lang="less" scoped>
  @iconpath: '../../../common/images/icon';
  /deep/ .share-dialog {
    height: 340px;
    border-radius: 4px;
    /deep/.el-button {
      background: transparent;
      &:hover {
        background: #FB3A32;
        border: 1px solid #FB3A32;
      }
      &:active {
        background: #E2332C;
        border: 1px solid #E2332C;
      }
      &.is-disabled {
        border: 1px solid #E6E6E6;
        background: transparent;
        color: #B3B3B3;
        &:hover,&:active {
          background: transparent;
        }
      }
    }
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
    // .el-input-group{
    //   width: 378px;
    //   float: right;
    //   .el-button {
    //     padding: 9px 25px;
    //   }
    // }
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
      // text-indent: 70px;
      text-align: left;
    }
    /deep/ .el-input__inner{
      // border-radius: 4px 0 0 4px;
      padding: 0 6px 0 12px;
    }
    // /deep/ .el-input-group__append{
    //   background: #FB3A32;
    //   color: #ffffff;
    //   border-color: transparent;
    //   border-right: 0;
    // }
    .icon-content{
      margin-top: 20px;
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
  // .icons{
  //   // text-align: center;
  //   i{
  //     display: inline-block;
  //     width: 40px;
  //     height: 40px;
  //     cursor: pointer;
  //     &:nth-child(1){
  //       background: url("@{iconpath}/qq.png") center center no-repeat;
  //       background-size: 100% 100%;
  //     }
  //     &:nth-child(2){
  //       background: url("@{iconpath}/weibo.png") center center no-repeat;
  //       background-size: 100% 100%;
  //       margin: 0 48px;
  //     }
  //     &:nth-child(3){
  //       background: url("@{iconpath}/wechat.png") center center no-repeat;
  //       background-size: 100% 100%;
  //     }

  //   }
  // }
  .wximg-box {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 210px;
      height: 210px;
    }
  }
  .wximg-intro {
    padding-bottom: 24px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
  }
</style>
