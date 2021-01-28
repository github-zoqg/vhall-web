<template>
  <div class="rank-wrapbox">
    <div class="rank-previewbox" v-if="mode == 1">
      <div class="ranking-title">
        <div class="rank-menu">
            <span :class="{'active': activeIndex == 1}" v-if="info.inSwitch == 1" @click="activeIndex = 1">邀请榜</span>
            <span :class="{'active': activeIndex == 2}" v-if="info.rewardSwitch == 1" @click="activeIndex = 2">打赏榜</span>
        </div>
        <span class="bang-rule" @click="changeRule">排行榜规则<i class="iconfont-v3 saasicon_arrowdown1-copy" v-if="rankRule"></i><i class="iconfont-v3 saasicon_arrowdown1" v-else></i></span>
      </div>
      <div class="ranking-box" v-show="rankRule">
          <!-- <vhscroll> -->
          <div class="rank-con" v-show="activeIndex == 1" v-html="info.inContent">
          </div>
          <div class="rank-con" v-show="activeIndex == 2" v-html="info.rewardContent">
          </div>
          <!-- </vhscroll> -->
      </div>
      <div class="rank-band">
        <img v-if="activeIndex == 1 && pre == 1" src="./phone-bang02@2x.png" alt="" />
        <img v-if="activeIndex == 1 && pre == 2" src="./pc-bang02@2x.png" alt="" />
        <img v-if="activeIndex == 2 && pre == 1" src="./phone-bang01@2x.png" alt="" />
        <img v-if="activeIndex == 2 && pre == 2" src="./pc-bang01@2x.png" alt="" />
      </div>
    </div>
    <div class="rank-editor-box" v-if="mode == 2">
      <div class="switch-box switch__box">
        邀请榜
        <el-switch
          style="marign-left: 5px"
          :active-value="1"
          :inactive-value="0"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          v-model="info.inSwitch"
        >
        </el-switch>
      </div>
      <div class="editor-box" style="margin-bottom: 24px">
        <vEditor
          v-model="info.inContent"
          height="270"
        ></vEditor>
      </div>
      <div class="switch-box switch__box">
        打赏榜
        <el-switch
          style="marign-left: 5px"
          :active-value="1"
          :inactive-value="0"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          v-model="info.rewardSwitch"
        >
        </el-switch>
      </div>
      <div class="editor-box">
        <vEditor
          v-model="info.rewardContent"
          height="270"
        ></vEditor>
      </div>
    </div>
  </div>
</template>
<script>
import vEditor from '../../../../../components/Tinymce'
export default {
  props: {
    // 1. 显示  2. 编辑
    mode: {
      required: true,
      default: 1
    },
    info: {
      required: false
    },
    pre: {
      required: true
    }
  },
  components: {
    vEditor,
  },
  data() {
    return {
      activeIndex: '1',
      rankRule: false
    }
  },

  watch: {
    info: function(newVal) {
      if (newVal.inSwitch == 0 && this.activeIndex == 1) {
        this.activeIndex = 2
      } else if (newVal.rewardSwitch == 1 && this.activeIndex == 2) {
        this.activeIndex = 1
      }
    }
  },
  methods: {
    changeTab(index) {
      this.activeIndex = index
    },
    changeRule() {
      this.rankRule = !this.rankRule
    }
  }
}
</script>
<style lang="less" scoped>
  .vh-customer__preview-pc {
    .rank-wrapbox {
      margin-bottom: 20px;
    }
  }
  .rank-editor-box{
    padding-top: 16px;
  }
  .rank-previewbox{
    background: url(./rank-bg.png) repeat;
    padding-bottom: 10px;
    .ranking-title {
      font-size: 14px;
      color: #fff;
      line-height: 40px;
      height: 40px;
      margin: 0 10px;
      position: relative;
      span{
        margin-right: 10px;
        opacity: 0.8;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
        &.active{
          opacity: 1;
        }
      }
      .bang-rule{
        position: absolute;
        right: -10px;

        top: 0;
        .iconfont-v3{
          font-size: 14px;
          padding-left: 3px;
        }
      }
    }

    .rank-band{
      background: #fff;
      margin: 0 10px;
      text-align: center;
      padding-bottom: 10px;
      img{
        width: 90%;
      }
    }
    .ranking-box{
      border-radius: 2px;
      margin: 10px;
      background: #fff;
      padding: 8px;
      line-height: 24px;
      min-height: 30px;
      overflow-y: scroll;
      word-break: break-all;
    }
  }
  .switch-box{
    margin-bottom: 13px;
    /deep/.el-switch{
      margin-top: -2px;
    }
  }

</style>
