<template>
  <div class="chat-preview">
    <img :src="default_url">
  </div>
</template>
<script>
import Env from '@/api/env';
export default {
  name: 'component-doc',
  data() {
    return {
      default_url: `${Env.staticImgs.doc[0]}`
    }
  }
}
</script>
<style lang="less" scoped>
  .chat-preview {
    width: 286px;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
</style>
