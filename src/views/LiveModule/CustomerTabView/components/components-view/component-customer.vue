<template>
  <div class="customer-preview"
    @drop.prevent.stop="addComponet"
    @dragover="dragover"
  >
    <template v-if="units.length == 0">
      请拖拽组件 至此！
    </template>
    <vhscroll>
    <template v-if="units.length">
      <draggable
        :list="units"
      >
        <div
          class="editor-component-box"
          :class="{'editor': index == editorIndex}"
          v-for="(item,index) in units"
          :key="index"
          @click="doEditor(index)"
        >
          <i class="iconfont-v3 saasicon-trashline-01" @click="delComponent(index)"></i>
          <!-- <i class="iconfontV3 saasicon_warning"></i> -->
        <template>
          <preview-box
            :info="item"
            :mode="1"
          ></preview-box>
        </template>
        </div>
      </draggable>
    </template>
    </vhscroll>

  </div>
</template>
<script>
import draggable from "vuedraggable";
import PreviewBox from  '../componet-editor/preview-box'
import { v1 as uuidV1 } from 'uuid';
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
    draggable,
    PreviewBox,
  },
  data() {
    return {
      hello: '',
      editorIndex: 0
    }
  },

  watch: {
    units: function (val) {
      console.log('新的值', val)
    }
  },

  methods: {
    doEditor(index) {
      this.editorIndex = index
      EventBus.$emit(eventsType.EDITOR_COMPONENT_INFO, index)
    },

    addComponet(e) {
      console.log('增加-自定义菜单数据', e.dataTransfer.getData("Text"))
      let componentData = JSON.parse(e.dataTransfer.getData("Text"))

      if (componentData.component_id == 1) {
        this.units.push({
          ...componentData,
          cUid: uuidV1()
        })
      } else if (componentData.component_id == 2) {
        this.units.push({
         ...componentData,
          // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
          imageSrc: `//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/546794954`,
          hrc: '//aliqr.e.vhall.com/qr.png?t=http://live.vhall.com/546794954',
          cUid: uuidV1()
        })
      } else if (componentData.component_id == 3) {
        this.units.push({
         ...componentData,
          // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
          webinars: [],
          cUid: uuidV1()
        })
      }else if(componentData.component_id == 4) {
        this.units.push({
         ...componentData,
          // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
          subjects: [],
          cUid: uuidV1()
        })

      } else if (componentData.component_id == 5){
        this.units.push({
          ...componentData,
          text: '',
          src: 'http://',
          cUid: uuidV1()
        })
      } else if(componentData.component_id == 6) {
        this.units.push({
          ...componentData,
          imageSrc: '',
          src: 'http://',
          cUid: uuidV1()
        })
      } else if(componentData.component_id == 7) {
        this.units.push({
          ...componentData,
          title: '',
          cUid: uuidV1()
        })
      } else if(componentData.component_id == 8) {
        this.units.push({
          ...componentData,
          cUid: uuidV1()
        })
      } else if(componentData.component_id == 9) {
        this.units.push({
          ...componentData,
          inSwitch: 1,  // 1， 开启 。 0 关闭
          rewardSwitch: 1, // 1， 开启 。 0 关闭
          inContent: '',
          rewardContent: '',
          cUid: uuidV1()
        })
      }

      this.doEditor(this.units.length - 1)

      e.preventDefault()
    },

    delComponent(index) {
      // 删除数组制定位置
      this.units.splice(index, 1)
      this.$nextTick(() => {
        this.editorIndex = index + 1
        this.editorIndex >= this.units.length ? this.units.length : this.editorIndex

        EventBus.$emit(eventsType.EDITOR_COMPONENT_INFO, this.editorIndex)
      })


    },

    dragover(e) {
      e.preventDefault()
    },
  }
}
</script>
<style lang="less" scoped>
  .customer-preview {
    width: 100%;
    height: 100%;
    .editor-component-box{
      position: relative;
      padding: 5px;
      box-sizing: border-box;
      width: 285px;
      margin: 10px auto;
      i{
        position: absolute;
        cursor: pointer;
        right: -7px;
        top: -7px;
        z-index: 1;
        color: #FB3A32;
        font-size: 18px;
        background: #fff;
        display: none;
      }

      &.editor{
        background: #FFF5F5;
        border: 1px dashed #F09D99;
        i{
          display: block;
        }
      }
    }
  }
</style>
