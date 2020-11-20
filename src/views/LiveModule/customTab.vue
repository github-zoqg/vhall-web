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
              :key="`comp1Item${item.component_id}`" draggable="true" @dragstart="dragCompLabel($event, item)">
            <span class="el-icon-s-home"></span><span>{{item.name}}</span>
          </li>
        </template>
        <template>
          <li class="comp__group__title"><label>功能组件</label></li>
          <li :class="unitComp.compType === item.compType ? 'comp__item active' : 'comp__item'" v-for="item in compList.filter(cItem => cItem.type === '2')"
              :key="`comp2Item${item.component_id}`" draggable="true" @dragstart="dragCompLabel($event, item)">
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
              <span class="add-menu" @click.prevent.stop="menuSetHandle(null, null, 'add')">+</span>
              <!-- 菜单列表 -->
              <div class="panel__app__menu">
                <ul class="app__menu__list">
                  <li v-for="(item, ins) in customMenus" :key="ins" :class="menuTabIndex === ins ? 'menu__item active' : 'menu__item'">
                    <div class="menu__item__title" >{{ item.name }}</div>
                    <ul class="app__menu__btn">
                      <li @click.prevent.stop="menuSetHandle(item, ins, 'reName')">重命名</li>
                      <li @click.prevent.stop="moveMenuHandle(item, ins, 'right')">右移</li>
                      <li @click.prevent.stop="moveMenuHandle(item, ins, 'left')">左移</li>
                      <li @click.prevent.stop="menuSetHandle(item, ins, 'right')">右边新增菜单</li>
                      <li @click.prevent.stop="menuSetHandle(item, ins, 'left')">左边新增菜单</li>
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
                  <h5 class="unit-title">{{item.compInfo && item.compInfo.title ? item.compInfo.title : '标题'}}</h5>
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
                <i class="menu-icon del" @click.prevent.stop="showCompsItemDel($event, ins)"></i>
              </div>
            </div>
          </div>
          <div class="app__right">
            <!-- 组件标题 -->
            <div class="comp__edit__title">{{unitComp.name}}</div>
            <!-- 编辑区域引入 -->
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
      title="新增菜单"
      :visible.sync="addCustomVisbile"
      :close-on-click-modal="false"
      width="30%">
      <el-form :model="addCustomForm" ref="addCustomForm" :rules="addCustomFormRules" label-width="120px">
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model.trim="addCustomForm.name" auto-complete="off" placeholder="请输入菜单名称" :maxlength="4" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent.stop="addCustomVisible = false">取 消</el-button>
        <el-button type="primary" @click.prevent.stop="sendCustomHandle">确 定</el-button>
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
export default {
  name: "customTab.vue",
  components: {
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
  },
  data() {
    return {
      compVo: null,
      compList: [],
      tabType: 'app', // pc 电脑端；app 移动端
      customMenus: [],
      addCustomVisbile: false,
      addCustomForm: {
        name: null
      },
      addCustomFormRules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },
      menuTabIndex: 0,
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
    // 左、右移动菜单
    moveMenuHandle(item, ins, type) {
      // type === 'left' 左侧移动一个；type === 'right' 右侧移动一个
    },
    // 左、右添加菜单
    menuSetHandle(item, ins, type) {
      // type === 'left' 左侧添加一个；type === 'right' 右侧添加一个
      if (type === 'add'){
        this.addCustomForm.showTitle = '新增菜单';
      } else if (type === 'reName') {
        this.addCustomForm.showTitle = '重命名';
        this.addCustomForm.name = item.name;
      } else if (type === 'right') {
        this.addCustomForm.showTitle = '新增菜单';
      } else if (type === 'left') {
        this.addCustomForm.showTitle = '新增菜单';
      }
      this.addCustomForm.showType = type;
      this.addCustomVisbile = true;
    },
    // 保存菜单结果
    sendCustomHandle() {
      this.$refs.addCustomForm.validate((valid) => {
        if (valid) {
          this.$message.success('新增成功');
          this.customMenus();
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
      this.compIndex++;
      let unitComp = Object.assign({
        show_type: item.compType
      }, item);
      unitComp.compInfo = {};
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
      // 如果是分割线，直接保存
      if (item.compType === 'hr') {
        unitComp.compInfo = {component_id: item.component_id, msg: item.msg};
      } else if (item.compType === 'rq-code') {
        unitComp.compInfo = {component_id: item.component_id, msg: item.msg, imageSrc: `${env.staticLinkVo.aliQr}${env.roomWatchUrl}${this.$route.params.str}`, hrc: `${env.staticLinkVo.aliQr}${env.roomWatchUrl}${this.$route.params.str}`, isDefault:true};
      } else if (item.compType === 'rank') {
        unitComp.compInfo = {component_id: item.component_id, msg: item.msg, inSwitch: 1, inContent: '', rewardSwitch: 1, rewardContent: ''};
        unitComp.rankType = 'inv';
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
      this.$confirm(`确认删除该项？`).then(res => {
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
      alert(1);
      this.rankType = type;
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
</style>
