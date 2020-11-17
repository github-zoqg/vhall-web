<template>
  <span class="line"></span>
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
.line {
  display: block;
  margin: 5px;
  border-bottom: 1px solid #cdcdcd;
}
</style>
