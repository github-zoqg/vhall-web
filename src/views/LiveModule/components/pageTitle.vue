<template>
  <div>
    <span class="pageTitle">{{title}}</span>
    <el-tooltip
      v-if="!!$props.content || !!$slots.content"
      v-bind="$props">
        <div slot="content">
          <slot name="content"></slot>
        </div>
      <i class="el-icon-question"></i>
    </el-tooltip>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    ...Object.assign(
      Tooltip.props,
      {
        placement: {
          type: String,
          default: 'right'
        },
        effect: {
          type: String,
          default: 'dark'
        }
      }
    )
  },
  created() {
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .pageTitle{
    color: #1A1A1A;
    font-size: 22px;
    font-weight: 600;
  }
</style>
