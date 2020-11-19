<template>
  <div class="chat__emoji-tab" v-show="isShow">
    <img
      width="24"
      height="24"
      :src="item.src"
      @click="selectEmoji(item)"
      v-for="item in emojiList"
      :key="item.value"
    />
  </div>
</template>
<script>
import { getEmojiList } from './js/emoji';
export default {
  data () {
    return {
      isShow: false,
      emojiList: []
    };
  },
  created () {
    this.emojiList = getEmojiList();
  },
  mounted () {
    document.addEventListener('click', ()=> {
      this.isShow = false;
    });
  },
  methods: {
    toggleShow () {
      this.isShow = !this.isShow;
    },
    selectEmoji (item) {
      this.$emit('emojiInput', item.name);
    }
  }
};
</script>
<style lang="less">
.chat__emoji-tab {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  background: #f7f7f7;
  padding: 2px;
  border: 1px #afafaf solid;
  & > img {
    display: block;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      border: 1px #0066cc solid;
    }
  }
}
</style>
