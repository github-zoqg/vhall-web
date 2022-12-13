<template>
  <div class="lives-wrapbox">
    <template v-if="mode == 1">
      <liveChecked :checkedList="info.subjects"></liveChecked>
    </template>
    <template v-if="mode == 2">
      <livesCheck :checkedList="info.subjects" @seleclted="checkLives" />
    </template>
  </div>
</template>
<script>
  import liveChecked from './project-checked';
  import livesCheck from './project-boxs';
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';
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
      return {
        lives: []
      };
    },
    watch: {
      info: function (val) {}
    },
    created() {
      let _that = this;
      this.$EventBus.$on(eventsType.EDITOR_COMPONENTP_PROJECT_ITEM_INFO, del_id => {
        let newIds = _that.info.subjects.filter(item => {
          return item != del_id;
        });
        _that.info.subjects = newIds;
        _that.$emit('updateInfo', _that.info);
      });
    },
    methods: {
      initLives() {},

      livesStatusSync() {},

      checkLives(subjects) {
        console.log(subjects);
        this.info.subjects = subjects;
        this.$emit('updateInfo', this.info);
      }
    }
  };
</script>
<style lang="less" scoped>
  .lives-wrap {
    width: 100%;
  }
</style>
