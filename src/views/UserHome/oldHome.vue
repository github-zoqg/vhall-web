<template>
 <div class="home-main">
   <OldHeader class="head-wrap"></OldHeader>
   <div class="v-head-bg"
        :style="{ background: `url(${userHomeVo && userHomeVo.img_url ? userHomeVo.img_url || '//t-alistatic01.e.vhall.com/static/images/vhall3.0/home_bg.png' :
        '//t-alistatic01.e.vhall.com/static/images/vhall3.0/home_bg.png'}) 0px center / 100% no-repeat`}">
     <div class="v-head-img"></div>
   </div>
   <div class="home-main-container">
     <pageTitle title="个人主页"></pageTitle>
     <div class="ac__home__panel">
       <!-- 左侧 [列表区域] -->
       <div class="ac__home__panel--left">
         <home-main @showSet="showSetHandle" v-if="!isSetShow" ref="homeMain"></home-main>
         <home-set  @showSet="showSetHandle" v-if="isSetShow"></home-set>
       </div>
       <!-- 右侧名片 -->
       <div class="ac__home__panel--right">
         <div class="ac__home--user">
           <img :src="userHomeVo && userHomeVo.homepage_avatar ? userHomeVo.homepage_avatar || avatarImgUrl : avatarImgUrl" alt="" />
           <p>{{userHomeVo && userHomeVo.title ? userHomeVo.title : '' }}</p>
          <!-- <p>{{userHomeVo && userHomeVo.show_fans > 0 ? '' : `粉丝数： ${attentioned_count}` }}</p>-->
         </div>
         <div class="ac__home--info">
           <p class="ac__home--title"></p>
           <p class="ac__home--notice">{{content}}</p>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import OldHeader from '@/components/OldHeader';
import HomeMain from './components/main.vue';
import HomeSet from './components/homeSet.vue';
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
export default {
  name: 'info.vue',
  components: {
    PageTitle,
    OldHeader,
    HomeMain,
    HomeSet
  },
  data() {
    return {
      isSetShow: false,
      userHomeVo: null,
      attentioned_count: 0,
      follow: 0,
      content: `小微提醒：<br/>主人，请不要害羞！填写个人主页简介，可以认识更多的小伙伴呢！`,
      avatarImgUrl: ``,
      userInfo: null
    };
  },
  methods: {
    showSetHandle(type) {
      this.isSetShow = type;
      this.getHomePageInfo();
    },
    getHomePageInfo() {
      this.$fetch('homeInfoGet', {
        home_user_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          // 粉丝数、是否关注、主页信息
          let {attentioned_count, follow, homepage_info } = res.data;
          // homepage_info.homepage_avatar = homepage_info.homepage_avatar || '';
          // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.homepage_avatar || '');
          // homepage_info.img_url = homepage_info.img_url || '';
            // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.img_url || '');
          this.$nextTick(() => {
            this.userHomeVo = homepage_info;
            this.attentioned_count = attentioned_count;
            this.follow = follow;
            this.content = homepage_info.content;
            try {
              this.$refs.homeMain.initComp(homepage_info);
            }catch (e) {
              console.log(e);
            }
          })
        } else {
          this.userHomeVo = null;
        }
      }).catch(err=>{
        console.log(err);
        this.userHomeVo = null;
      });
    }
  },
  created() {
    this.avatarImgUrl = `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
    this.getHomePageInfo();
  },
  mounted() {
    let userInfo  = sessionOrLocal.get('userInfo');
    if(userInfo !== null) {
      this.userInfo = JSON.parse(userInfo);
      if(this.userInfo) {
        this.avatarImgUrl = this.userInfo.avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
        // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, this.userInfo.avatar || '') || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
      } else {
        this.avatarImgUrl = `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.home-main {
  width: 100%;
  background: #f7f7f7;
  height: auto;
  overflow: hidden;
  padding-bottom: 40px;
}

::v-deep.head-wrap{
  .collapse{
    height: 100%;
    .login-reg{
      height: 100%;
      .head{
        margin-top: -8px;
        border: none;
        vertical-align: middle;
        display: inline-block;
      }
      .caret{
        margin-bottom: 4px;
      }
    }
  }
}

.v-head-bg {
  width: 100%;
  height: 205px;
  background: #000 no-repeat 0 center;
  background-size: 100%;
  border-bottom: 1px solid #e5e5e5;
}
.titleBox {
  margin-top: 40px;
}
.home-main-container {
  width: 1300px;
  margin: 0 auto;
}
.ac__home__panel {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.ac__home__panel--right {
  width: 248px;
  min-height: 437px;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 24px 24px;
}
.ac__home--user {
  text-align: center;
  img {
    display: block;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    border: 1px solid #E2E2E2;
    border-radius: 100%;
  }
  p {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-top: 10px;
  }
}
.ac__btn {
  text-align: center;
  margin-top: 24px;
  .el-button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.ac__home--info {
  border-top: 1px solid #E6E6E6;
  padding-top: 22px;
  margin-top: 24px;
  p {
    font-family: @fontRegular;
    font-weight: 400;
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
  }
  .ac__home--title {
    text-align: center;
    font-size: 16px;
    color: #1a1a1a;
    line-height: 17px;
  }
  .ac__home--notice {
    text-align: left;
    font-size: 12px;
    color: #999999;
    line-height: 17px;
    word-break: break-all;
  }
}
.ac__home__panel--left {
  width: calc(100% - 272px);
  min-height: 612px;
  height: auto;
  background: #FFFFFF;
  position: relative;
  .el-button {
    margin-top: 3px;
  }
}
</style>
