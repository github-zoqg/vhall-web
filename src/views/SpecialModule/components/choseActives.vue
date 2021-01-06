<template>
  <el-dialog
      title="添加直播"
      :visible="visible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :before-close="handleClose"
      @close="cancelSelect"
      width="620px">
      <div class="search" v-show="total || isSearch">
        <el-input v-model.trim="keyword" placeholder="请输入直播标题" suffix-icon="el-icon-search" @change="inputChange" class="add-living-input" clearable></el-input>
      </div>
       <el-scrollbar v-loadMore="moreLoadData">
        <div class="vh-chose-active-box"
          v-show="total"
        >
        <!-- 单个视频 -->
          <div class="vh-chose-active-item"
            v-for="(item) in activeList"
            :key="item.webinar_id"
            @click="doSelect(item)"
            :class="{'checkedActive': item.checked}"
          >
            <label class="img-tangle" v-show="item.checked">
              <i class="el-icon-check"></i>
            </label>
            <div class="vh-chose-active-item__cover">
              <img :src="item.img_url" alt="">
              <div class="vh-chose-active-item__cover-status">
                <span class="liveTag">
                  <label class="live-status" v-if="item.webinar_state == 1">
                    <img src="../../../common/images/live.gif" alt="">
                  </label>
                  {{item | liveTag}}
                </span>
                <!-- <template v-if="item.webinar_state == 1">
                  <img src="../../../common/images/live/live.gif" alt=""> 直播 | 互动直播
                </template> -->
                <!-- <template v-if="item.webinar_state == 2">
                  预告 | 互动直播
                </template>
                <template v-if="item.webinar_state == 3">
                  结束 | 互动直播
                </template>
                <template v-if="item.webinar_state == 4">
                  点播 | 互动直播
                </template>
                <template v-if="item.webinar_state == 5">
                  回放 | 互动直播
                </template> -->
              </div>
              <div class="vh-chose-active-item__cover-hots">
              <i class="iconfont-v3 saasicon_redu"> {{ item.pv }}</i>
              </div>

            </div>
            <div class="vh-chose-active-item__title" :title="item.subject">
              {{ item.subject }}
            </div>
            <div class="vh-chose-active-item__info">
              {{ item.created_at }}
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="no-live" v-show="!total">
        <noData :nullType="nullText" :text="text" :height="50">
          <el-button type="primary" round @click="$router.push({path:'/live/edit',query: {title: '创建'}})" v-if="nullText==='nullData'">创建直播</el-button>
        </noData>
      </div>
      <div class="select-option" v-if="total || isSearch">已选择<span>{{ selectedOption.length }}</span>个</div>
      <span slot="footer" class="dialog-footer" v-if="total || isSearch">
        <el-button type="primary" round @click="saveSelect" v-preventReClick>确 定</el-button>
        <el-button round @click="cancelSelect" v-preventReClick>取 消</el-button>
      </span>
    </el-dialog>
