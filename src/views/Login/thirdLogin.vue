<!-- Page页面 -->
<template>
  <div class="vhsaas-third-login"></div>
</template>
<script>
  import { sessionOrLocal } from '@/utils/utils';
  import { v1 as uuidV1 } from 'uuid';

  export default {
    data() {
      return {};
    },
    created() {
      // 创建
    },
    mounted() {
      // 实施
      this.handleThirdLogin();
    },
    methods: {
      // 获取路径参数
      getQueryString(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        const r = window.location.search.substr(1).match(reg);
        return r != null ? unescape(r[2]) : null;
      },
      // 第三方登录
      handleThirdLogin() {
        // eslint-disable-next-line camelcase
        const user_auth_key = this.getQueryString('user_auth_key');
        // eslint-disable-next-line camelcase
        if (user_auth_key) {
          const params = {
            source: 2, // 1 控制塔 2观看端 3admin
            key: user_auth_key,
            scene_id: 1 // 场景id：1登录 2提现绑定 3账户信息-账号绑定
          };
          this.handleAuth(params);
        }
      },
      // 第三方授权
      handleAuth(params) {
        const _that = this;
        this.$fetch(
          'callbackUserInfo',
          {
            ...params
          },
          {
            token: '',
            platform: 7
          }
        )
          .then(async res => {
            // 存储信息
            const delay = this.getQueryString('delay');
            this.setUserInfo(res);
            await this.fetchUserData();
            setTimeout(() => {
              window.location.href = `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${
                _that.$route.params.str
              }${delay ? '&delay=' + delay : ''}`;
              // window.location.href = `http://localhost:8080/special/detail?id=${_that.$route.params.str}${delay ? '&delay=' + delay : ''}`
            }, 1000);
          })
          .catch(e => {
            this.$message({
              message: e.msg || '系统错误，请稍候重试',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      setUserInfo(res) {
        if (res && res.code == 200 && res.data) {
          // 存储用户Token信息
          sessionOrLocal.set('vhsaas_token', res.data.token || '', 'localStorage');
          sessionOrLocal.set('vhsaas_tokenRefresh', new Date().getTime(), 'localStorage');
          sessionOrLocal.set('vhsaas_userId', res.data.user_id || '');
          sessionOrLocal.set('vhsaas_loginUUid', res.data.user_id || '');
          sessionOrLocal.set('vhsaas_tokenExpiredTime', res.data.exp_time || '', 'localStorage');
        }
      },
      // 获取用户信息
      fetchUserData() {
        return new Promise((resolove, reject) => {
          this.$fetch(
            'getInfoC',
            {
              scene_id: 2
            },
            {
              token: sessionOrLocal.get('vhsaas_token', 'localStorage') || '',
              platform: 7,
              'request-id': uuidV1()
            }
          )
            .then(res => {
              sessionOrLocal.set('vhsaas_userInfo', res.data || '', 'localStorage');
              // 登录成功，事件派发
              this.$EventBus.$emit('saas_vs_login_success', res.data);
              resolove();
            })
            .catch(e => {
              console.log(e);
              this.setUserInfo(null);
            });
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .vhsaas-third-login {
  }
</style>
