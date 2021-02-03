<template>
  <div class="data-center">
    <div class="main-center">
      <data-usage></data-usage>
      <el-row type="flex" class="row-center" :gutter="16" >
        <el-col :xl="{span: colVal}">
          <router-link :to="{path:'/live/edit'}"  class="center-item">
          <p class="icon"><i class="iconfont-v3 saasicon_chuangjianzhibo"></i></p>
            <!-- <p><icon icon-class="saasicon_chuangjianzhibo-copy"></icon></p> -->
            <h3>创建直播</h3>
          </router-link>
        </el-col>
        <el-col :xl="{span: colVal}">
          <router-link :to="{path:'/material/word'}"  class="center-item">
          <p class="icon"><i class="iconfont-v3 saasicon_shangchuanwendang"></i></p>
            <!-- <p><icon icon-class="saasicon_shangchuanwendang-copy"></icon></p> -->
            <h3>上传文档</h3>
          </router-link>
        </el-col>
        <el-col :xl="{span: colVal}">
          <router-link :to="{path:'/setting/info'}"  class="center-item">
          <p class="icon"><i class="iconfont-v3 saasset"></i></p>
            <!-- <p><icon icon-class="saasicon_pinpaishezhi-copy"></icon></p> -->
            <h3>设置中心</h3>
          </router-link>
        </el-col>
        <el-col :xl="{span: colVal}" v-if="!(childPremission && Number(childPremission.permission_data) === 0)">
          <router-link :to="{path:'/data/info'}"  class="center-item">
          <p class="icon"><i class="iconfont-v3 saasicon_zhanghaoshuju"></i></p>
            <!-- <p><icon icon-class="saasicon_zhanghaoshuju-copy"></icon></p> -->
            <h3>数据中心</h3>
          </router-link>
        </el-col>
        <el-col :xl="{span: colVal}">
          <router-link :to="{path:'/finance/info'}"  class="center-item">
          <p class="icon"><i class="iconfont-v3 saasicon_caiwuzonglan"></i></p>
            <!-- <p><icon icon-class="saasicon_caiwuzonglan-copy"></icon></p> -->
            <h3>财务中心</h3>
          </router-link>
        </el-col>
      </el-row>
      <div class="row-list" v-if="!(childPremission && Number(childPremission.permission_data) === 0)">
        <p class="list-title">数据统计</p>
         <el-tooltip effect="dark" placement="right-start" v-tooltipMove>
            <div slot="content">
            统计近7日数据
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
        <el-row type="flex" class="row-buttom" justify="space-around">
          <el-col :span="6">
            <div class="buttom-item">
              <p>活动总数</p>
              <h2>
                <count-to :startVal="0"
                  :endVal="mainKeyData.webinar_count"
                  :duration="1500"
                  v-if="mainKeyData.webinar_count >= 0">
                </count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看次数</p>
              <h2>
                <count-to :startVal="0"
                  :endVal="mainKeyData.watch_times"
                  :duration="1500"
                  v-if="mainKeyData.watch_times >= 0">
                </count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看人数</p>
              <h2>
                <count-to :startVal="0"
                  :endVal="mainKeyData.watch_number"
                  :duration="1500"
                  v-if="mainKeyData.watch_number >= 0">
                </count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看时长(分)</p>
              <h2>
                <count-to :startVal="0"
                  :endVal="mainKeyData.watch_duration"
                  :duration="1500"
                  v-if="mainKeyData.watch_duration >= 0">
                </count-to>
                </h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="line-updata">
        <div class="line-tip">
          <p>用量统计</p>
          <el-tooltip effect="dark" placement="right-start" v-tooltipMove>
            <div slot="content">
            统计近7日数据
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
        </div>
        <line-echarts :lineDataList="lineDataList" :type="parseInt(versionType)"></line-echarts>
      </div>
    </div>
    <div class="advert-banner">
      <div class="web-download">
        <div class="ad-web">
          <!-- <img src="https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202101/27/f8/27f8fcd59013845ef0c3774e9af93b4f.png?x-oss-process=image/resize,w_225,m_lfit" alt=""> -->
          <img src="../../common/images/account/banner1.png" alt=""/>
          <!-- <h1>微吼直播客户端</h1>
          <p>强大文件的直播工具</p> -->
        </div>
        <div class="ad-text">
          <h1>微吼直播客户端</h1>
          <p>强大稳定的直播工具，支持插播视频、桌面共享等功能。</p>
        </div>
        <a href="https://www.vhall.com/saas/client" class="download-btn" target="_blank">立即下载</a>
      </div>
      <div class="app-download">
        <div class="app-web">
          <div class="img-show"><img src="../../common/images/account/banner2.png" alt=""/></div>
        </div>
        <div class="ad-text">
          <h1>微吼直播APP下载</h1>
          <p>把微吼装进口袋，随时随地发直播，让直播更便捷</p>
        </div>
        <a href="http://e.vhall.com/app" class="download-btn" target="_blank">立即下载</a>
      </div>
      <div class="data-document">
        <h2>文档中心<a href="https://www.vhall.com/saas/doc" target="_blank">更多</a></h2>
        <p><a href="https://www.vhall.com/saas/doc/6.html" target="_blank">API文档</a></p>
        <p><a href="https://www.vhall.com/saas/doc/260.html" target="_blank">JSSDK文档</a></p>
        <p><a href="https://www.vhall.com/saas/doc/262.html" target="_blank">IOS SDK文档</a></p>
        <p><a href="https://www.vhall.com/saas/doc/261.html" target="_blank">Andriod SDK文档</a></p>
      </div>
      <div class="helpMsg" @click="contactUs">
        <i class="el-icon-chat-dot-round"></i>
        <p>联系我们</p>
      </div>
    </div>
  </div>
