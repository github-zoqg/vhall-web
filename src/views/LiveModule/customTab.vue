<template>
  <div>
    <div class="title--cus-tab">
      <page-title title="自定义菜单">
        <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      </page-title>
      <div>
        <el-button type="primary" round @click.prevent.stop="saveCustomTab">保存</el-button>
        <el-link type="info" :underline=false href="http://www.vhall.com/saas/doc/1457.html" target="_blank" class="link__left">使用帮助</el-link>
      </div>
    </div>
    <div class="panel__cus">
      <!-- 左侧功能组件 -->
      <ul class="panel__left">
        <template>
          <li class="comp__group__title"><label>基本组件</label></li>
          <li :class="unitComp.compType === item.compType ? 'comp__item active' : 'comp__item'" v-for="item in compList.filter(cItem => Number(cItem.type) === 1)"
              :key="`comp1Item${item.component_id}`" draggable="true" @dragstart="dragCompLabel($event, item)">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
        </template>
        <template>
          <li class="comp__group__title"><label>功能组件</label></li>
          <li :class="unitComp.compType === item.compType ? 'comp__item active' : 'comp__item'" v-for="item in compList.filter(cItem => Number(cItem.type) === 2)"
              :key="`comp2Item${item.component_id}`" draggable="true" @dragstart="dragCompLabel($event, item)">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
          <li class="comp__item comp__item--disabled"><span class="el-icon-s-home"></span><span>尽请期待</span></li>
        </template>
      </ul>
      <!-- 右侧菜单预览 + 编辑区域 -->
      <div class="panel__right">
        <!-- 模拟开关 -->
        <div class="zdy--switch">
          <span :class="tabType === 'app' ? 'active' : ''"  @click.prevent.stop="setTabHandler('app')">手机预览</span>
          <span :class="tabType === 'pc' ? 'active' : ''" @click.prevent.stop="setTabHandler('pc')">PC预览</span>
        </div>
        <!-- 内容区域---PC -->
        <div class="panel__pc" v-show="tabType === 'pc'">
          <!-- 浏览器头 -->
          <nav class="browser-header">
            <span class="circle-red"></span>
            <span class="circle-orange"></span>
            <span class="circle-green"></span>
          </nav>
          <!-- pc 广告头 -->
          <div class="pc-advert">
            <img src="../../common/images/custom-tab/pc_bg-new-h5.png" alt="" />
          </div>
          <el-tabs v-model="pcMenuIndex" @tab-click="handlePcMenuClick">
            <el-tab-pane :type="item.type" :label="item.name" :name="'pc_menu_' + ins + '_' + item.type"
                         v-for="(item, ins) in pcCustomMenus" :key="'pc_menu_' + ins + '_' + item.type">
            </el-tab-pane>
          </el-tabs>
          <div class="pc-content">
            <div class="pc-ctx-4" v-show="Number(pcMenuPanel) === 4">
              顶峰时期，Flash Player在全球有10亿次安装量，超过200万Flash开发者。如今，Flash因为封闭和能耗问题，并且Flash权限过高且运行黑盒，Chrome开始禁掉Flash。紧跟时代趋势，深切客户需求的，我们紧跟发展的步伐上线H5播放器功能！新版本不仅为企业客户降低了运营操作的成本，也通过提升观众用户的使用体验，来达到助力企业客户高效获客，轻松转化的目的。
            </div>
            <div class="tab-pane page-custom" v-show="Number(pcMenuPanel) === 1">
              <div class="custom-box pc-custom-box" id="pc-custom-box">
                <div :class="`show-comp-template ${item.show_type}`" :title="item.name" v-for="(item, ins) in modShowHtmlList" :key="'showHtml' + ins">
                  <!-- 图文 -->
                  <div class="img-txt" v-if="item.show_type === 'img-txt'">
                    <div class="content" v-html="item.compInfo && item.compInfo.content ? item.compInfo.content : item.compInfo.content"></div>
                  </div>
                  <!-- 二维码 -->
                  <div class="rq-code" v-if="item.show_type === 'rq-code'" :id="`comps-show-${ins}`">
                    <img class="rq-code"
                         :src="item.compInfo && item.compInfo.imageSrc ? item.compInfo.imageSrc : env.staticLinkVo.aliQr + env.roomWatchUrl + $route.params.str"
                         :hrc="item.compInfo && item.compInfo.hrc ?  item.compInfo.hrc : env.staticLinkVo.aliQr + env.roomWatchUrl + $route.params.str" alt="" />
                  </div>
                  <!-- 直播 -->
                  <div class="video" v-if="item.show_type === 'video'" :id="`comps-show-${ins}`">
                    <show-video :ref="`${item.show_type}-show-dom_${ins}`" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-video>
                  </div>
                  <!-- 专题 -->
                  <div class="special" v-if="item.show_type === 'special'" :id="`comps-show-${ins}`">
                    <show-special :ref="`${item.show_type}-show-dom_${ins}`" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-special>
                  </div>
                  <!-- 文字链 -->
                  <div class="text-link" v-if="item.show_type === 'text-link'" :id="`comps-show-${ins}`">
                    <a :src="item.compInfo && item.compInfo.src ?  item.compInfo.src : ''">{{item.compInfo && item.compInfo.text ? item.compInfo.text : '文字链'}}</a>
                  </div>
                  <!-- 图片链 -->
                  <div class="img-link" v-if="item.show_type === 'img-link'" :id="`comps-show-${ins}`">
                    <!-- TODO 路径暂时用本地的不配置 env.staticBaseUrl + item.compInfo.imageSrc-->
                    <a>
                      <img class="img--ink--img"
                           :src="item.compInfo && item.compInfo.imageSrc ? item.compInfo.imageSrc : env.staticBaseUrl + 'static/images/menu/image-unit.png'"
                           :hrc="item.compInfo && item.compInfo.imageSrc ?  item.compInfo.imageSrc : ''"
                           :tosrc="item.compInfo && item.compInfo.src ?  item.compInfo.src : ''"
                           alt=""/>
                    </a>
                  </div>
                  <!-- 标题 -->
                  <div class="title" v-if="item.show_type === 'title'" :id="`comps-show-${ins}`">
                    <h5 class="unit-title">{{item.compInfo && item.compInfo.title ? item.compInfo.title : '默认标题'}}</h5>
                  </div>
                  <!-- 分割线 -->
                  <div class="hr" v-if="item.show_type === 'hr'" :id="`comps-show-${ins}`">
                    <span class="line"></span>
                  </div>
                  <!-- 排行榜 -->
                  <div class="rank" v-if="item.show_type === 'rank'" :id="`comps-show-${ins}`">
                    <div content="rank-show">
                      <div class="ranking-title"  v-if="item.compInfo && !(!!item.compInfo.inSwitch === false && !!item.compInfo.rewardSwitch === false)">
                        <div class="rank-menu fl">
                          <span :class="rankType === 'reward' ? 'opacityHide' : 'opacityShow'" v-show="item.compInfo && !!(item.compInfo.inSwitch)" @click.stop="showInOrRewardPanel('inv')">邀请榜</span>
                          <span :class="rankType !== 'reward' ? 'opacityHide' : 'opacityShow'" v-show="item.compInfo && !!(item.compInfo.rewardSwitch)" @click.stop="showInOrRewardPanel('reward')">打赏榜</span>
                        </div>
                        <span class="bang-rule fr">排行榜规则</span>
                      </div>
                      <div class="ranking-box"  v-if="item.compInfo && ( !!(item.compInfo.inSwitch) || !!(item.compInfo.rewardSwitch))">
                        <!-- 两个开关都开启状态下，展示inContent；只有任意一个开关开启，展示当前值 v-if="item.compInfo && ( !!(item.compInfo.inSwitch) === false && !!(item.compInfo.rewardSwitch) === true)" -->
                        <div class="rank-con" v-html="item.compInfo && item.compInfo.rewardContent ? item.compInfo.rewardContent : ''"
                             v-show="rankType === 'reward'" ></div>
                        <div class="rank-con" v-html="item.compInfo && item.compInfo.inContent ? item.compInfo.inContent : ''"
                             v-show="rankType === 'inv'"></div>
                      </div>
                      <div class="rank-band" v-if="item.compInfo && !(!!item.compInfo.inSwitch === false && !!item.compInfo.rewardSwitch === false)">
                        <img src="//cnstatic01.e.vhall.com/static/images/menu/bang01.png" alt=""
                             v-show="rankType === 'inv'"/>
                        <img src="//cnstatic01.e.vhall.com/static/images/menu/bang02.png" alt=""
                             v-show="rankType === 'reward'"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 内容区域---app -->
        <div class="panel__app" v-show="tabType === 'app'">
          <div class="app__left">
            <section class="panel__preview">
              <div class="app__menu">
                <!-- 左翻 -->
                <span class="app__menu__arrow el-icon-arrow-left" @click.prevent.stop="movePxHandle('left')"></span>
                <!-- 右翻 -->
                <span class="app__menu__arrow el-icon-arrow-right" @click.prevent.stop="movePxHandle('right')"></span>
                <!-- 添加菜单 -->
                <span class="add-menu" @click.prevent.stop="menuSetHandle(null, null, 'add')">+</span>
                <!-- 菜单列表 -->
                <div class="panel__app__menu">
                  <ul class="app__menu__list" :style="{'marginLeft': marginLeft + 'px'}">
                    <li v-for="(item, ins) in customMenus" :key="ins"
                        :class="menuTabIndex === ins ? 'menu__item active' : 'menu__item'"
                        @click.prevent.stop="isOpenHoverHandle(item, ins)"  @mouseover="showHoverMenu(item, true)" @mouseout="showHoverMenu(item, false)"
                    >
                      <div class="menu__item__title" >{{ item.name }}</div>
                      <div class="app__menu__panel" v-if="item.isOpen" v-show="item.isShow" :style="{left: (90*ins + marginLeft) + 'px'}" @mouseover="showHoverMenu(item, true)" @mouseout="showHoverMenu(item, false)">
                        <ul class="app__menu__btn">
                          <li @click.prevent.stop="menuSetHandle(item, ins, 'reName')">重命名</li>
                          <li @click.prevent.stop="moveMenuHandle(item, ins, 'right')" v-if="ins !== customMenus.length-1">右移</li>
                          <li @click.prevent.stop="moveMenuHandle(item, ins, 'left')" v-if="ins !== 0">左移</li>
                          <li @click.prevent.stop="menuSetHandle(item, ins, 'right')">右边新增菜单</li>
                          <li @click.prevent.stop="menuSetHandle(item, ins, 'left')">左边新增菜单</li>
                          <li v-if="Number(item.status) === 3 || Number(item.status) === 4">
                            <div class="checkbox-item">
                              <el-checkbox :checked="Number(item.status) === 4" @change="changeMenuStatusHandle(item, ins)"/>
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
                          <li v-if="Number(item.status) === 3 || Number(item.status) === 4" @click.prevent.stop="delMenuHandle(ins)">删除</li>
                          <li v-if="Number(item.status) === 1 || Number(item.status) === 2" @click.prevent.stop="changeMenuStatusHandle(item, ins)">{{item.status === 1 ? '隐藏' : '显示'}}</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="panel__preview__ctx">
                <!-- 文档静态展示 -->
                <div class="static-doc" v-if="Number(clickItem.type) === 2">
                  <img src="https://t-alistatic01.e.vhall.com/static/images/menu/doc-bg-new-h5.png">
                </div>
                <!-- 聊天静态展示 -->
                <static-chat v-else-if="Number(clickItem.type) === 3"></static-chat>
                <!-- 简介静态展示 -->
                <static-introduce v-else-if="Number(clickItem.type) === 4"></static-introduce>
                <!-- 商品静态展示 -->
                <static-product v-else-if="Number(clickItem.type) === 5"></static-product>
                <!-- 推荐静态展示 -->
                <static-advert v-else-if="Number(clickItem.type) === 6"></static-advert>
                <!-- 自定义菜单编辑面板 -->
                <div class="edit__draggable" @drop="dropCompLabel($event)" @dragover="allowDropCompLabel($event)" v-else>
                  <div :class="`show-comp-template ${item.show_type} active`" :title="item.name" v-for="(item, ins) in modShowHtmlList" :key="'showHtml' + ins"
                       @drop.prevent.stop="drop($event, ins)" @dragover.prevent.stop="allowDrop($event, ins)" @click.prevent.stop="selectShowComp(item, ins)">
                    <!-- 图文 -->
                    <div class="img-txt" v-if="item.show_type === 'img-txt'" draggable="true" @dragstart="drag($event, ins)" >
                      <div class="content" v-html="item.compInfo && item.compInfo.content ? item.compInfo.content : item.compInfo.content"></div>
                    </div>
                    <!-- 二维码 -->
                    <div class="rq-code" v-if="item.show_type === 'rq-code'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <img class="rq-code"
                           :src="item.compInfo && item.compInfo.imageSrc ? item.compInfo.imageSrc : env.staticLinkVo.aliQr + env.roomWatchUrl + $route.params.str"
                           :hrc="item.compInfo && item.compInfo.hrc ?  item.compInfo.hrc : env.staticLinkVo.aliQr + env.roomWatchUrl + $route.params.str" alt="" />
                    </div>
                    <!-- 直播 -->
                    <div class="video" v-if="item.show_type === 'video'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <show-video :ref="`${item.show_type}-show-dom_${ins}`" @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-video>
                    </div>
                    <!-- 专题 -->
                    <div class="special" v-if="item.show_type === 'special'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <show-special :ref="`${item.show_type}-show-dom_${ins}`" @out="getShowCompInfo" :p_show_comps_index="ins" :p_show_comps_id="item.component_id"></show-special>
                    </div>
                    <!-- 文字链 -->
                    <div class="text-link" v-if="item.show_type === 'text-link'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <a :src="item.compInfo && item.compInfo.src ?  item.compInfo.src : ''">{{item.compInfo && item.compInfo.text ? item.compInfo.text : '文字链'}}</a>
                    </div>
                    <!-- 图片链 -->
                    <div class="img-link" v-if="item.show_type === 'img-link'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <!-- TODO 路径暂时用本地的不配置 env.staticBaseUrl + item.compInfo.imageSrc-->
                      <a>
                        <img class="img--ink--img"
                             :src="item.compInfo && item.compInfo.imageSrc ? item.compInfo.imageSrc : env.staticBaseUrl + 'static/images/menu/image-unit.png'"
                             :hrc="item.compInfo && item.compInfo.imageSrc ?  item.compInfo.imageSrc : ''"
                             :tosrc="item.compInfo && item.compInfo.src ?  item.compInfo.src : ''"
                             alt=""/>
                      </a>
                    </div>
                    <!-- 标题 -->
                    <div class="title" v-if="item.show_type === 'title'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <h5 class="unit-title">{{item.compInfo && item.compInfo.title ? item.compInfo.title : '默认标题'}}</h5>
                    </div>
                    <!-- 分割线 -->
                    <div class="hr" v-if="item.show_type === 'hr'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <span class="line"></span>
                    </div>
                    <!-- 排行榜 -->
                    <div class="rank" v-if="item.show_type === 'rank'" :id="`comps-show-${ins}`" draggable="true" @dragstart="drag($event, ins)" >
                      <div content="rank-show">
                        <div class="ranking-title"  v-if="item.compInfo && !(!!item.compInfo.inSwitch === false && !!item.compInfo.rewardSwitch === false)">
                          <div class="rank-menu fl">
                            <span :class="rankType === 'reward' ? 'opacityHide' : 'opacityShow'" v-show="item.compInfo && !!(item.compInfo.inSwitch)" @click.stop="showInOrRewardPanel('inv')">邀请榜</span>
                            <span :class="rankType !== 'reward' ? 'opacityHide' : 'opacityShow'" v-show="item.compInfo && !!(item.compInfo.rewardSwitch)" @click.stop="showInOrRewardPanel('reward')">打赏榜</span>
                          </div>
                          <span class="bang-rule fr">排行榜规则</span>
                        </div>
                        <div class="ranking-box"  v-if="item.compInfo && ( !!(item.compInfo.inSwitch) || !!(item.compInfo.rewardSwitch))">
                          <!-- 两个开关都开启状态下，展示inContent；只有任意一个开关开启，展示当前值 v-if="item.compInfo && ( !!(item.compInfo.inSwitch) === false && !!(item.compInfo.rewardSwitch) === true)" -->
                          <div class="rank-con" v-html="item.compInfo && item.compInfo.rewardContent ? item.compInfo.rewardContent : ''"
                               v-show="rankType === 'reward'" ></div>
                          <div class="rank-con" v-html="item.compInfo && item.compInfo.inContent ? item.compInfo.inContent : ''"
                               v-show="rankType === 'inv'"></div>
                        </div>
                        <div class="rank-band" v-if="item.compInfo && !(!!item.compInfo.inSwitch === false && !!item.compInfo.rewardSwitch === false)">
                          <img src="//cnstatic01.e.vhall.com/static/images/menu/bang01.png" alt=""
                               v-show="rankType === 'inv'"/>
                          <img src="//cnstatic01.e.vhall.com/static/images/menu/bang02.png" alt=""
                               v-show="rankType === 'reward'"/>
                        </div>
                      </div>
                    </div>
                    <icon icon-class="saasicon-trashline-01" class="menu-icon del" @click.prevent.stop="showCompsItemDel($event, ins)"></icon>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="app__right">
            <!-- 组件标题 -->
            <div class="comp__edit__title">{{unitComp.name}}</div>
            <!-- 编辑区域引入 -->
            <!-- 文档废弃
            <unit-menu-doc v-if="Number(clickItem.type) === 2"></unit-menu-doc>
            -->
            <unit-menu-chat v-if="Number(clickItem.type) === 3" @cxtChangeInfo="menuCtxChange"></unit-menu-chat>
            <unit-img-txt ref="img-txt-unit-dom" v-if="unitComp.show_type === 'img-txt'" @cxtChangeInfo="editChange"></unit-img-txt>
            <unit-rq-code ref="rq-code-unit-dom" v-if="unitComp.show_type === 'rq-code'" @cxtChangeInfo="editChange"/>
            <unit-video ref="video-unit-dom" v-if="unitComp.show_type === 'video'"/>
            <unit-special ref="special-unit-dom" v-if="unitComp.show_type === 'special'"/>
            <unit-text-link ref="text-link-unit-dom" v-if="unitComp.show_type === 'text-link'" @cxtChangeInfo="editChange"/>
            <unit-img-link ref="img-link-unit-dom" v-if="unitComp.show_type === 'img-link'"  @cxtChangeInfo="editChange"/>
            <unit-title ref="title-unit-dom" v-if="unitComp.show_type === 'title'" @cxtChangeInfo="editChange"/>
            <unit-rank ref="rank-unit-dom" v-if="unitComp.show_type === 'rank'" @cxtChangeInfo="editChange"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增菜单（弹出框）-->
    <VhallDialog
      :title="addCustomForm.showTitle"
      :visible.sync="addCustomVisbile"
      :close-on-click-modal="false"
      width="280px"
      class="add-menu-dialog"
    >
      <el-form :model="addCustomForm" ref="addCustomForm" :rules="addCustomFormRules" label-width="0">
        <el-form-item prop="name">
          <el-input v-model.trim="addCustomForm.name" auto-complete="off" placeholder="请输入菜单名称" :maxlength="8" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="sendCustomHandle" size="mini" round>确 定</el-button>
        <el-button @click.prevent.stop="addCustomVisbile = false" size="mini" round>取 消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
