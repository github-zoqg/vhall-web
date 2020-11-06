<template>
  <div>
    <div class="title--cus-tab">
      <page-title title="自定义菜单">
        <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      </page-title>
      <div>
        <el-button type="primary" round>预览</el-button>
        <el-link type="info" :underline=false href="http://www.vhall.com/saas/doc/1457.html" target="_blank" class="link__left">使用帮助</el-link>
      </div>
    </div>
    <!-- 菜单布局区域 -->
    <div class="panel__cus">
      <div class="panel__left">
        <div></div>
      </div>
      <div class="panel__right"></div>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/views/LiveModule/components/pageTitle";
export default {
  name: "customTab.vue",
  components: {PageTitle}
};
</script>

<style lang="less" scoped>

.title--cus-tab {
  .flex-display();
  .justify(space-between);
}
.link__left {
  margin-left: 20px;
}
</style>
