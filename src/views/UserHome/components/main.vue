<template>
  <div>
    <el-tabs v-model="tabType" @tab-click="handleClick">
      <template  v-for="(item, ins) in tabList">
        <el-tab-pane :label="item.label" :name="item.value" :key="ins" v-if="vo[item.compare_key]"></el-tab-pane>
      </template>
    </el-tabs>
    <div class="search panel-btn" v-if="(vo.show_subject && vsQuanxian && vsQuanxian['subject_manager'] > 0) || vo.show_webinar_list">
      <div class="search-query">
        <VhallInput
          style="width: 240px"
          :placeholder="tabType === 'special' ? '请输入专题名称' : '请输入直播标题或者直播ID'"
          v-model="query.keyword"
          clearable
          v-clearEmoij
          @keyup.enter.native="searchHandle"
          @clear="searchHandle"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="searchHandle">
          </i>
        </VhallInput>
      </div>
    </div>
    <!-- 专题列表 or  专题列表 -->
    <div class="live-panel" v-if="dataList && dataList.length > 0" v-loading="loading">
      <el-row :gutter="40" class="lives">
        <!--:xs="24" :sm="12" :md="12" :lg="8" :xl="6"
        col-lg-*  一般用于大屏设备（min-width：1200px）
        col-md-*  一般用于中屏设备（min-width：992px）
        col-sm-*  一般用于小屏设备（min-width：768px）
        col-xs  -*用于超小型设备（max-width：768px）
        -->
        <el-col class="liveItem" :xs="8" :sm="8" :md="8" :lg="8" :xl="6" v-for="(item, index) in dataList" :key="index">
          <a class="inner" :href="toPageHandle(item)" target="_blank">
            <div class="top">
              <span class="liveTag" v-if="tabType === 'live' && item.webinar_type">
                <label class="live-status" v-if="item.webinar_state == 1">
                  <!-- @click="toPageHandle(item)" -->
                  <img src="../../../common/images/live.gif" alt="" />
                </label>{{item | actionTag}}
                <span v-if='item.webinar_type != 6 && hasDelayPermission && item.no_delay_webinar == 1'> | 无延迟</span>
              </span>
              <span class="hot" v-if="item.hide_pv > 0">
                 <i class="iconfont-v3 saasicon_redu"> {{ item.pv | formatNum}}</i>
              </span>
              <a :href="toPageHandle(item)" target="_blank" v-if="tabType === 'live' ? item.img_url : item.cover">
                <img :class="`img_box_bg home_bg_${item.itemMode}`"  :src="tabType === 'live' ? item.img_url : item.cover" alt="" />
              </a>
            </div>
            <div class="bottom">
              <div class="">
                <p class="liveTitle">{{tabType === 'live' ? item.subject : item.title}}</p>
                <p class="liveTime">{{tabType === 'live' ? item.start_time : item.created_at | unitTime }}</p>
              </div>
            </div>
            <transition name="el-zoom-in-bottom">
              <div class="mask" v-show="!!item.liveDropDownVisible"></div>
            </transition>
          </a>
        </el-col>
      </el-row>
    </div>
    <SPagination
      :total="tabType === 'live' ? (tabList[0] && tabList[0].total ? tabList[0].total : 0) : (tabList[1] && tabList[1].total ? tabList[1].total : 0) "
      :page-size='query.limit'
      :current-page='query.pageNumber'
      @current-change="changeHandle" align="center"
      v-if="tabType === 'live' ? (tabList[0] && tabList[0].total ? tabList[0].total : 0) > query.limit : (tabList[1] && tabList[1].total ? tabList[1].total : 0) > query.limit"
    ></SPagination>
    <!-- 既无专题权限 且 无直播权限 -->
    <div :class="['no-create', {'no-border': $route.meta.type === 'owner'}]" :height=170  v-if="Number(vo.show_subject) === 0 && Number(vo.show_webinar_list) === 0">
      <null-page text="暂无数据" nullType="create"></null-page>
    </div>
    <!-- 搜索全部，并且无数据 -->
    <null-page text="暂未添加内容" nullType="create" :height=200 v-if="query.keyword == '' && (tabType === 'live' ? (tabList[0] && tabList[0].total ? tabList[0].total : 0) === 0 : (tabList[1] && tabList[1].total ? tabList[1].total : 0) === 0)"></null-page>
    <!-- 搜索无结果 -->
    <null-page v-if="query.keyword != '' && (tabType === 'live' ? (tabList[0] && tabList[0].total ? tabList[0].total : 0) === 0 : (tabList[1] && tabList[1].total ? tabList[1].total : 0) === 0)"></null-page>

  </div>
