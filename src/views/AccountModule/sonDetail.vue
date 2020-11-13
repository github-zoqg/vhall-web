<template>
  <div>
    <pageTitle title="子账号信息"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <ul>
        <li>账号ID：v16421616</li>
        <li>账号昵称：火锅</li>
        <li>账号角色：默认角色</li>
        <li>用量分配：并发（动态）</li>
        <li>手机号码：13390871423</li>
        <li>邮箱地址：--</li>
      </ul>
      <div class="top-item">
        <el-button>复制信息</el-button>
      </div>
    </div>
    <div class="page--son">
      <!-- 子账号Tab区域 -->
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="日期统计" name="dateData"></el-tab-pane>
        <el-tab-pane label="直播统计" name="liveData"></el-tab-pane>
      </el-tabs>
      <!-- 列表区域 -->
      <date-data ref="dateDataComp" v-show="tabType === 'dateData'"></date-data>
      <live-data ref="liveDataComp" v-show="tabType === 'liveData'"></live-data>

    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import DateData from './components/dateData';
import LiveData from './components/liveData';
export default {
  name: 'sonDetail.vue',
  components: {
    PageTitle,
    DateData,
    LiveData
  },
  data() {
    return {
      tabType: null,
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    }
  },
  mounted() {
    this.tabType = 'dateData';
    this.$refs[`dateDataComp`].initComp();
  }
};
</script>

<style lang="less" scoped>
.page--son {
  .layout--right--main();
  .min-height();
}
.title--flex--top {
  .layout--right--main();
  .min-height--header();
  .flex-display();
  .justify(space-between);
  .align(center);
  text-align: left;
  margin-bottom: 24px;
  .top-item {
    width: 33%;
    padding-left: 40px;
  }
  p {
    font-size: @font_size_14;
    font-family: @fontRegular;
    font-weight: 400;
    color: @font_color_h3;
    line-height: 20px;
    &:last-child {
      margin-top: 6px;
      font-size: @font_size_30;
      font-family: @fontDINAL;
      font-weight: bold;
      color: @font_color_h1;
      line-height: 35px;
    }
  }
}
</style>
