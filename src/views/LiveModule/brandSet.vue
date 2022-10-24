<template>
  <div>
    <pageTitle pageTitle="品牌设置">
      <div class="title_text">
        <p class="switch__box">
          <el-switch
            v-model="brandOpen"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="closeBrandOpen"
            :active-text="reservationDesc">
          </el-switch>
          <span @click="toSettingDetail">查看账号下品牌设置</span>
        </p>
      </div>
    </pageTitle>
    <div class="brand--set">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="标识设置" name="signSet" v-if="perssionInfo['ui.brand_setting'] > 0"></el-tab-pane>
        <el-tab-pane label="皮肤设置" name="skinSet" v-if="perssionInfo['webinar_skins']> 0"></el-tab-pane>
        <el-tab-pane label="观看协议" name="viewingProtocol" v-if="perssionInfo['watch.viewing_protocol']> 0"></el-tab-pane>
      </el-tabs>
      <!-- 设置区域 -->
      <sign-set ref="signSetComp" v-show="tabType === 'signSet'"  v-if="perssionInfo['ui.brand_setting'] > 0" :brandConfig="brandOpen"></sign-set>
      <skin-set ref="skinSetComp" v-show="tabType === 'skinSet'" v-if="perssionInfo['webinar_skins'] > 0" :brandConfig="brandOpen"></skin-set>
      <viewing-protocol ref="viewingProtocolComp" type="1" :tabType="tabType" v-if="perssionInfo['watch.viewing_protocol'] > 0 && tabType === 'viewingProtocol'" :brandConfig="brandOpen"></viewing-protocol>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../LiveModule/components/signSet';
import SkinSet from '../LiveModule/components/skinSet';
import ViewingProtocol from '../LiveModule/components/viewingProtocol';

import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "brandSet.vue",
  components: {
    PageTitle,
    SignSet,
    SkinSet,
    beginPlay,
    ViewingProtocol
  },
  data() {
    return {
      lowerGradeInterval: null,
      tabType: null,
      type: 0,
      userId: '',
      brandOpen: true,
      perssionInfo: JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')),
      perssionWebInfo: JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')),
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
    };
  },
  computed: {
    reservationDesc(){
      if(this.brandOpen){
        return '已开启，使用当前活动品牌设置';
      }else{
        return "开启后，将使用当前活动品牌设置";
      }
    },
    reservationDisable() {
      if (this.perssionWebInfo['ui.brand_setting'] > 0 || this.perssionWebInfo['webinar_skins'] > 0 || this.perssionWebInfo['watch.viewing_protocol'] > 0) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
    if (this.perssionInfo['ui.brand_setting'] > 0) {
      this.tabType = 'signSet'
    } else if(this.perssionInfo['webinar_skins'] > 0){
      this.tabType = 'skinSet'
    } else if(this.perssionInfo['watch.viewing_protocol'] > 0){
      this.tabType = 'viewingProtocol'
    }

  },
  beforeDestroy() {
    if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  },
  methods:{
    handleClick(tab, event) {
      console.log(this.tabType, event);
      if(this.tabType !== 'viewingProtocol'){
        this.$refs[`${this.tabType}Comp`].initComp();
      }
    },
    toSettingDetail() {
      if (this.reservationDisable) {
        this.$alert('尊敬的用户，您的账号无此权限。如需使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          lockScroll: false,
          customClass: 'zdy-message-box',
          callback: action => {}
        });
        return;
      }
      this.$vhall_paas_port({
        k: 100198,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      const { href } = this.$router.resolve({path:'/setting/brand'});
      window.open(href, '_blank');
    },
    // 获取配置项
    getPermission() {
      let userId = JSON.parse(sessionOrLocal.get("userId"));
      this.$fetch('planFunctionGet', {webinar_id: this.$route.params.str, webinar_user_id: userId, scene_id: 1}).then(res => {
        if(res.code == 200) {
          let permissions = JSON.parse(res.data.permissions)
          this.perssionInfo = permissions
          this.brandOpen = Boolean(permissions['is_brand_cofig'] == 1)
          this.type = this.brandOpen ? 1 : 2;
          // if (permissions['ui.brand_setting'] > 0) {
          //   this.tabType = 'signSet'
          // } else {
          //   this.tabType = 'skinSet'
          // }
          if (this.perssionInfo['ui.brand_setting'] > 0) {
            this.tabType = 'signSet'
          } else if(this.perssionInfo['webinar_skins'] > 0){
            this.tabType = 'skinSet'
          } else if(this.perssionInfo['watch.viewing_protocol'] > 0){
            this.tabType = 'viewingProtocol'
          }
          this.$refs[`${this.tabType}Comp`].initComp();
          // this.handleLowerGradeHeart()
        }
      }).catch(e => {});
    },
    closeBrandOpen() {
      if (this.reservationDisable && !this.brandOpen) {
        this.brandOpen = true;
        this.$alert('尊敬的用户，您的账号无此权限。如需使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          lockScroll: false,
          customClass: 'zdy-message-box',
          callback: action => {}
        });
        return;
      }
      let params = {
        webinar_id: this.$route.params.str,
        permission_key: 'is_brand_cofig',
        status: Number(this.brandOpen)
      };
      console.log('当前参数传递：', params);
      this.$fetch('planFunctionEdit', params).then(res => {
        this.$vhall_paas_port({
          k: this.brandOpen ? 100196 : 100197,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        if (this.brandOpen) {
          this.type = 1;
        } else {
          this.type = 2;
          this.$message({
            message:"正在使用账号下品牌设置",
            showClose: true,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
        }
        this.$refs[`${this.tabType}Comp`].initComp();
      }).catch(res => {
        this.$message({
          message: res.msg || `操作失败`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    handleLowerGradeHeart() {
      this.getLowerGradeConfig();
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      let userId = JSON.parse(sessionOrLocal.get("userId"));
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == userId) : null;
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
      const permission = this.permission
      Object.assign(permission, data)
      this.perssionInfo = Object.assign(permission, data)
      this.brandOpen = Boolean(perssionInfo['is_brand_cofig'] == 1)
      this.type = this.brandOpen ? 1 : 2;
      // if (this.perssionInfo['ui.brand_setting'] > 0) {
      //   this.tabType = 'signSet'
      // } else {
      //   this.tabType = 'skinSet'
      // }
      if (this.perssionInfo['ui.brand_setting'] > 0) {
        this.tabType = 'signSet'
      } else if(this.perssionInfo['webinar_skins'] > 0){
        this.tabType = 'skinSet'
      } else if(this.perssionInfo['watch.viewing_protocol'] > 0){
        this.tabType = 'viewingProtocol'
      }
      this.$refs[`${this.tabType}Comp`].initComp();
    }
  },
  mounted() {
    this.getPermission();

    // this.$refs[`signSetComp`].initComp();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
 .title_text{
    color: #999;
    font-size: 14px;
    span{
      color: #3562FA;
      cursor: pointer;
      vertical-align: middle;
    }
  }
  /deep/.el-switch__label {
    color: #999;
    &.is-active{
      color: #999;
    }
  }
  /deep/ .el-tabs__active-bar {
    height: 2px;
    background: #FB3A32;
    border-radius: 2px 2px 0px 0px;
    opacity: 1;
  }
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
