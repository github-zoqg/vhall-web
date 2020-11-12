<template>
  <div class="wraper">
    <el-container class="inner">
      <span class="close" @click="$emit('close')">&times;</span>
      <el-aside width="500px">
        <div id="previewDocBox"></div>
        <!-- <doc
          ref="doc"
          webinarId="561752317"
          docPermissionId="no"
          :isInteract="true"
          :roleType="2"
          :roomId="playerProps.roomId"
          :channelId="playerProps.channel_id"
          :appId="playerProps.appId"
          :token="playerProps.token"
          :liveStatus="2"
          :joinId="287484"
          :accountId="playerProps.accountId"
          :isVod="true"
        ></doc> -->
      </el-aside>
      <el-container>
        <el-header height='114px'>
          <player ref="player" v-bind="playerProps" nodeId='previewPlayer' :openPlayerUI="false"></player>
        </el-header>
        <el-main>
          <div class="tab">
            <span>章节</span>
          </div>
          <ul class="chapterList">
            <li v-for="(item, index) in chapters" @click="chapterHandler(index)" :key="index">
              <span class="title">{{index+1}}. {{item.subject}}</span>
              <span class="times">{{item.times | secondsFormmat}}</span>
            </li>
          </ul>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import player from '@/components/Player_1';
// import doc from '@/components/Doc/watch-doc';
export default {
  data(){
    return {
    };
  },
  props: {
    chapters: {
      type: Array,
      default: ()=> []
    },
    playerProps: {
      type: Object,
    },
    docSdk: {
      type: Object
    }
  },
  mounted(){
    console.log(this.$refs.previewDocBox);
    // document.getElementById('previewDocBox').append(document.querySelector('.vhall-watch-doc').cloneNode());
    this.docSdk.createDocument({elId: 'previewDocBox', width: 500, height: 420, docId:'b1ef443f'}).then(elId=>{
      console.log('createDocument successfully', elId);
      this.docSdk.loadDoc({docId: 'b1ef443f', id: 'previewDocBox', docType:2}).then(res=>{
        console.log('background: #666; color: #fff','%c预览文档信息：', res);
      });
    }).catch(error=>{
      this.$message.error(`文档创建失败,${error.message}`);
      console.log(error);
    });
  },
  methods: {
    chapterHandler(index){
      let opts = {
        id: 'previewDocBox', // 容器id， 必填
        page: Number(this.chapters[index].pageNum) // 跳转到某页，数字，必填
      };
      this.docSdk.gotoPage(opts);
      this.$refs.player.$PLAYER.setCurrentTime(this.chapters[index].times);
    }
  },
  filters:{
    secondsFormmat(val){
      val = parseInt(val);
      if(isNaN(val)) return val;
      const hours = parseInt(val/3600);
      const minutes = parseInt(val/60) - (hours*60);
      const seconds = val % 60;
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
  },
  components: {
    player,
    // doc,
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
    z-index: 22;
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
        .times,.title{
          display: inline-block;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .times{
          width: 50px;
        }
      }
    }
  }
</style>
