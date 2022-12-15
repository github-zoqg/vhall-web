<template>
  <div class="exam-wrap">
    <pageTitle pageTitle="快问快答"></pageTitle>
    <div>
      <exam-list scene="material"></exam-list>
    </div>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import ExamList from '../../PlatformModule/ExamList/index.vue';
  export default {
    name: 'exam',
    data() {
      return {};
    },
    components: {
      PageTitle,
      ExamList
    }
  };
</script>
<style lang="less" scoped>
  .exam-list {
    width: 100%;
    height: 100%;
    .layout--right--main();
    .padding-table-list();
    .min-height();
    /deep/.el-button .el-button--default .el-button--small .el-button--primary {
      margin-right: 20px;
    }
  }

  .exam-wrap {
    height: 100%;
    width: 100%;
    // /deep/.el-card__body{
    //   width: 100%;
    //   padding: 32px 24px;
    // }
    .head-operate {
      margin-bottom: 20px;
      .head-btn {
        display: inline-block;
      }
      /* .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
    } */
      .search-tag {
        float: right;
        width: 220px;
        /deep/ .el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          line-height: 36px;
          padding-right: 30px !important;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
        }
      }
    }
    .show-exam {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      .show-main {
        // position: absolute;
        // top: 48%;
        // left: 50%;
        // background: #fff;
        // transform: translate(-50%, -50%);
        // width: 760px;
        // padding-bottom: 24px;
        // // padding: 0 32px 24px 32px;
        // border-radius: 4px;
        // overflow-y: auto;
        height: 90%;
        border-radius: 4px;
        background: #fff;
        position: relative;
        z-index: 101;
        .exam_main {
          // max-height: 550px;
          position: relative;
          width: 760px;
          padding-bottom: 24px;
        }
        .close-btn {
          z-index: 100;
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          padding: 5px;
        }
        i {
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .submit-footer {
          text-align: center;
          padding-top: 20px;
        }
      }
    }
  }
</style>
