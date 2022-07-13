<template>
  <div class="user-manage">
    <user-registration></user-registration>
  </div>
</template>

<script>
import UserRegistration from '../../PlatformModule/UserRegistration/index';
export default {
  components: {
    UserRegistration
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
