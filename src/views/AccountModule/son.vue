<template>
  <div>
    <pageTitle pageTitle="子账号管理"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <div :class="topItemCss(0)">
        <p v-if="sonInfo && sonInfo.vip_info && sonInfo.vip_info.type === 0">总并发（方）</p>
        <p v-if="sonInfo && sonInfo.vip_info && sonInfo.vip_info.type === 1">总流量（GB）</p>
        <p v-if="sonInfo && sonInfo.vip_info && sonInfo.vip_info.type === 2">总时长</p>
        <p class="custom-font-barlow">
          <count-to :startVal="0"
                    :endVal="vipTotal"
                    :duration="1500"
                    v-if="vipTotal > 0"></count-to>
          <span v-else>0</span>
        </p>
      </div>
      <div :class="topItemCss(1)">
        <p>子账号（个）</p>
        <p class="custom-font-barlow">
          <count-to :startVal="0" :endVal="sonInfo.child_count||0" :duration="1500" v-if="sonInfo && sonInfo.child_count > 0"></count-to>
          <span v-else>0</span>
        </p>
      </div>
      <div :class="topItemCss(2)">
        <p>活动数量（个）</p>
        <p class="custom-font-barlow">
          <count-to :startVal="0" :endVal="sonInfo.webinar_count||0" :duration="1500" v-if="sonInfo && sonInfo.webinar_count > 0"></count-to>
          <span v-else>0</span>
        </p>
      </div>
      <div :class="topItemCss(3)" v-if="showSmsModule">
        <p>短信余额（条）</p>
        <p class="custom-font-barlow">
          <count-to :startVal="0" :endVal="sonInfo.vip_info.sms||0" :duration="1500" v-if="sonInfo && sonInfo.vip_info && sonInfo.vip_info"></count-to>
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
      userId: JSON.parse(sessionOrLocal.get("userId")),
      sonInfo: {
        vip_info: {
          sms: 0
        }
      },
      userInfo: {
        user_extends: {
          extends_remark: 0
        }
      }
    };
  },
  computed: {
    vipTotal: function() {
      if (this.sonInfo && this.sonInfo.vip_info) {
        if(this.sonInfo.vip_info.type === 1){
          return Number(this.sonInfo.vip_info.flow)
        }else if(this.sonInfo.vip_info.type === 0){
          return Number(this.sonInfo.vip_info.total)
        }else if(this.sonInfo.vip_info.type === 2){
          return Number(this.sonInfo.vip_info.total_duration)
        } else {return 0}
      } else {
        return 0;
      }
    },
    isZhiXueYun: function () {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      return userInfo.user_extends.extends_remark == 1;
    },
    showSmsModule: function () {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['message_notice'];
      // 不是知学云账号 & 开启了 短信通知配置项权限
      return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
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
        this.sonInfo = res.data;
        this.tabType = 'sonList';
        try {
          this.$nextTick(() => {
            this.$refs[`sonListComp`].initComp();
          });
        } catch (e) {
          console.log(e);
        }
      }).catch(res => {
        this.$message({
          message: res.msg || `获取信息失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    initPage() {
      this.getSonInfo();// 获取子账号统计信息
    },
    topItemCss(type) {
      if(this.showSmsModule) {
        // 不是知学云，开启了短信
        return 'top-item top-item-lg4'
      } else if (this.isZhiXueYun) {
        // 是知学云
        return type === 0 ? 'top-item' : 'top-item top-item-lg'
      } else {
        // 不是知学云，未开启短信
        return 'top-item'
      }
    }
  },
  created() {
    this.initPage();
    const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
    this.userInfo = userInfo
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
    &-lg {
      width: calc((100% - 32px) / 2);
    }
    &-lg4 {
      width: calc((100% - 48px) / 4);
    }
  }
  p {
    font-size: @font_size_14;
    font-family: @fontRegular;
    font-weight: 400;
    color: @font_color_h3;
    line-height: 20px;
    &:last-child {
      margin-top: 4px;
      span {
        font-size: @font_size_28;
        font-weight: bold;
        color: @font_color_h1;
        line-height: 32px;
      }
    }
  }
}
</style>
