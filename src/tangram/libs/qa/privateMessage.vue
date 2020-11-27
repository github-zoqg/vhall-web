<template>
  <div class="qa-item">
    <p v-if="msg.context.to == joinId" class="userinfo">
      <a
        class="meto"
        href="javascript:;"
        :title="msg.context.user_name"
        @click="atHost({name:msg.context.user_name,joinId:msg.sender_id})"
      >{{msg.context.user_name}}</a>对我说
    </p>
    <p v-else class="userinfo">
      我对
      <a
        class="tome"
        href="javascript:;"
        :title="msg.context.user_name"
        @click="atHost({name:msg.context.user_name,joinId:msg.context.sender_id})"
      >{{msg.context.user_name}}</a>说
    </p>
    <p class="content" v-html="msg.data"></p>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      required: true,
      default: {}
    },
    atHost: {
      required: true,
      default: () => {}
    },
    joinId: {
      required: true
    }
  }
};
</script>
<style lang="less" scoped>
.qa-item {
  text-align: left;
  padding: 10px 22px;
  border-bottom: 1px solid #38383b;
  font-family: '微软雅黑';
  & > p.userinfo {
    line-height: 18px;
    font-size: 14px;
    color: #6f6e6e;
    text-align: left;
    & > a {
      color: #2e8eff;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
      & > .meto {
        color: #ffffff;
      }
    }
  }
  & > p.content {
    line-height: 18px;
    font-size: 14px;
    color: #cbc9ca;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
