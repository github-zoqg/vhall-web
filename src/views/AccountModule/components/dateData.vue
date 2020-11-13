<template>
  <div class="date--date">
    <line-echarts></line-echarts>
  </div>
</template>

<script>
import LineEcharts from '@/components/Echarts/lineEcharts.vue';
export default {
  name: "dateData.vue",
  components: {
    LineEcharts
  },
  methods: {
    initComp() {}
  }
};
</script>

<style lang="less" scoped>
.date--date {
  .padding41-40();
}
</style>
