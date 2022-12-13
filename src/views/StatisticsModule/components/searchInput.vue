<template>
  <div class="search-input">
    <VhallInput
      class="search-tag"
      :placeholder="placeholder"
      v-model="content"
      clearable
      v-clearEmoij
      @keyup.enter.native="changeInput"
    >
      <i class="el-icon-search el-input__icon" slot="prefix" @click="changeInput"></i>
    </VhallInput>
  </div>
</template>
<script>
  export default {
    name: 'searchInput',
    data() {
      return {
        content: ''
      };
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
            this.content = '';
          }
        },
        immediate: true
      }
    },
    computed: {
      placeholder() {
        let str = '';
        switch (this.searchType) {
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
            str = '请输入专题名称';
            break;
        }
        return str;
      }
    },
    methods: {
      changeInput() {
        this.$emit('changeContent', { data: { content: this.content } });
      }
    }
  };
</script>
<style lang="less">
  .search-input {
    /deep/.search-tag {
      width: 180px;
      /deep/.el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 50px !important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
</style>
