<template>
  <div class="exam-main">
    <div class="head">
      <pageTitle pageTitle="快问快答"></pageTitle>
      <div class="exam-main-center">
        <!-- tab切换 -->
        <div id="examTabsDom" class="exam-tabs-layout">
          <el-tabs v-model="tabType" @tab-click="handleClick">
            <el-tab-pane label="列表" name="table"></el-tab-pane>
            <el-tab-pane label="用户信息" name="user"></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 快问快答 内容区域 -->
        <exam-table-panel ref="examTable" v-if="tabType == 'table'"></exam-table-panel>
        <exam-user-info ref="examUserInfo" v-else></exam-user-info>
      </div>
    </div>
    <!-- 开播按钮 -->
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
import beginPlay from '@/components/beginBtn';
import ExamTablePanel from './components/ExamTablePanel';
import ExamUserInfo from './components/ExamUserInfo';
export default {
  components: {
    PageTitle,
    beginPlay,
    ExamTablePanel,
    ExamUserInfo
  },
  data(){
    return {
      tabType: 'table', // form-表单；user-用户
      userId: '',
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      vm: null
    };
  },
  async created(){
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
  },
  mounted() {
    if (this.$route.query.tab == 2) {
      this.tabType = 'user'
      this.$refs.examUserInfo && this.$refs.examUserInfo.initComp()
    } else {
      this.tabType = 'table'
      this.$refs.examTable && this.$refs.examTable.initComp()
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      // 如果是活动，左右切换
      let tabCount = this.tabType === 'table' ? 1 : this.tabType === 'user' ? 2 : 0;
      this.$router.push({path: `/live/exam/${this.$route.params.str}`, query: {
        ...this.$route.query,
        tab: tabCount
      }})
    },
    //文案提示问题
    messageInfo(title, type) {
      if (this.vm) {
        this.vm.close()
      }
      this.vm = this.$message({
        showClose: true,
        duration: 2000,
        message: title,
        type: type,
        customClass: 'zdy-info-box'
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .exam-main {
    /deep/.el-tabs__item {
      height: 48px;
      line-height: 48px;
    }
    /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 22px;
      padding-right: 2px;
    }
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
  .exam-main-center {
    min-height: 612px;
    background: #ffffff;
    .exam-tabs-layout {
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
  .titleBox{
    display: block!important;
    line-height: 40px;
    margin-bottom: 22px;
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
  .subject-save-btn {
    margin-top: 32px;
  }
</style>
