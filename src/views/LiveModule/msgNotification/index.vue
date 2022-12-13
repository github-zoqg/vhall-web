<template>
  <div class="msg-notification-page">
    <pageTitle pageTitle="开播提醒">
      <div slot="content">
        1.短信通知支持重复发送，为避免用户打扰，建议控制发送时间及频次
        <br />
        2.修改开播时间后将对所有参与用户再次发送通知，不区分场次
        <br />
        3.单条短信超过70字符（含后缀）将消耗2条计费，最大字符限制500字
        <br />
        4.关闭或删除活动将停止未发送状态的通知发送，已在发送中的任务不会停止
        <br />
        5.短信通知针对发送失败或黑名单的用户，依旧扣除短信余额（余额不足除外）
      </div>
      <div class="balance__right">
        短信余额：
        <strong :class="smsBalance && smsBalance.sms > 0 ? 'color-blue' : 'color-red'">
          {{ smsBalance ? smsBalance.sms || 0 : 0 }}
        </strong>
        条
      </div>
    </pageTitle>
    <div class="msg-notification__body" v-loading="isLoading">
      <div class="msg-notification__top">
        <div class="msg-sign__top" @blur.stop="cancelSaveMsgSign">
          <span
            :class="[
              'msg-sign__top__label',
              {
                is_no_edit: isSignShow
              }
            ]"
          >
            短信签名：
          </span>
          <span v-if="isSignShow" :class="isSignShow ? 'is_no_edit' : ''">{{ showSignText }}</span>
          <vh-input
            type="text"
            maxlength="12"
            show-word-limit
            v-if="!isSignShow"
            v-model.trim="inputSign"
            autocomplete="off"
            placeholder="请输入短信签名"
            size="mini"
          ></vh-input>
          <vh-link
            class="msg-edit-icon"
            icon="el-icon-edit"
            :underline="false"
            @click.prevent="editSignShow"
            v-if="isSignShow"
          ></vh-link>
          <vh-button
            borderRadius="4"
            type="text"
            round
            @click="noticeConfigEdit('confirm')"
            v-if="!isSignShow"
            size="mini"
            class="zdy-theme-red"
          >
            确定
          </vh-button>
          <vh-button
            borderRadius="4"
            type="text"
            plain
            @click="noticeConfigEdit('cancel')"
            v-if="!isSignShow"
            size="mini"
            class="zdy-theme-gray"
          >
            取消
          </vh-button>
        </div>
        <!-- 开启了微信授权的时候，才有短信验证码开关设置  ui.hide_wechat: [0不使用微信授权(关闭该权限) 1使用微信授权（未关闭该权限）
        说明，在所有的scene=1的场景下，所有ui.hide_*** 的配置项都应该取反值  -->
        <div
          class="switchBox"
          v-if="msgInfo && msgInfo.config_info && WEBINAR_PES && WEBINAR_PES['ui.hide_wechat'] == 1"
        >
          <vh-switch
            v-model="msgInfo.config_info.phone_verify_status"
            @change="switchChangeOpen"
            :active-text="showSwitchText"
            size="mini"
            active-value="1"
            inactive-value="0"
          ></vh-switch>
        </div>
      </div>
      <div class="msg-notification-center">
        <div class="title-layout">
          <span class="base_title">短信通知</span>
          <span class="base_title_send" v-if="sms_send_num > 0">
            当前预计发送
            <strong :class="sms_send_num > 0 ? 'color-blue padding-10' : 'color-red padding-10'">
              {{ sms_send_num }}
            </strong>
            条短信（仅统计开播提醒及回放通知的预计发送量）
          </span>
          <span
            class="base_title_balance"
            v-if="smsBalance && (smsBalance.sms < sms_send_num || smsBalance.sms == 0)"
          >
            余额不足，请联系您的专属客服充值。
          </span>
        </div>
        <el-row :gutter="24" class="base_row" v-if="msgInfo">
          <!-- xs	<768px	超小屏 如：手机
          sm	≥768px	小屏幕 如：平板
          md	≥992px	中等屏幕 如：桌面显示器
          lg	≥1200px	大屏幕 如：大桌面显示器
          xl	≥1920px	2k屏等 -->
          <template v-for="(item, index) in msgInfo.list">
            <el-col
              class="liveItem"
              :xs="8"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="8"
              v-if="item"
              :key="`base-item-${index}`"
            >
              <item-card
                :info="item"
                @changeSwitch="reloadAjax"
                @saveChange="reloadAjax"
                @reloadBalance="reloadBalanceAjax"
              ></item-card>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import beginPlay from '@/components/beginBtn';
  import { sessionOrLocal } from '@/utils/utils';
  import ItemCard from './components/item-card.vue';
  import EventBus from '@/utils/Events';
  export default {
    name: 'msgNotification',
    data() {
      return {
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
        isLoading: false,
        vm: null,
        msgInfo: null,
        // signDialogVisible: false,
        showSignText: null,
        inputSign: null,
        isSignShow: true,
        baseSet: [],
        wxSet: [],
        smsBalance: {},
        sms_send_num: 0, // 预发短信数量
        webinarPes: {}
      };
    },
    computed: {
      showSwitchText: function () {
        // 只在开关右侧展示的文案
        return this.msgInfo &&
          this.msgInfo.config_info &&
          this.msgInfo.config_info.phone_verify_status == 1
          ? '关闭后，用户在预约时提交手机号无需进行短信验证（不含登录/报名）'
          : '开启后，用户在预约时提交手机号需要进行短信验证（不含登录/报名）';
      }
    },
    provide: function () {
      return {
        noticeApp: this
      };
    },
    components: {
      PageTitle,
      beginPlay,
      ItemCard
    },
    methods: {
      // 编辑签名 - 展示
      editSignShow() {
        this.isSignShow = false;
        this.inputSign = this.msgInfo.config_info.sms_sign || '微吼直播';
      },
      // 开启\关闭报名表单开关
      switchChangeOpen(value) {
        if (this.smsBalance.sms == 0 && value == 1) {
          this.msgInfo.config_info.phone_verify_status = !value;
          this.messageInfo('短信余额不足，请充值后开启', 'error');
          return;
        } else if (this.smsBalance.sms == 0 && value != 1) {
          // 余额不足，且当前开关点击关闭时，提示信息，并且关闭开关
          this.messageInfo('短信余额不足，请充值后开启', 'error');
          setTimeout(() => {
            this.changeStatusAjax(value);
          }, 1000);
        } else {
          this.changeStatusAjax(value);
        }
      },
      changeStatusAjax(value) {
        const text = Number(value) ? '开启' : '关闭';
        this.$fetch('noticeConfigEdit', {
          webinar_id: this.$route.params.str,
          phone_verify_status: Number(value)
        })
          .then(res => {
            if (res.code === 200) {
              this.msgInfo.config_info.phone_verify_status = value;
              this.$message({
                message: `${text}成功`,
                showClose: true, // 是否展示关闭按钮
                type: 'success', //  提示类型
                customClass: 'zdy-info-box' // 样式处理
              });
            } else {
              this.msgInfo.config_info.phone_verify_status = !value;
            }
          })
          .catch(err => {
            this.$message({
              message: `${text}失败`,
              showClose: true, // 是否展示关闭按钮
              type: 'error', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
            this.msgInfo.config_info.phone_verify_status = !value;
          });
      },
      // 刷新界面数据
      reloadAjax() {
        this.reloadBalanceAjax();
        this.getNoticePageList();
      },
      // 刷新界面余额
      reloadBalanceAjax() {
        this.getSmsBalance();
      },
      // 打开弹窗
      openDialog(type) {
        this[`${type}DialogVisible`] = true;
      },
      // 关闭链接弹窗
      closeDialog(obj) {
        this[`${obj.type}DialogVisible`] = false;
        if (obj.content) {
          // 有传递值就重置
          this.msgInfo[type] = obj.content;
        }
      },
      // 保存签名
      noticeConfigEdit(type) {
        if (type == 'cancel') {
          this.isSignShow = true;
          return;
        }
        if (this.inputSign.length > 12 || this.inputSign.length < 2) {
          this.messageInfo(`短信签名，长度2-12个字符`, 'error');
          if (!this.inputSign) {
            this.inputSign = '微吼直播';
          }
          return;
        }
        this.$fetch('noticeConfigEdit', {
          webinar_id: this.$route.params.str,
          sms_sign: this.inputSign || '微吼直播'
        })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: `保存成功`,
                showClose: true, // 是否展示关闭按钮
                type: 'success', //  提示类型
                customClass: 'zdy-info-box' // 样式处理
              });
              this.isSignShow = true;
              // 刷新界面数据
              this.reloadAjax();
            }
          })
          .catch(err => {
            this.$message({
              message: `${err.msg || '保存失败'}`,
              showClose: true, // 是否展示关闭按钮
              type: 'error', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
          });
      },
      // 取消保存签名
      cancelSaveMsgSign() {
        this.isSignShow = true;
        this.msgInfo.msg = this.showSignText;
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      // 组装信息面板静态内容
      joinNoticeItemStatic(msgInfo) {
        const titleList = [
          '',
          '预约/报名成功通知',
          '开播提醒',
          '回放通知',
          '关注成功通知',
          '开播提醒',
          '回放通知'
        ];
        const subTitleList = [
          '',
          '',
          '',
          '',
          '直播关注成功通知',
          '预约的直播即将开始',
          '预约直播已设置回放'
        ];
        const descList = [
          '',
          '预约/报名后发送',
          '',
          '设置默认回放后发送',
          '关注成功后发送',
          '',
          '设置默认回放后发送'
        ];
        msgInfo.list.map(item => {
          item.title = titleList[item.config_type];
          item.subTitle = subTitleList[item.config_type];
          item.desc = descList[item.config_type];
          item.is_allow_set = item.config_type < 4 ? true : false;
          item.notice_switch = !!item.notice_switch;
          if (item.config_type > 3) {
            // 微信
            item.content = [
              {
                label: '直播标题',
                value: msgInfo.webinar_info.subject
              },
              {
                label: '开播时间',
                value: msgInfo.webinar_info.start_time
              }
            ];
          } else {
            // 每个开播类型，最多支持展示的文字长度
            let maxLen = [0, 18, 26, 36][item.config_type];
            item.content_str_min = this.formatContentStr(item, msgInfo, maxLen);
          }
        });
        return msgInfo;
      },
      // 格式化短信部分内容呈现
      formatContentStr(item, msgInfo, len = 96) {
        if (!item.content_template) {
          return '';
        }
        const smsSign = msgInfo?.config_info?.sms_sign || '微吼直播';
        const subject = msgInfo?.webinar_info?.subject || '';
        // 举例 —— 最小展示规则：中文加签名长度16个字长度，若超出，活动名称长度=14-签名长度，拼接上...
        let subjectByType =
          subject.length + smsSign.length > len
            ? subject.substring(0, len - 2 - smsSign.length) + '...'
            : subject;
        // 格式化列表展示文案
        return item.content_template
          .replace('${sms_sign}', smsSign)
          .replace('${subject}', subjectByType)
          .replace(new RegExp(item.short_url, 'g'), '');
      },
      // 获取开播提醒内容
      getNoticePageList() {
        this.$fetch('getNoticePageList', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            this.isLoading = false;
            let msgInfo = res.data;
            msgInfo = this.joinNoticeItemStatic(msgInfo);
            this.msgInfo = msgInfo;
            this.showSignText = msgInfo.config_info.sms_sign || '微吼直播';
          })
          .catch(res => {
            this.isLoading = false;
            this.messageInfo(res.msg || '获取信息失败', 'error');
            this.msgInfo = { config_info: {}, list: [] };
          });
      },
      // 获取短信套餐余额
      getSmsBalance() {
        return this.$fetch('getSmsBalance', {})
          .then(res => {
            if (res.code == 200 && res.data) {
              this.smsBalance = res.data;
            } else {
              this.smsBalance = {};
            }
          })
          .catch(res => {
            this.messageInfo(res.msg || '获取信息失败', 'error');
            console.log(res);
            this.smsBalance = {};
          });
      },
      // 获取活动层级 —— 配置项开关 / 具体配置项值
      getConfigListIsOpen(scene = 1, webinar_id = '') {
        let params = {
          webinar_id: webinar_id,
          webinar_user_id: this.userId,
          scene_id: scene
        };
        return this.$fetch('planFunctionGet', this.$params(params), {
          'gray-id': this.userId
        })
          .then(res => {
            if (res && res.code === 200 && res.data.permissions) {
              const data = JSON.parse(res.data.permissions);
              this.WEBINAR_PES = data;
            }
          })
          .catch(e => {
            console.log('刷新等情况下获取活动下接口配置项情况，异常不做任何处理');
          });
      }
    },
    async created() {
      const that = this;
      this.$EventBus.$on('notice_sms_send_num', msgData => {
        if (msgData.webinar_id == that.$route.params.str) {
          // 活动匹配的时候，展示预发短信内容
          console.log('监听内容', msgData.sms_send_num);
          that.sms_send_num = msgData.sms_send_num;
        }
      });
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.isLoading = true;
      await this.getConfigListIsOpen(1, this.$route.params.str);
      await this.getSmsBalance();
      this.getNoticePageList();
    },
    beforeDestroy() {
      this.$EventBus.$off('notice_sms_send_num');
    }
  };
