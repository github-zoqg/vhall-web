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
        短信余额：<strong :class="versionInfo && versionInfo.sms && versionInfo.sms.sms > 0 ? 'color-blue' : 'color-red'">{{ versionInfo && versionInfo.sms ? versionInfo.sms.sms || 0 : 0 }}</strong> 条
      </div>
    </pageTitle>
    <div class="msg-notification__body">
      <div class="msg-notification__top">
        <div class="msg-sign__top"  @blur.stop="cancelSaveMsgSign">
          <span :class="['msg-sign__top__label', {
            'is_no_edit': isSignShow
          }]">短信签名：</span><span v-if="isSignShow" :class="isSignShow ? 'is_no_edit' : ''">{{ showSignText }}</span>
          <vh-input type="text" maxlength="15" show-word-limit v-if="!isSignShow" v-model.trim="inputSign" autocomplete="off" placeholder="请输入短信签名" size="mini"></vh-input>
          <vh-link icon="el-icon-edit" :underline="false"  @click.prevent="editSignShow" v-if="isSignShow"></vh-link>
          <vh-button borderRadius="4" type="text" round  @click="noticeConfigEdit('confirm')"  v-if="!isSignShow" size="mini" class="zdy-theme-red">确定</vh-button>
          <vh-button borderRadius="4" type="text" plain  @click="noticeConfigEdit('cancel')"  v-if="!isSignShow" size="mini" class="zdy-theme-gray">取消</vh-button>
        </div>
        <div class="switchBox">
          <vh-switch
            v-model="msgInfo.config_info.phone_verify_status"
            @change="switchChangeOpen"
            :active-text="msgInfo.config_info.phone_verify_status ? '关闭后，用户在预约时提交手机号无需进行短信验证（不含登录/报名）' : '开启后，用户在预约时提交手机号需要进行短信验证（不含登录/报名）'"
            size="mini"
            active-value="1" inactive-value="0">
          </vh-switch>
        </div>
      </div>
      <div class="msg-notification-center">
        <div class="title-layout"><span class="base_title">短信通知</span><span class="base_title_send" v-if="msgInfo.config_info.send_num > 0">当前预计发送<strong :class="msgInfo.config_info.send_num > 0 ? 'color-blue' : 'color-red'">{{msgInfo.config_info.send_num}}</strong>条短信{{msgInfo.config_info.balance == 0 ? '，' : ''}}</span><span class="base_title_balance" v-if="msgInfo.config_info.balance == 0">余额不足，请联系您的专属客服充值。</span></div>
        <el-row :gutter="24" class="base_row">
          <!-- xs	<768px	超小屏 如：手机
          sm	≥768px	小屏幕 如：平板
          md	≥992px	中等屏幕 如：桌面显示器
          lg	≥1200px	大屏幕 如：大桌面显示器
          xl	≥1920px	2k屏等 -->
          <template v-for="(item, index) in msgInfo.list">
            <el-col class="liveItem" :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="item"  :key="`base-item-${index}`">
              <item-card :info="item" :configInfo="msgInfo.config_info" @changeSwitch="reloadAjax" @saveChange="reloadAjax"></item-card>
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
import {sessionOrLocal} from "@/utils/utils";
import ItemCard from './components/item-card.vue'
export default {
  name: 'msgNotification',
  data() {
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      isLoading: false,
      vm: null,
      msgInfo: null,
      // signDialogVisible: false,
      showSignText: null,
      inputSign: null,
      isSignShow: true,
      liveDetailInfo: {}, // 活动详情
      baseSet: [],
      wxSet: [],
      versionInfo: {}
    }
  },
  provide: function() {
    return {
      noticeApp: this
    }
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
      if (this.msgInfo.config_info.balance == 0 && value) {
        this.msgInfo.config_info.phone_verify_status = !value;
        this.messageInfo('短信余额不足，请充值后开启', 'error')
        return;
      }
      const text = Number(value) ? '开启' : '关闭';
      this.$fetch('noticeConfigEdit', {
        webinar_id: this.$route.params.str,
        phone_verify_status: Number(value)
      }).then(res => {
        if (res.code === 200) {
          this.msgInfo.config_info.phone_verify_status = value
          this.$message({
            message:  `${ text }成功`,
            showClose: true, // 是否展示关闭按钮
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else {
          this.msgInfo.config_info.phone_verify_status = !value;
        }
      }).catch(err => {
        this.$message({
          message:   `${ text }失败`,
          showClose: true, // 是否展示关闭按钮
          type: 'error', //  提示类型
          customClass: 'zdy-info-box' // 样式处理
        });
        this.msgInfo.config_info.phone_verify_status = !value;
      });
    },
    // 刷新界面数据
    reloadAjax() {
      this.getNoticePageList()
    },
    // 打开弹窗
    openDialog(type) {
      this[`${type}DialogVisible`] = true
    },
    // 关闭链接弹窗
    closeDialog(obj) {
      this[`${obj.type}DialogVisible`] = false
      if (obj.content) {
        // 有传递值就重置
        this.msgInfo[type] = obj.content
      }
    },
    // 保存签名
    noticeConfigEdit(type) {
      if (type == 'cancel') {
        this.isSignShow = true;
        return;
      }
      if (this.inputSign.length > 15 || this.inputSign.length < 2) {
        this.messageInfo(`短信签名，长度2-12个字符`, 'error')
        if (!this.inputSign) {
          this.inputSign = '微吼直播'
        }
        return
      }
      this.$fetch('noticeConfigEdit', {
        webinar_id: this.$route.params.str,
        sms_sign: this.inputSign || '微吼直播'
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message:  `保存成功`,
            showClose: true, // 是否展示关闭按钮
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          this.isSignShow = true;
          // 刷新界面数据
          this.reloadAjax()
        }
      }).catch(err => {
        this.$message({
          message:  `${err.msg || '保存失败'}`,
          showClose: true, // 是否展示关闭按钮
          type: 'error', //  提示类型
          customClass: 'zdy-info-box' // 样式处理
        });
      });
    },
    // 取消保存签名
    cancelSaveMsgSign() {
      this.isSignShow = true
      this.msgInfo.msg = this.showSignText
    },
    // 获取基本信息
    getLiveDetail(id) {
      this.loading = true
      return this.$fetch('getWebinarInfo', { webinar_id: id })
        .then((res) => {
          this.liveDetailInfo = res.data
        })
        .catch((res) => {
          this.messageInfo(res.msg || '获取信息失败', 'error')
          console.log(res)
        })
        .finally(() => {
          this.loading = false
        })
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
      const titleList = ['', '预约/报名成功通知', '开播提醒', '回放通知', '关注成功通知', '开播提醒', '回放通知']
      const subTitleList = ['','','','','直播关注成功通知','预约的直播即将开始', '预约直播已设置回放']
      const descList = ['','预约/报名后发送','', '设置回放后发送', '关注成功后发送', '', '设置回放后发送']
      msgInfo.list.map(item => {
        item.title = titleList[item.config_type]
        item.subTitle = subTitleList[item.config_type]
        item.desc = descList[item.config_type]
        item.is_allow_set = item.config_type < 4 ? true : false
        item.notice_switch = !!item.notice_switch
        if (item.config_type > 3) {
          item.content = [
            {
              label: '直播标题',
              value: this.liveDetailInfo.subject
            },
            {
              label: '开播时间',
              value: this.liveDetailInfo.start_time
            }
          ]
        } else {
          // item.content_str = item.content.replace('${sms_sign}', msgInfo.config_info.sms_sign).replace('${url}', '')
          item.content_str = item.content.replace('${sms_sign}', msgInfo.config_info.sms_sign).replace(new RegExp(item.short_url, 'g'), '')
        }
      })
      return msgInfo
    },
    // 获取开播提醒内容
    getNoticePageList() {
      this.$fetch('getNoticePageList', {
        webinar_id: this.$route.params.str
      }).then(res => {
        let msgInfo = res.data
        msgInfo = this.joinNoticeItemStatic(msgInfo)
        this.msgInfo = msgInfo
        this.showSignText = msgInfo.config_info.sms_sign || '微吼直播'
      }).catch(res => {
        this.messageInfo(res.msg || '获取信息失败', 'error')
        this.msgInfo = {config_info: {}, list: []}
      });
    },
    // 获取短信套餐余额
    getSmsBalance() {
      return this.$fetch('getVersionInfo', { user_id: this.userId})
      .then((res) => {
        if (res.code == 200 && res.data) {
          this.versionInfo = res.data;
        } else {
          this.versionInfo = {}
        }
      })
      .catch((res) => {
        this.messageInfo(res.msg || '获取信息失败', 'error')
        console.log(res)
        this.versionInfo = {}
      })
    }
  },
  async created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    await this.getSmsBalance();
    await this.getLiveDetail(this.$route.params.str)
    this.getNoticePageList()
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.msg-notification-page {
  /deep/.titleBox {
    margin-bottom: 28px;
    .balance__right {
      margin-left: auto;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: right;
      color: #1A1A1A;
    }
    .color-blue {
      color:#3562FA;
    }
    .color-red {
      color:#FB2626;
    }
    .saasicon_help_m {
      color: #666666;
    }
  }
  .msg-notification__body {
    background: #FFFFFF;
    min-height: 549px;
    padding: 24px 24px;
    border-radius: 4px;
  }
  .msg-notification__top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 14px 24px;
    background: #F5F5F5;
    border-radius: 4px;
    line-height: 28px;
    .switchBox {
      margin-left: auto;
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
        color: #1A1A1A;
        margin-right: 8px;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
      .is_no_edit {
        color: rgba(0, 0, 0, 0.65);
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
        color: #FB2626;
        &:hover {
          color: #D4151C;
        }
      }
      /deep/.zdy-theme-gray {
        color: rgba(0, 0, 0, 0.65);
        &:hover {
          color: rgba(0, 0, 0, 0.85);
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
        color: #3562FA;
        padding-left: 10px;
      }
      .color-red {
        color: #FB2626;
      }
      .base_title_balance {
        font-size: 14px;
        line-height: 22px;
        color: #FB2626;
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
