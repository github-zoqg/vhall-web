<template>
  <VhallDialog
    title="分享"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%">
    <div class="content">
      <p>
        <span class="title">
          开启独立表单
          <el-tooltip
            content="">
              <pre slot="content">开启独立报名功能后，可为报名表单
生成独立的链接地址。通过分享链接
，用户填写报名表单后就能观看直播
和回放。注意：只有活动观看限制设
置为“免费”时，该功能才能生效！</pre>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-switch
              class="smallSwtich"
              :width='28'
              :height="16"
              v-model="shareSwtich"
              active-color="#FB3A32"
              inactive-color="#CECECE">
            </el-switch>
        </span>
      </p>
      <p class="">
        <span>链接地址：</span>
        <el-input placeholder="请输入内容" v-model="link" class="input-with-select" id="linkBox">
          <el-button slot="append" @click="copy">复制</el-button>
        </el-input>

      </p>
      <p class="sub">地址支持增加refer参数</p>
      <p class="icons">
        <i></i>
        <i></i>
        <i></i>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" round size="medium">确 定</el-button>
      <el-button @click="dialogVisible = false" round size="medium">取 消</el-button>
    </span>
  </VhallDialog>
</template>

<script>
export default {
  data(){
    return {
      dialogVisible: false,
      shareSwtich: true,
      link: 'https://t.e.vhall.com/'
    };
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
</style>
