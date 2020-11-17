<template>
  <div class="content"><p>默认图文</p></div>
</template>

<script>
export default {
  name: "showImgLink.vue",
  props: {
    // 当前展示组件下标
    p_show_comps_index: {
      type: Number
    },
    // 组件专属ID
    component_id: {
      type: Number
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  line-height: 1.5;
  color: #666;
  font-size: 12px;
}
</style>
