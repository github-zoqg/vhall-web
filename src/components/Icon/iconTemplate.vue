<template>
  <span :class="['iconContainer', className]">
    <!--
        <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="iconName"></use>
        </svg>
        <slot></slot>-->
    <i class="svg-icon" :class="`iconfont-v3 ${iconClass}`"></i>
  </span>
</template>

<script>
  export default {
    name: 'svg-icon',
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String
      }
    }
    // computed: {
    //   iconName() {
    //     return `#${this.iconClass}`;
    //   }
    // }
  };
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .iconContainer {
    font-size: 16px;
  }
</style>
