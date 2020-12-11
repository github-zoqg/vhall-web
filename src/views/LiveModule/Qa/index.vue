<template>
  <div class="new-qa">
    <OldHeader class="head-wrap"></OldHeader>
    此为问答页面
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
export default {
  components: {
    OldHeader
  },
  data() {
    return {

    }
  },
}
</script>
<style lang="less" scoped>
.new-qa{
  ::v-deep.head-wrap{
    border: 1px solid blue;
    .collapse{
      height: 100%;
      .login-reg{
        height: 100%;
        .head{
          margin-top: -8px;
          border: none;
          vertical-align: middle;
          display: inline-block;
        }
        .caret{
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
