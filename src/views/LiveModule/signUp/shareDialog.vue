<template>
  <div>
    <VhallDialog
      title="分享"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="570px">
      <div class="content">
        <div v-show="!shareSwtich" class="content-wrap"></div>
        <p>
          <span class="title">
            独立表单
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
              content="">
                <pre slot="content">开启独立报名功能后，可为报名表单
生成独立的链接地址。通过分享链接
，用户填写报名表单后就能观看直播
和回放。注意：只有活动观看限制设
置为“免费”时，该功能才能生效！
                </pre>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
        </p>
        <p class="">
          <span>链接地址</span>
          <el-input style="width: 433px" placeholder="请输入内容" v-model="link" class="input-with-select" id="linkBox">
            <el-button slot="append" @click="copy">复制</el-button>
          </el-input>

        </p>
        <p class="sub">地址支持增加refer参数</p>
        <p class="icons">
          <i @click="shareQQ"></i>
          <i @click="shareSina"></i>
          <i @click="shareWX"></i>
        </p>
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
    }
  },
  data(){
    return {
      dialogVisible: false,
      wxDialogVisible: false,
      shareSwtich: true,
      link: `${process.env.VUE_APP_WEB_URL}/entryform/${this.$route.params.str}`,
      wxUrl: ''
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
      this.$message.success('复制成功');
    },
    // 独立表单开关事件
    switchExtraForm(value) {
      const val = value ? 1 : 0;
      this.$emit('setBaseInfo', { open_link: val } );
    },
    shareQQ() {
      const url = `//connect.qq.com/widget/shareqq/index.html?title=${this.baseInfo.title}&url=${this.link}&summary=${this.baseInfo.intro}&pics=undefined`;
      window.open(url, '_blank');
    },
    shareSina() {
      const url = `//service.weibo.com/share/share.php?url=${this.link}&summary=${this.baseInfo.intro}&title=${this.baseInfo.title}&pic=undefined&appkey=&searchPic=false`;
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
  /deep/ .smallSwtich{
    margin-left: 20px;
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
      width: 330px;
      float: right;
    }
    p{
      margin-top: 16px;
      overflow: hidden;
      line-height: 34px;

    }
    .sub{
      color: #999;
      font-size: 12px;
      margin-top: 0;
      text-indent: 86px;
    }
    /deep/ .el-input__inner{
      border-radius: 4px 0 0 4px;
    }
    /deep/ .el-input-group__append{
      background: #FB3A32;
      color: #ffffff;
      border-color: transparent;
    }
  }
  .icons{
    text-align: center;
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
        margin: 0 48px;
      }
      &:nth-child(3){
        background: url("@{iconpath}/wechat.png") center center no-repeat;
        background-size: 100% 100%;
      }

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
