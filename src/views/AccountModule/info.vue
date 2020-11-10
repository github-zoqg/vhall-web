<template>
  <div>
    <pageTitle title="账户信息"></pageTitle>
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
          <img src="../../common/images/avatar.jpg" class="user-advert" />
          <p class="account--title">微吼直播主持人</p>
          <p class="account--notice">市场运营总监</p>
        </div>
        <ul class="account--show">
          <li>
            <label>账号</label>
            <p>S22152705</p>
          </li>
          <li>
            <label>公司</label>
            <p>北京微吼时代科技有限公司</p>
          </li>
          <li>
            <label>电话</label>
            <p>135 **** 0987</p>
          </li>
          <li>
            <label>邮箱</label>
            <p>zhong***wang@vhall.com</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../LiveModule/components/pageTitle';
import BaseSet from '../AccountModule/baseSet';
import ValidSet from '../AccountModule/validSet';
import AccountSet from '../AccountModule/accountSet';
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
      tabType: null
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    }
  },
  mounted() {
    this.tabType = 'baseSet';
    this.$refs[`baseSetComp`].initComp();
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
  img {
    display: block;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    border: 1px solid #E2E2E2;
    border-radius: 100%;
  }
  .account--title {
    margin-top: 16px;
    font-size: 20px;
    font-family: @fontRegular;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 28px;
  }
  .account--notice {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-top: 4px;
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
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-bottom: 4px;
  }
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 20px;
  }
}
.account__panel--left {
  width: calc(100% - 344px);
  min-height: 612px;
  height: auto;
  background: #FFFFFF;
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
  font-family: PingFangSC-Regular, PingFang SC;
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
