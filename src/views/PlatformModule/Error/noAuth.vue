<template>
  <div class="no-auth">
     <img src="../../../common/images/v35-webinar.png" />
     <p>控制台标志为高级功能，开通后您可以替换为您的品牌标志。<br/>联系您的客户经理获取权限后方可使用。</p>
      <div class="">
        <el-button type="primary" round @click.prevent.stop="openKfUrl">联系客服</el-button>
      </div>
  </div>
</template>

<script>
import env from '@/api/env';
export default {
  name: "nullPage.vue",
  methods: {
    openKfUrl() {
      window.open(env.staticLinkVo.kf, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
.no-auth {
  text-align: center;
  line-height: 2.5;
}
</style>
