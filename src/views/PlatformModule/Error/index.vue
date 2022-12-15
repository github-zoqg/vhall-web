<template>
  <div>
    <!-- 404 -->
    <div
      class="container 404"
      v-if="$route.params.str !== 'sysUnder' && $route.params.str !== 'network'"
    >
      <div class="left-section">
        <div class="inner-content">
          <h1 class="heading">{{ $route.params.str }}</h1>
          <!-- 具体文案 -->
          <p class="subheading">页面已失联，攻城狮正在赶来的路上…</p>
          <p class="headingNotice">
            无法访问本页的原因：
            <br />
            服务器过热导致网站可能出现故障！
            <br />
            所访问的页面不存在或者已被管理员删除！
            <br />
          </p>
          <p class="index-btn">
            <el-button type="primary" @click.prevent.stop="toReturn" round>
              {{ $route.params.str == 'fail' ? '返回' : '返回首页' }}
            </el-button>
          </p>
        </div>
      </div>
      <div class="right-section">
        <img src="../../../common/images/sys/404.svg" class="svgImg" alt="" />
      </div>
    </div>
    <!-- 无服务 -->
    <div class="container sysUnder" v-else-if="$route.params.str === 'sysUnder'">
      <div class="left-section sysUnder">
        <div class="inner-content">
          <h1 class="heading">系统正在升级中…</h1>
          <!-- 具体文案 -->
          <p class="subheading">亲爱的用户，系统正在升级中，给您带来不便，深表歉意。</p>
        </div>
      </div>
      <div class="right-section">
        <img src="../../../common/images/sys/no-server.png" class="svgImg" alt="" />
      </div>
    </div>
    <!-- 系统升级 -->
    <div class="container network" v-else>
      <img src="../../../common/images/sys/no-network.svg" alt="" />
      <p class="heading">网络正在开小差……</p>
      <p class="index-btn">
        <el-button type="primary" @click.prevent.stop="toReturn" round>返回首页</el-button>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error.vue',
    data() {
      return {
        userInfo: {}
      };
    },
    created() {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    },
    methods: {
      toReturn() {
        // 七牛返回页
        if (this.$route.params.str == 'fail') {
          window.open(
            'https://portal.qiniu.com/oauth/v2/authorize?response_type=code&client_id=NWF1x2prdhH4PAFXqZW0enOy&redirect_uri=https://saas-api.vhall.com/v3/users/auth/qny-callback&state=qiniu',
            '_self'
          );
        } else {
          this.$router.push({
            path: '/'
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .left-section.sysUnder {
    width: 416px;
    margin-right: 77px;
  }
  .left-section .inner-content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .background {
    background: #ffffff;
  }
  .container {
    position: relative;
    margin: 0 auto;
    width: 52%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .index-btn {
      margin-top: 32px;
      text-align: left;
    }
    .heading {
      font-size: 80px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 112px;
    }
    &.sysUnder {
      .heading {
        font-size: 32px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 45px;
      }
    }
    &.network {
      flex-direction: column;
      width: 245px;
      height: auto;
      text-align: center;
      margin-top: calc((100vh - 292px) / 2);
      .heading {
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      .index-btn {
        text-align: center;
      }
    }
  }
  .left-section {
    width: 40%;
  }
  .subheading {
    height: 22px;
    font-size: 16px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 22px;
  }
  .headingNotice {
    margin-top: 16px;
    width: 266px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
  .right-section {
    width: 50%;
  }
  .svgImg {
    position: absolute;
    top: calc(25%);
    max-width: 100%;
    max-height: 100%;
  }
  @media screen and (max-width: 750px) {
    .container {
      width: 100%;
    }
    .left-section {
      height: 50%;
      width: 92%;
      position: relative;
      top: 33%;
    }
    .right-section {
      width: 100%;
      position: absolute;
      top: 0;
      height: 50%;
    }
  }
</style>
