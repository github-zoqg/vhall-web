<template>
  <div class="liveListBox" v-loading="loading" element-loading-text="数据获取中" v-if="!loading">
    <pageTitle title="直播列表">
      <div slot="content">
        1.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
        <br/>
        2.控制台数据为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <!-- 操作栏 -->
      <div class="operaBox" v-if="totalElement || isSearch">
        <el-button type="primary" round @click="createLiveAction('1')" v-preventReClick size="medium" class="length104">创建直播</el-button>
        <el-button size="medium" round @click="createLiveAction('2')" v-preventReClick>创建点播</el-button>
        <div class="searchBox search-tag-box">
          <el-select v-model="liveStatus" placeholder="全部" @change="searchHandler">
            <el-option
              v-for="item in statusOptions"
              :key="item.value+item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="orderBy" placeholder="请选择" @change="searchHandler">
            <el-option
              v-for="item in orderOptions"
              :key="item.value+item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            class="search-tag"
            placeholder="搜索直播标题"
            v-model="keyWords"
            clearable
            @change="searchHandler"
            @keyup.enter.native="searchHandler">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="searchHandler">
            </i>
          </el-input>
        </div>
      </div>
    <!-- 操作栏 -->
    <div v-if="totalElement">
      <el-row :gutter="40" class="lives">
          <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in liveList" :key="index">
            <div class="inner">
              <div class="top"  @click.prevent.stop="toDetail(item.webinar_id)">
                <span class="liveTag"><label class="live-status" v-if="item.webinar_state == 1">
                  <img src="../../common/images/live.gif" alt=""></label>{{item | liveTag}}</span>
                <span class="hot">
                  <i class="iconfont-v3 saasicon_redu"> {{item.pv | unitCovert}}</i>
                </span>
                <img :src="`${item.img_url}`" alt="">
                <!-- <div class=""></div> -->
              </div>
              <div class="bottom">
                <div class="">
                  <p class="liveTitle" :title="item.subject">{{item.subject}}</p>
                  <p class="liveTime">{{item.start_time}}</p>
                </div>
                <p class="liveOpera">
                  <el-tooltip class="item" effect="dark" content="开播" placement="top" v-if="item.webinar_state!=4">
                    <i class="el-icon-video-camera" @click.prevent.stop="goLivePlay(item)"></i>
                    <!-- <router-link :to="`chooseWay/${item.webinar_id}/1`" target="_blank"><i class="el-icon-video-camera"></i></router-link> -->
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="回放" placement="top">
                  <i class="el-icon-s-promotion" @click="$router.push({path: item.webinar_state == 4 ? `/live/recordplayback/${item.webinar_id}` : `/live/playback/${item.webinar_id}`})"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="详情" placement="top">
                    <i class="el-icon-document" @click.prevent.stop="toDetail(item.webinar_id)"></i>
                  </el-tooltip>
                  <el-dropdown :class="{active: !!item.liveDropDownVisible}" trigger="click" placement="top-end" @visible-change="dropDownVisibleChange(item)" @command="commandMethod">
                    <i class="el-icon-more"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='/live/reportsData'>数据报告</el-dropdown-item>
                      <el-dropdown-item command='/live/interactionData'>互动统计</el-dropdown-item>
                      <el-dropdown-item command='/live/userData'>用户统计</el-dropdown-item>
                      <el-dropdown-item command='/live/edit' v-if="item.webinar_state!=4">复制</el-dropdown-item>
                      <el-dropdown-item command='删除'>删除</el-dropdown-item>
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
      <SPagination :total="totalElement" :page-size='pageSize' :current-page='pageNum' @current-change="currentChangeHandler" align="center" v-if="totalElement > pageSize"></SPagination>
    </div>
    <div class="no-live" v-else>
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" v-if="nullText == 'nullData'" round @click="createLiveAction('1')" v-preventReClick size="medium" class="length104">创建直播</el-button>
        <el-button round v-if="nullText == 'nullData'"  @click="createLiveAction('2')" v-preventReClick size="medium">创建点播</el-button>
      </noData>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Env from '@/api/env.js';
