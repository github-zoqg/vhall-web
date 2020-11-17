<template>
  <h5 class="unit-title">默认标题</h5>
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
.unit-title:before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #fc5659;
  vertical-align: -3px;
  margin-right: 4px;
}
</style>
