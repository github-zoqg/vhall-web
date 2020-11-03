<template>
  <div id="app">
        <el-container class="box">
        <el-header>-头部</el-header>
        <el-container class="el-main-box">
          <el-aside width="200px" style="height:100%">
            <!-- 左侧导航 -->
            <app-home></app-home>
          </el-aside>
          <el-main>
            <!-- 面包屑 -->
            <!-- <breadcrumb></breadcrumb> -->
            <router-view />
          </el-main>
        </el-container>
        <el-footer>底部</el-footer>
    </el-container>
  </div>
</template>
<script>
import AppHome from "./views/Home/index";
export default {
  components: {
    AppHome
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
<style lang="less">
</style>
