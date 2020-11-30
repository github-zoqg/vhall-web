<template>
  <div class="valid--set">
    <div class="comp-card-one">
      <span class="pwd--circle blue"></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">账号密码</label></li>
        <li><label class="card--txt">当前密码强度：</label>
          <span class="card--status level_high" v-if="pwdLevel === 'high'">强</span>
          <span class="card--status level_center" v-else-if="pwdLevel === 'center'">一般</span>
          <span class="card--status level_min" v-else-if="pwdLevel === 'min'">弱</span>
          <span class="card--status" v-else>--</span>
        </li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="pwdShowHandle()">{{accountInfo && accountInfo.has_password>0 ? '修改' : '设置'}}</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <span class="pwd--circle orange"></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">密保手机</label></li>
        <li><label class="card--txt">已绑定手机：{{accountInfo && accountInfo.phone ? `${accountInfo.phone.replace(/(\d{4})\d*(\d{4})/, '$1****$2')}` : '--'}}</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="bindShowHandle('phone')">{{ accountInfo && accountInfo.phone ? '修改' : '设置' }}</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <span class="pwd--circle green"></span>
      <ul class="ul--son--card">
        <li><label class="card--bold">关联邮箱</label></li>
        <li><label class="card--txt">已绑定邮箱：{{accountInfo && accountInfo.email ? `${accountInfo.email.replace(/(?<=.{2})[^@]+(?=.{2}@)/,"*****")}`: '--'}}</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click.prevent.stop="bindShowHandle('email')">{{ accountInfo && accountInfo.email ? '修改' : '设置' }}</el-button>
      </div>
    </div>
    <!-- 绑定邮箱/手机号 -->
    <bind-phone-or-email  ref="bindPhoneOrEmail"></bind-phone-or-email>
    <!-- 修改密码 -->
    <set-password ref="setPassword" @changeOk="changeOkHandle"></set-password>

  </div>
</template>

<script>
import {sessionOrLocal} from "@/utils/utils";
import BindPhoneOrEmail from './components/bindPhoneOrEmail';
import SetPassword from  './components/setPassword';

export default {
  name: "validSet.vue",
  components: {
    SetPassword,
    BindPhoneOrEmail
  },
  data() {
    return {
      accountInfo: null,
      pwdLevel: null
    };
  },
  methods: {
    initComp() {
      let account_info = sessionOrLocal.get('account_info');
      if(account_info !== null) {
        let accountInfo = JSON.parse(account_info);
        this.accountInfo = accountInfo;
      }
    },
    bindShowHandle(type) {
      let dialogIsEdit = false;
      if (type === 'email') {
        dialogIsEdit = this.accountInfo.email !== null && this.accountInfo.email !== undefined && this.accountInfo.email !== '';
      }else if (type === 'phone') {
        dialogIsEdit = this.accountInfo.phone !== null && this.accountInfo.phone !== undefined && this.accountInfo.phone !== '';
      }
      this.$nextTick(() => {
        this.$refs.bindPhoneOrEmail.initComp({
          dialogIsEdit: dialogIsEdit,
          dialogType: type
        });
      });
    },
    pwdShowHandle() {
      this.$nextTick(() => {
        this.$refs.setPassword.initComp(this.accountInfo);
      });
    },
    changeOkHandle() {
      // 保存成功，数据更新
      this.$fetch('getInfo', {
        scene_id: 2
      }).then(res =>{
        if(res.code === 200 && res.data) {
          sessionOrLocal.set('account_info', JSON.stringify(res.data));
          let account_info = sessionOrLocal.get('account_info');
          if(account_info !== null) {
            let accountInfo = JSON.parse(account_info);
            this.accountInfo = accountInfo;
          }
        } else {
          sessionOrLocal.set('account_info', null);
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
