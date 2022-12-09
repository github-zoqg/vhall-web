<template>
  <div :class="['signup-main', { 'subject-signup': signUpPageType === 'subject' }]">
    <div class="head">
      <pageTitle pageTitle="报名表单">
        <div class="switchBox" v-if="signUpPageType === 'webinar'">
          <el-switch
            class="swtich"
            v-model="signUpSwtich"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="handleChangeSwitchRegForm"
            active-text=""
          ></el-switch>
          <span class="sign-switch-desc">
            {{ signUpSwtich ? '已开启' : '开启后' }}，若直播关联专题，以专题鉴权为准。
            <a href="javascript:void(0)" @click="showDetailDialog">查看详情</a>
          </span>
        </div>
        <div class="headBtnGroup">
          <el-button
            round
            size="medium"
            class="transparent-btn"
            v-preventReClick
            @click.prevent.stop="openDialog('theme')"
          >
            设置
          </el-button>
          <el-button
            round
            size="medium"
            class="transparent-btn"
            v-preventReClick
            @click.prevent.stop="openDialog('share')"
          >
            分享
          </el-button>
          <el-button
            type="primary"
            round
            size="medium"
            v-preventReClick
            @click.prevent.stop="showSignUp"
          >
            预览
          </el-button>
        </div>
      </pageTitle>
      <div class="signup-main-center">
        <!-- tab切换 -->
        <div id="signTabsDom" class="signup-tabs-layout">
          <el-tabs v-model="tabType" @tab-click="handleClick" :class="[menuBarFixed]">
            <el-tab-pane label="表单设置" name="form"></el-tab-pane>
            <el-tab-pane label="报名用户" name="user"></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 报名表单 -->
        <sign-set-form
          ref="signSetFormDom"
          :webinarOrSubjectId="webinarOrSubjectId"
          :signUpPageType="signUpPageType"
          :signUpSwtich="signUpSwtich"
          :tabType="tabType"
          @changeTabsFixed="changeTabsFixed"
        ></sign-set-form>
        <user-manage
          ref="userManageDom"
          v-if="tabType === 'user'"
          :signUpPageType="signUpPageType"
          :webinarOrSubjectId="webinarOrSubjectId"
        ></user-manage>
      </div>
    </div>
    <section class="subject-save-btn sureBtn" v-if="signUpPageType === 'subject'">
      <el-button
        :disabled="!signUpSwtich"
        round
        type="primary"
        v-preventReClick
        @click="sureQuestionnaire"
      >
        保存
      </el-button>
    </section>
    <!-- 开播按钮 -->
    <begin-play
      :webinarId="webinarOrSubjectId"
      v-if="$route.query.type != 5 && webinarState != 4 && signUpPageType == 'webinar'"
    ></begin-play>
    <!-- 直播关联专题详情 -->
    <subject-show-dialog
      v-if="signUpPageType === 'webinar'"
      :webinarOrSubjectId="webinarOrSubjectId"
      :signUpPageType="signUpPageType"
      ref="subjectAuth"
    ></subject-show-dialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import { sessionOrLocal, debounce } from '@/utils/utils';
  import beginPlay from '@/components/beginBtn';
  import SignSetForm from './signSetForm';
  import UserManage from './userManage';
  import SubjectShowDialog from './subjectShowDialog.vue';
  export default {
    components: {
      PageTitle,
      beginPlay,
      SignSetForm,
      UserManage,
      SubjectShowDialog
    },
    data() {
      return {
        tabType: 'form', // form-表单；user-用户
        signUpSwtich: false,
        baseInfo: {
          open_link: 0,
          theme_color: 'red',
          tab_verify_title: '我已报名',
          tab_form_title: '活动报名',
          title: '',
          intro: '',
          cover: ''
        },
        userId: '',
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')), // 活动状态
        menuBarFixed: '',
        vm: null,
        resultVo: {},
        signUpPageType:
          window.location.href.indexOf('/live/signup/') != -1 ||
          window.location.href.indexOf('/lives/entryform') != -1
            ? 'webinar'
            : window.location.href.indexOf('/special/viewer/') != -1 ||
              window.location.href.indexOf('/special/entryform') != -1
            ? 'subject'
            : '',
        webinarOrSubjectId:
          window.location.href.indexOf('/live/signup/') != -1
            ? this.$route.params.str
            : window.location.href.indexOf('/special/viewer/') != -1 ||
              window.location.href.indexOf('/lives/entryform') != -1 ||
              window.location.href.indexOf('/special/entryform') != -1
            ? this.$route.params.id || this.$route.params.str
            : ''
      };
    },
    async created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      await this.getBaseInfo();
    },
    mounted() {
      this.$refs.signSetFormDom && this.$refs.signSetFormDom.initComp();
      if (this.$route.query.tab == 2) {
        this.tabType = 'user';
        // 暂不需要 this.$refs.userManageDom && this.$refs.userManageDom.initComp()
      } else {
        this.tabType = 'form';
      }
    },
    methods: {
      // 设置接口入参，是活动维度 还是 专题维度
      setParamsIdByRoute(params) {
        if (this.signUpPageType === 'webinar') {
          params.webinar_id = this.$route.params.str;
        } else if (
          this.signUpPageType === 'subject' &&
          window.location.href.indexOf('/special/viewer/') == -1
        ) {
          params.subject_id = this.$route.params.str;
        } else if (
          this.signUpPageType === 'subject' &&
          window.location.href.indexOf('/special/viewer/') != -1
        ) {
          params.subject_id = this.$route.params.id;
        }
        return params;
      },
      // 切换tab
      handleClick(tab, event) {
        if (this.signUpPageType === 'webinar') {
          // 如果是活动，左右切换
          let tabCount = this.tabType === 'form' ? 1 : this.tabType === 'user' ? 2 : 0;
          this.$router.push({
            path: `/live/signup/${this.$route.params.str}`,
            query: {
              ...this.$route.query,
              tab: tabCount
            }
          });
        }
      },
      // 切换tab的时候是否定位
      changeTabsFixed(menuBarFixed) {
        this.menuBarFixed = menuBarFixed;
      },
      // 获取表单基本信息
      getBaseInfo() {
        this.$fetch('regFromGet', this.setParamsIdByRoute({}))
          .then(res => {
            if (res.code === 200) {
              this.baseInfo = res.data;
              if (this.signUpPageType === 'subject') {
                // 专题下是否开启，只要引用了报名表单，默认就是开启的
                this.signUpSwtich = true;
              } else {
                this.signUpSwtich = res.data.enable_status == '0' ? false : true;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      //确定防抖
      handleChangeSwitchRegForm(value) {
        const oldValue = value;
        this.signUpSwtich = !value;
        debounce(async () => {
          await this.switchRegForm(oldValue);
        }, 500);
      },
      // 开启\关闭报名表单开关
      async switchRegForm(value) {
        const url = value ? 'regFromEnable' : 'regFromDisable';
        const behaviour = value ? '开启' : '关闭';
        this.$fetch(url, this.setParamsIdByRoute({}))
          .then(res => {
            if (res.code === 200) {
              if (this.signUpPageType === 'webinar') {
                this.signUpSwtich = value;
                this.$vhall_paas_port({
                  k: value ? 100137 : 100138,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: this.webinarOrSubjectId,
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
              }
              this.messageInfo(`报名表单${behaviour}成功`, 'success');
              // 更新表单组件里的字段展示
              this.$nextTick(() => {
                this.$refs.signSetFormDom &&
                  this.$refs.signSetFormDom.setSwitchStatus(this.signUpSwtich);
              });
            }
          })
          .catch(err => {
            if (err.code == 512800) {
              this.signUpSwtich = !value;
              this.messageInfo('报名表单不能与白名单同时开启', 'error');
            } else {
              this.messageInfo(`报名表单${behaviour}失败`, 'error');
            }
          });
      },
      // 预览
      showSignUp() {
        this.$nextTick(() => {
          this.$refs.signSetFormDom && this.$refs.signSetFormDom.showSignUp();
        });
      },
      // 设置-打开 dialog 方法（通用）
      openDialog(ref) {
        this.$nextTick(() => {
          this.$refs.signSetFormDom && this.$refs.signSetFormDom.openDialog(ref);
        });
      },
      // 打开报名表单详情弹窗说明
      showDetailDialog() {
        this.$refs.subjectAuth.visible = true;
      },
      // 保存
      sureQuestionnaire() {
        if (this.signUpPageType === 'subject') {
          // 专题下，点击保存，后续专属于活动的上报等不触发
          this.saveSubjectViews();
        }
      },
      // 保存观看限制，专题关系
      async saveSubjectViews() {
        // const verifyInfo = await this.$fetch('subjectVerifyInfo', {
        //   subject_id: this.webinarOrSubjectId
        // }).catch(res => {
        //   this.$message({
        //     message:  res.msg || '获取专题观看限制失败',
        //     showClose: true,
        //     // duration: 0,
        //     type: res.code == 512999 ? 'warning' : 'error',
        //     customClass: 'zdy-info-box'
        //   });
        // })
        // if (verifyInfo && verifyInfo.code == 200 && verifyInfo.data) {
        this.$fetch('createSubjectVerify', {
          subject_id: this.webinarOrSubjectId,
          subject_verify: 2 // 0无限制 1观看限制 2报名表单 只给控制台使用
        })
          .then(res => {
            this.$message({
              message: `设置成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // 专题上报
            this.$vhall_paas_port({
              k: '100864',
              data: {
                business_uid: sessionOrLocal.get('userId'),
                user_id: '',
                webinar_id: '',
                subject_id: this.webinarOrSubjectId,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '设置失败',
              showClose: true,
              // duration: 0,
              type: res.code == 512999 ? 'warning' : 'error',
              customClass: 'zdy-info-box'
            });
          });
        // }
      }
    }
  };
</script>

<style lang="less" scoped>
  .signup-main {
    /deep/.el-tabs__item {
      height: 48px;
      line-height: 48px;
    }
    /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 22px;
      padding-right: 2px;
    }
    /deep/ .el-switch__core {
      height: 16px;
      width: 28px !important;
      &:after {
        width: 12px;
        height: 12px;
      }
    }
    /deep/ .el-switch.is-checked .el-switch__core::after {
      margin-left: -13px;
    }
    .isTabFixedBottom {
      position: fixed !important;
      z-index: 1000;
      top: 60px;
      background: #ffffff;
      width: 100%;
    }
    &.subject-signup {
      .titleBox {
        padding-top: 16px;
        margin-bottom: 24px;
        line-height: 36px;
        .fieldSetBox {
          margin-left: 0;
        }
        /deep/.pageTitle {
          line-height: 36px;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
        }
      }
      /deep/.viewItem {
        margin-bottom: 0;
        padding: 24px 24px;
        .label {
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 22px;
          margin-bottom: 16px;
        }
        .bottomBtn {
          margin-top: 8px;
        }
      }
      .signup-tabs-layout {
        background: #f7f7f7;
        border-radius: 4px 4px 0 0;
        .isFixed {
          background: #f7f7f7;
        }
      }
      /deep/.el-tabs__item.is-active {
        font-weight: 500;
      }
      /deep/.settingBox {
        .rightView {
          background: #ffffff;
          padding-top: 0;
          .fieldSetBox {
            margin-left: 0;
          }
        }
      }
    }
  }
  .signup-main-center {
    min-height: 612px;
    background: #ffffff;
    .signup-tabs-layout {
      .isFixed {
        width: 100%;
        background: #ffffff;
        position: fixed !important;
        top: 60px;
        z-index: 1000;
      }
      .isFixedBottom {
        width: 100%;
        background: #ffffff;
        position: fixed !important;
        z-index: 1000;
        top: 60px;
        section {
          &.block {
            display: none;
          }
        }
      }
    }
  }
  /deep/ .el-switch__label--right,
  /deep/ .el-switch__label--left {
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .swtich {
    vertical-align: sub;
  }
  .switchBox {
    display: inline-flex;
    height: 100%;
    .sign-switch-desc {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #666666;
      display: inline-block;
      margin: 0 0;
      padding: 0 0;
      height: 20px;
      vertical-align: middle;
      margin-left: 4px;
      a {
        color: #3562fa;
      }
    }
  }
  .headBtnGroup {
    float: right;
    /* /deep/.el-button {
      background: transparent;
      &:hover {
        background: #FB3A32;
        border: 1px solid #FB3A32;
      }
      &:active {
        background: #E2332C;
        border: 1px solid #E2332C;
      }
      &.is-disabled {
        border: 1px solid #E6E6E6;
        background: transparent;
        color: #B3B3B3;
        &:hover,&:active {
          background: transparent;
        }
      }
    } */
  }
  .titleBox {
    display: block !important;
    line-height: 40px;
    margin-bottom: 22px;
    /deep/.pageTitle {
      line-height: 40px;
    }
  }
  .settingBox {
    position: relative;
    .isFixed {
      position: fixed !important;
      top: 70px;
      z-index: 999;
    }
    .isFixedBottom {
      position: fixed !important;
      z-index: 999;
      top: 70px;
      section {
        &.block {
          display: none;
        }
      }
    }
    .options {
      width: 170px;
      float: left;
      position: relative;
      .block {
        font-size: 16px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      .block-bto {
        margin-top: 10px;
      }
      .item {
        font-size: 14px;
        color: #1a1a1a;
        width: fit-content;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          color: #fb3a32 !important;
          i {
            color: #fb3a32 !important;
          }
        }
        &.active {
          color: #b3b3b3;
          pointer-events: none;
          i {
            color: #b3b3b3;
          }
        }
        i {
          margin-right: 4px;
          color: #1a1a1a;
        }
        .icon {
          width: 14px;
          height: 14px;
          font-size: 14px;
          display: inline-block;
          margin-right: 8px;
        }
      }
    }
    .rightView {
      display: flex;
      justify-content: center;
      width: calc(100% - 170px);
      float: right;
      position: relative;
    }
    .disable_wrap {
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
    }
    .options .disable_wrap {
      background: #f7f7f7;
      opacity: 0.5;
    }
  }
  .subject-save-btn {
    margin-top: 32px;
  }
</style>
