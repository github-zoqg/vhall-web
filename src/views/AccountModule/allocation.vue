<template>
  <div>
    <pageTitle title="可用资源"></pageTitle>

  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  export default {
    name: 'allocation.vue',
    components: {
      PageTitle,
    },
    data() {
      return {
        tabType: null
      };
    },
    methods: {
      handleClick(tab, event) {
      }
    },
    mounted() {
    }
  };
</script>

<style lang="less" scoped>
</style>
