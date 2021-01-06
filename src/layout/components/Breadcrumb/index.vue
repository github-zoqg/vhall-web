<template>
  <div>
    <div class="sys-date" v-if="this.$route.meta.name === 'sysHome'">
      今日，{{sysDateStr}}，欢迎您回到微吼控制台。
    </div>
    <el-breadcrumb class="app-breadcrumb" separator=">" v-else>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" :class="`no-redirect level_${index}`">{{ item.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>

</template>

<script>
import * as pathToRegexp from 'path-to-regexp';
import { CrumbSet } from "@/router/crumb"; // progress bar style
export default {
  data() {
    return {
      levelList: null,
      sysDateStr: ''
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return;
      }
      this.getBreadcrumb();
    }
  },
  created() {
    if(this.dateUpdateTimer) {
      window.clearInterval(this.dateUpdateTimer);
    }
    // 获取本地系统时间字符串
    // this.sysDateStr = this.$moment(new Date().getTime()).format('llll');
    this.sysDateStr = this.$moment(new Date().getTime()).format('YYYY年MM月DD日');
    this.updateData();
    this.getBreadcrumb();
  },
  methods: {
    updateData() {
      let that = this;
      this.dateUpdateTimer = setInterval(() => {
        that.sysDateStr = that.$moment(new Date().getTime()).format('llll');
      }, 60000); // 一分钟更新一下
    },
    getBreadcrumb() {
      // this.$router 所有路由。this.$route 当前路由
      console.log('导航面包屑')
      console.log(this.$route);
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const first = matched[0];
      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched);
      // }
      // this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);

      this.levelList = CrumbSet(this.$route.meta.name, this);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      let toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  },
  beforeDestroy() {
    if(this.dateUpdateTimer) {
      window.clearInterval(this.dateUpdateTimer);
    }
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
.sys-date {
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
  span {
    font-weight: bold;
    font-size: 18px;
  }
}
/deep/.el-breadcrumb__separator {
    color: #666666;
    margin: 0 10px 0 5px;
    font-weight: 400;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 32px;
  margin-left: 8px;
  .no-redirect {
    cursor: text;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
    cursor: default;
    &.level_0 {
      color: #666666;
      cursor: not-allowed;
    }
  }
}
/deep/.el-breadcrumb__inner a, /deep/.el-breadcrumb__inner.is-link {
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #1A1A1A;
}
</style>
