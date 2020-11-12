<template>
  <div unit-type="1" class="unit-templet img active" title="图文">
    <div class="content"><p>默认图文</p></div>
    <i class="menu-icon del"></i>
  </div>
</template>

<script>
export default {
name: "showImgLink.vue"
};
</script>

<style lang="less" scoped>
.unit-templet {
  position: relative;
  box-sizing: border-box;
  border: dashed 1px #eee;
  padding: 5px;
  margin: 10px 10px;
  word-wrap: break-word;
  &.active,&:hover {
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
  }
  .content {
    line-height: 1.5;
    color: #666;
    font-size: 12px;
  }
}
.del {
  position: absolute;
  display: block;
  top: -20px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(../../../common/images/custom-tab/delete_icon.png) !important;
  background-size: cover;
  background-position: 100% 100%;
  margin: 8px auto 0 auto;
}
</style>
