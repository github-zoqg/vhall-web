<template>
  <div class="account-set">
    <div class="comp-card-one">
      <!--<icon icon-class="saasicon_qq" style="font-size: 40px;"></icon>-->
      <img src="../../common/images/icon/qq.png" alt="" class="icon-set" />
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定QQ</label></li>
        <li>
          <label class="card--txt">
            {{ QQ && QQ.nick_name ? QQ.nick_name : '当前尚未绑定QQ' }}
          </label>
        </li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click="unBindQQ" v-if="QQ && QQ.nick_name">解除绑定</el-button>
        <el-button type="text" @click="bindQQ" v-else>绑定</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <!--<icon icon-class="saasicon_wechat" style="font-size: 40px;"></icon>-->
      <img src="../../common/images/icon/wechat.png" alt="" class="icon-set" />
      <ul class="ul--son--card">
        <li><label class="card--bold">绑定微信</label></li>
        <li>
          <label class="card--txt">
            {{ Weixin && Weixin.nick_name ? Weixin.nick_name : '当前尚未绑定微信' }}
          </label>
        </li>
      </ul>
      <div class="card--blue">
        <el-button type="text" @click="unBindWx" v-if="Weixin && Weixin.nick_name">
          解除绑定
        </el-button>
        <el-button type="text" @click="bindWx" v-else>绑定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getQueryString, sessionOrLocal } from '@/utils/utils';
  import fetchData from '@/api/fetch';

  export default {
    name: 'accountSet.vue',
    data() {
      return {
        Weixin: null,
        QQ: null,
        Weibo: null
      };
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
        this.$vhall_paas_port({
          k: 100789,
          data: {
            business_uid: this.$parent.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        sessionOrLocal.set('tag', 'bindWx', 'localStorage');
        window.open(
          `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/weixin?source=pc&jump_url=${process.env.VUE_APP_WEB_URL}`,
          '_blank'
        );
      },
      bindQQ() {
        this.$vhall_paas_port({
          k: 100788,
          data: {
            business_uid: this.$parent.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        sessionOrLocal.set('tag', 'bindQQ', 'localStorage');
        window.open(
          `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/qq?jump_url=${process.env.VUE_APP_WEB_URL}`
        );
      },
      unBindQQ() {
        this.$confirm('解绑 QQ 后你将无法使用 QQ 登录，你确定要解绑吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            // 1微博 2QQ 3微信 4 阿里 5 SDK打赏生的用户6小程序观看端
            this.unBindSend(2);
          })
          .catch(() => {});
      },
      unBindWx() {
        this.$confirm('解绑 微信 后你将无法使用 微信 登录，你确定要解绑吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.unBindSend(3);
          })
          .catch(() => {});
      },
      unBindSend(type) {
        this.$fetch('unBindInfo', {
          type: type
        })
          .then(res => {
            this.$message({
              message: `解绑成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // 解绑成功后，刷新页面
            window.location.reload();
          })
          .catch(res => {
            this.$message({
              message: res.msg || '解绑失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      created() {}
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
  .card--blue {
    /deep/.el-button.el-button--text {
      color: #3562fa;
    }
  }
</style>
