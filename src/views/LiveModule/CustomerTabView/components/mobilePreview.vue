<template>
  <div class="vh-mobile-preview-wrapbox clearFix" v-if="menus.length">
    <div class="vh-mobile-previe">
      <div class="vh-moblie-content-box" style="width:310px; overflow:hidden; position:relative; left: 20px">
      <div style="height:295px; overflow:hidden;">
        <slot></slot>
      </div>
      <div class="vh-mobile-menus">
        <div style="width: 6px;left: -6px;position: absolute;height: 300px;background: #f3f3f3; z-index: 6;"></div>
        <i class="iconfont-v3 saasicon_arrowleft" @click="scrollLeft()" style="background:#fff;  z-index:5"></i>
        <div class="vh-mobile-menus-scroll">
          <div class="vh-mobile-menus-scroll__content" :style="{'left': scrollLeftPx}">
            <div class="vh-mobile-menus-item"
              :class="{'vh-mobile-menus-item__active': activeIndex == index}"
              v-for="(item, index) in menus"
              :key="item.uuid"
              @click="choseMenu(index)"
              @mousemove="showPop(index)"
              @mouseout="hidePop(index)"
            >
              <span class="vh-mobile-menus-item_name" :class="{'blur': item.status == 2}">
                {{ item.name }}
              </span>
              <!-- 浮层编辑菜单 -->
              <div class="vh-mobile-menus-item__popmenu" v-show="item.show">
                <ul>
                  <li @click="rename(index)"> 重命名 </li>
                  <li @click="swapLeft(index)" v-if="index != 0"> 左移 </li>
                  <li @click="swapRight(index)" v-if="(index < menus.length - 1)"> 右移 </li>
                  <li @click="addRight(index)"> 右侧新增菜单 </li>
                  <li @click="addLeft(index)"> 左侧新增菜单 </li>
                  <li v-if="item.type == 1">
                    <el-checkbox type="checkbox" :checked="item.status == 4" @change="showOrHide(index)" /> 预告/结束显示
                    <el-tooltip v-tooltipMove class="item" effect="dark" placement="right">
                      <div slot="content" style="line-height:24px">勾选后，该直播为预告和结束状态时也会显示此菜单；<br />不勾选则只在直播和回放状态显示。</div>
                      <i class="iconfont-v3 saasicon_help_m"></i>
                    </el-tooltip>
                  </li>
                  <li @click.stop="delThis(index)" v-if="item.type == 1"> 删除 </li>
                  <li @click.stop="hideThis(index, item.status)" v-if="item.type == 3 || item.type == 4"> {{ item.status == 1 ?  '隐藏' : '显示'}} </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <i class="iconfont-v3 saasicon_plus vh-mobile-menus-add" @click.stop="addMenuAction" style="background:#fff; z-index:5"></i>
        <i class="iconfont-v3 saasicon_arrowright1" @click.stop="scrollRight()" style="background:#fff; z-index:5; padding-right:2px"></i>
      </div>
      <div class="vh-mobile-tab-content">
        <component-preview :pre="pre">
        </component-preview>
      </div>
      </div>
    </div>
    <!-- 编辑区域 -->
    <div class="vh-vh-mobile-preview-editor">
      <editor :pre="pre"/>
      <!-- <editor-box>
      </editor-box> -->
    </div>
    <!-- 新增菜单（弹出框）-->
    <VhallDialog
      :title="type == 'add' ? '新增菜单' : '重命名菜单'"
      :visible.sync="addCustomVisbile"
      :close-on-click-modal="false"
      v-if="addCustomVisbile"
      width="280px"
      top="32vh"
      class="add-menu-dialog"
    >
      <el-form
        :model="addCustomForm"
        ref="addCustomForm"
        :rules="addCustomFormRules"
        @submit.native.prevent
        label-width="0">
        <el-form-item prop="name">
          <VhallInput
            v-model="addCustomForm.name"
            auto-complete="off"
            v-clearEmoij
            placeholder="请输入菜单名称"
            :maxlength="8"
            show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.stop="addCustomerMenu" size="small" round>确 定</el-button>
        <el-button @click.stop="addCustomVisbile = false" size="small" round>取 消</el-button>
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
    },
    pre: {
      required: true
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
      type: 'add', // add , rename
      // 自定义菜单 - 增删
      addCustomVisbile: false,
      addCustomForm: {
        name: ''
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
    // console.log("当前默认菜单", this.menus)
    setTimeout(() => {
      this.choseMenu(0)
    }, 400)

  },

  methods: {
    validateCanAdd() {
      let check = 0
      this.menus.forEach((item) => {
        if(item.type == 1) {
          item.components.forEach((component) => {
            if (component.component_id == 9) {
              check = check + 1
            }
          })
        }
      })

      return check != 0
    },

    onDrop(e) {
      console.log('放置了， 数据', e)
      e.preventDefault()
    },
    dropover(e) {
      console.log('拖拽 移动中！！', e)
      e.preventDefault()
    },




    choseMenu(index, info) {
      // deal UI  显示
      this.activeIndex = index
      this.scrollIndex = index
      this.scrollLeft()
      // 信息向各模块同步
      let choseInfo = this.menus[index] || info
      console.log( '菜单进行切换', choseInfo )

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
      const scrollElement = document.querySelector('.vh-mobile-menus-scroll__content')
      const currentLeft = parseInt(scrollElement.style.left)
      console.log('width', scrollElement.offsetWidth, currentLeft, scrollElement.offsetWidth + currentLeft)
      if((scrollElement.offsetWidth + currentLeft) < 310) {
        return
      }
      this.scrollIndex = this.scrollIndex + 1
      let left = this.scrollIndex * 84
      this.scrollLeftPx = `-${left}px`
    },

    showPop(index) {
      if(this.activeIndex == index) {
        console.log('show info')
        this.menus[index].show = true
      }


    },

    hidePop(index) {
      if(this.activeIndex == index) {
        this.menus[index].show = false
      }
    },

    addMenuAction() {
      const addedMenu = this.menus.filter((item) => {
        return item.type == 1
      })
      if (addedMenu.length == 6) {
        this.$message.error('自定义菜单最多增加六个。您已到达上限！')
        return false
      }

      this.$insertIndex = this.menus.length
      this.type = 'add'
      this.addCustomForm.name = ''
      this.addCustomVisbile = true
    },

    addCustomerMenu() {
      this.$refs.addCustomForm.validate((valid) => {
        if(!valid) {
          return
        }
        if(this.type == 'add') {
          this.activeIndex = null
          if(this.$insertIndex > 0 && this.$insertIndex < this.menus.length) {
            this.menus.splice(this.$insertIndex, 0, {
              name: this.addCustomForm.name,
              type: 1,
              uuid: uuidV1(),
              show: false,
              status: 3, // 1显示, 2隐藏, 3直播回放隐藏, 4预告结束显示
              components: []
            })
          } else if (this.$insertIndex == 0) {
            this.menus.unshift({
              name: this.addCustomForm.name,
              type: 1,
              uuid: uuidV1(),
              show: false,
              status: 3, // 1显示, 2隐藏, 3直播回放隐藏, 4预告结束显示
              components: []
            })
          } else if(this.$insertIndex == this.menus.length) {
            this.menus.push({
              name: this.addCustomForm.name,
              type: 1,
              uuid: uuidV1(),
              show: false,
              status: 3, // 1显示, 2隐藏, 3直播隐藏, 4预告结束显示
              components: []
            })
          }
          if (this.menus.length) {
            let menus = this.menus.filter(item => {
              return ('components' in item)
            })
            let insertArr = [100210, 100211, 100212, 100213, 100214, 100215]
            this.$vhall_paas_port({
              k: insertArr[menus.length - 1] || 100210,
              data: {business_uid: this.$parent.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
          }

          setTimeout(() => {
            this.choseMenu(this.$insertIndex, this.menus[this.$insertIndex])
          }, 500)
        } else {
          this.menus[this.$insertIndex].name = this.addCustomForm.name
        }
        this.addCustomVisbile = false
      })
    },
    // 菜单重命名
    rename(index) {
      this.$insertIndex = index
      this.type = 'rename' // 编辑类型！
      this.addCustomForm.name = this.menus[index].name || ''
      this.addCustomVisbile = true
    },
    //  左移
    swapLeft(index) {
      if(index == 0) {
        return
      } else {
        let cache = Object.assign({}, this.menus[index])
        this.menus.splice(index,1,this.menus[(index - 1)])
        this.menus[(index -1)] = cache
      }
    },
    //  右移
    swapRight(index) {
      if(index == this.menus.length) {
        return
      } else {
        let cache = Object.assign({}, this.menus[index])
        this.menus.splice(index,1,this.menus[(index + 1)])
        this.menus[(index + 1)] = cache
      }
    },
    // 右侧增加菜单
    addRight(index) {
      this.$insertIndex = (index + 1)
      this.type = 'add' // 编辑类型！
      this.addCustomForm.name = ''
      this.addCustomVisbile = true
    },
    // 左侧增加菜单
    addLeft(index) {
      this.$insertIndex = index
      console.log(this.$insertIndex)
      this.type = 'add' // 编辑类型！
      this.addCustomForm.name = ''
      this.addCustomVisbile = true
    },
    // 预告显示 隐藏菜单
    showOrHide(index) {
      if(this.menus[index].status == 3) {
        this.menus[index].status = 4
      } else {
        this.menus[index].status = 3
      }
    },
    // 删除
    delThis(index) {
      let activeTab = index === 0 ? 0 : (index - 1)
      const _this = this
      setTimeout(() => {
        const deleteMenu = this.menus.splice(index, 1)
        _this.$emit('deleteCustomItem', deleteMenu[0])
        this.choseMenu(activeTab)
      }, 100);
    },
    // 隐藏
    hideThis(index) {
      const item = this.menus[index]
      if(item.status == 1) {
        this.menus[index].status = 2
      } else {
        this.menus[index].status = 1
      }
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
    height: 41px;
    margin: 0 auto;
    left: 6px;
    background: #fff;
    line-height: 40px;
    position: relative;
    border-bottom: 1px solid #E6E6E6;
    color: #666666;
    z-index: 10;
    .saasicon_arrowleft{
      position: absolute;
      left: 0px;
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
      right: 23px;
      padding-right: 3px;
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
      z-index: 2;
      white-space: nowrap;
      &__content{
        position: absolute;
        left: 0;
        top: 0;
        transition: 0.5s ease;
      }
    }
    &-item{
        // min-width: 70px;
        // max-width: 140px;
        position: relative;
        min-width: 84px;
        text-overflow: ellipsis;
        display: inline-block;
        text-align: center;
        height: 100%;
        color: #666;
        vertical-align: top;
        user-select: none;
        cursor: pointer;
        & > span{
          display: inline-block;
          vertical-align: top;
          padding: 0 10px;
          margin-top: -2px;
        }
        .blur{
          filter: blur(0.8px);
        }
        &__active{
          color: #FB3A32;
          span{
            // border-bottom: 2px solid #FB3A32;
          }
        }
    }
  }
  .vh-mobile-menus-item__popmenu{
      position: absolute;
      background: #fff;
      width: 160px;
      padding: 4px 0;
      background: #FFFFFF;
      box-shadow: 0px 8px 32px 0px rgba(51, 51, 51, 0.16);
      border-radius: 4px;
      text-align: center;
      left: -40px;
      top: 40px;
      z-index: 100;
      & li{
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        font-size: 14px;
        text-align: left;
        color: #666666;
        padding-left: 20px;
        &.disabled{
          color: #B3B3B3;
        }

        &:hover{
          background: #f7f7f7;
          color: #1a1a1a;
        }
        input{
          width: 16px;
          height: 16px;
          border-radius: 2px;
          border: 1px solid #999999;
          vertical-align: middle;
          line-height: 40px;
        }
        i{
          vertical-align: middle;
          line-height: 40px;
        }
      }
      /deep/.el-checkbox {
        span.el-checkbox__input {
          border-bottom: 0!important;
        }
        span.el-checkbox__inner {
          border-bottom: 1px solid #CCC!important;
        }
        .el-checkbox__input.is-focus span.el-checkbox__inner {
          border-color: #FB3A32!important;
        }
        .el-checkbox__input.is-checked span.el-checkbox__inner, .el-checkbox__input.is-indeterminate span.el-checkbox__inner {
          border-color: #FB3A32!important;
        }
        span.el-checkbox__inner:hover {
          border-color: #FB3A32!important;
        }
      }
  }

  .vh-mobile-tab-content{
    height: 305px;
    width: 310px;
    margin: 0 auto;
    padding: 15px 0 25px 0;
    margin: 0 auto;
  }

  .add-menu-dialog{
    .el-dialog__footer{
      padding-top: 0;

      .el-button--small{
        padding:0;
        width: 60px;
        text-align: center;
        height: 32px;
        margin-left: 12px;
      }
    }
    .el-input__inner{
      padding: 12px;
      height: 40px !important;
      line-height: 40px !important;;
      border-radius: 4px;
      border: 1px solid #CCCCCC;
    }
  }
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
