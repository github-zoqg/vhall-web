<template>
 <div class="home-main">
   <OldHeader></OldHeader>
   <div class="v-head-bg" style="background: url(//t-alistatic01.e.vhall.com/static/images/vhall3.0/home_bg.png) repeat-x rgb(49, 49, 49);">
     <div class="v-head-img"></div>
   </div>
   <div class="home-main-container">
     <pageTitle title="个人主页"></pageTitle>
     <div class="ac__home__panel">
       <!-- 左侧 [列表区域] -->
       <div class="ac__home__panel--left">
         <home-main @showSet="showSetHandle" v-if="!isSetShow"></home-main>
         <home-set  @showSet="showSetHandle" v-if="isSetShow"></home-set>
       </div>
       <!-- 右侧名片 -->
       <div class="ac__home__panel--right">
         <div class="ac__home--user">
           <img src="../../common/images/avatar.jpg" alt="" />
           <p>XXXX的主页</p>
           <p>粉丝数： 100010</p>
         </div>
         <div class="ac__home--info">
           <p class="ac__home--title"></p>
           <p class="ac__home--notice">小微提醒：<br/>主人，请不要害羞！填写个人主页简介，可以认识更多的小伙伴呢！</p>
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
      isSetShow: false
    };
  },
  methods: {
    showSetHandle(type) {
      this.isSetShow = type;
    }
  },
};
</script>

<style lang="less" scoped>
.home-main {
  width: 100%;
  background: #f7f7f7;
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
    font-family: PingFangSC-Regular, PingFang SC;
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
