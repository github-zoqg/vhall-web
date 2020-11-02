<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  created() {
      this.$fetch('vssInfo', {platform: '123'}).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  },
}
</script>
<style lang="less">
</style>
