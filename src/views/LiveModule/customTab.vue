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
          <li :class="unitComp.compType === item.compType ? 'comp__item active' : 'comp__item'" v-for="item in compList.filter(cItem => cItem.type === '1')"
              :key="`comp1Item${item.component_id}`" @click.prevent.stop="addShowComps(item)" draggable="true" @dragstart="dragCompLabel($event, item.component_id)">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
        </template>
        <template>
          <li class="comp__group__title"><label>功能组件</label></li>
          <li :class="unitComp.compType === item.compType ? 'comp__item active' : 'comp__item'" v-for="item in compList.filter(cItem => cItem.type === '2')"
              :key="`comp2Item${item.component_id}`" @click.prevent.stop="addShowComps(item)">
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
          <template>
            <!-- 滑动块 -->
            <span :class="`el__tab__link ${tabType}`"></span>
          </template>
        </ul>
        <!-- 内容区域---PC -->
        <div class="panel__pc" v-show="tabType === 'pc'">
1123
        </div>
        <!-- 内容区域---app -->
        <!--拖放：
          拖动的对象，需要设置draggable属性为true(draggable="true"),
          a元素需要href，img元素需要src。
          1、被拖对象：dragstart事件，被拖动的元素，开始拖放触发
          2、被拖对象：drag事件，被拖放的元素，拖放过程中
          3、经过对象：dragenter事件，拖放过程中鼠标经过的元素，被拖放的元素“开始”进入其它元素范围内（刚进入）
          4、经过对象：dragover事件，拖放过程中鼠标经过的元素，被拖放的元素正在本元素范围内移动(一直)
          5、经过对象：dragleave事件，拖放过程中鼠标经过的元素，被拖放的元素离开本元素范围
          6、目标地点：drop事件，拖放的目标元素，其他元素被拖放到本元素中
          7、被拖对象：dragend事件，拖放的对象元素，拖放操作结束
       -->
        <div class="panel__app" v-show="tabType === 'app'">
          <div class="app__left">
            <div class="app__title">
              <img src="../../common/images/custom-tab/video-bg-new-h5.png" alt=""/>
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
                    <ul class="app__menu__btn">
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
            <div class="edit__draggable" @drop="dropCompLabel($event)" @dragover="allowDropCompLabel($event)">
              <div :class="`show-comp-template ${item.show_type} active`" :title="item.name" v-for="(item, ins) in modShowHtmlList" :key="'showHtml' + ins" @drop="drop($event, ins)" @dragover="allowDrop($event, ins)">
                <!-- 图文 -->
                <div :data-unit-type="item.component_id" class="img-txt" v-if="item.show_type === 'img-txt'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-img-txt @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-img-txt>
                </div>
                <!-- 二维码 -->
                <div class="rq-code" v-if="item.show_type === 'rq-code'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-rq-code @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-rq-code>
                </div>
                <!-- 直播 -->
                <div class="video" v-if="item.show_type === 'video'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-video @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-video>
                </div>
                <!-- 专题 -->
                <div class="special" v-if="item.show_type === 'special'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-special @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-special>
                </div>
                <!-- 文字链 -->
                <div class="text-link" v-if="item.show_type === 'text-link'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-text-link @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-text-link>
                </div>
                <!-- 图片链 -->
                <div class="img-link" v-if="item.show_type === 'img-link'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-img-link @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-img-link>
                </div>
                <!-- 标题 -->
                <div class="title" v-if="item.show_type === 'title'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-title @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-title>
                </div>
                <!-- 分割线 -->
                <div class="hr" v-if="item.show_type === 'hr'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-hr @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-hr>
                </div>
                <!-- 排行榜 -->
                <div class="rank" v-if="item.show_type === 'rank'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                  <show-rank @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-rank>
                </div>
                <i class="menu-icon del" @click.prevent.stop="showCompsItemDel($event, ins)"></i>
              </div>
            </div>
          </div>
          <div class="app__right">
            <!-- 组件标题 -->
            <div class="comp__edit__title">{{unitComp.name}}</div>
            <!-- 编辑区域引入 -->
            <unit-img-txt elName="imgTxtEditor" defaultText="默认图文" v-if="unitComp.show_type === 'img-txt'"></unit-img-txt>
            <unit-rq-code v-if="unitComp.show_type === 'rq-code'"/>
            <unit-video v-if="unitComp.show_type === 'video'"/>
            <unit-special v-if="unitComp.show_type === 'special'"/>
            <unit-text-link v-if="unitComp.show_type === 'text-link'"/>
            <unit-img-link v-if="unitComp.show_type === 'img-link'"/>
            <unit-title v-if="unitComp.show_type === 'title'"/>
            <unit-rank v-if="unitComp.show_type === 'rank'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
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
    UnitRank,
  },
  data() {
    return {
      compVo: null,
      compList: [],
      tabType: 'app', // pc 电脑端；app 移动端
      customMenus: [],
      menuTabIndex: 0,
      modShowHtmlList: [], // 展示模块中创建的组件push进入的数据集合。但删除的时候，组件编号顺序变化情况需关注。
      compIndex: 0, // 统计当前组件属于数据集合中第几个
      unitComp: {}, // 当前操作面板, 同compList中单个内容
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    compCovert(component_id) {
      let str = null;
      switch (component_id) {
        case 1:
          str = 'img-txt';
          break;
        case 2:
          str = 'rq-code';
          break;
        case 3:
          str = 'video';
          break;
        case 4:
          str = 'special';
          break;
        case 5:
          str = 'text-link';
          break;
        case 6:
          str = 'img-link';
          break;
        case 7:
          str = 'title';
          break;
        case 8:
          str = 'hr';
          break;
        case 9:
          str = 'rank';
          break;
        default:
          str = null;
        break;
      }
      return str;
    },
    setTabHandler(tab) {
      this.tabType = tab;
    },
    getCompList() {
      let list = [
        {name: "图文", is_vip: 0, type: "1", component_id: 1},
        {name: "二维码", is_vip: 0, type: "1", component_id: 2},
        {name: "直播", is_vip: 0, type: "1", component_id: 3},
        {name: "专题", is_vip: 0, type: "1", component_id: 4},
        {name: "文字链", is_vip: 1, type: "1", component_id: 5},
        {name: "图文链", is_vip: 1, type: "1", component_id: 6},
        {name: "标题", is_vip: 1, type: "1", component_id: 7},
        {name: "分割线", is_vip: 1, type: "1", component_id: 8},
        {name: "排行榜", is_vip: 0, type: "2", component_id: 9}
      ];
      list.map(item => {
        item.compType = this.compCovert(item.component_id);
      });
      this.compList = list;
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
    },
    // 左侧按钮拖拽-创建组件
    addShowComps(item) {
      if (item.compType === null) {
        this.$message.error('非有效组件，无法使用');
        return;
      }
      this.compIndex++;
      let unitComp = Object.assign({
        show_type: item.compType
      }, item);
      unitComp.original_params = {
        styles: '',
        content: '',
        params: ''
      };
      unitComp.update_params = {
        styles: '',
        content: '',
        params: ''
      };
      this.modShowHtmlList.push(unitComp);
      console.log(JSON.stringify(unitComp));
      this.unitComp = unitComp; // 设置右侧操作面板跟当前一致
    },
    // 组件返回结果
    getShowCompInfo(showCompStr, ins) {
      let tempVo = JSON.parse(showCompStr);
      this.modShowHtmlList[ins].update_params = {
        styles: tempVo.styles,
        content: tempVo.content,
        params: tempVo.params
      };
    },
    dropCompLabel(eve, index) {
      console.log(`dropCompLabel ${index}拖拽对象移动停止触发~~~`);
      eve.preventDefault();
    },
    allowDropCompLabel(eve, index) {
      console.log(`allowDropCompLabel ${index}触发`);
      eve.preventDefault();
    },
    dragCompLabel(eve, index) {
      console.log(eve, index);
    },
    // drop 当拖拽对象移动停止时触发，执行拖拽后位置变更效果（目标前插入）；注意：暂时只针对大块处理，让其拖拽可移动，通过splice进行删除或者在某个位置插入数据
    drop(eve, index) {
      console.log('drop 拖拽对象移动停止触发~~~');
      eve.preventDefault();
      const moveIndex = eve.dataTransfer.getData('tbI');
      const moveObject = this.modShowHtmlList[moveIndex];
      this.modShowHtmlList.splice(moveIndex, 1);
      this.modShowHtmlList.splice(index, 0, moveObject);
    },
    allowDrop(eve, index) {
      console.log(`allDrop ${index}触发`);
      eve.preventDefault();
    },
    drag(eve, index) {
      console.log(`drag ${index} 触发`);
    },
    showCompsItemDel(eve, index) {
      this.$confirm(`确认删除该项？`).then(res => {
        console.log('删除', res);
        this.modShowHtmlList.splice(index, 1);
        // 每次删除后，默认展示可编辑面板为第一个
        if(this.modShowHtmlList.length > 0) {
          this.unitComp = this.modShowHtmlList[0];
        }
      }).catch(() => {
        // this.$message.info('已取消');
      });
    }
  },
  created() {
    this.getCompList();
    this.customMenuList();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
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
  color: @font_color_h1;
  line-height: 20px;
  padding: 10px 0;
  cursor: pointer;
  &:hover, &.active {
    color: @theme--normal;
  }
  &.comp__item--disabled {
    color: @font_color_h3;
  }
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
  width: 382px;
  margin-right: 16px;
  height: 661px;
  overflow-y: auto;
}
.app__right {
  width: calc(100% - 64px);
}
.comp__edit__title {
  margin-bottom: 32px;
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
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    position: relative;
    cursor: pointer;
  }
  &.active {
    .menu__item__title{
      font-size: 14px;
      font-family: @fontMedium;
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
.app__menu__btn {
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

.edit__draggable {
  min-height: 460px;
}
/*面板设置*/
.show-comp-template {
  position: relative;
  box-sizing: border-box;
  border: dashed 1px #eee;
  padding: 5px;
  word-wrap: break-word;
  min-height: 32px;
  margin: 10px;
  &.active, &:hover {
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
  }
  /*排行榜组件-特殊*/
  &.rank {
    background-image: url(../../common/images/custom-tab/rank-bg.png) !important;
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
  }
  .num-icon {
    display: inline-block;
    background-size: cover;
    background-position: 100% 100%;
    width: 20px;
    height: 20px;
    vertical-align: -4px;
  }
  .del {
    position: absolute;
    display: block;
    top: -20px;
    right: -10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-image: url(../../common/images/custom-tab/delete_icon.png) !important;
    background-size: cover;
    background-position: 100% 100%;
    margin: 8px auto 0 auto;
    z-index: 5;
  }
}
</style>
