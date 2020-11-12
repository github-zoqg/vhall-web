<template>
  <div class="wraper">
    <el-container class="inner">
      <span class="close" @click="$emit('close')">&times;</span>
      <el-aside width="500px">
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
      </el-aside>
      <el-container>
        <el-header height='114px'>
          <player ref="player" v-bind="playerProps" nodeId='previewPlayer'></player>
        </el-header>
        <el-main>
          <div class="tab">
            <span>章节</span>
          </div>
          <ul class="chapterList">
            <li v-for="(item, index) in chapters" :key="index">
              <span class="title">{{index+1}}. {{item.subject}}</span>
              <span>{{item.times}}</span>
            </li>
          </ul>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import player from '@/components/Player';
import doc from '@/components/Doc';
export default {
  data(){
    return {
      playerProps: {
        accountId: 16422750,
        nickName: '123',
        appId: 'fd8d3653',
        token: 'access:fd8d3653:24845ebe5972cc7e',
        type: 'vod',
        roomId: 'lss_8018578c',
        channel_id: 'ch_93f8b149',
        openPlayerUI: false,
        vodOption: {
          recordId: '6a9fb155'
        },
      },
    };
  },
  props: {
    chapters: {
      type: Array,
      default: ()=> []
    }
  },
  components: {
    player,
    doc,
  }
};
</script>

<style lang="less" scoped>
  .wraper{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    z-index: 10;
    .inner{
      padding: 16px;
      width: 740px;
      height: 460px;
      background: #222;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      .close{
        color: #FFFFFF;
        position: absolute;
        right: 0;
        top: -30px;
        font-size: 25px;
        cursor: pointer;
      }
      .el-aside{
        background: #000000;
        padding: 0;
      }
      .el-header{
        background: cadetblue;
        padding: 0;
      }
      .el-main{
        padding: 0;
      }
      .tab{
        height: 32px;
        box-shadow: 0px 1px 0px 0px #1A1A1A;
        text-align: center;
        line-height: 32px;
        span{
          color: #fff;
          border-bottom: 1px solid #fff;
          padding-bottom: 6px;
          font-size: 14px;
        }
      }
      .chapterList{
        li{
          color: #CCCCCC;
          font-size: 12px;
          height: 32px;
          line-height: 32px;
          padding-left: 8px;
          cursor: pointer;
          transition: all .1s linear;
          &:hover{
            background: #333333;
            color: #FB3A32;
          }
        }
        span{

        }
        .title{
          display: inline-block;
          vertical-align: middle;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
