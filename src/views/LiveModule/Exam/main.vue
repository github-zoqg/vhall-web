<template>
  <div class="exam-main">
    <div class="head">
      <pageTitle pageTitle="快问快答"></pageTitle>
      <!-- <div class="exam-main-center"> -->
      <!-- tab切换 -->
      <!-- <div class="exam-tabs-layout"> -->
      <exam-table-panel ref="examTable"></exam-table-panel>
      <!-- <el-tabs v-model="tabType">
            <el-tab-pane label="问答列表" name="table">
            </el-tab-pane>
            <el-tab-pane label="" name=""></el-tab-pane>
          </el-tabs> -->
    </div>
    <!-- <exam-user-info v-else ref="examUserInfo"></exam-user-info> -->
    <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import ExamTablePanel from './components/ExamTablePanel';
  // import ExamUserInfo from './components/ExamUserInfo';
  export default {
    components: {
      PageTitle,
      ExamTablePanel
      // ExamUserInfo
    },
    data() {
      return {
        // tabType: 'table' // form-表单；user-用户
      };
    }
  };
</script>

<style lang="less">
  .exam-main {
    #tab-1 {
      display: none;
    }
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
  }
  .exam-main-center {
    min-height: 612px;
    background: #ffffff;
    .exam-tabs-layout {
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
