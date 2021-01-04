<template>
  <div>
    <pageTitle title="子账号管理"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <div class="top-item">
        <p>{{sonInfo && sonInfo.vip_info && sonInfo.vip_info.type > 0 ? '总流量（GB）' : '总并发（方）'}}</p>
        <p>
          <count-to :startVal="0"
                    :endVal="vipTotal"
                    :duration="1500"
                    v-if="vipTotal > 0"></count-to>
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
      <son-list ref="sonListComp"
                @load="getSonInfo"
                v-if="tabType === 'sonList'"
                :vipType="sonInfo && sonInfo.vip_info && sonInfo.vip_info ? sonInfo.vip_info.type : ''"></son-list>
      <role-list ref="roleListComp" v-if="tabType === 'roleList'"></role-list>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import SonList from './components/sonList';
import RoleList from './components/roleList';
import CountTo from 'vue-count-to';
import {sessionOrLocal} from "@/utils/utils";
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
        vip_info: null
      }
    };
  },
  computed: {
    vipTotal: function() {
      if (this.sonInfo && this.sonInfo.vip_info) {
        return this.sonInfo.vip_info.type > 0 ? Number(this.sonInfo.vip_info.flow) : Number(this.sonInfo.vip_info.total);
      } else {
        return 0;
      }
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$nextTick(() => {
        this.$refs[`${this.tabType}Comp`].initComp();
      });
    },
    // 子账号Tab头部内容
    getSonInfo() {
      this.$fetch('getSonInfo', {
        user_id: sessionOrLocal.get('userId')
      }).then(res => {
        if(res && res.code === 200) {
          this.sonInfo = res.data;
          this.tabType = 'sonList';
          try {
            this.$nextTick(() => {
              this.$refs[`sonListComp`].initComp();
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          // this.$message.error(res.msg || '获取信息失败');
        }
      }).catch(e => {
        console.log(e);
      });
    },
    initPage() {
      this.getSonInfo();// 获取子账号统计信息
    }
  },
  created() {
    this.initPage();
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
  /* .min-height--header(); */
  background: transparent;
  .flex-display();
  .justify(space-between);
  .align(center);
  text-align: left;
  margin-bottom: 24px;
  .top-item {
    width: calc((100% - 32px) / 3);
    background: #ffffff;
    padding: 32px 40px;
    border-radius: 4px;
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
