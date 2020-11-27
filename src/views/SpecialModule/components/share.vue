<template>
  <div>
    <VhallDialog
    title="分享"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="25%">
    <div class="content">
      <div class="code">
        <img :src="qrcode" alt="">
        <p>扫码观看</p>
      </div>
      <p class="shareText">
        <span>分享链接：</span>
        <el-input placeholder="请输入内容" v-model="link" class="input-with-select" id="linkBox" style="width:200px">
        </el-input>
        <label  @click="copy">复制</label>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" round>确 定</el-button>
      <el-button @click="dialogVisible = false" round>取 消</el-button>
    </span>
  </VhallDialog>
  <VhallDialog
    title="专题分享"
    :visible.sync="specialVisible"
    :close-on-click-modal="false"
    width="25%">
    <div class="content">
      <div class="special-code">
        <p class="icons">
          <i></i>
          <i></i>
          <i></i>
        </p>
        <p class="img-code"><img :src="qrcode" alt=""><br><span>手机扫码观看</span></p>
      </div>
      <p class="shareText">
        <span>分享链接：</span>
        <el-input placeholder="请输入内容" v-model="link" class="input-with-select" id="linkBox" style="width:200px">
        </el-input>
        <label  @click="copy">复制</label>
      </p>
    </div>
  </VhallDialog>
  </div>
</template>

<script>
import QRcode from 'qrcode';
export default {
  data(){
    return {
      qrcode: '',
      dialogVisible: false,
      specialVisible: false,
      link: 'https://t.e.vhall.com/'
    };
  },
  props: {
    url:{
      type: String,
      required: true
    }
  },
   created(){
    QRcode.toDataURL(
      this.link,
      (err, url) => {
        console.log(err, url);
        this.qrcode = url;
      }
    );
  },
  methods: {
    copy(){
      const input = document.getElementById('linkBox');
      input.select();
      document.execCommand('copy');
      this.$message.success('复制成功');
    }
  }
};
</script>

<style lang="less" scoped>
  @iconpath: '../../../common/images/icon';
  .content{
    .el-input-group{
      width: 330px;
      float: right;
    }
    .code{
      text-align: center;
      // margin-top: 50px;
      img{
        width: 132px;
        height: 132px;
      }
      p{
        line-height: 22px;
        color: #1a1a1a;
      }
    }
    .special-code{
      display: flex;
      align-items: center;
      justify-content: space-around;
      img{
        width: 90px;
        height: 90px;
      }
      span{
        // display: inline-block;
        // text-align: center;
        padding-left: 5px;
      }
    }
    .shareText{
      // margin-top: 16px;
      // overflow: hidden;
      padding: 20px 0 20px 25px;
      line-height: 34px;
      label{
        display: inline-block;
        height: 36px;
        width: 70px;
        line-height: 34px;
        text-align: center;
        margin-left: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        &:hover{
          background: #ffebeb;
        }
      }
    }
    .sub{
      color: #999;
      font-size: 12px;
      margin-top: 0;
      text-indent: 86px;
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
    /deep/ .el-input__inner{
      border-radius: 4px 0 0 4px;
      margin-right: 10px;
    }
    // /deep/ .el-input-group__append{
    //   background: #FB3A32;
    //   color: #ffffff;
    //   border-color: transparent;
    // }
  }
</style>
