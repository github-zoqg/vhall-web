<template>
  <div class="wrap-head">
    <div class="fl logo">
      <div class="logo--center">
        <img src="../../common/images/logo.png" />
      </div>
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
          <el-badge :value="isDownload" :max="99" class="item" :hidden="!isDownload>0">
            <i class="el-icon-message-solid" @click.prevent.stop="toDownloadPage"></i>
          </el-badge>
          <el-badge :value="unread_num" :max="99" class="item" :hidden="!unread_num>0">
            <i class="el-icon-message-solid" @click.prevent.stop="toMsgPage"></i>
          </el-badge>
          <img class="avater" src="./../../common/images/v35-webinar.png" alt="">
          <p class="name">微吼直播</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // isCollapse: false
      unread_num: 0,
      isDownload: true
    };
  },
  methods: {
    // changeCollapse() {
    //    this.isCollapse = !this.isCollapse;
    //    this.$emit('changeIsCollapse', this.isCollapse);
    // }
    toMsgPage() {
      this.$router.push({path: '/msg-list'});
    },
    toDownloadPage() {
      this.$router.push({path: '/download-list'});
    },
    getUnreadNum() {
      this.$fetch('getUnreadNum', {}).then(res =>{
        this.unread_num = res && res.code === 200 && res.data ? res.data.unread_num : 0;
      }).catch(e=>{
        console.log(e);
        this.unread_num = 0;
      });
    }
  },
  created() {
    this.getUnreadNum();
  }
};
</script>
<style lang="less" scoped>
.wrap-head{
  height: 64px;
  padding: 0!important;
  height: 64px;
  background: #fff;
  .logo{
    width: 224px;
    height: 64px;
    background: #FB3A32;
  }
  .logo--center {
    width: 224px;
    height: 54px;
    margin: 5px auto;
    text-align: center;
    img {
      height: 100%;
      width: auto;
    }
  }
  .avat{
    height: 100%;
    width: calc(100% - 224px);
    padding-left: 24px;
    .flex-display();
    .justify(space-between);
    .align(center);
    .avat-left{
      width: calc(100% - 300px);
      .el-breadcrumb{
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
