<template>
  <vh-card shadow="hover" class="item-card">
    <!-- 卡片顶部区域（图标、文案、开关） -->
    <div class="item-card-top">
      <label class="item-card-top__icon">
        <img src="../images/msg1.svg" v-show="info.config_type == 1"/>
        <img src="../images/msg2.svg" v-show="info.config_type == 2"/>
        <img src="../images/msg3.svg" v-show="info.config_type == 3"/>
      </label>
      <span class="item-card-top__title">{{info.title || ''}}</span>
      <vh-switch
        v-model="cardInfo.notice_switch"
        active-text=""
        @change="switchChangeOpen"
        size="mini">
      </vh-switch>
    </div>
    <!-- 卡片中间区域（内容区域） -->
    <div :class="`item-card-center ${info && info.config_type == 1 ? 'css_flex' : ''}`">
      <!-- 情况一： 短信活动内容区域：短链接形式 + 发送状态 -->
      <template v-if="!(info.content instanceof Array)">
        <div class="item-card-center__ctx">{{ info.content_str_min }} <span @click="openDialog('link')" class="item-card-center__link">{{ hideString(info.short_url, 20)}}</span></div>
      </template>
      <!-- 情况而： 微信活动内容区域 -->
      <template v-else>
        <p v-if="info && info.subTitle" class="item-card_subTitle">{{info.subTitle}}</p>
        <div>
          <p v-for="(subItem, subIndex) in info.content" :key="`t-item-${subIndex}`" class="item-card_ct_item"><label>{{subItem.label}}</label><span>{{subItem.value}}</span></p>
        </div>
      </template>
    </div>
    <!-- 卡片底部区域 -->
    <div class="item-card-bottom">
      <div class="item-card-bottom__default">
        <!-- 发送状态（未发送 or 已设置多个时间点/发送时间 等） -->
        <p v-if="info && info.config_type == 2"  class="item-card_start">
          <span class="item-card_start_timer">{{  baseStartText }}</span>
          <!-- 1=已发送，0=未发送（默认），2=发送中 ，3=已过时-->
          <span class="item-card_start_status" v-if="info.send_status == 1"><img src="../images/fill-success.svg"/>已发送</span>
          <span class="item-card_start_status" v-else-if="info.send_status == 2"><img src="../images/fill-send.svg"/>发送中</span>
          <span class="item-card_start_status" v-else-if="info.send_status == 3"><img src="../images/fill-warning.svg"/>已过时</span>
          <span class="item-card_start_status" v-else><img src="../images/fill-wait.svg"/>未发送</span>
        </p>
        <!-- 微信：设置时间 -->
        <template v-if="info && info.config_type == 5">
          <el-select v-model="selectVal" placeholder="请选择">
            <el-option
              v-for="item in [{
                label: '开播前10分钟',
                value: 600
              },{
                label: '开播前30分钟',
                value: 1800
              },{
                label: '开播前1小时',
                value: 3600
              },{
                label: '开播前2小时',
                value: 7200
              },{
                label: '开播前1天',
                value: 86400
              }]"
              :key="item.value"
              :label="item.value">
               {{item.label}}
            </el-option>
          </el-select>
        </template>
        <!-- 默认卡片说明文案 -->
        <template v-else-if="info && info.config_type != 2">
          <span class="item-card_start_desc">{{info && info.desc ? info.desc : ''}}</span>
        </template>
        <!-- 发送状态（已发送） -->
        <template v-if="info && [3,5,6].includes(info.config_type)">
          <!-- 1=已发送，0=未发送（默认），2=发送中 ，3=已过时-->
          <span class="item-card_start_status" v-if="info.send_status == 1"><img src="../images/fill-success.svg"/>已发送</span>
          <span class="item-card_start_status" v-else-if="info.send_status == 2"><img src="../images/fill-send.svg"/>发送中</span>
          <span class="item-card_start_status" v-else-if="info.send_status == 3"><img src="../images/fill-warning.svg"/>已过时</span>
          <span class="item-card_start_status" v-else><img src="../images/fill-wait.svg"/>未发送</span>
        </template>
        <template v-else>
          <span class="margin-l10"></span>
        </template>
      </div>
      <div class="item-card-bottom__hover">
        <template>
          <span class="margin-l10"></span>
        </template>
        <template v-if="info && info.is_allow_set">
          <vh-button type="primary" round size="mini" @click="openSetDialog">发送设置</vh-button>
        </template>
        <template>
          <vh-button round type="default" ghost size="mini" @click="openNoticeDialog">发送记录</vh-button>
        </template>
      </div>
    </div>
    <!-- 发送设置 -->
    <send-set v-if="setVisible" :visible="setVisible" :cardInfo="{
      webinar_id: info.webinar_id,
      config_type: info.config_type,
      notice_switch: cardInfo.notice_switch
    }" @close="handleSetClose" @saveChange="saveChange"></send-set>
    <!-- 发送记录 -->
    <send-notice-list v-if="noticeVisible" :visible="noticeVisible" @close="handleNoticeClose"></send-notice-list>
    <!-- 配置短链接  -->
    <link-dialog v-if="linkDialogVisible" :link="info.short_url" :visible="linkDialogVisible" @close="closeDialog"></link-dialog>
  </vh-card>
