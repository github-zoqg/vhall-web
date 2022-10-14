<template>
  <VhallDialog
    title="主题设置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="510px">
    <!-- <div class="themeBox">
      <span style="color:#1a1a1a;">选择主题</span>
      <i :class="{active: colorIndex=='red'}" @click="colorIndex='red'"></i>
      <i :class="{active: colorIndex=='blue'}" @click="colorIndex='blue'"></i>
      <i :class="{active: colorIndex=='purple'}" @click="colorIndex='purple'"></i>
    </div> -->
    <p class="margin">
      <span style="color:#1a1a1a;">标签页标题</span>
    </p>
    <div :class="['tabs', colorIndex]">
      <div :class="{active: tabs=='title'}" @click="tabs='title'">{{title1 || '活动报名'}}</div>
      <div :class="{active: tabs=='valite'}" @click="tabs='valite'">{{title2 || '我已报名'}}</div>
    </div>
    <el-input maxlength="8" v-show="tabs=='title'" v-model="title1" placeholder="活动报名">
      <span
        v-if="title1 != '活动报名'"
        class="el-input__icon resetbtn"
        slot="suffix"
        @click="title1 = '活动报名'">重置
      </span>
    </el-input>
    <el-input maxlength="8" v-show="tabs=='valite'" v-model="title2" placeholder="我已报名">
      <span
        v-if="title2 != '我已报名'"
        class="el-input__icon resetbtn"
        slot="suffix"
        @click="title2 = '我已报名'">重置
      </span>
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" v-preventReClick @click.prevent.stop="save" round size="medium">保存</el-button>
    </span>
  </VhallDialog>
</template>

<script>
export default {
  props: {
    baseInfo: {
      type: Object,
    }
  },
  watch:{
    baseInfo: {
      handler(newVal){
        this.colorIndex = newVal.theme_color;
        this.title1 = newVal.tab_form_title;
        this.title2 = newVal.tab_verify_title;
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      dialogVisible: false,
      tabs: 'title',
      title1: '活动报名',
      title2: '我已报名',
      colorIndex: 'red',
    };
  },
  methods: {
    save() {
      const options = {
        theme_color: this.colorIndex,
        tab_form_title: this.title1 || '活动报名',
        tab_verify_title: this.title2 || '我已报名',
      };
      const that = this;
      let userId = this.$parent.userId
      this.$vhall_paas_port({
        k: 100183,
        data: {business_uid: userId, user_id: '', webinar_id: this.$parent.webinar_id, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$emit('setBaseInfo', options, () => { that.dialogVisible = false; });
    },
    copy() {
      const input = document.getElementById('linkBox');
      input.select();
      document.execCommand('copy');
      this.$message({
        message: `复制成功`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    }
  }
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  @blue: #3562FA;
  @blueBg: #ebefff;
  @purple: #8d57a4;
  @purpleBg: #F5BDEA;
  .themeBox{
    line-height: 40px;
    i{

      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      padding: 6px;
      box-sizing: border-box;
      margin-left: 24px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      &:nth-child(2){
        background: @red;
        background-clip: content-box;
      }
      &:nth-child(3){
        background: @blue;
        background-clip: content-box;
      }
      &:nth-child(4){
        background:@purple;
        background-clip: content-box;
      }
      &.active{
        border-color:  @red;
      }
    }
  }
  .resetbtn{
    line-height: 38px;
    cursor: pointer;
    color: #3562FA
  }
  .tabs{
    width: 100%;
    overflow: hidden;
    margin: 8px 0 24px 0;
    >div{
      width: 50%;
      float: left;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      line-height: 40px;
      height: 40px;
      text-align: center;
      transition: all .2s linear;
      cursor: pointer;
      &:nth-child(1){
        border-right: 0px none;
        border-radius: 4px 0px 0px 4px;
      }
      &:nth-child(2){
        border-left: 0px none;
        border-radius: 0px 4px 4px 0px;
      }
      &.active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
    }
    &.red{
      .active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
    }
    &.blue{
      .active{
        border: 1px solid @blue;
        background: @blueBg;
        color: @blue;
      }
    }
    &.purple{
      .active{
        border: 1px solid@purple;
        background: @purpleBg;
        color:@purple;
      }
    }
  }
  .margin{
    position: relative;
    margin-top: 24px;
  }
</style>
