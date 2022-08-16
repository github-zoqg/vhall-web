<template>
  <div class="item-card">
    <!-- 卡片顶部区域（图标、文案、开关） -->
    <div class="item-card-top">
      <label>
        <img src="../../../../common/images/icon/icon_appointment@2x.png" alt="">
      </label>
      <span>{{itemInfo.title || ''}}</span>
      <div class="switchBox">
        <el-switch
          class="swtich"
          v-model="itemInfo.is_open"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          active-text="">
        </el-switch>
      </div>
    </div>
    <!-- 卡片中间区域（内容区域） -->
    <div class="item-card-center">
      <!-- 情况一： 短链接形式 -->
      <div>{{itemInfo.content}}<a :href="itemInfo.link">短链接</a></div>
      <!-- 情况二：短链接 + 底部状态栏 -->
      <!-- 情况三： 微信活动内容区域 -->
    </div>
    <!-- 卡片底部区域 -->
    <div>
      <!-- 情况一： 发送设置 & 发送记录 -->
      <!-- 情况二： 文案 + 发送记录-->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        itemInfo: null
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
    created() {
      console.log('当前数据', this.info)
      this.itemInfo = this.info
    }
  }
</script>
<style lang="less" scoped>
.item-card-top {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