</template>
<script>
  import SendSet from './send-set.vue'
  import SendNoticeList from './send-notice-list.vue'
  import LinkDialog from './link-dialog.vue'
  export default {
    data() {
      return {
        setVisible: false, // 发送设置
        noticeVisible : false, // 发送记录
        linkDialogVisible: false, // 短链接
        selectVal: 15,
        cardInfo: null,
        vm: null
      }
    },
    props: {
      // 卡片单个信息
      info: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    provide: function() {
      return {
        app: this
      }
    },
    inject: ['noticeApp'], // 卡片对象
    computed: {
      baseStartText() {
        const sendTimerList = this.info.send_time.split(',')
        if (this.info.config_type == 2 && sendTimerList.length > 1) {
          return  '已设置多个时间点'
        } else {
          return `直播前${this.covertTimerText(sendTimerList[0])}发送`
        }
      }
    },
    components: {
      SendSet,
      SendNoticeList,
      LinkDialog
    },
    created() {
      this.cardInfo = this.info
    },
    methods: {
      // 转换时间文案
      covertTimerText(timers) {
        if(timers == 600) {
          return '10分钟'
        } else if(timers == 1800) {
          return '30分钟'
        } else if(timers == 3600) {
          return '1小时'
        } else if(timers == 7200) {
          return '2小时'
        } else if(timers == 86400) {
          return '1天'
        } else {
          return ''
        }
      },
      // 格式化字符串
      hideString(str, len) {
        return str.length > len ? str.substring(0, len) + '...' : str
      },
      handleSetClose() {
        this.setVisible = false
      },
      handleNoticeClose() {
        this.noticeVisible = false
      },
      openSetDialog() {
        this.setVisible = true;
      },
      openNoticeDialog() {
        this.noticeVisible = true;
      },
      switchChangeOpen(value) {
        if (this.noticeApp && this.noticeApp.smsBalance && this.noticeApp.smsBalance.sms == 0 && value == 1) {
          this.cardInfo.notice_switch = !value;
          this.messageInfo('短信余额不足，请充值后开启', 'error')
          // 开关改变，刷新界面数据
          this.$emit('changeSwitch');
          return;
        } else if (this.noticeApp && this.noticeApp.smsBalance && this.noticeApp.smsBalance.sms == 0 && value != 1) {
          this.messageInfo('短信余额不足，请充值后开启', 'error')
          // 开关改变，刷新界面数据
          const temp = setTimeout(() => {
            temp && clearTimeout(temp)
            this.changeNoticeSwitch(value)
          }, 1000)
        } else {
          this.changeNoticeSwitch(value);
        }
      },
      changeNoticeSwitch(value) {
        // 存储数据
        const text = Number(value) ? '开启' : '关闭';
        this.$fetch('saveSendSet', {
          webinar_id: this.$route.params.str,
          notice_switch: Number(value), // 1=开，0=关（默认）
          config_type: this.info.config_type
        }).then(res => {
          if (res.code === 200) {
            this.cardInfo.notice_switch = value;
            this.$message({
              message:  `${ text }成功`,
              showClose: true, // 是否展示关闭按钮
              type: 'success', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
            this.$emit('changeSwitch', value);
          } else {
            this.cardInfo.notice_switch = !value;
          }
        }).catch(err => {
          this.cardInfo.notice_switch = !value;
          this.$message({
            message:   `${ text }失败`,
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          console.log('修改卡片状态失败', err)
        });
      },
      // 打开弹窗
      openDialog(type) {
        if (type === 'link') {
         const short_url = this.info.short_url
         const isJoinStr = short_url.indexOf('https://') != -1 || short_url.indexOf('http://') != -1 || short_url.indexOf('//') != -1
         this.info.short_url && window.open(`${isJoinStr ? '' : '//'}${this.info.short_url}`, '_blank');
        } else {
          this[`${type}DialogVisible`] = true
        }
      },
      // 关闭链接弹窗
      closeDialog(obj) {
        this[`${obj.type}DialogVisible`] = false
        if (obj.content) {
          // 有传递值就重置
          this.msgInfo[type] = obj.content
        }
      },
      // 发送设置保存成功，更新卡片信息
      saveChange() {
        this.$emit('saveChange')
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
      }
    }
  }
</script>
<style lang="less" scoped>
.item-card {
  background: #FAFAFA;
  border: 1px solid #D9D9D9;
  .item-card-top {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 8px;
    &__icon {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
    }
    &__title {
      margin-left: 8px;
      margin-right: auto;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .item-card-center {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    text-align: justify;
    color: rgba(0, 0, 0, 0.65);
    padding-bottom: 16px;
    height: 76px;
    &.css_flex {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
    }
    &__ctx {
      word-break: break-all;
    }
    &__link {
      color: #1E4EDC;
      cursor: pointer;
      &:hover {
        color: #1E4EDC;
      }
    }
    .item-card_subTitle {
      margin-bottom: 10px;
    }
    .item-card_ct_item {
      margin-bottom: 10px;
    }
  }
  .item-card-bottom {
    height: 34px;
    /deep/.vh-card__body {
      padding: 20px;
    }
    .item-card-bottom__default {
      border-top: 1px solid #D9D9D9;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.65);
      padding-top: 14px;
      .item-card_start_timer {
        font-size: 12px;
      }
      .item-card_start_desc {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.65);
      }
      .item-card_start_status {
        margin-left: 8px;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);
        img {
          display: inline-block;
          width: 14px;
          height: 14px;
          vertical-align: middle;
          margin-right: 4px;
          margin-top: -2px;
        }
      }
    }
    .item-card-bottom__hover {
      border-top: 0;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      display: none;
      padding-top: 12px;
    }
    .color-blue {
      color: #1E4EDC;
      cursor: pointer;
    }
    .color-blue__r10 {
      margin-right: 10px;
    }
    .margin-l10 {
      margin-right: auto;
    }
  }
  &:hover {
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
    /deep/.vh-card__body {
      padding: 20px 20px 16px 20px;
    }
    .item-card-center {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-align: justify;
      color: rgba(0, 0, 0, 0.85);
    }
    .item-card-bottom {
      height: 38px;
      .item-card-bottom__default {
        display: none;
      }
      .item-card-bottom__hover {
        display: flex;
      }
    }
  }
}
</style>
