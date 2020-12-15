<template>
  <div>
  </div>
</template>

<script>
import Env from "@/api/env";

export default {
  name: "UnitMenuDoc.vue",
  components: {
  },
  data() {
    return {
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/interacts/document/upload-webinar-document`,
      docTxt: '暂无默认文档'
    };
  },
  methods: {
  },
  watch: {
  }
};
</script>

<style lang="less" scoped>
</style>
