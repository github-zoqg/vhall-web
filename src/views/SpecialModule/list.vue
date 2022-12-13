<template>
  <div
    class="liveListBox"
    v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)"
    v-show="!loading"
  >
    <pageTitle pageTitle="专题列表">
      <div class="title_text">
        专题功能教您如何玩转不同场景下的多会场直播，
        <span @click="introduceDetail">了解一下</span>
      </div>
    </pageTitle>

    <!-- 操作栏 -->
    <div class="operaBox" v-if="totalElement || isSearch">
      <el-button
        size="medium"
        type="primary"
        round
        @click="$router.push({ path: '/special/edit', query: { title: '创建', refer: 1 } })"
      >
        创建专题
      </el-button>
      <div class="searchBox">
        <el-select v-model="orderBy" placeholder="请选择" @change="changeOrder">
          <el-option
            v-for="item in orderOptions"
            :key="item.value + item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <VhallInput
          class="search-tag"
          placeholder="请输入专题标题"
          @keyup.enter.native="searchHandler"
          @clear="searchHandler"
          clearable
          v-clearEmoij
          v-model="keyWords"
        >
          <i class="el-icon-search el-input__icon" slot="prefix" @click="searchHandler"></i>
        </VhallInput>
      </div>
    </div>
    <!-- 操作栏 -->

    <el-row :gutter="24" class="lives" v-show="totalElement">
      <el-col
        class="liveItem"
        :xs="8"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="6"
        v-for="(item, index) in liveList"
        :key="index"
      >
        <router-link
          :to="{
            path:
              item.is_new_version == 1
                ? `/special/details/${item.id}`
                : `/special/edit/${item.id}?title=编辑`
          }"
          target="_blank"
          class="inner"
        >
          <!-- @click="editSpecialInfo(item.id)" -->
          <div class="top">
            <!-- <span class="liveTag">{{item | liveTag}}</span>-->
            <span class="hot">
              <i class="iconfont-v3 saasicon_redu">{{ item.pv | formatNum }}</i>
            </span>
            <div class="img-box">
              <img :class="`img_box_bg subject_bg_${item.itemMode}`" :src="item.cover" alt="" />
            </div>
          </div>
          <div class="bottom">
            <div class="">
              <p class="liveTitle">{{ item.title }}</p>
              <p class="liveTime">{{ item.created_at | unitTime }}</p>
            </div>
            <p class="liveOpera">
              <el-tooltip
                class="item item_right"
                effect="dark"
                content="编辑"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon-pencil1"
                  @click.prevent.stop="editSpecialInfo(item.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item item_right"
                effect="dark"
                content="预览"
                placement="top"
                v-tooltipMove
              >
                <i class="iconfont-v3 saasicon-eye1" @click.prevent.stop="specialDetail(item)"></i>
              </el-tooltip>
              <el-tooltip
                class="item item_right"
                effect="dark"
                content="分享"
                placement="top"
                v-tooltipMove
              >
                <i class="iconfont-v3 saasicon-share1" @click.prevent.stop="toShare(item.id)"></i>
              </el-tooltip>
              <el-tooltip
                class="item isDelete"
                effect="dark"
                content="删除"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon-trash"
                  @click.prevent.stop="deleteHandle(item.id)"
                ></i>
              </el-tooltip>
            </p>
          </div>
          <transition name="el-zoom-in-bottom">
            <div class="mask" v-show="!!item.liveDropDownVisible"></div>
          </transition>
        </router-link>
      </el-col>
    </el-row>
    <SPagination
      :total="totalElement"
      :page-size="pageSize"
      :current-page="pageNum"
      @current-change="currentChangeHandler"
      align="center"
      v-if="totalElement > pageSize"
    ></SPagination>
    <div class="no-live" v-show="!totalElement">
      <noData :nullType="nullText" :text="text">
        <el-button
          type="primary"
          round
          @click="$router.push({ path: '/special/edit', query: { title: '创建', refer: 1 } })"
          v-if="nullText === 'nullData'"
        >
          创建专题
        </el-button>
      </noData>
    </div>
    <share ref="share" :shareVo="shareVo"></share>
    <el-dialog
      custom-class="dialog-tutorial-wrap"
      class="vh-saas-dialog"
      :visible.sync="tutorialVisible"
      width="740px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <introduce-show></introduce-show>
    </el-dialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import noData from '@/views/PlatformModule/Error/nullPage';
  import Env from '@/api/env.js';
  import share from './components/share';
  import introduceShow from './components/moduleTutorial';
  import { sessionOrLocal, parseImgOssQueryString, cropperImage } from '@/utils/utils';
  export default {
    name: 'specialList',
    data() {
      return {
        hasDelayPermission: 0,
        liveStatus: 0,
        isSearch: false,
        userId: JSON.parse(sessionOrLocal.get('userId')),
        tutorialVisible: false,
        nullText: 'nullData',
        text: '暂未创建专题活动',
        dialogShareVisible: false,
        orderBy: 1,
        keyWords: '',
        pageSize: 12,
        pageNum: 1,
        pos: 0,
        shareVo: {
          url: ''
        },
        totalElement: 0,
        liveDropDownVisible: false,
        orderOptions: [
          { label: '按创建时间排序', value: 1 },
          { label: '按照标题排序', value: 2 }
        ],
        loading: true,
        liveList: [],
        shareUrl: null,
        env: Env
      };
    },
    components: {
      PageTitle,
      share,
      noData,
      introduceShow
    },
    created() {
      this.getLiveList();
      let SAAS_VS_PES = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      let permissions = SAAS_VS_PES ? JSON.parse(SAAS_VS_PES) : null;
      this.hasDelayPermission = permissions ? permissions['no.delay.webinar'] : 0;
    },
    methods: {
      searchHandler() {
        this.pageNum = 1;
        this.pos = 0;
        this.getLiveList();
        console.log('searchHandler');
      },
      changeOrder() {
        this.$vhall_paas_port({
          k: this.orderBy == 1 ? 100491 : 100492,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.searchHandler();
      },
      currentChangeHandler(current) {
        this.pageNum = current;
        this.pos = parseInt((current - 1) * this.pageSize);
        console.log(this.pos, this.pageNum);
        this.getLiveList();
      },
      getLiveList() {
        const data = {
          pos: this.pos,
          limit: this.pageSize,
          title: this.keyWords,
          order_type: this.orderBy
        };
        this.loading = true;
        console.log(data);
        this.$fetch('subjectList', this.$params(data))
          .then(res => {
            res.data.total &&
              res.data.list.map(item => {
                let cover = item.cover
                  ? item.cover
                  : `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`;
                if (cropperImage(cover)) {
                  item.cover = cover;
                  item.itemMode = this.handlerImageInfo(cover);
                } else {
                  item.itemMode = 3;
                }
              });
            this.liveList = res.data.list;
            this.totalElement = res.data.total;
            if (this.orderBy == 1 && !this.keyWords) {
              // 默认状态
              this.nullText = 'nullData';
              this.isSearch = false;
              this.text = '暂未创建专题活动';
            } else {
              // 搜索状态
              this.nullText = 'search';
              this.isSearch = true;
              this.text = '';
            }
          })
          .catch(error => {
            this.$message({
              message: `获取专题列表失败,${error.errmsg || error.message}`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 解析图片地址
      handlerImageInfo(url) {
        let obj = parseImgOssQueryString(url);
        return Number(obj.mode) || 3;
      },
      // 删除
      deleteHandle(id) {
        this.$confirm('您确定要删除选中的专题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.trueDelete(id);
          })
          .catch(() => {
            this.$message({
              message: `已取消删除`,
              showClose: true,
              // duration: 0,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      trueDelete(id) {
        this.$fetch('subjectDel', { subject_ids: id })
          .then(res => {
            if (res && res.code === 200) {
              this.$vhall_paas_port({
                k: 100497,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: '',
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              // 刷新列表
              this.searchHandler();
            }
          })
          .catch(error => {
            this.$message({
              message: `删除失败，${error.message}`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 编辑专题
      editSpecialInfo(id) {
        this.$vhall_paas_port({
          k: 100496,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        const { href } = this.$router.resolve({
          path: `/special/edit/${id}`,
          query: { title: '编辑' }
        });
        window.open(href, '_blank');
      },
      toShare(id) {
        this.$refs.share.dialogVisible = true;
        this.$vhall_paas_port({
          k: 100495,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.shareVo.url = `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${id}`;
        this.shareVo.pcUrl = `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${id}`;
      },
      // 数据页面
      toDataReport(id) {
        const { href } = this.$router.resolve({
          path: `/special/data/${id}`,
          query: { title: '查看数据' }
        });
        window.open(href, '_blank');
      },
      // 预览页面
      specialDetail(item) {
        this.$vhall_paas_port({
          k: 100494,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        // let routeData = this.$router.resolve({ path: '/special/detail', query: {id: item.id, delay: this.hasDelayPermission} });
        // window.open(routeData.href, '_blank');
        window.open(
          `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${item.id}&delay=${this.hasDelayPermission}`,
          '_blank'
        );
      },
      introduceDetail() {
        this.$vhall_paas_port({
          k: 100493,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.tutorialVisible = true;
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
        const liveStatusStr = ['互动', '音频', '视频'];
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
          return `${(val / 1e4).toFixed(1)}万`;
        } else if (val > 1e8) {
          return `${(val / 1e8).toFixed(1)}亿`;
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
  .liveListBox {
    user-select: none;
    // padding: 0px 60px;
    /*  .el-button{
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
    }*/
    /deep/.el-dialog__body {
      padding-bottom: 20px;
    }
    .title_text {
      color: #999;
      font-size: 14px;
      span {
        color: #3562fa;
        cursor: pointer;
      }
    }
    /deep/ .el-dialog__wrapper .dialog-tutorial-wrap {
      padding: 0px 0px 30px;
      background: transparent !important;
      border: none;
      box-shadow: none;
      @media (max-width: 1440px) {
        margin-top: 9vh !important;
      }
      @media (max-width: 1366px) {
        margin-top: 2vh !important;
        margin-bottom: 0;
      }
      .el-dialog__headerbtn {
        top: 24px;
        right: 0;
        margin-bottom: 8px;
        .el-dialog__close {
          color: #ffffff;
        }
      }
      .el-dialog__body {
        padding: 0;
        border-radius: 8px;
      }
    }
    /*  .el-button.is-round{
      padding: 10px 23px;
    }*/
  }
  .pageTitle {
    color: #1a1a1a;
    font-size: 22px;
    font-weight: 600;
  }
  .operaBox {
    overflow: hidden;
    margin-top: 30px;
    margin-bottom: 20px;
    .searchBox {
      float: right;
      .el-select {
        &:nth-child(1) {
          width: 175px;
          margin-right: 20px;
        }
      }
      .el-input {
        width: 220px;
        .el-input__icon {
          cursor: pointer;
        }
        /deep/ .el-input__icon {
          line-height: 36px;
        }
      }
      /deep/ .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
      /deep/.el-input__icon {
        line-height: 35px;
      }
    }
    .search-tag {
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px !important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
  .lives {
    // overflow: hidden;
    // display: flex;
    // justify-content: space-between;
    // flex-flow: wrap;
    // margin-bottom: 20px;
    .liveItem {
      // width: 312px;
      height: 314px;
      margin-bottom: 24px;
      // float: left;
      // margin-right: 40px;
      .inner {
        transition: all 0.15s ease-in;
        position: relative;
        display: inline-block;
        width: 100%;
      }
      .inner:hover {
        border-radius: 4px;
        box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
      }
      .top {
        height: 176.8px;
        background: #1a1a1a;
        // background: linear- (-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        padding: 10px 10px;
        box-sizing: border-box;
        position: relative;
        border-radius: 4px 4px 0 0;
        cursor: pointer;
        .img-box {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 4px 4px 0 0;
          .img_box_bg {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            cursor: pointer;
            border-radius: 4px 4px 0 0;
            &.subject_bg_1 {
              object-fit: fill;
            }
            &.subject_bg_2 {
              object-fit: cover;
              object-position: left top;
            }
          }
        }
        // img{
        //   width: 100%;
        //   height: 100%;
        //   position: absolute;
        //   object-fit: scale-down;
        //   top:0;
        //   left: 0;
        //   border-radius: 4px;
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
          height: 40px;
          width: 100%;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
          /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%); */
          bottom: 0px;
          left: 0px;
          color: #fff;
          font-size: 14px;
          z-index: 2;
          i {
            position: absolute;
            left: 14px;
            bottom: 10px;
          }
        }
      }
      .bottom {
        height: 139px;
        background: #fff;
        box-sizing: border-box;
        padding: 14px 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 0 0 4px 4px;
        .liveTitle {
          color: #1a1a1a;
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
        .liveTime {
          font-size: 14px;
          color: #666;
        }
        .liveOpera {
          color: #666666;
          i {
            cursor: pointer;
            font-size: 18px;
            &.item_right {
              padding: 0 10px;
            }
            &:first-child {
              padding-left: 0;
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
          .item {
            &:hover {
              color: #222;
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
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%);
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
  html {
    background: #f7f7f7;
  }
</style>
