<template>
   <el-dialog
      title="添加直播"
      width="590px"
      style="overflow: hidden;"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :before-close="cancelSelect"
      custom-class="choose-gift"
    >
      <div class="subject_tip">若直播在其他专题已设置统一观看限制，当前列表不展示该直播。</div>
      <VhallInput style="width: 230px" v-model="keyword" v-clearEmoij placeholder="请输入直播标题或者直播ID" @keyup.enter.native="inputChange"  @clear="inputChange" class="head-btn search resetRightBrn" clearable>
        <i slot="prefix" class="el-icon-search el-input__icon" :class="{'disabled': !keyword}" @click="inputChange(true)"></i>
      </VhallInput>
      <div class="select-matrial-wrap">
        <div class="material-box" v-show="total">
          <el-scrollbar style="height:100%" v-loadMore="moreLoadData">
            <div class="vh-chose-active-item"
              v-for="(item) in activeList"
              :key="item.webinar_id"
              @click="doSelect(item)"
              :class="{'checkedActive': item.checked}"
            >
            <label  class="img-tangle" v-show="item.checked"><img src="../../../common/images/icon-choose.png" alt=""></label>
              <div class="vh-chose-active-item__cover">
                <img :class="`img_box_bg box_bg_${item.itemMode}`" :src="item.img_url" alt="">
                <div class="vh-chose-active-item__cover-status">
                  <span class="liveTag">
                    <label class="live-status" v-if="item.webinar_state == 1">
                      <img src="../../../common/images/live.gif" alt="">
                    </label>
                    {{item | liveTag}}
                    <span v-if="item.webinar_type != 6 && hasDelayPermission && item.no_delay_webinar == 1"> | 无延迟</span>
                    <span v-if="item.webinar_show_type == 0"> | 竖屏</span>
                  </span>
                </div>
                <div class="vh-chose-active-item__cover-hots">
                <i class="iconfont-v3 saasicon_redu"> {{ item.pv | formatNum }}</i>
                </div>
              </div>
              <div class="vh-chose-active-item__title">
                {{ item.subject }}
              </div>
              <div class="vh-chose-active-item__info">
                {{ item.start_time }}
              </div>
            </div>
          </el-scrollbar>
        </div>
       <div class="no-live" v-show="!total">
          <noData :nullType="nullText" :text="text" :height="50">
            <el-button type="primary" round @click="$router.push({path:'/live/edit',query: {title: '创建'}})" v-if="nullText==='nullData'">创建直播</el-button>
          </noData>
        </div>
      </div>
      <div class="control">
        <span>当前选中<span class="choosed-num"> {{ selectedOption.length }} </span>个直播</span>
        <div class="control-btn" style="text-align: right;">
          <el-button @click="saveSelect" v-preventReClick :disabled="!selectedOption.length" type="primary" round>确定</el-button>
          <el-button @click="cancelSelect" round>取消</el-button>
        </div>
      </div>
    </el-dialog>
</template>
<script>
import noData from '@/views/PlatformModule/Error/nullPage';
import { sessionOrLocal, parseImgOssQueryString, cropperImage } from '@/utils/utils';

