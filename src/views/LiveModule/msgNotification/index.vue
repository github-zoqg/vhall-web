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
        短信余额：<strong :class="msgInfo.flower_balance > 0 ? 'color-blue' : 'color-red'">{{msgInfo.flower_balance}}</strong> 条
      </div>
    </pageTitle>
    <div class="msg-notification__body">
      <div class="msg-notification__top">
        <!-- <div>* 短信签名： {{msgInfo && msgInfo.sign ? msgInfo.sign : '微吼直播'}} <el-button type="text" @click="openDialog('sign')">修改</el-button> </div> -->
        <div class="msg-sign__top"  @blur.stop="cancelSaveMsgSign">* 短信签名：
          <span v-if="isSignShow">{{ showSignText }}</span>
          <VhallInput v-if="!isSignShow" v-model.trim="msgInfo.sign" autocomplete="off"  :maxlength="15" placeholder="请输入短信签名" show-word-limit class="btn-relative btn-two"></VhallInput>
          <i class="iconfont-v3 saasicon_help_m tip" @click.prevent="isSignShow = false;msgInfo.sign = showSignText" v-if="isSignShow"></i>
          <el-button type="primary" @click="saveMsgSign" v-if="!isSignShow" size="mini">保存</el-button>
        </div>
        <div class="switchBox">
          <el-switch
            class="swtich"
            v-model="msgInfo.is_open"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="switchChangeOpen"
            :active-text="msgInfo.is_open ? '关闭后，用户在预约时提交手机号无需进行短信验证（不含登录/报名）' : '开启后，用户在预约时提交手机号需要进行短信验证（不含登录/报名）'">
          </el-switch>
        </div>
      </div>
      <div class="msg-notification-center">
        <p class="title">
          <span>短信通知</span>
          <span class="base_title_send" v-if="msgInfo.send_count > 0">当前预计发送{{msgInfo && msgInfo.send_count ? msgInfo.send_count : 0}}条短信</span>
          <span class="base_title_balance" v-if="msgInfo.flower_balance == 0">余额不足，请联系您的专属客服充值</span>
        </p>
        <el-row :gutter="24" class="base_row">
          <!-- xs	<768px	超小屏 如：手机
          sm	≥768px	小屏幕 如：平板
          md	≥992px	中等屏幕 如：桌面显示器
          lg	≥1200px	大屏幕 如：大桌面显示器
          xl	≥1920px	2k屏等 -->
          <template v-for="(item, index) in baseSet">
            <el-col class="liveItem" :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="item && msgInfo[item.iconType]"  :key="`base-item-${index}`">
              <item-card :info="item" :msgInfo="msgInfo[item.iconType]" @changeSwitch="reloadAjax" @saveChange="reloadAjax"></item-card>
            </el-col>
           </template>
        </el-row>

        <p class="title">微信通知</p>
        <el-row :gutter="24" class="wx_row">
          <template v-for="(item, index) in wxSet">
            <el-col class="liveItem" :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="item"  :key="`wx-item-${index}`">
              <item-card :info="item" :msgInfo="msgInfo[item.iconType]" @changeSwitch="reloadAjax" @saveChange="reloadAjax"></item-card>
            </el-col>
           </template>
        </el-row>
      </div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
    <!-- 配置短信签名
    <sign-dialog v-if="signDialogVisible" :visible="signDialogVisible" @close="closeDialog"></sign-dialog>
    -->
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
import ItemCard from './components/item-card.vue'

