<template>
  <div class="vh-customer-menu-wrap">
    <page-title
      style="position: relative"
      title="自定义菜单"
    >
      <div slot="content">所有设置对电脑端和移动浏览器同时生效</div>
      <div class="vh-customer-menu-btns">
        <el-button type="primary" round @click.prevent.stop="saveCustomTab">保存</el-button>
        <el-link type="info" :underline=false href="http://www.vhall.com/saas/doc/1457.html" target="_blank" class="link__left">使用帮助</el-link>
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
            @click="activeIndex = 1"
          >
            手机预览
          </span>
          <span
            class="vh-customer__preview-tabcontrols__btn"
            :class="{'vh-customer__preview-tabcontrols__btn—active': activeIndex == 2}"
            @click="activeIndex = 2"
            style="float:right; left: auto"
          >
            PC预览
          </span>
        </div>
        <div class="vh-customer__preview-mobile">
          <mobile-preview
            :menus.sync="customMenus"
            @updateMenus="updateMenus"
          ></mobile-preview>
        </div>
        <div class="vh-customer__preview-pc" style="display: none">
          adaqsd
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import DragComponents from './components/dragComponents';
import MobilePreview from './components/mobilePreview'
import { v1 as uuidV1 } from 'uuid';
export default {
  data() {
    return {
      activeIndex: '1',
      customMenus: []
    }
  },

  components: {
    PageTitle,
    DragComponents,
    MobilePreview
  },

  created() {
    this.getInitMenus()
  },

  methods: {
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
      const saveMenus = Array.from(this.customMenus)
      let params = {
        webinar_id: this.$route.params.str,
        save_type: 2, // 1--保存；2--保存+发布
        menus: saveMenus
      };
       this.$fetch('customMenuSave', {
        request_data: JSON.stringify(params)
      }).then(res =>{
        if(res && res.code === 200 && res.data) {
          this.$message.success('保存成功');
          this.addCustomVisbile = false;
          this.customMenuList();
        } else {
          this.$message.error(res.msg || '保存失败');
        }
      }).catch(e=>{
        console.log(e);
        this.$message.error('保存失败');
      });
    }
  }
}
</script>
<style lang="less">
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
  .vh-customer-menu-contentBox{
    overflow: hidden;
    background: #F7F7F7;
    .vh-customer-menu-contentBox__components{
      height: 100%;
      float: left;
    }
    &__preview{
      padding:20px 20px 20px 40px;
      background: #fff;
      overflow: hidden;
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
        font-family: PingFangSC-Regular, PingFang SC;
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
