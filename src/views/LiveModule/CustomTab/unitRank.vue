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
    </div>
    <tinymce v-model="invContent" :height="300" menubar='false' v-if="invStatus"/>
    <div class="switch__box">
      <label class="leve3_title label__r12">排行榜</label>
      <el-switch
        v-model="topStatus"
        active-color="#FB3A32"
        inactive-color="#CECECE">
      </el-switch>
      <span class="leve3_title title--999">请输入打赏榜的活动规则</span>
    </div>
    <tinymce v-model="topContent" :height="300" menubar='false' v-if="invStatus"/>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
export default {
  name: "unitRank.vue",
  components: { Tinymce },
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
