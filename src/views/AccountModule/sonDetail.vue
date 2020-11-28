<template>
  <div>
    <pageTitle title="子账号信息"></pageTitle>
    <!-- 子账号管理头部 -->
    <div class="title--flex--top">
      <div class="top-item">
        <el-button size="mini" round  v-preventReClick @click.prevent="copy(sonText)" class="copy-text">复制信息</el-button>
      </div>
      <ul>
        <li>
          <p>账号ID：</p>
          <h3>{{ sonVo && sonVo.child_id ? sonVo.child_id : '' }}</h3>
        </li>
        <li>
          <p>账号昵称：</p>
          <h3>{{ sonVo.nick_name }}</h3>
        </li>
        <li>
          <p>账号角色：</p>
          <h3>{{ sonVo.role_name }}</h3>
        </li>
        <li>
          <p>用量分配：</p>
          <h3>{{ sonVo.vip_Info.type > 0 ? '流量' : '并发' }}（{{sonVo && sonVo.is_dynamic > 0 ? '动态' : '固定'}}）</h3>
        </li>
        <li>
          <p>手机号码：</p>
          <h3>{{ sonVo.phone }}</h3>
        </li>
        <li>
          <p>邮箱地址：</p>
          <h3>{{ sonVo.email }}</h3>
        </li>
      </ul>
    </div>
    <div class="page--son">
      <!-- 子账号Tab区域 -->
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="日期统计" name="dateData"></el-tab-pane>
        <el-tab-pane label="直播统计" name="liveData"></el-tab-pane>
      </el-tabs>
      <!-- 列表区域 -->
      <date-data ref="dateDataComp" v-show="tabType === 'dateData'"></date-data>
      <live-data ref="liveDataComp" v-show="tabType === 'liveData'"></live-data>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import DateData from './components/dateData';
import LiveData from './components/liveData';
import Clipboard from 'clipboard';
export default {
  name: 'sonDetail.vue',
  components: {
    PageTitle,
    DateData,
    LiveData
  },
  data() {
    return {
      tabType: null,
      sonVo: {
        child_id: '',
        is_dynamic: null,
        vip_Info: {}
      }
    };
  },
  computed: {
    sonText: function () {
      return `账号：${this.sonVo.child_id || '暂无'}
密码：${this.sonVo.password || '暂无'}
请登录www.vhall.com，选择账号登录，首次登录请修改密码、绑定手机号后进行使用`;
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
      this.$refs[`${this.tabType}Comp`].initComp();
    },
    sonDetailGet() {
      this.$fetch('sonDetailGet', {}).then(res=>{
        if (res && res.code === 200) {
          this.sonVo = res.data || {
            vip_Info: {}
          };
        } else {
          this.sonVo = {
            vip_Info: {}
          };
        }
      }).catch(e=>{
        console.log(e);
        this.sonVo = {
          vip_Info: {}
        };
      });
    },
    copy(text) {
      let clipboard = new Clipboard('.copy-text', {
        text: () => text
      });
      clipboard.on('success', () => {
        this.$message.success('复制成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        this.$message.error('复制失败，暂不支持自动复制');
        // 释放内存
        clipboard.destroy();
      });
    }
  },
  mounted() {
    this.tabType = 'dateData';
    this.$refs[`dateDataComp`].initComp();
    this.sonDetailGet();// 获取子账号详情
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.page--son {
  .layout--right--main();
  .min-height();
}
.title--flex--top {
  .layout--right--main();
  .min-height--header();
  ul {
    display: block;
    margin: 32px auto;
    width: calc(100% - 64px);
    li {
      width: 33.3%;
      display: inline-block;
      vertical-align: top;
      margin-bottom: 24px;
    }
  }
  text-align: left;
  margin-bottom: 24px;
  .top-item {
    text-align: right;
    margin-right: 24px;
    margin-top: 24px;
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
