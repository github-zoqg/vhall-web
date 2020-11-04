<template>
  <div>
    当前页面404
    <button @click.prevent.stop="toReturn"> 返回之前页面 </button>
  </div>
</template>

<script>
export default {
  name: "Error.vue",
  beforeCreate() {
  },
  methods: {
    toReturn() {
      this.$router.push(sessionStorage.getItem('errorReturn'))
      sessionStorage.removeItem('errorReturn')
    }
  }
}
</script>

<style scoped>

</style>
