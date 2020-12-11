<template>
  <div class="null-page">
    <div v-if="nullType === 'search'">
      <img src="../../../common/images/sys/no-search.svg" class="no-search" />
      <p class="null-info">暂未搜索到您想要的内容</p>
    </div>
    <div v-else>
      <img src="../../../common/images/sys/no-create.svg" class="no-create" />
      <p class="null-info" v-html="text"></p>
      <div class="btn-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "nullPage.vue",
  props: {
    nullType: {
      type: String,
      default: 'search'
    },
    text: {
      type: String,
      default: '暂未设置该内容'
    }
  }
};
</script>

<style lang="less" scoped>
.null-page {
  text-align: center;
}
.no-search {
  margin: 137px 0 27px 0;
}
.no-create {
  margin: 185px 0 27px 0;
}
.null-info {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
}
.btn-list {
  margin-top: 32px;
  .el-button {
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
