<template>
  <div class="wrap-head">
    <div class="fl logo">
      <span>微吼直播</span>
      <i class="el-icon-eleme"></i>
    </div>
    <div class="fr avat">
      <template>
        <div class="avat-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>
      <template>
        <div class="avat-right fr">
          <i class="el-icon-eleme"></i>
          <i class="el-icon-eleme"></i>
          <img class="avater" src="./../../common/images/v35-webinar.png" alt="">
          <p class="name">微吼直播</p>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="less" scoped>
.wrap-head{
  height: 64px;
  line-height: 64px;
  padding: 0!important;
  height: 64px;
  .logo{
    width: 224px;
    background: #FB3A32;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: @fff;
    text-align: center;
    span{
      display: inline-block;
      padding-right: 62px;
    }
  }
  .avat{
    height: 100%;
    line-height: 64px;
    width: calc(100% - 224px);
    padding-left: 24px;
    .avat-left{
      width: calc(100% - 300px);
      float: left;
      .el-breadcrumb{
        line-height: 64px;
        .el-breadcrumb__inner{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .avat-right{
      .avater{
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        margin-left: 24px;
      }
      p{
        display: inline-block;
      }
      .name{
        padding: 0 32px 0 8px;
      }
      i{
        font-size: 16px;
        padding: 0 9px;
      }
    }
  }
}
</style>
