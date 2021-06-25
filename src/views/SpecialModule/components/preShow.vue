<template>
  <div class="show-special">
    <OldHeader scene="preShow" :isWhiteBg=true v-if="specialInfo && specialInfo.user_id" :user_id="specialInfo.user_id" :isSpecial=true :specialInfo="specialInfo" @share="share"></OldHeader>
    <div class="special-show-ctx">
      <div class="special-info">
        <div class="special-main">
          <div class="special-imgTitle">
            <div class="special-img">
              <img :src="specialInfo.cover || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`">
            </div>
            <div class="special-title">
              <p><i class="iconfont-v3 saasicon_kaibo"></i> {{ specialInfo.webinar_num }}</p>
              <p v-if="specialInfo.hide_pv"><i class="iconfont-v3 saasicon_redu"></i> {{ specialInfo.pv | formatNum }}</p>
              <p v-if="specialInfo.hide_appointment"><i class="iconfont-v3 saasicon-share1"></i> {{ specialInfo.order_num }}</p>
            </div>
          </div>
          <div class="special-detail">
            <vhscroll>
              <div class="text" v-html="specialInfo.intro"></div>
            </vhscroll>
          </div>
        </div>
      </div>
      <div class="special-list">
        <!-- <div class="lives">
          <div class="liveItem" v-for="(item, index) in liveList" :key="index"  @click.prevent.stop="toDetail(item.webinar_id)">
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
          </div>
        </div> -->
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
      </div>
    </div>
    <share ref="share" :shareVo="shareVo" ></share>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
import share from './share'
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
      processEnv: process.env.VUE_APP_WEB_URL,
      shareVo: {
        url: `${process.env.VUE_APP_WAP_WATCH}/special/detail/${this.$route.query.id}`,
        pcUrl:`${process.env.VUE_APP_WEB_URL}/special/detail/?id=${this.$route.query.id}`
      },
      totalList: [], //总数
      liveList: []
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
    toPageHandle(item) {
      if(item.player == 1) {
        let href = `${process.env.VUE_APP_OLD_WATCH}${item.webinar_id}`
        return href;
      } else {
        return `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`;
      }
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
@media (min-width: 1920px) {
 .special-show-ctx {
    width: calc(100% - 414px);
    margin: 40px auto 50px auto;
  }
  .el-col-xl-6{
    width: 20%;
  }
}
@media (min-width: 1366px) {
 .special-show-ctx {
    width: calc(100% - 166px);
    margin: 40px auto 50px auto;
  }
}
@media (min-width: 1440px) {
 .special-show-ctx {
    width: calc(100% - 240px);
    margin: 40px auto 50px auto;
  }
}
@media (min-width: 1600px) {
 .special-show-ctx {
    width: calc(100% - 400px);
    margin: 40px auto 50px auto;
  }
}
.shareSubject{
  padding: 15px 20px 0;
}
.show-special{
  height: 100%;
  .special-main{
    display: flex;
    height: 516px;
  }
  .special-imgTitle{
    width: calc(100% - 380px);
  }
  .special-img{
    width: 100%;
    height: 460px;
    border-radius: 4px;
    background-color: #1a1a1a;
    flex: 1;
    img{
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: scale-down;
    }
  }
  .special-title{
    display: flex;
    padding: 20px 24px;
    background: #fff;
    border-radius: 0 0 4px 4px;
    p{
      padding-right: 18px;
      color: #666;
      .iconfont-v3{
        font-size: 16px;
      }
    }
  }
  .special-detail{
    margin-left: 20px;
    padding: 24px;
    background: #fff;
    border-radius: 4px;
    width: 360px;
    height: 100%;
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

  }
  .special-info{
    background:  #F7F7F7;
    border-radius: 4px;
  }
  .special-list{
    margin-top: 24px;
    background: #F7F7F7;
    border-radius: 4px;
    .lives{
      // max-height: 500px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      .liveItem{
        margin-bottom: 24px;
        border-radius: 4px;
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
          height: 150.4px;
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
          background: #fff;
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
    // .liveListBox {
    //   margin: auto;
    //   width: 1020px;
    // }
    // @media screen and (min-width: 1920px) {
    //   .liveListBox {
    //     // padding: 0px 140px;
    //     margin: auto;
    //     width: 1374px;
    //   }
    // }
  }
}
</style>
