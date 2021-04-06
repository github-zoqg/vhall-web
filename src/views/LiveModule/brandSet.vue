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
      </el-tabs>
      <!-- 设置区域 -->
      <sign-set ref="signSetComp" v-show="tabType === 'signSet'"  v-if="perssionInfo['ui.brand_setting'] > 0" :brandConfig="brandOpen"></sign-set>
      <skin-set ref="skinSetComp" v-show="tabType === 'skinSet'" v-if="perssionInfo['webinar_skins'] > 0" :brandConfig="brandOpen"></skin-set>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SignSet from '../LiveModule/components/signSet';
import SkinSet from '../LiveModule/components/skinSet';
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "brandSet.vue",
  components: {
    PageTitle,
    SignSet,
    SkinSet,
    beginPlay
  },
  data() {
    return {
      tabType: null,
      type: 0,
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
      if (this.perssionWebInfo['ui.brand_setting'] > 0 || this.perssionWebInfo['webinar_skins'] > 0) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    // this.getPermission();
    if (this.perssionInfo['ui.brand_setting'] > 0) {
      this.tabType = 'signSet'
    } else {
      this.tabType = 'skinSet'
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    },
    toSettingDetail() {
      if (this.reservationDisable) {
        this.$alert('尊敬的用户，您的账号无此权限。如需使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-message-box',
          lockScroll: false,
          center: true,
          callback: action => {}
        });
        return;
      }
      const { href } = this.$router.resolve({path:'/setting/brand'});
      window.open(href, '_blank');
    },
    // 获取配置项
    getPermission() {
      let userId = JSON.parse(sessionOrLocal.get("userId"));
      this.$fetch('planFunctionGet', {webinar_id: this.$route.params.str, webinar_user_id: userId, scene_id: 1}).then(res => {
        if(res.code == 200) {
          let permissions = JSON.parse(res.data.permissions)
          this.brandOpen = Boolean(permissions['is_brand_cofig'] == 1)
          this.type = this.brandOpen ? 1 : 2;
          this.$refs[`${this.tabType}Comp`].initComp();
        }
      }).catch(e => {});
    },
    closeBrandOpen() {
      if (this.reservationDisable && !this.brandOpen) {
        this.brandOpen = true;
        this.$alert('尊敬的用户，您的账号无此权限。如需使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-message-box',
          lockScroll: false,
          center: true,
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
