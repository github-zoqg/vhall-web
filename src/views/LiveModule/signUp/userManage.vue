<template>
  <div class="user-manage">
    <user-registration
      :webinarOrSubjectId="webinarOrSubjectId"
      :signUpPageType="signUpPageType"
    ></user-registration>
  </div>
</template>

<script>
  import UserRegistration from '../../PlatformModule/UserRegistration/index';
  export default {
    components: {
      UserRegistration
    },
    props: {
      // 活动ID 或者 专题ID，跟signUpPageType字段组合使用
      webinarOrSubjectId: {
        type: [Number, String],
        default: 0
      },
      // 报名表单类型：webinar--活动；subject--专题
      signUpPageType: {
        type: [Number, String],
        default: ''
      }
    },
    data() {
      return {};
    },
    created() {},
    methods: {}
  };
</script>

<style lang="less" scoped>
  .user-manage {
    padding: 24px 24px 40px 24px;
  }
</style>
