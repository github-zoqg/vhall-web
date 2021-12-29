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
      lowerGradeInterval: null,
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
  beforeDestroy() {
    if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.type = 2;
      this.$refs[`${this.tabType}Comp`].initComp();
    },
    handleLowerGradeHeart() {
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == sessionOrLocal.get('userId')) : null;
        console.log('777777777', res)
        if (activityConfig) {
          this.setLowerGradeConfig(activityConfig.permissions)
        } else if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions)
        }
      });
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      const permission = sessionOrLocal.get('SAAS_VS_PES', 'localStorage')
      this.permissionInfo = Object.assign(permission, data)
      if (this.perssionInfo['ui.brand_setting'] > 0) {
        this.tabType = 'signSet'
      } else {
        this.tabType = 'skinSet'
      }
      this.$refs[`${this.tabType}Comp`].initComp();
    },
  },
  mounted() {
    this.$refs[`${this.tabType}Comp`].initComp();
    // this.handleLowerGradeHeart()
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.brand--set {
  // .layout--right--main();
  .min-height();
  width: 100%;
  height: auto;
  background: #FFFFFF;
  border-radius: 4px;
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

