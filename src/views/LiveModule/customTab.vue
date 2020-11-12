<template>
  <div>
    <div class="title--cus-tab">
      <page-title title="自定义菜单">
        <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      </page-title>
      <div>
        <el-button type="primary" round>预览</el-button>
        <el-link type="info" :underline=false href="http://www.vhall.com/saas/doc/1457.html" target="_blank" class="link__left">使用帮助</el-link>
      </div>
    </div>
    <!-- 菜单布局区域 -->
    <div class="panel__cus">
      <ul class="panel__left">
        <template>
          <li class="comp__group__title"><label>基本组件</label></li>
          <li class="comp__item" v-for="item in compList.filter(cItem => cItem.type === '1')" :key="`comp1Item${item.component_id}`">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
        </template>
        <template>
          <li class="comp__group__title"><label>功能组件</label></li>
          <li class="comp__item" v-for="item in compList.filter(cItem => cItem.type === '2')" :key="`comp2Item${item.component_id}`">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
          <li class="comp__item comp__item--disabled"><span class="el-icon-s-home"></span><span>尽请期待</span></li>
        </template>
      </ul>
      <div class="panel__right">
        <!-- 选项卡 -->
        <ul class="el__tabs__box">
          <li :class="tabType === 'app' ? 'active': ''" @click.prevent.stop="setTabHandler('app')">移动端</li>
          <li :class="tabType === 'pc' ? 'active': ''" @click.prevent.stop="setTabHandler('pc')">电脑端</li>
          <!-- 滑动块 -->
          <span :class="`el__tab__link ${tabType}`"></span>
        </ul>
        <!-- 内容区域---PC -->
        <div class="panel__pc" v-show="tabType === 'pc'">
1123
        </div>
        <!-- 内容区域---app -->
        <div class="panel__app" v-show="tabType === 'app'">
          <div class="app__left">
            <div class="app__title">
              <img src="../../common/images/custom-tab/video-bg-new-h5.png" />
            </div>
            <div class="app__menu">
              <!-- 左翻 -->
              <span class="app__menu__arrow el-icon-arrow-left"></span>
              <!-- 右翻 -->
              <span class="app__menu__arrow el-icon-arrow-right"></span>
              <!-- 添加菜单 -->
              <span class="add-menu">+</span>
              <!-- 菜单列表 -->
              <div class="panel__app__menu">
                <ul class="app__menu__list">
                  <li v-for="(item, ins) in customMenus" :key="ins" :class="menuTabIndex === ins ? 'menu__item active' : 'menu__item'">
                    <div class="menu__item__title" >{{ item.name }}</div>
                    <ul class="app__menu__btns">
                      <li>重命名</li>
                      <li>右移</li>
                      <li>左移</li>
                      <li>右边新增菜单</li>
                      <li>左边新增菜单</li>
                      <li>
                        <div class="checkbox-item">
                          <el-checkbox />
                          <div class="menu__item__status">
                            预告/结束显示
                            <el-tooltip>
                              <div slot="content">
                                勾选后，该直播为预告和结束状态时也会显示此菜单；不勾选则只在直播和回放状态显示。
                              </div>
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </div>
                        </div>
                      </li>
                      <li>删除</li>
                      <li>显示</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 编辑区域 -->
            <div class="edit__dragger">
              <show-img-txt />
              <show-rq-code />
              <show-video />
              <show-special />
              <show-text-link />
              <show-img-link />
              <show-title />
              <show-hr />
              <show-rank />
            </div>
          </div>
          <div class="app__right">
            <unit-img-txt elName="imgTxtEditor" defaultText="默认图文"></unit-img-txt>
            <unit-rq-code />
            <unit-video />
            <unit-special />
            <unit-text-link />
            <unit-img-link />
            <unit-title />
            <unit-hr />
            <unit-rank />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/views/LiveModule/components/pageTitle";
