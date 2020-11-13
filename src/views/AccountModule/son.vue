<template>
  <div>
    <pageTitle title="子账号管理"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <div class="top-item">
        <p>总并发（方）</p>
        <p>8,888,888,888</p>
      </div>
      <div class="top-item">
        <p>子账号（个）</p>
        <p>8,888,888,888</p>
      </div>
      <div class="top-item">
        <p>活动数量（个）</p>
        <p>8,888,888,888</p>
      </div>
    </div>
    <div class="page--son">
      <!-- 子账号Tab区域 -->
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="子账号" name="sonList"></el-tab-pane>
        <el-tab-pane label="角色" name="roleList"></el-tab-pane>
      </el-tabs>
      <!-- 列表区域 -->
      <son-list ref="sonListComp" v-show="tabType === 'sonList'"></son-list>
      <role-list ref="roleListComp" v-show="tabType === 'roleList'"></role-list>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SonList from './components/sonList';
import RoleList from './components/roleList';
export default {
  name: 'son.vue',
  components: {
    PageTitle,
    SonList,
    RoleList
  },
  data() {
    return {
      tabType: null,
    };
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    }
  },
  mounted() {
    this.tabType = 'sonList';
    this.$refs[`sonListComp`].initComp();
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
