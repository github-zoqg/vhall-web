<template>
  <div class="navbar">
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />
    <!-- 登录用户等 -->
    <div class="right-menu">
      <div class="right-menu-item" v-if="isShowOld && !isMiniScreen">
        <a :href="oldUrl" class="set-font" @click="returnOldVersion">返回旧版</a>
      </div>
      <!-- 下载中心 -->
      <div v-if="!isMiniScreen" class="right-menu-item" @click.prevent.stop="toDownloadPage">
        <el-badge is-dot :hidden="!down_num > 0">
          <span class="span--icon"><icon icon-class="saasicon_download"></icon></span>
        </el-badge>
        <span class="remak--text">下载</span>
      </div>
      <!-- 消息中心 -->
      <div v-if="!isMiniScreen" class="right-menu-item" @click.prevent.stop="toMsgPage">
        <el-badge
          :value="unread_num"
          :max="99"
          :class="unread_num > 9 ? 'more' : 'item'"
          :hidden="!unread_num > 0"
        >
          <span class="span--icon"><icon icon-class="saasicon_bell_m"></icon></span>
        </el-badge>
        <span class="remak--text">消息</span>
      </div>
      <!-- 帮助中心 -->
      <div v-if="!isMiniScreen" class="right-menu-item" @click.prevent.stop="toHelpPage">
        <span class="span--icon"><icon icon-class="saasicon_help_m"></icon></span>
        <span class="remak--text">帮助</span>
      </div>
      <div class="right-menu-item">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span class="user-contain"><img :src="avatarImgUrl" class="user-avatar" alt="" /></span>
            <span>{{ show_name }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item
              divided
              @click.native="toAccountPage"
              v-if="userInfo.user_extends.extends_remark != 2"
            >
              <i class="iconfont-v3 saasicon_account1"></i>
              账户信息
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <i class="iconfont-v3 saasicon_exit"></i>
              退出登录
            </el-dropdown-item>
            <el-dropdown-item
              v-if="isMiniScreen"
              divided
              @click.native.prevent.stop="toDownloadPage"
            >
              <!-- 下载中心 -->
              <div class="right-menu-item">
                <el-badge is-dot :hidden="!down_num > 0">
                  <span class="span--icon"><icon icon-class="saasicon_download"></icon></span>
                </el-badge>
                <span class="remak--text">下载</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="isMiniScreen" divided @click.native.prevent.stop="toMsgPage">
              <!-- 消息中心 -->
              <div class="right-menu-item">
                <el-badge
                  :value="unread_num"
                  :max="99"
                  :class="unread_num > 9 ? 'more' : 'item'"
                  :hidden="!unread_num > 0"
                >
                  <span class="span--icon"><icon icon-class="saasicon_bell_m"></icon></span>
                </el-badge>
                <span class="remak--text">消息</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="isMiniScreen" divided @click.native.prevent.stop="toHelpPage">
              <!-- 帮助中心 -->
              <div class="right-menu-item">
                <span class="span--icon"><icon icon-class="saasicon_help_m"></icon></span>
                <span class="remak--text">帮助</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="isMiniScreen" divided @click.native.prevent.stop="toHelpPage">
              <div class="right-menu-item" v-if="isShowOld">
                <a :href="oldUrl" class="set-font">返回旧版</a>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from './Breadcrumb/index.vue';
  import { sessionOrLocal, clearCookies } from '@/utils/utils';
  import Cookies from 'js-cookie';
  import Env from '@/api/env';
  import EventBus from '@/utils/Events';
  import { throttle } from '@/utils/utils';
  import { defaultAvatar } from '@/utils/ossImgConfig';
  export default {
    components: {
      Breadcrumb
    },
    data() {
      return {
        sidebar: {
          opened: true, // 左侧导航是否打开
          withoutAnimation: false // 左侧导航是否动画
        },
        unread_num: 0,
        down_num: 0,
        avatarImgUrl: '',
        userInfo: null,
        env: Env,
        isMiniScreen: false
      };
    },
    computed: {
      oldUrl: function () {
        return `${
          process.env.VUE_APP_E_COMPANY_URL
        }/auth/check-token?after_login=mywebinar/main&token=${sessionOrLocal.get(
          'SAAS_V3_SSO_TOKEN',
          'localStorage'
        )}`;
      },
      show_name: function () {
        if (this.userInfo && this.userInfo.nick_name) {
          if (this.userInfo.nick_name.length > 5) {
            return this.userInfo.nick_name.substring(0, 5) + '...';
          } else {
            return this.userInfo.nick_name;
          }
        } else {
          return '';
        }
      },
      isShowOld: function () {
        if (
          this.userInfo &&
          (this.userInfo.is_new_regist == 0 || this.userInfo.is_new_regist == 4) &&
          this.userInfo &&
          this.userInfo.user_extends.extends_remark !== 1
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    // inject: [],
    methods: {
      toHelpPage() {
        this.$vhall_paas_port({
          k: 100003,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: this.userInfo.user_id,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        window.open(Env.staticLinkVo.helpLinkUrl, '_blank');
      },
      toMsgPage() {
        this.$vhall_paas_port({
          k: 100004,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: this.userInfo.user_id,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({ path: '/other/msgList' });
      },
      toDownloadPage() {
        this.getDownNum();
        this.$vhall_paas_port({
          k: 100002,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: this.userInfo.user_id,
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({ path: '/other/downloadList' });
      },
      returnOldVersion() {
        this.$vhall_paas_port({
          k: 100001,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      toAccountPage() {
        this.$vhall_paas_port({
          k: 100831,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({ path: '/acc/info' });
      },
      getUnreadNum() {
        this.$fetch('getUnreadNum', {})
          .then(res => {
            this.unread_num = res && res.code === 200 && res.data ? res.data.unread_num : 0;
          })
          .catch(e => {
            console.log(e);
            this.unread_num = 0;
          });
      },
      getDownNum() {
        this.$fetch('downloadNotNum', {})
          .then(res => {
            this.down_num = res && res.code === 200 && res.data ? res.data.num : 0;
          })
          .catch(e => {
            console.log(e);
            this.down_num = 0;
          });
      },
      logout() {
        let out_url = sessionOrLocal.get('SAAS_V3_CTRL_OUT', 'localStorage');
        this.$fetch('loginOut', {}, { credentials: true })
          .then(res => {
            this.$vhall_paas_port({
              k: 100832,
              data: {
                business_uid: this.userInfo.user_id,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            sessionOrLocal.clear();
            sessionOrLocal.clear('localStorage');
            // 清除cookies
            Cookies.remove('gray-id');
            clearCookies();
            // 监听消息变化
            this.$EventBus.$emit('saas_vs_login_out', true);
            // setTimeout(() => {
            if (res.data && out_url) {
              window.location.href = out_url;
            } else {
              this.$router.push({
                path: '/login'
              });
            }
            // }, 200)
          })
          .catch(res => {
            this.$message({
              message: res.msg || `退出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
          .finally(() => {
            // 清除cookies
            Cookies.remove('gray-id');
            clearCookies();
            sessionOrLocal.clear();
            sessionOrLocal.clear('localStorage');
            // 监听消息变化
            this.$EventBus.$emit('saas_vs_login_out', true);
            // setTimeout(() => {
            if (out_url) {
              window.location.href = out_url;
            } else {
              this.$router.push({
                path: '/login'
              });
            }
            // }, 200)
          });
      },
      updateAccount(account) {
        this.userInfo = account;
        this.avatarImgUrl = account ? account.avatar || defaultAvatar : defaultAvatar;
      },
      updateDownload() {
        // 初始进入，获取未下载条数
        // this.getDownNum();
        this.down_num = 1;
      },
      // 监听
      monitor() {
        /**
         * 接收聊天自定义消息*/
        this.$Chat.onCustomMsg(async msg => {
          try {
            if (typeof msg !== 'object') {
              msg = JSON.parse(msg);
            }
            if (typeof msg.context !== 'object') {
              msg.context = JSON.parse(msg.context);
            }
            if (typeof msg.data !== 'object') {
              msg.data = JSON.parse(msg.data);
            }
          } catch (e) {
            console.log(e);
          }
          console.log('============收到msg_center_num2===============' + JSON.stringify(msg.data));
          if (msg.data.type === 'msg_center_num') {
            this.$EventBus.$emit('msg_center_num', msg.data);
          }
          if (msg.data.type === 'host_msg_webinar') {
            this.$EventBus.$emit('host_msg_webinar', msg.data.data);
          }
          if (msg.data.type === 'doc_convert_jpeg') {
            this.$EventBus.$emit('doc_convert_jpeg', msg.data.data);
          }
          if (msg.data.type === 'sign_trans_code') {
            this.$EventBus.$emit('sign_trans_code', msg.data);
          }
          if (
            msg.data.type == 'record_download' &&
            msg.data.user_id == sessionOrLocal.get('userId')
          ) {
            this.$EventBus.$emit('record_download', msg.data);
          }
          if (msg.data.type == 'entry_trans' && msg.data.user_id == sessionOrLocal.get('userId')) {
            this.$EventBus.$emit('encrypt_complete', msg.data);
          }
          if (msg.data.type === 'waiting_sign_trans_code') {
            this.$EventBus.$emit('waiting_sign_trans_code', msg.data);
          }
          if (
            msg.data.type == 'notice_sms_send_num' &&
            msg.data.user_id == sessionOrLocal.get('userId')
          ) {
            // 消息通知-预发短信量
            this.$EventBus.$emit('notice_sms_send_num', msg.data);
          }
          if (msg.data.type === 'down_center_msg') {
            if (Number(msg.user_ids) === Number(sessionOrLocal.get('userId'))) {
              this.down_num = msg.down_num;
              this.$EventBus.$emit('saas_vs_down_num');
            }
            this.$EventBus.$emit('down_center_msg', msg.data);
          }
        });
      },
      // 初始化
      async initChat() {
        let result = await this.$fetch('msgInitConsole');
        if (result) {
          console.log(result, '值');
          let option = {
            appId: result.data.paasAppId || '', // appId 必须
            accountId: result.data.accountId || '', // 第三方用户ID
            channelId: result.data.channelId || '', // 频道id 必须
            token: result.data.paasAccessToken || '', // 必须， token，初始化接口获取
            hide: true
          };
          window.VhallChat.createInstance(
            option,
            event => {
              this.$Chat = event.message; // 聊天实例句柄
              this.monitor();
            },
            err => {
              // alert('初始化错误')
              console.error(err);
            }
          );
        }
      },
      handleResize() {
        const handle = () => {
          const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
          if (htmlWidth <= 1120) {
            this.isMiniScreen = true;
          } else {
            this.isMiniScreen = false;
          }
        };
        return throttle(handle, 500);
      }
    },
    mounted() {
      // 账号信息展示
      let userInfo = sessionOrLocal.get('userInfo');
      if (userInfo !== null) {
        this.userInfo = JSON.parse(userInfo);
        if (this.userInfo) {
          this.avatarImgUrl = this.userInfo.avatar || defaultAvatar;
        } else {
          this.avatarImgUrl = defaultAvatar;
        }
      } else {
        sessionOrLocal.clear();
        sessionOrLocal.clear('localStorage');
        this.$router.push({
          path: '/login'
        });
      }
      // 监听消息变化
      this.$EventBus.$on('saas_vs_msg_count', this.getUnreadNum);
      // 监听下载中心变化
      this.$EventBus.$on('saas_vs_download_count', this.getDownNum);
      // 监听用户信息变化
      this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
      // 监听控制台是否触发导出
      this.$EventBus.$on('saas_vs_download_change', this.updateDownload);
      // 消息实例初始化
      this.$EventBus.$on('msg_center_num', res => {
        // 转码状态
        console.log(res, '监听到msg_center_num未读消息提示事件');
        if (Number(res.user_id) === Number(sessionOrLocal.get('userId'))) {
          this.unread_num = res.num;
          this.$EventBus.$emit('saas_vs_msg_num');
        }
      });
      this.$EventBus.$on('down_center_msg', res => {
        // 转码状态
        console.log(res, '监听到down_center_msg未下载提示事件');
        if (Number(res.user_id) === Number(sessionOrLocal.get('userId'))) {
          this.down_num = res.down_num;
          this.$EventBus.$emit('saas_vs_down_num');
        }
      });
      window.addEventListener('resize', this.handleResize());
    },
    created() {
      // 初始进入，获取未读消息条数
      this.getUnreadNum();
      // 初始进入，获取未下载条数
      this.getDownNum();
      // 初始化聊天SDK [用户下的]
      this.initChat();
    },
    beforeDestroy() {
      console.log('消亡');
      if (this.$Chat) {
        this.$Chat.destroy();
        this.$Chat = null;
      }
      window.removeEventListener('resize', this.handleResize());
    }
  };
</script>
<style lang="less" scoped>
  @import '../../common/css/index.less';
  .user-dropdown {
    border-radius: 4px;
    /deep/.el-dropdown-menu__item {
      padding: 0 16px !important;
      min-width: 160px;
      height: 40px;
      background: #ffffff;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      border-radius: 0 0 4px 4px;
      text-align: left;
    }
    li:first-child {
      border-radius: 4px 4px 0 0;
    }
    .iconfont-v3 {
      font-size: 16px;
      vertical-align: bottom;
    }
    .saasicon_exit {
      font-size: 17px;
    }
    /deep/.el-dropdown-menu__item--divided:before {
      display: none !important;
    }
    .hover-icon {
      margin-right: 12px;
    }
    /deep/ .el-badge.item .el-badge__content.is-fixed {
      width: 18px;
      height: 18px;
      background: #fb3a32;
      top: 10px;
      right: 15px;
      text-align: center;
      line-height: 16px;
      padding: 0 0;
    }
    /deep/ .el-badge__content.is-fixed.is-dot {
      top: 10px;
      right: 10px;
    }
    /deep/ .span--icon {
      color: #666666;
      display: inline-block;
      vertical-align: bottom;
    }
  }
  .breadcrumb-container {
    text-align: left;
    height: 32px;
    line-height: 32px;
    float: left;
    padding-left: 24px;
  }
  /* @media (max-width: 1366px) {
  .breadcrumb-container {
    display: none;
  }
} */
  .right-menu {
    float: right;
    height: 32px;
    line-height: 32px;
    margin-right: 17px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      margin-right: 16px;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      .span--icon {
        color: #666666;
        display: inline-block;
        vertical-align: bottom;
      }
      .remak--text {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        margin-left: 6px;
      }
      &:first-child {
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #3562fa;
      }
      .set-font {
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #3562fa;
      }
    }
    /deep/.el-badge {
      display: inline-block;
      vertical-align: middle;
      i {
        color: #666666;
      }
      &.more {
        .el-badge__content.is-fixed {
          height: 18px;
          background: #fb3a32;
          top: 4px;
          right: 10px;
          text-align: center;
          width: 28px;
          border-radius: 9px;
          line-height: 16px;
          border: 1px solid #fb3a32;
        }
      }
      &.item {
        .el-badge__content.is-fixed {
          width: 18px;
          height: 18px;
          background: #fb3a32;
          top: 4px;
          right: 10px;
          text-align: center;
          line-height: 16px;
          padding: 0 0;
          border: 1px solid #fb3a32;
        }
      }
    }
    /deep/.el-badge__content.is-dot {
      height: 10px;
      width: 10px;
    }
    /deep/.el-badge__content.is-fixed.is-dot {
      top: 8px;
      right: 6px;
    }
  }
  .avatar-wrapper {
    position: relative;
    span {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      margin-left: 10px;
      display: inline-block;
      vertical-align: middle;
    }
    .user-contain {
      display: inline-block;
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 100%;
      .user-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 100%;
      }
    }
    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
</style>
