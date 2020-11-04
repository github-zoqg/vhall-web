<template>
  <div id="app">
    <el-container class="box">
          <el-header class="head">
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
    }
  },
  created() {
      this.$fetch('vssInfo', {platform: '123'}).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  },
}
</script>
<style lang="less" scope>
.el-container .head{
  padding: 0;
  height: 64px!important;
}
</style>
