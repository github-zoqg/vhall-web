<template>
  <div class="titleBox">
    <span class="pageTitle">{{ pageTitle }}</span>
    <el-tooltip v-if="!!$props.content || !!$slots.content" v-tooltipMove v-bind="$props">
      <div slot="content">
        <slot name="content"></slot>
      </div>
      <i :class="`iconfont-v3 saasicon_help_m ${iconCssType ? 'gary' : ''}`"></i>
    </el-tooltip>
    <slot name="default"></slot>
  </div>
</template>

<script>
  import { Tooltip } from 'element-ui';
  export default {
    props: {
      pageTitle: {
        type: String,
        required: true
      },
      iconCssType: {
        type: String,
        required: false
      },
      ...Object.assign(Tooltip.props, {
        placement: {
          type: String,
          default: 'right'
        },
        effect: {
          type: String,
          default: 'dark'
        }
      })
    },
    created() {
      console.log(this.$slots);
    },
    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
  .pageTitle {
    color: #1a1a1a;
    font-size: 22px;
    line-height: 30px;
    font-weight: 600;
    margin-right: 8px;
  }
  .titleBox {
    display: flex;
    align-items: center;
    /*margin-top: 20px;*/
    margin-bottom: 32px;
  }
  /deep/.saasicon_help_m {
    /* color: #1A1A1A; */
    color: #999999;
    font-size: 16px;
  }
  /*.saasicon_help_m {
   &.gary {
    color: #666666;
  }
}*/
</style>
