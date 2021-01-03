<template>
  <div class="lives-wrapbox">
    <template v-if="mode == 1">
      <liveChecked
        :checkedList="info.subjects"
      ></liveChecked>
    </template>
    <template v-if="mode == 2">
      <livesCheck
        :checkedList="info.subjects"
        @seleclted="checkLives"
      />
    </template>
  </div>
</template>
<script>
import liveChecked from './project-checked'
import livesCheck from './project-boxs'
export default {
  props: {
   // 1. 显示  2. 编辑
    mode: {
      required: true,
      default: 1
    },
    info: {
      required: false
    }
  },

  components: {
    livesCheck,
    liveChecked
  },

  data() {
    return{
      lives: [],

    }
  },
  watch: {
    info: function(val) {

    }
  },

  methods: {
    initLives() {

    },

    livesStatusSync() {
    },

    checkLives(subjects) {
      console.log(subjects)
      this.info.subjects = subjects
      this.$emit('updateInfo', this.info)
    }
  }
}
</script>
<style lang="less" scoped>
  .lives-wrap{
    width: 100%;

  }
</style>
