<template>
  <div class="custormer-menu__editor-box">
    <template v-if="type == 1 || type == 3">
      <component
        :is="componetEditor"
        :menuInfo.sync="currentInfo"
        :units.sync="currentInfo.components"
        :uuid="currentInfo.uuid"
        :pre="pre"
      >
      </component>
    </template>
  </div>
</template>
<script>
import eventsType from '../EventConts'
import EventBus from '../bus'
import componentCustomer from './componet-editor/component-customerEditor'
import componentChat from './componet-editor/component-chatEditor'
export default {
  props: {
    pre: {
      required: true
    }
  },
  data() {
    return {
      currentInfo: {}
    }
  },

  components: {
    componentCustomer,
    componentChat
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
    this.$EventBus.$on(eventsType.INIT_MENU_INFO, this.initInfo)
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
