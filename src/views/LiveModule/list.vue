<template>
  <div class="liveListBox">
    <pageTitle title="直播列表">
      <div slot="content">
        1.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
        <br/>
        2.控制台数据为真实数据，不统计虚拟数据
      </div>
    </pageTitle>

    <!-- 操作栏 -->
    <div class="operaBox">
      <el-button type="primary" round>创建直播</el-button>
      <el-button round>创建点播</el-button>
      <div class="searchBox">
        <el-select v-model="liveStatus" placeholder="全部">
          <el-option
            v-for="item in statusOptions"
            :key="item.value+item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="orderBy" placeholder="请选择">
          <el-option
            v-for="item in orderOptions"
            :key="item.value+item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入直播标题"
          v-model="keyWords">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="searchHandler">
          </i>
        </el-input>
      </div>
    </div>
    <!-- 操作栏 -->

    <el-row :gutter="40" class="lives">
      <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in liveList" :key="index">
        <div class="inner">
          <div class="top">
            <span class="liveTag">{{item | liveTag}}</span>
            <span class="hot">
              <i class="el-icon-view"></i>
              {{item.hot | unitCovert}}
            </span>
          </div>
          <div class="bottom">
            <div class="">
              <p class="liveTitle">{{item.title | subLiveTitle}}</p>
              <p class="liveTime">{{item.time}}</p>
            </div>
            <p class="liveOpera">
              <i class="el-icon-video-camera"></i>
              <i class="el-icon-s-promotion"></i>
              <i class="el-icon-document"></i>
              <el-dropdown :class="{active: !!item.liveDropDownVisible}" trigger="click" placement="top-end" @visible-change="dropDownVisibleChange(item)">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>数据报告</el-dropdown-item>
                  <el-dropdown-item>互动统计</el-dropdown-item>
                  <el-dropdown-item>用户统计</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
          <transition name="el-zoom-in-bottom">
            <div class="mask" v-show="!!item.liveDropDownVisible"></div>
          </transition>
        </div>
      </el-col>
    </el-row>

    <!-- <ul class="lives">
      <li v-for="(item, index) in liveList" :key="index">

      </li>
    </ul> -->
    <sPagination :total="1000" :page-size='6' @current-change="currentChangeHandler" align="center"></sPagination>
  </div>
</template>

