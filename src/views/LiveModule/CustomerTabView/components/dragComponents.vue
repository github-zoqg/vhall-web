<template>
  <div class="vh-menus-dragComponents">
    <div class="vh-menus-dragComponents__title">
      基础组件
    </div>
    <div
      class="vh-menus-dragComponents__item"
      :class="{'vh-menus-dragComponents__item-disabled': disableAll}"
      :draggable="!disableAll"
      v-for="item in baseComponents"
      :key="item.component_id"
      @dragstart="dragStartHandler($event, item)"
    >
      <!-- 图文 -->
      <i class="iconfont-v3 saasicon_graphic" v-if="item.component_id == 1"></i>
      <!-- 二维码 -->
      <i class="iconfont-v3 saasicon_gQrcode" v-if="item.component_id == 2"></i>
      <!-- 直播 -->
      <i class="iconfont-v3 saasicon_live" v-if="item.component_id == 3"></i>
      <!-- 专题 -->
      <i class="iconfont-v3 saasicon_project" v-if="item.component_id == 4"></i>
      <!-- 图文链接 -->
      <i class="iconfont-v3 saasicon_Picturesofchain" v-if="item.component_id == 5"></i>
      <!-- 文字链接 -->
      <i class="iconfont-v3 saasicon_Textchain" v-if="item.component_id == 6"></i>
      <!-- 标题 -->
      <i class="iconfont-v3 saasicon_title" v-if="item.component_id == 7"></i>
      <!-- 分割线 -->
      <i class="iconfont-v3 saasicon_divider" v-if="item.component_id == 8"></i>
      {{ item.name }}
    </div>
    <div class="vh-menus-dragComponents__title">
      功能组件
    </div>
    <div
      class="vh-menus-dragComponents__item"
      :class="{'vh-menus-dragComponents__item-disabled': disableAll}"
      :draggable="!disableAll"
      v-for="item in highComponents"
      :key="item.component_id"
      @dragstart="dragStartHandler($event, item)"
    >
      <i class="iconfont-v3 saasicon_list"></i> {{ item.name }}
    </div>
    <!-- <div class="vh-menus-dragComponents__item vh-menus-dragComponents__item-disabled">
      <i class="iconfont-v3 saasicon_list"></i> 敬请期待
    </div> -->
  </div>
</template>
<script>
import EventBus from '../bus'
import eventsType from '../EventConts'
export default {
  data() {
    return {
      compList: [],
      disableAll: false,
      menuUUID: null
    }
  },
  computed: {
    baseComponents: function() {
      return this.compList.filter(item => item.type == 1)
    },
    highComponents:  function() {
      return this.compList.filter(item => item.type == 2)
    }
  },
  created() {
    this.getComponents()
    EventBus.$on(eventsType.INIT_MENU_INFO, this.menuCheck)
  },
  methods: {
    getComponents() {
      this.$fetch('menuTplList', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if(res && res.code === 200) {
          let list = res.data.list;
          list.map(item => {
            item.compType = this.compCovert(item.component_id);
          });
          console.log(list, 'this.compList');
          this.compList = list;
        } else {
          this.compList = [];
        }
      }).catch(e => {
        console.log(e);
      });
    },
    compCovert(component_id) {
      return ['', 'img-txt', 'rq-code', 'video', 'special', 'text-link', 'img-link', 'title', 'hr', 'rank'][component_id]
    },

    dragStartHandler(e, info) {
      if(this.disableAll) return
      console.log('drag start', e)
      let dt = event.dataTransfer;
      dt.dropEffect = 'move'

      dt.setData('Text', JSON.stringify({ ...info }));
      EventBus.$emit('VH_DRAG_EVENT', e)
    },

    dragEnd(e) {
      console.log('drag end handler', e)
      e.preventDefault()
      EventBus.$emit('VH_DRAG_EVENT_END', e)
    },


    menuCheck(info) {

      console.log(info)
      // this.menuUUID = info.uuid
      if(info.type !== 1) {
        this.disableAll = true
      } else {
        this.disableAll = false
      }
    }

  }
}
</script>
<style lang="less">
  .vh-menus-dragComponents{
    width: 140px;
    height: 100%;
    background: #F7F7F7;
    user-select: none;
    &__title{
      width: 140px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #666666;
    }
    &__item{
      line-height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      padding-left: 3px;
      &:hover{
        color: #FB3A32;
      }
      cursor: move;
      i{
        font-size: 16px;
        display: inline-block;
        margin-right: 4px;
      }
      &-disabled{
        cursor: not-allowed;
        color: #999999;
      }
    }
  }
</style>
