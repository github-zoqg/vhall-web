<template>
  <div data-unit-type="7" class="unit-templete unit-title active" title="标题">
    <h5>默认标题</h5>
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
.unit-title h5:before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #fc5659;
  vertical-align: -3px;
  margin-right: 4px;
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
