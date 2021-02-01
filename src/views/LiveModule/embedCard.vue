<template>
  <div class="embed-card">
    <pageTitle pageTitle="推广嵌入"></pageTitle>
    <div class="weixinWork">
      <h3>微信嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>我的主页</span>
          <el-input v-model="myMain" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(myMain)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div class="input-item">
          <span>观看直播</span>
          <!-- <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <i class="el-input__icon el-icon-document-copy" @click="cope(liveContent)"></i>
          </el-tooltip> -->
          <el-input v-model="liveContent" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(liveContent)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <p>提示：在微信公众号管理平台，自定义菜单添加链接，用户点击菜单可快速观看直播，详细信息参见<a @click="goForm('https://www.vhall.com/saas/doc/1692.html')"> 微信嵌入</a></p>
      </div>
    </div>
    <div class="network">
      <h3>网页嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>完全嵌入</span>
          <el-input v-model="completion" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(completion)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div class="input-item" v-if="isInteract != 3">
          <span>视频嵌入</span>
          <el-input v-model="video" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(video)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <p>提示：当前只支持默认活动和密码活动的嵌入，更多嵌入信息参见<a @click="goForm('https://www.vhall.com/saas/doc/163.html')"> 网页嵌入指南</a></p>
      </div>
    </div>
    <div class="thirdMethod">
      <h3>第三方渠道推广嵌入</h3>
      <div class="third-list"></div>
      <p class="third-text">提示：目前微吼已支持在各大平台进行同步直播<a @click="goEmbedForm"> 填写推广需求表</a></p>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import {sessionOrLocal} from "@/utils/utils";
import beginPlay from '@/components/beginBtn';
import Env from "@/api/env";
export default {
  name: 'embedCard',
  data() {
    return {
      env: Env,
      isInteract: '',
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      myMain: `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${sessionOrLocal.get('userId')}`,
      liveContent: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      completion: `<iframe allow="camera *;microphone *;" allowfullscreen="true" border="0" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}" width="800" height="600"></iframe>`,
      video: `<iframe border="0" allowfullscreen="true" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}?embed=video" width="800" height="600"></iframe>`
    };
  },
  components: {
    PageTitle,
    beginPlay
  },
  created() {
    this.isInteract = this.$route.query.type;
  },
  methods: {
    goForm(url) {
      window.open(url, "_blank");
    },
    goEmbedForm() {
      // https://t.e.vhall.com/auth/check-token?after_login=webinar/marketing/index&token=aca55f6b78b2e246a1a38ff143531099
      let url = `${process.env.VUE_APP_E_COMPANY_URL}/auth/check-token?after_login=webinar/marketing/index&token=${sessionOrLocal.get('SAAS_V3_SSO_TOKEN', 'localStorage')}`;
      window.open(url, "_blank");
    },
    cope(url) {
      console.log(url);
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
          message: "复制失败",
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
.embed-card{
  /deep/.el-input__inner {
    padding-left: 12px;
  }
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
    padding: 10px 0 0 100px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
    a{
      color: #3562FA;
      cursor: pointer;
    }
  }
  .input-item{
    display: flex;
    padding: 24px 50px 0 30px;
    span{
      display: inline-block;
      width: 70px;
      line-height: 35px;
      font-size: 14px;
      color: #1a1a1a;
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
    .iconfont-v3{
      padding: 3px;
      // padding-right: 12px;
      line-height: 38px;
      color: #666;
      &:hover{
        color: #1a1a1a;
      }
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
    // border: 1px dashed #ccc;
    margin: 20px 36px 5px 30px;
    background: url(../../common/images/third-promote.png) no-repeat;
    background-position: 0 0;
    background-size:100% 100%;
  }
}
</style>
