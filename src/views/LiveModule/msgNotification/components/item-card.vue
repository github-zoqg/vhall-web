<template>
  <div class="item-card">
    <!-- 卡片顶部区域（图标、文案、开关） -->
    <div class="item-card-top">
      <label>
        <img src="../../../../common/images/icon/icon_appointment@2x.png" alt="">
      </label>
      <span>{{info.title || ''}}</span>
      <div class="switchBox">
        <el-switch
          class="swtich"
          v-model="info.is_open"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          active-text="">
        </el-switch>
      </div>
    </div>
    <!-- 卡片中间区域（内容区域） -->
    <div :class="`item-card-center ${info && info.iconType == 'base_start' ? 'css_flex' : ''}`">
      <!-- 情况一： 短信活动内容区域：短链接形式 + 发送状态 -->
      <template v-if="!(info.content instanceof Array)">
        <div>{{info.content}}<a :href="info.link">短链接</a></div>
        <p v-if="info && info.iconType == 'base_start'"><span>直播前15分钟</span><span>未发送</span></p>
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
      <template v-if="info && info.iconType != 'base_start'">
        <span>{{info && info.desc ? info.desc : ''}}</span>
      </template>
      <template v-if="info && info.iconType === 'wx_start'">
        <el-select v-model="selectVal" placeholder="请选择">
          <el-option
            v-for="item in [{
              label: '开播前15分钟',
              value: 15
            },{
              label: '开播前30分钟',
              value: 30
            },{
              label: '开播前1小时',
              value: 60
            },{
              label: '开播前2小时',
              value: 120
            },{
              label: '开播前1天',
              value: 1440
            },{
              label: '开播前3天',
              value: 4320
            }]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template v-if="info && ['base_playback', 'wx_start', 'wx_playback'].includes(info.iconType)">
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
    <send-set v-if="setVisible" :visible="setVisible" @close="hanldeSetClose"></send-set>
    <!-- 发送记录 -->
    <send-notice-list v-if="noticeVisible" :visible="noticeVisible" @close="hanldeNoticeClose"></send-notice-list>
  </div>
</template>
<script>
  import SendSet from './send-set.vue'
  import SendNoticeList from './send-notice-list.vue'
  export default {
    data() {
      return {
        setVisible: false,
        noticeVisible : false,
        selectVal: 15
      }
    },
    props: {
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
    components: {
      SendSet,
      SendNoticeList
    },
    created() {
    },
    methods: {
      hanldeSetClose() {
        this.setVisible = false
      },
      hanldeNoticeClose() {
        this.noticeVisible = false
      },
      openSetDialog() {
        this.setVisible = true;
      },
      openNoticeDialog() {
        this.noticeVisible = true;
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
