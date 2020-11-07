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
          iconClass: "el-icon-video-camera",
          children: [
            {
              title: "直播列表",
              index: "1-1",
              iconClass: "",
              path: "/live-list"
            },
            {
              title: "创建直播",
              index: "1-2",
              iconClass: "",
              path: "/live/edit"
            }
          ]
        },
        {
          title: "专题管理",
          index: "2",
          iconClass: "el-icon-menu",
          children: [
            {
              title: "专题列表",
              index: "2-1",
              iconClass: "",
              path: "/specials-list"
            },
            {
              title: "创建专题",
              index: "2-2",
              iconClass: "",
              path: "/special-detail/a"
            }
          ]
        },
        {
          title: "资料管理",
          index: "3",
          iconClass: "el-icon-menu",
          children: [
            {
              title: "文档",
              index: "3-1",
              iconClass: "",
              path: "/material-word"
            },
            {
              title: "音视频",
              index: "3-2",
              iconClass: "",
              path: "/material-video"
            },
            {
              title: "问卷",
              index: "3-3",
              iconClass: "",
              path: "/material-question"
            },
            {
              title: "奖品",
              index: "3-4",
              iconClass: "",
              path: "/material-prize"
            },
            {
              title: "观众",
              index: "3-5",
              iconClass: "",
              path: "/material-viewer"
            },
            {
              title: "广告推荐",
              index: "3-6",
              iconClass: "",
              path: "/material-advert"
            },
            {
              title: "礼物",
              index: "3-7",
              iconClass: "",
              path: "/material-gift"
            }
          ]
        },
        {
          title: "数据中心",
          index: "4",
          iconClass: "",
          children: [
            {
              title: "数据总览",
              index: "4-1",
              iconClass: "",
              path: "/data-info"
            },
            {
              title: "活动数据",
              iconClass: "",
              index: "4-2",
              path: "/data-live"
            }
          ]
        },
        {
          title: "设置中心",
          index: "5",
          iconClass: "",
          path: "/setting"
        },
        {
          title: "财务中心",
          index: "6",
          iconClass: "",
          children: [
            {
              title: "财务总览",
              index: "6-1",
              iconClass: "",
              path: "/finance-info"
            },
            {
              title: "账户收益",
              iconClass: "",
              index: "6-2",
              path: "/finance-income"
            }
          ]
        },
        {
          title: "账户管理",
          index: "7",
          iconClass: "",
          children: [
            {
              title: "账户信息",
              index: "7-1",
              iconClass: "",
              path: "/account-info"
            },
            {
              title: "子账号管理",
              iconClass: "",
              index: "7-2",
              path: "/account-son"
            },
            {
              title: "个人主页",
              iconClass: "",
              index: "7-3",
              path: "/account-home"
            }
          ]
        },
        {
          title: "样式Demo",
          index: "8",
          iconClass: "el-icon-setting",
          path: "/css-demo"
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
