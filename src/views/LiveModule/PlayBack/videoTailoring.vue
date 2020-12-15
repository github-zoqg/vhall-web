<template>
  <div class="tailorWrap">
    <header>
      <i class="el-icon-back" @click="$router.back()"></i>
      <span>回放剪辑台</span>
      <div v-if="!recordId" class="time-box">
        <el-date-picker
          v-model="timeVal"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
        <el-button @click="createRecord" size="small">确定</el-button>
      </div>
    </header>
    <videoTailoring
      v-if="dataReady"
      ref="videoTailoringComponent"
      :roomInfo="roomInfo"
      :isAdd="isAdd"
      @saveVideo="saveVideoHandler"
      @exportVideo="exportVideoHandler"
      @getVod="getVod"
      @createVideo="createVideo"
      @selectVideo="selectVideo"
    ></videoTailoring>
    <el-dialog
      title="请输入生成视频名称"
      v-loading="editLoading"
      :visible.sync="titleDialogVisible"
      :close-on-click-modal="false"
      width="480px">
      <el-input placeholder="请输入标题" maxlength="30" :autosize="{ minRows: 1 }" resize=none show-word-limit v-model="titleEdit" class="input-with-select" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTitle" :disabled="editLoading" round size="medium">确 定</el-button>
        <el-button @click="titleDialogVisible = false" :disabled="editLoading" round size="medium">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import videoTailoring from '@/components/VideoTailoring';
export default {
  data(){
    return {
      recordId: this.$route.query.recordId,
      webinar_id: this.$route.params.str,
      recordName: this.$route.params.recordName,
      dataReady: true,
      titleDialogVisible: false,
      titleEdit: '',
      editLoading: false,
      roomInfo: {
        app_id: 'd317f559', // 应用 ID
        third_party_user_id: 10000127, // 当前房间用户id
        paas_access_token: 'access:d317f559:75107dced08acdb1', // pass 身份标识
        roomeId: "lss_706f5237", // 当前活动房间id
        record_id: "922013fa", // 当前活动回放的id
        webinar_id: "561752317", // 当前活动id
        roleName: 2, // 角色名称 1主持人2观众3助理4嘉宾(此处回放+文档模式只能是已观众角色初始化)
        channel_id: 'ch_1a348b67', // 频道Id
        name: '回访名称1',
        joinId: 287484
      },
      isAdd: true, // 是否可添加视频裁剪 一般情况下为true，当在某个回放中点击裁剪时设置为false
      timeVal: []
    };
  },
  created() {
    // this.getPlayBackInfo()
  },
  methods:{
    confirmTitle() {
      if (!this.titleEdit) {
        this.$message.warning('请输入视频名称');
        return false;
      }
      this.editLoading = true;
      const name = this.titleEdit;
      const start_time = this.$moment(this.timeVal[0]).format('YYYY-MM-DD hh:mm:ss');
      const end_time = this.$moment(this.timeVal[1]).format('YYYY-MM-DD hh:mm:ss');
      this.$fetch('createRecord', {
        webinar_id: this.webinar_id,
        start_time,
        end_time,
        name,
        type: 1
      }).then(res => {
        if (res.code == 200) {
          this.getPlayBackInfo(res.data.record_id);
        } else {
          this.$message.warning('生成失败');
          this.titleDialogVisible = false;
          this.editLoading = false;
        }
      })
    },
    createRecord() {
      if(!this.timeVal.length) {
        this.$message.warning('请选择时间');
        return false;
      } else {
        this.titleDialogVisible = true;
      }
    },
    getPlayBackInfo(recordId) {
      this.$fetch('playBackPreview', {
        webinar_id: this.webinar_id,
        record_id: recordId || this.recordId,
        type: 0
      }).then(res => {
        console.log(res)
        const data = res.data
        this.roomInfo = {
          app_id: 'd317f559', // 应用 ID
          third_party_user_id: 10000127, // 当前房间用户id
          paas_access_token: 'access:d317f559:75107dced08acdb1', // pass 身份标识
          roomeId: "lss_706f5237", // 当前活动房间id
          record_id: "922013fa", // 当前活动回放的id
          webinar_id: "561752317", // 当前活动id
          roleName: 2, // 角色名称 1主持人2观众3助理4嘉宾(此处回放+文档模式只能是已观众角色初始化)
          channel_id: 'ch_1a348b67', // 频道Id
          name: '回访名称1',
          joinId: 287484
        }
        this.roomInfo.app_id = data.paasAppId
        this.roomInfo.third_party_user_id = data.accountId
        this.roomInfo.paas_access_token = data.paasAccessToken
        this.roomInfo.roomeId = data.doc.roomId
        this.roomInfo.record_id = this.recordId
        this.roomInfo.webinar_id = this.webinar_id
        this.roomInfo.channel_id = data.doc.channelId
        this.roomInfo.name = this.recordName
        this.showDoc = true
        this.dataReady = true
      })
    },
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
      const cut_sections = param.cut_sections && JSON.parse(param.cut_sections)
      const point_sections = param.point_sections && JSON.parse(param.point_sections)
      console.log(cut_sections, point_sections)
      // 将param作为参数请求保存接口
      this.$fetch('tailorSave', {
        record_id: param.record_id,
        webinar_id: param.il_id,
        cut_type: param.cut_type,
        name: param.name,
        cut_sections,
        point_sections
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message.success('保存成功')
          this.getPlayBackInfo(res.data.record_id)
        }
      })
    },
    exportVideoHandler (param) {
      console.log(param)
      const cut_sections = param.cut_sections && JSON.parse(param.cut_sections)
      const point_sections = param.point_sections && JSON.parse(param.point_sections)
      this.$fetch('tailorSave', {
        record_id: param.record_id,
        webinar_id: param.il_id,
        cut_type: param.cut_type,
        name: param.name,
        cut_sections,
        point_sections
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message.success('导出成功')
        } else {
          this.$message.success('导出失败')
        }
        this.$refs.videoTailoringComponent.cancelExportVideoFun()
      })
    }
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
      position: relative;
      i{
        float: left;
        cursor: pointer;
      }
      .time-box {
        position: absolute;
        top: 12px;
        right: 80px;
        display: flex;
        align-items: center;
        .el-date-editor {
          background: #fff;
        }
        .el-button {
          margin-left: 10px;
          padding: 7px 16px;
        }
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
