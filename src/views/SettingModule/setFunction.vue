<template>
  <div class="page-padding">
    <pageTitle pageTitle="功能配置"></pageTitle>
    <!-- 内容区域  -->
    <div class="plan-func-main">
      <div class="plan-func-form">
        <div class="div__func div__view" v-if="keyList.length > 0">
          <div class="div__view__title">观看页设置</div>
          <ul class="switch__list">
            <li class="switch__box" v-for="(item, ins) in keyList" :key="`view_` + ins">
              <label class="leve3_title label__r12">{{ item.key_name }}</label>
              <!-- TODO:支付牌照问题 -->
              <el-switch
                @click.native="handleSwitchClick(item)"
                :disabled="item.disabled"
                v-model="item.value"
                :active-value="0"
                :inactive-value="1"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                @change="changeStatus($event, item, 1)"
              ></el-switch>
              <span class="leve3_title title--999">
                {{ !!item.value ? item.openShow : item.closeShow }}
              </span>
            </li>
          </ul>
        </div>
        <div class="div__func div__playback" v-if="liveKeyList.length > 0">
          <div class="div__view__title">回放设置</div>
          <ul class="switch__list">
            <li class="switch__box" v-for="(item, ins) in liveKeyList" :key="`playback_` + ins">
              <label class="leve3_title label__r12">{{ item.key_name }}</label>
              <el-switch
                v-model="item.value"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                @change="changeStatus($event, item, 2)"
              ></el-switch>
              <span class="leve3_title title--999">
                {{ !!item.value ? item.openShow : item.closeShow }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="plan-func-preview">
        <!-- 模拟开关 -->
        <div class="zdy--switch">
          <span
            :class="switchType === 'app' ? 'active' : ''"
            @click.prevent.stop="changeSwitch('app')"
          >
            手机预览
          </span>
          <span
            :class="switchType === 'pc' ? 'active' : ''"
            @click.prevent.stop="changeSwitch('pc')"
          >
            PC预览
          </span>
        </div>
        <!--PC预览,begin-->
        <div :class="['plan-func-pc', { zj: !chapterCompute }]" v-show="switchType === 'pc'">
          <span class="share-span" v-if="shareCompute"></span>
          <div class="icon-spans">
            <span class="reward-span" v-if="rewardCompute"></span>
            <span class="gift-span" v-if="giftCompute"></span>
            <span class="like-span" v-if="likeCompute"></span>
          </div>
          <span class="chat-stop" :class="chatCompute ? 'isChatStop' : ''" v-if="chapterCompute">
            {{ !chatCompute ? `您已被禁言` : `说点什么` }}
          </span>
        </div>
        <!--手机预览,begin-->
        <div :class="['plan-func-app', { visible: !chapterCompute }]" v-show="switchType === 'app'">
          <span class="chat-span">{{ !chatCompute ? `您已被禁言` : `说点什么` }}</span>
          <div class="icon-spans">
            <span class="gift-span" v-if="giftCompute"></span>
            <span class="reward-span" v-if="rewardCompute"></span>
            <span class="like-span" v-if="likeCompute"></span>
          </div>
        </div>
        <div
          :class="['plan-func-app', 'zj', { visible: chapterCompute }]"
          v-show="switchType === 'app'"
        >
          <span class="chat-span">{{ !chatCompute ? `您已被禁言` : `说点什么` }}</span>
          <div class="icon-spans">
            <span class="gift-span" v-if="giftCompute"></span>
            <span class="reward-span" v-if="rewardCompute"></span>
            <span class="like-span" v-if="likeCompute"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    name: 'functionMgr',
    components: {
      PageTitle
    },
    data() {
      return {
        permission: null,
        lowerGradeInterval: null,
        switchType: 'app',
        query: {},
        userId: JSON.parse(sessionOrLocal.get('userId')),
        keyList: [],
        liveKeyList: [],
        vm: null
      };
    },
    computed: {
      rewardCompute: function () {
        let voArr = this.keyList.filter(item => item.type === 'ui.hide_reward')[0];
        return !(voArr && voArr.value > 0);
      },
      giftCompute: function () {
        let voArr = this.keyList.filter(item => item.type === 'ui.hide_gifts')[0];
        return !(voArr && voArr.value > 0);
      },
      shareCompute: function () {
        let voArr = this.keyList.filter(item => item.type === 'ui.watch_hide_share')[0];
        return !(voArr && voArr.value > 0);
      },
      likeCompute: function () {
        let voArr = this.keyList.filter(item => item.type === 'ui.watch_hide_like')[0];
        return !(voArr && voArr.value > 0);
      },
      chatCompute: function () {
        let voArr = this.liveKeyList.filter(item => item.type === 'ui.watch_record_no_chatting')[0];
        return !(voArr && voArr.value > 0);
      },
      chapterCompute: function () {
        let voArr = this.liveKeyList.filter(item => item.type === 'ui.watch_record_chapter')[0];
        return !(voArr && voArr.value > 0);
      }
    },
    beforeDestroy() {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
    },
    methods: {
      // TODO:支付牌照问题
      handleSwitchClick(item) {
        if (item.disabled) {
          this.$message.warning('合规自查中，该功能暂不支持使用');
        }
      },
      handleLowerGradeHeart() {
        this.getLowerGradeConfig();
        this.lowerGradeInterval = setInterval(() => {
          this.getLowerGradeConfig();
        }, (Math.random() * 5 + 5) * 1000);
      },
      getLowerGradeConfig() {
        this.$fetch('lowerGrade', {})
          .then(res => {})
          .catch(res => {
            // 降级没有code吗
            const { activity, user, global } = res;
            // 优先顺序：互动 > 用户 > 全局
            const activityConfig =
              activity && activity.length > 0
                ? activity.find(option => option.audience_id == this.$route.params.str)
                : null;
            const userConfig =
              user && user.length > 0
                ? user.find(option => option.audience_id == this.userId)
                : null;
            if (activityConfig) {
              this.setLowerGradeConfig(activityConfig.permissions);
            } else if (userConfig) {
              this.setLowerGradeConfig(userConfig.permissions);
            } else if (global && global.permissions) {
              this.setLowerGradeConfig(global.permissions);
            }
          });
      },
      setLowerGradeConfig(val) {
        if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
        let _permission = this.permission;
        let repermission = {};
        if (_permission) {
          repermission = Object.assign({}, _permission, val);
        } else {
          repermission = val;
        }
        this.planSuccessRender(JSON.stringify(repermission));
      },
      showLiveKey(key) {
        let live = this.keyList.filter(item => item.type === key);
        let liveKey = this.liveKeyList.filter(item => item.type === key);
        console.log(live, liveKey);
        return live[0] || liveKey[0];
      },
      // 预览切换
      changeSwitch(type) {
        this.switchType = type;
      },
      //文案提示问题
      messageInfo(title, type) {
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      changeStatus(callback, item, type) {
        item.value = Number(!callback);
        let params = {
          permission_key: item.type,
          status: Number(callback)
        };
        console.log('当前参数传递：', params);
        this.$fetch('planFunctionEdit', params)
          .then(res => {
            console.log(res);
            if (type === 1) {
              this.$vhall_paas_port({
                k: Number(callback) === 1 ? item.k + 1 : item.k,
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
            } else {
              this.$vhall_paas_port({
                k: Number(callback) === 1 ? item.k : item.k + 1,
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
            }
            let str = `${!callback ? '开启' : '关闭'}`;
            if (
              item.type === 'ui.watch_record_no_chatting' ||
              item.type === 'ui.watch_record_chapter'
            ) {
              str = `${!callback ? '关闭' : '开启'} `;
            }
            if (this.vm) {
              this.vm.close();
            }
            this.messageInfo(`${str} ${item.key_name}`, 'success');
            item.value = Number(callback);
          })
          .catch(res => {
            if (this.vm) {
              this.vm.close();
            }
            this.messageInfo(`${str} ${item.key_name}`, 'error');
          });
      },
      planSuccessRender(data) {
        let dataVo = JSON.parse(data);
        console.log(dataVo, '功能配置12');
        let permissions = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'));
        // let perVo = permissions ? JSON.parse(permissions) : {};
        // if(perVo['ui.record_chapter'] === '' || perVo['ui.record_chapter'] === '') {
        //   perVo['ui.record_chapter'] = 1;
        // }
        this.keyList = [
          {
            type: 'ui.hide_reward',
            key_name: '打赏功能',
            openShow: '开启后，观看页显示打赏功能',
            closeShow: '已开启，观看页显示打赏功能',
            k: 100621,
            value: Number(dataVo['ui.hide_reward']) || 0,
            disabled: true // TODO:支付牌照问题
          },
          {
            type: 'ui.watch_hide_like',
            key_name: '点赞功能',
            k: 100623,
            openShow: '开启后，观看页显示点赞功能',
            closeShow: '已开启，观看页显示点赞功能',
            value: Number(dataVo['ui.watch_hide_like']) || 0
          },
          {
            type: 'ui.hide_gifts',
            key_name: '礼物功能',
            openShow: '开启后，观看页显示礼物功能',
            closeShow: '已开启，观看页显示礼物功能',
            k: 100625,
            value: Number(dataVo['ui.hide_gifts']) || 0
          },
          {
            type: 'ui.watch_hide_share',
            key_name: '分享功能',
            k: 100627,
            openShow: '开启后，观看页显示分享功能（包含微信内分享）',
            closeShow: '已开启，观看页显示分享功能（包含微信内分享）',
            value: Number(dataVo['ui.watch_hide_share']) || 0
          }
        ];
        this.liveKeyList = [
          {
            type: 'ui.watch_record_no_chatting',
            key_name: '回放禁言',
            k: 100629,
            openShow: '已开启，回放/点播不支持聊天',
            closeShow: '开启后，回放/点播不支持聊天',
            value: Number(dataVo['ui.watch_record_no_chatting']) || 0
          }
        ];
        if (permissions['ui.record_chapter'] > 0) {
          this.liveKeyList.push({
            type: 'ui.watch_record_chapter',
            key_name: '回放章节',
            k: 100631,
            openShow: '已开启，回放/点播观看端显示文档章节',
            closeShow: '开启后，回放/点播观看端显示文档章节',
            value: Number(dataVo['ui.watch_record_chapter']) || 0
          });
        }
      },
      planErrorRender(err) {
        this.$message({
          message: err.msg,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        this.keyList = null;
      },
      // 获取可配置选项
      planFunctionGet() {
        this.$fetch('planFunctionGet', {
          // webinar_user_id: sessionOrLocal.get('userId'),
          type: 2,
          scene_id: 2
        })
          .then(res => {
            console.log(res);
            // this.handleLowerGradeHeart()
            // 数据渲染
            if (res.data) {
              this.permission = res.data.permissions ? JSON.parse(res.data.permissions) : null;
              this.planSuccessRender(res.data.permissions);
            }
          })
          .catch(res => {
            console.log(res);
            this.planErrorRender(res);
          });
      }
    },
    created() {
      this.planFunctionGet();
      console.log('helow');
    }
  };
</script>

<style lang="less" scoped>
  @import '../../common/css/common.less';
  @import '../../common/css/base.less';
  .page-padding {
    padding: 0 0;
  }
  .plan-func-main {
    display: flex;
    padding: 48px 0;
    background: #fff;
    min-height: 816px;
    border-radius: 4px;
  }
  /* 左侧 */
  .plan-func-form {
    width: 500px;
    margin-right: 64px;
  }
  .h1__title {
    margin-bottom: 32px;
  }
  .div__func {
    min-height: 190px;
    background: @background_white;
    border-radius: 4px;
    margin: 0 auto 20px auto;
  }
  .div__view__title {
    margin-left: 56px;
    font-size: @font_size_16;
    font-family: @fontRegular;
    font-weight: 400;
    color: @font_color_h1;
    line-height: 22px;
  }
  .switch__list {
    padding-top: 24px;
    padding-bottom: 32px;
    li {
      display: block;
      list-style-type: none;
      margin-bottom: 32px;
      margin-left: 88px;
      line-height: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  /* 右侧 */
  .plan-func-preview {
    position: relative;
  }
  .plan-func-pc {
    width: 440px;
    height: 254px;
    background-image: url('../../common/images/plan-function/pc-dafault2.png');
    background-size: 100%;
    background-position: center;
    background-size: cover;
    position: relative;
    &.zj {
      background-image: url('../../common/images/plan-function/pc-zj2.png');
    }
    .share-span {
      position: absolute;
      top: 23px;
      right: 53px;
      display: inline-block;
      width: 8px;
      height: 10px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-left: 2px;
      background-image: url('../../common/images/plan-function/share-pc.png');
    }
    .chat-stop {
      position: absolute;
      bottom: 35px;
      right: 75px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 12px;
      transform: scale(0.6);
      &.isChatStop {
        right: 85px;
      }
    }
    .icon-spans {
      position: absolute;
      bottom: 31px;
      right: 150px;
      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
      }
      .reward-span {
        background-image: url('../../common/images/plan-function/pc-reward@2x.png');
      }
      .like-span {
        background-image: url('../../common/images/plan-function/pc-like@2x.png');
      }
      .gift-span {
        background-image: url('../../common/images/plan-function/pc-gift@2x.png');
      }
    }
  }
  .plan-func-app {
    width: 420px;
    height: 690px;
    margin-top: -24px;
    margin-left: -47px;
    background-image: url('../../common/images/plan-function/phone-default.png');
    background-size: 100%;
    background-position: center;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 54px;
    -webkit-transition: opacity 0.5s ease-in-out;
    -moz-transition: opacity 0.5s ease-in-out;
    -o-transition: opacity 0.5s ease-in-out;
    transition: opacity 0.5s ease-in-out;
    &.visible {
      opacity: 0;
      filter: alpha(opacity=0);
    }
    &.zj {
      background-image: url('../../common/images/plan-function/phone-zj.png');
    }
    .chat-span {
      position: absolute;
      bottom: 60px;
      left: 78px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 12px;
    }
    .icon-spans {
      position: absolute;
      bottom: 50px;
      right: 60px;
      span {
        display: inline-block;
        width: 28px;
        height: 28px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .like-span {
        background-image: url('../../common/images/plan-function/phone-like@2x.png');
      }
      .gift-span {
        background-image: url('../../common/images/plan-function/phone-gift@2x.png');
      }
      .reward-span {
        background-image: url('../../common/images/plan-function/phone-reward@2x.png');
      }
    }
  }
</style>