</script>

<style lang="less" scoped>
  .msg-notification-page {
    /deep/.vh-tooltip.saasicon_help_m {
      color: #8c8c8c;
      &:hover {
        color: #595959;
      }
    }
    /deep/.vh-input {
      .vh-input__inner,
      .vh-input__count {
        font-size: 14px;
      }
    }
    /deep/.titleBox {
      margin-bottom: 28px;
      .balance__right {
        margin-left: auto;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        text-align: right;
        color: #1a1a1a;
      }
      .color-blue {
        color: #1e4edc;
      }
      .color-red {
        color: #fb2626;
      }
    }
    /deep/.vh-switch__label {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      &.is-active {
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .msg-notification__body {
      background: #ffffff;
      min-height: 549px;
      padding: 24px 24px;
      border-radius: 4px;
    }
    .msg-notification__top {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 14px 24px;
      background: #f5f5f5;
      border-radius: 4px;
      line-height: 28px;
      .switchBox {
        margin-left: auto;
      }
      .msg-edit-icon {
        &:hover {
          color: #fb2626;
        }
      }
      .msg-sign__top {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 28px;
        &__label {
          width: 70px;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: #1a1a1a;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }
        .is_no_edit {
          color: rgba(0, 0, 0, 0.85);
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }
        .vh-input {
          width: 267px;
          margin-right: 12px;
        }
        .vh-link.vh-link--default {
          margin-left: 8px;
        }
        /deep/.zdy-theme-red {
          color: #fb2626;
          &:hover {
            color: #d4151c;
          }
        }
        /deep/.zdy-theme-gray {
          color: rgba(0, 0, 0, 0.65) !important;
          &:hover {
            color: rgba(0, 0, 0, 0.85) !important;
          }
        }
      }
    }
    .msg-notification-center {
      .title-layout {
        margin-top: 24px;
        margin-bottom: 16px;
        &::before {
          content: '';
          width: 4px;
          height: 18px;
          display: inline-block;
          margin-right: 8px;
          background: #fb3a32;
          display: inline-block;
          vertical-align: middle;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          font-style: normal;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        .base_title {
          font-size: 18px;
          line-height: 26px;
        }
        .base_title_send {
          font-size: 14px;
          line-height: 22px;
        }
        .color-blue {
          color: #1e4edc;
        }
        .padding-10 {
          padding-left: 8px;
          padding-right: 8px;
        }
        .color-red {
          color: #fb2626;
        }
        .base_title_balance {
          font-size: 14px;
          line-height: 22px;
          color: #fb2626;
        }
      }
      .base_title_send {
        margin-left: 20px;
        font-size: 14px;
      }
      .base_title_balance {
        margin-left: 20px;
        font-size: 14px;
        color: #fb3a32;
      }
      /deep/.el-row {
        padding: 0 0;
      }
    }
  }
</style>
