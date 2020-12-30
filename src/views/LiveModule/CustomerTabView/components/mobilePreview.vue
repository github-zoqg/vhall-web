<template>
  <div class="vh-mobile-preview-wrapbox" v-if="menus.length">
    <div class="vh-mobile-previe">
      <div style="height:295px; overflow:hidden;">
        <slot></slot>
      </div>
      <div class="vh-mobile-menus">
        <i class="iconfont-v3 saasicon_arrowleft" @click="scrollLeft()"></i>
        <div class="vh-mobile-menus-scroll">
          <div class="vh-mobile-menus-scroll__content" :style="{'left': scrollLeftPx}">
            <div class="vh-mobile-menus-item"
              :class="{'vh-mobile-menus-item__active': activeIndex == index}"
              v-for="(item, index) in menus"
              :key="item.uuid"
              @click="choseMenu(index)"
            >
              <span class="vh-mobile-menus-item_name">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
        <i class="iconfont-v3 saasicon_plus vh-mobile-menus-add" @click="addMenuAction"></i>
        <i class="iconfont-v3 saasicon_arrowright1" @click="scrollRight()"></i>
      </div>
      <!-- 浮层编辑菜单 -->
      <div class="vh-mobile-menus-item__popmenu" ref="popMenu">
        <ul>
          <li> 重命名 </li>
          <li> 左移 </li>
          <li> 右移 </li>
          <li> 右侧新增菜单 </li>
          <li> 左侧新增菜单 </li>
          <li> 预告/结束显示 </li>
          <li> 删除 </li>
        </ul>
      </div>

      <div class="vh-mobile-tab-content">
        <component-preview>
        </component-preview>
      </div>
    </div>
    <!-- 编辑区域 -->
    <div class="vh-vh-mobile-preview-editor">
      <editor />
      <!-- <editor-box>
      </editor-box> -->
    </div>

     <!-- 新增菜单（弹出框）-->
    <VhallDialog
      :title="addCustomForm.name || '新增菜单'"
      :visible.sync="addCustomVisbile"
      :close-on-click-modal="false"
      width="280px"
      class="add-menu-dialog"
    >
      <el-form :model="addCustomForm" ref="addCustomForm" :rules="addCustomFormRules" label-width="0">
        <el-form-item prop="name">
          <el-input v-model.trim="addCustomForm.name" auto-complete="off" placeholder="请输入菜单名称" :maxlength="8" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent.stop="addCustomerMenu" size="mini" round>确 定</el-button>
        <el-button @click.prevent.stop="addCustomVisbile = false" size="mini" round>取 消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import EventBus from '../bus'
import eventsType from '../EventConts'
import componentPreview from './customerComponents'
import Editor from './editorBox'
import { v1 as uuidV1 } from 'uuid';
export default {
  props: {
    menus: {
      requred: true
    }
  },
  data() {
    return {
      test: '',
      // activeIndex 当前激活标签
      activeIndex: 0,
      scrollIndex: 0,
      scrollLeftPx: 0,
      $insetIndex: null,
      // 自定义菜单 - 增删
      addCustomVisbile: false,
      addCustomForm: {
        name: null
      },
      addCustomFormRules: {
        name: [
          { required: true, maxlength: 8, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },
    }
  },

  components: {
    componentPreview,
    Editor
  },

  created() {
    console.log("当前默认菜单", this.menus)
  },
  mounted() {
    console.log("当前默认菜单", this.menus)
    setTimeout(() => {
      this.choseMenu(0)
    },200)

  },

  methods: {
    onDrop(e) {
      console.log('放置了， 数据', e)
      e.preventDefault()
    },
    dropover(e) {
      console.log('拖拽 移动中！！', e)
      e.preventDefault()
    },

    choseMenu(index) {
      // deal UI  显示
      this.activeIndex = index
      this.scrollIndex = index
      this.scrollLeft()

      // 信息向各模块同步
      let choseInfo = this.menus[index]
      EventBus.$emit(eventsType.INIT_MENU_INFO, choseInfo)
    },

    // 向左滚动
    scrollLeft() {
      if(this.scrollIndex < 1) { return }
      this.scrollIndex = this.scrollIndex - 1
      let left = this.scrollIndex * 84
      this.scrollLeftPx = `-${left}px`
    },
    // 向右滚动
    scrollRight() {
      // if(this.scrollIndex == 0) { return }
      this.scrollIndex = this.scrollIndex + 1
      let left = this.scrollIndex * 84
      this.scrollLeftPx = `-${left}px`
    },


    //

    addMenuAction() {
      this.$insertIndex = null
      this.addCustomVisbile = true
    },

    addCustomerMenu() {
      this.$refs.addCustomForm.validate((valid) => {
        this.menus.push({
          name: this.addCustomForm.name,
          type: 1,
          uuid: uuidV1(),
          status: 3, // 1显示, 2隐藏, 3直播回放显示, 4预告结束显示
          components: []
        })

        this.addCustomVisbile = false
      })
    }
  }
}
</script>
<style lang="less">
  .vh-mobile-preview-wrapbox{
    height: 100%;
    background: #fff;
  }
  .vh-mobile-previe{
    width: 358px;
    height: 674px;
    background-image: url(../../../../common/images/h5-show-phone2x.png);
    background-repeat: no-repeat;
    background-size: contain;
    top: -6px;
    left: -24px;
    position: relative;
    float: left;
  }
  .vh-vh-mobile-preview-editor{
    overflow: hidden;
  }
  .vh-mobile-menus{
    width: 310px;
    height: 40px;
    margin: 0 auto;
    line-height: 40px;
    position: relative;
    border-bottom: 1px solid #E6E6E6;
    color: #666666;
    .saasicon_arrowleft{
      position: absolute;
      left: 5px;
      top: 0px;
      cursor: pointer;
    }
    .saasicon_arrowright1{
      position: absolute;
      right: 5px;
      top: 0px;
      cursor: pointer;
    }
    .vh-mobile-menus-add{
      position: absolute;
      right: 25px;
      font-size: 20px;
      color: #FB3A32;
      cursor: pointer;
    }
    &-scroll{
      position: absolute;
      left: 5px;
      right: 5px;
      height: 100%;
      margin: 0 22px;
      white-space: nowrap;
      overflow: hidden;
      &__content{
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
        transition: 0.5s ease;
      }
    }
    &-item{
        // min-width: 70px;
        // max-width: 140px;
        width: 84px;
        text-overflow: ellipsis;
        overflow-x: hidden;
        display: inline-block;
        text-align: center;
        height: 100%;
        color: #666;
        vertical-align: top;
        user-select: none;
        cursor: pointer;
        span{
          display: inline-block;
          vertical-align: top;
          padding: 0 10px;
          margin-top: -2px;
        }
        &__active{
          color: #FB3A32;
          span{
            border-bottom: 2px solid #FB3A32;
          }
        }
      }
  }
  .vh-mobile-menus-item__popmenu{
      background: #fff;
      width: 180px;
      padding: 4px;
      display: none;
      &>li{
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        text-align: center;
        font-size: 14px;

        &.disabled{
          color: #B3B3B3;
        }

        &:hover{
          background: #FFEBEB;
          color: #FB3A32;
        }
      }
  }

  .vh-mobile-tab-content{
    height: 305px;
    width: 310px;
    margin: 0 auto;
    padding: 15px 0;
    margin: 0 auto;
  }
</style>
