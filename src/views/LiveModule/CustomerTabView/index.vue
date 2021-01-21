<template>
  <div class="vh-customer-menu-wrap">
    <page-title
      style="position: relative"
      title="自定义菜单"
    >
      <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      <div class="vh-customer-menu-btns">
        <a href="http://www.vhall.com/saas/doc/1457.html" target="_blank" class="link__left">使用帮助</a>
        <el-button type="primary" style="padding-left: 24px;padding-right: 24px;width: 88px;height: 36px;line-height: 14px; margin-left:24px" round @click.prevent.stop="saveCustomTab">保存</el-button>
      </div>
    </page-title>
    <div class="vh-customer-menu-contentBox">
      <div class="vh-customer-menu-contentBox__components">
        <drag-components></drag-components>
      </div>
      <div class="vh-customer-menu-contentBox__preview">
        <div class="vh-customer__preview-tabcontrols">
          <span
            class="vh-customer__preview-tabcontrols__btn "
            :class="{'vh-customer__preview-tabcontrols__btn—active': activeIndex == 1}"
            @click="preShow(1)"
          >
            手机预览
          </span>
          <span
            class="vh-customer__preview-tabcontrols__btn"
            :class="{'vh-customer__preview-tabcontrols__btn—active': activeIndex == 2}"
            @click="preShow(2)"
            style="float:right; left: auto"
          >
            PC预览
          </span>
        </div>
        <div class="vh-customer__preview-mobile" v-show="activeIndex == 1">
          <mobile-preview
            ref="menusControl"
            :menus.sync="customMenus"
            :pre="activeIndex"
            @updateMenus="updateMenus"
          ></mobile-preview>
        </div>
        <div class="vh-customer__preview-pc" v-show="activeIndex == 2">
          <pc-preview
            :menus="customMenus"
            :pre="activeIndex"
          ></pc-preview>
        </div>
      </div>
    </div>

    <el-dialog
      width="480px"
      height="316px"
      title="预览"
      :visible.sync="showWatch"
      :close-on-click-modal="false"
    >
      <div class="qr-previewbox">
        <img :src="qrCode" alt="">
      </div>
      <div class="qr-previewbox-tips">
        请扫描二维码，观看效果
      </div>
      <div class="vh-copyUrl">
        <div class="vh-copyUrl__input">
          <el-input readonly="" :value="link"></el-input>
        </div>
        <div class="vh-copyUrl__button">
          <el-button size="medium" type="primary" @click="copy">复制</el-button>
        </div>
      </div>
    </el-dialog>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import DragComponents from './components/dragComponents';
import MobilePreview from './components/mobilePreview'
import PcPreview from './components/pcPreview'
import { v1 as uuidV1 } from 'uuid';
import {sessionOrLocal} from "@/utils/utils";
import beginPlay from '@/components/beginBtn';

