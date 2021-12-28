<template>
 <div class="home-main console">
   <OldHeader class="head-wrap" v-if="$route.meta.type !== 'owner'"  scene="userHome" :isWhiteBg=true :isShowLogin=false></OldHeader>
   <pageTitle pageTitle="个人主页" v-if="$route.meta.type === 'owner'"></pageTitle>
   <div class="v-home-bg" v-if="$route.meta.type !== 'owner'" :style="{ background: `url(${userHomeVo && userHomeVo.img_url ? userHomeVo.img_url || static_img_url :
        static_img_url }) 0px center / 100% no-repeat`}"></div>
   <div :class="$route.meta.type !== 'owner' ? userHomeVo && Number(userHomeVo.show_subject) === 0 && Number(userHomeVo.show_webinar_list) === 0 ? 'pc_bg no-creates' : 'pc_bg' : ''">
     <!-- 内容区域 -->
     <div :class="['user__layout--title', {'ctrl-layout': $route.meta.type === 'owner'}]">
       <ul>
         <li>
          <span class="image-contain"><img :src="userHomeVo && userHomeVo.homepage_avatar ? userHomeVo.homepage_avatar || avatarImgUrl : avatarImgUrl" alt="" class="user__avatar"/></span>
         </li>
         <li :class="`layout__center ${!(userHomeVo && Number(userHomeVo.show_share) === 1) ? 'one--btn' : ''}`">
           <h1>{{userHomeVo && userHomeVo.title ? userHomeVo.title : '' }}</h1>
           <div :class="open_hide ? 'open_hide user__remark' : 'user__remark'">{{userHomeVo.content}}</div>
           <span v-show="userHomeVo && userHomeVo.content" class="user__show__btn" @click="showBtnChange">{{open_hide ? '展开' : '收起'}}<i :class="open_hide ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span>
         </li>
         <li :class="!(userHomeVo && Number(userHomeVo.show_share) === 1) ? 'one--btn' : ''">
           <el-button size="medium" round v-if="setHomeCheck" @click.prevent.stop="toHomeSetPage">设置</el-button>
           <el-button size="medium" round @click="openDialog('share')" v-if="userHomeVo && Number(userHomeVo.show_share) === 1">分享</el-button>
         </li>
       </ul>
     </div>
     <!-- 功能区 -->
     <div class="user__layout--main">
       <home-main @showSet="showSetHandle" v-if="!isSetShow" ref="homeMain"></home-main>
     </div>

     <shareDialog
      :baseInfo="{
        title: this.userHomeVo.title,
        intro: this.userHomeVo.content,
        pic: this.userHomeVo.homepage_avatar || this.avatarImgUrl
      }"
      ref="share"
    ></shareDialog>
   </div>
 </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
import PageTitle from '@/components/PageTitle';
import HomeMain from './components/main.vue';
import ShareDialog from './components/shareDialog';
import OldHeader from '@/components/OldHeader';
import defaultbg from './images/defaultbg.png'
export default {
  name: 'info.vue',
  components: {
    PageTitle,
    HomeMain,
    OldHeader,
    ShareDialog
  },
  data() {
    return {
      lowerGradeInterval: null,
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
    setHomeCheck: function() {
      if (this.$route.params.str) {
        // 包含路径，表示观看页 or 主办方页  （2021-08-25 14点29分 中台去除登录状态 及 设置按钮）
        // return Number(this.$route.params.str) === Number(sessionOrLocal.get('userId'));
        return false;
      } else {
        // 不包含路径，表示控制台。
        return this.userHomeVo;
      }
    }
  },
  methods: {
    // 打开 dialog 方法（通用）
    openDialog(ref){
      this.$vhall_paas_port({
        k: 100799,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$refs[ref].dialogVisible = true;
    },
    showSetHandle(type) {
      this.isSetShow = type;
      this.getHomePageInfo();
    },
    showBtnChange() {
      if (this.open_hide) {
        this.$vhall_paas_port({
          k: 100804,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.open_hide = !this.open_hide;
    },
    getHomePageInfo() {
      this.$fetch('homeInfoGet', {
        home_user_id: this.$route.meta.type === 'owner' ? sessionOrLocal.get('userId') : this.$route.params.str
      }, {
        'gray-id': this.$route.meta.type === 'owner' ? sessionOrLocal.get('userId') : this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          // 粉丝数、是否关注、主页信息
          let {avatar, attentioned_count, follow, homepage_info } = res.data;
          if (homepage_info && homepage_info.img_url === '0') {
            homepage_info.img_url = ''
          }
          this.userHomeVo = homepage_info;
          if(this.$route.meta.type == 'new') {
            document.title = this.userHomeVo.title;
          }
          this.attentioned_count = attentioned_count;
          this.follow = follow;
          this.content = homepage_info.content;
          if (this.$route.meta.type !== 'owner') {
            this.avatarImgUrl = avatar || `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
          }
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
    handleLowerGradeHeart() {
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        // const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == this.$route.params.str) : null;
        console.log('777777777', res)
        if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions)
        }
      });
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      this.getHomePageInfo()
      // let permissions = data
      // this.brandOpen = Boolean(permissions['is_brand_cofig'] == 1)
      // this.type = this.brandOpen ? 1 : 2;
    },
    toHomeSetPage() {
      this.$router.push({
        path: `/homeSet/${sessionOrLocal.get('userId')}`
      })
    }
  },
  created() {
    this.static_img_url = `${defaultbg}`
    this.userId = sessionOrLocal.get('userId');
    this.avatarImgUrl = `${Env.staticLinkVo.tmplDownloadUrl}/img/head501.png`;
    this.getHomePageInfo();
  },
  beforeDestroy() {
    if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  },
  beforeMount() {

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
    this.handleLowerGradeHeart()
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
  &.no-creates {
     margin: -170px auto 0 auto;
     .user__layout--main {
       min-height: 500px;
     }
  }
}

.user__layout--title {
  width: 100%;
  padding: 35px 24px 0 24px;
  min-height: 135px;
  background: #FFFFFF;
  border-radius: 4px;
  &.ctrl-layout {
    padding: 35px 24px;
  }
  li {
    list-style-type: none;
    display: inline-block;
    vertical-align: top;
    &.layout__center {
      width: calc(100% - 322px);
      &.one--btn {
        width: calc(100% - 232px);
      }
    }
    &:last-child {
      width: 166px;
      &.one--btn {
        width: 76px;
      }
      text-align: right;
      margin-left: 40px;
      vertical-align: top;
      padding-top: 8px;
      /deep/button.el-button.el-button--medium{
        padding: 4px 23px;
      }
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
  .image-contain{
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid #E2E2E2;
    border-radius: 50%;
    margin-right: 16px;
    .user__avatar {
      width: 100%;
      height: 100%;
      object-fit:cover;
      // display: block;
      // width: 100px;
      // height: 100px;
      // border: 1px solid #E2E2E2;
      border-radius: 50%;
      // margin-right: 16px;
    }
  }
}
.user__layout--main {
  margin-top: 30px;
  width: 100%;
  min-height: 710px;
  margin-bottom: 16px;
  height: auto;
  background: #FFFFFF;
  position: relative;
  .el-button {
    margin-top: 3px;
  }
}
</style>
