<template>
  <div class="data-usage">
    <!-- userInfo.user_type == '2' ? '旗舰版' : userInfo.user_type == '1' ? '专业版' :  userInfo.user_type == '3' ? '无极版' : '标准版' -->
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.user_type == '2'">
      <el-col :span="6">
        <div class="top-item">
          <p>当前版本</p>
          <h2>旗舰版</h2>
          <p>有效期: {{ userInfo.edition_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>总并发(方)<span class="level">升级</span></p>
          <h2>{{ userInfo.total_concurrency }}</h2>
          <p>有效期: {{ userInfo.concurrency_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>并发扩展包<span class="level">续费</span></p>
          <h2>{{ userInfo.concurrency_extend }}</h2>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-top" justify="space-around" v-else>
      <el-col :span="9">
        <div class="top-item">
          <p>当前版本</p>
          <h2>{{ userInfo.user_type == '1' ? '专业版' : userInfo.user_type == '3' ? '无极版' : '标准版' }} <span class="level" v-if = "userInfo.user_type != '3'">{{ userInfo.user_type == '1' ? '续费' : '升级'}}</span></h2>
          <p>有效期: {{ userInfo.edition_valid_time }}</p>
        </div>
      </el-col>
      <el-col :span="9" v-if = "userInfo.user_type == '3'">
        <div class="top-item">
          <p>总流量/回放流量（GB）</p>
          <h2>{{userInfo.total_flow}}/{{ userInfo.valid_flow }}</h2>
        </div>
      </el-col>
      <el-col :span="9" v-else>
        <div class="top-item">
          <p>总流量/可用流量（GB）<span class="level">购买</span></p>
          <h2>{{userInfo.total_flow}}/{{ userInfo.valid_flow }}</h2>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['userInfo'],
  watch: {
    userInfo: {
      handler() {
        this.userInfo.user_type = '2';
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
