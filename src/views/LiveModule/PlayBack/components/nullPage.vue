<template>
  <div class="null-page" :style="{ marginTop: height + 'px' }">
    <div class="createActive">
      <img src="../images/nullData.png" class="no-create" alt="" />
      <p class="null-info" v-html="text"></p>
      <div class="btn-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nullPage.vue',
    props: {
      nullType: {
        type: String,
        default: 'search'
      },
      text: {
        type: String,
        default: '暂无数据'
      },
      height: {
        type: Number,
        default: 145
      },
      noSearchText: {
        type: String,
        default: '暂无搜索到您想要的内容'
      }
    }
  };
</script>

<style lang="less" scoped>
  .null-page {
    text-align: center;
    // margin-top: 100px;
  }
  .no-search {
    width: 130px;
  }
  .search {
    padding-bottom: 100px;
  }
  .no-show {
    margin: 230px 0 27px 0;
  }
  .no-create {
    // margin: 185px 0 27px 0;
    width: 130px;
  }
  .null-info {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-top: 8px;
  }
  .createActive {
    padding-bottom: 30px;
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
