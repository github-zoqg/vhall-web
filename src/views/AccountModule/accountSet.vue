<template>
  <div class="account-set">
    <div class="comp-card-one">
      <!--<icon icon-class="saasicon_qq" style="font-size: 40px;"></icon>-->
      <img src="../../common/images/icon/qq.png" alt="" class="icon-set"/>
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定QQ</label></li>
        <li>
          <label class="card--txt">{{QQ && QQ.nick_name ? QQ.nick_name : '当前尚未绑定QQ'}}</label>
        </li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click="unBindQQ" v-if="QQ && QQ.nick_name">解除绑定</el-button>
        <el-button type="text" @click="bindQQ" v-else>绑定</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <!--<icon icon-class="saasicon_wechat" style="font-size: 40px;"></icon>-->
      <img src="../../common/images/icon/wechat.png" alt=""  class="icon-set"/>
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定微信</label></li>
        <li><label class="card--txt">{{Weixin && Weixin.nick_name ? Weixin.nick_name : '当前尚未绑定微信'}}</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click="unBindWx" v-if="Weixin && Weixin.nick_name">解除绑定</el-button>
        <el-button type="text" @click="bindWx" v-else>绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {getQueryString, sessionOrLocal} from "@/utils/utils";
import fetchData from "@/api/fetch";

export default {
  name: "accountSet.vue",
  data() {
    return {
      Weixin: null,
      QQ: null,
      Weibo: null
    }
  },
  methods: {
    initComp() {
      let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      // userInfo = {"current_date":"2020-12-19 18:11:37","user_thirds":[{"type":2,"nick_name":"卡哇伊灬"}],"user_extends":{"logo":"","logo_jump_url":""},"user_id":16623394,"name":"name","email":"","phone":"","nick_name":"卡哇伊灬","avatar":"","company":"","position":"","is_api":0,"parent_id":"","is_dynamic":0,"user_type":0,"package_version_id":0,"is_new_regist":0,"package_version_name":"","package_version_unlimited":0,"has_password":0};
      // debugger
      //  1微博 2QQ 3微信 4 阿里 5 SDK打赏生的用户6小程序观看端
      let QQ = userInfo.user_thirds.filter(item => item.type === 2);
      if (QQ && QQ.length > 0) {
        this.QQ = QQ[0];
      }
      let Weixin = userInfo.user_thirds.filter(item => item.type === 3);
      if (Weixin && Weixin.length > 0) {
        this.Weixin = Weixin[0];
      }
      let Weibo = userInfo.user_thirds.filter(item => item.type === 1);
      if (Weibo && Weibo.length > 0) {
        this.Weibo = Weibo[0];
      }
    },
    bindWx() {
      sessionOrLocal.set('tag', 'bindWx', 'localStorage');
      window.open(`https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=pc&jump_url=${process.env.VUE_APP_WEB_URL}`, '_blank');
    },
    bindQQ() {
      sessionOrLocal.set('tag', 'bindQQ', 'localStorage');
      window.open(`https://t-saas-dispatch.vhall.com/v3/commons/auth/qq?jump_url=${process.env.VUE_APP_WEB_URL}`);
    },
    unBindQQ() {
      alert('解绑开发中');
      this.$confirm('解绑 QQ 后你将无法使用 QQ 登录，你确定要解绑吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$message.success('解绑成功');
      }).catch(() => {})
    },
    unBindWx() {
      alert('解绑开发中');
      this.$confirm('解绑 微信 后你将无法使用 微信 登录，你确定要解绑吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$message.success('解绑成功');
      }).catch(() => {})
    },
    created() {
      let bind_Result = sessionOrLocal.get('bind_result');
      if (bind_Result) {
        let auth_tag = sessionOrLocal.get('tag', 'localStorage');
        let res = JSON.stringify(bind_Result);
        if (res.code === 11042) {
          // 若是账号绑定异常，提示用户信息
          this.$confirm(auth_tag === 'bindWx' ? '该微信已被使用，绑定后，第三方账号的信息将被清空' : '该QQ已被使用，绑定后，第三方账号的信息将被清空', '提示', {
            confirmButtonText: '绑定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box'
          }).then(() => {
            fetchData('callbackUserInfo', {
              key: getQueryString('user_auth_key'),
              scene_id: 3,
              force: 1
            }).then(res => {
              // 绑定成功
              window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/account/info`;
              return;
            }).catch(e => {})
          }).catch(() => {
          });
        } else {
          // 绑定失败，不做任何处理
          this.$message.error(res.msg || '绑定失败');
          next({ path: '/login' });
          return;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .account-set {
    .padding41-40();
  }
  .icon-set {
    width: 40px;
    height: 40px;
  }
</style>
