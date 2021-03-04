<template>
  <div class="show-special">
    <OldHeader scene="preShow" :isWhiteBg=true v-if="specialInfo && specialInfo.user_id" :user_id="specialInfo.user_id"></OldHeader>
    <div class="special-show-ctx">
      <!-- <pageTitle pageTitle="专题详情"></pageTitle> -->
      <div class="special-info">
        <div class="special-main">
          <div class="special-img">
            <img :src="specialInfo.cover || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`">
          </div>
          <div class="special-detail">
            <h1>{{ specialInfo.title }}</h1>
            <p>{{ (specialInfo && specialInfo.created_at ? specialInfo.created_at : '') | unitTime  }}</p>
            <h2>共<b>{{ specialInfo.webinar_num }}</b>个直播<span v-if="specialInfo.hide_pv"><i style="color:#FB3A32" class="iconfont-v3 saasicon_redu"></i> 热度<b>{{ specialInfo.pv | formatNum}}</b></span><label v-if="specialInfo.hide_appointment"><b>{{ specialInfo.order_num }}</b>次预约</label></h2>
            <div class="shareText">
              <el-popover
                placement="bottom-start"
                trigger="click">
                <div class="shareSubject">
                  <share slot="content" ref="share" :shareVo="shareVo" ></share>
                </div>
                <i class="el-icon-share" slot="reference"><b> 分享</b></i>
              </el-popover>
              <!-- <h3 slot="reference"><i class="el-icon-share"></i>分享</h3> -->
            </div>
          </div>
        </div>
      </div>
      <div class="special-list">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-loadMore="moreLoadData">
          <el-tab-pane label="专题简介" name="first">
            <div class="text" v-html="specialInfo.intro"></div>
          </el-tab-pane>
          <el-tab-pane label="目录列表" name="second">
              <el-row :gutter="40" class="lives">
                  <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(item, index) in liveList" :key="index"  @click.prevent.stop="toDetail(item.webinar_id)">
                    <a class="inner" :href="`${processEnv}/lives/watch/${item.webinar_id}`" target="_blank">
                      <div class="top">
                        <span class="liveTag">{{item | liveTag }}</span>
                        <div class="img-box"><img :src="item.img_url || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`" alt=""></div>
                      </div>
                      <div class="bottom">
                        <div class="">
                          <p  class="liveTitle" :title="item.subject" >{{item.subject}}</p>
                          <p class="liveTime">{{item.start_time}} <span v-if="item.hide_pv"><i class="iconfont-v3 saasicon_redu"></i> {{item.pv | formatNum}}</span></p>
                        </div>
                      </div>
                    </a>
                  </el-col>
              </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- <share slot="content" ref="share" :shareVo="shareVo" ></share> -->
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
import share from './shareShow'
import Env from '@/api/env.js';
export default {
  data() {
    return {
      activeName: 'first',
      specialInfo: {},
      env: Env,
      pageSize: 12,
      pageNum: 1,
      maxPage: 0,
      pagePos: 0,
      totalElement: 0,
      shareVo: {
        url: `${process.env.VUE_APP_WAP_WATCH}/special/detail/?id=${this.$route.query.id}`,
        pcUrl:`${process.env.VUE_APP_WEB_URL}/special/detail/?id=${this.$route.query.id}`
      },
      totalList: [], //总数
      liveList: [],
      processEnv: `${process.env.VUE_APP_WAP_WATCH}`
    };
  },
  components: {
    OldHeader,
    share
  },
  created() {
    this.getSpecialList();
  },
  methods: {
    share() {
      this.$refs.share.dialogVisible = true;
    },
    moreLoadData() {
      if (this.pageNum >= this.maxPage) {
        return false;
      }
      this.pageNum ++;
      this.liveList = this.totalList.slice(0, this.pageSize * this.pageNum)
    },
    getSpecialList() {
      this.$fetch('subjectInfo', {subject_id: this.$route.query.id}).then(res => {
        this.specialInfo = res.data.webinar_subject;
        // this.liveList = res.data.webinar_subject.webinar_list;
        this.totalList = res.data.webinar_subject.webinar_list;
        this.liveList = this.totalList.slice(0, this.pageSize);
        let totalElement = res.data.webinar_subject.webinar_num;
        this.maxPage = Math.ceil(totalElement / this.pageSize);
      }).catch(res => {
        console.log('获取结果失败', res);
      })
    },
    toDetail(id) {
      this.$router.push({path: `/live/detail/${id}`});
    },
    goWatchData(item) {
      let url =  `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`;
      window.open(url, '_blank');
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.pageNum = 1;
      this.liveList = this.totalList.slice(0, this.pageSize * this.pageNum)
    }
  }
};
</script>
<style lang="less">
::v-deep.head-wrap{
  .collapse{
    height: 100%;
    .login-reg{
      height: 100%;
      .head{
        margin-top: -8px;
        border: none;
        vertical-align: middle;
        display: inline-block;
        margin-right: 8px;
      }
      .caret{
        margin-bottom: 4px;
      }
    }
  }
}
.titleBox {
  margin-top: 40px;
}
.special-show-ctx {
  width: 1300px;
  margin: 40px auto 50px auto;
}
.shareSubject{
  padding: 15px 20px 0;
}
.show-special{
  height: 100%;
  /deep/.el-card__body {
    padding: 24px 32px;
  }
  .special-main{
    display: flex;
  }
  .special-img{
    width: 720px;
    height: 400px;
    border-radius: 4px;
    background-color: #1a1a1a;
    img{
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: scale-down;
    }
  }
  .special-detail{
    margin-left: 23px;
    padding-right: 30px;
    width: calc(100% - 722px);
    h1{
      font-size: 20px;
      color: #333333;
      padding-top: 10px;
      margin-bottom: 20px;
      width: 100%;
      line-height: 1.5;
      // max-width: 300px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    p{
      font-size: 16px;
      color: #8c8786;
      margin-bottom: 20px;
    }
    h2{
      font-size: 16px;
      color: #666666;
      margin-bottom: 25px;
      span{
        padding: 0 25px;
      }
      b{
        font-weight: 500;
        color: #ff3333;
        padding: 0 3px;
      }
    }
    .shareText{
      font-size: 12px;
      color: #999999;
      cursor: pointer;
      span{
        color: #1A1A1A;
      }
      i{
        padding-right: 5px;
        font-size: 14px;
      }
      b{
        font-weight: normal;
        color: #999;
      }
    }
  }
  .el-tabs__content{
    min-height: 300px;
    padding: 20px;
    overflow: auto;
    max-height: 500px;
    // 滚动条的宽度
    &::-webkit-scrollbar {
      width: 6px; // 横向滚动条
      height: 6px; // 纵向滚动条 必写
    }
    // 滚动条的滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      transition: all 0.3s;
      cursor: pointer;
      display: none;
      background-color: #cccccc;
      &:hover {
        background-color: #cccccc;
      }
      &:active {
        background-color: #cccccc;
      }
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        display: block;
      }
    }
  }
  .special-info{
    background: #fff;
    border-radius: 4px;
    padding: 24px 32px;
  }
  .special-list{
    margin-top: 20px;
    background: #fff;
    border-radius: 4px;
    padding: 24px 32px;
    // max-height: 500px;
    .text{
      color: #1a1a1a;
      height: calc(100% - 592px);
      word-break: break-all;
      line-height: 1.5;
      strong{
        font-weight: bold;
      }
      p{
        font-style:normal;
      }
    }
    .lives{
      // max-height: 500px;
      .liveItem{
        height: 255px;
        margin-bottom: 24px;
        border-radius: 4px;
        // border: 1px solid #ccc;
        .inner{
          display: inline-block;
          width: 100%;
          transition: all .15s ease-in;
          position: relative;
        }
        .inner:hover{
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.15);
        }
        .top{
          height: 150px;
          /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
          background: #1A1A1A;
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          padding: 10px 10px;
          box-sizing: border-box;
          position: relative;
          border-radius: 4px 4px 0 0;
          .img-box{
            // width: 101%;
            height: 100%;
            position: absolute;
            top:0;
            left: 0;
            overflow: hidden;
            border-radius: 4px 4px 0 0;
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
              cursor: pointer;
              border-radius: 4px 4px 0 0;
            }
          }
          // img{
          //   width: 100%;
          //   height: 100%;
          //   object-fit: scale-down;
          //   position: absolute;
          //   top:0;
          //   left: 0;
          // }
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
          height: 84px;
          background: #f7f7f7;
          box-sizing: border-box;
          padding: 10px 14px;
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
            line-height: 22px;
            -webkit-box-orient: vertical;
          }
          .liveTime{
            font-size: 14px;
            color: #666;
            span{
              float: right;
              margin-top: -3px;
            }
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
            .isDelete{
              float: right;
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
  }
}
</style>
