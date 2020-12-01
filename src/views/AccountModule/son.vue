<template>
  <div>
    <pageTitle title="子账号管理"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <div class="top-item">
        <p>{{sonInfo && sonInfo.vipInfo && sonInfo.vipInfo.type > 0 ? '总流量（GB）' : '总并发（方）'}}</p>
        <p>
          <count-to :startVal="0" :endVal="sonInfo && sonInfo.vipInfo && sonInfo.vipInfo.type > 0 ? Number(sonInfo.vipInfo.total_flow) : Number(sonInfo.vipInfo.total)" :duration="1500" v-if="sonInfo.vipInfo !== null && (sonInfo.vipInfo.total > 0 || sonInfo.vipInfo.total_flow > 0)"></count-to>
          <span v-else>0</span>
        </p>
      </div>
      <div class="top-item">
        <p>子账号（个）</p>
        <p>
          <count-to :startVal="0" :endVal="sonInfo.child_count" :duration="1500" v-if="sonInfo && sonInfo.child_count > 0"></count-to>
          <span v-else>0</span>
        </p>
      </div>
      <div class="top-item">
        <p>活动数量（个）</p>
        <p>
          <count-to :startVal="0" :endVal="sonInfo.webinar_count" :duration="1500" v-if="sonInfo && sonInfo.webinar_count > 0"></count-to>
          <span v-else>0</span>
        </p>
      </div>
    </div>
    <div class="page--son">
      <!-- 子账号Tab区域 -->
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="子账号" name="sonList"></el-tab-pane>
        <el-tab-pane label="角色" name="roleList"></el-tab-pane>
      </el-tabs>
      <!-- 列表区域 -->
      <son-list ref="sonListComp" v-if="tabType === 'sonList'" :vipType="sonInfo.vipInfo.type"></son-list>
      <role-list ref="roleListComp" v-if="tabType === 'roleList'"></role-list>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SonList from './components/sonList';
import RoleList from './components/roleList';
import CountTo from 'vue-count-to';
export default {
  name: 'son.vue',
  components: {
    PageTitle,
    SonList,
    RoleList,
    CountTo
  },
  data() {
    return {
      tabType: 'sonList',
      sonInfo: {
        vipInfo: {}
      }
    };
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    },
    getSonInfo() {
      this.$fetch('getSonInfo', {
        user_id: 1
      }).then(res => {
        this.sonInfo = res && res.code === 200 && res.data ? res.data : null;
      }).catch(e => {
        console.log(e);
        this.sonInfo = null;
      });
    },
    async initPage() {
      this.getSonInfo();// 获取子账号统计信息
    }
  },
  created() {
    this.initPage();
  },
  mounted() {
    this.tabType = 'sonList';
    this.$nextTick(() => {
      this.$refs[`sonListComp`].initComp();
    });
  }
};
</script>

<style lang="less" scoped>
.page--son {
  .layout--right--main();
  .min-height();
}
.title--flex--top {
  .layout--right--main();
  .min-height--header();
  .flex-display();
  .justify(space-between);
  .align(center);
  text-align: left;
  margin-bottom: 24px;
  .top-item {
    width: 33%;
    padding-left: 40px;
  }
  p {
    font-size: @font_size_14;
    font-family: @fontRegular;
    font-weight: 400;
    color: @font_color_h3;
    line-height: 20px;
    &:last-child {
      margin-top: 6px;
      font-size: @font_size_30;
      font-family: @fontDINAL;
      font-weight: bold;
      color: @font_color_h1;
      line-height: 35px;
    }
  }
}
</style>
