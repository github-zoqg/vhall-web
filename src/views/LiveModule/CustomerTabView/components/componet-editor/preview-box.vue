<template>
  <div class="vh-preview-box">
    <component
      :is="componentName"
      :info="info"
      :mode="mode || 1"
      @updateInfo="updateInfo"
      :pre="pre"
    ></component>
  </div>
</template>
<script>
import ComponentDesimg from './component-desimg'
import ComponentQrcode from './component-qrcode'
import ComponentLives from './component-lives'
import ComponentTextlink from './component-textlink'
import ComponentImglink from './component-imglink'
import ComponentProjects from './component-projects'
import ComponentTitle from './component-title'
import ComponentLine from './component-line'
import ComponentRank from './component-rank'
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
    },
    pre: {
      required: true
    }
  },

  components: {
    ComponentDesimg,
    ComponentQrcode,
    ComponentLives,
    ComponentProjects,
    ComponentTextlink,
    ComponentImglink,
    ComponentTitle,
    ComponentLine,
    'component-rank' : ComponentRank
  },

  mounted() {
    console.log( "当前组件信息！", this.info)
  },

  data() {
    return {}
  },

  computed: {
    componentName: function() {
      console.log('component-name:: =>', componentMap[this.info.component_id])
      return `component-${componentMap[this.info.component_id]}`
    }
  },
  methods: {
    updateInfo(val) {
      this.$EventBus.$emit(eventsType.UPDATE_COMPONENT_CONTENT, val)
    }
  }
}
</script>
<style lang="less" scoped>
.vh-preview-box{
  user-select: none;
  color: #1a1a1a;
  line-height: 24px;
}
</style>
