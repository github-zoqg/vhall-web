<!-- 此页面已废弃 -->
<template>
  <div v-loading='loading' element-loading-background="#1a1a1a" element-loading-text="加载中..." v-if="!loading"
    style="height:100%">
    <div class="error-special" v-if="isErrorPage">
      <div class="error__img">
        <img src="../../../common/images/subject_null.png" alt="">
        <p>此专题已下线</p>
      </div>
    </div>
    <div class="show-special" v-else>
      <el-scrollbar style="height:100%" v-loadMore="moreLoadData">
        <OldHeader scene="preShow" :isWhiteBg=true v-if="specialInfo && specialInfo.user_id"
          :user_id="specialInfo.user_id" :gray_id="gray_id" :isSpecial=true :specialInfo="specialInfo" @share="share">
        </OldHeader>
        <div class="special-show-ctx">
          <div class="special-info">
            <div class="special-main">
              <div class="special-imgTitle">
                <div class="special-img">
                  <img :src="specialInfo.cover || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`">
                </div>
                <div class="special-title">
                  <p><i class="iconfont-v3 saasguankanrenshu_icon"></i> {{ specialInfo.webinar_num }}</p>
                  <p v-if="specialInfo.hide_pv"><i class="iconfont-v3 saasredu_icon"></i>
                    {{ specialInfo.pv || 0 | formatNum }}</p>
                  <p v-if="specialInfo.hide_appointment"><i class="iconfont-v3 saasyuyuerenshu_icon"></i>
                    {{ specialInfo.order_num }}</p>
                </div>
              </div>
              <div class="special-detail">
                <vue-scroll>
                  <div class="text" v-html="specialInfo.intro"></div>
                </vue-scroll>
              </div>
            </div>
          </div>
          <div class="special-list">
            <el-row :gutter="24" class="lives">
              <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(item, index) in liveList"
                :key="index" @click.prevent.stop="toDetail(item.webinar_id)">
                <a class="inner" :href="`${VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`" target="_blank">
                  <div class="top">
                    <span class="hot" v-if="item.hide_pv">
                      <i class="iconfont-v3 saasicon_redu"> {{item.pv | formatNum}}</i>
                    </span>
                    <span class="liveTag">{{ item | actionTag }}<span
                        v-if="item.webinar_type != 6 && hasDelayPermission && item.no_delay_webinar == 1"> |
                        无延迟</span></span>
                    <div class="img-box"><img
                        :src="item.img_url || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`" alt=""></div>
                  </div>
                  <div class="bottom">
                    <div class="">
                      <p class="liveTitle" :title="item.subject">{{item.subject}}</p>
                      <p class="liveTime">{{item.start_time}}</p>
                    </div>
                  </div>
                </a>
              </el-col>
            </el-row>
            <div v-loading='moreLoading' v-if="moreLoading" class="spectial-title" element-loading-background="#1a1a1a"
              element-loading-text="加载中...">
            </div>
            <div v-if="isNullText" class="spectial-title">
              已经到底啦～
            </div>
          </div>
        </div>
      </el-scrollbar>
      <share ref="share" :shareVo="shareVo"></share>
    </div>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
import share from './share'
import Env from '@/api/env.js';
// import { sessionOrLocal } from '@/utils/utils';

