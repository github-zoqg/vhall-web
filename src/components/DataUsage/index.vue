<template>
  <el-card class="data-usage">
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.concurrency">
      <el-col :span="6">
        <div class="top-item">
          <p>当前版本</p>
          <h2>{{ userInfo.edition }}</h2>
          <p>有效期: {{ userInfo.edition_valid_time || '' }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>总并发(方)<span class="level" @click="levelVersion('升级')" v-if="buttonList.includes('upgrade')">升级</span></p>
          <h2>{{ userInfo.concurrency.total_concurrency }}</h2>
          <p>有效期: {{ userInfo.concurrency.concurrency_valid_time || ''  }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>并发扩展包（人次）<span class="level" @click="levelVersion('购买')" v-if="buttonList.includes('extend')">购买</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              1.当全部并发套餐到期，若有扩展包则会开始扣除扩展包；<br>
              若无扩展包，则不可发直播且直播回放不可播放<br>
              2.扩展包欠费则不可发直播，回放不受影响
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          </p>
          <h2>{{ userInfo.concurrency.extend || userInfo.arrears.extend }}</h2>
          <p class="account" @click="goAccountDetail" v-if="buttonList.includes('details') && this.$route.path==='/finance/info'">账单明细</p>
        </div>
      </el-col>
      <el-col :span="6" v-if="userInfo.concurrency.extend_day">
        <div class="top-item">
          <p>并发扩展包（天</p>
          <h2>{{ userInfo.concurrency.extend_day }}</h2>
          <p>{{ userInfo.concurrency.extend_day_start }} 至 {{ userInfo.concurrency.extend_day_end }}</p>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.flow">
      <el-col :span="9">
        <div class="top-item">
          <p>当前版本</p>
          <h2>{{ userInfo.edition }} <span class="level" v-if ="buttonList.includes('standard_upgrade')" @click="upgradeVersion()">升级</span></h2>
          <p>有效期: {{ userInfo.edition_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="9" v-if="userInfo.edition === '无极版'">
        <div class="top-item">
          <p>总流量/回放流量（GB）
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                1.优先消耗较早购买或赠送的流量包，消耗完自动启用下一个流量包<br>
                2.自启用之日起，购买的流量包有效期为1年，赠送的流量包有效期为7天<br>
                3.流量包到期后自动失效
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <h2>无限流量/{{ userInfo.flow.playback_flow || userInfo.arrears.flow  }}</h2>
          <p class="account" @click="goAccountDetail" v-if="this.$route.path==='/finance/info' && buttonList.includes('details')">账单明细</p>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="top-item">
          <p>总流量/可用流量（GB）<span class="level" @click="buyVersion()" v-if ="buttonList.includes('flow')">购买</span>
          <el-tooltip effect="dark" placement="right-start" >
              <div slot="content">
                1.优先消耗较早购买或赠送的流量包，消耗完自动启用下一个流量包<br>
                2.自启用之日起，购买的流量包有效期为1年，赠送的流量包有效期为7天<br>
                3.流量包到期后自动失效
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <h2 v-if="userInfo.flow">{{ userInfo.flow.total_flow}}/{{ userInfo.flow.valid_flow || userInfo.arrears.flow  }}</h2>
          <p class="account"  @click="goAccountDetail" v-if="this.$route.path==='/finance/info' && buttonList.includes('details')">账单明细</p>
        </div>
      </el-col>
    </el-row>
    <up-version ref="levelVersion" :title="title" :concurrentPrice="concurrentPrice"></up-version>
  </el-card>
</template>
<script>
import upVersion from './components/upversion';
import { sessionOrLocal } from '@/utils/utils';
export default {
  watch: {
    userId: {
      handler() {
        this.getVersion();
      }
    }
  },
  data() {
    return {
      title: '流量包',
      versionType: '',
      userInfo: {
        concurrency: {},
        flow: {},
        arrears: {}
      },
      buttonList: [],
      concurrentPrice: {}
    };
  },
  components: {
    upVersion
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    this.getVersion();
  },
  methods: {
    getVersion() {
      this.$fetch('getVersionInfo', { user_id: this.userId}).then(res => {
        this.userInfo = res.data;
        this.versionType = res.data.edition;
        this.buttonList = res.data.concurrency ? res.data.concurrency.buttons : res.data.flow.buttons;
        sessionOrLocal.set('versionType', JSON.stringify(res.data.edition));
        sessionOrLocal.set('arrears', JSON.stringify(res.data.arrears));
      }).catch(e=>{
        console.log(e);
      });
    },
    levelVersion(title) {
      if (this.$route.path !== '/finance/info') {
        this.$router.push({
          path: '/finance/info'
        });
      } else {
        this.$refs.levelVersion.dialogVisible = true;
        this.title = title;
         this.concurrentPrice = this.userInfo.concurrency;
      }
    },
    goAccountDetail() {
      this.$router.push({
        path: '/finance/infoDetail'
      });
    },
    upgradeVersion() {
      this.$router.push({
        path: '/finance/orderDetail'
      });
    },
    buyVersion() {
      if (this.$route.path === '/finance/info') {
        this.$router.push({
          path: '/finance/info'
        });
      } else {
        this.title = this.versionType;
        this.concurrentPrice = this.userInfo.flow;
        this.$refs.levelVersion.dialogBuyVisible = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.data-usage {
  .row-top {
    background: #fff;
  }
  .row-center {
    margin: 24px 0;
  }
  .top-item {
    text-align: left;
    height: 140px;
    padding: 32px 0;
    position: relative;
    .level {
      border: 1px solid #FB3A32;
      font-size: 12px;
      color: #FB3A32;
      text-align: center;
      padding: 1px 7px;
      margin-left: 5px;
      cursor: pointer;
      border-radius: 10px;
    }
    p {
      font-size: 14px;
      color: #999;
      cursor: pointer;
    }
    i{
      color: #000;
      display: inline-block;
      margin-left: 2px;
    }
    h2 {
      font-size: 28px;
      color: #1a1a1a;
      line-height: 30px;
      font-weight: bold;
      padding: 6px 0 8px 0;
    }
    .account{
      position: absolute;
      top: 30px;
      right:0;
      color: #3562FA;
      font-size: 14px;
    }
  }
}
</style>
