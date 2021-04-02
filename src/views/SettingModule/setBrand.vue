<template>
  <div>
    <pageTitle pageTitle="品牌设置"></pageTitle>
    <div class="brand--set">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="标识设置" name="signSet" v-if="perssionInfo['ui.brand_setting'] > 0"></el-tab-pane>
        <el-tab-pane label="皮肤设置" name="skinSet" v-if="perssionInfo['webinar_skins']> 0"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <sign-set ref="signSetComp" v-show="tabType === 'signSet'"  v-if="perssionInfo['ui.brand_setting'] > 0"  :brandConfig="true"></sign-set>
      <skin-set ref="skinSetComp" v-show="tabType === 'skinSet'" v-if="perssionInfo['webinar_skins'] > 0" :brandConfig="true"></skin-set>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../LiveModule/components/signSet';
import SkinSet from '../LiveModule/components/skinSet';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "brandMgr.vue",
  components: {
    PageTitle,
    SignSet,
    SkinSet,
  },
  data() {
    return {
      tabType: null,
      type: 2,
      perssionInfo: JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')),
    };
  },
  created() {
    if (this.perssionInfo['ui.brand_setting'] > 0) {
      this.tabType = 'signSet'
    } else {
      this.tabType = 'skinSet'
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.type = 2;
      this.$refs[`${this.tabType}Comp`].initComp();
    }
  },
  mounted() {
    this.$refs[`${this.tabType}Comp`].initComp();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.brand--set {
  .layout--right--main();
  .min-height();
  /deep/.el-radio__inner{
    width: 16px;
    height: 16px;
    &::after{
      width: 8px;
      height: 8px;
    }
  }
}
</style>

