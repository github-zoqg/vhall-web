<template>
  <el-card class="data-usage">
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.edition == '2'">
      <el-col :span="6">
        <div class="top-item">
          <p>当前版本</p>
          <h2>旗舰版</h2>
          <p>有效期: {{ userInfo.edition_valid_time || '' }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item" v-if="userInfo.concurrency">
          <p>总并发(方)<span class="level" @click="levelVersion('升级')">升级</span></p>
          <h2>{{ userInfo.concurrency.total_concurrency }}</h2>
          <p>有效期: {{ userInfo.concurrency.concurrency_valid_time || ''  }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item" v-if="userInfo.concurrency">
          <p>并发扩展包<span class="level" @click="levelVersion('购买')">购买</span></p>
          <h2>{{ userInfo.concurrency.concurrency_extend || userInfo.arrears.extend  }}</h2>
          <p v-if="this.$route.name!='home'" @click="goAccountDetail">账单明细</p>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-top" justify="space-around" v-else>
      <el-col :span="9">
        <div class="top-item">
          <p>当前版本</p>
          <h2>{{ userInfo.edition == '1' ? '专业版' : userInfo.edition == '3' ? '无极版' : '标准版' }} <span class="level" v-if = "userInfo.edition != '3'" @click="buyVersion('1')">{{ userInfo.edition == '1' ? '续费' : '升级'}}</span></h2>
          <p>有效期: {{ userInfo.edition_valid_time || ''  }}</p>
        </div>
      </el-col>
      <el-col :span="9" v-if = "userInfo.edition == '3'">
        <div class="top-item"  v-if="userInfo.flow">
          <p>总流量/回放流量（GB）</p>
          <h2>无限流量/{{ userInfo.flow.playback_flow || userInfo.arrears.flow  }}</h2>
          <p @click="goAccountDetail" v-if="this.$route.name!='home'">账单明细</p>
        </div>
      </el-col>
      <el-col :span="9" v-else>
        <div class="top-item">
          <p>总流量/可用流量（GB）<span class="level" @click="buyVersion('2')">购买</span></p>
          <h2 v-if="userInfo.flow">{{ userInfo.flow.total_flow}}/{{ userInfo.flow.valid_flow || userInfo.arrears.flow  }}</h2>
          <p @click="goAccountDetail" v-if="this.$route.name!='home'">账单明细</p>
        </div>
      </el-col>
    </el-row>
    <up-version ref="levelVersion" :title="title" :concurrentPrice="concurrentPrice"></up-version>
  </el-card>
</template>
<script>
import upVersion from './components/upversion';
export default {
  props: {
    userInfo:{
      type: Object
      // default: () => {
      //   return {flow:{},arrears:{},concurrency:{}};
      // }
    }
  },
  watch: {
    userInfo: {
      handler() {
        this.userInfo.edition = '2';
      }
    }
  },
  data() {
    return {
      title: '流量包',
      concurrentPrice: {}
    };
  },
  components: {
    upVersion
  },
  created() {
    console.log(this.$route.name);
  },
  methods: {
    levelVersion(title) {
      if (this.$route.name === 'home') {
        this.$router.push({
          name: 'info'
        });
      } else {
        this.$refs.levelVersion.dialogVisible = true;
        this.title = title;
      }
    },
    goAccountDetail() {
      this.$router.push({
        name: 'infoDetail'
      });
    },
    buyVersion(type) {
      if (this.$route.name === 'home') {
        this.$router.push({
          name: 'info'
        });
      } else {
        this.title = type === '1' ? '专业版' : '流量版';
        this.concurrentPrice = this.userInfo.edition == '2' ? this.userInfo.concurrency : this.userInfo.flow;
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
    }
    h2 {
      font-size: 22px;
      color: #1a1a1a;
      line-height: 30px;
      font-weight: bold;
      padding: 6px 0 8px 0;
    }
  }
}
</style>
