<template>
   <div class="search-input">
     <VhallInput
        class="search-tag"
        :placeholder="placeholder"
        v-model="content"
        clearable
        v-clearEmoij
        @change="changeInput"
        @keyup.enter.native="changeInput">
        <i
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="changeInput">
        </i>
      </VhallInput>
   </div> 
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';

export default {
  name: "searchInput",
  data() {
    return {
      content: ''
    }
  },
  props: {
    searchType: {
      type: Number,
      defalut: 1 // // 1时间选择 2活动id 3活动名称 4专题id 5专题名称
    }
  },
  watch: {
    searchType: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.content = ''
        }
      },
      immediate: true
    }
  },
  computed: {
    placeholder() {
      let str = ''
      switch(this.searchType) {
        case 2:
          str = '请输入活动ID';
          break;
        case 3: 
          str = '请输入活动名称';
          break;
        case 4:
          str = '请输入专题ID';
          break;
        case 5:
          str = '请输入专题名称'
          break;
      }
      return str;
    }
  },
  mounted() {
    this.changeInput()
  },
  methods: {
    changeInput() {
      this.$emit('changeContent', {data: {content: this.content}})
      if (!this.content) return
      const userId = JSON.parse(sessionOrLocal.get('userId'));
      this.$vhall_paas_port({
        k: 100576,
        data: {business_uid: userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
    }
  }
}
</script>