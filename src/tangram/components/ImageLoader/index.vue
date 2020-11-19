<template>
  <div class="wrapper"  v-loading="loading" element-loading-background="#2d2d2d">
    <img :src="thumbnail" @load="loading = false"/>
  </div>
</template>
<script>
export default {
  props: {
    thumbnail: {
      required: true
    }
  },
  data () {
    return {
      loading: true
    };
  }
};
</script>
<style lang="less" scoped>
 .wrapper{
   width: 100%;
   height: 100%;
   img{
    height: 100%;
    width: 100%;
  }
 }
</style>
