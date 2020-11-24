<template>
  <div class="chooseWay">
    <pageTitle title="选择发起方式"></pageTitle>
    <div class="choose__way__main">
      <div class="select-way">
        <div :class="chooseType === 'browser' ? 'choose-a-way active' : 'choose-a-way'" @click.prevent.stop="changeChoose('browser')">
          <p class="choose-p"></p>
          <p class="f-20">网页发起直播</p>
          <p>一键发起直播</p>
          <p>无需安装任何直播插件</p>
        </div>
        <!-- <div class="interact_select choose-a-way">
          <p class="choose-p"></p>
          <p class="f-20">网页发起互动直播</p>
          <p>可进行多人连麦</p>
          <p>需要使用chrome浏览器</p>
        </div> -->
        <div :class="chooseType === 'client' ? 'choose-a-way client active' : 'choose-a-way client'" @click.prevent.stop="changeChoose('client')">
          <p class="choose-p"></p>
          <p class="f-20"><label class="beta-label" style="font-weight: 400">客户端发起</label></p>
          <p>功能更为强大，支持多种视频采集卡</p>
          <p>拥有共享桌面、插入视频等功能</p>
        </div>
        <!-- <div class="choose-a-way other vip">
          <p class="choose-p"></p>
          <p class="f-20"><label style="font-weight: 400">第三方推流方式/工具发起</label></p>
          <p>通过第三方软件实现多样化的推流方式</p>
          <p>拥有更强的扩展性</p>
        </div> -->
      </div>
      <div class="choose-btn">
        <el-button type="primary" round @click="goLive">发起直播</el-button>
        <iframe :src="scheme" class="hide" frameborder="0" scrolling="no" id="start_live">发起直播</iframe>
      </div>
      <div class="v-download" v-if="chooseType === 'client'">
        客户端启动遇到问题？您可以尝试：<a target="_blank" href="//t-alistatic01.e.vhall.com/upload/assistant/file_url/ac/12/VhallTool.exe" >下载客户端</a> 联系客服400-888-9970
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'chooseWay.vue',
  components: {
    PageTitle,
  },
  data() {
    return {
      chooseType: 'browser',
      scheme: ''
    };
  },
  created(){
    console.log(this.$route);
  },
  methods: {
    changeChoose(type) {
      this.chooseType = type;
      this.scheme = '';
    },
    goLive(){
      if(this.chooseType =='client'){
        this.scheme = 'vhalllive:\/\/vhalllive?stream_name=936719661&stream_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdHJlYW1uYW1lIjoiOTM2NzE5NjYxIn0.DC3w81q1Cxez0gC3P19LxelRhB4pk5uHMv-1jI1GPiI&msg_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3MzQyNzQiLCJuYW1lIjoidHR0dHR0dCIsInJvb20iOiI5MzY3MTk2NjEiLCJyb2xlIjoiaG9zdCIsInVpZCI6IjE2NDIyNjgwIiwidHJhY2tJZCI6IjIyNDU5NTUiLCJkZXZpY2Vfc3RhdHVzIjoxfQ.KQx_qyRZzYMHj7Te9ulB1F0eIhYUPsjID42U_Q0PQGw&hide_logo=0';
        setTimeout(()=>{
          this.scheme = '';
        }, 300);
      }else{
        this.$router.push({path: `/live/room/${this.$route.params.str}`});
      }
    }
  },
  create() {
    // 动态获取 下载客户端地址 + 启动PC客户端应用程序地址命令
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.choose__way__main {
}
.select-way {
  text-align: center;
}
.choose-a-way {
  display: inline-block;
  margin: 0 34px;
  p {
    margin-bottom: 10px;
    text-align: center;
    color: #999;
    &.f-20 {
      margin-top: 20px;
      color: #333;
      margin-bottom: 20px;
    }
  }
  .choose-p {
    width: 260px;
    height: 177px;
    border-radius: 2px;
    background: #fff url(../../common/images/choose-a-way/webpublish_active.png) no-repeat center center;
    background-size: 200px;
    position: relative;
  }
  &.active {
    .choose-p {
      border: 2px solid @theme--click;
      background-position: center;
      &:before {
        content: '';
        display: inline-block;
        width: 26px;
        height: 25px;
        position: absolute;
        bottom: -1px;
        right: -2px;
        background-image: url(../../common/images/choose-a-way/default_active2.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
}
.choose-btn {
  text-align: center;
  margin-top: 32px;
  iframe {
    display: none !important;
  }
}
.v-download {
  margin: 30px auto;
  text-align: center;
  display: block;
  a {
    color: @default--normal;
    &:hover {
      color: @default--hover;
    }
  }
}
</style>
