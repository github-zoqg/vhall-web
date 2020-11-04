<template>
  <div>
    <span @click.prevent.stop="toPlan('plan-function')">跳转功能配置入口</span>
  </div>
</template>

<script>
export default {
  name: "detail.vue",
  methods: {
    toPlan(key) {
      this.$router.push({path: `/${key}/${this.$route.params.str}`})
    }
  }
}
</script>

<style scoped>

</style>
