<template>
  <div data-unit-type="6" class="unit-templete img active" title="图片链">
    <a>
      <img src="//cnstatic01.e.vhall.com/static/images/menu/image-unit.png" alt=""/>
    </a>
    <i class="menu-icon del"></i>
  </div>
</template>

<script>
export default {
name: "showImgLink.vue"
};
</script>

<style lang="less" scoped>
.unit-templete {
  position: relative;
  box-sizing: border-box;
  border: dashed 1px #eee;
  padding: 5px;
  word-wrap: break-word;
  min-height: 32px;
  margin: 10px;
  &.active, &:hover {
    cursor: pointer;
    -webkit-transition: border .3s;
    transition: border .3s;
    border: 1px dashed #58ABFF;
    background: rgba(88,171,255,0.1);
  }
}
.img img {
  display: inline-block;
  margin: 0 auto;
  width: 100%;
}
.num-icon {
  display: inline-block;
  background-size: cover;
  background-position: 100% 100%;
  width: 20px;
  height: 20px;
  vertical-align: -4px;
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
  z-index: 5;
}
</style>
