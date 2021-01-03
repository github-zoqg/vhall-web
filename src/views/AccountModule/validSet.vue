<template>
  <div class="valid--set">
    <div class="comp-card-one">
      <span class="pwd--circle blue"><i class="iconfont-v3 saasicon-lock"></i></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">账号密码</label></li>
        <!--<li><label class="card&#45;&#45;txt">当前密码强度：</label>-->
        <!--  <span class="card&#45;&#45;status level_high" v-if="pwdLevel === 'high'">强</span>
          <span class="card&#45;&#45;status level_center" v-else-if="pwdLevel === 'center'">一般</span>
          <span class="card&#45;&#45;status level_min" v-else-if="pwdLevel === 'min'">弱</span>
          <span class="card&#45;&#45;status" v-else>&#45;&#45;</span>-->
        <!--</li>-->
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="bindShowHandle('pwd')">{{accountInfo && accountInfo.has_password>0 ? '修改' : '设置'}}</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <span class="pwd--circle orange"><i class="iconfont-v3 saasicon-mobile"></i></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">密保手机</label></li>
        <!--<li><label class="card&#45;&#45;txt">已绑定手机：{{accountInfo && accountInfo.phone ? `${accountInfo.phone.replace(/(\d{4})\d*(\d{4})/, '$1****$2')}` : '&#45;&#45;'}}</label></li>-->
        <li><label class="card--txt">已绑定手机：{{accountInfo && accountInfo.phone ? accountInfo.phone : '--'}}</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="bindShowHandle('phone')">{{ accountInfo && accountInfo.phone ? '修改' : '设置' }}</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <span class="pwd--circle green"><i class="iconfont-v3 saasicon_email"></i></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">关联邮箱</label></li>
        <li><label class="card--txt">已绑定邮箱：{{accountInfo && accountInfo.email ? accountInfo.email : '--'}}</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="bindShowHandle('email')">{{ accountInfo && accountInfo.email ? '修改' : '设置' }}</el-button>
      </div>
    </div>
    <!-- 绑定邮箱/手机号/修改密码 -->
    <valid-set-dialog ref="validSetDialog" @changeOk="changeOkHandle"></valid-set-dialog>
  </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import ValidSetDialog from  './components/validSetDialog';

export default {
  name: "validSet.vue",
  components: {
    ValidSetDialog
  },
  data() {
    return {
      accountInfo: null,
      pwdLevel: null
    };
  },
  methods: {
    initComp() {
      let account_info = sessionOrLocal.get('userInfo');
      if(account_info !== null) {
        let accountInfo = JSON.parse(account_info);
        this.accountInfo = accountInfo;
      }
    },
    bindShowHandle(type) {
      this.$nextTick(() => {
        this.$refs.validSetDialog.initComp(this.accountInfo, type);
      });
    },
    changeOkHandle() {
      // 保存成功，数据更新
      this.$fetch('getInfo', {
        scene_id: 2
      }).then(res =>{
        if(res.code === 200 && res.data) {
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
          let account_info = sessionOrLocal.get('userInfo');
          if(account_info !== null) {
            let accountInfo = JSON.parse(account_info);
            this.accountInfo = accountInfo;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .valid--set {
    .padding41-40();
  }
  .card--blue {
    /deep/.el-button.el-button--text {
      color: #3562FA;
    }
  }
</style>
