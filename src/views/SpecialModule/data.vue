<template>
  <div class="subject_data">
    <pageTitle pageTitle="导出数据"></pageTitle>
    <div class="subject_data__panel">
      <user-registration :webinarOrSubjectId="webinarOrSubjectId" :signUpPageType="signUpPageType"></user-registration>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import UserRegistration from '../PlatformModule/UserRegistration/index';
export default {
  components: {
    PageTitle,
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
