<template>
  <div class="page-padding">
    <pageTitle title="功能配置"></pageTitle>
    <div class="div__func div__view" v-if="keyList && keyList.length > 0">
      <div class="div__view__title">观看页设置</div>
      <ul>
        <li class="switch__box" v-for="(item, ins) in keyList[0]" :key="`view_`+ins">
          <label class="leve3_title label__r12">{{ item.key_name }}</label>
          <el-switch
            v-model="item.value"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="changeStatus($event, item)">
          </el-switch>
          <span class="leve3_title title--999">{{!!item.value ? item.openShow : item.closeShow }}</span>
        </li>
      </ul>
    </div>
    <div class="div__func div__playback" v-if="keyList && keyList.length > 1">
      <div class="div__view__title">回放设置</div>
      <ul>
        <li class="switch__box" v-for="(item, ins) in keyList[1]" :key="`playback_`+ins">
          <label class="leve3_title label__r12">{{ item.key_name }}</label>
          <el-switch
            v-model="item.value"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="changeStatus($event, item)">
          </el-switch>
          <span class="leve3_title title--999">{{!!item.value ? item.openShow : item.closeShow }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "planFunction",
  components: {
    PageTitle
  },
  data() {
    return {
      query: {},
      keyList: [
        [
          {
            type: 'DS',
            key_name: '隐藏打赏',
            openShow: '已开启，观看端打赏按钮已被隐藏',
            closeShow: '开启后，观看端打赏按钮将被隐藏',
            value: 0
          },
          {
            type: 'DZ',
            key_name: '隐藏点赞',
            openShow: '已开启，观看端点赞按钮已被隐藏',
            closeShow: '开启后，观看端点赞按钮将被隐藏',
            value: 0
          },
          {
            type: 'LW',
            key_name: '隐藏礼物',
            openShow: '已开启，观看端礼物按钮已被隐藏',
            closeShow: '开启后，观看端礼物按钮将被隐藏',
            value: 0
          },
          {
            type: 'FX',
            key_name: '隐藏分享',
            openShow: '已开启，观看端分享按钮已被隐藏',
            closeShow: '开启后，观看端分享按钮将被隐藏',
            value: 0
          }
        ],
        [
          {
            type: 'JY',
            key_name: '回放禁言',
            openShow: '已开启，回放默认已开启聊天禁言',
            closeShow: '开启后，回放默认开启聊天禁言',
            value: 0
          },
          {
            type: 'ZJ',
            key_name: '回放章节',
            openShow: '已开启，回放/点播观看端显示文档章节',
            closeShow: '开启后，回放/点播观看端显示文档章节',
            value: 0
          }
        ]
      ]
    };
  },
  methods: {
    changeStatus(callback, item) {
      let params = {
        webinar_id: this.$route.params.str,
        needKey: item.type,
        value: callback
      };
      console.log('当前参数传递：', params);
      this.$fetch('planFunctionEdit', params).then(res => {
        console.log(res);
        this.$message({
          message:  `${callback ? '开启' : '关闭'} ${item.key_name} 成功`,
          type: 'success'
        });
      }).catch(e => {
        console.log(e);
        this.$message({
          message: `操作失败`,
          type: 'failure'
        });
      });
    },
    planSuccessRender (data) {
      console.log(data);
    },
    planErrorRender(err) {
      this.$message({
        message: `获取数据异常${err}`,
        type: 'failure'
      });
      this.keyList = null;
    },
    // 获取可配置选项
    planFunctionGet() {
      this.$fetch('planFunctionGet', {}).then(res=>{
        console.log(res);
        // 数据渲染
        res && res.code == 200 && res.data ?  this.planSuccessRender(res.data) : this.planErrorRender(null);
      }).catch(err =>{
        console.log(err);
        this.planErrorRender(err);
      });
    },
  },
  created() {
    this.planFunctionGet();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
@import '../../common/css/base.less';
.page-padding {
  padding: 0 0;
}
.h1__title {
  margin-bottom: 32px;
}
.div__func {
  min-height: 190px;
  background: @background_white;
  border-radius: 4px;
  margin: 0 auto 24px auto;
}
.div__view__title {
  padding-top: 32px;
  margin-left: 32px;
  font-size: @font_size_16;
  font-family: @fontRegular;
  font-weight: 400;
  color: @font_color_h1;
  line-height: 22px;
}
ul {
  li {
    display: block;
    list-style-type: none;
    margin-top: 32px;
    margin-left: 80px;
    line-height: 20px;
  }
  padding-bottom: 32px;
}
</style>
