<template>
	<div>
    <div class="switch__box">
      <label class="leve3_title label__r12">邀请榜</label>
      <el-switch
        v-model="unitRankForm.inSwitch"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        @change="inSwitchChange"
      >
      </el-switch>
      <span class="leve3_title title--999">请输入邀请榜的活动规则</span>
      <v-editor v-if="unitRankForm.inSwitch"
        :isReturn=true @returnChange="sendInData" ref="invEditor" :value="unitRankForm.inContent" toolbar="fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | fullscreen"></v-editor>
    </div>
    <div class="switch__box">
      <label class="leve3_title label__r12">打赏榜</label>
      <el-switch
        v-model="unitRankForm.rewardSwitch"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        @change="rewardSwitchChange"
      >
      </el-switch>
      <span class="leve3_title title--999">请输入打赏榜的活动规则</span>
      <v-editor  v-if="unitRankForm.rewardSwitch"
        :isReturn=true @returnChange="sendRewardData" ref="rewardEditor" :value="unitRankForm.rewardContent" toolbar="fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | fullscreen"></v-editor>
    </div>
  </div>
</template>

<script>
import VEditor from '@/components/Tinymce';
export default {
  name: "unitRank.vue",
  components: {VEditor},
  data() {
    return {
      showCompIndex: 0,
      rankType: 'inv', // 默认邀请榜展示
      unitRankForm: {
        component_id: '',
        msg: '',
        inSwitch: true,
        inContent: '',
        rewardSwitch: true,
        rewardContent: ''
      }
    };
  },
  methods: {
    /*
   * 参数1： compVoStr 参数结果对象，包含保存前数据
   * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('排行榜编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitRankForm) {
      //   this.$refs.unitRankForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      this.unitRankForm.inSwitch =
        compVo.compInfo && compVo.compInfo.inSwitch !== ''
        && compVo.compInfo.inSwitch !== null
        && compVo.compInfo.inSwitch !== undefined ? !!compVo.compInfo.inSwitch : true;
      this.unitRankForm.inContent =
        compVo.compInfo && compVo.compInfo.inContent !== ''
        && compVo.compInfo.inContent !== null
        && compVo.compInfo.inContent !== undefined ? compVo.compInfo.inContent : '';
      this.unitRankForm.rewardSwitch =
        compVo.compInfo && compVo.compInfo.rewardSwitch !== ''
        && compVo.compInfo.rewardSwitch !== null
        && compVo.compInfo.rewardSwitch !== undefined ? !!compVo.compInfo.rewardSwitch : true;
      this.unitRankForm.rewardContent =
        compVo.compInfo && compVo.compInfo.rewardContent !== ''
        && compVo.compInfo.rewardContent !== null
        && compVo.compInfo.rewardContent !== undefined ? compVo.compInfo.rewardContent : '';
      // 默认组件类别 和 组件名称
      this.unitRankForm.component_id = compVo.component_id;
      this.unitRankForm.msg = compVo.name;
      this.showCompIndex = index;
    },
    sendInData(content) {
      console.log(content);
      if (content) {
        this.unitRankForm.inContent = content;
        this.sendData();
      }
    },
    sendRewardData(content) {
      console.log(content);
      if (content) {
        this.unitRankForm.rewardContent = content;
        this.sendData();
      }
    },
    sendData() {
      // debugger
      console.log('当前开关状态变化............');
      this.$emit('cxtChangeInfo', {
        content: JSON.stringify(this.unitRankForm),
        type: 'rank',
        rankType: this.rankType,
        compIndex: this.showCompIndex
      });
    },
    inSwitchChange() {
      // 编辑器初始化
      if(this.$refs.invEditor) {
        this.$refs.invEditor.resetContent(this.unitRankForm.inContent);
      }
      this.rankType = this.unitRankForm.inSwitch ? 'inv' : 'reward';
      this.sendData();
    },
    rewardSwitchChange() {
      // 编辑器初始化
      if(this.$refs.rewardEditor) {
        this.$refs.rewardEditor.resetContent(this.unitRankForm.rewardSwitch ? this.unitRankForm.rewardContent : '');
      }
      this.rankType = this.unitRankForm.rewardSwitch ? 'reward' : 'inv';
      this.sendData();
    }
  }
};
</script>

<style scoped>

</style>