import noData from '@/views/PlatformModule/Error/nullPage';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data() {
    return {
      liveStatus: 0,
      nullText: 'nullData',
      orderBy: 1,
      isSearch: false, //是否是搜索
      text: '您还没有直播，快来创建吧！',
      keyWords: '',
      imgBaseUrl: Env.staticLinkVo.uploadBaseUrl,
      pageSize: 12,
      pageNum: 1,
      pagePos: 0,
      webinarInfo: {},
      totalElement: 0,
      liveDropDownVisible: false,
      statusOptions: [
        { label: '全部', value: 0 },
        { label: '预告', value: 2 },
        { label: '直播', value: 1 },
        { label: '结束', value: 3 },
        { label: '点播', value: 4 },
        { label: '回放', value: 5 }
      ],
      orderOptions: [
        { label: '按创建时间排序', value: 1 },
        { label: '按最后直播时间排序', value: 2 }
      ],
      loading: true,
      liveList: [],
    };
  },
  components: {
    PageTitle,
    noData
  },
  created() {
    this.getLiveList();
  },
  methods: {
    searchHandler() {
      this.pageNum = 1;
      this.getLiveList();
      console.log('searchHandler');
    },
    dropDownVisibleChange(item) {
      this.$set(item, 'liveDropDownVisible', !item.liveDropDownVisible);
      this.webinarInfo = item;
    },
    commandMethod(command) {
      if (command === '删除') {
        if (this.webinarInfo.webinar_state == 1) {
          this.$message.error('正在直播的活动不能删除');
          return;
        }
        this.$confirm('删除直播后，直播也将从所属的专题中删除，确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
           customClass: 'zdy-message-box'
        }).then(() => {
         this.deleteLive();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (command === '/live/edit') {
        this.$router.push({path: command, query: {id: this.webinarInfo.webinar_id, type: 3 }});
      } else {
        this.$router.push({path: `${command}/${this.webinarInfo.webinar_id}`, query: {roomId: this.webinarInfo.vss_room_id, status: this.webinarInfo.webinar_state }});
      }
    },
    currentChangeHandler(current) {
      this.pageNum = current;
      this.pagePos = parseInt((current - 1) * this.pageSize);
      this.getLiveList();
    },
    getLiveList(){
      let data = {
        pos: this.pagePos,
        limit: this.pageSize,
        order_type: this.orderBy,
        title: this.keyWords,
        webinar_state: this.liveStatus
      };
      this.loading = true;
      this.$fetch('liveList', this.$params(data)).then(res=>{
        this.liveList = res.data.list;
        this.totalElement = res.data.total;
        if (!this.liveStatus && this.orderBy == 1 && !this.keyWords) {
          // 默认状态
          this.nullText = 'nullData';
          this.text = '您还没有直播，快来创建吧！';
          this.isSearch = false;
        } else {
          // 搜索状态
          this.nullText = 'search';
          this.text = '';
          this.isSearch = true;
        }
      }).catch(error=>{
        this.$message.error(`获取直播列表失败,${error.msg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    deleteLive() {
      this.$fetch('liveDel', {webinar_ids: this.webinarInfo.webinar_id}).then(res => {
        this.$message.success('删除成功');
        this.getLiveList();
      });
    },
    goLivePlay(item) {
      if (item.webinar_type != 1) {
        this.$router.push({path: `/live/chooseWay/${item.webinar_id}/1?type=ctrl`});
      } else {
        this.$router.push({path: `/live/chooseWay/${item.webinar_id}/1?type=ctrl`});
      }

    },
    // 创建活动
    createLiveAction(index){
      let userPhone = JSON.parse(sessionOrLocal.get('userInfo')).phone;
      if (!userPhone) {
        this.$alert('您还没有绑定手机，为了保证您的权益，请绑定后再发起直播！', '提示', {
          confirmButtonText: '立即绑定',
          customClass: 'zdy-alert-box',
          type: 'warning',
          center: true,
          callback: action => {
            if (action === 'confirm') {
              this.$router.push({path:'/account/info'});
            }
          }
        });
      } else {
        index === '1' ? this.$router.push({path:'/live/edit'}) : this.$router.push({path:'/live/vodEdit'});
      }
    },
    toDetail(id) {
      this.$router.push({path: `/live/detail/${id}`});
    },
    toRoom(id){
      const { href } = this.$router.resolve({path: `/lives/room/${id}`});
      window.open(href);
    }
  },
};
</script>

<style lang="less" scoped>
  .liveListBox{
    user-select: none;
    // padding: 0px 60px;
    // .el-button{
    //   color:#FB3A32;
    //   border-color:#FB3A32;
    //   &:hover{
    //     background: #fc615b;
    //   }
    // }
    // .el-button--primary{
    //   background:#FB3A32;
    //   border-color:#FB3A32;
    //   color: #fff;
    //   &:hover{
    //     background: #fc615b;
    //   }
    // }
    /deep/.el-button{
      padding: 4px 24px;
    }
    /deep/.el-dropdown-menu__item:not(.is-disabled):hover{
      background-color: #FB3A32;
      color: #FB3A32;
    }
    /*.el-button.is-round{
      padding: 10px 23px;
    }*/
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
          width: 175px;
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
        box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
      }
      .top{
        cursor: pointer;
        height: 175px;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        padding: 10px 10px;
        box-sizing: border-box;
        position: relative;
        border-radius: 4px;
        img{
          width: 100%;
          height: 100%;
          position: absolute;
          border-radius: 4px;
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
          height: 50px;
          width: 100%;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
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
  // .mask{
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background: linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .8) 100%);
  //   z-index: 1;
  // }
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
