<template>
  <div class="customer-preview" @drop.prevent.stop="addComponet" @dragover="dragover">
    <template v-if="units.length == 0">
      <div class="drag-here">请拖拽组件至此处</div>
    </template>
    <vue-scroll @handle-resize="handleResize" ref="cusResize">
      <template v-if="units.length">
        <draggable :list="units">
          <div
            class="editor-component-box"
            :class="{ editor: index == editorIndex, splitLine: item.component_id == 8 }"
            v-for="(item, index) in units"
            :key="index"
            @click="doEditor(index)"
          >
            <i class="iconfont-v3 saasicon-trashline-01" @click="delComponent(index)"></i>
            <!-- <i class="iconfontV3 saasicon_warning"></i> -->
            <template>
              <preview-box :info="item" :mode="1" :pre="pre"></preview-box>
            </template>
          </div>
        </draggable>
      </template>
    </vue-scroll>
  </div>
</template>
<script>
  import draggable from 'vuedraggable';
  import PreviewBox from '../componet-editor/preview-box';
  import { v1 as uuidV1 } from 'uuid';
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';
  export default {
    name: 'component-customer',
    props: {
      units: {
        required: true
      },
      uuid: {
        required: true
      },
      pre: {
        required: true
      }
    },
    components: {
      draggable,
      PreviewBox
    },
    data() {
      return {
        hello: '',
        editorIndex: 0
      };
    },

    watch: {
      units: function (val) {
        console.log('新的值', val);
      }
    },

    methods: {
      handleResize(vertical, horizontal, nativeEvent) {
        // console.log('size变化', vertical, horizontal, nativeEvent)
        this.$refs['cusResize'].scrollTo({
          y: nativeEvent.height
        });
      },
      doEditor(index) {
        console.log('sssssssss', this);
        this.editorIndex = index;
        this.$EventBus.$emit(eventsType.EDITOR_COMPONENT_INFO, index);
      },

      addComponet(e) {
        console.log('增加-自定义菜单数据', e.dataTransfer.getData('Text'));
        let componentData = JSON.parse(e.dataTransfer.getData('Text'));

        if (componentData.component_id == 1) {
          this.units.push({
            ...componentData,
            content: '默认图文',
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 2) {
          this.units.push({
            ...componentData,
            // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
            imageSrc: `//aliqr.e.vhall.com/qr.png?t=${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
            hrc: `//aliqr.e.vhall.com/qr.png?t=${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 3) {
          this.units.push({
            ...componentData,
            // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
            webinars: [],
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 4) {
          this.units.push({
            ...componentData,
            // To Do 默认 二维码地址。 替换成当前，直播间 观看页地址！！
            subjects: [],
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 5) {
          this.units.push({
            ...componentData,
            text: '',
            src: '',
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 6) {
          this.units.push({
            ...componentData,
            imageSrc: '',
            src: '',
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 7) {
          this.units.push({
            ...componentData,
            title: '',
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 8) {
          this.units.push({
            ...componentData,
            cUid: uuidV1()
          });
        } else if (componentData.component_id == 9) {
          const isAdded = this.units.filter(item => {
            return item.component_id == 9;
          });

          const result = this.$parent.validateALL();

          if (result) {
            this.$message({
              message: '功能组件只能添加一次，已阻止您本次操作',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            return;
          }

          this.units.push({
            ...componentData,
            inSwitch: 1, // 1， 开启 。 0 关闭
            rewardSwitch: 0, // 1， 开启 。 0 关闭 // TODO:支付牌照问题
            inContent: '',
            rewardContent: '',
            cUid: uuidV1()
          });
        }

        this.doEditor(this.units.length - 1);

        e.preventDefault();
      },

      delComponent(index) {
        // 删除数组制定位置
        this.units.splice(index, 1);
        this.$nextTick(() => {
          this.editorIndex = index + 1;
          this.editorIndex >= this.units.length ? this.units.length : this.editorIndex;

          this.$EventBus.$emit(eventsType.EDITOR_COMPONENT_INFO, this.editorIndex);
        });
      },

      dragover(e) {
        e.preventDefault();
      }
    }
  };
</script>
<style lang="less" scoped>
  .drag-here {
    line-height: 80px;
    text-align: center;
    color: #999;
    user-select: none;
  }
  .customer-preview {
    width: 100%;
    height: 100%;
    overflow: auto;
    .editor-component-box {
      position: relative;
      padding: 10px 5px;
      box-sizing: border-box;
      width: 285px;
      margin: 6px auto;
      word-break: break-all;
      i {
        position: absolute;
        cursor: pointer;
        right: -7px;
        top: -7px;
        z-index: 1;
        color: #fb3a32;
        font-size: 18px;
        background: #fff;
        display: none;
      }
      /deep/.vh-chose-active-item__del {
        display: none;
      }
      &.editor {
        background: #fff5f5;
        border: 1px dashed #f09d99;
        i {
          display: block;
        }
        /deep/.vh-chose-active-item__del {
          display: block;
        }
      }
      &.splitLine {
        padding: 0 5px;
      }
    }
  }
</style>
