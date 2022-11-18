<template>
  <div class="data-center">
    <div class="main-center">
      <data-usage></data-usage>
      <el-row type="flex" class="row-center" :gutter="16">
        <el-col :xl="{ span: colVal }">
          <router-link :to="{ path: '/live/edit', query: { refer: 1 } }" class="center-item">
            <p class="icon"><i class="iconfont-v3 saasicon_chuangjianzhibo"></i></p>
            <!-- <p><icon icon-class="saasicon_chuangjianzhibo-copy"></icon></p> -->
            <h3>创建直播</h3>
          </router-link>
        </el-col>
        <el-col :xl="{ span: colVal }">
          <div @click="reportData(0)">
            <router-link :to="{ path: '/material/word' }" class="center-item">
              <p class="icon"><i class="iconfont-v3 saasicon_shangchuanwendang"></i></p>
              <!-- <p><icon icon-class="saasicon_shangchuanwendang-copy"></icon></p> -->
              <h3>上传文档</h3>
            </router-link>
          </div>
        </el-col>
        <el-col :xl="{ span: colVal }">
          <div @click="reportData(1)">
            <router-link :to="{ path: '/setting/chat' }" class="center-item">
              <p class="icon"><i class="iconfont-v3 saasset"></i></p>
              <!-- <p><icon icon-class="saasicon_pinpaishezhi-copy"></icon></p> -->
              <h3>设置中心</h3>
            </router-link>
          </div>
        </el-col>
        <el-col
          :xl="{ span: colVal }"
          v-if="!(childPremission && Number(childPremission.permission_data) === 0)"
        >
          <div @click="reportData(2)">
            <router-link :to="{ path: '/data/info' }" class="center-item">
              <p class="icon"><i class="iconfont-v3 saasicon_zhanghaoshuju"></i></p>
              <!-- <p><icon icon-class="saasicon_zhanghaoshuju-copy"></icon></p> -->
              <h3>数据中心</h3>
            </router-link>
          </div>
        </el-col>
        <el-col :xl="{ span: colVal }">
          <div @click="reportData(3)">
            <router-link :to="{ path: '/finance/info' }" class="center-item">
              <p class="icon"><i class="iconfont-v3 saasicon_caiwuzonglan"></i></p>
              <!-- <p><icon icon-class="saasicon_caiwuzonglan-copy"></icon></p> -->
              <h3>财务中心</h3>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <div
        class="row-list"
        v-if="!(childPremission && Number(childPremission.permission_data) === 0)"
      >
        <p class="list-title">数据统计</p>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content">统计近7日数据，删除活动不影响已统计的历史数据</div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
        <el-row type="flex" class="row-buttom" justify="space-around">
          <el-col :span="6">
            <div class="buttom-item">
              <p>活动总数</p>
              <h2 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="mainKeyData.webinar_count"
                  :duration="1500"
                  v-if="mainKeyData.webinar_count >= 0"
                ></count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看次数</p>
              <h2 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="mainKeyData.watch_times"
                  :duration="1500"
                  v-if="mainKeyData.watch_times >= 0"
                ></count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看人数</p>
              <h2 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="mainKeyData.watch_number"
                  :duration="1500"
                  v-if="mainKeyData.watch_number >= 0"
                ></count-to>
              </h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看时长(分)</p>
              <h2 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="mainKeyData.watch_duration"
                  :duration="1500"
                  v-if="mainKeyData.watch_duration >= 0"
                ></count-to>
              </h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="line-updata">
        <div class="line-tip">
          <p>用量统计</p>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">统计近7日数据，删除活动不影响已统计的历史数据</div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
        </div>
        <line-echarts :lineDataList="lineDataList" :type="parseInt(versionType)"></line-echarts>
      </div>
    </div>
    <div class="advert-banner">
      <!-- 广告位 -->
      <div
        class="banner-download"
        v-if="imageBanner && imageBanner.content && imageBanner.is_valid == 1"
      >
        <div
          :class="['ad-web', { 'is-cursor': imageBanner && imageBanner.link }]"
          @click="onOpenLink"
        >
          <el-image
            :src="`${imageBanner.content}?x-oss-process=image/resize,w_224,h_126,m_lfit`"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
      <div class="web-download">
        <div class="ad-web">
          <!-- <img src="https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202101/27/f8/27f8fcd59013845ef0c3774e9af93b4f.png?x-oss-process=image/resize,w_225,m_lfit" alt=""> -->
          <img src="../../common/images/account/banner1.png" alt="" />
          <!-- <h1>微吼直播客户端</h1>
          <p>强大文件的直播工具</p> -->
        </div>
        <div class="ad-text">
          <h1>微吼直播客户端</h1>
          <p>强大稳定的直播工具，支持插播视频、桌面共享等功能。</p>
        </div>
        <a
          href="https://www.vhall.com/saas/client"
          class="download-btn"
          target="_blank"
          @click="download('pc')"
        >
          立即下载
        </a>
      </div>
      <div class="app-download">
        <div class="app-web">
          <div class="img-show"><img src="../../common/images/account/banner2.png" alt="" /></div>
        </div>
        <div class="ad-text">
          <h1>微吼直播APP下载</h1>
          <p>把微吼装进口袋，随时随地发直播，让直播更便捷</p>
        </div>
        <a
          href="http://e.vhall.com/app"
          class="download-btn"
          target="_blank"
          @click="download('app')"
        >
          立即下载
        </a>
      </div>
      <div
        :class="[
          'data-document',
          {
            'is-show-banner': imageBanner && imageBanner.content && imageBanner.is_valid == 1
          }
        ]"
      >
        <h2>
          文档中心
          <a
            href="https://saas-doc.vhall.com/opendocs/home"
            target="_blank"
            @click="documentCenter(0)"
          >
            更多
          </a>
        </h2>
        <p>
          <a
            href="https://saas-doc.vhall.com/opendocs/show/1140"
            target="_blank"
            @click="documentCenter(1)"
          >
            API文档
          </a>
        </p>
        <p>
          <a
            href="https://saas-doc.vhall.com/opendocs/show/895"
            target="_blank"
            @click="documentCenter(2)"
          >
            JSSDK文档
          </a>
        </p>
        <p>
          <a
            href="https://saas-doc.vhall.com/opendocs/show/1184"
            target="_blank"
            @click="documentCenter(3)"
          >
            点播SDK文档
          </a>
        </p>
        <p>
          <a
            href="https://saas-doc.vhall.com/opendocs/show/1268"
            target="_blank"
            @click="documentCenter(4)"
          >
            IOS SDK文档
          </a>
        </p>
        <p>
          <a
            href="https://saas-doc.vhall.com/opendocs/show/1223"
            target="_blank"
            @click="documentCenter(5)"
          >
            Andriod SDK文档
          </a>
        </p>
      </div>
      <div class="helpMsg" @click="contactUs">
        <i class="el-icon-chat-dot-round"></i>
        <p>联系我们</p>
      </div>
    </div>
    <!--新版本无延迟上线了-->
    <template>
      <!-- <div class="prompt" v-if="!openSys && isOld" > -->
      <div class="prompt" v-if="!openSys && showDelay">
        <div class="prompt-wrap delay">
          <!-- <i class="prompt-con-img i-close saasclose iconfont-v3" @click="iKonw"></i> -->
          <i class="prompt-con-img i-close saasclose iconfont-v3" @click="closeOpenDelay"></i>
          <img
            class="prompt-con-img"
            src="//cnstatic01.e.vhall.com/static/images/watch/notice_img.png"
            alt=""
          />
          <p class="prompt-con-text prompt-con-text-one">新版本上线了</p>
          <p class="prompt-con-text prompt-con-text-three">尊敬的用户：</p>
          <p class="prompt-con-text no-bottom">
            观看有延迟？互动不同步？从现在开始这些统统不存在！马上创建无延迟
          </p>
          <p class="prompt-con-text no-bottom">直播，体验面对面的畅快沟通吧！</p>
          <p class="prompt-con-text no-bottom">
            无延迟直播为收费功能，请联系您的专属售后或拨打400-888-9970转2
          </p>
          <p class="prompt-con-text no-bottom">咨询。</p>
          <!-- <a class="prompt-con-text-four" href="javascript:;" @click="iKonw">我知道了</a> -->
          <a class="prompt-con-text-four" href="javascript:;" @click="closeOpenDelay">我知道了</a>
        </div>
      </div>
    </template>
    <!-- 用户迁移升级完成 - 此弹窗出现，新版本体验弹窗不展示-->
    <template v-if="openSys">
      <div class="prompt">
        <div class="prompt-wrap mini">
          <i class="prompt-con-img i-close saasclose iconfont-v3" @click="closeOpenSys"></i>
          <img
            class="prompt-con-img"
            src="//cnstatic01.e.vhall.com/static/images/watch/notice_img.png"
            alt=""
          />
          <p class="prompt-con-text prompt-con-text-one">【系统升级完成】</p>
          <p class="prompt-con-text prompt-con-text-three">尊敬的用户：</p>
          <p class="prompt-con-text prompt-con-text-two no-bottom">
            感谢您对微吼直播的支持，系统升级已完成！在这里，你可以体验全新产品，满足多场景直播所需功能。
          </p>
          <p class="prompt-con-text prompt-con-text-two no-bottom">
            每一次的改动，都是为了让你用得更爽，马上来体验吧！
          </p>
          <p class="prompt-con-text prompt-con-text-two">
            如有问题请联系您的专属售后或拨打400-888-9970转2咨询
          </p>
          <a class="prompt-con-text-four" href="javascript:;" @click="closeOpenSys">我知道了</a>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import LineEcharts from '@/components/Echarts/lineEcharts.vue';
  import DataUsage from '@/components/DataUsage/index.vue';
  import { sessionOrLocal, getQueryString } from '@/utils/utils';
  import CountTo from 'vue-count-to';
  export default {
    data() {
      return {
        userInfo: {},
        mainKeyData: {},
        versionType: 0,
        lineDataList: [],
        childPremission: {},
        isOld: false,
        openSys: false,
        showDelay: false,
        imageBanner: null
      };
    },
    components: {
      LineEcharts,
      DataUsage,
      CountTo
    },
    computed: {
      colVal: function () {
        console.log(this.childPremission && Number(this.childPremission.permission_data) === 0);
        return !(this.childPremission && Number(this.childPremission.permission_data) === 0)
          ? 5
          : 6;
      }
    },
    beforeCreate() {
      if (location.search.includes('form') && getQueryString('form') == 1) {
        localStorage.setItem('isOld', true);
      } else {
        localStorage.setItem('isOld', false);
      }
      // sessionOrLocal.get('openSys') || false // 用户迁移完成弹窗状态
    },
    created() {
      // 图片广告
      this.$EventBus.$on('saas_vs_image_banner', data => {
        this.imageBanner = data;
      });
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      if (this.userId) {
        window.sessionStorage.setItem('userId', this.userId);
      }
      this.getUserMigrate();
      try {
        let newUserId = JSON.parse(sessionStorage.getItem('userInfo')).user_id;
        if (
          localStorage.getItem(
            `new_${newUserId}_${new Date().toLocaleDateString('en-US').replace(/\//g, '_')}`
          )
        ) {
          this.isOld = false;
        } else {
          if (localStorage.getItem('isOld') && localStorage.getItem('isOld') == 'true') {
            this.isOld = true;
          }
        }
      } catch (error) {
        console.log(error);
      }

      let userInfo = sessionOrLocal.get('userInfo');
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      if (userInfo) {
        this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
        if (this.parentId > 0) {
          this.getChildPermission();
        }
      }
      if (document.body.clientWidth < 1366) {
        document.getElementById('app').style.minWidth = 'auto';
      }
      this.getVersion();
    },
    mounted() {
      // this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
      // this.$nextTick(() => {
      //   if (sessionOrLocal.get("versionType")) {
      //     this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
      //   }
      // })
      // const delayVersionInfo = {
      //   hasClose: false,
      //   endTime: 123123123123
      // }
      const now = new Date().getTime();
      const start_time = new Date('September 2, 2021 00:00:01').getTime();
      const today = new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      ).getTime();
      if (now - start_time > 7 * 24 * 60 * 60 * 1000) return;

      let delayVersionInfo = sessionOrLocal.get('delayVersionInfo');
      if (delayVersionInfo) {
        const info = JSON.parse(delayVersionInfo);
        if (now < info.endTime) {
          // 当天
          if (info.hasClose) {
            // 当天不在展示
            this.showDelay = false;
          } else {
            // 展示
            this.showDelay = true;
          }
        } else {
          this.showDelay = true;
          // 第二天 重置关闭状态
          sessionOrLocal.set(
            'delayVersionInfo',
            JSON.stringify({
              hasClose: false,
              endTime: today
            })
          );
        }
      } else {
        this.showDelay = true;
        // 第二天 重置关闭状态
        sessionOrLocal.set(
          'delayVersionInfo',
          JSON.stringify({
            hasClose: false,
            endTime: today
          })
        );
      }
    },
    beforeDestroy() {
      document.getElementById('app').style.minWidth = '1366px';
    },
    methods: {
      iKonw() {
        this.isOld = false;
        let newUserId = JSON.parse(sessionStorage.getItem('userInfo')).user_id;
        localStorage.setItem(
          `new_${newUserId}_${new Date().toLocaleDateString('en-US').replace(/\//g, '_')}`,
          true
        );
      },
      closeOpenSys() {
        this.openSys = false;
        sessionOrLocal.set('openSys', JSON.stringify(false));
      },
      closeOpenDelay() {
        const today = new Date(
          new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        ).getTime();
        sessionOrLocal.set(
          'delayVersionInfo',
          JSON.stringify({
            hasClose: true,
            endTime: today
          })
        );
        this.showDelay = false;
      },
      getChildPermission() {
        this.$fetch('getChildPermission')
          .then(res => {
            console.log('getChildPermission', res);
            this.childPremission = res.data;
          })
          .catch(res => {
            this.childPremission = {};
          });
      },
      getVersion() {
        this.$fetch('getVersionInfo', { user_id: this.userId })
          .then(res => {
            this.versionType = res.data.type;
            this.getLiveList();
            sessionOrLocal.set('versionType', JSON.stringify(res.data.type));
            sessionOrLocal.set('versionText', JSON.stringify(res.data.edition));
            sessionOrLocal.set('arrears', JSON.stringify(res.data.arrears));
          })
          .catch(e => {
            console.log(e);
          });
      },
      download(type) {
        this.$vhall_paas_port({
          k: type === 'pc' ? 100005 : 100006,
          data: {
            business_uid: this.userId,
            user_id: this.userId,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      // 文档中心
      documentCenter(type) {
        let arrType = [100007, 100008, 100009, 100010, 100011, 100012];
        let refer = type > 0 ? '' : 1;
        this.$vhall_paas_port({
          k: arrType[type],
          data: {
            business_uid: this.userId,
            user_id: this.userId,
            s: '',
            refer: refer,
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      reportData(type) {
        let arrType = [100013, 100014, 100015, 100016];
        this.$vhall_paas_port({
          k: arrType[type],
          data: {
            business_uid: this.userId,
            user_id: this.userId,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      getUserMigrate() {
        this.$fetch('userMigrate', {})
          .then(res => {
            if (res.code == 200 && res.data.end_time) {
              // 若已经点过关闭，当前不展示
              if (
                sessionOrLocal.get('openSys') &&
                JSON.parse(sessionOrLocal.get('openSys')) == false
              ) {
                this.openSys = false;
              } else {
                let nowTime = JSON.parse(sessionOrLocal.get('currentDate'));
                this.openSys = dayjs(nowTime).diff(dayjs(res.data.end_time), 'day') <= 3;
              }
            } else {
              this.openSys = false;
            }
          })
          .catch(e => {
            console.log(e);
            this.openSys = false;
          });
      },
      // 联系我们
      contactUs() {
        this.$vhall_paas_port({
          k: 100017,
          data: {
            business_uid: this.userId,
            user_id: this.userId,
            s: '',
            refer: 1,
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        window.open(`https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038`, '_blank');
      },
      getLiveList() {
        // 初始化设置日期为最近一周
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        // let parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
        // parent_id > 0 子账号
        let params = {
          // account_id: this.userId,
          // user_id: parentId == 0 ? '' : this.userId,
          type: 1,
          start_time: dayjs(start).format('YYYY-MM-DD'),
          end_time: dayjs(end).format('YYYY-MM-DD')
        };
        this.$fetch('getDataCenterInfo', this.$params(params))
          .then(res => {
            this.mainKeyData = { ...res.data.key_data };
            // this.lineDataList = res.data.trend.live;
          })
          .catch(e => {
            console.log(e);
          });
        this.getLineData(this.$params(params));
      },
      getLineData(obj) {
        let url =
          this.versionType == '1'
            ? 'getFlowLineInfo'
            : this.versionType == '2'
            ? 'getTimeLineInfo'
            : 'getTrendLineInfo';
        this.$fetch(url, obj)
          .then(res => {
            this.lineDataList = res.data.list;
          })
          .catch(e => {
            console.log(e);
          });
      },
      onOpenLink() {
        if (this.imageBanner.link) {
          window.open(this.imageBanner.link, '_blank');
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  a:-webkit-any-link {
    color: #3562fa;
  }
  .data-center {
    margin: auto;
    max-width: 1374px;
    height: 100%;
    // display: flex;
    // overflow: hidden;
    /deep/.el-col-5 {
      width: 18.8%;
    }
    .line-updata,
    .row-list {
      /deep/.iconfont-v3 {
        color: #999;
      }
    }

    .main-center {
      float: left;
      // flex: 1;
      width: calc(100% - 256px);
      height: 100%;
      .data-usage {
        padding: 0;
      }
      .row-center {
        margin: 24px 0;
      }
      .center-item {
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
        &:hover {
          background: #ffffff;
          // box-shadow: 0 6px 12px 0 rgba(251, 58, 50, 0.16);
          border-radius: 4px;
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
          border: 1px solid #fb3a32;
        }
        p {
          width: 30px;
          height: 30px;
          margin: auto;
          // border: 1px solid #ccc;
          /deep/.iconfont-v3 {
            font-size: 32px;
            color: #fb3a32;
          }
        }
        h3 {
          font-size: 16px;
          color: #1a1a1a;
          line-height: 24px;
          padding-top: 5px;
        }
      }
      .row-list {
        height: 146px;
        background: #fff;
        border-radius: 4px;
        .list-title {
          font-family: @fontRegular;
          font-size: 16px;
          font-weight: 400;
          color: #1a1a1a;
          padding: 24px 0 0 32px;
          display: inline-block;
        }
        i {
          font-size: 14px;
          padding: 0 2px;
        }
        .row-buttom {
          margin-bottom: 24px;
          .buttom-item {
            p {
              font-size: 14px;
              color: #999;
              padding: 17px 0 4px 40px;
            }
            h2 {
              color: #1a1a1a;
              line-height: 30px;
              margin: auto;
              padding-left: 40px;
              span {
                color: #1a1a1a;
                font-weight: bold;
                font-size: 28px;
              }
            }
          }
        }
      }
      .line-updata {
        height: calc(100% - 488px);
        margin-top: 24px;
        background: #fff;
        padding-bottom: 10px;
        border-radius: 4px;
        .line-tip {
          padding: 24px 0 0 32px;
          font-size: 16px;
          color: #1a1a1a;
          p {
            display: inline-block;
          }
          i {
            font-size: 14px;
            padding: 0 2px;
          }
        }
      }
    }
    .advert-banner {
      float: left;
      width: 224px;
      height: 100%;
      margin-left: 32px;
      .download-btn {
        // outline: none;
        width: 110px;
        // height: 36px;
        border-radius: 18px;
        border: 1px solid #ccc;
        text-align: center;
        padding: 10px 0;
        // line-height: 36px;
        background: #fff;
        font-size: 14px;
        color: #1a1a1a;
        position: absolute;
        left: 53px;
        bottom: 24px;
        cursor: pointer;
        &:hover {
          background: #fb3a32;
          color: #fff;
          border: 1px solid #fb3a32;
        }
      }
      .banner-download {
        height: 126px;
        background: #fff;
        border-radius: 4px;
        position: relative;
        width: 100%;
        margin-bottom: 10px;
        .ad-web {
          height: 126px;
          height: 126px;
          /*  img{
            width: 100%;
            height: 100%;
            border-radius: 4px;
          } */
          &.is-cursor {
            cursor: pointer;
          }
          .el-image {
            width: 100%;
            height: 100%;
            -o-object-fit: cover;
            object-fit: cover;
            border-radius: 4px;
          }
        }
      }
      .web-download {
        height: 279px;
        background: #fff;
        border-radius: 4px;
        position: relative;
        width: 100%;
        .ad-web {
          height: 126px;
          height: 126px;
          img {
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
      .ad-text {
        padding: 8px 17px;
        h1 {
          font-size: 16px;
          line-height: 25px;
          font-weight: 600px;
          color: #1a1a1a;
        }
        p {
          font-size: 14px;
          line-height: 20px;
          font-weight: 400px;
          color: #666;
        }
      }
      .app-download {
        height: 279px;
        background: #fff;
        margin: 16px 0;
        border-radius: 4px;
        position: relative;
        .app-web {
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
          img {
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
      .data-document {
        background: #fff;
        // height: calc(100% - 590px);
        height: 270px;
        &.is-show-banner {
          height: 180px;
        }
        border-radius: 4px;
        h2 {
          font-size: 16px;
          color: #1a1a1a;
          padding: 12px 0 14px 14px;
          a {
            float: right;
            font-size: 14px;
            color: #666;
            margin-right: 14px;
            &:hover {
              color: #fb3a32;
            }
          }
        }
        p {
          font-size: 14px;
          color: #666;
          padding: 0 0 11px 14px;
          a {
            color: #666;
            &:hover {
              color: #fb3a32;
            }
          }
        }
      }
    }
    .helpMsg {
      position: fixed;
      right: 0;
      bottom: 60px;
      width: 32px;
      background: #fb3a32;
      color: #fff;
      padding: 12px 7px;
      cursor: pointer;
      border-radius: 2px 0 0 2px;
      i {
        color: #fff;
        font-size: 16px;
        padding-left: 2px;
        padding-bottom: 5px;
      }
      p {
        font-size: 14px;
        text-align: center;
        line-height: 18px;
      }
    }
  }

  .prompt {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9991;
  }
  .prompt .prompt-wrap {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-256px, -290px);
    width: 518px;
    height: 516px;
    background: #ffffff;
    box-shadow: 0px 12px 42px 0px rgba(51, 51, 51, 0.24), 0px 8px 32px 0px rgba(34, 34, 34, 0.24);
    border-radius: 8px;
    padding: 32px;
    &.mini {
      height: 440px;
    }
  }
  .prompt .prompt-wrap .prompt-con-img {
    width: 100px;
    height: 100px;
    display: block;
    margin: 8px auto 32px;
  }
  .prompt .prompt-wrap .i-close {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 30px;
    top: 30px;
    font-size: 24px;
    color: #666;
    cursor: pointer;
  }
  .prompt .prompt-wrap .prompt-con-close {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .prompt .prompt-wrap .prompt-con-text {
    font-weight: 400;
    color: #1a1a1a;
    line-height: 26px;
    font-size: 14px;
  }
  .prompt .prompt-wrap .prompt-con-text-one {
    color: #222222;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
  }
  .prompt .prompt-wrap .prompt-con-text-one,
  .prompt-con-text-two {
    margin-bottom: 16px;
  }
  .prompt .prompt-wrap .prompt-con-text-two.no-bottom {
    margin-bottom: 0;
  }
  .prompt .prompt-wrap .prompt-con-text-three {
    margin-bottom: 2px;
  }
  .prompt .prompt-wrap .prompt-con-text-two {
    text-indent: 24px;
  }
  .prompt .prompt-wrap .prompt-con-text-four {
    width: 180px;
    height: 40px;
    background: #fb3a32;
    border-radius: 20px;
    line-height: 40px;
    margin: 20px auto 0;
    font-size: 14px;
    display: block;
    text-align: center;
    color: #ffffff;
    text-decoration: none;
  }
  .delay {
    height: 440px !important;
  }
</style>
