<template>
  <div class="signup-main">
    <div class="head">
      <pageTitle :pageTitle="signUpPageType === 'webinar' ? '报名表单' : ''">
        <div class="switchBox" v-if="signUpPageType === 'webinar'">
          <el-switch
            class="swtich"
            v-model="signUpSwtich"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="switchRegForm"
            active-text="">
          </el-switch>
          <span class="sign-switch-desc">
            {{ signUpSwtich ? '已开启' : '开启后'}}，如直播关联专题，届时会以专题鉴权为准，请点<a href="javascript:void(0)" @click="showDetailDialog">查看详情</a>确认此表单是否生效。
          </span>
        </div>
        <div class="headBtnGroup">
          <el-button round size="medium" class="transparent-btn" @click="openDialog('theme')">设置</el-button>
          <el-button round size="medium"  class="transparent-btn" @click="openDialog('share')">分享</el-button>
          <el-button type="primary" round size="medium" @click="showSignUp">预览</el-button>
        </div>
      </pageTitle>
      <div class="signup-main-center">
        <!-- tab切换 -->
        <div id="signTabsDom" class="signup-tabs-layout">
          <el-tabs v-model="tabType" @tab-click="handleClick" :class="[menuBarFixed]">
            <el-tab-pane label="表单设置" name="form"></el-tab-pane>
            <el-tab-pane label="用户报名" name="user"></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 报名表单 -->
        <sign-set-form ref="signSetFormDom" v-show="tabType ==='form'"
          :webinarOrSubjectId="webinarOrSubjectId"
          :signUpPageType="signUpPageType"
          :signUpSwtich="signUpSwtich"
          @changeTabsFixed="changeTabsFixed"></sign-set-form>
        <user-manage ref="userManageDom" v-if="tabType === 'user'"
          :signUpPageType="signUpPageType"
          :webinarOrSubjectId="webinarOrSubjectId"></user-manage>
      </div>
    </div>
    <begin-play  :webinarId="webinarOrSubjectId" v-if="$route.query.type != 5 && webinarState!=4 && signUpPageType == 'webinar'"></begin-play>
    <!-- 直播关联专题详情 -->
    <subject-show-dialog v-if="subjectShowVisible && signUpPageType === 'webinar'" :webinarOrSubjectId="webinarOrSubjectId" :signUpPageType="signUpPageType" :dialogVisible="subjectShowVisible" @close="closeDetailDialog"></subject-show-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
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
  data(){
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
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")), // 活动状态
      menuBarFixed: '',
      subjectShowVisible: false
    };
  },
  computed: {
    signUpPageType() {
      if (window.location.href.indexOf('/live/signup/') != -1 || window.location.href.indexOf('/lives/entryform') != -1) {
        // 活动
        return 'webinar'
      } else if (window.location.href.indexOf('/subject/viewer/') != -1 || window.location.href.indexOf('/subject/signup/') != -1 || window.location.href.indexOf('/subject/entryform') != -1) {
        // 专题
        return 'subject'
      } else {
        return ''
      }
    },
    webinarOrSubjectId() {
      if (window.location.href.indexOf('/live/signup/') != -1 || window.location.href.indexOf('/subject/signup/') != -1) {
        return this.$route.params.str
      } else if (window.location.href.indexOf('/subject/viewer/') != -1 || window.location.href.indexOf('/lives/entryform') != -1 || window.location.href.indexOf('/subject/entryform') != -1) {
        return this.$route.params.id || this.$route.params.str
      } else {
        return ''
      }
    }
  },
  created(){
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    if (this.signUpPageType === 'subject') {
      // 专题下是否开启，只要引用了报名表单，默认就是开启的
      this.signUpSwtich = true
      // 更新表单组件里的字段展示
      this.$nextTick(() => {
        this.$refs.signSetFormDom && this.$refs.signSetFormDom.setSwitchStatus(this.signUpSwtich)
      })
    }
    this.getBaseInfo()
  },
  mounted() {
    if (this.$route.query.tab == 2) {
      this.tabType = 'user'
      this.$refs.userManageDom && this.$refs.userManageDom.initComp()
    } else {
      this.tabType = 'form'
      this.$refs.signSetFormDom && this.$refs.signSetFormDom.initComp()
    }
  },
  beforeDestroy() {
  },
  methods: {
    // 设置接口入参，是活动维度 还是 专题维度
    setParamsIdByRoute(params) {
      if (this.signUpPageType === 'webinar') {
        params.webinar_id = this.$route.params.str
      } else if (this.signUpPageType === 'subject' && window.location.href.indexOf('/subject/viewer/') == -1) {
        params.subject_id = this.$route.params.str
      } else if (this.signUpPageType === 'subject' && window.location.href.indexOf('/subject/viewer/') != -1) {
        params.subject_id = this.$route.params.id
      }
      return params
    },
    // 切换tab
    handleClick(tab, event) {
      if (this.signUpPageType === 'webinar') {
        // 如果是活动，左右切换
        let tabCount = this.tabType === 'form' ? 1 : this.tabType === 'user' ? 2 : 0;
        this.$router.push({path: `/live/signup/${this.$route.params.str}`, query: {
          ...this.$route.query,
          tab: tabCount
        }})
      }
    },
    // 切换tab的时候是否定位
    changeTabsFixed(menuBarFixed) {
      this.menuBarFixed = menuBarFixed;
    },
    // 获取表单基本信息
    getBaseInfo() {
      this.$fetch('regFromGet', this.setParamsIdByRoute({})).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data;
          if (this.signUpPageType === 'webinar') {
            // 活动下是否开启，通过接口拿取
            this.signUpSwtich = res.data.enable_status == '0' ? false : true;
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 开启\关闭报名表单开关
    switchRegForm(value) {
      const url = value ? 'regFromEnable' : 'regFromDisable';
      const behaviour = value ? '开启' : '关闭';
      this.$fetch(url, this.setParamsIdByRoute({})).then(res => {
        if (res.code === 200) {
          if (this.signUpPageType === 'webinar') {
            this.$vhall_paas_port({
              k: value ? 100137 : 100138,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
          }
          this.$message({
            message:  `报名表单${ behaviour }成功`,
            showClose: true, // 是否展示关闭按钮
            type: 'success', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
          // 更新表单组件里的字段展示
          this.$nextTick(() => {
            this.$refs.signSetFormDom && this.$refs.signSetFormDom.setSwitchStatus(this.signUpSwtich)
          })
        }
      }).catch(err => {
        if (err.code == 512800) {
          this.$message({
            message:  '报名表单不能与白名单同时开启',
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else {
          this.$message({
            message:  `报名表单${ behaviour }失败`,
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        }
      });
    },
    // 预览
    showSignUp() {
      this.$nextTick(() => {
        this.$refs.signSetFormDom && this.$refs.signSetFormDom.showSignUp()
      })
    },
    // 设置-打开 dialog 方法（通用）
    openDialog(ref){
      this.$nextTick(() => {
        this.$refs.signSetFormDom && this.$refs.signSetFormDom.openDialog(ref)
      })
    },
    // 打开报名表单详情弹窗说明
    showDetailDialog() {
      this.subjectShowVisible = true
    },
    closeDetailDialog() {
      this.subjectShowVisible = false
    }
  }
};
</script>

<style lang="less" scoped>
  .signup-main {
    /deep/ .el-switch__core{
      height: 16px;
      width: 28px!important;
      &:after {
        width: 12px;
        height: 12px;
      }
    }
    /deep/ .el-switch.is-checked .el-switch__core::after {
      margin-left: -13px;
    }
    .isTabFixedBottom {
      position: fixed!important;
      z-index: 1000;
      top: 60px;
      background: #ffffff;
      width: 100%;
    }
  }
  .signup-main-center {
    min-height: 612px;
    background: #ffffff;
    .signup-tabs-layout {
      .isFixed {
        width: 100%;
        background: #ffffff;
        position:fixed!important;
        top:60px;
        z-index: 1000;
      }
      .isFixedBottom {
        width: 100%;
        background: #ffffff;
        position:fixed!important;
        z-index: 1000;
        top:60px;
        section{
          &.block{
            display: none;
          }
        }
      }
    }
  }
  /deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .swtich{
    margin-left: 12px;
    vertical-align: sub;
  }
  .switchBox{
    display: inline-flex;
    height: 100%;
    .sign-switch-desc {
      color: #999999;
      display: inline-block;
      line-height: 20px;
      margin: 0 0;
      padding: 0 0;
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      vertical-align: middle;
      margin-left: 10px;
      a {
        color: #3562FA;
      }
    }
  }
  .headBtnGroup{
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
  .titleBox{
    display: block!important;
    line-height: 40px;
    /deep/.pageTitle {
      line-height: 40px;
    }
  }
  .settingBox{
    position: relative;
    .isFixed {
      position:fixed!important;
      top:70px;
      z-index:999;
    }
    .isFixedBottom {
      position:fixed!important;
      z-index:999;
      top:70px;
      section{
        &.block{
          display: none;
        }
      }
    }
    .options{
      width: 170px;
      float: left;
      position: relative;
      .block{
        font-size: 16px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      .block-bto{
        margin-top: 10px;
      }
      .item{
        font-size: 14px;
        color: #1A1A1A;
        width: fit-content;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          color: #FB3A32!important;
          i{
            color: #FB3A32!important;
          }
        }
        &.active{
          color: #B3B3B3;
          pointer-events: none;
          i{
            color: #B3B3B3;
          }
        }
        i{
          margin-right: 4px;
          color: #1A1A1A;
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
    .rightView{
      display: flex;
      justify-content: center;
      width: calc(100% - 170px);
      float: right;
      position: relative;
    }
    .disable_wrap{
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5)
    }
    .options .disable_wrap{
      background: #F7F7F7;
      opacity: 0.5;
    }
  }

</style>
