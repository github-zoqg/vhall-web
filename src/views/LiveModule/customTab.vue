<template>
  <div>
    <div class="title--cus-tab">
      <page-title title="自定义菜单">
        <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      </page-title>
      <el-button type="primary" plain>主要按钮</el-button>
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

<style scoped>

</style>
