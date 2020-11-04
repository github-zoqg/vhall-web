<template>
  <div class="data-usage">
    <el-row type="flex" class="row-top" justify="space-around" v-if="upgrade_version === '旗舰版'">
      <el-col :span="6">
        <div class="top-item">
          <p>有效期: 2020-12-10</p>
          <h2>{{ upgrade_version }}</h2>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>总并发(方)<span class="level">升级</span></p>
          <h2>550</h2>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="top-item">
          <p>并发扩展包<span class="level">续费</span></p>
          <h2>550</h2>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-top" justify="space-around" v-else>
      <el-col :span="9">
        <div class="top-item">
          <p>有效期: 2020-12-10</p>
          <h2>{{ upgrade_version }} <span class="level" v-if = "upgrade_version !== '无极版'">{{ upgrade_version === '专业版' ? '续费' : '升级'}}</span></h2>
        </div>
      </el-col>
      <el-col :span="9" v-if = "upgrade_version === '无极版'">
        <div class="top-item">
          <p>总流量/回放流量（GB）</p>
          <h2>无限流量/10</h2>
        </div>
      </el-col>
      <el-col :span="9" v-else>
        <div class="top-item">
          <p>总流量/可用流量（GB）<span class="level">购买</span></p>
          <h2>550</h2>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['upgrade_version']
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
    height: 104px;
    padding: 24px 0;
    .level {
      display: inline-block;
      width: 40px;
      height: 20px;
      background: #fa9a32;
      font-size: 14px;
      border-radius: 2px;
      color: #fff;
      text-align: center;
      line-height: 20px;
      margin-left: 6px;
      cursor: pointer;
    }
    p {
      font-size: 14px;
      color: #999;
      padding-bottom: 6px;
    }
    h2 {
      font-size: 22px;
      color: #1a1a1a;
      line-height: 30px;
      font-weight: bold;
    }
  }
}
</style>
