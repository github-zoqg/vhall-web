<template>
  <div class="embed-card">
    <pageTitle title="推广嵌入"></pageTitle>
    <div class="weixinWork">
      <h3>微信嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>我的主页</span>
          <el-input v-model="myMain" readonly><i slot="suffix" class="el-input__icon el-icon-document-copy" @click="cope(myMain)"></i></el-input>
        </div>
        <div class="input-item">
          <span>观看直播</span>
          <el-input v-model="liveContent" readonly><i slot="suffix" class="el-input__icon el-icon-document-copy" @click="cope(liveContent)"></i></el-input>
        </div>
        <p>帮助：在微信公众号管理平台，自定义菜单添加链接，用户点击菜单可快速观看直播，详细信息参见<a @click="goForm('https://www.vhall.com/saas/doc/1692.html')"> 微信嵌入</a></p>
      </div>
    </div>
    <div class="network">
      <h3>网页嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>完全嵌入</span>
          <el-input v-model="completion" readonly><i slot="suffix" class="el-input__icon el-icon-document-copy" @click="cope(completion)"></i></el-input>
          <!-- <el-button @click="cope(completion)">复制</el-button> -->
        </div>
        <div class="input-item">
          <span>视频嵌入</span>
          <el-input v-model="video" readonly><i slot="suffix" class="el-input__icon el-icon-document-copy" @click="cope(video)"></i></el-input>
        </div>
        <p>注意：当前只支持默认活动和密码活动的嵌入，更多嵌入信息参见<a @click="goForm('https://www.vhall.com/saas/doc/163.html')"> 网页嵌入指南</a></p>
      </div>
    </div>
    <div class="thirdMethod">
      <h3>第三方渠道推广嵌入</h3>
      <div class="third-list"></div>
      <p class="third-text">提示:目前微吼已支持在各大平台进行同步直播<a @click="goForm('https://t.e.vhall.com/webinar/marketing/index')"> 填写推广需求表</a></p>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'embedCard',
  data() {
    return {
      myMain: `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${sessionOrLocal.get('userId')}`,
      liveContent: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      completion: `<iframe allow="camera *;microphone *;" allowfullscreen="true" border="0" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}" width="800" height="600"></iframe>`,
      video: `<iframe border="0" allowfullscreen="true" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}?embed=video" width="800" height="600"></iframe>`
    };
  },
  components: {
    PageTitle
  },
  methods: {
    goForm(url) {
      window.open(url, "_blank");
    },
    cope(url) {
      console.log(url);
      this.$copyText(url).then(e => {
        this.$message.success('复制成功！');
      }).catch(error=>{
        this.$message.error('复制失败！');
      });
    }
  }
};
</script>

<style lang="less" scoped>
.embed-card{
  .weixinWork, .network, .thirdMethod{
    background: #fff;
    padding: 24px 20px;
    border-radius: 4px;
  }
  h3{
    font-weight: normal;
    font-size: 14px;
    color: #383838;
  }
  p{
    padding: 10px 0 0 124px;
    line-height: 30px;
    font-size: 14px;
    color: #999;
    a{
      color: #3562FA;
      cursor: pointer;
    }
  }
  .input-item{
    display: flex;
    padding: 24px 50px 0 60px;
    span{
      display: inline-block;
      width: 74px;
      line-height: 35px;
      font-size: 14px;
      color: #666;
    }
    i{
      cursor: pointer;
      &:hover{
        color: #3562FA;
      }
    }
    .el-button{
      display: inline-block;
      margin-left: 20px;
      padding: 10px 20px;
    }
  }
  .network{
    margin: 30px 0;
  }
  .third-text{
    padding-left: 35px;
    line-height: 20px;
  }
  .third-list{
    width:724px;
    height: 131px;
    border: 1px dashed #ccc;
    margin: 20px 36px 5px 36px;
    background: url(../../common/images/third-promote.png) no-repeat;
    background-position: 0 0;
    background-size:100% 100%;
  }
}
</style>
