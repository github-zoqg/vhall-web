<template>
  <div>
    <div class="vh-chose-active-box menus-checkedBox">
      <!-- 单个视频 -->
      <div class="vh-chose-active-item" v-for="item in activeList" :key="item.id">
        <div class="vh-chose-active-item__cover">
          <img :class="`img_box_bg box_bg_${item.itemMode}`" :src="item.cover" alt="" />
          <div class="vh-chose-active-item__cover-status">
            <!-- <span class="liveTag"> -->
            <!-- <label class="live-status" v-if="item.webinar_state == 1">
              <img src="../../../../../common/images/live.gif" alt="">
            </label> -->
            <!-- {{item | liveTag}} -->
            <!-- </span> -->
          </div>
          <div class="vh-chose-active-item__cover-hots">
            <i class="iconfont-v3 saasicon_redu"></i>
            {{ item.view_num }}
          </div>
        </div>
        <div class="vh-chose-active-item__title ellsips">
          {{ item.title }}
        </div>
        <div class="vh-chose-active-item__info">
          {{ item.created_at | unitTime }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { parseImgOssQueryString, cropperImage } from '@/utils/utils';
  export default {
    props: ['checkedList'],
    data() {
      return {
        activeList: [],
        loading: false
      };
    },
    mounted() {
      this.getActiveList();
    },
    watch: {
      checkedList: function (val) {
        console.log('组件初始值', val);
        this.getActiveList();
      }
    },
    methods: {
      getActiveList() {
        if (this.checkedList.length == 0) {
          this.activeList = [];
          return;
        }
        this.loading = true;
        const userId = sessionStorage.getItem('userId');
        this.$fetch('btachSubject', {
          subject_ids: this.checkedList.join(','),
          user_id: userId
        }).then(res => {
          if (res.code == 200) {
            if (res.data.total == 0) {
              this.lock = true;
              this.loading = false;
              this.total = 0;
            } else {
              this.activeList = res.data.list.map(item => {
                let mode = 3;
                if (cropperImage(item.cover)) {
                  mode = this.handlerImageInfo(item.cover);
                }
                return {
                  ...item,
                  itemMode: mode
                };
              });
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        });
      },
      // 解析图片地址
      handlerImageInfo(url) {
        let obj = parseImgOssQueryString(url);
        return Number(obj.mode) || 3;
      }
    }
  };
</script>

<style lang="less" scoped>
  .vh-chose-active-box {
    width: 100%;
    height: 100% !important;
    overflow: hidden;
    position: relative;
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
  }
  .search {
    margin-bottom: 20px;
  }
  .vh-chose-active-item {
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    background: #f7f7f7;
    border-radius: 4px;
    margin: 0 16px 16px 0;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &.checkedActive {
      border: 1px solid #fb3a32;
    }
    &__cover {
      position: relative;
      width: 100%;
      height: 94px;
      /*  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
      background: #1a1a1a;
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      .img_box_bg {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        position: absolute;
        top: 0;
        left: 0;
        &.box_bg_1 {
          object-fit: fill;
        }
        &.box_bg_2 {
          object-fit: cover;
          object-position: left top;
        }
      }
      &-status {
        position: absolute;
        left: 8px;
        top: 8px;
        // width: 110px;
        height: 20px;
        line-height: 20px;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        img {
          height: 8px;
        }
      }
      &-hots {
        position: absolute;
        left: 10px;
        bottom: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
      }
    }
    &__title {
      margin: 4px 8px;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 20px;
    }
    &__info {
      margin: 0 8px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      word-break: keep-all;
      white-space: nowrap;
      line-height: 16px;
    }
    .liveTag {
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 12px;
      padding: 2px 9px;
      border-radius: 20px;
      position: relative;
      z-index: 2;
    }
  }
  .menus-checkedBox {
    width: 780px;
    // margin: 20px 0;
    .vh-chose-active-item {
      width: 240px;
      // margin-right: 16px;
      // padding: 0 8px;
      height: 202px;
      .vh-chose-active-item__cover {
        height: 135px;
      }
    }
  }
</style>
