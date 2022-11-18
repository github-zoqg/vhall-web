<template>
  <div :class="`privacy-select scene_${scene}`">
    <el-checkbox
      v-model.trim="isCheck"
      v-if="compType == 1"
      @change="emitCheckboxVal"
    ></el-checkbox>
    <div>
      {{ compType == 1 ? '阅读并同意' : '提交即同意' }}
      <a :href="privacyUrl" target="_blank" rel="noopener noreferrer">《隐私政策》</a>
      及
      <a :href="privacyUPoUrl" target="_blank" rel="noopener noreferrer">《用户服务协议》</a>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isCheck: false,
        privacyUrl: `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/privacyPolicy`,
        privacyUPoUrl: `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/privacyUPo`
      };
    },
    props: {
      scene: {
        type: String,
        default: 'default'
      },
      compType: {
        type: [Number, String],
        default: 1 // 1-有勾选；2-无勾选（提交及统一）
      }
    },
    methods: {
      emitCheckboxVal(val) {
        if (this.compType == 1) {
          this.$emit('check', {
            checked: val,
            scene: this.scene
          });
        }
      },
      // 重置选中状态
      resetChecked() {
        this.isCheck = false;
      }
    }
  };
</script>
<style lang="less" scoped>
  .privacy-select {
    text-align: left;
    /* 登录：展开其它登录方式 */
    &.scene_login,
    &.scene_loginDynamic {
      margin-top: 24px;
    }
    /* 登录：未展开其它登录方式 */
    &.scene_login_normal {
      margin-top: 4px;
    }
    /* 注册 */
    &.scene_register {
      margin-top: 24px;
    }
    /* 问卷 */
    &.scene_question {
      margin: 12px auto 60px auto;
      text-align: center;
      span,
      a {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #8c8c8c;
        word-break: break-word;
      }
      a {
        text-decoration: none;
        font-weight: 400;
        color: #3562fa;
        transform: matrix(0.99, 0, -0.14, 1, 0, 0);
        &:hover {
          color: #3562fa;
        }
      }
    }
    /* 报名表单 */
    &.scene_signForm {
      margin-top: 12px;
      display: block;
      text-align: center;
      align-items: unset;
      justify-content: unset;
      span,
      a {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #8c8c8c;
        word-break: break-word;
      }
      a {
        text-decoration: none;
        font-weight: 400;
        color: #3562fa;
        transform: matrix(0.99, 0, -0.14, 1, 0, 0);
        &:hover {
          color: #3562fa;
        }
      }
    }
    div {
      display: inline-block;
      vertical-align: middle;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      height: 17px;
      color: #8c8c8c;
      margin-left: 8px;
    }
    a {
      color: #3562fa;
      text-decoration: none;
      &:hover {
        color: #3562fa;
      }
    }
  }
</style>
