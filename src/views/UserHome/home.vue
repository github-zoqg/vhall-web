<template>
 <div class="home-main console">
   <OldHeader class="head-wrap" v-if="$route.meta.type !== 'owner'"></OldHeader>
   <pageTitle title="个人主页" v-if="$route.meta.type === 'owner'"></pageTitle>
   <div class="v-home-bg" v-if="$route.meta.type !== 'owner'" :style="{ background: `url(${userHomeVo && userHomeVo.img_url ? userHomeVo.img_url || '//t-alistatic01.e.vhall.com/static/images/vhall3.0/home_bg.png' :
        '//t-alistatic01.e.vhall.com/static/images/vhall3.0/home_bg.png'}) 0px center / 100% no-repeat`}"></div>
   <div :class="$route.meta.type !== 'owner' ? 'pc_bg' : ''">
     <!-- 内容区域 -->
     <div class="user__layout--title">
       <ul>
         <li>
           <img :src="userHomeVo && userHomeVo.homepage_avatar ? userHomeVo.homepage_avatar || avatarImgUrl : avatarImgUrl" alt="" class="user__avatar"/>
         </li>
         <li :class="`layout__center ${!(userHomeVo && userHomeVo.show_share) ? 'one--btn' : ''}`">
           <h1>{{userHomeVo && userHomeVo.title ? userHomeVo.title : '' }}</h1>
           <div :class="open_hide ? 'open_hide user__remark' : 'user__remark'">{{userHomeVo.content}}</div>
           <span class="user__show__btn" @click="showBtnChange">{{open_hide ? '展开' : '收缩'}}<i :class="open_hide ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
         </li>
         <li :class="!(userHomeVo && userHomeVo.show_share) ? 'one--btn' : ''">
           <el-button size="medium" round v-if="userHomeVo" @click.prevent.stop="toHomeSetPage">设置</el-button>
           <el-popover
             class="button__share"
             placement="bottom-end"
             trigger="click"
             v-if="userHomeVo && userHomeVo.show_share"
           >
             <div>
               <share slot="content" :shareVo="{
               url: home_link,
               sina_share_link: sina_share_link,
               qq_share_link: qq_share_link,
               wechat_share_link: wechat_share_link
             }"></share>
             </div>
             <el-button size="medium" round slot="reference">分享</el-button>
           </el-popover>
         </li>
       </ul>
     </div>
     <!-- 功能区 -->
     <div class="user__layout--main">
       <home-main @showSet="showSetHandle" v-if="!isSetShow" ref="homeMain"></home-main>
     </div>
   </div>
 </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
import PageTitle from '@/components/PageTitle';
import HomeMain from './components/main.vue';
import Share from '@/components/Share';
import OldHeader from '@/components/OldHeader';
export default {
  name: 'info.vue',
  components: {
    PageTitle,
    HomeMain,
    OldHeader,
    Share
  },
  data() {
    return {
      isSetShow: false,
      userHomeVo: {},
      attentioned_count: 0,
      follow: 0,
      avatarImgUrl: ``,
      userInfo: null,
      open_hide: true,
    };
  },
  computed: {
    show_content: function() {
      if (this.userHomeVo && this.userHomeVo.content && this.userHomeVo.content.length > 80) {
        return this.userHomeVo.content.substring(0, 80) + '...';
      } else {
        return this.userHomeVo.content || `小微提醒：<br/>主人，请不要害羞！填写个人主页简介，可以认识更多的小伙伴呢！`;
      }
    },
    home_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}`;
    },
    sina_share_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}&title=${this.userHomeVo.title}&pic=${this.avatarImgUrl}&appkey=&searchPic=false`;
    },
    wechat_share_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}&title=${this.userHomeVo.title}&pic=${this.avatarImgUrl}&appkey=&searchPic=false`;
    },
    qq_share_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${this.$route.params.str || sessionOrLocal.get('userId')}&title=${this.userHomeVo.title}&pic=${this.avatarImgUrl}&appkey=&searchPic=false`;
    }
  },
  methods: {
    showSetHandle(type) {
      this.isSetShow = type;
      this.getHomePageInfo();
    },
    showBtnChange() {
      this.open_hide = !this.open_hide;
    },
    getHomePageInfo() {
      this.$fetch('homeInfoGet', {
        home_user_id: this.$route.meta.type === 'owner' ? sessionOrLocal.get('userId') : this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          // 粉丝数、是否关注、主页信息
          let { attentioned_count, follow, homepage_info } = res.data;
          this.userHomeVo = homepage_info;
          this.attentioned_count = attentioned_count;
          this.follow = follow;
          this.content = homepage_info.content;
          try {
            this.$refs.homeMain.initComp(homepage_info);
          }catch (e) {
            console.log(e);
          }
        } else {
          this.userHomeVo = null;
        }
      }).catch(err=>{
        console.log(err);
        this.userHomeVo = null;
      });
    },
    toHomeSetPage() {
      this.$router.push({
        path: `/homeSet/${sessionOrLocal.get('userId')}`
      })
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
        margin-right: 8px;
      }
      .caret{
        margin-bottom: 4px;
      }
    }
  }
}
.v-home-bg {
  width: 100%;
  min-height: 448px;
  background-image: url('../../common/images/sys/v3_home_phone_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.pc_bg {
  width: 1100px;
  margin: -220px auto 0 auto;
  background: #ffffff;
  border-radius: 4px;
}

.user__layout--title {
  width: 100%;
  padding: 35px 24px;
  min-height: 170px;
  background: #FFFFFF;
  border-radius: 4px;
  li {
    list-style-type: none;
    display: inline-block;
    vertical-align: top;
    &.layout__center {
      width: calc(100% - 328px);
      &.one--btn {
        width: calc(100% - 240px);
      }
    }
    &:last-child {
      width: 164px;
      &.one--btn {
        width: 76px;
      }
      text-align: right;
      margin-left: 48px;
      vertical-align: top;
      padding-top: 8px;
    }
    .button__share {
      margin-left: 12px;
    }
  }
  h1 {
    padding: 10px 0 0 0;
    font-size: 20px;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 28px;
    word-break: break-all;
  }
  .user__remark {
    padding: 8px 0 0 0;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
    position: relative;
    word-break: break-all;
    &.open_hide {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .user__show__btn {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #3562FA;
    line-height: 20px;
    cursor: pointer;
   /* position: absolute;
    right: 0;
    bottom: 0;*/
  }
}
.user__avatar {
  display: block;
  width: 100px;
  height: 100px;
  border: 1px solid #E2E2E2;
  border-radius: 100%;
  margin-right: 16px;
}
.user__layout--main {
  margin-top: 24px;
  width: 100%;
  min-height: 710px;
  height: auto;
  background: #FFFFFF;
  position: relative;
  .el-button {
    margin-top: 3px;
  }
}
</style>
