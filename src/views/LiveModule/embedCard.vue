<template>
  <div class="embed-card">
    <pageTitle title="推广嵌入"></pageTitle>
    <el-card>
      <h3>微信嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>我的主页</span>
          <el-input v-model="myMain" ></el-input>
          <el-button @click="cope(myMain)">复制</el-button>
        </div>
        <div class="input-item">
          <span>观看直播</span>
          <el-input v-model="liveContent" ></el-input>
          <el-button @click="cope(liveContent)">复制</el-button>
        </div>
        <p>帮助：在微信公众号管理平台，自定义菜单添加链接，用户点击菜单可快速观看直播，详细信息参见<a @click="goForm('https://www.vhall.com/saas/doc/1692.html')"> 微信嵌入</a></p>
      </div>
    </el-card>
    <el-card class="network">
      <h3>网页嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>完全嵌入</span>
          <el-input v-model="completion" ></el-input>
          <el-button @click="cope(completion)">复制</el-button>
        </div>
        <div class="input-item">
          <span>视频嵌入</span>
          <el-input v-model="video" ></el-input>
          <el-button @click="cope(video)">复制</el-button>
        </div>
        <p>注意：当前只支持默认活动和密码活动的嵌入，更多嵌入信息参见<a @click="goForm('https://www.vhall.com/saas/doc/163.html')"> 网页嵌入指南</a></p>
      </div>
    </el-card>
    <el-card>
      <h3>第三方渠道推广嵌入</h3>
      <p class="third-text">目前微吼已支持在各大平台进行同步直播<a @click="goForm('https://t.e.vhall.com//webinar/marketing/index')"> 填写推广需求表</a></p>
      <div class="third-list"></div>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'embedCard',
  data() {
    return {
      myMain: 'https://t.e.vhall.com/user/home/16422704',
      liveContent: 'https://t-webinar.e.vhall.com/906078803',
      completion: '<iframe allow="camera *;microphone *;" allowfullscreen="true" border="0" src="https://t-webinar.e.vhall.com/webinar/inituser/906078803" width="800" height="600"></iframe>',
      video: '<iframe border="0" allowfullscreen="true" src="https://t-webinar.e.vhall.com/webinar/inituser/906078803?embed=video" width="800" height="600"></iframe>'
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
  h3{
    font-weight: normal;
    font-size: 14px;
    color: #383838;
  }
  p{
    padding: 10px 0 0 20px;
    line-height: 30px;
    font-size: 14px;
    color: #999;
    a{
      color: #337ab7;
      cursor: pointer;
    }
  }
  .input-item{
    display: flex;
    padding: 24px 50px 0 50px;
    span{
      display: inline-block;
      width: 100px;
      line-height: 35px;
      font-size: 14px;
      color: #666;
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
    padding-left: 50px;
    line-height: 20px;
  }
  .third-list{
    width:948px;
    height: 222px;
    border: 1px solid #ccc;
    margin: 20px 50px;
  }
}
</style>