import env from '@/api/env';
import PageTitle from '@/components/PageTitle';
// 展示区
import ShowVideo from  './CustomTab/showVideo.vue';
import ShowSpecial from  './CustomTab/showSpecial.vue';
// 菜单设置区
import UnitMenuChat from  './CustomTab/unitMenuChat.vue';

// 编辑区
import UnitImgTxt from  './CustomTab/unitImgTxt.vue';
import UnitRqCode from  './CustomTab/unitRqCode.vue';
import UnitVideo from  './CustomTab/unitVideo.vue';
import UnitSpecial from  './CustomTab/unitSpecial.vue';
import UnitTextLink from  './CustomTab/unitTextLink.vue';
import UnitImgLink from  './CustomTab/unitImgLink.vue';
import UnitTitle from  './CustomTab/unitTitle.vue';
import UnitRank from  './CustomTab/unitRank.vue';
import {sessionOrLocal} from "@/utils/utils";
import StaticChat from './CustomTab/staticChat.vue';
import StaticIntroduce from './CustomTab/staticIntroduce';
import StaticProduct from './CustomTab/staticProduct.vue';
import StaticAdvert from  './CustomTab/staticAdvert.vue';
export default {
  name: "customTab.vue",
  components: {
    StaticAdvert,
    StaticProduct,
    StaticIntroduce,
    StaticChat,
    PageTitle,
    ShowVideo,
    ShowSpecial,
    UnitImgTxt,
    UnitRqCode,
    UnitVideo,
    UnitSpecial,
    UnitTextLink,
    UnitImgLink,
    UnitTitle,
    UnitRank,
    UnitMenuChat
  },
  data() {
    return {
      compVo: null,
      compList: [],
      tabType: 'app', // pc 电脑端；app 移动端
      customMenus: [],
      pcMenuIndex: '',
      pcMenuPanel: '',
      addCustomVisbile: false,
      addCustomForm: {
        name: null
      },
      addCustomFormRules: {
        name: [
          { required: true, maxlength: 8, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },
      menuTabIndex: null,
      marginLeft: 0,
      clickItem: {},
      modShowHtmlList: [], // 展示模块中创建的组件push进入的数据集合。但删除的时候，组件编号顺序变化情况需关注。
      compIndex: 0, // 统计当前组件属于数据集合中第几个
      unitComp: {}, // 当前操作面板, 同compList中单个内容
      env: env,
      rankType: 'inv' // 邀请榜单切换
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
    },
    pcCustomMenus() {
      if (this.customMenus && this.customMenus.length > 0) {
        return this.customMenus.filter(item => {
          return Number(item.type) === 1 || Number(item.type) === 4;
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    // 匹配自定义菜单类型
    compCovert(component_id) {
      return ['', 'img-txt', 'rq-code', 'video', 'special', 'text-link', 'img-link', 'title', 'hr', 'rank'][component_id]
    },
    // pc 或 wap 预览开关
    setTabHandler(tab) {
      this.tabType = tab;
      if(tab === 'pc') {
        this.pcMenuIndex = 'pc_menu_0_' + this.pcCustomMenus[0].type;
        let arr = this.pcMenuIndex.split('_');
        this.pcMenuPanel = arr.length === 4 ? arr[3] : '';
      } else {
        this.pcMenuIndex = '';
        this.pcMenuPanel = '';
      }
    },
    // pc预览中-导航切换
    handlePcMenuClick(tab, event) {
      console.log(tab, event);
      let pcMenuIndex = this.pcMenuIndex;
      let arr = pcMenuIndex.split('_');
      this.pcMenuPanel = arr.length === 4 ? arr[3] : '';
    },
    // 获取左侧组件列表
    getCompList() {
      this.$fetch('menuTplList', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if(res && res.code === 200) {
          let list = res.data.list;
          list.map(item => {
            item.compType = this.compCovert(item.component_id);
          });
          console.log(list, 'this.compList');
          this.compList = list;
        } else {
          this.compList = [];
        }
      }).catch(e => {
        console.log(e);
      });
    },
    // 获取当前活动下菜单列表数据
    customMenuList() {
      this.$fetch('customMenuList', {
        webinar_id: this.$route.params.str
      }).then(res=>{
        if(res && res.code === 200) {
          let menuList = res.data.list;
          let docItem = menuList.filter(item => item.type === 2);
          if(docItem && docItem.length > 0) {
            sessionOrLocal.set('menu_doc_default', JSON.stringify(docItem[0]));
            console.log(docItem, '===> 过滤结果，文档')
          }
          // 其它状态处理
          let newMenuList = menuList.filter((item) => {
            return item.type !== 2;
          }).map((item, ins) => {
            item.isShow = false;
            // 默认简介选中
            if(item.type === 4) {
              item.isOpen = true;
              this.clickItem = item;
              this.menuTabIndex = ins;

              sessionOrLocal.set('menu_active', ins);
              console.log(ins, this.clickItem, '===> clickItem设定当前简介下标');
            } else {
              item.isOpen = false;
            }
            return item;
          });
          console.log(newMenuList, '===> newMenuList设定默认状态以及简介选中状态，菜单所有')
          if(newMenuList && newMenuList.length > 0) {
            this.customMenus = newMenuList;
          }
        } else {
          this.customMenus = [];
        }
      }).catch(error=>{
        console.log(error);
        this.customMenus = [];
      });
    },
    // ，是否可以通过hover选择二级菜单
    isOpenHoverHandle(item, ins) {
      // 如果是自建立菜单，切换时保存原有数据
      console.log(item, '菜单切换===>isOpenHoverHandle')
      if(item.type === 1) {
        this.setCompToMenuSave();
      }
      // 某个点击开启的时候，之前的数据保存到customMenus里面。
      this.clickItem = item;
      this.menuTabIndex = ins;
      sessionOrLocal.set('menu_active', this.menuTabIndex);
      // 某个开启，其余隐藏
      this.customMenus.map((item, cIns) => {
        cIns === ins ? item.isOpen = true : item.isOpen = false;
      });
    },
    setCompToMenuSave() {
      let oldMenuActive = sessionOrLocal.get('menu_active');
      let customTab_comp = JSON.parse(sessionOrLocal.get('customTab_comp'));
      console.log(oldMenuActive, customTab_comp, 'customTab_comp');
      this.customMenus[oldMenuActive].components = customTab_comp || [];
      sessionOrLocal.removeItem('customTab_comp');
    },
    showHoverMenu(item, flag) {
      item.isShow = flag;
    },
    // 删除菜单
    delMenuHandle(ins) {
      this.customMenus.splice(ins, 1);
      // 存储删除后数据
      this.saveCustomTab();
    },
    // 左右滑动一个移动菜单
    movePxHandle(type) {
      // 计算总长度
      let maxLength = this.customMenus.length * 90;
      let movePx = maxLength - 270;
      let leftMargin = this.marginLeft - 90;
      let rightMargin = this.marginLeft + 90;
      // console.log(`当前总长度maxLength=${maxLength},左移目标=${leftMargin},右移目标=${rightMargin},可移动像素movePx=${movePx}`);
      if (type === 'right' && Math.abs(leftMargin) <= movePx) {
        // 点击右侧按钮，右侧内容左移，像素相减
        this.marginLeft = leftMargin;
      }else if (type === 'left' && this.marginLeft < 0) {
        // 点击左侧按钮，左侧内容右移，像素相加
        this.marginLeft = rightMargin;
      }
    },
    // 左、右移动菜单
    moveMenuHandle(item, ins, type) {
      // type === 'left' 左侧移动一个；type === 'right' 右侧移动一个
      let arrs = this.customMenus;
      // 先添加一个，在移除一个
      if(type === 'left') {
        arrs.splice(ins,1,...arrs.splice(ins-1,1,arrs[ins]));
      } else if(type === 'right') {
        arrs.splice(ins+1,1,...arrs.splice(ins,1,arrs[ins+1]));
      }
    },
    // 左、右添加菜单
    menuSetHandle(item, ins, type) {
      // type === 'left' 左侧添加一个；type === 'right' 右侧添加一个
      if (type === 'add'){
        this.addCustomForm.showTitle = '新增菜单';
        this.addCustomForm.menuIndex = this.customMenus.length;
      } else if (type === 'reName') {
        this.addCustomForm.showTitle = '重命名';
        this.addCustomForm.name = item.name;
        this.addCustomForm.menuIndex = ins;
      } else if (type === 'right') {
        this.addCustomForm.showTitle = '新增菜单';
        this.addCustomForm.menuIndex = ins;
      } else if (type === 'left') {
        this.addCustomForm.showTitle = '新增菜单';
        this.addCustomForm.menuIndex = ins;
      }
      this.addCustomForm.showType = type;
      this.addCustomVisbile = true;
    },
    // 菜单隐藏 与 显示
    changeMenuStatusHandle(item, ins) {
      console.log(ins);
      if(item.status === 3) {
        item.status = 4;
      } else if (item.status === 4) {
        item.status = 3;
      } else if (item.status === 2) {
        item.status = 1;
      } else if (item.status === 1) {
        item.status = 2;
      }
    },
    // 保存菜单结果
    sendCustomHandle() {
      // 原有菜单不可删除，状态只有1 和 2； 新增自定义菜单状态默认3，预告显示status为4；
      this.$refs.addCustomForm.validate((valid) => {
        if (valid) {
          if (this.addCustomForm.showType === 'add') {
            // 某位添加菜单
            this.customMenus.push({
              name: this.addCustomForm.name,
              type: 1,
              status: 3, // 1显示,2隐藏,3直播回放显示,4预告结束显示
              components: []
            });
          } else if (this.addCustomForm.showType === 'reName') {
            // 当前菜单，文案修改
            this.customMenus[this.addCustomForm.menuIndex].name = this.addCustomForm.name;
          } else if (this.addCustomForm.showType === 'right') {
            // 右侧新增菜单：若是最后一个，右侧添加；若非最后一个，数组插入
            if (this.addCustomForm.menuIndex === this.customMenus.length -1) {
              this.customMenus.push({
                name: this.addCustomForm.name,
                type: 1,
                status: 3, // 1显示,2隐藏,3直播回放显示,4预告结束显示
                components: []
              });
            } else {
              this.customMenus.splice(this.addCustomForm.menuIndex + 1, 0, {
                name: this.addCustomForm.name,
                type: 1,
                status: 3, // 1显示,2隐藏,3直播回放显示,4预告结束显示
                components: []
              });
            }
          } else if (this.addCustomForm.showType === 'left') {
            this.customMenus.splice(this.addCustomForm.menuIndex, 0, {
              name: this.addCustomForm.name,
              type: 1,
              status: 3, // 1显示,2隐藏,3直播回放显示,4预告结束显示
              components: []
            });
          }
          this.saveCustomTab();
        }
      });
    },
    // 左侧按钮拖拽-创建组件A1
    dropCompLabel(eve) {
      console.log(`dropCompLabel拖拽对象移动停止触发~~~`);
      eve.preventDefault();
      let moveCompVoStr = eve.dataTransfer.getData('menuCompItem');
      if (moveCompVoStr !== '') {
        // 右侧添加
        this.addShowComps(JSON.parse(moveCompVoStr));
      }
    },
    // 左侧按钮拖拽-创建组件A2
    addShowComps(item) {
      if (item.compType === null) {
        this.$message.error('非有效组件，无法使用');
        return;
      }
      let unitComp = Object.assign({
        show_type: item.compType
      }, item);
      unitComp.compInfo = {};
      console.log(item.msg, '当前组件类型')
      // 如果是分割线，直接保存
      if (item.compType === 'hr') {
        unitComp.compInfo = {component_id: item.component_id, msg: '分割线'};
      } else if (item.compType === 'rq-code') {
        unitComp.compInfo = {component_id: item.component_id, msg: item.msg, imageSrc: `${env.staticLinkVo.aliQr}${env.roomWatchUrl}${this.$route.params.str}`, hrc: `${env.staticLinkVo.aliQr}${env.roomWatchUrl}${this.$route.params.str}`, isDefault:true};
      } else if (item.compType === 'rank') {
        unitComp.compInfo = {component_id: item.component_id, msg: item.msg, inSwitch: 1, inContent: '', rewardSwitch: 1, rewardContent: ''};
        unitComp.rankType = 'inv';
      } else if (item.compType === 'title') {
        unitComp.compInfo = {component_id: item.component_id, msg: '标题', title: '默认标题'};
      }
      this.modShowHtmlList.push(unitComp);
      sessionOrLocal.set('customTab_comp', JSON.stringify(this.modShowHtmlList));
      console.log(JSON.stringify(unitComp));
      this.unitComp = unitComp;
      // 获得当前所处show位置下标
      let showIndex = this.modShowHtmlList.length - 1 ;
      // 组件创建完成，初始化传递至进入右侧编辑区
      this.$nextTick(() =>{
        if (item.compType !== 'hr') {
          this.$refs[`${unitComp.show_type}-unit-dom`].initDataComp(JSON.stringify(unitComp), showIndex);
        }
      });
    },
    // 展示组件单项选中，原有内容清空
    selectShowComp(item, ins) {
      // 获取原有设置，清空内容
      let customTab_comp = JSON.parse(sessionOrLocal.get('customTab_comp'));
      let unitComp = customTab_comp[ins];
      this.unitComp = unitComp;
      console.log(`当前选中内容：${JSON.stringify(unitComp)}`);
      this.$nextTick(() =>{
        if (item.compType !== 'hr') {
          this.$refs[`${unitComp.show_type}-unit-dom`].initDataComp(JSON.stringify(unitComp), ins);
        }
      });
    },
    // 右侧编辑区修改，通知左侧展示区域
    menuCtxChange(content) {
      this.customMenus.map(item => {
        if(item.type === 3) {
          item.welcome_content = content || ''
        }
      })
    },
    editChange(saveItem) {
      // 文字链格式： { content: "{component_id: 5, msg: '文字链', text: '文本', src: '文件链路径'}",type: 'text-link', compIndex: 0 }
      // 标题格式： { content: "{component_id: 7, msg: '标题', title: '默认标123题'}",type: 'title', compIndex: 0 }
      // 分割线： {content: "{component_id: 8, msg: '分割线'}", type: 'hr', compIndex: 0 }
      // 图文链： {content: "{component_id: 6, msg: '图片链', imageSrc: '图片返回后地址，不带域名',src: '路径' }", type: 'img-link', compIndex: 0 }
      // 二维码： {content: "{component_id: 2, msg: '二维码', imageSrc: '//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/468888605', "hrc":"//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/468888605", ,"isDefault":true }", type: 'img-link', compIndex: 0 }
      // 图文： {content: "{component_id: 1, msg: '图文', content: '<p>是否哈佛哈哈</p>'}", type: 'img-txt', compIndex: 0}
      // 排行榜：  {content: "{"component_id":9,"msg":"排行榜","inSwitch":"1","rewardSwitch":"0","inContent":"邀请榜文案","rewardContent":"排行榜文案"}", rankType: 'inv', type: 'rank', compIndex: 0}
      if (saveItem.type === 'text-link' || saveItem.type === 'title' || saveItem.type === 'img-link' || saveItem.type === 'rq-code' || saveItem.type === 'img-txt' || saveItem.type === 'rank') {
        this.modShowHtmlList[saveItem.compIndex].compInfo = JSON.parse(saveItem.content);
        sessionOrLocal.set('customTab_comp', JSON.stringify(this.modShowHtmlList));
        if (saveItem.type === 'rank') {
          this.rankType = saveItem.rankType;
        }
      }
    },
    // 组件返回结果
    getShowCompInfo(showCompStr, ins) {
    },
    allowDropCompLabel(eve) {
      console.log(`allowDropCompLabel触发`);
      eve.preventDefault();
    },
    dragCompLabel(eve, item) {
      console.log(eve, item);
      eve.dataTransfer.setData('menuCompItem', JSON.stringify(item));
    },
    // drop 当拖拽对象移动停止时触发，执行拖拽后位置变更效果（目标前插入）；注意：暂时只针对大块处理，让其拖拽可移动，通过splice进行删除或者在某个位置插入数据
    drop(eve, index) {
      console.log('drop 拖拽对象移动停止触发~~~');
      eve.preventDefault();
      const moveIndex = eve.dataTransfer.getData('showCompIndex');
      if (moveIndex !== '') {
        const moveObject = this.modShowHtmlList[moveIndex];
        this.modShowHtmlList.splice(moveIndex, 1);
        this.modShowHtmlList.splice(index, 0, moveObject);
      }
    },
    allowDrop(eve, index) {
      console.log(`allDrop ${index}触发`);
      eve.preventDefault();
    },
    drag(eve, index) {
      console.log(`drag ${index} 触发`);
      eve.dataTransfer.setData('showCompIndex', index);
    },
    showCompsItemDel(eve, index) {
      this.$confirm(`确认删除该项？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(res => {
        console.log('删除', res);
        this.modShowHtmlList.splice(index, 1);
        // 每次删除后，默认展示可编辑面板为第一个
        if(this.modShowHtmlList.length > 0) {
          this.unitComp = this.modShowHtmlList[0];
          sessionOrLocal.set('customTab_comp', JSON.stringify(this.modShowHtmlList));
          this.$nextTick(() =>{
            if (this.unitComp.show_type !== 'hr') {
              this.$refs[`${this.unitComp.show_type}-unit-dom`].initDataComp(JSON.stringify(this.unitComp), 0);
            }
          });
        } else {
          // 若已经是最后一个了，那么重置 {}
          this.unitComp = {};
          sessionOrLocal.removeItem('customTab_comp');
        }
      }).catch(() => {
        // this.$message.info('已取消');
      });
    },
    // 切换邀请卡榜单
    showInOrRewardPanel(type) {
      this.rankType = type;
    },
    // 验证所有的组件保存： 若有失败的，不可保存，直接清除。若验证通过的，直接保存。
    checkComps(customTab_comp_arr) {
      let flag = true;
      if (customTab_comp_arr && customTab_comp_arr.length > 0) {
        // debugger
        for(let i = 0; i<customTab_comp_arr.length; i++) {
          let vo = customTab_comp_arr[i];
          if(vo.component_id === 1) {// 图文
            if(vo.content === null || vo.content === '' || vo.content === undefined) {
              flag = false;
            }
          } else if (vo.component_id === 2) {// 二维码
            if(vo.imageSrc === null || vo.imageSrc === '' || vo.imageSrc === undefined) {
              flag = false;
            }
          } else if (vo.component_id === 3) {// 直播
            flag = false;
          } else if (vo.component_id === 4) {// 专题
            flag = false;
          } else if (vo.component_id === 5) {// 文字链
            if(vo.text === null || vo.text === '' || vo.text === undefined ) {
              flag = false;
            } else if (vo.src === null || vo.src === '' || vo.src === undefined ) {
              flag = false;
            }
          } else if (vo.component_id === 6) {// 图片链
            if(vo.imageSrc === null || vo.imageSrc === '' || vo.imageSrc === undefined ) {
              flag = false;
            } else if (vo.src === null || vo.src === '' || vo.src === undefined ) {
              flag = false;
            }
          } else if (vo.component_id === 7) {// 标题
            if(vo.compInfo.title === null || vo.compInfo.title === '' || vo.compInfo.title === undefined ) {
              flag = false;
            }
          } else if (vo.component_id === 9) { // 排行榜
            if(Number(vo.inSwitch) === 0 && Number(vo.rewardSwitch) === 0) {
              flag = false;
            }
          }
        }
      }
      return flag;
    },
    saveCustomTab() {
      let saveMenus = this.customMenus;
      // 获取缓存组件,若验证通过，存储在当前停留菜单保存
      let customTab_comp = JSON.parse(sessionOrLocal.get('customTab_comp'));
      if(this.checkComps(customTab_comp)) {
        let menu_active = sessionOrLocal.get('menu_active');
        // debugger
        let compList = [];
        if(customTab_comp && customTab_comp.length>0) {
          customTab_comp.map(item => {
            return item.compInfo;
          });
        }
        // debugger
        saveMenus[menu_active].components = saveMenus[menu_active].type === 1 ? compList : [];
        console.log(saveMenus, 'saveCustomTab第一步组装==>存储完编辑选项内容后，数据处理');
        sessionOrLocal.removeItem('customTab_comp');
        console.log('saveCustomTab存储完成后数据清空');
      } else {
        this.$alert('有组件配置错误，请更正后再尝试保存', '提示', {
          dangerouslyUseHTMLString: true,
          center: true,
          customClass: 'zdy-alert-box',
          confirmButtonText: '我知道了'
        });
        return;
      }
      // 若customMenus不包含文档，第一位填充
      let checkType2Result = this.customMenus.filter(item => item.type === 2);
      if(checkType2Result && checkType2Result.length === 0) {
        let menu_doc_default = JSON.parse(sessionOrLocal.get('menu_doc_default'));
        saveMenus.unshift(menu_doc_default);
      }
      console.log(params, 'saveCustomTab第二步组装==>若不包含文档，需填充文档');
      let params = {
        webinar_id: this.$route.params.str,
        save_type: 2, // 1--保存；2--保存+发布
        menus: saveMenus
      };
      console.log(params, '最终文档存储数据结果');
      // debugger
      this.$fetch('customMenuSave', {
        request_data: JSON.stringify(params)
      }).then(res =>{
        if(res && res.code === 200 && res.data) {
          this.$message.success('保存成功');
          this.addCustomVisbile = false;
          this.customMenuList();
        } else {
          this.$message.error(res.msg || '保存失败');
        }
      }).catch(e=>{
        console.log(e);
        this.$message.error('保存失败');
      });
    }
  },
  created() {
    this.getCompList();
    this.customMenuList();
  }
};
</script>
<style>
.content img {
  max-width: 100%;
  height: auto;
}
</style>
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
  min-height: 904px;
  background: @background_white;
  border-radius: 4px;
  padding: 26px 40px 40px 40px;
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
.el__tabs__box2 {
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
.el__tab__link2 {
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
  padding: 0 0;
  .flex-display();
  .justify(space-between);
}
.app__left {
  /*width: 382px;
  margin-right: 16px;
  height: 661px;
  overflow-y: auto;*/
  width: 368px;
  height: 674px;
  background-image: url('../../common/images/h5-show-phone.png');
  background-size: cover;
  margin-top: -16px;
  margin-left: -16px;
  position: relative;
  .panel__preview {
    position: absolute;
    top: 304px;
    width: 310px;
    left: 27px;
  }
  .panel__preview__ctx {
    height: 275px;
    overflow-y: auto;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}
.app__right {
  width: calc(100% - 368px);
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
  margin-bottom: 12px;
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
    left: 0;
    top: 12px;
    z-index: 99;
    background: #ffffff;
    padding-left: 6px;
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
  min-width: 100%;
  transition: left 0.3s;
  height: 36px;
  overflow-y: hidden;
  overflow-x: scroll;
}
.app__menu__list {
  display: block;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #DADADA;
}
.menu__item {
  padding: 0;
  display: inline-block;
  vertical-align: middle;
  width: 90px;
  text-align: center;
  height: 36px;
  flex-shrink: 0;
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
.app__menu__panel {
  position: absolute;
  top: 0;
  background: transparent;
  padding-top: 36px;
  z-index: 99;
}
.app__menu__btn {
  min-width: 136px;
  background-color: #fff;
  box-shadow: 0 2px 20px 1px rgba(10,10,10,0.26);
  border-radius: 2px;
  padding: 5px 0;
  z-index: 30;
  font-size: 12px;
  text-align: center;
  li {
    cursor: pointer;
  }
}
.checkbox-item {
  .flex-display();
  .justify(space-between);
}
.edit__draggable {
  min-height: 460px;
}
.unit-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1A1A1A;
  line-height: 20px;
}
/*面板设置*/
.pc-custom-box {
  .show-comp-template {
    &.active, &:hover {
      cursor: unset;
      -webkit-transition: border .3s;
      transition: border .3s;
      border: unset;
      background: unset;
    }
  }
}
.show-comp-template {
  position: relative;
  box-sizing: border-box;
  border: dashed 1px #eee;
  padding: 5px;
  word-wrap: break-word;
  min-height: 32px;
  margin: 10px;
  &.active, &:hover {
    background: #FFF5F5;
    border: 1px dashed #F09D99;
  }
  /*排行榜组件-特殊*/
  &.rank {
    background-image: url(../../common/images/custom-tab/rank-bg.png) !important;
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .ranking-title {
      display: block;
      margin: 0 0 0 20px;
      color: #fff;
      height: 20px;
    }
    .rank-menu {
      margin-left: -18px;
    }
    .opacityHide {
      opacity: 0.8;
    }
    .opacityShow {
      opacity: 1;
    };
    .ranking-box {
      clear: both;
      background-color: #f2f2f2;
      min-height: 0;
      margin: 20px 0 6px 0;
    }
    .rank-con {
      display: block;
      margin: 0 10px;
      padding: 10px 0;
      font-size: 12px;
      color: #666;
    }
    .rank-band {
      padding: 10px 0;
      background-color: #fff;
      img {
        width: 100%;
        height: auto;
      }
    }
    .menu-cont {
      min-height: 460px;
      display: none;
      width: 100%;
    }
    .bang-rule:after {
      content: '';
      display: inline-block;
      -webkit-transform: rotate(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotate(-90deg);
      transition: -webkit-transform .2s;
      -webkit-transition: -webkit-transform .2s;
      transition: transform .2s, -webkit-transform .2s;
      width: 12px;
      height: 12px;
      background-image: url(../../common/images/custom-tab/arror-detail.png);
      background-size: cover;
      background-position: 100% 100%;
      margin-left: 7px;
      vertical-align: -1px;
    }

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
    top: -15px;
    right: -10px;
    font-size: 20px;
    z-index: 5;
  }
  .content {
    line-height: 1.5;
    color: #666;
    font-size: 12px;
  }
  .line {
    display: block;
    margin: 5px;
    border-bottom: 1px solid #cdcdcd;
  }
  .img--ink--img{
    display: inline-block;
    margin: 0 auto;
    width: 100%;
  }
  .rq-code {
    display: block;
    width: 150px !important;
    margin: 0 auto;
  }
}

.add-menu-dialog {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
}
/*pc-预览*/
.panel__pc {
  min-height: 654px;
  background: #FFFFFF;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08), 0 0 8px 0 rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  .browser-header {
    width: 100%;
    background: #E0E0E0;
    border-radius: 4px 4px 0 0;
    height: auto;
    line-height: 1;
    span {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin: 8px 8px 8px 0;
      border-radius: 50%;
      &:first-child {
        margin-left: 18px;
      }
    }
    span.circle-red {
      background: #FF6059;
      border: 0 solid #E7433B;
    }
    span.circle-orange {
      background: #FFBE2F;
      border: 0 solid #E2A820;
    }
    span.circle-green {
      background: #28CA42;
      border: 0px solid #17B32E;
    }
  }
  .pc-advert {
    img {
      width: 100%;
      display: block;
      line-height: normal;
      margin: 0 0;
    }
  }
  .pc-content {
    padding: 30px 24px 24px 24px;
    /*简介4*/
    .pc-ctx-4 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 22px;
    }
  }
}
/*文档*/
.static-doc {
  width: 286px;
  height: 160px;
  margin: 0 auto;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
