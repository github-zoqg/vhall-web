<template>
  <div class="living_setting">
    <pageTitle pageTitle="直播间设计器">
      <div class="living_setting_tip">
        <p class="switch__box" v-show="tabType!='customSet'">
        <el-switch
          v-model="livingSettingOpen"
          active-color="#999"
          inactive-color="#999"
          @change="closeLivingSettingOpen"
          :active-text="reservationDesc">
        </el-switch>
        <span @click="toSettingDetail">查看账号下{{ permissionInfo['ui.brand_setting'] == 1 ? '品牌' : ''}}直播间设计器</span>
      </p>
      </div>
    </pageTitle>
    <div class="living_setting_container">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="直播间设计器" name="livingSet"></el-tab-pane>
        <el-tab-pane label="自定义菜单" name="customSet" v-if="isCustomSetting"></el-tab-pane>
        <el-tab-pane label="标识设置" name="signSet" v-if="permissionInfo['ui.brand_setting'] > 0"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <!-- 直播间设置 -->
      <living-set ref="livingSet" v-show="tabType === 'livingSet'" :livingConfig="type"></living-set>
      <!-- 自定义菜单 -->
      <customer-tab ref="customSet" v-show="tabType === 'customSet'" v-if="isCustomSetting"></customer-tab>
      <!-- 标识设置 -->
      <sign-set ref="signSet" v-show="tabType === 'signSet'"  v-if="permissionInfo['ui.brand_setting'] > 0" :brandConfig="type" :brandType="1"></sign-set>
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
      livingSettingOpen: false,
      type: 2,
      isCustomSetting: true, //是否有自定义菜单
      permissionInfo: JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')),
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
    reservationDesc() {
      if(this.livingSettingOpen){
        return `已开启，使用当前活动【直播间设计器】${this.permissionInfo['ui.brand_setting'] == 1 ? '和【标识设置】' : ''}`;
      }else{
        return `开启后，将使用当前活动【直播间设计器】${this.permissionInfo['ui.brand_setting'] == 1 ? '和【标识设置】' : ''}`;
      }
    }
  },
  created() {
    this.userId = sessionOrLocal.get('userId');
    this.getPermission();
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.tab, event, this.tabType);
      this.$refs[this.tabType].initComp();
    },
    // 获取配置项
    getPermission() {
      this.$fetch('planFunctionGet', {webinar_id: this.$route.params.str, webinar_user_id:  this.userId, scene_id: 1}).then(res => {
        if(res.code == 200) {
          let permissions = JSON.parse(res.data.permissions)
          this.permissionInfo = permissions;
          // 判断自定义菜单是否存在
          let arr = [
            'component_1',
            'component_2',
            'component_3',
            'component_4',
            'component_5',
            'component_6',
            'component_7',
            'component_8',
            'component_9',
          ]
          this.isCustomSetting = arr.some((item) => {
            return this.permissionInfo[item] > 0
          })
          this.livingSettingOpen = Boolean(permissions['is_brand_cofig'] == 1)
          this.type = this.livingSettingOpen ? 1 : 2;
          this.$refs[this.tabType].initComp();
        }
      }).catch(e => {});
    },
    closeLivingSettingOpen() {
       let params = {
        webinar_id: this.$route.params.str,
        permission_key: 'is_brand_cofig',
        status: Number(this.livingSettingOpen)
      };
      console.log('当前参数传递：', params);
      this.$fetch('planFunctionEdit', params).then(res => {
        if (this.livingSettingOpen) {
          this.type = 1;
        } else {
          this.type = 2;
          this.$message({
            message:"正在使用账号下直播间设计器",
            showClose: true,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
        }
        this.$refs[this.tabType].initComp();
      }).catch(res => {
        this.$message({
          message: res.msg || `操作失败`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 查看账号下设置
    toSettingDetail() {
      const { href } = this.$router.resolve({path:'/setting/brand'});
      window.open(href, '_blank');
    },
  }
}
</script>
<style lang="less" scoped>
  .living_setting{
    &_tip{
      color: #999;
      font-size: 14px;
      span{
        color: #3562FA;
        cursor: pointer;
        vertical-align: middle;
      }
      /deep/.el-switch__label {
        color: #999;
        &.is-active{
          color: #999;
        }
      }
    }
    &_container {
      background: #fff;
      // padding: 12px 24px;
    }
  }
</style>
