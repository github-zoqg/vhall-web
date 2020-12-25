<template>
  <div class="editor-wrap">
    <div
      v-for="(item, index) in units"
      :key="index"
    >
      <preview
        mode="2"
        v-if="editorIndex == index"
        :info="item"
      ></preview>
    </div>
  </div>
</template>
<script>
import preview from "./preview-box"
import EventBus from '../../bus'
import eventsType from '../../EventConts'

export default {
  name: 'component-customer',
  props: {
    units: {
      required: true
    },
    uuid: {
      required: true
    }
  },

  components: {
    preview
  },

  data() {
    return {
      editorIndex: 0
    }
  },

  created() {
    EventBus.$on(eventsType.EDITOR_COMPONENT_INFO, (index) => {
      this.editorIndex = index
    })

    EventBus.$on(eventsType.UPDATE_COMPONENT_CONTENT, (val) => {
      this.units[this.editorIndex] = val
    })
  },
  mounted() {
  },

  methods: {
  }
}
</script>
<style lang="less" scoped>
  .editor-wrap{
    width: 100%;
    height: 100%;
  }
</style>
