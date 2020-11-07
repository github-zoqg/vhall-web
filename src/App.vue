<template>
  <div id="app">
    <el-container class="box">
          <el-header class="head" height="64px">
            <app-head></app-head>
          </el-header>
          <el-container class="el-main-box">
            <el-aside width="225px" style="height:100%">
              <!-- 左侧导航 -->
              <app-home></app-home>
            </el-aside>
            <el-main class="route-wrap">
              <router-view />
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>
<script>
import AppHome from "./views/Home/index";
import AppHead from "@/components/Header/index";
export default {
  components: {
    AppHome,
    AppHead
  },
  data() {
    return {
    };
  }
};
</script>
<style lang="less" scoped>
.el-container .el-header{
  padding: 0;
}
</style>
