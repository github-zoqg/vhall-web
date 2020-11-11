<template>
  <div>
    <pageTitle title="章节打点"></pageTitle>
    <div class="contentView">
      <div class="playerBox">
        <player v-bind="playerProps"></player>
      </div>
      <div class="docBox">
        <doc
          ref="doc"
          webinarId="561752317"
          docPermissionId="no"
          :roleName="2"
          :roomId="playerProps.roomId"
          :channelId="playerProps.channel_id"
          :appId="playerProps.appId"
          :token="playerProps.token"
          :liveStatus="2"
          :accountId="playerProps.accountId"
          :isVod="true"
        ></doc>
        <div class="actionBar">

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import pageTitle from '../components/pageTitle';
import player from '@/components/Player';
import doc from '@/components/Doc';
export default {
  data(){
    return {
      playerProps: {
        accountId: 16422750,
        nickName: '123',
        appId: 'fd8d3653',
        token: 'access:fd8d3653:a926c581feae0266',
        type: 'vod',
        roomId: 'lss_8018578c',
        channel_id: 'ch_93f8b149',
        vodOption: {
          recordId: '6a9fb155'
        }
      }
    };
  },
  created(){
    this.$EventBus.$on('component_docSDK_ready', docsdk=>{
      console.log('component_docSDK_ready', docsdk);
    });
  },
  components: {
    pageTitle,
    player,
    doc
  }
};
</script>

<style lang="less" scoped>
  .contentView{
    padding: 24px;
    background: #222222;
    display: flex;
    justify-content: space-between;
    >div{
      flex: 1;
    }
    .docBox{
      display: flex;
      flex-direction: column;
    }
    .actionBar{
      height: 48px;
      background: #000;
    }
    /deep/ .vh-doc__wrap{
      background-color: #666;
    }
  }
</style>
