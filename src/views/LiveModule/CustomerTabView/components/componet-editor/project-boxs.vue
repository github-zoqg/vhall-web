<template>
<div style="height: 100%; min-height: 320px">
  <div class="search" >
    <VhallInput
      v-model="keyword"
      placeholder="请输入专题标题"
      @change="inputChange"
      v-clearEmoij
      clearable
      prefix-icon="el-icon-search"
      style="width:220px; border-radius:24px"
      class="input-box"
    ></VhallInput>
  </div>
  <div class="vh-chose-active-box"
    v-infinite-scroll="getActiveList"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-immediate="true"
    v-show="total"
  >
    <vue-scroll>
      <!-- 单个视频 -->
      <div class="vh-chose-active-item"
        v-for="(item) in activeList"
        :key="item.id"
        @click="doSelect(item)"
        :class="{'checkedActive': item.checked}"
      >
        <i class="iconfont-v3 saasicon-choose-01" v-show="item.checked"></i>
        <div class="vh-chose-active-item__cover">
          <!-- TODO 右侧专题选择区域 -->
          <img :class="`img_box_bg box_bg_${item.itemMode}`" :src="item.cover" alt="">
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
    </vue-scroll>
  </div>
</div>
</template>
<script>
import noData from '@/views/PlatformModule/Error/nullPage';
import EventBus from '../../bus'
import eventsType from '../../EventConts'
import { sessionOrLocal, parseImgOssQueryString, cropperImage } from '@/utils/utils';
export default {
  props: ['checkedList'],
  data() {
    return {
      page: 1,
      pageSize: 6,
      nullText: 'nullData',
      text: '你还没有创建直播',
      total: 0,
      activeList: [],
      selectedOption: [],
      keyword: '',
      lock: false,
      loading: false,
      visible: true,
      isSearch: false,
      selectWebinars: this.checkedList
    }
  },
  computed: {
    disabled () {
      return this.loading || this.lock
    }
  },

  created() {
    let _that = this
    EventBus.$on(eventsType.EDITOR_COMPONENTP_PROJECT_ITEM_INFO, (del_id) => {
      let newIds = _that.checkedList.filter(item=> {
        return item != del_id
      })
      _that.syncCheckStatus(newIds, del_id)
    })
  },

  mounted() {
    this.getActiveList();
  },

  methods: {
    inputChange() {
      this.page = 1;
      this.activeList = []
      this.getActiveList();
    },
    getActiveList() {
      this.loading = true
      const pos = (this.page - 1) * this.pageSize
      const limit = this.pageSize
      const userId = sessionStorage.getItem('userId')
      let params = {
        pos: pos,
        user_id: userId,
        limit: limit,
        order_type: 1,
      }

      // 增加 - 标题搜索
      if(this.keyword != '') {
        params.title = this.keyword
      }

      this.$fetch('subjectList', this.$params(params)).then((res) => {
        if(res.code == 200) {
          this.page = this.page + 1
          if(res.data.total == 0) {
            this.lock = true
            this.loading = false
            this.total = 0
          } else {
            this.activeList =  this.activeList.concat(res.data.list.map(item => {
              let mode = 3;
              if (cropperImage(item.cover)) {
                mode = this.handlerImageInfo(item.cover);
              }
              return {
                ...item,
                itemMode: mode,
                checked: false
              }
            }))
            this.total = res.data.total
            // 老控制台选择不需要回显选中的
            this.syncCheckStatus()
            this.loading = false
          }
        } else {
          this.loading = false
        }
      })
    },
    // 解析图片地址
    handlerImageInfo(url) {
      let obj = parseImgOssQueryString(url);
      return Number(obj.mode) || 3;
    },
    // 同步 选中状态
    syncCheckStatus(ids, del_id) {

      let checkIds = this.checkedList
      if(ids && ids.length > 0) {
        checkIds = ids
        this.selectWebinars = ids
      }
      if (checkIds.length > 0) {
        const checked = checkIds.map((item) => {
          return item
        })
        this.activeList = this.activeList.map((item) => {
          if(checked.includes(item.id)) {
            if(del_id != item.id) {
              return {
                ...item,
                checked: true
              }
            } else {
              return {
                ...item,
                checked: false
              }
            }
          } else {
            return {
              ...item,
              checked: false
            }
          }
        })
      }
    },

    doSelect(item) {

      if (this.selectedOption.length == 10 && !item.checked) {
        this.$message({
          message: `专题最多只能选择10个`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return
      }

      item.checked = !item.checked;
      this.selectedOption = this.activeList.filter(item => item.checked);

      // 按时间排序
      // let webinars = this.selectedOption.map((item) => {
      //   return item.id
      // })

      // 按选择顺序排序
      item.checked && this.selectWebinars.push(item.id)
      if( !item.checked ) {
        this.selectWebinars = this.selectWebinars.filter(i => i != item.id)
      }
      this.$emit('seleclted', this.selectWebinars)
    },
  },

}
</script>
<style lang="less" scoped>
  .vh-chose-active-box{
    width: 100%;
    height: 580px;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
  }
  .search{
    margin-bottom: 20px;
    .input-box{
      /deep/ input{
        border-radius: 24px !important;
      }
      /deep/.el-input__icon{
        line-height: 36px;
      }
    }
  }

  .vh-chose-active-item{
    cursor: pointer;
    display: inline-block;
    width: 175px;
    height: 182px;
    overflow: hidden;
    background: #F7F7F7;
    border-radius: 4px;
    margin: 0 16px 14px 0;
    position: relative;
    transition: all 0.15s ease-in;
    border: 1px solid #FFFFFF;
    &:hover{
      box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      border-radius: 4px;
    }
    i.saasicon-choose-01{
      position: absolute;
      right: 0;
      top: 0;
      /* color: #FB3A32;
      font-size: 20px; */
      width: 20px;
      height: 20px;
      background-image: url('data:image/png;base64,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');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      z-index: 1;
      &::before {
        content: ''!important;
      }
    }
    &.checkedActive{
      border: 1px solid #FB3A32;
    }
    &__cover{
      position: relative;
      width: 100%;
      height: 120px;
      /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
      background: #1A1A1A;
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      .img_box_bg{
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        position: absolute;
        top:0;
        left: 0;
        &.box_bg_1{
          object-fit: fill;
        }
        &.box_bg_2{
          object-fit: cover;
          object-position: left top;
        }
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
        left: 10px;
        bottom: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
      }
    }
    &__title{
      margin: 8px 8px 4px 8px;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
    }
    &__info{
      margin: 8px 8px 4px 8px;
      font-size: 14px;
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
    }
  }
  @media (min-width: 1920px) {
    .vh-chose-active-item {
      width: 215px;
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
