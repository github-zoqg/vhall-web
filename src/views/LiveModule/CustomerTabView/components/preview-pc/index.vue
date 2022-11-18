<template>
  <div class="vh-customer-componets-editor-preview">
    <component
      :is="componetPreview"
      :units.sync="currentInfo.components"
      :menuInfo="currentInfo"
      :uuid="currentInfo.uuid"
      :pre="pre"
    ></component>
  </div>
</template>
<script>
  // 预览组件区域
  import componentCustomer from './component-customer';
  import componentDes from './component-des';

  export default {
    props: {
      currentInfo: {
        required: true
      },
      pre: {
        required: true
      }
    },

    components: {
      componentCustomer,
      componentDes
    },

    computed: {
      type: function () {
        return this.currentInfo.type;
      },

      componetPreview: function () {
        var typeMaps = {
          1: 'component-customer',
          4: 'component-des'
        };
        return typeMaps[this.type];
      }
    },

    created() {
      // EventBus.$on(eventsType.INIT_MENU_INFO, this.initInfo)
    },

    methods: {
      initInfo(menuInfo) {
        this.currentInfo = menuInfo;
        if (this.type == 1) {
          this.currentInfo.components = this.currentInfo.components.map(item => {
            return {
              ...item
            };
          });
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .vh-customer-componets-editor-preview {
    height: 100%;
  }
</style>
