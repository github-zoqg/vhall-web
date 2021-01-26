<template>
  <el-dialog
      title="添加直播"
      :visible="visible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :before-close="handleClose"
      @close="cancelSelect"
      custom-class="choose-gift"
      width="595px">
        <div class="search" v-show="total || isSearch">
          <VhallInput v-model.trim="keyword" placeholder="请输入直播标题" @keyup.enter.native="inputChange"  @clear="inputChange" class="add-living-input" clearable>
            <i slot="suffix" class="iconfont-v3 saasicon_search" @click="inputChange" style="cursor: pointer; line-height: 36px;"></i>
          </VhallInput>
          <!-- <el-input v-model.trim="keyword" placeholder="请输入直播标题" suffix-icon="el-icon-search" @change="inputChange" class="add-living-input" clearable></el-input> -->
        </div>
        <el-scrollbar class="scroll-modify" v-loadMore="moreLoadData">
          <div class="vh-chose-active-box"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          v-show="total"
          >
          <!-- 单个视频 -->
            <div class="vh-chose-active-item"
              v-for="(item) in activeList"
              :key="item.webinar_id"
              @click="doSelect(item)"
              :class="{'checkedActive': item.checked}"
            >
            <label  class="img-tangle" v-show="item.checked"><img src="../../../common/images/icon-choose.png" alt=""></label>
              <!-- <label class="img-tangle" v-show="item.checked">
                <i class="el-icon-check"></i>
              </label> -->
              <div class="vh-chose-active-item__cover">
                <img :src="item.img_url" alt="">
                <div class="vh-chose-active-item__cover-status">
                  <span class="liveTag">
                    <label class="live-status" v-if="item.webinar_state == 1">
                      <img src="../../../common/images/live.gif" alt="">
                    </label>
                    {{item | liveTag}}
                  </span>
                </div>
                <div class="vh-chose-active-item__cover-hots">
                <i class="iconfont-v3 saasicon_redu"> {{ item.pv }}</i>
                </div>

              </div>
              <div class="vh-chose-active-item__title ellsips" :title="item.subject">
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
        <div class="select-option" v-if="total">已选择<span>{{ selectedOption.length }}</span>个</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="medium" round @click="saveSelect" v-preventReClick :disabled="!selectedOption.length">确 定</el-button>
          <el-button round @click="cancelSelect" size="medium" v-preventReClick>取 消</el-button>
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
      maxPage: 0,
      nullText: 'nullData',
      text: '您还没有创建直播',
      total: 1,
      activeList: [],
      selectedOption: [],
      keyword: '',
      loading: true,
      pageInfo: {
        page: 1,
        limit: 6,
        pos: 0
      },
      lock: false,
      visible: true,
      isSearch: false
    }
  },
  components: {
    noData
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
      this.loading = true;
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
          this.activeList = this.activeList.concat(res.data.list)
          this.total = res.data.total
          this.maxPage = Math.ceil(res.data.total / this.pageInfo.limit);
          this.loading = false;
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
.scroll-modify {
    /deep/.el-scrollbar__bar {
      right:-29px;
    }
}
  .vh-chose-active-box{
    // width: 560px;
    max-height: 310px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // overflow: auto;
    // overflow-x: hidden;
    // position: relative;
  }
  /deep/ .el-dialog {
    .el-dialog__title {
      line-height: 28px;
    }
    .el-dialog__body {
      padding: 0!important;
    }
  }
  .add-living-input {
    width: 220px;
    /deep/ input {
      border-radius: 20px;
    }
    /deep/.el-input__suffix{
      right: 12px;
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
    margin-bottom: 12px;
    // margin: 0 12px 12px 0;
    border: 1px solid #ffffff;
    position: relative;
    // &:nth-of-type(3n) {
    //   margin-right: 0;
    // }
    .img-tangle{
        position: absolute;
        right: -1px;
        top:-1px;
        width: 20px;
        height: 20px;
        font-size: 0;
        z-index: 100;
        img{
          width: 100%;
          height: 100%;
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
      /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
      background: #1A1A1A;
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
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
        background: linear-gradient(180deg, transparent, rgba(0, 0,0, 0.2));
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
  .no-live{
    padding-bottom: 24px;
  }
  .select-option{
    position: absolute;
    bottom: 32px;
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
