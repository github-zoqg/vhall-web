<template>
  <div class="liveListBox" v-loading="loading" element-loading-text="加载中，请稍候" element-loading-background="rgba(255,255,255,.9)" v-if="!loading">
    <pageTitle pageTitle="直播列表">
      <div slot="content">
        1.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
        <br/>
        2.控制台数据为真实数据，不统计虚拟数据
      </div>
    </pageTitle>
    <!-- 操作栏 -->
      <div class="operaBox" v-if="totalElement || isSearch">
        <el-button type="primary" round @click="createLiveAction('1')" v-preventReClick size="medium" class="length104">创建直播</el-button>
        <el-button size="medium"  round @click="createLiveAction('2')" v-if="vodPerssion == 1" class="transparent-btn" v-preventReClick>创建点播</el-button>
        <!--  v-if="vodPerssion == 1"  -->
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
          <VhallInput
            class="search-tag"
            placeholder="搜索直播标题"
            v-model="keyWords"
            clearable
            v-clearEmoij
            @change="searchHandler"
            @keyup.enter.native="searchHandler">
            <i
              class="el-icon-search el-input__icon"
              slot="prefix"
              @click="searchHandler">
            </i>
          </VhallInput>
        </div>
      </div>
    <!-- 操作栏 -->
    <div v-if="totalElement">
      <el-row :gutter="40" class="lives">
          <el-col class="liveItem" :xs="8" :sm="8" :md="8" :lg="8" :xl="6" v-for="(item, index) in liveList" :key="index">
            <!-- :xs="24" :sm="12" :md="12" :lg="8" :xl="6" -->
            <div @click="toLiveDetail(item.webinar_id)" class="inner">
              <!--  @click.prevent.stop="toDetail(item.webinar_id)" -->
              <div class="top">
                <span class="liveTag"><label class="live-status" v-if="item.webinar_state == 1">
                  <img src="../../common/images/live.gif" alt=""></label>{{item | liveTag}}</span>
                <span class="hot">
                  <i class="iconfont-v3 saasicon_redu"> {{item.pv | formatNum}}</i>
                </span>
                <div class="img-box">
                  <img :src="`${item.img_url}`" alt="">
                </div>
                <!-- <div class=""></div> -->
              </div>
              <div class="bottom">
                <div class="live-title">
                  <p class="liveTitle">{{item.subject}}</p>
                  <p class="liveTime">{{item.start_time}}</p>
                </div>
                <p class="liveOpera" @click.stop="nullFunc">
                  <el-tooltip class="item" effect="dark" content="开播" placement="top" v-if="item.webinar_state!=4" v-tooltipMove>
                    <i class="iconfont-v3 saasicon_kaibo" @click.prevent.stop="goLivePlay(item)"></i>
                    <!-- <router-link :to="`chooseWay/${item.webinar_id}/1`" target="_blank"><i class="el-icon-video-camera"></i></router-link> -->
                  </el-tooltip>
                  <el-tooltip v-tooltipMove class="item" effect="dark" content="回放" placement="top" v-if="!(childPremission && Number(childPremission.permission_content) === 0)">
                  <i class="iconfont-v3 saasicon_huifang" @click.prevent.stop="goPlayback(item)"></i>
                  </el-tooltip>
                  <el-tooltip v-tooltipMove class="item" effect="dark" content="详情" placement="top">
                    <i class="iconfont-v3 saasicon_xiangqing" @click.prevent.stop="toDetail(item.webinar_id)"></i>
                  </el-tooltip>
                  <span @click.prevent.stop>
                    <el-dropdown :class="{active: !!item.liveDropDownVisible}" trigger="click" placement="top-end" @visible-change="dropDownVisibleChange(item)" @command="commandMethod">
                      <i class="iconfont-v3 saasicon_more2"></i>
                      <el-dropdown-menu style="width: 98px; padding: 4px 0" slot="dropdown">
                        <el-dropdown-item command='/live/reportsData' v-if="!(childPremission && Number(childPremission.permission_data) === 0)">数据报告</el-dropdown-item>
                        <el-dropdown-item command='/live/interactionData' v-if="!(childPremission && Number(childPremission.permission_data) === 0)">互动统计</el-dropdown-item>
                        <el-dropdown-item command='/live/userData' v-if="!(childPremission && Number(childPremission.permission_data) === 0)">用户统计</el-dropdown-item>
                        <el-dropdown-item command='/live/edit' v-if="item.webinar_state!=4">复制</el-dropdown-item>
                        <el-dropdown-item command='删除'>删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
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
        <el-button type="primary" v-if="nullText == 'nullData'" round @click="createLiveAction('1')" v-preventReClick  class="length152">创建直播</el-button>
        <el-button round v-if="nullText == 'nullData' && vodPerssion == 1" class="transparent-btn length152"  @click="createLiveAction('2')" v-preventReClick >创建点播</el-button>
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
      isAnginOpen: false,
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
  computed: {
    childPremission: function(){
      return sessionOrLocal.get('SAAS_V3_SON_PS') ? JSON.parse(sessionOrLocal.get('SAAS_V3_SON_PS')) : {};
    }
  },
  components: {
    PageTitle,
    noData
  },
  created() {
    // 创建点播是否可用(全局)
    this.vodPerssion = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['ui.upload_video_as_demand'];
    this.getLiveList();
  },
  methods: {
    toLiveDetail(webinar_id) {
      const routeData = this.$router.resolve({path: `/live/detail/${webinar_id}`});
      window.open(routeData.href, '_blank');
    },
    nullFunc() {
      return false;
    },
    searchHandler() {
      this.pageNum = 1;
      this.pagePos = 0;
      this.getLiveList();
    },
    dropDownVisibleChange(item) {
      this.$set(item, 'liveDropDownVisible', !item.liveDropDownVisible);
      this.webinarInfo = item;
    },
    commandMethod(command) {
      if (command === '删除') {
        if (this.webinarInfo.webinar_state == 1) {
          this.$message({
            message: "正在直播的活动不能删除",
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.$confirm('删除直播后，直播也将从所属的专题中删除，确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
         this.deleteLive();
        }).catch(() => {
          this.$message({
            message:  `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
      } else if (command === '/live/edit') {
        this.$confirm('支持复制活动下设置的功能，不支持复制回放视频、统计的数据', '复制活动', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          const { href } = this.$router.resolve({path: command, query: {id: this.webinarInfo.webinar_id, type: 3 }});
          window.open(href, '_blank');
        }).catch(() => {});
      } else {
        // 新标签页打开
        // this.$router.push({path: `${command}/${this.webinarInfo.webinar_id}`, query: {roomId: this.webinarInfo.vss_room_id, status: this.webinarInfo.webinar_state }});
        const { href } = this.$router.resolve({path: `${command}/${this.webinarInfo.webinar_id}`, query: {roomId: this.webinarInfo.vss_room_id, status: this.webinarInfo.webinar_state }});
        window.open(href, '_blank');
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
      }).catch(res =>{
        this.$message({
          message: res.msg || "获取直播列表失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        console.log(res);
      }).finally(()=>{
        this.loading = false;
      });
    },
    deleteLive() {
      this.$fetch('liveDel', {webinar_ids: this.webinarInfo.webinar_id}).then(res => {
        this.$message({
          message: `删除成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getLiveList();
      }).catch(res => {
        this.$message({
          message: res.msg || `删除失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    getAppersInfo(item) {
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      this.$fetch('getVersionInfo', { user_id: userId}).then(res => {
        if (res.data.arrears.total_fee < 0) {
          this.$confirm(`尊敬的微吼会员，您的${res.data.type == 1 ? '流量' : '并发套餐'}已用尽，请充值`, '提示', {
            confirmButtonText: '去充值',
            cancelButtonText: '知道了',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel',
          }).then(() => {
            this.$router.push({path:'/finance/info'});
          }).catch(() => {});
        } else {
          if (item.webinar_state == 1) {
            this.getOpenLive(item);
          } else {
            this.goIsLive(item)
          }
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    goLivePlay(item) {
      //判断是否可以开播
      this.getAppersInfo(item);
      // if (status) {
      //   this.$confirm('尊敬的微吼会员，您的流量已用尽，请充值', '提示', {
      //     confirmButtonText: '去充值',
      //     cancelButtonText: '知道了',
      //     customClass: 'zdy-message-box',
      //     lockScroll: false,
      //     cancelButtonClass: 'zdy-confirm-cancel',
      //   }).then(() => {
      //     this.$router.push({path:'/finance/info'});
      //   }).catch(() => {});
      // } else {
      //   if (item.webinar_state == 1) {
      //     this.getOpenLive(item);
      //   } else {
      //     this.goIsLive(item)
      //   }
      // }
    },
    goPlayback(item) {
      const { href } = this.$router.resolve({path: item.webinar_state == 4 ? `/live/recordplayback/${item.webinar_id}` : `/live/playback/${item.webinar_id}`});
      window.open(href, '_blank');
    },
    goIsLive(item) {
      if (item.webinar_type != 1) {
        const { href } = this.$router.resolve({path: `/live/chooseWay/${item.webinar_id}/1?type=ctrl`});
        window.open(href, '_blank');
      } else {
        let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${item.webinar_id}`;
        window.open(href, '_blank');
      }
    },
    // 判断是否有起直播的权限
    getOpenLive(item) {
      this.$fetch('checkLive', this.$params({
        webinar_id: item.webinar_id
      })).then((res) => {
        if(res.code == 200) {
          this.goIsLive(item);
        } else {
          // 不能发起
          this.$message({
            message: "该活动正在直播或录播中，无法重复发起",
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
      }).catch(e => {
        this.$message({
          message: "该活动正在直播或录播中，无法重复发起",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      });
    },
    // 创建活动
    createLiveAction(index){
      let userPhone = JSON.parse(sessionOrLocal.get('userInfo')).phone;
      if (!userPhone) {
        this.$alert('您还没有绑定手机，为了保证您的权益，请绑定后再发起直播！', '提示', {
          confirmButtonText: '立即绑定',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel',
          callback: action => {
            if (action === 'confirm') {
              this.$router.push({path:'/acc/info', query: {tab: 1}});
            }
          }
        });
      } else {
        index === '1' ? this.$router.push({path:'/live/edit'}) : this.$router.push({path:'/live/vodEdit'});
      }
    },
    toDetail(id, state) {
      const { href } = this.$router.resolve({path: `/live/detail/${id}`});
      window.open(href, '_blank');
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
    // user-select: none;
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
    .no-live /deep/.el-button{
      padding: 9px 24px;
    }
    // /deep/.el-dropdown-menu__item:not(.is-disabled):hover{
    //   background-color: #FB3A32;
    //   color: #FB3A32;
    // }
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
        /deep/.el-input__icon{
          line-height: 30px;
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
        // user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
    }
    /deep/.is_medium.el-button.el-button--medium{
      background: transparent;
      &:hover{
        color: #fb3a32;
      }
    }
    .el-select /deep/.el-input__inner{
      padding: 0 12px;
    }
    .search-tag {
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 50px!important;
      }
      /deep/ .el-input__suffix {
        cursor: pointer;
        /deep/ .el-input__icon {
          width: auto;
          margin-right: 5px;
          line-height: 38px;
        }
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
      margin-bottom: 24px;
      // float: left;
      // margin-right: 40px;
      .inner{
        transition: all .15s ease-in;
        position: relative;
        border-radius: 4px;
        display: inline-block;
        width: 100%;
        cursor: pointer;
      }
      .inner:hover{
        box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
        border-radius: 4px;
      }
      .top{
        height: 176.35px;
        // background: linear-gradient(-45deg, #797776, #b1adae, #e5e7e7, #f6fcfa);
        background: #1A1A1A;
        // background-size: 100% 100%;
        // animation: gradientBG 15s ease infinite;
        padding: 10px 10px;
        box-sizing: border-box;
        position: relative;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        // img{
        //   width: 100%;
        //   height: 100%;
        //   object-fit: scale-down;
        //   cursor: pointer;
        //   border-radius: 4px 8px 0 0;
        // }
        .img-box{
          width: 100%;
          height: 100%;
          position: absolute;
          top:0;
          left: 0;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
            object-fit: scale-down;
            cursor: pointer;
            font-size: 0;
            // border-radius: 4px 8px 0 0;
          }
        }

        .liveTag{
          background: rgba(0,0,0, .7);
          color: #fff;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 20px;
          position: relative;
          z-index: 2;
        }
        .live-status{
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 6px 0 2px;
          img{
            // margin:6px 7px;
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
        .hot{
          position: absolute;
          height: 50px;
          width: 100%;
          /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%); */
          background: linear-gradient(180deg, transparent, rgba(0, 0,0, 0.2));
          bottom: 0px;
          left: 0px;
          color: #fff;
          font-size: 14px;
          z-index: 2;
          cursor: pointer;
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
        border-radius: 0 0 4px 4px;
        .liveTitle{
          color: #1A1A1A;
          font-size: 16px;
          margin-bottom: 8px;
          line-height: 24px;
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
          cursor: default;
          a{
            color: rgb(44, 43, 43);
          }
          i{
            cursor: pointer;
            &:nth-child(2){
              margin: 0 20px;
            }
          }
          /deep/.iconfont-v3{
            font-size: 18px;
          }
          .el-dropdown{
            float: right;
            &.active{
              z-index: 2;
              // color: #fff;
            }
          }
          .item{
            &:hover{
              color: #222;
            }
          }
          .el-dropdown :hover{
            color: #222;
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
