<template>
  <div class="user-manage">
    <user-registration :webinar_id="webinar_id"></user-registration>
  </div>
</template>

<script>
import UserRegistration from '../../PlatformModule/UserRegistration/index';
export default {
  components: {
    UserRegistration
  },
  props: {
    // 活动ID
    webinar_id: {
      type: [Number, String],
      default: 0
    },
    // 专题ID
    subject_id: {
      type: [Number, String],
      default: 0
    }
  },
  data(){
    return {}
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
.user-manage {
  padding: 24px 24px;
}
</style>
