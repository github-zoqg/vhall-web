<template>
  <div class="vh-customer-componets-editor-preview">

    <component :is="componetPreview"
      :units.sync="currentInfo.components"
      :menuInfo="currentInfo"
      :uuid="currentInfo.uuid"
      :pre="pre"></component>
  </div>
</template>
<script>
import eventsType from '../EventConts'
import EventBus from '../bus'
// 预览组件区域
// import componentCustomer from './components-view/component-customer'
// import componentDoc from './components-view/component-doc'
// import componentChat from './components-view/component-chat'
// import componentDes from './components-view/component-des'
// import componentGoods from './components-view/component-goods'
// import componentRecommend from './components-view/component-recommend'
const componentCustomer = () => import('./components-view/component-customer')
const componentDoc = () => import('./components-view/component-doc')
const componentChat = () => import('./components-view/component-chat')
const componentDes = () => import('./components-view/component-des')
const componentGoods = () => import('./components-view/component-goods')
const componentRecommend = () => import('./components-view/component-recommend')

export default {
  props: {
    pre: {
      required: true,
      default: 1
    }
  },
  data() {
    return {
      currentInfo: {}
    }
  },

  components: {
    componentCustomer,
    componentDoc,
    componentChat,
    componentDes,
    componentGoods,
    componentRecommend
  },

  computed: {
    type: function() {
      return this.currentInfo.type
    },

    componetPreview: function() {
      var typeMaps = {
        1: 'component-customer',
        2: 'component-doc',
        3: 'component-chat',
        4: 'component-des',
        5: 'component-goods',
        6: 'component-recommend',
      }
      return typeMaps[this.type]
    }
  },

  created() {
    EventBus.$on(eventsType.INIT_MENU_INFO, this.initInfo)
  },

  methods: {
    initInfo(menuInfo) {
      this.currentInfo = menuInfo
      if (this.type == 1 && this.currentInfo.components?.length > 0) {
        this.currentInfo.components = this.currentInfo.components.map((item) => {
          return {
            ...item
          }
        })
      }
    },

    validateALL() {
      return this.$parent.validateCanAdd()
    }
  }
}
</script>
<style lang="less" scoped>
.vh-customer-componets-editor-preview {
  height: 100%;
}
</style>
