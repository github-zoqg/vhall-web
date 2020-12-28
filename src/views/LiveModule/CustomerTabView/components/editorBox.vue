<template>
  <div class="custormer-menu__editor-box">
    <component
      :is="componetEditor"
      :units.sync="currentInfo.components"
      :uuid="currentInfo.uuid"
    >
    </component>
  </div>
</template>
<script>
import eventsType from '../EventConts'
import EventBus from '../bus'
import componentCustomer from './componet-editor/component-customerEditor'
export default {
  data() {
    return {
      currentInfo: {}
    }
  },

  components: {
    componentCustomer
  },

  computed: {
    type: function() {
      return this.currentInfo.type
    },
    componetEditor: function () {
      var typeMaps = {
        1 : 'component-customer',
        2 : 'component-doc',
        3 : 'component-chat',
        4 : 'component-des',
        5 : 'component-goods',
        6 : 'component-recommend',
      }
      return typeMaps[this.type]
    }
  },

  created() {
    EventBus.$on(eventsType.INIT_MENU_INFO, this.initInfo)
  },

  methods: {
    initInfo(info) {
      this.currentInfo = info
    }
  },

}
</script>
<style lang="less" scoped>
  .custormer-menu__editor-box{
    width: 100%;
    height: 100%;
  }
</style>
