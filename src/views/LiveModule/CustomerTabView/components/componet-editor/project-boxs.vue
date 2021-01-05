<template>
<div style="height: 100%; min-height: 320px">
  <div class="search" >
    <el-input
      v-model.trim="keyword"
      placeholder="请输入专题标题"
      @change="inputChange"
      suffix-icon="el-icon-search"
      style="width:220px; border-radius:24px"
      class="input-box"
    ></el-input>
  </div>
  <div class="vh-chose-active-box"
    v-infinite-scroll="getActiveList"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-immediate="true"
    v-show="total"
  >
    <vhscroll>
      <!-- 单个视频 -->
      <div class="vh-chose-active-item"
        v-for="(item) in activeList"
        :key="item.id"
        @click="doSelect(item)"
        :class="{'checkedActive': item.checked}"
      >
        <i class="iconfont-v3 saasicon-choose-01" v-show="item.checked"></i>
        <div class="vh-chose-active-item__cover">
          <img :src="item.cover" alt="">
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
            {{ item.pv }}
          </div>

        </div>
        <div class="vh-chose-active-item__title">
          {{ item.title }}
        </div>
        <div class="vh-chose-active-item__info">
          {{ item.created_at }}
        </div>
      </div>
    </vhscroll>
  </div>
</div>
</template>
<script>
import noData from '@/views/PlatformModule/Error/nullPage';
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
      isSearch: false
    }
  },
  computed: {
    disabled () {
      return this.loading || this.lock
    }
  },

  created() {

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
      const limit = this.page * this.pageSize
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
              return {
                ...item,
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

    // 同步 选中状态
    syncCheckStatus() {
      if (this.checkedList.length > 0) {
      const checked = this.checkedList.map((item) => {
        return item
      })
      this.activeList = this.activeList.map((item) => {
          if(checked.includes(item.id)) {
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
      item.checked = !item.checked;
      this.selectedOption = this.activeList.filter(item => item.checked);
      let webinars = this.selectedOption.map((item) => {
        return item.id
      })
      this.$emit('seleclted', webinars)
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
    }
  }

  .vh-chose-active-item{
    cursor: pointer;
    display: inline-block;
    width: 213px;
    height: 182px;
    overflow: hidden;
    background: #F7F7F7;
    border-radius: 4px;
    margin: 0 14px 14px 0;
    position: relative;
    &:hover{
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
      border-radius: 4px;
    }
    i.saasicon-choose-01{
      position: absolute;
      right: 0;
      top: 0;
      color: #FB3A32;
      font-size: 20px;
      z-index: 1;
    }
    &.checkedActive{
      border: 1px solid #FB3A32;
    }
    &__cover{
      position: relative;
      width: 100%;
      height: 120px;
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
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
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
