<template>
  <el-card class="data-usage">
    <!-- userInfo.user_type == '2' ? '旗舰版' : userInfo.user_type == '1' ? '专业版' :  userInfo.user_type == '3' ? '无极版' : '标准版' -->
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.user_type == '2'">
      <el-col :span="6">
        <div class="top-item">
          <p>当前版本</p>
          <h2>旗舰版</h2>
          <p>有效期: {{ userInfo.service_info.edition_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>总并发(方)<span class="level" @click="levelVersion('升级')">升级</span></p>
          <h2>{{ userInfo.service_info.total_concurrency }}</h2>
          <p>有效期: {{ userInfo.service_info.concurrency_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>并发扩展包<span class="level" @click="levelVersion('购买')">购买</span></p>
          <h2>{{ userInfo.service_info.concurrency_extend }}</h2>
          <p>账单明细</p>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-top" justify="space-around" v-else>
      <el-col :span="9">
        <div class="top-item">
          <p>当前版本</p>
          <h2>{{ userInfo.user_type == '1' ? '专业版' : userInfo.user_type == '3' ? '无极版' : '标准版' }} <span class="level" v-if = "userInfo.user_type != '3'" @click="buyVersion('1')">{{ userInfo.user_type == '1' ? '续费' : '升级'}}</span></h2>
          <p>有效期: {{ userInfo.service_info.edition_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="9" v-if = "userInfo.user_type == '3'">
        <div class="top-item">
          <p>总流量/回放流量（GB）</p>
          <h2>{{userInfo.service_info.total_flow}}/{{ userInfo.service_info.playback_flow }}</h2>
          <p @click="goAccountDetail">账单明细</p>
        </div>
      </el-col>
      <el-col :span="9" v-else>
        <div class="top-item">
          <p>总流量/可用流量（GB）<span class="level" @click="buyVersion('2')">购买</span></p>
          <h2>{{userInfo.service_info.total_flow}}/{{ userInfo.service_info.valid_flow }}</h2>
          <p @click="goAccountDetail">账单明细</p>
        </div>
      </el-col>
    </el-row>
    <up-version ref="levelVersion" :title="title" :money="money"></up-version>
  </el-card>
</template>
<script>
import upVersion from './components/upversion';
export default {
  props: ['userInfo'],
  data() {
    return {
      title: '流量包',
      money: '￥8000.00'
    };
  },
  watch: {
    userInfo: {
      handler() {
        this.userInfo.user_type = '0';
      }
    }
  },
  components: {
    upVersion
  },
  methods: {
    levelVersion(title) {
      this.$refs.levelVersion.dialogVisible = true;
      this.title = title;
    },
    goAccountDetail() {
      this.$router.push({
        name: 'infoDetail'
      });
    },
    buyVersion(type) {
      this.title = type === '1' ? '专业版' : '流量版';
      this.money = type === '1' ? '￥8000.00' : '￥4000.00';
      // this.title = this.userInfo.user_type === '1' ? '专业版':'流量版';
      this.$refs.levelVersion.dialogBuyVisible = true;
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