export default {
  name: 'specialPreview',
  data() {
    return {
      activeName: 'first',
      specialInfo: {},
      isErrorPage: false,
      env: Env,
      pageSize: 20,
      pageNum: 1,
      maxPage: 0,
      pagePos: 0,
      loading: true,
      totalElement: 0,
      moreLoading: false,
      isNullText: false,
      VUE_APP_WAP_WATCH: process.env.VUE_APP_WAP_WATCH,
      shareVo: {
        url: `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.query.id}`,
        pcUrl: `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.query.id}`
        // pcUrl:`${process.env.VUE_APP_WEB_URL}/special/detail?id=${this.$route.query.id}`
      },
      totalList: [], //总数
      liveList: [],
      hasDelayPermission: false,
      gray_id: null
    };
  },
  components: {
    OldHeader,
    share
  },
  async created() {
    await this.initGrayBefore()
    this.getSpecialList();
  },
  mounted() {
    this.hasDelayPermission = this.$route.query.delay == 1
    document.getElementById('app').style.minWidth = 'auto'
  },
  beforeDestroy() {
    document.getElementById('app').style.minWidth = '1366px'
  },
  methods: {
    initGrayBefore() {
      return this.$fetch('initSubjectGrayBefore', {
        subject_id: this.$route.query.id
      })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.gray_id = res.data.user_id
          } else {
            console.log(`灰度ID-获取专题by用户信息失败~${res.msg}`)
            this.gray_id = null
          }
        })
        .catch((e) => {
          console.log(`灰度ID-获取专题by用户信息失败~${e}`)
          this.gray_id = null
        })
    },
    share() {
      this.$refs.share.dialogVisible = true;
    },
    moreLoadData() {
      if (this.isNullText) return
      this.moreLoading = true
      setTimeout(() => {
        this.moreLoading = false
        if (this.pageNum >= this.maxPage) {
          this.isNullText = true
          return false;
        }
        this.pageNum++;
        this.liveList = this.totalList.slice(0, this.pageSize * this.pageNum)
      }, 1000)
    },
    getSpecialList() {
      this.$fetch('subjectInfo', { subject_id: this.$route.query.id }, {
        'gray-id': this.gray_id
      }).then(res => {
        if (res.code === 200 && res.data) {
          this.isErrorPage = false
          this.specialInfo = res.data.webinar_subject;
          this.specialInfo.intro = this.urlToLink(this.specialInfo.intro);
          this.loading = false;
          // this.liveList = res.data.webinar_subject.webinar_list;
          this.totalList = res.data.webinar_subject.webinar_list;
          this.liveList = this.totalList.slice(0, this.pageSize);
          let totalElement = res.data.webinar_subject.webinar_num;
          this.maxPage = Math.ceil(totalElement / this.pageSize);

          // 修改页面title为专题名称
          document.title = this.specialInfo.title;
        } else {
          this.isErrorPage = false
          this.isErrorPage = true
        }

      }).catch(res => {
        this.loading = false;
        this.isErrorPage = true
        console.log('获取结果失败', res);
      })
    },
    urlToLink(str) {
      if (!str) return ''

      // 提取聊天内容中的 img 标签
      const regImg = /<img.*?(?:>|\/>)/g
      const imgArr = str.match(regImg)

      // 提取聊天内容中除去 img 标签以外的部分
      const strArr = str.split(regImg)
      const regUrl = /(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g

      // 将聊天内容中除去 img 标签以外的聊天内容中的链接用 a 标签包裹
      strArr.forEach((item, index) => {
        const tempStr = item.replace(regUrl, function(match) {
          return `<a class='show-link' href='${match}' target='_blank'>${match}</a>`
        })
        strArr[index] = tempStr
      })

      // // 遍历 img 标签数组，将聊天内容中的 img 标签插回原来的位置
      if (imgArr) {
        const imgArrLength = imgArr.length
        let imgIndex = 0
        for (let strIndex = 0; strIndex < imgArrLength; ++strIndex) {
          strArr.splice(strIndex + imgIndex + 1, 0, imgArr[imgIndex])
          imgIndex++
        }
      }
      console.log(strArr.join(''), '???123232432')
      return strArr.join('')
    },
    toDetail(id) {
      this.$router.push({ path: `/live/detail/${id}` });
    },
    toPageHandle(item) {
      if (item.player == 1) {
        let href = `${process.env.VUE_APP_OLD_WATCH}${item.webinar_id}`
        return href;
      } else {
        return `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`;
      }
    },
    goWatchData(item) {
      let url = `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${item.webinar_id}`;
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
.el-tooltip__popper {
  max-width: 390px;
  // line-height: 17px;
}
</style>
<style lang="less">
::v-deep.head-wrap {
  .collapse {
    height: 100%;
    .login-reg {
      height: 100%;
      .head {
        margin-top: -8px;
        border: none;
        vertical-align: middle;
        display: inline-block;
        margin-right: 8px;
      }
      .caret {
        margin-bottom: 4px;
      }
    }
  }
}
.titleBox {
  margin-top: 40px;
}
.special-show-ctx {
  width: 1204px;
  margin: 0 auto 0;
}
.special-main {
  height: 520px;
}
.special-imgTitle {
  width: 820px;
}
.special-img {
  width: 100%;
  height: 460px;
}
@media (min-width: 1920px) {
  .special-show-ctx {
    width: 1510px;
    margin: 0 auto;
  }
  .special-main {
    height: 690px;
  }
  .special-imgTitle {
    width: 1126px;
  }
  .special-img {
    width: 100%;
    height: 632px;
  }
  .el-col-xl-6 {
    width: 20%;
  }
}
// @media (min-width: 1366px) {
//  .special-show-ctx {
//     width: calc(100% - 166px);
//     margin: 40px auto 50px auto;
//   }
// }
// @media (min-width: 1440px) {
//  .special-show-ctx {
//     width: calc(100% - 240px);
//     margin: 40px auto 50px auto;
//   }
// }
@media (min-width: 1600px) {
  .special-show-ctx {
    width: 1510px;
    margin: 0 auto;
  }
  .special-main {
    height: 690px;
  }
  .special-imgTitle {
    width: 1126px;
  }
  .special-img {
    width: 100%;
    height: 632px;
  }
  .el-col-xl-6 {
    width: 20%;
  }
}
.shareSubject {
  padding: 15px 20px 0;
}
.error-special {
  width: 100%;
  height: 100vh;
  background: #fff;
  .error__img {
    width: 202px;
    height: 90px;
    margin: 0 auto;
    text-align: center;
    padding-top: 162px;
    img {
      width: 100%;
    }
    p {
      text-align: center;
      font-size: 16px;
      color: #1a1a1a;
      line-height: 22px;
      padding-top: 12px;
      padding-left: 20px;
    }
  }
}
.show-special {
  height: 97%;
  width: 100%;
  overflow-y: scroll;
  position: absolute;
  margin-bottom: 20px;
  .special-main {
    display: flex;
    margin-top: 20px;
    // height: 516px;
  }
  .special-imgTitle {
    width: calc(100% - 384px);
  }
  .special-img {
    // width: 100%;
    // height: 460px;
    border-radius: 4px;
    background-color: #1a1a1a;
    flex: 1;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px 4px 0 0;
      object-fit: cover;
    }
  }
  .special-title {
    display: flex;
    padding: 19px 24px;
    background: #fff;
    border-radius: 0 0 4px 4px;
    p {
      padding-right: 18px;
      color: #666;
      font-size: 14px;
      .iconfont-v3 {
        font-size: 18px;
        vertical-align: text-bottom;
      }
    }
  }
  .special-detail {
    margin-left: 20px;
    background: #fff;
    border-radius: 4px;
    width: 360px;
    height: 100%;
    padding: 8px 0;
    // overflow-y: scroll;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
    .text {
      color: #1a1a1a;
      height: calc(100% - 592px);
      word-break: break-all;
      line-height: 1.5;
      padding: 0 24px;
      strong {
        font-weight: bold;
      }
      p {
        font-style: normal;
        padding: 5px 0;
        font-size: 14px;
        img {
          margin: 5px 0;
        }
      }
      .show-link {
        color: #3562fa;
      }
    }
  }
  .special-info {
    background: #f7f7f7;
    border-radius: 4px;
    // border: 1px solid #ccc;
  }
  .special-list {
    margin-top: 24px;
    background: #f7f7f7;
    border-radius: 4px;
    height: 100%;
    .lives {
      .liveItem {
        margin-bottom: 24px;
        border-radius: 4px;
        // padding-left: 12px !important;
        // padding-right: 0px !important;
        .inner {
          display: inline-block;
          width: 100%;
          transition: all 0.15s ease-in;
          position: relative;
        }
        .inner:hover {
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.15);
        }
        .top {
          height: 150.4px;
          /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
          background: #1a1a1a;
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          padding: 10px 10px;
          box-sizing: border-box;
          position: relative;
          border-radius: 4px 4px 0 0;
          .img-box {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
            border-radius: 4px 4px 0 0;
            img {
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
          .liveTag {
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-size: 12px;
            padding: 2px 9px;
            border-radius: 20px;
            position: relative;
            z-index: 2;
          }
          .hot {
            position: absolute;
            bottom: 0;
            left: 0;
            color: #fff;
            font-size: 14px;
            z-index: 2;
            height: 40px;
            width: 100%;
            background: linear-gradient(
              180deg,
              transparent,
              rgba(0, 0, 0, 0.6)
            );
            i {
              position: absolute;
              left: 14px;
              bottom: 10px;
              font-size: 14px;
            }
          }
        }
        .bottom {
          height: 84px;
          background: #fff;
          box-sizing: border-box;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .liveTitle {
            color: #1a1a1a;
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
          .liveTime {
            font-size: 14px;
            color: #666;
            span {
              float: right;
              margin-top: -3px;
            }
          }
          .liveOpera {
            color: #666666;
            font-size: 18px;
            a {
              color: rgb(44, 43, 43);
              &.btn-css {
                color: #666666;
                &:nth-child(2) {
                  margin: 0 20px;
                }
              }
            }
            i {
              cursor: pointer;
              &:nth-child(2) {
                margin: 0 20px;
              }
            }
            .el-dropdown {
              float: right;
              &.active {
                z-index: 2;
                color: #fff;
              }
            }
            .isDelete {
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
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.8) 100%
      );
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
  .spectial-title {
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
/deep/.el-loading-spinner .path {
  stroke: #fb3a32;
}
</style>
<style lang="less" scoped>
/deep/.el-scrollbar__thumb {
  background-color: transparent;
}
</style>
