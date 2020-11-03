<template>
<el-menu default-active="1-4-1" class="el-menu-vertical-demo">
  <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">导航一</span>
    </template>
    <el-menu-item-group>
      <span slot="title">分组一</span>
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
  <el-menu-item index="2">
    <i class="el-icon-menu"></i>
    <span slot="title">导航二</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <i class="el-icon-document"></i>
    <span slot="title">导航三</span>
  </el-menu-item>
  <el-menu-item index="4">
    <i class="el-icon-setting"></i>
    <span slot="title">导航四</span>
  </el-menu-item>
</el-menu>
</template>
<script>
// import elMenuItem from "@/components/MenuItem/index.vue";
export default {
  components: {
    // elMenuItem
  },
  data() {
    return {
      list: [
        {
          title: "概况",
          index: "0",
          iconClass: "el-icon-setting",
          path: "/default"
        },
        {
          title: "导航一",
          index: "1",
          iconClass: "el-icon-location",
          children: [
            {
              title: "选项一",
              index: "1-1",
              iconClass: "",
              path: "/dao1/xuan1"
            },
            {
              title: "选项二",
              iconClass: "",
              index: "1-2",
              children: [
                {
                  title: "选项二_一",
                  index: "1-2-1",
                  path: "/dao1/xuan2/child1"
                },
                {
                  title: "选项二_二",
                  index: "1-2-2",
                  path: "/dao1/xuan2/child2"
                }
              ]
            }
          ]
        },
        {
          title: "导航二",

          index: "2",
          iconClass: "el-icon-menu",
          children: [
            {
              title: "选项1",
              index: "2-1",
              path: "/dao2/xuan1"
            }
          ]
        },
        {
          title: "导航三",
          index: "3",
          iconClass: "el-icon-setting",
          path: "/dao3/index"
        }
      ],
      activePath: '0', // 默认左边菜单栏路径
      activeArray: [0]
    };
  },
  created() {
    if (localStorage.getItem("localPath")) {
      // let localPath = JSON.parse(localStorage.getItem("localPath"));
      // let localLength = localPath.length;
      // this.activePath = localPath[localLength - 1];
      // this.activeArray = localPath;
      // console.log(this.activePath, "end-----------");
    }
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath, "el-menu组件上的内容");
    // },
    // handleSelect(key, keyPath) {
    //   console.log(key, keyPath, "el-menu 菜单激活回调");
    //   localStorage.setItem("localPath", JSON.stringify(keyPath));
    // }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo{
  height: calc(100vh - 120px);
}
</style>