export default {
  props: {
    // 选中的数组
    checkedList: {
      required: true,
      type: Array,
      default: () => []
    },
    // 选中的总数
    checkedTotal: {
      required: true,
      type:Number,
      default: 0
    },
    // 专题权限
    checkAuth: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hasDelayPermission: false,
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
    this.selectedOption = this.checkedList.length && JSON.parse(JSON.stringify(this.checkedList)) || []
    console.log(this.selectedOption, '???123124')
    this.getActiveList();
  },

  mounted() {
    const SAAS_VS_PES = sessionOrLocal.get('SAAS_VS_PES', 'localStorage')
    this.hasDelayPermission = SAAS_VS_PES ? JSON.parse(SAAS_VS_PES)['no.delay.webinar'] == '1' : false
  },

  methods: {
    inputChange(isSearch) {
      if (isSearch && !this.keyword) return;
      if (this.keyword) {
        this.$vhall_paas_port({
          k: 100509,
          data: {business_uid: this.$parent.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.activeList = [];
      if(!this.checkedList.length) {
        this.selectedOption = [];
      }
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
        subject_id: this.$route.params.id || undefined,
        order_type: 1,
        is_subject: this.checkAuth > 0 ? 1 : 2,
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
          this.activeList = this.activeList.concat(res.data.list).map(item => {
            let mode = 3;
            if (cropperImage(item.img_url)) {
              mode = this.handlerImageInfo(item.img_url);
            }
            return {
              ...item,
              itemMode: mode
            }
          })
          this.total = res.data.total
          this.maxPage = Math.ceil(res.data.total / this.pageInfo.limit);
          this.loading = false;
          this.syncCheckStatus()
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
    syncCheckStatus() {
      if (this.checkedList.length > 0) {
      const checked = this.selectedOption.map((item) => {
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
      if (this.checkedList.length > 0) {
        const checkedIds = this.selectedOption.map((item) => {
          return item.webinar_id || item.id
        })
        if (item.checked && !checkedIds.includes(item.webinar_id)) {
          this.selectedOption.push(item)
        } else {
          this.selectedOption = this.selectedOption.filter(items => items.webinar_id != item.webinar_id || items.id != item.id);
        }
      } else {
        this.selectedOption = this.activeList.filter(item => item.checked);
      }
    },

    saveSelect() {
      // const checkedActives = this.activeList.filter(item => item.checked)
      this.$emit('selectedEvent', this.selectedOption)
    },

    cancelSelect() {
      this.visible = false
      this.$emit('cacelSelect')
    }
  },

}
</script>
<style lang="less" scoped>
.select-matrial-wrap{
  box-sizing: border-box;
  width: 100%;
  height: 350px;
  padding: 16px 0 0 32px;
  overflow: hidden;
  .material-box {
    height: 327px;
    margin-bottom: 10px;
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  // .head-btn{
  //   width: 100%;
  //   /deep/.el-input__inner{
  //     width: 240px;
  //     margin-left: 18px;
  //   }
  //   /deep/ .el-input__icon {
  //     line-height: 36px;
  //   }
  //   /deep/.el-input__prefix{
  //     cursor: pointer;
  //     left: 9px;
  //   }
  // }
   .vh-chose-active-item{
    cursor: pointer;
    display: inline-block;
    width: 168px;
    height: 150px;
    overflow: hidden;
    background: #F7F7F7;
    border-radius: 4px;
    // margin-bottom: 12px;
    margin: 0 12px 12px 0;
    border: 1px solid #ffffff;
    position: relative;
    &:nth-of-type(3n + 0) {
      margin-right: 0;
    }
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
      height: 93px;
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
      line-height: 17px;
      font-size: 14px;
      font-weight: 400;
      color: #1A1A1A;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &__info{
      margin: 0px 8px 8px 8px;
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
}
.subject_tip{
  position: absolute;
  top: 32px;
  left: 120px;
  color: #999;
}
.control{
  padding: 24px 32px;
  width: 100%;
  position:relative;
  &>span {
    display: inline-block;
    line-height: 36px;
  }
  /deep/ .disabled{
    opacity: 0.5;
  }
  .control-btn {
    float: right;
    /deep/ .el-button.is-round {
      padding: 7px 23px;
    }
  }
  .choosed-num {
    color: #FB3A32;
  }
  }
  /deep/ .choose-gift {
    .el-dialog__title {
      line-height: 28px;
    }
    .el-dialog__body {
      padding: 0;
    }
    .head-btn.el-input {
      width: 220px;
      height: 36px;
      margin-left: 32px;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      .el-input__inner {
        border-radius: 18px;
        border: 1px solid #CCC;
        padding-right: 30px!important;
      }
      /deep/.el-input__prefix{
        cursor: pointer;
      }
    }
    /deep/ .saasicon_search {
      cursor: pointer;
      line-height: 36px;
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
</style>
