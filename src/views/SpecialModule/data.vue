<template>
  <div class="subject_data">
    <user-registration :webinarOrSubjectId="webinarOrSubjectId" :signUpPageType="signUpPageType"></user-registration>
  </div>
</template>
<script>
import UserRegistration from '../PlatformModule/UserRegistration/index';
export default {
  components: {
    UserRegistration
  },
  data(){
    return {
      webinarOrSubjectId: this.$route.params.id, // 路径是 /data/xxx
      signUpPageType: 'subject'
    }
  },
  created(){
    this.initComp()
  },
  methods: {
    initComp() {}
  }
};
</script>

<style lang="less" scoped>
.subject_data {
  width: 100%;
  height: auto;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 24px 24px 40px 24px;
  overflow: hidden;
  min-height: 676px;
}
</style>
