<template>
  <div class="vh-preview-box">
    <component
      :is="componentName"
      :info="info"
      :mode="mode || 1"
    ></component>
  </div>
</template>
<script>
import ComponentDesimg from './component-desimg'
import ComponentQrcode from './component-qrcode'
import ComponentLives from './component-lives'
import ComponentTextlink from './component-textlink'
import ComponentImglink from './component-imglink'
import ComponentTitle from './component-title'
import ComponentLine from './component-line'
import componentMap from './componetMap'

export default {
  props: {
    info:{
      required: true
    },
    mode: {
      required: false
    }
  },

  components: {
    ComponentDesimg,
    ComponentQrcode,
    ComponentLives,
    ComponentTextlink,
    ComponentImglink,
    ComponentTitle,
    ComponentLine
  },

  mounted() {
    console.log( "当前组件信息！", this.info)
  },

  data() {
    return {}
  },

  computed: {
    componentName: function() {
      return `component-${componentMap[this.info.component_id]}`
    }
  }
}
</script>
<style lang="less" scoped>

</style>
