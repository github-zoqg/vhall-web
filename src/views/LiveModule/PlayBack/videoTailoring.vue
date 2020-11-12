<template>
  <div class="tailorWrap">
    <header><i class="el-icon-back" @click="$router.back()"></i> 回放剪辑台</header>
    <videoTailoring
      ref="videoTailoringComponent"
      :roomInfo="roomInfo"
      :isAdd="isAdd"
      @saveVideo="saveVideoHandler"
      @getVod="getVod"
      @createVideo="createVideo"
      @selectVideo="selectVideo"></videoTailoring>
  </div>
</template>

<script>
import videoTailoring from '@/components/VideoTailoring';
export default {
  data(){
    return {
      roomInfo: {
        app_id: 'fd8d3653', // 应用 ID
        third_party_user_id: 16422750, // 当前房间用户id
        paas_access_token: 'access:fd8d3653:d69341221dc5ed18', // pass 身份标识
        roomeId: "lss_8018578c", // 当前活动房间id
        room_id: "lss_8018578c",
        record_id: "6a9fb155", // 当前活动回放的id
        webinar_id: "561752317", // 当前活动id
        roleName: 2, // 角色名称 1主持人2观众3助理4嘉宾(此处回放+文档模式只能是已观众角色初始化)
        channel_id: 'ch_93f8b149', // 频道Id
        name: '回访名称',
        joinId: 287484
      },
      isAdd: true // 是否可添加视频裁剪 一般情况下为true，当在某个回放中点击裁剪时设置为false
    };
  },
  methods:{
    // isAdd 为false 没有该方法
    getVod(param) {
      // 获取点播视频
        let data = [{
          name: '', //回放文件名
          duration: '', //回放时长
          created_at: '', //回放的生成时间
          room_id: '', //房间ID：内部ID
          record_id: '', //回放的视频文件ID
          channel_id: '', //活动频道ID
          webinar_id: '', //回放活动/房间ID
          id: '', //点播ID
          app_id: '', //APP_ID
          account_id: '', //用户ID
          paas_access_token: '' //回放的	PAAS_ACCESS_TOKEN
        }];
        console.log(param);
      // 将获取的列表，通过该方法传给视频裁剪组件
      this.$refs.videoTailoringComponent.bindDataList(data);
    },
    // isAdd 为false 没有该方法
    createVideo(datae) {
      // 生成的视频
        let data = [{
          name: '', //回放文件名
          duration: '', //回放时长
          channel_id: '', //活动频道ID
          id: '', //点播ID
        }];
        console.log('createVideo', datae);
      // 将生成的视频通过该方法传给视频裁剪组件
      this.$refs.videoTailoringComponent.pushDataList(data);
    },
    // isAdd 为false 没有该方法
    selectVideo() {
      // 选定要裁剪的视频，将选择的视频信息赋值给roomInfo即可，组件根据roomInfo.record_id改变而重新渲染视频及裁剪组件 id
        // this.roomInfo.room_id = room_id
        // this.roomInfo.record_id = vod_id
        // this.roomInfo.channel_id = channel_id
        // this.roomInfo.webinar_id = il_id
        // this.roomInfo.id = id
        // this.roomInfo.name = name
        // this.roomInfo.app_id = app_id
        // this.roomInfo.third_party_user_id = account_id
        // this.roomInfo.paas_access_token = data.access_token
    },
    saveVideoHandler (param) {
      console.log('saveVideoHandler', param);
      // 将param作为参数请求保存接口
    },
    // exportVideo (param) {
    //   // 将param作为参数请求导出接口,并将返回的视频信息赋值给roomInfo即可，同选择裁剪视频逻辑
    //     this.roomInfo.room_id = room_id
    //     this.roomInfo.record_id = vod_id
    //     this.roomInfo.channel_id = channel_id
    //     this.roomInfo.webinar_id = il_id
    //     this.roomInfo.id = id
    //     this.roomInfo.name = name
    //     this.roomInfo.app_id = app_id
    //     this.roomInfo.third_party_user_id = account_id
    //     this.roomInfo.paas_access_token = data.access_token
    //   // 信息更新完毕后，调取下面方法将导出裁剪视频弹窗关闭
    //   this.$refs.videoTailoringComponent.cancelExportVideoFun()
    // }
  },
  components: {
    videoTailoring
  }
};
</script>

<style lang="less" scoped>
  .tailorWrap{
    /deep/ .vh-video-tailoring__warp .vh-video-tailoring__section .vh-video-tailoring__media-wrap{
      width: 100%;
      height: calc( 100% - 50px );
    }
    /deep/ .vh-video-tailoring__warp .vh-video-tailoring__section .vh-video-tailoring__media-wrap .vh-video-tailoring__doc-warp, /deep/ .vh-video-tailoring__warp .vh-video-tailoring__section .vh-video-tailoring__media-wrap .vh-video-tailoring__play{
      width: 49%;
      height: 100%;
    }
    .vh-video-tailoring__warp{
      width: 100%;
      height: calc( 100vh - 60px);
      margin-top: 0px;
      margin-bottom: 0;
      /deep/ .vh-video-tailoring__section{
        height: calc( 100% - 260px );
      }
      /deep/ .vh-video-tailoring__effective-zone .vh-video-tailoring__content{
        background-color: #FB3A32;
      }
      /deep/ .vh-video-tailoring__cutting-warp .vh-video-tailoring__content{
        border: 1px solid #FB3A32;
      }
    }
    header{
      background: #FB3A32;
      color: #ffffff;
      font-size: 20px;
      text-align: center;
      // width: 1366px;
      margin: 0 auto;
      padding: 20px 25px;
      i{
        float: left;
        cursor: pointer;
      }
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp.vh-video-tailoring__button-operation-warp-active .vh-video-select__button .el-button:hover{
      color: #FB3A32;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp .fr.el-button--default:hover{
      background: #FB3A32;
    }
  }
</style>