// import SignDialog from './components/sign-dialog.vue'
export default {
  name: 'msgNotification',
  data() {
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      isLoading: false,
      vm: null,
      msgInfo: {
        flower_balance: 0, // 短信余额
        send_count: 400, // 预发短信条数
        is_open: false, // 是否开启
        sign: '', // 签名文案
        link: '', // 短链接
        base_subscribe: {},
        base_start: {},
        base_playback: {},
        wx_flower: {},
        wx_start: {},
        wx_playback: {}
      },
      // signDialogVisible: false,
      showSignText: '微吼直播',
      inputShowSignText: '',
      isSignShow: true,
      liveDetailInfo: {}, // 活动详情
      baseSet: [],
      wxSet: []
    }
  },
  provide: function() {
    return {
      noticeApp: this
    }
  },
  watch: {
    liveDetailInfo: {
      immediate: true, // 刷新加载 立马触发一次handler
      deep: true, // 可以深度检测到
      handler (n, o) {
        console.log(n, o)
        if (n) {
          this.baseSet = [
            {
              iconType: 'base_subscribe',
              title: '预约/报名成功通知',
              is_open: false,
              is_allow_set: true, // 是否包含发送设置功能
              content: `${this.showSignText}您已成功预约“${this.liveDetailInfo.subject}”，直播将于${this.liveDetailInfo.start_time}开播，请准时参加。点击进入`,
              link: this.msgInfo.link || `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
              desc: '预约/报名后发送',
              flower_balance: this.msgInfo.flower_balance
            },
            {
              iconType: 'base_start',
              title: '开播提醒',
              is_open: false,
              is_allow_set: true, // 是否包含发送设置功能
              content: `${this.showSignText}直播活动“${this.liveDetailInfo.subject}”将于${this.liveDetailInfo.start_time}开播，请准时参加。点击进入`,
              link: this.msgInfo.link || `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
              desc: '',
              flower_balance: this.msgInfo.flower_balance
            },
            {
              iconType: 'base_playback',
              title: '回放通知',
              is_open: false,
              is_allow_set: true, // 是否包含发送设置功能
              content: `${this.showSignText}直播活动“${this.liveDetailInfo.subject}”，已设置回放，点击进入`,
              link: this.msgInfo.link || `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
              desc: '设置回放后发送',
              flower_balance: this.msgInfo.flower_balance
            }
          ]
          this.wxSet = [
            {
              iconType: 'wx_flower',
              title: '关注成功通知',
              subTitle: '直播关注成功通知',
              is_open: false,
              is_allow_set: false, // 是否包含发送设置功能
              content: [
                {
                  label: '直播标题',
                  value: this.liveDetailInfo.subject
                },
                {
                  label: '开播时间',
                  value: this.liveDetailInfo.start_time
                }
              ],
              desc: '关注成功后发送',
              flower_balance: this.msgInfo.flower_balance
            },
            {
              iconType: 'wx_start',
              title: '开播提醒',
              subTitle: '预约的直播即将开始',
              is_open: false,
              is_allow_set: false, // 是否包含发送设置功能
              content: [
                {
                  label: '直播标题',
                  value: this.liveDetailInfo.subject
                },
                {
                  label: '开播时间',
                  value: this.liveDetailInfo.start_time
                }
              ],
              desc: '',
              flower_balance: this.msgInfo.flower_balance
            },
            {
              iconType: 'wx_playback',
              title: '回放通知',
              subTitle: '预约直播已设置回放',
              is_open: false,
              is_allow_set: false, // 是否包含发送设置功能
              content: [
                {
                  label: '直播标题',
                  value: this.liveDetailInfo.subject
                },
                {
                  label: '开播时间',
                  value: this.liveDetailInfo.start_time
                }
              ],
              desc: '设置回放后发送',
              flower_balance: this.msgInfo.flower_balance
            }
          ]
        } else {
          this.baseSet = []
          this.wxSet = []
        }
      }
    }
  },
  components: {
    PageTitle,
    beginPlay,
    // SignDialog,
    ItemCard
  },
  methods: {
    // 开启\关闭报名表单开关
    switchChangeOpen(value) {
      if (this.msgInfo.flower_balance == 0 && value) {
        this.msgInfo.is_open = !value;
        this.messageInfo('短信余额不足，请充值后开启', 'error')
        return;
      }
      const text = value ? '开启' : '关闭';
      this.$fetch('editMsgPhoneValidateStatus', {
        webinar_id: this.webinar_id
      }).then(res => {
        if (res.code === 200) {
          this.msgInfo.is_open = value
          this.$message({
            message:  `${ text }成功`,
            showClose: true, // 是否展示关闭按钮
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        }
      }).catch(err => {
        this.$message({
          message:  `${ text }失败`,
          showClose: true, // 是否展示关闭按钮
          type: 'error', //  提示类型
          customClass: 'zdy-info-box' // 样式处理
        });
      });
    },
    // 刷新界面数据
    reloadAjax() {
      this.getMsgNotificationInfo()
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
    saveMsgSign() {
      if (!this.msgInfo.sign) {
        this.isSignShow = true
        return
      }
      this.$fetch('saveMsgSign', {
        webinar_id: this.$route.params.str,
        sign: this.msgInfo.sign
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message:  `保存成功`,
            showClose: true, // 是否展示关闭按钮
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          this.showSignText = this.msgInfo.sign
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
    // 获取开播提醒内容
    getMsgNotificationInfo() {
      // this.$fetch('getMsgNotificationInfo', {
      //   webinar_id: this.$route.params.str
      // }).then(res => {
      //   this.msgInfo = res.data
      // }).catch(err => {
      // });
      this.msgInfo = {
        flower_balance: 0, // 短信余额
        send_count: 500, // 预发短信
        is_open: false, // 是否开启
        sign: '', // 签名文案
        link: '', // 短链接
        base_subscribe: {},
        base_start: {
          set_timer: ['60', '30']
        },
        base_playback: {},
        wx_flower: {},
        wx_start: {},
        wx_playback: {}
      }
    }
  },
  async created() {
    await this.getLiveDetail(this.$route.params.str)
    this.getMsgNotificationInfo()
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.msg-notification-page {
  /deep/.titleBox {
    .balance__right {
      margin-left: auto;
    }
    .color-blue {
      color:#3562FA;
    }
    .color-red {
      color:#fb3a32;
    }
  }
  .msg-notification__body {
    background: #ffffff;
    min-height: 600px;
    padding-bottom: 40px;
    padding-top: 24px;
  }
  .msg-notification__top {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20px;
    .switchBox {
      margin-left: auto;
    }
    .msg-sign__top {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .el-input {
        width: 175px;
      }
    }
  }
  .msg-notification-center {
    margin-top: 10px;
    .title {
      font-size: 20px;
      color: #333333;
      border-left: 4px solid #fb3a32;
      line-height: 16px;
      height: 18px;
      margin: 32px 0 12px 20px;
      padding-left: 5px;
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
      padding: 0 20px;
    }
  }
}
</style>
