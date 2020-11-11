<template>
  <div class="interaction-data">
    <div class="title-data">
      <span>数据报告</span>
    </div>
    <title-data :isStatus="status"></title-data>
    <base-data :isStatus="status"></base-data>
  </div>
</template>
<script>
import titleData from './components/title';
import baseData from './components/baseData';
export default {
  components: {
    titleData,
    baseData
  },
  data() {
    return {
      status: 1
    };
  },
};
</script>
<style lang="less" scoped>
.interaction-data {
  .title-data {
    margin: 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
}
</style>