<script>
import pageTitle from './components/pageTitle';
import sPagination from './components/pagination';
export default {
  data() {
    return {
      liveStatus: 0,
      orderBy: 1,
      keyWords: '',
      pageSize: 10,
      pageNum: 1,
      liveDropDownVisible: false,
      statusOptions: [
        { label: '全部', value: 0 },
        { label: '预告', value: 2 },
        { label: '直播', value: 1 },
        { label: '结束', value: 3 },
        { label: '点播', value: 4 },
        { label: '回访', value: 5 }
      ],
      orderOptions: [
        { label: '按创建时间排序', value: 1 },
        { label: '按最后直播时间排序', value: 2 }
      ],
      liveList: [
        {
          title: '创想聚能艾瑞年对高峰会议既定终结攀登巅',
          time: '2018-07-09 09:30:00',
          hot: 2564,
          type: 0,
          status: 1
        },
        {
          title: '艺术二维码的设计思路，每一次得头脑风暴，每一次得设计盛宴，每一次得境界生化',
          time: '2018-07-09 09:30:00',
          hot: 133900,
          type: 2,
          status: 1
        },
        {
          title: '百度人工智能大会发布芯片',
          time: '2018-07-09 09:30:00',
          hot: 67423,
          type: 1
        },
        {
          title: '第三季度新品创新研讨会—趋势峰会论坛研讨会微吼直播',
          time: '2018-07-09 09:30:00',
          hot: 154654611131,
          type: 2,
          status: 2
        },
        {
          title: '2018西南互联网趋势峰会',
          time: '2018-07-09 09:30:00',
          hot: 12342221,
          type: 2,
          status: 0
        }
      ]
    };
  },
  components: {
    pageTitle,
    sPagination
  },
  created() {
    this.getLiveList();
  },
  methods: {
    searchHandler() {
      console.log('searchHandler');
    },
    dropDownVisibleChange(item) {
      // this.liveDropDownVisible = visible
      this.$set(item, 'liveDropDownVisible', !item.liveDropDownVisible);
    },
    currentChangeHandler(current) {
      console.log('current-change', current);
    },
    getLiveList(){
      const data = {
        pos: this.pageNum,
        // user_id: 1330,
        limit: this.pageSize,
        title: this.keyWords,
        order_type: this.orderBy,
        webinar_type: this.liveStatus
      };
      console.log(data);
      this.$fetch('liveList', data, {"Content-Type": "application/x-www-form-urlencoded", "need_sign": 0, platform: 'pc', token: 'cc'}).then(res=>{
        console.log(res);
      }).catch(error=>{
        this.$message.error(`获取直播列表失败,${error.errmsg || error.message}`);
        console.log(error);
      });
    }
  },
  filters: {
    liveTag(val) {
      /**
       * type: 0直播  1点播  2回放
       * status：0互动直播  1音频直播 2视频直播
       */
      const liveTypeStr = ['直播', '点播', '回放'];
      const liveStatusStr = ['互动直播', '音频直播', '视频直播'];
      let str = liveTypeStr[val.type];
      if (val.type != 1) {
        str += ` | ${liveStatusStr[val.status]}`;
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
  }
};
</script>

<style lang="less" scoped>
  .liveListBox{
    user-select: none;
    // padding: 0px 60px;
    .el-button{
      color:#FB3A32;
      border-color:#FB3A32;
      &:hover{
        background: #ffebeb;
      }
    }
    .el-button--primary{
      background:#FB3A32;
      border-color:#FB3A32;
      color: #fff;
      &:hover{
        background: #fc615b;
      }
    }
    .el-button.is-round{
      padding: 10px 23px;
    }
  }
  .pageTitle{
    color: #1A1A1A;
    font-size: 22px;
    font-weight: 600;
  }
  .operaBox{
    overflow: hidden;
    margin-top: 30px;
    margin-bottom: 20px;
    .searchBox{
      float: right;
      .el-select{
        &:nth-child(1){
          width: 120px;
        }
        &:nth-child(2){
          width: 140px;
          margin-left: 12px;
          margin-right: 20px;
        }
      }
      .el-input{
        width: 220px;
        .el-input__icon{
          cursor: pointer;
        }
        /deep/ .el-input__icon{
          line-height: 36px;
        }
      }
      /deep/ .el-input__inner{
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .lives{
    // overflow: hidden;
    // display: flex;
    // justify-content: space-between;
    // flex-flow: wrap;
    // margin-bottom: 20px;
    .liveItem{
      // width: 312px;
      height: 314px;
      margin-bottom: 20px;
      // float: left;
      // margin-right: 40px;
      .inner{
        transition: all .15s ease-in;
        position: relative;
      }
      .inner:hover{
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.15);
      }
      .top{
        height: 175px;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        padding: 10px 10px;
        box-sizing: border-box;
        position: relative;
        .liveTag{
          background: rgba(0,0,0, .7);
          color: #fff;
          font-size: 12px;
          padding: 2px 9px;
          border-radius: 20px;
        }
        .hot{
          position: absolute;
          bottom: 10px;
          left: 10px;
          color: #fff;
          font-size: 14px;
        }
      }
      .bottom{
        height: 139px;
        background: #fff;
        box-sizing: border-box;
        padding: 14px 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .liveTitle{
          color: #1A1A1A;
          font-size: 16px;
          margin-bottom: 6px;
        }
        .liveTime{
          font-size: 14px;
          color: #666;
        }
        .liveOpera{
          color: #666666;
          font-size: 18px;
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
  .mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .8) 100%);
    z-index: 1;
  }
  .liveListBox {
    margin: auto;
    width: 1020px;
  }
  @media screen and (min-width: 1920px) {
    .liveListBox {
      // padding: 0px 140px;
      margin: auto;
      width: 1374px;
    }
  }
  // @media screen and (min-width: 1920px) {
  //   .liveListBox {
  //     padding: 0px 160px;
  //   }
  // }
</style>

<style lang="css">
  html{
    background: #F7F7F7;
  }
</style>
