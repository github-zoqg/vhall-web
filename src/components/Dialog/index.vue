<template>
  <el-dialog
    v-bind="$props"
    @open="openHandler"
    @opened="openedHandler"
    @close="closeHandler"
    @closed="closedHandler"
    :visible.sync="dialogVisable"
    :close-on-click-modal="modalClick"
    :close-on-press-escape="false"
  >
    <div>
      <slot></slot>
    </div>
    <div slot="title" v-if="$slots.title">
      <slot name="title"></slot>
    </div>
    <div slot="footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
  import { Dialog } from 'element-ui';
  export default {
    props: {
      ...Object.assign(Dialog.props),
      visible: {
        type: Boolean,
        defalut: false
      },
      modalClick: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      dialogVisable: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      openHandler() {
        this.$emit('open');
      },
      openedHandler() {
        this.$emit('opened');
      },
      handleClose(done) {
        this.$emit('beforeClose', done);
      },
      closeHandler() {
        this.$emit('close');
      },
      closedHandler() {
        this.$emit('closed');
      }
    }
  };
</script>
