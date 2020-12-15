<template>
  <el-dialog
      title="添加直播"
      :visible="visible"
      :close-on-click-modal="false"
      @close="cancelSelect"
      width="592px">
      <div class="vh-chose-active-box"
        v-infinite-scroll="getActiveList"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-immediate="true"
      >

        <!-- 单个视频 -->
        <div class="vh-chose-active-item"
          v-for="(item, index) in activeList"
          :key="item.webinar_id"
          @click="doSelect(item)"
          :class="{'checkedActive': item.checked}"
        >
          <div class="vh-chose-active-item__cover">
            <img src="" alt="">
            <div class="vh-chose-active-item__cover-status">
              <template v-if="item.webinar_state == 1">
                <img src="../../../common/images/live/live.gif" alt=""> 直播 | 互动直播
              </template>
              <template v-if="item.webinar_state == 2">
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
              </template>
            </div>
            <div class="vh-chose-active-item__cover-hots">
             <i class="el-icon-view"></i>
             {{ item.pv }}
            </div>

          </div>
          <div class="vh-chose-active-item__title">
            {{ item.subject }}
          </div>
          <div class="vh-chose-active-item__info">
            {{ item.created_at }}
          </div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="saveSelect">确 定</el-button>
        <el-button round @click="cancelSelect">取 消</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {

  props: {
    checkedList: {
      default: () => []
    }
  },

  data() {
    return {
      page: 1,
      pageSize: 9,
      activeList: [],
      lock: false,
      loading: false,
      visible: true
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
  },

  methods: {
    getActiveList() {
      this.loading = true
      const pos = (this.page - 1) * this.pageSize
      const limit = this.page * this.pageSize
      const userId = sessionStorage.getItem('userId')

      this.$fetch('liveList', {
        pos: pos,
        user_id: userId,
        limit: limit,
        order_type: 1,
      }).then((res) => {
        if(res.code == 200) {
          this.page = this.page + 1
          if(res.data.list.length == 0) {
            this.lock = true
            this.loading = false
          } else {
            this.activeList =  this.activeList.concat(res.data.list)
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
        return item.webinar_id
      })
      this.activeList = this.activeList.map((item) => {
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
      this.activeList = this.activeList.map(active => {
        if (item.webinar_id == active.webinar_id) {
          if(active.checked) {
            return{
              ...active,
              checked: false
            }
          } else {
            return{
              ...active,
              checked: true
            }
          }
        } else {
          return {...active}
        }
      })
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
    width: 560px;
    height: 320px;
    overflow: auto;
    overflow-x: hidden;
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

    &.checkedActive{
      border: 1px solid #FB3A32;
    }
    &__cover{
      position: relative;
      width: 100%;
      height: 94px;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      &-status{
        position: absolute;
        left: 8px;
        top: 8px;
        width: 110px;
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
  }
</style>
