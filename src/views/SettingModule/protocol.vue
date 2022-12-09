<template>
  <div class="set_protocol">
    <pageTitle pageTitle="观看协议"></pageTitle>
    <div class="set_protocol_container">
      <viewing-protocol ref="viewingProtocolComp" type="0" :brandConfig="true"></viewing-protocol>
    </div>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import ViewingProtocol from '../LiveModule/components/viewingProtocol';
  export default {
    components: {
      PageTitle,
      ViewingProtocol
    }
  };
</script>
<style lang="less" scoped>
  .set_protocol {
    &_container {
      background: #fff;
    }
  }
</style>
