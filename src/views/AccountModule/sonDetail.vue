<template>
  <div>
    <pageTitle pageTitle="子账号信息">
      <div slot="content">删除活动不影响已统计的历史数据</div>
    </pageTitle>
    <!-- 子账号管理头部
    <div class="title--flex--top">
      <div class="top-item">
        <el-button size="mini" round  v-preventReClick @click.prevent="copy(sonText)" class="copy-text">复制信息</el-button>
      </div>
    </div>
    -->
    <div class="page--panel">
      <div class="page--son">
        <!-- 子账号Tab区域 -->
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane label="日期统计" name="dateData"></el-tab-pane>
          <el-tab-pane label="直播统计" name="liveData"></el-tab-pane>
        </el-tabs>
        <!-- 列表区域 -->
        <date-data ref="dateDataComp" v-if="tabType === 'dateData'"></date-data>
        <live-data ref="liveDataComp" v-if="tabType === 'liveData'"></live-data>
      </div>
      <div class="page--son-tab">
        <div class="son__detail--user">
          <h1 class="title">
            子账号信息
            <span class="copy" @click="copy(sonText)">
              <el-tooltip class="item" effect="dark" content="复制" placement="top" v-tooltipMove>
                <i class="iconfont-v3 saasicon_copy"></i>
              </el-tooltip>
            </span>
          </h1>
          <div class="son__detail_icon">
            <img src="../../common/images/account/saaszizhanghao_tubiao.png" alt="" />
          </div>
        </div>
        <ul class="son__detail--show">
          <li>
            <label>账号</label>
            <p :title="sonVo && sonVo.name ? sonVo.name : ''">
              {{ sonVo && sonVo.name ? sonVo.name : '- -' }}
            </p>
          </li>
          <li>
            <label>账号昵称</label>
            <p :title="sonVo && sonVo.nick_name ? sonVo.nick_name : ''">
              {{ sonVo && sonVo.nick_name ? sonVo.nick_name : '' }}
            </p>
          </li>
          <li>
            <label>账号角色</label>
            <p :title="sonVo && sonVo.role_name ? sonVo.role_name : ''">
              {{ sonVo && sonVo.role_name ? sonVo.role_name : '' }}
            </p>
          </li>
          <li>
            <label>用量分配</label>
            <p v-if="sonVo && sonVo.vip_info.type === 0">
              并发{{ dynamicText }}
              <span v-if="showSmsModule">&nbsp;&nbsp;|&nbsp;&nbsp;短信{{ dynamicText }}</span>
            </p>
            <p v-if="sonVo && sonVo.vip_info.type === 1">
              流量{{ dynamicText }}
              <span v-if="showSmsModule">&nbsp;&nbsp;|&nbsp;&nbsp;短信{{ dynamicText }}</span>
            </p>
            <p v-if="sonVo && sonVo.vip_info.type === 2">
              时长{{ dynamicText }}
              <span v-if="showSmsModule">&nbsp;&nbsp;|&nbsp;&nbsp;短信{{ dynamicText }}</span>
            </p>
          </li>
          <li>
            <label>手机号码</label>
            <p :title="sonVo && sonVo.phone ? sonVo.phone : ''">
              {{ sonVo && sonVo.phone ? sonVo.phone : '- -' }}
            </p>
          </li>
          <li>
            <label>邮箱地址</label>
            <p :title="sonVo && sonVo.email ? sonVo.email : ''">
              {{ sonVo && sonVo.email ? sonVo.email : '- -' }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import DateData from './components/dateData';
  import LiveData from './components/liveData';
  import Clipboard from 'clipboard';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    name: 'sonDetail.vue',
    components: {
      PageTitle,
      DateData,
      LiveData
    },
    data() {
      return {
        tabType: 'dateData',
        userId: JSON.parse(sessionOrLocal.get('userId')),
        sonVo: {
          vip_info: {}
        }
      };
    },
    computed: {
      sonText: function () {
        return `账号：${this.sonVo.name || '暂无'}
请登录www.vhall.com，选择账号登录，首次登录请修改密码、绑定手机号后进行使用`;
      },
      isZhiXueYun: function () {
        const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
        return userInfo.user_extends.extends_remark == 1;
      },
      showSmsModule: function () {
        const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
          'message_notice'
        ];
        // 不是知学云账号 & 开启了 短信通知配置项权限
        return !this.isZhiXueYun && isNoticeMessage == 1;
      },
      dynamicText: function () {
        return `（${
          this.isZhiXueYun && this.sonVo && this.sonVo.is_dynamic == 2
            ? '固定'
            : this.sonVo && this.sonVo.is_dynamic > 0
            ? '动态'
            : '固定'
        }）`;
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        this.$vhall_paas_port({
          k: this.tabType === 'dateData' ? 100819 : 100820,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });

        this.$nextTick(() => {
          this.$refs[`${this.tabType}Comp`].initComp(this.sonVo);
        });
      },
      sonDetailGet() {
        this.$fetch('sonDetailGet', {
          child_id: this.$route.params.str
        })
          .then(res => {
            this.sonVo = res.data;
            this.tabType = 'dateData';
            this.$nextTick(() => {
              this.$refs[`${this.tabType}Comp`].initComp(this.sonVo);
            });
          })
          .catch(res => {
            console.log(res);
            this.sonVo = null;
          });
      },
      copy(text) {
        let clipboard = new Clipboard('.copy', {
          text: () => text
        });
        clipboard.on('success', () => {
          this.$vhall_paas_port({
            k: 100815,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: '复制成功',
            showClose: true, // 是否展示关闭按钮
            // duration: 0, // 自动关闭时间，为0永不关闭
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on('error', () => {
          this.$message({
            message: '复制失败，暂不支持自动复制',
            showClose: true, // 是否展示关闭按钮
            // duration: 0, // 自动关闭时间，为0永不关闭
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          // 释放内存
          clipboard.destroy();
        });
      }
    },
    mounted() {
      this.sonDetailGet(); // 获取子账号详情
    }
  };
</script>

<style lang="less" scoped>
  @import '../../common/css/common.less';
  /* .page--son {
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
} */

  .page--panel {
    display: -moz-flex;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .page--son {
      width: calc(100% - 272px);
      min-height: 560px;
      height: auto;
      background: #ffffff;
      position: relative;
      border-radius: 4px;
      .el-button {
        margin-top: 3px;
      }
    }
    .page--son-tab {
      width: 248px;
      min-height: 437px;
      background: #ffffff;
      border-radius: 4px;
      padding: 24px 24px;
    }
  }
  .son__detail--user {
    text-align: left;
    .copy {
      float: right;
      cursor: pointer;
    }
    .title {
      font-size: 16px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 22px;
    }
    p {
      text-align: center;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    .son__detail_icon {
      text-align: center;
      margin-top: 32px;
      img {
        width: 62px;
        height: 62px;
      }
    }
  }

  .son__detail--show {
    clear: both;
    padding-top: 32px;
    li {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    label {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-bottom: 4px;
    }
    p {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  /deep/.el-date-editor .el-range__icon {
    line-height: 28px;
  }
</style>
