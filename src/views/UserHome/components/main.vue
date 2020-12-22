<template>
  <div>
    <el-tabs v-model="tabType" @tab-click="handleClick">
      <template  v-for="(item, ins) in tabList">
        <el-tab-pane :label="item.label" :name="item.value" :key="ins" v-if="vo[item.compare_key]"></el-tab-pane>
      </template>
      </el-tabs>
    <el-button :class="['length104', `${Number(vo.show_share) === 0 ? 'panel-btn' : 'panel-btn2'}`]" type="primary" size="medium" round
               @click.prevent.stop="toHomeSetInfo">设置</el-button>
    <el-popover
      placement="bottom-end"
      trigger="click"
      v-if="vo.show_share"
    >
      <div>
        <share slot="content" :url="home_link"></share>
      </div>
      <el-button class="panel-btn length104" size="medium" round slot="reference">分享主页</el-button>
    </el-popover>
    <div class="search" v-if="vo.show_subject">
      <div class="search-query">
        <el-input
          :placeholder="tabType === 'special' ? '请输入专题名称' : '请输入直播名称'"
          v-model="query.keyword"
          @keyup.enter.native="searchHandle"
          >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="searchHandle">
          </i>
        </el-input>
      </div>
    </div>
    <!-- 专题列表 or  专题列表 -->
    <div class="live-panel" v-if="vo.show_webinar_list">
      <el-row :gutter="40" class="lives">
        <!--:xs="24" :sm="12" :md="12" :lg="8" :xl="6"
        col-lg-*  一般用于大屏设备（min-width：1200px）
        col-md-*  一般用于中屏设备（min-width：992px）
        col-sm-*  一般用于小屏设备（min-width：768px）
        col-xs  -*用于超小型设备（max-width：768px）
        -->
        <el-col class="liveItem":xs="24" :sm="12" :md="12" :lg="8" :xl="8" v-for="(item, index) in dataList" :key="index">
          <div class="inner">
            <div class="top">
              <span class="liveTag" v-if="tabType === 'live'">
                <label class="live-status" v-if="item.webinar_state == 1">
                <img src="../../../common/images/live.gif" alt="" @click="toPageHandle(item)"/></label>{{item | liveTag}}
              </span>
              <span class="hot"><i class="el-icon-view"></i>{{ (tabType === 'live' ? item.pv : item.view_num) | unitCovert}}</span>
              <a :href="item.share_link" target="_blank">
                <img :src="tabType === 'live' ? item.img_url : item.cover" alt="" />
              </a>
            </div>
            <div class="bottom">
              <div class="">
                <p class="liveTitle">{{tabType === 'live' ? item.subject : item.title}}</p>
                <p class="liveTime">{{tabType === 'live' ? item.start_time : item.created_at}}</p>
              </div>
            </div>
            <transition name="el-zoom-in-bottom">
              <div class="mask" v-show="!!item.liveDropDownVisible"></div>
            </transition>
          </div>
        </el-col>
      </el-row>
    </div>
    <SPagination
      :total="tabType === 'live' ? tabList[0].total : tabList[1].total"
      :page-size='query.limit'
      :current-page='query.pageNumber'
      @current-change="changeHandle" align="center"
      v-if="tabType === 'live' ? tabList[0].total > query.limit : tabList[1].total > query.limit"
    ></SPagination>
    <null-page text="主人比较懒，什么都没留下！" nullType="no-show" v-if="Number(vo.show_subject) === 0 && Number(vo.show_webinar_list) === 0"></null-page>
    <!-- 无消息内容 -->
    <null-page v-if="tabType === 'live' ? tabList[0].total === 0 : tabList[1].total === 0"></null-page>
  </div>
</template>

