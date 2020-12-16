<template>
  <div class="keyLogin">
    <p class="keyIcon">请输入参会口令</p>
    <p v-if="!ishost" class="inputItem">
      <input type="text" placeholder="姓名" maxlength="30" v-model="name">
    </p>
    <p class="inputItem">
      <input type="text" placeholder="口令 (6位数字)" maxlength="10" v-model="keyCode">
    </p>
    <em class="errorTips">{{ warnningVal }}</em>
    <div class="enterBtn" @click="entryLive">进入直播</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ishost: this.$route.path.startsWith('/keylogin-host'),
        name: '',
        keyCode: '',
        warnningVal: '',
        roleName: this.$route.params.role_name
      }
    },
    methods: {
      entryLive() {
        console.log(this.$route.params)
        if (!this.name && !this.ishost) {
          this.warnningVal = '参会昵称不能为空'
        } else if (!this.keyCode) {
          this.warnningVal = '直播口令不能为空'
        } else {
          this.$emit('codeAuthLogin', {
            role: this.roleName,
            name: this.name,
            keyCode: this.keyCode
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .keyLogin {
    width: 100%;
    height: 100%;
    background: url(./image/login_left_bg.png);
    position: relative;
    padding: 189px 16px 39px;
    .keyIcon {
      position: absolute;
      top: 90px;
      left: 0;
      width: 100%;
      text-align: center;
      padding-top: 53px;
      line-height: 36px;
      background: url(./image/password-login-icon.png) no-repeat top center/53px 53px;
      font-size: 14px;
      color: #333333;
    }
    .inputItem {
      margin: 0 auto;
      text-align: center;
      margin-bottom: 12px;
      input {
        outline: 0 none !important;
        padding: 0 10px;
        font-size: 12px;
        width: 238px;
        height: 40px;
        border-radius: 2px;
        border-color: #d2d2d2;
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        &:hover {
          border-color: #999;
        }
      }
    }
    .errorTips {
      color: #fc5659;
      font-size: 12px;
      position: absolute;
      font-style: normal;
      padding: 0 20px;
      left: 30px;
      background: url(./image/exclamation.png) no-repeat 4px 1px;
    }
    .enterBtn {
      width: 250px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 2px;
      background-color: #fc5659;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      margin: 60px auto 0px;
      &:hover {
        background: #ff3333;
      }
    }
  }
</style>
