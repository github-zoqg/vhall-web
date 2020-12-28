<template>
 <div class="home-main console">
   <pageTitle title="个人主页"></pageTitle>
   <!-- 内容区域 -->
   <div class="user__layout--title">
     <ul>
       <li>
         <img src="../../common/images/avatar.png" alt="" class="user__avatar" />
       </li>
       <li class="layout__center">
         <h1>微吼直播工作间的标题微吼直播</h1>
         <div class="user__remark">
           上微吼，看全球大会直播商务直播：不再错过行业峰会、创业大赛和圈子沙龙等高端直播直播交流：话题讨论，圈子交流，相互关注，拓展您的人脉发起直播：随时随地，通过视频直播与好友。 <span>展开 <i class="iconfont-v3 saasicon_arrowdown1"></i></span></div>
       </li>
       <li>
         <el-button size="mini" round>设置</el-button>
         <el-button size="mini" round>分享</el-button>
       </li>
     </ul>
   </div>
 </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
import PageTitle from '@/components/PageTitle';
export default {
  name: 'info.vue',
  components: {
    PageTitle
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
.user__layout--title {
  width: 100%;
  padding: 35px 24px;
  min-height: 170px;
  background: #FFFFFF;
  border-radius: 4px;
  li {
    list-style-type: none;
    display: inline-block;
    vertical-align: middle;
    &.layout__center {
      width: calc(100% - 328px);
    }
    &:last-child {
      width: 164px;
      margin-left: 48px;
      vertical-align: top;
      padding-top: 8px;
    }
  }
  h1 {
    padding: 10px 0 0 0;
    font-size: 20px;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 28px;
  }
  .user__remark {
    padding: 8px 0 0 0;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
    span {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3562FA;
      line-height: 20px;
    }
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
</style>
