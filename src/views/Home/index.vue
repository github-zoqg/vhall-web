<template>
  <el-menu
    :default-active="activePath"
    :default-openeds="activeArray"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @select="handleSelect"
  >
    <menu-item v-for="(item, index) in list" :key="index" :item="item">{{item.title}}</menu-item>
  </el-menu>
</template>
<script>
import MenuItem from "@/components/MenuItem/index.vue";
export default {
  components: {
    MenuItem
  },
  data() {
    return {
      list: [
        {
          title: "首页",
          index: "0",
          iconClass: "el-icon-setting",
          path: "/default"
        },
        {
          title: "直播管理",
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
          title: "专题管理",
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
        },
        {
          title: "直播管理",
          index: "4",
          iconClass: "el-icon-video-camera",
          children: [
            {
              title: "直播列表",
              index: "4-1",
              iconClass: "",
              path: "/live/list"
            },
            {
              title: "创建直播",
              iconClass: "",
              index: "4-2",
              path: "/live/edit"
            }
          ]
        }
      ],
      activePath: 0, // 默认左边菜单栏路径
      activeArray: [0]
    };
  },
  created() {
    if (localStorage.getItem("localPath")) {
      let localPath = JSON.parse(localStorage.getItem("localPath"));
      let localLength = localPath.length;
      this.activePath = localPath[localLength - 1];
      this.activeArray = localPath;
      console.log(this.activePath, "end-----------");
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath, "el-menu组件上的内容");
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath, "el-menu 菜单激活回调");
      localStorage.setItem("localPath", JSON.stringify(keyPath));
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo{
  height: calc(100vh - 60px);
  background: #1A1A1A;
}
</style>
