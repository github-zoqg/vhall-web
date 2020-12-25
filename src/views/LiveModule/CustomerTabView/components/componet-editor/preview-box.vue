<template>
  <div class="vh-preview-box">
    <component
      :is="componentName"
      :info="info"
      :mode="mode || 1"
      @updateInfo="updateInfo"
    ></component>
  </div>
</template>
<script>
import ComponentDesimg from '../componet-editor/component-desimg'
import ComponentQrcode from '../componet-editor/component-qrcode'
import componentMap from '../componetMap'
import EventBus from '../../bus'
import eventsType from '../../EventConts'

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
    ComponentQrcode
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
  },
  methods: {
    updateInfo(val) {
      EventBus.$emit(eventsType.UPDATE_COMPONENT_CONTENT, val)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
