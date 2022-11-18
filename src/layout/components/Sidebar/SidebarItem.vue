<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <!-- <template slot="title"> -->
          <!--
            <icon class="sidebar-font" :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" v-if="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"></icon>
            -->
          <i
            :class="`sidebar-font ${onlyOneChild.meta.icon || (item.meta && item.meta.icon)}`"
            v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
          />
          <span slot="title" v-if="onlyOneChild.meta.title">{{ onlyOneChild.meta.title }}</span>
          <!-- </template> -->
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- 包含子菜单 -->
      <template slot="title">
        <!--
          <icon class="sidebar-font" :icon-class="item.meta && item.meta.icon" v-if="item.meta && item.meta.icon"></icon>
        -->
        <i
          :class="`sidebar-font ${item.meta && item.meta.icon}`"
          v-if="item.meta && item.meta.icon"
        ></i>
        <span slot="title" v-if="item.meta.title">{{ item.meta.title }}</span>
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
      newChild: function () {
        let children = this.item.children;
        // console.log('children', children);
        let userInfo = sessionOrLocal.get('userInfo');
        let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        let perVo = permissions ? JSON.parse(permissions) : {};
        children = children.filter(items => {
          return (
            items.meta.name !== 'brandMgr' ||
            (items.meta.name === 'brandMgr' &&
              !(
                perVo['ui.brand_setting'] == 0 &&
                perVo['webinar_skins'] == 0 &&
                perVo['watch.viewing_protocol'] == 0
              ))
          );
        });
        if (userInfo) {
          let vo = JSON.parse(userInfo);
          if (vo.parent_id > 0) {
            // 是子账号情况下，若路由不是子账号管理 或者 不是开发设置，展示
            return children
              .filter(item => !(item.meta.name === 'sonMgr' || item.meta.name === 'devMgr'))
              .filter(item => {
                if (item.meta.auth_key) {
                  return item.meta.auth_key && perVo && perVo[item.meta.auth_key] > 0;
                } else {
                  return item;
                }
              });
          } else {
            // let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
            // let perVo = permissions ? JSON.parse(permissions) : {};
            // TODO 模拟 perVo['child_num_limit'] = 0;
            if (perVo && Number(perVo['child_num_limit']) !== 1) {
              // 父账号，但是没有子账号管理
              return children.filter(item => {
                if (item.meta.auth_key) {
                  // 配置了该项，表示按照此权限处理；未配置该项，正常处理
                  console.log('4');
                  return (
                    !(item.meta.name === 'sonMgr') &&
                    item.meta.auth_key &&
                    perVo &&
                    perVo[item.meta.auth_key] > 0
                  );
                } else {
                  console.log('3');

                  return !(item.meta.name === 'sonMgr');
                }
              });
            } else {
              return children.filter(item => {
                if (item.meta.auth_key) {
                  return item.meta.auth_key && perVo && perVo[item.meta.auth_key] > 0;
                } else {
                  return item;
                }
              });
            }
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
          this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
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
