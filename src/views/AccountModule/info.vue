<template>
  <div>
    <pageTitle pageTitle="账户信息"></pageTitle>
    <div class="account__panel">
      <!-- 左侧 -->
      <div class="account__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane label="基本设置" name="baseSet"></el-tab-pane>
          <el-tab-pane label="安全设置" name="validSet"></el-tab-pane>
          <el-tab-pane label="账号绑定" name="accountSet"></el-tab-pane>
        </el-tabs>
        <base-set ref="baseSetComp" v-show="tabType === 'baseSet'"></base-set>
        <valid-set ref="validSetComp" v-show="tabType === 'validSet'"></valid-set>
        <account-set ref="accountSetComp" v-show="tabType === 'accountSet'"></account-set>
      </div>
      <!-- 右侧名片 -->
      <div class="account__panel--right">
        <div class="account--user">
          <!--<icon icon-class="saaszizhanghao_tubiao" style="font-size: 56px;"></icon>-->
          <div class="image-contain"><img :src="avatarImgUrl" class="image-avatar" alt=""/></div>
          <p class="account--title" :title="userInfo && userInfo.nick_name ? userInfo.nick_name : ''">{{userInfo && userInfo.nick_name ? userInfo.nick_name : '--'}}</p>
          <p class="account--notice" :title="userInfo && userInfo.position ? userInfo.position : ''">{{userInfo && userInfo.position ? userInfo.position : '--'}}</p>
        </div>
        <ul class="account--show">
          <li>
            <label>账号</label>
            <p :title="userInfo && userInfo.name ? userInfo.name : ''">{{userInfo && userInfo.name ? userInfo.name : '--'}}</p>
          </li>
          <li>
            <label>公司</label>
            <p :title="userInfo && userInfo.company ? userInfo.company : ''">{{userInfo && userInfo.company ? userInfo.company : '--'}}</p>
          </li>
          <li>
            <label>电话</label>
            <p>{{userInfo && userInfo.phone || '--'}}</p>
          </li>
          <li>
            <label>邮箱</label>
            <p>{{userInfo && userInfo.email || '--'}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import BaseSet from '../AccountModule/baseSet';
import ValidSet from '../AccountModule/validSet';
import AccountSet from '../AccountModule/accountSet';
import {getQueryString, sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
import fetchData from "@/api/fetch";
import { defaultAvatar } from '@/utils/ossImgConfig';
export default {
  name: 'info.vue',
  components: {
    PageTitle,
    BaseSet,
    ValidSet,
    AccountSet
  },
  data() {
    return {
      tabType: null,
      userId: JSON.parse(sessionOrLocal.get("userId")),
      userInfo: null,
      avatarImgUrl: ''
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      let tabCount = this.tabType === 'validSet' ? 1 : this.tabType === 'accountSet' ? 2 : 0;
      this.$vhall_paas_port({
        k: tabCount === 1 ? 100779 : tabCount === 2 ? 100780 : 100778,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      // window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=${this.$route.query.tab}`;
      this.$router.push({path: `/acc/info`, query: {
        tab: tabCount
      }})
      this.$refs[`${this.tabType}Comp`].initComp();
    },
    updateAccount(account) {
      this.userInfo = account;
      this.avatarImgUrl = account.avatar || defaultAvatar;
    }
  },
  mounted() {
    let userInfo = sessionOrLocal.get('userInfo');
    if(userInfo !== null) {
      this.userInfo = JSON.parse(userInfo);
      this.avatarImgUrl = this.userInfo.avatar || defaultAvatar;
    }
    if (this.$route.query.tab) {
      this.tabType = ['baseSet', 'validSet', 'accountSet'][this.$route.query.tab];
      this.$refs[`${['baseSet', 'validSet', 'accountSet'][this.$route.query.tab]}Comp`].initComp();
    } else {
      this.tabType = 'baseSet';
      this.$refs[`baseSetComp`].initComp();
    }
    this.$EventBus.$on('saas_vs_account_change', this.updateAccount);
  },
  created() {
    let bind_Result = sessionOrLocal.get('bind_result');
    // 若存在第一步绑定结果提示，表明需要提示具体绑定结果。
    if (bind_Result) {
      let auth_tag = sessionOrLocal.get('tag', 'localStorage');
      let res = JSON.parse(bind_Result);
      if (res.code === 511042) {
        // 若是账号绑定异常，提示用户信息
        this.$confirm(auth_tag === 'bindWx' ? '该微信已被使用，绑定后，第三方账号的信息将被清空' : '该QQ已被使用，绑定后，第三方账号的信息将被清空', '提示', {
          confirmButtonText: '绑定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          let user_auth_key = sessionOrLocal.get('user_auth_key');
          fetchData('callbackUserInfo', {
            key: user_auth_key,
            scene_id: 3,
            force: 1
          }).then(res => {
            // 绑定成功
            this.$message({
              message:  `绑定成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info`;
            sessionOrLocal.removeItem('tag', 'localStorage');
            sessionOrLocal.removeItem('bind_result');
            // window.location.reload();
            window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
          }).catch(resError  => {
            this.$message({
              message:  resError.msg || '绑定失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            // 清除缓存
            sessionOrLocal.removeItem.set('tag', 'localStorage');
            sessionOrLocal.removeItem('bind_result');
            sessionOrLocal.removeItem('user_auth_key');
          })
        }).catch(() => {
          // 清除缓存
          sessionOrLocal.removeItem.set('tag', 'localStorage');
          sessionOrLocal.removeItem('bind_result');
          sessionOrLocal.removeItem('user_auth_key');
        });
      } else {
        // 绑定失败，不做任何处理
        this.$message({
          message:  res.msg || '绑定失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.account__panel {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.account__panel--right {
  width: 320px;
  min-height: 612px;
  height: auto;
  padding: 48px 24px 71px 24px;
  background: #FFFFFF;
  border-radius: 4px;
}
.account--user {
  text-align: center;
  .image-contain{
    margin: 0 auto;
    width: 100px;
    height: 100px;
    overflow: hidden;
    // border: 1px solid #E2E2E2;
    border-radius: 50%;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit:cover;
    // background: #1a1a1a;
    // margin: 0 auto;
    // width: 100px;
    // height: 100px;
    // border: 1px solid #E2E2E2;
    border-radius: 50%;
  }
  .account--title {
    margin-top: 16px;
    font-size: 20px;
    font-family: @fontRegular;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .account--notice {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.account--show {
  border-top: 1px solid #E6E6E6;
  margin-top: 24px;
  padding-top: 32px;
  li {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  label {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-bottom: 4px;
  }
  p {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.account__panel--left {
  width: calc(100% - 344px);
  min-height: 612px;
  height: auto;
  background: #FFFFFF;
  border-radius: 4px;
}
/deep/.el-tabs__header {
  margin: 0 0;
}
/deep/.el-tabs__item {
  padding: 0 24px;
  box-sizing: border-box;
  display: inline-block;
  list-style: none;
  position: relative;
  font-size: 16px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #666666;
  line-height: 55px;
  height: 55px;
  &.is-active {
    color: #FB3A32;
  }
}
/deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
/deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 24px;
}
/deep/.el-tabs__nav-wrap::after {
  height: 1px;
  color: #E6E6E6;
}
</style>
