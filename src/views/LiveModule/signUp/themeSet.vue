<template>
  <VhallDialog
    title="主题设置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%">
    <div class="themeBox">
      <span>选择主题</span>
      <i :class="{active: colorIndex=='red'}" @click="colorIndex='red'"></i>
      <i :class="{active: colorIndex=='blue'}" @click="colorIndex='blue'"></i>
      <i :class="{active: colorIndex=='purple'}" @click="colorIndex='purple'"></i>
    </div>
    <p class="margin">标签页标题</p>
    <div :class="['tabs', colorIndex]">
      <div :class="{active: tabs=='title'}" @click="tabs='title'">{{title1 || '用户报名'}}</div>
      <div :class="{active: tabs=='valite'}" @click="tabs='valite'">{{title2 || '验证'}}</div>
    </div>
    <el-input v-show="tabs=='title'" v-model.trim="title1" placeholder="用户报名"></el-input>
    <el-input v-show="tabs=='valite'" v-model.trim="title2" placeholder="验证"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save" round size="medium">保存</el-button>
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
        this.title2 = newVal.tab_form_title;
        this.title1 = newVal.tab_verify_title;
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      dialogVisible: false,
      tabs: 'title',
      title1: '用户报名',
      title2: '验证',
      colorIndex: 'red',
    };
  },
  methods: {
    save() {
      const options = {
        theme_color: this.colorIndex,
        tab_verify_title: this.title2,
        tab_form_title: this.title1,
      };
      const that = this;
      this.$emit('setBaseInfo', options, () => { that.dialogVisible = false; });
    },
    copy() {
      const input = document.getElementById('linkBox');
      input.select();
      document.execCommand('copy');
      this.$message.success('复制成功');
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
  .tabs{
    width: 100%;
    overflow: hidden;
    margin: 8px 0 24px 0;
    >div{
      width: 50%;
      float: left;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      border-radius: 4px 0px 0px 4px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      transition: all .2s linear;
      cursor: pointer;
      &:nth-child(1){
        border-right: 0px none;
      }
      &:nth-child(2){
        border-left: 0px none;
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
    margin-top: 24px;
  }
</style>
