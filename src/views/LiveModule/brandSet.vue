<template>
  <div>
    <pageTitle title="品牌设置"></pageTitle>
    <div class="brand--set">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="标识设置" name="signSet"></el-tab-pane>
        <el-tab-pane label="皮肤设置" name="skinSet"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <sign-set ref="signSetComp" v-show="tabType === 'signSet'"></sign-set>
      <skin-set ref="skinSetComp" v-show="tabType === 'skinSet'"></skin-set>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../LiveModule/components/signSet';
import SkinSet from '../LiveModule/components/skinSet';
export default {
  name: "brandSet.vue",
  components: {
    PageTitle,
    SignSet,
    SkinSet
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
    this.tabType = 'signSet';
    this.$refs[`signSetComp`].initComp();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.brand--set {
  .layout--right--main();
  .min-height();
}
</style>
