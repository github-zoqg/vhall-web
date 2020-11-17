<template>
  <a>
    <img class="img--ink--img" src="//cnstatic01.e.vhall.com/static/images/menu/image-unit.png" alt=""/>
  </a>
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
.img--ink--img{
  display: inline-block;
  margin: 0 auto;
  width: 100%;
}
</style>