</template>
<script>
import LineEcharts from '@/components/Echarts/lineEcharts.vue';
import DataUsage from '@/components/DataUsage/index.vue';
import { sessionOrLocal } from '@/utils/utils';
import CountTo from 'vue-count-to';
export default {
  data() {
    return {
      userInfo: {},
      mainKeyData: {},
      lineDataList: [],
      childPremission: {}
    };
  },
  components: {
    LineEcharts,
    DataUsage,
    CountTo
  },
  computed: {
    colVal: function() {
      console.log(this.childPremission && Number(this.childPremission.permission_data) === 0);
      return !(this.childPremission && Number(this.childPremission.permission_data) === 0) ? 5 : 6;
    }
  },
  created() {
    let userInfo = sessionOrLocal.get('userInfo');
    if (userInfo) {
      this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
      if (this.parentId > 0) {
        this.getChildPermission();
      }
    }
    if (document.body.clientWidth < 1366) {
      document.getElementById('app').style.minWidth="auto"
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
    // this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
    this.getLiveList();
  },
  beforeDestroy() {
    document.getElementById('app').style.minWidth="1366px"
  },
  methods: {
    getChildPermission() {
      this.$fetch('getChildPermission').then(res => {
        console.log('getChildPermission', res)
        this.childPremission = res.data;
      }).catch(res => {
        this.childPremission = {};
      })
    },
    // 联系我们
    contactUs() {
      window.open(`http://p.qiao.baidu.com/cps/chat?siteId=113762&userId=2052738`, "_blank");
    },
    getLiveList() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      // parent_id > 0 子账号
      let params = {
        account_id: this.userId,
        type: 1,
        start_time: this.$moment(start).format('YYYY-MM-DD'),
        end_time: this.$moment(end).format('YYYY-MM-DD')
      };
      this.$fetch('getDataCenterInfo', params).then(res =>{
        this.mainKeyData = {...res.data.key_data};
        // this.lineDataList = res.data.trend.live;
      }).catch(e=>{
        console.log(e);
      });
      this.getLineData(params);
    },
    getLineData(obj) {
      let url = this.versionType == '1' ? 'getFlowLineInfo' : 'getTrendLineInfo';
      this.$fetch(url, obj).then(res =>{
        this.lineDataList = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    }
  }
};
</script>
<style lang="less" scoped>
  .data-center{
    margin: auto;
    max-width: 1374px;
    height: 100%;
    // display: flex;
    // overflow: hidden;
    /deep/.el-col-5{
      width: 18.8%;
    }
    .line-updata, .row-list{
      /deep/.iconfont-v3{
        color: #999;
      }
    }

    .main-center{
      float: left;
      // flex: 1;
      width: calc(100% - 256px);
      height: 100%;
      .data-usage {
        padding: 0;
      }
      .row-center{
        margin: 24px 0;
      }
      .center-item{
        display: inline-block;
        width: 100%;
        height: 130px;
        background: #fff;
        border-radius: 4px;
        padding-top: 38px;
        text-align: center;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s ease-in;
        &:hover{
          background: #FFFFFF;
          box-shadow: 0 6px 12px 0 rgba(251, 58, 50, 0.16);
          border-radius: 4px;
          border: 1px solid #FB3A32;
        }
        p{
          width: 30px;
          height: 30px;
          margin: auto;
          // border: 1px solid #ccc;
          /deep/.iconfont-v3{
            font-size: 32px;
            color: #FB3A32;
          }
        }
        h3{
          font-size: 16px;
          color: #1A1A1A;
          line-height: 24px;
          padding-top: 5px;
        }
      }
      .row-list{
        height: 146px;
        background: #fff;
        border-radius: 4px;
        .list-title{
          font-family: @fontRegular;
          font-size: 16px;
          font-weight: 400;
          color: #1A1A1A;
          padding: 24px 0 0 32px;
          display: inline-block;
        }
        i{
            font-size: 14px;
            padding: 0 2px;
          }
        .row-buttom{
          margin-bottom: 24px;
          .buttom-item{
           p{
              font-size: 14px;
              color: #999;
              padding: 17px 0 4px 40px;
            }
            h2{
              color: #1A1A1A;
              line-height: 30px;
              margin: auto;
              padding-left: 40px;
              span{
                color: #1A1A1A;
                font-weight: bold;
                font-size: 28px;
              }
            }
          }
        }
      }
      .line-updata{
        height: calc(100% - 488px);
        margin-top: 24px;
        background: #fff;
        padding-bottom: 10px;
        border-radius: 4px;
        .line-tip{
          padding: 24px 0 0 32px;
          font-size: 16px;
          color: #1A1A1A;
          p{
            display: inline-block;
          }
          i{
            font-size: 14px;
            padding: 0 2px;
          }
        }
      }
    }
    .advert-banner{
      float: left;
      width: 224px;
      height: 100%;
      margin-left: 32px;
      .download-btn{
        // outline: none;
        width: 110px;
        height: 36px;
        border-radius: 18px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 36px;
        background: #fff;
        font-size: 14px;
        color: #1a1a1a;
        position: absolute;
        left: 53px;
        bottom: 24px;
        cursor: pointer;
        &:hover{
          color: #FB3A32;
          border: 1px solid #FB3A32;
        }
      }
      .web-download{
        height: 279px;
        background: #fff;
        border-radius: 4px;
        position: relative;
        width: 100%;
        .ad-web{
          height: 126px;
          height: 126px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 4px 4px 0 0;
          }
         /*  img{
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          } */
          // background: linear-gradient(224deg, #FD2349 0%, #FF6321 100%);
          // border-radius: 4px;
          // color: #fff;
          // padding: 32px 17px;
          // font-family: @fontRegular;
          // h1{
          //   font-size: 18px;
          //   line-height: 25px;
          //   font-weight: 600px;
          // }
          // p{
          //   font-size: 12px;
          //   line-height: 15px;
          //   font-weight: 400px;
          // }
        }
      }
      .ad-text{
          padding: 8px 17px;
           h1{
            font-size: 16px;
            line-height: 25px;
            font-weight: 600px;
            color: #1A1A1A;
          }
          p{
            font-size: 14px;
            line-height: 20px;
            font-weight: 400px;
            color: #666;
          }
      }
      .app-download{
        height: 279px;
        background: #fff;
        margin:16px 0;
        border-radius: 4px;
        position: relative;
        .app-web{
          font-size: 0;
          border-radius: 4px;
          .img-show {
            width: 225px;
            height: 126px;
            img {
              width: 100%;
              height: 100%;
              /* object-fit: cover; */
              image-rendering: -moz-crisp-edges; /* Firefox */
              image-rendering: -o-crisp-edges; /* Opera */
              image-rendering: -webkit-optimize-contrast; /*Webkit (non-standard naming) */
              image-rendering: crisp-edges;
              -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
            }
          }
          img{
            border-radius: 4px 4px 0 0;
          }
          /* img{
            width: 100%;
            height: 100%;
            border-radius: 4px;
            object-fit: scale-down;
          } */
        }
      }
      .data-document{
        background: #fff;
        // height: calc(100% - 590px);
        height: 270px;
        border-radius: 4px;
        h2{
          font-size: 16px;
          color: #1A1A1A;
          padding: 12px 0 14px 14px;
          a{
            float: right;
            font-size: 14px;
            color: #666;
            margin-right: 14px;
            &:hover{
              color: #FB3A32;
            }
          }
        }
        p{
          font-size: 14px;
          color: #666;
          padding: 0 0 11px 14px;
          a{
             color: #666;
            &:hover{
              color: #FB3A32;
            }
          }
        }
      }
    }
    .helpMsg {
      position: fixed;
      right: 0;
      bottom: 60px;
      width: 30px;
      background: #999;
      color: #fff;
      padding: 12px 7px;
      cursor: pointer;
      border-radius: 4px;
      i{
        color: #fff;
        font-size: 20px;
      }
      p{
        font-size: 14px;
        text-align: center;
      }
    }
  }
</style>
