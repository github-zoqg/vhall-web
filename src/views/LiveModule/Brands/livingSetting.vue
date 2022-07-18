<template>
  <div class="living_setting">
    <pageTitle pageTitle="直播间设置">
      <p class="living_setting_tip" @click="toSettingDetail">查看账号下直播间设置</p>
    </pageTitle>
    <div class="living_setting_container">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="直播间设置" name="livingSet"></el-tab-pane>
        <el-tab-pane label="自定义菜单" name="customSet"></el-tab-pane>
        <el-tab-pane label="标识设置" name="signSet" v-if="perssionInfo['ui.brand_setting'] > 0"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <!-- 直播间设置 -->
      <living-set ref="customSet" v-show="tabType === 'livingSet'"></living-set>
      <!-- 自定义菜单 -->
      <customer-tab ref="customSet" v-show="tabType === 'customSet'"></customer-tab>
      <!-- 标识设置 -->
      <sign-set ref="signSet" v-show="tabType === 'signSet'"  v-if="perssionInfo['ui.brand_setting'] > 0"></sign-set>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../components/signSet';
import customerTab from '../CustomerTabView'; // 自定义菜单
import livingSet from '../components/livingSet.vue'
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'livingSetting',
  data() {
    return {
      tabType: 'livingSet',
      perssionInfo: JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')),
      webinarState: JSON.parse(sessionOrLocal.get("webinarState"))
    }
  },
  components: {
    PageTitle,
    SignSet,
    customerTab,
    livingSet,
    beginPlay
  },
  computed: {
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
    // this.$refs[`livingSet`].initComp();
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.tabType, event);
      this.$refs[this.tabType].initComp();
    },
    // 查看账号下设置
    toSettingDetail() {
      // TODO: 上报问题
      this.$vhall_paas_port({
        k: 100198,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      const { href } = this.$router.resolve({path:'/setting/living'});
      window.open(href, '_blank');
    },
  }
}
</script>
<style lang="less" scoped>
  .living_setting{
    &_tip{
      color: #3562fa;
      font-size: 14px;
      cursor: pointer;
    }
    &_container {
      background: #fff;
    }
  }
</style>
