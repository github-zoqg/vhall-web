<template>
  <div class="baseWrapper">
    <el-container class="box">
      <el-header class="head" height="64px">
        <app-head @change="changeIsCollapse"></app-head>
      </el-header>
      <el-container class="el-main-box">
        <el-aside width="225px" style="height:100%">
          <!-- 左侧导航 -->
          <side-bar :isCollapse="isCollapse"></side-bar>
        </el-aside>
        <el-main class="route-wrap">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar/index";
import AppHead from "@/components/Header/index";
export default {
  components: {
    SideBar,
    AppHead
  },
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    changeIsCollapse(isCollapse) {
       this.isCollapse = !!isCollapse;
    }
  }
};
</script>
<style lang="less" scoped>
.el-container .el-header{
  padding: 0;
}
</style>
