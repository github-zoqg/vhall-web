<template>
  <div class="valid--set">
    <div class="comp-card-one">
      <img src="../../common/images/avatar.jpg" />
      <ul class="ul--son--card">
        <li><label class="card--bold">账号密码</label></li>
        <li><label class="card--txt">当前密码强度：</label><span class="card--status">强</span></li>
      </ul>
      <div class="card--blue">
        <el-button type="text">修改</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <img src="../../common/images/avatar.jpg" />
      <ul class="ul--son--card">
        <li><label class="card--bold">密保手机</label></li>
        <li><label class="card--txt">已绑定手机：135 **** 9870</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text">修改</el-button>
      </div>
    </div>
    <div class="comp-card-one">
      <img src="../../common/images/avatar.jpg" />
      <ul class="ul--son--card">
        <li><label class="card--bold">关联邮箱</label></li>
        <li><label class="card--txt">已绑定邮箱：zhong***wang@vhall.com</label></li>
      </ul>
      <div class="card--blue">
        <el-button type="text">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "validSet.vue",
  methods: {
    initComp() {
    },
    validSetSave() {

    }
  }
};
</script>

<style lang="less" scoped>
  .valid--set {
    .padding41-40();
  }
</style>
