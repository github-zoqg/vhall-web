<template>
  <div class="setting-living">
    <pageTitle pageTitle="直播间设计器"></pageTitle>
    <div class="setting-living_container">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="直播间设计器" name="livingSet"></el-tab-pane>
        <el-tab-pane label="标识设置" name="signSet" v-if="perssionInfo['ui.brand_setting'] > 0"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <!-- 直播间设置 -->
      <living-set ref="livingSet" v-show="tabType === 'livingSet'"></living-set>
      <!-- 标识设置 -->
      <sign-set ref="signSet" v-show="tabType === 'signSet'" :brandType="2"  v-if="perssionInfo['ui.brand_setting'] > 0"></sign-set>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../LiveModule/components/signSet';
import livingSet from '../LiveModule/components/livingSet.vue'
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'LivingSetting',
  data() {
    return {
      tabType: 'livingSet',
      perssionInfo: JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))
    }
  },
  components: {
    PageTitle,
    SignSet,
    livingSet
  },
  computed: {
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
  },
  mounted() {
    this.$refs.livingSet.initComp();
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.tabType, event);
      this.$refs[this.tabType].initComp();
    }
  }
}
</script>
<style lang="less" scoped>
  .setting-living{
    &_container{
      background: #fff;
      height: 100%;
    }
  }
</style>
