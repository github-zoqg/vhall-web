<template>
  <div class="data-center">
    <div class="main-center">
      <data-usage></data-usage>
      <el-row type="flex" class="row-center" justify="space-between">
        <el-col :span="5">
          <div class="center-item" @click="toCreateLive">
            <p><icon icon-class="saasicon_chuangjianzhibo-copy"></icon></p>
            <h3>创建直播</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item" @click="toUploadWord">
            <p><icon icon-class="saasicon_shangchuanwendang-copy"></icon></p>
            <h3>上传文档</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item" @click="toBrandSet">
            <p><icon icon-class="saasicon_pinpaishezhi-copy"></icon></p>
            <h3>设置中心</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item" @click="toDataInfo">
            <p><icon icon-class="saasicon_zhanghaoshuju-copy"></icon></p>
            <h3>账号数据</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item" @click="toFinanceInfo">
            <p><icon icon-class="saasicon_caiwuzonglan-copy"></icon></p>
            <h3>财务总览</h3>
          </div>
        </el-col>
      </el-row>
      <div class="row-list">
        <p class="list-title">数据统计</p>
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
        </div>
        <line-echarts :lineDataList="lineDataList"></line-echarts>
      </div>
    </div>
    <div class="advert-banner">
      <div class="web-download">
        <div class="ad-web">
          <h1>微吼直播客户端</h1>
          <p>强大文件的直播工具</p>
        </div>
        <div class="ad-text">
          <h1>微吼直播客户端</h1>
          <p>强大稳定的直播工具，支持插播 视频、桌面</p>
        </div>
        <a href="https://www.vhall.com/saas/client" class="download-btn" target="_blank">立即下载</a>
      </div>
      <div class="app-download">
        <div class="app-web">
          <img src="../../common/images/v35-webinar.png" alt="">
        </div>
        <div class="ad-text">
          <h1>微吼直播APP下载</h1>
          <p>强大稳定的直播工具，支持插播 视频、桌面共享等功能</p>
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
      lineDataList: []
    };
  },
  components: {
    LineEcharts,
    DataUsage,
    CountTo
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    // this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
    this.getLiveList();
  },
  methods: {
    // 页面跳转
     toCreateLive(){
      this.$router.push({path: `/live/edit`});
    },
    // 上传文档
    toUploadWord(){
      this.$router.push({path: `/material/word`});
    },
    // 设置中心
    toBrandSet(){
      this.$router.push({path: `/setting/info`});
    },
    // 数据中心-数据总览
    toDataInfo(){
      this.$router.push({path: `/data/info`});
    },
    // 财务中心-财务总览
    toFinanceInfo(){
      this.$router.push({path: `/finance/info`});
    },
    // 联系我们
    contactUs() {
      window.open(`http://p.qiao.baidu.com/cps/chat?siteId=113762&userId=${this.userId}`, "_blank");
    },
    getLiveList() {
      // parent_id > 0 子账号
      let params = {
        account_id: this.userId,
        type: 1
      };
      this.$fetch('getDataCenterInfo', params).then(res =>{
        this.mainKeyData = {...res.data.key_data};
        this.lineDataList = res.data.trend.live;
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
    display: flex;
    overflow: hidden;
    /deep/.el-col-5{
      width: 18.8%;
    }
    .main-center{
      flex: 1;
      height: 100%;
      .row-center{
        margin: 24px 0;
      }
      .center-item{
        height: 130px;
        background: #fff;
        border-radius: 4px;
        padding-top: 38px;
        text-align: center;
        cursor: pointer;
        border: 2px solid transparent;
        &:hover{
          border: 2px solid #FB3A32;
        }
        p{
          width: 30px;
          height: 30px;
          margin: auto;
          // border: 1px solid #ccc;
          /deep/.svg-icon{
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
        .list-title{
          font-family: PingFangSC-Regular, PingFang SC;
          font-size: 16px;
          font-weight: 400;
          color: #1A1A1A;
          padding: 24px 0 0 32px;
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
        .line-tip{
          padding: 24px 0 0 32px;
          font-size: 16px;
          color: #1A1A1A;
        }
      }
    }
    .advert-banner{
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
        .ad-web{
          height: 126px;
          background: linear-gradient(224deg, #FD2349 0%, #FF6321 100%);
          border-radius: 4px;
          color: #fff;
          padding: 32px 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          h1{
            font-size: 18px;
            line-height: 25px;
            font-weight: 600px;
          }
          p{
            font-size: 12px;
            line-height: 15px;
            font-weight: 400px;
          }
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
        height: 278px;
        background: #fff;
        margin:16px 0;
        border-radius: 4px;
        position: relative;
        .app-web{
          font-size: 0;
          img{
            width: 100%;
            height: 126px;
          }
        }
      }
      .data-document{
        background: #fff;
        height: 236px;
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
      background: #FB3A32;
      color: #fff;
      padding: 12px 7px;
      cursor: pointer;
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
