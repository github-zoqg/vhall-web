<template>
  <div data-unit-type="2" class="unit-templet rq-code active" title="二维码">
    <img src="//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/808780981" data-hrc="//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/808780981" alt="" />
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
  word-wrap: break-word;
  margin: 10px 10px;
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
.rq-code {
  img {
    display: block;
    width: 150px !important;
    margin: 0 auto;
  }
}
</style>