</template>
<script>
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  props: ['checkedList'],
  data() {
    return {
      page: 1,
      pageSize: 6,
      maxPage: 0,
      nullText: 'nullData',
      text: '你还没有创建直播',
      total: 0,
      activeList: [],
      selectedOption: [],
      keyword: '',
      pageInfo: {
        page: 1,
        limit: 6,
        pos: 0
      },
      lock: false,
      loading: false,
      visible: true,
      isSearch: false
    }
  },
  components: {
    noData
  },
  computed: {
    disabled () {
      return this.loading || this.lock
    }
  },

  created() {
    this.getActiveList();
  },

  mounted() {
  },

  methods: {
    inputChange() {
      this.activeList = [];
      // this.activeList.map(item => item.checked = false);
      this.selectedOption = [];
      this.pageInfo = {
        pos: 0,
        page: 1,
        limit: 6
      }
      this.getActiveList();
    },
    handleClose(done) {
      this.pageInfo.page = 1;
      done();
    },
    moreLoadData() {
      if (this.pageInfo.page >= this.maxPage) {
        return false;
      }
      this.pageInfo.page ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.page - 1) * this.pageInfo.limit);
      this.getActiveList();
    },
    getActiveList() {
      const userId = sessionStorage.getItem('userId')
      let params = {
        title: this.keyword,
        order_type: 1,
        webinar_state: 0,
        ...this.pageInfo
      }

      this.$fetch('liveList', this.$params(params)).then((res) => {
        if(res.code == 200) {
          if (!this.keyword) {
          // 默认状态
            this.nullText = 'nullData';
            this.text = '你还没有创建直播！';
            this.isSearch = false;
          } else {
            // 搜索状态
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          }
          if(res.data.total == 0) {
            this.lock = true
            this.loading = false
            this.total = 0
          } else {
            this.activeList = this.activeList.concat(res.data.list)
            this.total = res.data.total
            this.maxPage = Math.ceil(res.data.total / this.pageInfo.limit);
            // this.syncCheckStatus()
            this.loading = false
          }
        } else {
          this.loading = false
        }
      })
    },

    // 同步 选中状态
    syncCheckStatus() {
      if (this.checkedList.length > 0) {
      const checked = this.checkedList.map((item) => {
        return item.webinar_id || item.id
      })
      this.activeList = this.activeList.map((item) => {

        console.log('12312', checked)

          if(checked.includes(item.webinar_id)) {
            return {
              ...item,
              checked: true
            }
          } else {
            return {
              ...item
            }
          }
        })
      }
    },

    doSelect(item) {
      console.log( item )
      item.checked = !item.checked;
      this.selectedOption = this.activeList.filter(item => item.checked);
      // this.activeList = this.activeList.map(active => {
      //   if (item.webinar_id == active.webinar_id) {
      //     if(active.checked) {
      //       return{
      //         ...active,
      //         checked: false
      //       }
      //     } else {
      //       return{
      //         ...active,
      //         checked: true
      //       }
      //     }
      //   } else {
      //     return {...active}
      //   }
      // })
    },

    saveSelect() {
      const checkedActives = this.activeList.filter(item => item.checked)
      this.$emit('selectedEvent', checkedActives)
    },

    cancelSelect() {
      this.visible = false
      this.$emit('cacelSelect')
    }
  },

}
</script>
<style lang="less">
  .vh-chose-active-box{
    // width: 560px;
    max-height: 310px;
    // overflow: auto;
    // overflow-x: hidden;
    // position: relative;
  }
  .add-living-input {
    width: 220px;
    /deep/ input {
      border-radius: 20px;
    }
  }
  .search{
    margin-bottom: 20px;
  }
  .vh-chose-active-item{
    cursor: pointer;
    display: inline-block;
    width: 168px;
    height: 150px;
    overflow: hidden;
    background: #F7F7F7;
    border-radius: 4px;
    margin: 0 12px 12px 0;
    border: 1px solid #ffffff;
    position: relative;
    .img-tangle{
      position: absolute;
      z-index: 1;
      right: 0;
      top:0;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right-color: #FB3A32;
      border-top-color: #FB3A32;
      i{
        color:#fff;
        position: absolute;
        top: -8px;
        right:-11px;
        font-size: 10px;
      }
    }
    &.checkedActive{
      border: 1px solid #FB3A32;
      box-shadow: 0 4px 24px rgba(0,0,0,.15);
    }
    &__cover{
      position: relative;
      width: 100%;
      height: 94px;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
      }
      &-status{
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
        color: #FFFFFF;
        text-align: center;
        img{
          height: 8px;
        }
      }
      &-hots{
        position: absolute;
        left: 0;
        bottom: 0;
        height: 30px;
        width: 100%;
        background: rgba(0,0,0, .6);
        // left: 10px;
        // bottom: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        i{
          position: absolute;
          padding-left: 10px;
          padding-top: 5px;
        }
        // line-height: 20px;
      }
    }
    &__title{
      margin: 8px 8px 4px 8px;
      line-height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &__info{
      margin: 8px 8px 4px 8px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 16px;
    }
    .liveTag{
      background: rgba(0,0,0, .7);
      color: #fff;
      font-size: 12px;
      padding: 2px 9px;
      border-radius: 20px;
      position: relative;
      z-index: 2;
      .live-status{
         padding: 5px;
          img{
            margin:6px 7px;
            width: 8px;
            height: 8px;
          }
        }
    }
  }
  .select-option{
    position: absolute;
    bottom: 40px;
    left: 32px;
    line-height: 20px;
    span{
      color: #FB3A32;
      font-size: 16px;
      padding: 0 10px;
    }
  }
  .no-create{
    margin-bottom: 20px;
  }
</style>
