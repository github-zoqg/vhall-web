<template>
  <img class="rq-code" src="//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/808780981" data-hrc="//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/808780981" alt="" />
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
.rq-code {
  display: block;
  width: 150px !important;
  margin: 0 auto;
}
</style>
