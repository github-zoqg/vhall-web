<template>
	<div>
    <div class="switch__box">
      <label class="leve3_title label__r12">邀请榜</label>
      <el-switch
        v-model="invStatus"
        active-color="#FB3A32"
        inactive-color="#CECECE">
      </el-switch>
      <span class="leve3_title title--999">请输入邀请榜的活动规则</span>
      <v-editor ref="invEditor"></v-editor>
    </div>
    <div class="switch__box">
      <label class="leve3_title label__r12">排行榜</label>
      <el-switch
        v-model="topStatus"
        active-color="#FB3A32"
        inactive-color="#CECECE">
      </el-switch>
      <span class="leve3_title title--999">请输入打赏榜的活动规则</span>
      <v-editor ref="topEditor"></v-editor>
    </div>
  </div>
</template>

<script>
import VEditor from '@/components/Tinymce';
export default {
  name: "unitRank.vue",
  components: { VEditor },
  data() {
    return {
      invStatus: true,
      topStatus: true,
      invContent: ``,
      topContent: ``
    };
  }
};
</script>

<style scoped>

</style>
