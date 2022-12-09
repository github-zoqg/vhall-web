<template>
  <div>
    <div class="vh-chose-active-box menus-checkedBox">
      <div class="vh-chose-active-item" v-if="activeList.length == 0">
        <div class="vh-chose-active-item__cover">
          <!-- <img :src="item.cover" alt=""> -->
          <div class="vh-chose-active-item__cover-status"></div>
          <div class="vh-chose-active-item__cover-hots">
            <i class="iconfont-v3 saasicon_redu"></i>
            0
          </div>
        </div>
        <div class="vh-chose-active-item__title ellsips">专题示例</div>
        <!-- <div class="vh-chose-active-item__info">
        2020-12-30 12:00:00
      </div> -->
      </div>

      <!-- 单个视频 -->
      <div class="vh-chose-active-item" v-for="item in activeList" :key="item.id">
        <div class="vh-chose-active-item__cover">
          <!-- TODO 选择专题后，反显已选择面板（至少有一个已选中的，后续选择都在此面板） -->
          <img :class="`img_box_bg box_bg_${item.itemMode}`" :src="item.cover" alt="" />
          <span class="vh-chose-active-item__del" @click.stop="delProjectItem(item.id, item.type)">
            <img src="../images/icon-trash-line-01.png" alt="" />
          </span>
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
            {{ item.pv | formatNum }}
          </div>
        </div>
        <div class="vh-chose-active-item__title ellsips">
          {{ item.title }}
        </div>
        <!-- <div class="vh-chose-active-item__info">
        {{ item.created_at | unitTime }}
      </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import EventBus from '../../bus';
  import eventsType from '../../EventConts';
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
        console.log('专题组件初始值', val);
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
                  itemMode: mode,
                  checked: false
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
      },
      delProjectItem(project_id, type) {
        if (type == 2) {
          // 双语flash专题
          this.$confirm(`当前专题为Flash专题，保存后将会为您删除，此专题为您保存在旧平台`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              this.$EventBus.$emit(eventsType.EDITOR_COMPONENTP_PROJECT_ITEM_INFO, project_id);
            })
            .catch(() => {});
        } else {
          this.$EventBus.$emit(eventsType.EDITOR_COMPONENTP_PROJECT_ITEM_INFO, project_id);
        }
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
    margin-bottom: 6px;
    // margin: 0 14px 14px 0;
    &:hover {
      box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      border-radius: 4px;
    }
    &.checkedActive {
      border: 1px solid #fb3a32;
    }
    &__cover {
      position: relative;
      width: 100%;
      height: 94px;
      background: #1a1a1a;
      // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      // background-size: 400% 400%;
      // animation: gradientBG 15s ease infinite;
      // background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.2));
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
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 20px;
    }
    &__info {
      margin: 0 8px;
      font-size: 12px;
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
    width: 286px;
    margin: 0 auto;
    .vh-chose-active-item {
      width: 136px;
      // margin-right: 6px;
      padding: 0 8px;
      height: 123px;
      .vh-chose-active-item__cover {
        height: 68px;
      }
    }
  }
  .vh-chose-active-item__del {
    z-index: 8;
    position: absolute;
    width: 20px;
    height: 20px;
    right: 1px;
    top: 3px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
