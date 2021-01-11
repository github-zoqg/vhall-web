<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <template slot="title">
            <!--
            <icon class="sidebar-font" :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" v-if="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"></icon>
            -->
            <i :class="`sidebar-font ${onlyOneChild.meta.icon||(item.meta&&item.meta.icon)}`" v-if="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"/>
            <span slot='title' v-if="onlyOneChild.meta.title">{{onlyOneChild.meta.title}}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- 包含子菜单 -->
      <template slot="title">
        <!--
          <icon class="sidebar-font" :icon-class="item.meta && item.meta.icon" v-if="item.meta && item.meta.icon"></icon>
        -->
        <i :class="`sidebar-font ${item.meta && item.meta.icon}`" v-if="item.meta && item.meta.icon"></i>
       <span slot='title' v-if="item.meta.title">{{item.meta.title}}</span>
     </template>
     <sidebar-item
       v-for="child in newChild"
       :key="child.path"
       :is-nest="true"
       :item="child"
       :base-path="resolvePath(child.path)"
       class="nest-menu"
     />
   </el-submenu>
 </div>
</template>

<script>
import path from 'path';
import AppLink from './Link';
import { sessionOrLocal } from '../../../utils/utils';
import { session } from '../../../components/Player/js/utils';

export default {
 name: 'SidebarItem',
 components: { AppLink },
 props: {
   // route object
   item: {
     type: Object,
     required: true
   },
   isNest: {
     type: Boolean,
     default: false
   },
   basePath: {
     type: String,
     default: ''
   }
 },
 computed: {
   newChild: function() {
    let children = this.item.children;
    console.log(children);
    let userInfo = sessionOrLocal.get('userInfo');
    if (userInfo) {
      let vo = JSON.parse(userInfo);
      if(vo.parent_id > 0) {
        return children.filter(item => item.meta.name !== 'sonMgr');
      } else {
        return children;
      }
    } else {
      return children;
    }
   }
 },
 data() {
   return {
     onlyOneChild: false
   };
 },
 methods: {
   // 判断是否只有一级导航
   hasOneShowingChild(children = [], parent) {
     // 一级导航循环
     const showingChildren = children.filter(item => {
       if (item.hidden) {
         return false;
       } else {
         this.onlyOneChild = item;
         return true;
       }
     });
     if (showingChildren.length === 1) {
       return true;
     }
     if (showingChildren.length === 0) {
       this.onlyOneChild = { ... parent, path: '', noShowingChildren: true };
       return true;
     }
     return false;
   },
   resolvePath(routePath) {
     if (/^(https?:|mailto:|tel:)/.test(routePath)) {
       return routePath;
     }
     if (/^(https?:|mailto:|tel:)/.test(this.basePath)) {
       return this.basePath;
     }
     return path.resolve(this.basePath, routePath);
   }
 }
};
</script>
