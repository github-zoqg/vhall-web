<template>
  <div class="vh-pc-preview">
    <img class="cover" src="./images/pc-cover@1x.png" alt="" />
    <div class="pc-menus" v-show="activeIndex != null">
      <ul>
        <vue-scroll>
          <template v-for="(item, index) in menus">
            <li
              class="menus-item"
              :key="index"
              @click="choseMenu(index)"
              :class="{ active: index == activeIndex }"
              v-show="![2, 3, 5, 6].includes(item.type)"
            >
              <span>
                {{ item.name }}
              </span>
            </li>
          </template>
        </vue-scroll>
      </ul>
    </div>
    <div class="tab-content">
      <preview v-if="checkedInfo" :currentInfo="checkedInfo" :pre="pre"></preview>
    </div>
  </div>
</template>
<script>
  import preview from './preview-pc';

  export default {
    props: {
      menus: {
        required: true
      },
      pre: {
        required: true
      }
    },

    components: {
      preview
    },

    data() {
      return {
        activeIndex: null,
        checkedInfo: null
      };
    },

    mounted() {
      setTimeout(() => {
        this.menus.forEach((item, index) => {
          if (item.type == 4) {
            this.activeIndex = index;
          }
        });
        this.checkedInfo = this.menus[this.activeIndex];
      }, 500);
    },

    // watch: {
    //   menus: function(newVal) {
    //     if(newVal.length) {
    //        this.menus.forEach((item, index) => {
    //         if(item.type == 4) {
    //           this.activeIndex = activeIndex = index
    //         }
    //       });
    //       this.activeIndex = activeIndex
    //       this.checkedInfo = this.menus[activeIndex]
    //     }
    //   },

    methods: {
      choseMenu(index) {
        this.activeIndex = index;
        this.checkedInfo = this.menus[index];
        console.log(this.checkedInfo);
      }
    }
  };
</script>
<style lang="less" scoped>
  .vh-pc-preview {
    width: 800px;
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 8px 0px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    .cover {
      width: 100%;
    }

    .pc-menus {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e6e6e6;
      overflow: hidden;
      ul {
        padding: 0;
        margin: 0;
        list-style: none;
        white-space: nowrap;
        height: 50px;
        &:after {
          content: '';
          display: block;
          clear: both;
          width: 0;
          height: 0;
          overflow: hidden;
        }
      }
      .menus-item {
        display: inline-block;
        // padding: 0 10px;
        margin: 0 24px;
        cursor: pointer;
        span {
          border-bottom: 2px solid #fff;
          display: inline-block;
          height: 49px;
          color: #666666;
        }
        &.active {
          span {
            border-bottom: 2px solid #fb3a32;
            color: #fb3a32;
          }
        }
      }
    }

    .tab-content {
      padding: 24px;
    }
  }
</style>
