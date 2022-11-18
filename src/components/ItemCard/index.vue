<template>
  <div>
    <section>
      <p class="subject">准备</p>
      <div class="subjectOuter">
        <template v-for="item in readyList">
          <div class="sunjectInner" @click="blockHandler(item)" :key="item.id" v-if="item.isShow">
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt="" /></span>
            <div class="desc">
              <p class="mainText">{{ item.title }}</p>
              <p class="subText">{{ item.subText }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section v-if="isBrand">
      <p class="subject">品牌</p>
      <div class="subjectOuter">
        <template v-for="item in brandList">
          <div class="sunjectInner" :key="item.id" @click="blockHandler(item)" v-if="item.isShow">
            <!-- <icon class="icon" :icon-class="item.icon"></icon> -->
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt="" /></span>
            <div class="desc">
              <p class="mainText">{{ item.title }}</p>
              <p class="subText">{{ item.subText }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section v-if="isIntact">
      <p class="subject">互动</p>
      <div class="subjectOuter">
        <template v-for="item in liveDataList">
          <div class="sunjectInner" :key="item.id" @click="blockHandler(item)" v-if="item.isShow">
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt="" /></span>
            <div class="name">{{ item.name }}</div>
            <div class="desc">
              <p class="mainText">{{ item.title }}</p>
              <p class="subText">{{ item.subText }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section v-if="!(childPremission && Number(childPremission.permission_content) === 0)">
      <p class="subject">
        {{ webinarType == 5 ? '视频' : type == 4 ? '点播' : '回放' }}
      </p>
      <div class="subjectOuter">
        <div
          class="sunjectInner"
          @click="
            goHandler(
              webinarType == 5
                ? `/live/publishplayback/${$route.params.str}`
                : type == 4
                ? `/live/recordplayback/${$route.params.str}`
                : `/live/playback/${$route.params.str}`,
              type
            )
          "
        >
          <span>
            <img src="../../common/images/icon/icon_timing@2x.png" alt="" v-if="webinarType == 5" />
            <img src="../../common/images/icon/icon_review.png" alt="" v-else />
          </span>
          <div class="desc">
            <p class="mainText">
              {{ webinarType == 5 ? '视频管理' : type == 4 ? '点播管理' : '回放管理' }}
            </p>
            <p class="subText">
              {{
                webinarType == 5 ? '管理视频内容' : type == 4 ? '管理点播内容' : '管理直播回放内容'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section v-if="!(childPremission && Number(childPremission.permission_data) === 0)">
      <p class="subject">数据</p>
      <div class="subjectOuter">
        <template v-for="item in reportDataList">
          <div
            class="sunjectInner"
            @click="blockDataHandler(item)"
            :key="item.id"
            v-if="item.isShow"
          >
            <!-- <icon class="icon" :icon-class="item.icon"></icon> -->
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt="" /></span>
            <div class="desc">
              <p class="mainText">{{ item.title }}</p>
              <p class="subText">{{ item.subText }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
  import { sessionOrLocal } from '@/utils/utils';

  export default {
    name: 'index.vue',
    props: {
      operas: {
        type: Object
      },
      type: {
        type: Number,
        default: 1
      },
      perssionInfo: {
        type: Object
      },
      webinarType: {
        type: Number,
        default: 2
      },
      childPremission: {
        type: Object
      },
      videoType: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.resetList(this.perssionInfo);
    },
    watch: {
      perssionInfo: {
        handler(val) {
          if (val) {
            this.resetList(val);
          }
        },
        immediate: true,
        deep: true
      }
    },
    data() {
      return {
        loading: false,
        readyList: [],
        brandList: [],
        liveDataList: [],
        reportDataList: []
      };
    },
    computed: {
      isBrand() {
        let isbrand;
        isbrand = this.brandList.some(item => {
          // eslint-disable-next-line no-prototype-builtins
          return item.isShow == true;
        });
        return isbrand;
      },
      isIntact() {
        let isIntact;
        isIntact = this.liveDataList.some(item => {
          // eslint-disable-next-line no-prototype-builtins
          return item.isShow == true;
        });
        return isIntact;
      }
    },
    methods: {
      getLanguagePermission() {
        return this.$fetch('getConfigList', {
          webinar_id: this.$route.params.str,
          webinar_user_id: '',
          send_id: 1
        })
          .then(res => {
            if (res.data && res.data.permissions) {
              const conf = JSON.parse(res.data.permissions);
              const langPermission = conf.multilingual || 0;
              const webinarType = sessionOrLocal.get('webinarType');
              if (langPermission == 1 && webinarType && webinarType != 6) {
                this.$nextTick(() => {
                  this.readyList.push({
                    icon: 'icon_languages@2x',
                    id: 9,
                    title: '多语言链接',
                    subText: `获取多语言观看链接及二维码`,
                    type: 100066,
                    path: `/live/langCard/${this.$route.params.str}`,
                    isShow: true
                  });
                });
              }
            }
          })
          .catch(e => {
            console.log('demo>>>>>获取多语言配置success4:', e);
          });
      },
      resetList(perssionInfo) {
        const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
        (this.readyList = [
          {
            icon: 'icon_information@2x',
            id: 1,
            title: '基本信息',
            subText: `编辑${this.type == 4 ? '点播' : '直播'}基本信息`,
            path: '/live/edit',
            isShow: true,
            type: 100058
          },
          {
            icon: 'icon_Functional@2x',
            id: 2,
            title: '功能配置',
            subText: `设置观看页功能是否展示`,
            type: 100059,
            path: `/live/planFunction/${this.$route.params.str}`,
            isShow: true
          },
          {
            icon: 'icon_watch@2x',
            id: 3,
            title: '观看限制',
            subText: `设置${this.type == 4 ? '点播' : '直播'}观看限制`,
            type: 100060,
            path: `/live/viewerRules/${this.$route.params.str}`,
            isShow: true
          },
          {
            icon: 'icon_role@2x',
            id: 4,
            title: '角色邀请',
            subText: '设置不同角色参与直播的权限',
            index: 4,
            type: 100061,
            path: `/live/roleInvitation/${this.$route.params.str}`,
            isShow: this.type != 4
          },
          {
            icon: 'icon_video@2x',
            id: 5,
            title: '暖场视频',
            subText: '开启后设置暖场视频',
            index: 4,
            type: 100062,
            path: `/live/warm/${this.$route.params.str}`,
            isShow: this.type != 4 && this.webinarType != 1 && !this.videoType
          },
          {
            icon: 'icon_virtual@2x',
            id: 6,
            title: '虚拟人数',
            subText: `添加${this.type == 4 ? '点播' : '直播'}的虚拟人数`,
            type: 100063,
            path: `/live/virtual/${this.$route.params.str}`,
            isShow: this.webinarType == 6 ? false : perssionInfo.virtual_user == 1
          },
          {
            icon: 'icon_registration form@2x',
            id: 7,
            title: '报名表单',
            subText: '开启后收集目标观众信息',
            type: 100064,
            path: `/live/signup/${this.$route.params.str}`,
            isShow: perssionInfo.join_check == 1
          },
          {
            icon: 'icon_embedded@2x',
            id: 8,
            title: '推广嵌入',
            subText: `获取活动推广嵌入的方法`,
            type: 100065,
            path: `/live/embedCard/${this.$route.params.str}`,
            isShow: true
          },
          {
            icon: 'icon_languages@2x',
            id: 9,
            title: '多语言链接',
            subText: `获取多语言观看链接及二维码`,
            type: 100845,
            path: `/live/langCard/${this.$route.params.str}`,
            isShow: perssionInfo.multilingual == 1 && this.webinarType != 6
          },
          {
            icon: 'icon_notice@2x',
            id: 10,
            title: '开播提醒',
            subText: `对目标观众发送开播和回放提醒`,
            type: null, // TODO 需要上报KEY
            path: `/live/msgNotification/${this.$route.params.str}`,
            isShow:
              perssionInfo.message_notice == 1 &&
              this.type != 4 &&
              userInfo.user_extends.extends_remark != 1 // 不是知学云账号 & 开启了 短信通知配置项权限
          }
        ]),
          (this.brandList = [
            {
              icon: 'icon_brand@2x',
              id: 1,
              title: '直播间设计器',
              subText: '设置直播间的主题、布局和自定义菜单',
              type: 100066,
              path: `/live/livingSet/${this.$route.params.str}`,
              isShow: true
            },
            // {
            //   icon: 'icon_brand@2x',
            //   id: 1,
            //   title: '品牌设置',
            //   subText: '设置观看页品牌信息',
            //   type: 100066,
            //   path: `/live/brandSet/${this.$route.params.str}`,
            //   isShow:
            //     perssionInfo['ui.brand_setting'] > 0 ||
            //     perssionInfo.webinar_skins > 0 ||
            //     perssionInfo['watch.viewing_protocol'] > 0,
            // },
            // {
            //   icon: 'icon_custom@2x',
            //   id: 2,
            //   title: '自定义菜单',
            //   subText: '自定义观看页菜单栏',
            //   type: 100067,
            //   path: `/live/customTab/${this.$route.params.str}`,
            // },
            {
              icon: 'color-recording-screen@2x',
              id: 9,
              title: '防录屏设置',
              subText: `设置${this.type == 4 ? '点播' : '直播'}跑马灯水印`,
              type: 100068,
              path: `/live/safeScreenSet/${this.$route.params.str}`,
              isShow: perssionInfo.player_config == 1
            },
            {
              icon: 'icon_player@2x',
              id: 3,
              title: '播放器设置',
              subText: `设置播放器画面显示功能`,
              type: 100068,
              path: `/live/playerSet/${this.$route.params.str}`,
              isShow: perssionInfo.player_config == 1
            },
            {
              icon: 'icon_invitation@2x',
              id: 4,
              title: '邀请卡',
              subText: `用于${this.type == 4 ? '点播' : '直播'}邀请或裂变分享`,
              type: 100069,
              path: `/live/invCard/${this.$route.params.str}`,
              isShow: perssionInfo.btn_invite == 1
            },
            {
              icon: 'icon_advertising@2x',
              id: 5,
              title: '广告',
              subText: '设置观看页广告位信息',
              type: 100070,
              path: `/live/advertCard/${this.$route.params.str}`,
              isShow: perssionInfo.ad_recommend == 1
            },
            {
              icon: 'icon_public@2x',
              id: 6,
              title: '公众号',
              subText: '设置观看页展示的公众号',
              type: 100071,
              path: `/live/officeSet/${this.$route.params.str}`,
              isShow: this.webinarType == 6 ? false : perssionInfo.live_broadcast_window == 1
            },
            {
              icon: 'icon_posters@2x',
              id: 7,
              title: '开屏海报',
              subText: '设置观看页的开屏海报',
              type: 100072,
              path: `/live/posterCard/${this.$route.params.str}`,
              isShow: perssionInfo.market_open_posters == 1
            },
            {
              icon: 'icon_shareSetting@2x',
              id: 8,
              title: '分享设置',
              subText: '设置活动分享到微信中的效果',
              type: 100846,
              path: `/live/shareSetting/${this.$route.params.str}`,
              isShow: perssionInfo.share_set == 1
            }
          ]),
          (this.liveDataList = [
            {
              icon: 'icon_document@2x',
              id: 1,
              title: '文档',
              subText: '直播中使用文档演示',
              type: 100073,
              path: `/live/word/${this.$route.params.str}`,
              isShow: this.type != 4 && this.webinarType != 5
            },
            {
              icon: 'icon_videoSet@2x',
              id: 6,
              title: '插播文件',
              subText: '直播中使用音视频文件演示',
              type: 100847,
              path: `/live/videoSet/${this.$route.params.str}`,
              isShow:
                this.webinarType != 5 && perssionInfo['waiting.video.file'] == 1 && this.type != 4
            },
            {
              icon: 'icon_Lucky draw@2x',
              id: 2,
              title: '抽奖',
              subText: '直播中发起抽奖活跃气氛',
              type: 100074,
              path: `/live/prizeSet/${this.$route.params.str}`,
              isShow: perssionInfo['ui.hide_lottery'] == 1 && this.type != 4
            },
            {
              icon: 'icon_questionnaire@2x',
              id: 3,
              title: '问卷',
              subText: '创建问卷收集信息',
              type: 100075,
              path: '/live/question',
              isShow: perssionInfo['ui.hide_survey'] == 1 && this.type != 4 // 定时直播、点播直播不支持；没权限也不支持
            },
            {
              icon: 'icon_exam@2x',
              id: 7,
              title: '快问快答',
              subText: '提升答题趣味性，强化知识掌握',
              type: 100075,
              path: '/live/exam',
              isShow: perssionInfo['exam'] == 1 && this.type != 4 // 点播直播不支持；没权限也不支持
            },
            {
              icon: 'icon_goods@2x',
              id: 4,
              title: '商品',
              subText: '设置展示给观众的商品',
              type: 100076,
              path: `/live/productSet/${this.$route.params.str}`,
              isShow: perssionInfo.product_show == 1
            },
            {
              icon: 'icon_gift@2x',
              id: 5,
              title: '礼物',
              subText: '设置观众发送的礼物信息',
              type: 100077,
              path: `/live/gift/${this.$route.params.str}`,
              isShow: perssionInfo['ui.show_gift'] == 1
            }
          ]),
          (this.reportDataList = [
            {
              icon: 'icon_data@2x',
              id: 1,
              title: '数据报告',
              subText: `统计${this.type == 4 ? '点播' : '直播'}基本数据`,
              type: 100042,
              path: `/live/reportsData/${this.$route.params.str}`,
              isShow: true
            },
            {
              icon: 'icon_interactive@2x',
              id: 2,
              title: '互动统计',
              subText: `统计${this.type == 4 ? '点播' : '直播'}互动工具数据`,
              type: 100043,
              path: `/live/interactionData/${this.$route.params.str}`,
              isShow: true
            },
            {
              icon: 'icon_User statistics@2x',
              id: 3,
              title: '用户统计',
              subText: `统计${this.type == 4 ? '点播' : '直播'}观众详细数据`,
              type: 100044,
              path: `/live/userData/${this.$route.params.str}`,
              isShow: true
            }
          ]);
      },
      blockHandler(item) {
        let userId = this.$parent.userId;
        this.$vhall_paas_port({
          k: item.type,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$emit('blockHandler', item);
      },
      blockDataHandler(item) {
        let userId = this.$parent.userId;
        this.$vhall_paas_port({
          k: item.type,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: 2,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$emit('blockHandler', item);
      },
      goHandler(path, type) {
        let userId = this.$parent.userId;
        this.$vhall_paas_port({
          k: type === 4 ? 100079 : 100078,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({ path: path, query: { type: this.webinarType } });
      }
    }
  };
</script>

<style lang="less" scoped>
  .subject {
    font-size: 20px;
    color: #333333;
    border-left: 4px solid #fb3a32;
    line-height: 16px;
    height: 18px;
    margin-top: 32px;
    margin-bottom: 12px;
    padding-left: 5px;
  }
  .subjectOuter {
    display: flex;
    flex-wrap: wrap;
    margin-right: -24px;
    // justify-content: space-between;
  }
  .sunjectInner {
    display: flex;
    background: #fff;
    width: 330px;
    height: 110px;
    align-items: center;
    margin-bottom: 24px;
    margin-right: 17px;
    box-sizing: border-box;
    background-clip: content-box;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.15s ease-in;
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:nth-child(4n) {
      margin-right: 18px;
    }
    &:hover {
      box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      border: 1px solid #fb3a32;
    }
    span {
      width: 44px;
      height: 44px;
      display: inline-block;
      margin-right: 15px;
      border-radius: 50%;
      margin-left: 35px;
      img {
        width: 100%;
        height: 100%;
        // background: #FB3A32;
        // border: 1px solid #ccc;
      }
    }
    /deep/.svg-icon {
      text-align: center;
      font-size: 50px;
      vertical-align: top;
      color: #fb3a32;
    }
    .desc {
      .mainText {
        font-size: 18px;
        color: #1a1a1a;
        margin-bottom: 8px;
      }
      .subText {
        font-size: 14px;
        color: #666666;
        max-width: 200px;
        line-height: 20px;
      }
    }
  }
  @media screen and (min-width: 1920px) {
    .sunjectInner {
      &:nth-child(3n) {
        margin-right: 18px;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
</style>