// 展示区
import ShowImgTxt from  './CustomTab/showImgTxt.vue';
import ShowRqCode from  './CustomTab/showRqCode.vue';
import ShowVideo from  './CustomTab/showVideo.vue';
import ShowSpecial from  './CustomTab/showSpecial.vue';
import ShowTextLink from  './CustomTab/showTextLink.vue';
import ShowImgLink from  './CustomTab/showImgLink.vue';
import ShowTitle from  './CustomTab/showTitle.vue';
import ShowHr from  './CustomTab/showHr.vue';
import ShowRank from  './CustomTab/showRank.vue';
// 编辑区
import UnitImgTxt from  './CustomTab/unitImgTxt.vue';
import UnitRqCode from  './CustomTab/unitRqCode.vue';
import UnitVideo from  './CustomTab/unitVideo.vue';
import UnitSpecial from  './CustomTab/unitSpecial.vue';
import UnitTextLink from  './CustomTab/unitTextLink.vue';
import UnitImgLink from  './CustomTab/unitImgLink.vue';
import UnitTitle from  './CustomTab/unitTitle.vue';
import UnitHr from  './CustomTab/unitHr.vue';
import UnitRank from  './CustomTab/unitRank.vue';
export default {
  name: "customTab.vue",
  components: {
    PageTitle,
    ShowImgTxt,
    ShowRqCode,
    ShowVideo,
    ShowSpecial,
    ShowTextLink,
    ShowImgLink,
    ShowTitle,
    ShowHr,
    ShowRank,
    UnitImgTxt,
    UnitRqCode,
    UnitVideo,
    UnitSpecial,
    UnitTextLink,
    UnitImgLink,
    UnitTitle,
    UnitHr,
    UnitRank,
  },
  data() {
    return {
      compVo: null,
      compList: [
        {name: "图文", is_vip: 0, type: "1", component_id: 1},
        {name: "二维码", is_vip: 0, type: "1", component_id: 2},
        {name: "直播", is_vip: 0, type: "1", component_id: 3},
        {name: "专题", is_vip: 0, type: "1", component_id: 4},
        {name: "文字链", is_vip: 1, type: "1", component_id: 5},
        {name: "图文链", is_vip: 1, type: "1", component_id: 6},
        {name: "标题", is_vip: 1, type: "1", component_id: 7},
        {name: "分割线", is_vip: 1, type: "1", component_id: 8},
        {name: "排行榜", is_vip: 0, type: "2", component_id: 9}
      ],
      tabType: 'app', // pc 电脑端；app 移动端
      menuTabIndex: 0
    };
  },
  methods: {
    setTabHandler(tab) {
      this.tabType = tab;
    },
    customMenuList() {
      this.customMenus = [
        {"name":"\u6587\u6863","type":2,"status":1,"doc_id":0,"doc_name":""},
        {"name":"\u804a\u5929","type":3,"status":1,"welcome_content":""},
        {"name":"\u7b80\u4ecb","type":4,"status":1}
      ];
     /* this.$fetch('customMenuList', {
        webinar_id: this.$route.params.str
      }).then(res=>{
        res && res.code === 200 && res.data ? this.customMenus = res.data : this.customMenus = [];
        console.log(res);
      }).catch(error=>{
        console.log(error);
        this.customMenus = [];
      });*/
    }
  },
  created() {
    this.customMenuList();
  }
};
</script>

<style lang="less" scoped>
.title--cus-tab {
  .flex-display();
  .justify(space-between);
}
.link__left {
  margin-left: 20px;
}
.panel__cus {
  .flex-display();
  .justify(space-between);
}
.panel__left {
  width: 140px;
}
.panel__right {
  width: calc(100% - 140px);
  min-height: 782px;
  background: @background_white;
  border-radius: 4px;
}
.comp__group__title {
  font-size: @font_size_16;
  font-family: @fontRegular;
  font-weight: 400;
  color: @font_color_h2;
  line-height: 24px;
  padding: 8px 0;
}
.comp__item {
  font-size: @font_size_14;
  font-family: @fontRegular;
  font-weight: 400;
  color: @font_color_black;
  line-height: 20px;
  padding: 10px 0;
  cursor: pointer;
  span:last-child {
    margin-left: 6px;
  }
}
/*选项卡重置*/
.el__tabs__box {
  .flex-display();
  .justify(flex-start);
  border-bottom: 1px solid @hr_color;
  position: relative;
  li {
    width: 108px;
    font-size: @font_size_16;
    font-family: @fontRegular;
    font-weight: 400;
    line-height: 24px;
    padding: 8px 0;
    text-align: center;
    color: @font_color_h2;
    margin-left: 24px;
    cursor: pointer;
    &:nth-child(n+1) {
      margin-left: 12px;
    }
    &.active {
      color: @theme--normal;
    }
  }
}
.el__tab__link {
  position: absolute;
  width: 64px;
  height: 2px;
  background: #FB3A32;
  bottom: 0;
  left: 46px;
  transition: transform .3s cubic-bezier(.645,.045,.355,1);
  &.app {
    transform: translateX(-12px);
  }
  &.pc {
    transform: translateX(108px);
  }
}
/*  APP 左侧布局 */
.panel__app {
  padding: 24px 24px 40px 24px;
  .flex-display();
  .justify(space-between);
}
.app__left {
  width: 384px;
  margin-right: 16px;
}
.app__right {
  width: calc(100% - 64px);
}
.app__title {
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
.app__menu {
  position: relative;
  height: 34px;
  line-height: 34px;
  margin-bottom: 20px;
}
.app__menu__arrow {
  position: absolute;
  cursor: pointer;
  font-size: 10px;
  color: #8C8C8C;
  &.el-icon-arrow-right {
    right: 6px;
    top: 12px;
  }
  &.el-icon-arrow-left {
    left: 6px;
    top: 12px;
  }
}
.add-menu {
  position: absolute;
  top: 9px;
  right: 31px;
  width: 16px;
  height: 16px;
  line-height: 12px;
  font-size: 10px;
  text-align: center;
  border: solid 1px #FB3A32;
  color: #FB3A32;
  z-index: 50;
  border-radius: 100%;
}
.panel__app__menu {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  -webkit-transition: left .3s;
  transition: left .3s;
}
.app__menu__list {
  .flex-display();
  .justify(flex-start);
  justify-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #DADADA;
}
.menu__item {
  padding: 0 28px;
  position: relative;
  .menu__item__title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    position: relative;
    cursor: pointer;
  }
  &.active {
    .menu__item__title{
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FB3A32;
      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        display: block;
        content: '';
        width: 100%;
        border-bottom: 2px solid #FC5659;
      }
    }
  }
}
.app__menu__btns {
  display: none;
  position: absolute;
  left: 0;
  top: 35px;
  min-width: 136px;
  background-color: #fff;
  box-shadow: 0 2px 20px 1px rgba(10,10,10,0.26);
  border-radius: 2px;
  padding: 5px 0;
  z-index: 30;
  font-size: 12px;
}
.checkbox-item {
  .flex-display();
  .justify(space-between);
}
</style>
