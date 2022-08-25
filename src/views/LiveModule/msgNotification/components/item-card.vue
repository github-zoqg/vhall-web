<template>
  <div class="item-card">
    <!-- 卡片顶部区域（图标、文案、开关） -->
    <div class="item-card-top">
      <label>
        <img src="../../../../common/images/icon/icon_appointment@2x.png" alt="">
      </label>
      <span>{{info.title || ''}}</span>
      <vh-switch
        v-model="cardInfo.notice_switch"
        active-text=""
        @change="switchChangeOpen">
      </vh-switch>
    </div>
    <!-- 卡片中间区域（内容区域） -->
    <div :class="`item-card-center ${info && info.config_type == 1 ? 'css_flex' : ''}`">
      <!-- 情况一： 短信活动内容区域：短链接形式 + 发送状态 -->
      <template v-if="!(info.content instanceof Array)">
        <div>{{info.content_str}} <vh-link type="primary" :underline="false" @click="openDialog('link')">短链接</vh-link></div>
        <p v-if="info && info.config_type == 2"  class="item-card_start">
          <span class="item-card_start_timer">{{  baseStartText }}</span>
          <span class="item-card_start_status">未发送</span>
        </p>
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
    {{info}}
    <div class="item-card-bottom">
      <template v-if="info && info.config_type == 5">
        <el-select v-model="selectVal" placeholder="请选择">
          <el-option
            v-for="item in [{
              label: '开播前10分钟',
              value: 15
            },{
              label: '开播前30分钟',
              value: 0.5
            },{
              label: '开播前1小时',
              value: 1
            },{
              label: '开播前2小时',
              value: 2
            },{
              label: '开播前1天',
              value: 24
            }]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template v-else-if="info && info.config_type != 2">
        <span>{{info && info.desc ? info.desc : ''}}</span>
      </template>
      <template v-if="info && [3,5,6].includes(info.config_type)">
        <span class="margin-l10">已发送</span>
      </template>
      <template v-else>
        <span class="margin-l10"></span>
      </template>
      <template v-if="info && info.is_allow_set">
        <span class="color-blue color-blue__r10" @click="openSetDialog">发送设置</span>
      </template>
      <template>
        <span class="color-blue" @click="openNoticeDialog">发送记录</span>
      </template>
    </div>
    <!-- 发送设置 -->
    <send-set v-if="setVisible" :visible="setVisible" @close="handleSetClose" @saveChange="saveChange"></send-set>
    <!-- 发送记录 -->
    <send-notice-list v-if="noticeVisible" :visible="noticeVisible" @close="handleNoticeClose"></send-notice-list>
    <!-- 配置短链接  -->
    <link-dialog v-if="linkDialogVisible" :link="info.link" :visible="linkDialogVisible" @close="closeDialog"></link-dialog>
  </div>
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
      info: {
        type: Object,
        default: function() {
          return {}
        }
      },
      configInfo: {
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
        const sendTimerList = this.info.send_timer.split(',')
        if (this.info.config_type == 2 && sendTimerList.length > 0) {
          return  '已设置多个时间点'
        } else {
          return `直播前${this.covertTimerText(sendTimerList[0])}`
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
        if(timers == 0.5) {
          return '30分钟'
        } else if(timers == 0.25) {
          return '15分钟'
        } else if(timers == 1) {
          return '1小时'
        } else if(timers == 2) {
          return '2小时'
        } else if(timers == 24) {
          return '1天'
        } else if(timers == 72) {
          return '3天'
        } else {
          return ''
        }
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
        this.cardInfo.notice_switch = !value;
        if (this.configInfo.balance == 0 && value) {
          this.messageInfo('短信余额不足，请充值后开启', 'error')
          this.$emit('changeSwitch');
          return;
        } else {
          // 存储数据
          this.$fetch('saveSendSet', {
            webinar_id: this.$route.params.str,
            notice_switch: Number(value) // 1=开，0=关（默认）
          }).then(res => {
            if (res.code === 200) {
              this.cardInfo.notice_switch = value;
              this.$emit('changeSwitch', value);
            } else {
              this.cardInfo.notice_switch = !value;
            }
          }).catch(err => {
            this.cardInfo.notice_switch = !value;
            console.log('修改卡片状态失败', err)
          });
        }
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
  border: 1px solid #eaeaea;
}
.item-card-top {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
.item-card-center {
  padding: 0 10px;
  height: 100px;
  line-height: 20px;
  &.css_flex {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .item-card_subTitle {
    margin-bottom: 10px;
  }
  .item-card_ct_item {
    margin-bottom: 10px;
  }
  .item-card_start_timer {
    font-size: 12px;
  }
  .item-card_start_status {
    margin-left: 20px;
    font-size: 12px;
  }
}
.item-card-bottom {
  margin-top: 20px;
  padding: 0 10px;
  height: 52px;
  border-top: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  .color-blue {
    color: #3562FA;
    cursor: pointer;
  }
  .color-blue__r10 {
    margin-right: 10px;
  }
  .margin-l10 {
    margin-left: 10px;
    margin-right: auto;
  }
}
</style>
