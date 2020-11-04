<template>
  <div class="page-padding">
    <h1 class="h1__title">功能配置</h1>
    <div class="div__func div__view">
      <h4 class="h4__view__title">观看页设置</h4>
      <ul>
        <li>
          <label>隐藏打赏</label>
          <el-switch
            v-model="DS.value"
            active-color="#FB3A32"
            inactive-color="#CECECE">
          </el-switch>
          <span>{{DS.value === 1 ? '已开启，观看端打赏按钮已被隐藏' : '开启后，观看端打赏按钮将被隐藏'}}</span>
        </li>
        <li>
          <label>隐藏点赞</label>
          <el-switch
            v-model="DZ.value">
          </el-switch>
          <span>{{DZ.value === 1 ? '已开启，观看端点赞按钮已被隐藏' : '开启后，观看端点赞按钮将被隐藏'}}</span>
        </li>
        <li>
          <label>隐藏礼物</label>
          <el-switch
            v-model="LW.value">
          </el-switch>
          <span>{{LW.value === 1 ? '已开启，观看端礼物按钮已被隐藏' : '开启后，观看端礼物按钮将被隐藏'}}</span>
        </li>
        <li>
          <label>隐藏分享</label>
          <el-switch
            v-model="FX.value">
          </el-switch>
          <span>{{FX.value === 1 ? '已开启，观看端分享按钮已被隐藏' : '开启后，观看端分享按钮将被隐藏'}}</span>
        </li>
      </ul>
    </div>
    <div class="div__func div__playback">
      <h4 class="h4__playback__title">观看页设置</h4>
      <ul>
        <li>
          <label>回放禁言</label>
          <el-switch
            v-model="HFJY.value">
          </el-switch>
          <span>{{HFJY.value === 1 ? '已开启，回放默认已开启聊天禁言' : '开启后，回放默认开启聊天禁言'}}</span>
        </li>
        <li>
          <label>回放章节</label>
          <el-switch
            v-model="HFZJ.value">
          </el-switch>
          <span>{{HFZJ.value === 1 ? '已开启，回放/点播观看端显示文档章节' : '开启后，回放/点播观看端显示文档章节'}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "planFunction",
  data() {
    return {
      query: {},
      DS: {
        value: 0,
        valueType: 'switch'
      },
      DZ: {
        value: 0,
        valueType: 'switch'
      },
      LW: {
        value: 0,
        valueType: 'switch'
      },
      FX: {
        value: 0,
        valueType: 'switch'
      },
      'HFJY': {
        value: 0,
        valueType: 'switch'
      },
      'HFZJ': {
        value: 0,
        valueType: 'switch'
      }
    }
  },
  methods: {
    // 获取可配置选项
    planFunctionGet() {
      this.$fetch('planFunctionGet', {}).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },
    // 开关选项
    planFunctionEdit() {
     /* let params = {
        webinar_id: this.$route.params.str,
        needKey: item.key,
        value: item.isOpen
      }*/
    }
  },
  beforeCreate() {
  },
  created() {
    this.planFunctionGet()
  },
  mounted() {
  },
  beforeDestroy() {
  },
  destroyed() {
  }
}
</script>

<style lang="less" scoped>
@import '../../common/css/base.less';
.page-padding {
  padding: 0 41px;
}
h1 {
  font-size: @22;
  font-family: @fontSemibold;
  font-weight: 600;
  color: @a1;
  line-height: 30px;
}
.h1__title {
  margin-bottom: 32px;
}
.div__func {
  min-height: 190px;
  background: @fff;
  border-radius: 4px;
  margin: 0 auto 25px auto;
}
.h4 {
  font-size: @16;
  font-family: @fontRegular;
  font-weight: 400;
  color: @a1;
  line-height: 22px;
}
.h4__view__title {
  padding-top: 32px;
  margin-left: 32px;
}
ul {
  li {
    list-style-type: none;
    margin-top: 32px;
    margin-left: 80px;
  }
}
label {
  font-size: @14;
  font-family: @fontRegular;
  font-weight: 400;
  color: @a1;
  line-height: 20px;
  margin-right: 12px;
}
</style>
