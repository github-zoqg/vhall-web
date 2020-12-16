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
            :active-value="1"
            :inactive-value="0"
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
            :active-value="1"
            :inactive-value="0"
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
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "planFunction",
  components: {
    PageTitle
  },
  data() {
    return {
      query: {},
      keyList: []
    };
  },
  methods: {
    changeStatus(callback, item) {
      item.value = Number(!callback)
      let params = {
        webinar_id: this.$route.params.str,
        permission_key: item.type,
        status: Number(callback)
      };
      console.log('当前参数传递：', params);
      this.$fetch('planFunctionEdit', params).then(res => {
        console.log(res);
        if(res && res.code === 200) {
          this.$message({
            message:  `${callback ? '开启' : '关闭'} ${item.key_name} 成功`,
            type: 'success'
          });
          item.value = Number(callback);
        } else {
          this.$message.error(res.msg || `${callback ? '开启' : '关闭'} ${item.key_name} 失败`);
        }
      }).catch(e => {
        console.log(e);
        this.$message({
          message: `操作失败`,
          type: 'failure'
        });
      });
    },
    planSuccessRender (data) {
      let dataVo = JSON.parse(data);
      console.log(dataVo, '功能配置');
      this.keyList = [
        [
          {
            type: 'ui.hide_reward',
            key_name: '隐藏打赏',
            openShow: '已开启，观看端打赏按钮已被隐藏',
            closeShow: '开启后，观看端打赏按钮将被隐藏',
            value: Number(dataVo['ui.hide_reward'])
          },
          {
            type: 'watch_hide_like',
            key_name: '隐藏点赞',
            openShow: '已开启，观看端点赞按钮已被隐藏',
            closeShow: '开启后，观看端点赞按钮将被隐藏',
            value: Number(dataVo['ui.hide_like'])
          },
          {
            type: 'ui.hide_gifts',
            key_name: '隐藏礼物',
            openShow: '已开启，观看端礼物按钮已被隐藏',
            closeShow: '开启后，观看端礼物按钮将被隐藏',
            value: Number(dataVo['ui.hide_gifts'])
          },
          {
            type: 'ui.hide_share',
            key_name: '隐藏分享',
            openShow: '已开启，观看端的分享已被隐藏（PC端分享按钮和手机端的微信分享）',
            closeShow: '开启后，观看端的分享将被隐藏（PC端分享按钮和手机端的微信分享）',
            value: Number(dataVo['ui.hide_share'])
          }
        ],
        [
          {
            type: 'ui.watch_record_no_chatting',
            key_name: '回放禁言',
            openShow: '已开启，回放默认已开启聊天禁言',
            closeShow: '开启后，回放默认开启聊天禁言',
            value: Number(dataVo['record_no_chatting'])
          },
          {
            type: 'ui.watch_record_chapter',
            key_name: '回放章节',
            openShow: '已开启，回放/点播观看端显示文档章节',
            closeShow: '开启后，回放/点播观看端显示文档章节',
            value: Number(dataVo['ui.watch_record_chapter'])
          }
        ]
      ]
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
      this.$fetch('planFunctionGet', {
        webinar_id: this.$route.params.str,
        webinar_user_id: sessionOrLocal.get('userId')
      }).then(res=>{
        console.log(res);
        // 数据渲染
        res && res.code == 200 && res.data ?  this.planSuccessRender(res.data.permissions) : this.planErrorRender(null);
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
