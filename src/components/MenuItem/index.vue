<template>
  <el-submenu class="li" :index="item.index" v-if="item.children">
    <template slot="title">
      <i :class="item.iconClass"></i>
      <span>{{ item.title }}</span>
    </template>
    <template v-if="item.children">
      <default-home v-for="(item,index) in item.children" :item="item" :key="index"></default-home>
    </template>
  </el-submenu>
  <el-menu-item v-else :index="item.index">
    <router-link :to="{ path: item.path }" class="a-line">
      <i :class="item.iconClass"></i>
      <span>{{ item.title }}</span>
    </router-link>
  </el-menu-item>
</template>
<script>
export default {
  props: ["item"],
  name: "defaultHome",
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$route, 3333);
  },
  methods: {
    setAddress(param) {
      console.log(param, "最终点击的设置值");
      // localStorage.setItem("localAddress", JSON.stringify(to.matched));
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-submenu,
.el-submenu .el-menu-item {
  padding: 0;
}
.a-line {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #E2E2E2;
}
.router-link-active {
  font-size: 16px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #FA3F37;
}
.el-menu-item:focus, .el-menu-item:hover{
  background: #333333;
}
</style>