</template>

<script>
import Env from "@/api/env";
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import {sessionOrLocal, parseImgOssQueryString, cropperImage} from "@/utils/utils";
export default {
  name: "list.vue",
  components: {
    NullPage
  },
  data() {
   return {
     lowerGradeInterval: null,
     query: {
       pos: 0,
       limit: 12,
       pageNumber: 1,
       keyword: ''
     },
     loading: true,
     tabList: [],
     tabType: null,
     dataList: [],
     vo: {},
     vsQuanxian: [],
     hasDelayPermission: false
   };
  },
  methods: {
    // 切换选项卡
    handleClick(tab, event) {
      console.log(tab, event);
      this.$vhall_paas_port({
        k: this.tabType === 'live' ? 100801 : 100802,
        data: {business_uid: this.$parent.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.query.keyword = '';
      this.searchHandle();
    },
    // 查询
    searchHandle() {
      if (this.query.keyword) {
        this.$vhall_paas_port({
          k: 100803,
          data: {business_uid: this.$parent.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.getDataList();
    },
    // 分页点击
    changeHandle(pageNum) {
      this.query.pageNumber = pageNum;
      this.query.pos = (Number(pageNum)-1)*this.query.limit;
      this.getDataList();
    },
    // 区分是获取直播列表 还是 主题列表
    getDataList() {
      if (this.tabType === 'live') {
        this.getLiveList();
      } else{
        this.getSpecialList();
      }
    },
    // 获取直播列表
    getLiveList(){
      const params = {
        pos: this.query.pos,
        home_user_id: this.$route.params.str,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        webinar_states: this.liveStatus, // 直播状态 默认为0 可以传入多个值 使用逗号分隔  0 全部 2 预告 1 直播 3 结束 5 回放 4 点播
        is_private: 0, // 展示所有公开的
        need_flash: 1 // 是否需要flash数据 0 否 1 是liveStatus
      };
      this.loading = true;
      this.$fetch('liveList', this.$params(params), {
        'gray-id': this.$route.params.str
      }).then(res=>{
        this.loading = false;
        if (res && res.code === 200) {
          let list = res.data.list;
          list.map(item => {
            item.share_link = `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`;
            if (cropperImage(item.img_url)) {
              item.itemMode = this.handlerImageInfo(item.img_url);
            } else {
              item.itemMode = 3;
            }
          });
          this.dataList = list;
          this.tabList[0].total = res.data.total;
        } else {
          this.dataList = [];
          this.tabList[0].total = 0;
        }
      }).catch(error=>{
        this.loading = false;
        console.log(error);
        this.dataList = [];
        this.tabList[0].total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 获取专题列表
    getSpecialList(){
      const params = {
        pos: this.query.pos,
        home_user_id: this.$route.params.str,
        limit: this.query.limit,
        title: this.query.keyword,
        is_private: 0, // 展示所有公开的
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        // need_flash: 1  个人主页不能展示双语专题
      };
      this.loading = true;
      this.$fetch('subjectList', this.$params(params), {
        'gray-id': this.$route.params.str
      }).then(res=>{
        this.loading = false;
        if (res && res.code === 200) {
          console.log(res);
          let list = res.data.list;
          list.map(item => {
            item.share_link = `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/special/detail?id=${item.id}`;
            if (cropperImage(item.cover)) {
              item.itemMode = this.handlerImageInfo(item.cover);
            } else {
              item.itemMode = 3;
            }
            // item.img_url = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.cover) || this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.cover) || `${Env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`;
          });
          this.dataList = list;
          this.tabList[1].total = res.data.total;
        }
      }).catch(error=>{
        this.loading = false;
        console.log(error);
        this.dataList = [];
        this.tabList[1].total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 解析图片地址
    handlerImageInfo(url) {
      let obj = parseImgOssQueryString(url);
      return Number(obj.mode) || 3;
    },
    // 去设置
    toHomeSetInfo() {
      this.$emit('showSet', true);
    },
    toPageHandle(item) {
      let routerStr = `/lives/subscribe/${item.webinar_id}`;
      // webinar_state =》 1 直播  2 预告  3 结束 4 点播 5 回放 [lives/watch 观看页；lives/room 发起页；lives/subscribe 预告/结束页]
      if (item.webinar_state === 1) {
        routerStr = `/lives/watch/${item.webinar_id}`;
      } else if  (item.webinar_state === 2) {
        routerStr = `/lives/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 3) {
        routerStr = `/lives/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 4) {
        routerStr = `/lives/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 5) {
        routerStr = `/lives/watch/${item.webinar_id}`;
      }
      if (this.tabType !== 'live') {
        // let routeData = this.$router.resolve({ path: '/special/detail', query: {id: item.id, delay: this.hasDelayPermission } });
        // return routeData.href;
        return `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${item.id}&delay=${this.hasDelayPermission}`
        // window.open(routeData.href, '_blank');
      } else {
       /*  let routeData = this.$router.resolve({
          path: routerStr
        });
         window.open(routeData.href, '_blank');*/
        let url = `${process.env.VUE_APP_WAP_WATCH}${routerStr}`;
        // window.open(url, '_blank');
        return url;
      }
    },
    getShow(vo) {
      // 根据个人主页信息，控制 直播 or 专题展示
      if(this.vsQuanxian && this.vsQuanxian['subject_manager'] > 0) {
        this.tabList = [
          {
            label: '直播',
            value: 'live',
            compare_key: 'show_webinar_list',
            total: 0
          },
          {
            label: '专题',
            value: 'special',
            compare_key: 'show_subject',
            total: 10
          }
        ]
        // 考虑专题配置项
        if (Number(vo.show_subject) > 0 && Number(vo.show_webinar_list) > 0) {
          this.tabType = this.tabList[0].value;
          this.searchHandle(1);
        } else if (Number(vo.show_webinar_list) > 0) {
          this.tabType = this.tabList[0].value;
          this.searchHandle(1);
        } else if (Number(vo.show_subject) > 0) {
          this.tabType = this.tabList[1].value;
          this.searchHandle(1);
        } else {
          this.tabType = null;
        }
      } else {
        this.tabList = [
          {
            label: '直播',
            value: 'live',
            compare_key: 'show_webinar_list',
            total: 0
          }
        ]
        // 不考虑专题配置项，只考虑直播列表
        if (Number(vo.show_webinar_list) > 0) {
          this.tabType = this.tabList[0].value;
          this.searchHandle(1);
        } else {
          this.tabType = null;
        }
      }
    },
    initComp(vo) {
      this.vo = vo;
      if(this.$route.meta.type !== 'owner') {
        // 非控制台个人主页，单独调用权限信息页
        this.$fetch('planFunctionGet', {
          webinar_user_id: this.$route.params.str
        }, {
          'gray-id': this.$route.params.str
        }).then(async result => {
            if (result && result.code === 200) {
            let permissions = result.data.permissions;
            // TODO 黄金链路 if(permissions) {
            // TODO 黄金链路 // 设置全部权限
            // TODO 黄金链路 this.vsConfig = JSON.parse(permissions);
            // }
            // this.handleLowerGradeHeart();
            if(permissions) {
              // 设置全部权限
              this.vsQuanxian = JSON.parse(permissions);
              this.hasDelayPermission = this.vsQuanxian['no.delay.webinar']
            }

            this.getShow(vo);
          }
        }).catch(e => {
          console.log(e);
          this.getShow(vo);
        });
      } else {
        // 控制台-无延迟标签，使用缓存key
        // TODO 黄金链路 let vsPersonStr = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        // TODO 黄金链路  if (vsPersonStr) {
        // TODO 黄金链路 this.vsConfig = JSON.parse(vsPersonStr);
        // TODO 黄金链路 this.handleLowerGradeHeart();
        // TODO 黄金链路 }
        let vsPersonStr = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        if (vsPersonStr) {
          this.vsQuanxian = JSON.parse(vsPersonStr);
          this.hasDelayPermission = this.vsQuanxian['no.delay.webinar']
        }
        this.getShow(vo);
      }
    },
    handleLowerGradeHeart() {
      this.getLowerGradeConfig(); // 初始化进入时先调用一次
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { user } = res;
        // 优先顺序：用户 > 全局
        let userId = this.$route.meta.type !== 'owner' ? this.$route.params.str : sessionOrLocal.get('userId')
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == userId) : null;
        console.log('个人主页配置项...', userConfig)
        if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions)
        }
      });
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      const permission = this.vsConfig
      Object.assign(permission, data)
      this.vsQuanxian = permission
      this.hasDelayPermission = permission['no.delay.webinar']
      console.log('个人主页中，黄金链路后缓存', permission)
    }
  },
  mounted() {
    // const SAAS_VS_PES = sessionOrLocal.get('SAAS_VS_PES', 'localStorage')
    // this.hasDelayPermission = SAAS_VS_PES ? JSON.parse(SAAS_VS_PES)['no.delay.webinar'] == '1' : false
    // console.log('>>>>>>>>>>>>>>>>',JSON.parse(SAAS_VS_PES)['no.delay.webinar'] )
  }
};
</script>

<style lang="less" scoped>
.panel-btn {
  position: absolute;
  right: 24px;
  top: 10px;
}
.panel-btn2 {
  position: absolute;
  right: 150px;
  top: 6px;
}
.search {
  .flex-display();
  .justify(flex-end);
  /deep/ .el-input__inner{
    user-select: none;
    border-radius: 50px;
    font-size: 14px;
    color: #666666;
    height: 36px;
    line-height: 36px;
  }
}
.search-query {
  width: 220px;
  .el-input {
    /deep/ .el-input__icon {
      line-height: 36px;
    }
    /deep/ .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
    }
  }
}
/deep/.el-tabs__header {
  margin: 0 0;
}
/deep/.el-tabs__item {
  padding: 0 24px;
  box-sizing: border-box;
  display: inline-block;
  list-style: none;
  position: relative;
  font-size: 16px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #666666;
  line-height: 55px;
  height: 55px;
  &.is-active {
    color: #FB3A32;
  }
}
/deep/.el-tabs{
  padding-left: 24px;
}
/deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  width: 56px;
  text-align: center;
  padding-left: 0!important;
}
/deep/.el-tabs__nav-wrap::after {
  height: 1px;
  color: #E6E6E6;
}
.no-create {
  border-top: 1px solid #E6E6E6;
  &.no-border {
    border-top: 0;
  }
  min-height: 618px;
}
/* 直播、专题*/
.live-panel {
  padding: 0 20px;
}
.pageBox {
  padding: 16px 0 40px 0;
}
.lives{
  margin-top: 24px;
  // overflow: hidden;
  // display: flex;
  // justify-content: space-between;
  // flex-flow: wrap;
  // margin-bottom: 20px;
  .liveItem{
    // width: 312px;
    height: 274px;
    margin-bottom: 20px;
    // float: left;
    // margin-right: 40px;
    .inner{
      transition: all .15s ease-in;
      position: relative;
      display: inline-block;
      width: 100%;
    }
    .inner:hover{
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
      border-radius: 4px;
    }
    .top{
      cursor: pointer;
      height: 170.8px;
     /*  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
      background: #1A1A1A;
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      padding: 10px 10px;
      box-sizing: border-box;
      position: relative;
      border-radius: 4px 4px 0 0;
      @media (max-width:1919px) {
        height: 170px;
      }
      .img_box_bg{
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        position: absolute;
        border-radius: 4px 4px 0 0;
        top:0;
        left: 0;
          &.home_bg_1{
            object-fit: fill;
          }
          &.home_bg_2{
            object-fit: cover;
            object-position: left top;
          }
        }
      .liveTag{
        background: rgba(0,0,0, .7);
        color: #fff;
        font-size: 12px;
        padding: 2px 9px;
        border-radius: 20px;
        position: relative;
        z-index: 2;
      }
      .live-status{
        padding: 5px;
        img{
          margin:6px 7px;
          width: 8px;
          height: 8px;
        }
      }
      .hot{
        position: absolute;
        height: 50px;
        width: 100%;
        /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%); */
        background: linear-gradient(180deg, transparent, rgba(0, 0,0, 0.6));
        bottom: 0px;
        left: 0px;
        color: #fff;
        font-size: 14px;
        z-index: 2;
        i{
          position: absolute;
          left: 14px;
          bottom: 10px;
        }
      }
    }
    .bottom{
      height: 96px;
      background: #f7f7f7;
      box-sizing: border-box;
      padding: 14px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-radius: 0 0 4px 4px;
      .liveTitle{
        color: #1A1A1A;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 8px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .liveTime{
        font-size: 14px;
        color: #666;
      }
      .liveOpera{
        color: #666666;
        font-size: 18px;
        a{
          color: rgb(44, 43, 43);
          &.btn-css {
            color: #666666;
            &:nth-child(2){
              margin: 0 20px;
            }
          }
        }
        i{
          cursor: pointer;
          &:nth-child(2){
            margin: 0 20px;
          }
        }
        .el-dropdown{
          float: right;
          &.active{
            z-index: 2;
            color: #fff;
          }
        }
      }
    }
  }
}
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