export default {
  data() {
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      activeIndex: '1',
      customMenus: [],
      qrCode: '',
      link:  '',
      showWatch: false
    }
  },

  components: {
    PageTitle,
    DragComponents,
    MobilePreview,
    PcPreview,
    beginPlay
  },
  created() {
    this.qrCode = `//aliqr.e.vhall.com/qr.png?t=${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`
    this.link = `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`
    this.getInitMenus()
  },

  methods: {
    preShow(activeIndex) {
      this.activeIndex = activeIndex;
    },
    copy() {
      this.$copyText(this.link).then(e => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(res =>{
        this.$message({
          message: res.msg || '复制失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },

    getInitMenus() {
      this.$fetch('customMenuList', {
        webinar_id: this.$route.params.str
      }).then(res=>{
        if(res && res.code === 200) {
          let menuList = res.data.list.map((item) => {
            if (!item.uuid) {
              return {
                ...item,
                show: false,
                uuid: uuidV1()
              }
            }
            return {...item}
          })
          console.log(menuList)
          this.customMenus = menuList;

        } else {
          this.customMenus = [];
        }
      }).catch(error=>{
        console.log(error);
      });
    },

    del(idx) {
      this.customMenus= this.customMenus.filter((item, index) => {
        return idx != index
      })
    },
    updateMenus(info) {
      this.customMenus = info
    },

    saveCustomTab() {

      const checkResult = this.validationMenus()
      if(!checkResult) {
        return false
      }
      const saveMenus = Array.from(this.customMenus)
      let params = {
        webinar_id: this.$route.params.str,
        save_type: 2, // 1--保存；2--保存+发布
        menus: saveMenus
      };
       this.$fetch('customMenuSave', {
        request_data: JSON.stringify(params)
      }).then(res =>{
        if(res.code === 200) {
          this.$message({
            message: `保存成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.addCustomVisbile = false;
          // this.customMenuList();
          this.showWatch = true
        }
      }).catch(res=>{
        this.$message({
          message: res.msg || '保存失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        console.log(res);
      });
    },

    validationMenus () {

      console.log(this.customMenus)
      let checkResult = true
      try {
        this.customMenus.forEach((item, idx) => {
          if(item.type == 1) {
            item.components.forEach((compoent, sort) => {
              if (compoent.component_id == 3) {
                if(compoent.webinars.length == 0) {
                  throw new Error(JSON.stringify({
                    msg: `菜单 【${item.name}】 直播组件配置错误，请修正后在保存！`,
                    index:  idx
                  }))
                }
              } else if(compoent.component_id == 4) {
                if (compoent.subjects.length == 0) {
                  throw new Error(JSON.stringify({
                    msg: `菜单 【${item.name}】 专题组件配置错误，请修正后在保存！`,
                    index:  idx
                  }))
                }
              } else if(compoent.component_id == 5) {
                if (!compoent.text) {
                  throw  new Error(JSON.stringify({
                    msg: `菜单 【${item.name}】 文字链接组件配置错误，链接文字不能为空，请修正后在保存！`,
                    index:  idx
                  }))
                } else {
                   const result = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(compoent.src)
                  if(!result) {
                    throw new Error(JSON.stringify({
                      msg: `菜单 【${item.name}】 文字链接组件配置错误，链接地址必须为合法的http或https网址URL，请修正后在保存！`,
                      index:  idx
                    }))
                  }
                }
              } else if(compoent.component_id == 6) {

                if (!compoent.imageSrc) {
                  throw new Error(JSON.stringify({
                    msg: `菜单 【${item.name}】 图文链接组件配置错误，图片不能为空，请修正后在保存！`,
                    index:  idx
                  }))
                } else {
                   const result = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(compoent.src)
                  if(!result) {
                    throw new Error(JSON.stringify({
                      msg: `菜单 【${item.name}】 图文链接组件配置错误，链接地址必须为合法的http或https网址URL，请修正后在保存！`,
                      index:  idx
                    }))
                  }
                }

              } else if(compoent.component_id == 7) {
                if (!compoent.title) {
                  throw new Error(JSON.stringify({
                      msg: `菜单 【${item.name}】 标题组件配置错误，标题不能为空，请修正后在保存！`,
                      index:  idx
                  }))
                }
              }
            })
          }
        })
      } catch(e) {
        let err
        try {
          err = JSON.parse(e.message)
          this.$message({
            message: err.msg || '未知错误',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          this.$refs.menusControl.choseMenu(err.index)
          // this.activeIndex = err.index
          checkResult = false
        } catch(e) {
          this.$message({
            message: e.msg || '未知错误',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          checkResult = false
        }
      }

      return checkResult
    }
  }
}
</script>
<style lang="less">
  .vh-customer-menu-contentBox__preview {
    width: calc(100% - 140px);
    float: right;
    position: relative;
  }
  .vh-customer-menu-wrap{
    min-height: 530px;
    height: 100%;
    overflow: hidden;
  }
  .vh-customer-menu-btns{
    position: absolute;
    right: 10px;
    top: 0;
  }
  a.link__left {
    font-size: 14px;
    font-family: "-apple-system", "BlinkMacSystemFon", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 400;
    color: #3562FA;
  }
  .qr-previewbox{
    text-align: center;
    margin-bottom: 15px;
    img{
      height: 180px;
    }
  }
  .vh-copyUrl{
    text-align: center;
    padding-bottom: 25px;
    .vh-copyUrl__input{
      display: inline-block;
     width: 250px;
    }
    .vh-copyUrl__button{
      display: inline-block;
      margin-left: 15px;
    }
  }

  .qr-previewbox-tips{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    text-align: center;
    margin-bottom: 10px;
  }
  .vh-customer-menu-contentBox{
    overflow: hidden;
    background: #F7F7F7;
    .vh-customer-menu-contentBox__components{
      height: 100%;
      float: left;
    }
    &__preview{
      padding:24px 20px 20px 40px;
      background: #fff;
      overflow: hidden;
      border-radius: 4px;
    }
    .vh-customer__preview-tabcontrols{
      width: 160px;
      height: 30px;
      line-height: 30px;
      border-radius: 100px;
      border: 1px solid #CCCCCC;
      position: relative;
      box-sizing: border-box;
      margin-bottom: 20px;
      &__btn{
        cursor: pointer;
        float: left;
        width: 79px;
        font-size: 14px;
        font-family: "-apple-system","BlinkMacSystemFon","Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        font-weight: 400;
        color: #666666;
        text-align: center;
        user-select: none;
      }
      .vh-customer__preview-tabcontrols__btn—active{
        background: #FB3A32;
        position: relative;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 20px;
        color: #fff;
      }
    }
    .vh-customer__preview-tabcontrols:after{
      content: ' ';
      display: block;
      height: 0;
      width: 100%;
      overflow: hidden;
      clear: both;
    }
  }
</style>