<script>
import Share from '@/components/Share';
import Env from "@/api/env";
import NullPage from '../../PlatformModule/Error/nullPage.vue';
export default {
  name: "list.vue",
  components: {
    Share,
    NullPage
  },
  data() {
   return {
     query: {
       pos: 0,
       limit: 12,
       pageNumber: 1,
       keyword: ''
     },
     tabList: [
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
     ],
     tabType: null,
     dataList: [],
     home_link: `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${this.$route.params.str}`,
     vo: {}
   };
  },
  methods: {
    // 切换选项卡
    handleClick(tab, event) {
      console.log(tab, event);
      this.query.keyword = '';
      this.searchHandle();
    },
    // 查询
    searchHandle() {
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
        user_id: this.$route.params.str,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        webinar_states: this.liveStatus, // 直播状态 默认为0 可以传入多个值 使用逗号分隔  0 全部 2 预告 1 直播 3 结束 5 回放 4 点播
        need_flash: 0 // 是否需要flash数据 0 否 1 是
      };
      this.loading = true;
      this.$fetch('liveList', this.$params(params)).then(res=>{
        if (res && res.code === 200) {
          let list = res.data.list;
          list.map(item => {
            item.share_link = `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/live/watch/${item.webinar_id}`
          });
          this.dataList = list;
          this.tabList[0].total = res.data.total;
        } else {
          this.dataList = [];
          this.tabList[0].total = 0;
        }
      }).catch(error=>{
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
        user_id: this.$route.params.str,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1 // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
      };
      this.loading = true;
      this.$fetch('subjectList', this.$params(params)).then(res=>{
        console.log(res);
        let list = res.data.list;
        list.map(item => {
          item.share_link = `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/special/detail?id=${item.id}`;
          // item.img_url = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.cover) || this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.cover) || `${Env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`;
        });
        this.dataList = list;
        this.tabList[1].total = res.data.total;
      }).catch(error=>{
        console.log(error);
        this.dataList = [];
        this.tabList[1].total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 去设置
    toHomeSetInfo() {
      this.$emit('showSet', true);
    },
    toPageHandle(item) {
      let routerStr = `/subscribe/${item.webinar_id}`;
      // webinar_state =》 1 直播  2 预告  3 结束 4 点播 5 回放 [live/watch 观看页；live/room 发起页；subscribe 预告/结束页]
      if (item.webinar_state === 1) {
        routerStr = `/live/watch/${item.webinar_id}`;
      } else if  (item.webinar_state === 2) {
        routerStr = `/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 3) {
        routerStr = `/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 4) {
        routerStr = `/subscribe/${item.webinar_id}`;
      } else if  (item.webinar_state === 5) {
        routerStr = `/live/watch/${item.webinar_id}`;
      }
      let routeData = this.$router.resolve({
        path: routerStr
      });
      window.open(routeData.href, '_blank');
    },
    initComp(vo) {
      this.vo = vo;
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
    }
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
.panel-btn {
  position: absolute;
  right: 32px;
  top: 6px;
}
.panel-btn2 {
  position: absolute;
  right: 150px;
  top: 6px;
}
.search {
  margin-top: 20px;
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
  margin-right: 24px;
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
/deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 24px;
}
/deep/.el-tabs__nav-wrap::after {
  height: 1px;
  color: #E6E6E6;
}
/* 直播、专题*/
.live-panel {
  padding: 0 24px;
}
.lives{
  margin: 24px 0 0 0;
  .liveItem{
    height: 252px;
    margin-bottom: 20px;
    .inner{
      transition: all .15s ease-in;
      position: relative;
    }
    .inner:hover{
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
    }
    .top{
      height: 175px;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      padding: 10px 10px;
      box-sizing: border-box;
      position: relative;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
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
        bottom: 10px;
        left: 10px;
        color: #fff;
        font-size: 14px;
        z-index: 2;
      }
    }
    .bottom{
      background: #fff;
      box-sizing: border-box;
      padding: 14px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #e6e6f6;
      .liveTitle{
        color: #1A1A1A;
        font-size: 16px;
        margin-bottom: 6px;
      }
      .liveTime{
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
