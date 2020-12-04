<template>
  <div>
    <pageTitle title="个人主页"></pageTitle>
    <div class="ac__home__panel">
      <!-- 左侧 -->
      <div class="ac__home__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.value" v-for="(item, ins) in tabList" :key="ins"></el-tab-pane>
        </el-tabs>
        <el-button class="panel-btn2 length104" type="primary" size="medium" round @click.prevent.stop="toHomeSetInfo">设置</el-button>
        <el-button class="panel-btn length104" size="medium" round>分享</el-button>

        <div class="search">
          <div class="search-query">
            <el-input
              :placeholder="tabType === 'special' ? '请输入专题名称' : '请输入直播名称'"
              v-model="query.keyword">
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="searchHandle">
              </i>
            </el-input>
          </div>
        </div>
        <!-- 专题列表 -->
        <div class="live-panel">
          <el-row :gutter="40" class="lives">
            <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in dataList" :key="index">
              <div class="inner">
                <div class="top">
                  <span class="liveTag">{{item | liveTag}}</span>
                  <span class="hot">
                  <i class="el-icon-view"></i>
                  {{item.pv | unitCovert}}
                </span>
                  <img :src="item.img_url" alt="">
                </div>
                <div class="bottom">
                  <div class="">
                    <p class="liveTitle">{{item.subject}}</p>
                    <p class="liveTime">{{item.start_time}}</p>
                  </div>
                </div>
                <transition name="el-zoom-in-bottom">
                  <div class="mask" v-show="!!item.liveDropDownVisible"></div>
                </transition>
              </div>
            </el-col>
          </el-row>
        </div>
        <SPagination :total="tabList[0].total" :page-size='query.limit' :current-page='query.pageNumber' @current-change="changeHandle" align="center"></SPagination>

        <!-- 直播列表 -->
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
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'info.vue',
  components: {
    PageTitle
  },
  data() {
    return {
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1,
        keyword: ''
      },
      tabList: [
        {
          label: '直播',
          value: 'live',
          total: 0
        },
        {
          label: '专题',
          value: 'special',
          total: 10
        }
      ],
      tabType: null,
      dataList: []
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
      this.query.pos = (pageNum-1)*this.query.limit;
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
    getLiveList(){
      const params = {
        pos: this.query.pos,
        user_id: 1330,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        webinar_states: this.liveStatus, // 直播状态 默认为0 可以传入多个值 使用逗号分隔  0 全部 2 预告 1 直播 3 结束 5 回放 4 点播
        need_flash: 0 // 是否需要flash数据 0 否 1 是
      };
      this.loading = true;
      this.$fetch('liveList', params).then(res=>{
        console.log(res);
        this.dataList = res.data.list;
        this.tabList[0].total = 50; //  res.data.total;
      }).catch(error=>{
        console.log(error);
        this.dataList = [];
        this.tabList[0].total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    getSpecialList(){
      const params = {
        pos: this.query.pos,
        user_id: 1330,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        webinar_states: this.liveStatus, // 直播状态 默认为0 可以传入多个值 使用逗号分隔  0 全部 2 预告 1 直播 3 结束 5 回放 4 点播
        need_flash: 0 // 是否需要flash数据 0 否 1 是
      };
      this.loading = true;
      this.$fetch('liveList', params).then(res=>{
        console.log(res);
        this.dataList = res.data.list;
        this.tabList[1].total = res.data.total;
      }).catch(error=>{
        console.log(error);
        this.dataList = [];
        this.tabList[1].total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    toHomeSetInfo() {
      this.$router.push({
        path: '/account/homeSetInfo/1'
      });
    }
  },
  filters: {
  liveTag(val) {
    /**
     * type  1预约 2直播 3回放 4点播 5结束
     * is_interact 是否互动
     *
     * type: 0直播  1点播  2回放
     * status：0互动直播  1音频直播 2视频直播
     */
    const liveTypeStr = ['', '预约', '直播', '回放', '点播', '结束'];
    const liveStatusStr = ['互动直播', '音频直播', '视频直播'];
    let str = liveTypeStr[val.type];
    if (val.type != 4) {
      str += ` | ${liveStatusStr[val.is_interact]}`;
    }
    return str;
  },
  unitCovert(val) {
    val = Number(val);
    if (isNaN(val)) return 0;
    if (val > 1e5 && val < 1e8) {
      return `${(val / 1e4).toFixed(2)}万`;
    } else if (val > 1e8) {
      return `${(val / 1e8).toFixed(2)}亿`;
    } else {
      return val;
    }
  },
  subLiveTitle(str) {
    if (typeof str == 'string') {
      str = `${str.substring(0, 32)}...`;
    }
    return str;
  }
},
  mounted() {
    this.tabType = this.tabList[0].value;
    this.searchHandle(1);
  }
};
</script>

<style lang="less" scoped>
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
  font-family: PingFangSC-Regular, PingFang SC;
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
