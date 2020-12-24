<template>
  <div class="tailorWrap">
    <header>
      <i class="el-icon-back" @click="$router.back()"></i>
      <span>回放剪辑台</span>
    </header>
    <div v-if="!recordId" class="time-box">
      <span class="time-label">选择回放时间</span>
      <el-date-picker
        v-model="timeVal"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-button @click="createRecord" size="small">确定</el-button>
    </div>
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
      :class="[recordId ? 'vh-video-tailoring__editwarp' : '']"
    ></videoTailoring>
    <el-dialog
      title="请输入视频名称"
      v-loading="editLoading"
      :visible.sync="titleDialogVisible"
      :close-on-click-modal="false"
      custom-class="save-title"
      center
      width="480px">
      <el-input placeholder="请输入标题" maxlength="100" :autosize="{ minRows: 3 }" resize=none show-word-limit v-model="titleEdit" class="input-with-select" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTitle" :disabled="editLoading" round size="medium">确 定</el-button>
        <el-button @click="titleDialogVisible = false" :disabled="editLoading" round size="medium">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import videoTailoring from '@/components/VideoTailoring';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data(){
    return {
      recordId: this.$route.query.recordId,
      webinar_id: this.$route.params.str,
      isNew: false,
      recordName: this.$route.query.recordName,
      saveParam: {},
      dataReady: false,
      titleDialogVisible: false,
      titleEdit: '',
      editLoading: false,
      roomInfo: {},
      isAdd: false, // 是否可添加视频裁剪 一般情况下为true，当在某个回放中点击裁剪时设置为false
      timeVal: [],
      chatSDK: null,
      msgInfo: {},
      handleMsgTimer: ''
    };
  },
  created() {
    if (this.$route.query.recordId) {
      this.getPlayBackInfo();
    } else {
      this.dataReady = true;
      this.getInitMsgInfo();
    }
  },
  beforeDestroy() {
    if (this.$PLAYER) {
      this.$PLAYER.destroy()
      this.$PLAYER = null
    }
    if (this.chatSDK) {
      this.chatSDK.destroy()
      this.chatSDK = null
    }
  },
  methods:{
    // 初始化消息
    getInitMsgInfo() {
      this.$fetch('msgInitConsole').then(res => {
        this.msgInfo = res.data;
        this.initChat(res.data);
      })
    },
    initChat (params) {
      let opt = {
        appId: params.paasAppId,
        accountId: params.accountId,
        channelId: params.channelId,
        token: params.paasAccessToken
      };
      VhallChat.createInstance(
        opt,
        chat => {
          // this.dataReady = true;
          this.chatSDK = chat.message;
          console.log('成功了居然', this.chatSDK)
          // TODO: 监听消息,判断 userId 获取playbackInfo
          // 自定义消息
          this.chatSDK.onCustomMsg(msg => {
            if (typeof msg !== 'object') {
              msg = JSON.parse(msg);
            }
            try {
              if (msg.data && typeof msg.data !== 'object') {
                msg.data = JSON.parse(msg.data);
              }
            } catch (e) {
              console.log(e);
            }

            Object.assign(msg, msg.data);
              console.log('==========自定义消息==========', msg)
            if (msg.type == "vod_cut_preview" && msg.user_id == sessionOrLocal.get('userId')) {
              console.log('回放生成了')
              // 消息会下发三次，只处理第一次
              if (!this.handleMsgTimer) {
                this.isNew = true;
                this.getPlayBackInfo(msg.data.paas_record_id, true, msg.data.paas_record_id);
                this.handleMsgTimer = setTimeout(() => {
                  this.handleMsgTimer = ''
                }, 2000)
              }
            }
          })
        },
        err => {
          console.error('聊天SDK实例化失败', err);
        }
      )
    },
    confirmTitle() {
      if (!this.titleEdit) {
        this.$message.warning('请输入视频名称');
        return false;
      }
      this.editLoading = true;
      const name = this.titleEdit;
      const param = this.saveParam;
      const cut_sections = param.cut_sections && JSON.parse(param.cut_sections);
      const point_sections = param.point_sections && JSON.parse(param.point_sections);
      // 将param作为参数请求保存接口
      const opts = {
        record_id: this.recordId,
        webinar_id: param.il_id,
        scene_type: param.cut_type,
        name: this.titleEdit,
        cut_sections: JSON.stringify(cut_sections),
        point_sections: JSON.stringify(point_sections)
      }
      console.log('==============', param)
      if (this.isNew) {
        opts.scene_type = 1
      }else {
        opts.record_id = this.recordId
      }
      this.$fetch('tailorSave', opts).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success('保存成功');
          this.recordId = res.data.record_id;
          this.isNew = false;
          this.recordName = this.titleEdit;
          this.getPlayBackInfo(res.data.record_id);
        } else {
          this.$message.success('保存失败');
        }
        this.editLoading = false;
        this.titleEdit = '';
        this.titleDialogVisible = false;
      })
    },
    createRecord() {
      if(!this.timeVal.length) {
        this.$message.warning('请选择时间');
        return false;
      } else {
        this.$fetch('createRecordinCtrl', {
          webinar_id: this.webinar_id,
          start_time: this.timeVal[0],
          end_time: this.timeVal[1],
          name: '111', // 无效名称，写死不影响
          type: 2
        }).then(res => {
          if (res.code == 200) {
            this.$message.success('视频生成中,请稍后...')
            this.editLoading = false;
            // this.getPlayBackInfo('', true);
          } else {
            this.$message.warning('生成失败');
            this.editLoading = false;
          }
        })
      }
    },
    getPlayBackInfo(recordId, isCreate, paasRecordId) {
      const opts = {
        webinar_id: this.webinar_id,
        type: 0
      }
      if (!isCreate) {
        opts.record_id = recordId || this.recordId
      } else {
        opts.type = 1;
        opts.paas_record_id = recordId
      }
      this.$fetch('playBackPreview', opts).then(res => {
        console.log(res)
        const data = res.data
        this.roomInfo = {
          app_id: data.paasAppId, // 应用 ID
          third_party_user_id: data.accountId, // 当前房间用户id
          paas_access_token: data.paasAccessToken, // pass 身份标识
          roomeId: data.doc.roomId, // 当前活动房间id
          record_id: paasRecordId || data.player.paasRecordId, // 当前活动回放的id
          webinar_id: this.webinar_id, // 当前活动id
          channel_id: data.doc.channelId, // 频道Id
          roleName: 2, // 角色名称 1主持人2观众3助理4嘉宾(此处回放+文档模式只能是已观众角色初始化)
          name: data.recordName,
          joinId: data.accountId,
        }
        this.dataReady = true;
      })
    },
    saveVideoHandler (param) {
      this.titleDialogVisible = true;
      this.saveParam = param;
    },
    exportVideoHandler (param) {
      const cut_sections = param.cut_sections && JSON.parse(param.cut_sections)
      const point_sections = param.point_sections && JSON.parse(param.point_sections)
      this.$fetch('tailorSave', {
        record_id: this.recordId,
        webinar_id: param.il_id,
        scene_type: param.cut_type,
        name: param.name,
        cut_sections: JSON.stringify(cut_sections),
        point_sections: JSON.stringify(point_sections)
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message.success('导出成功')
          this.isNew = false;
        } else {
          this.$message.success('导出失败')
        }
        this.$refs.videoTailoringComponent.cancelExportVideoFun()
      })
    },
    // isAdd 为false 没有该方法
    getVod(param) {},
    // isAdd 为false 没有该方法
    createVideo(datae) {},
    // isAdd 为false 没有该方法
    selectVideo() {},
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
      height: calc( 100vh - 140px);
      margin-top: 0px;
      margin-bottom: 0;
      border-radius: 0px;
      &.vh-video-tailoring__editwarp{
        height: calc( 100vh - 60px);
      }
      /deep/ .vh-video-tailoring__section{
        height: calc( 100% - 260px );
        background: #17171e;
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
    .time-box {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #17171e;
      border-bottom: 1px #000 solid;
      .time-label {
        color: #666666;
        font-size: 16px;
        display: inline-block;
        padding-right: 15px;
      }
      .el-date-editor {
        background: #fff;
      }
      .el-button {
        margin-left: 10px;
        padding: 7px 16px;
        height: 50px;
        border-radius: 25px;
        border-color: #666666;
        border-width: 2px;
        background: #17171e;
        width: 90px;
        font-size: 16px;
      }
      /deep/ .el-range-editor {
        border-radius: 25px;
        height: 50px;
        background: #17171e;
        border-color: #666666;
        border-width: 2px;
        width: 450px;
        .el-range-separator {
          color: #666666;
          line-height: 40px;
          font-size: 16px;
        }
        .el-range-input {
          background: #17171e;
          color: #666666;
          font-size: 16px;
          &::-webkit-input-placeholder {
            /* WebKit browsers */
            color: #666666;
          }
          &:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            color: #666666;
          }
          &::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            color: #666666;
          }
          &:-ms-input-placeholder {
            /* Internet Explorer 10+ */
            color: #666666;
          }
        }
        .el-range__icon {
          font-size: 20px;
          line-height: 40px;
          color: #666666;
        }
        .el-range__close-icon {
          font-size: 20px;
          line-height: 40px;
          color: #666666;
        }
      }
    }
    .save-title{
      margin-top: 34vh;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp {
      background-color: #000;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp.vh-video-tailoring__button-operation-warp-active .vh-video-select__button .el-button:hover{
      color: #FB3A32;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp .fr.el-button--default:hover{
      background: #FB3A32;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__control-warp {
      background-color: #17171e;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__control-warp {
      width: auto;
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__operation-warp {
      background: #000;
    }
    /deep/ .vh-video-tailoring__ruler ul li .vh-video-tailoring__scale-tip {
      background-color: #000;
    }
    /deep/ .vh-video-tailoring__cutting-warp .vh-video-tailoring__content {
      height: 60px;
    }
    /deep/ .vh-video-tailoring__cutting-warp .vh-video-tailoring__content .vh-video-tailoring__content-center {
      height: 52px;
    }
    /deep/ .vh-video-tailoring__cutting-warp .vh-video-tailoring__right-border .vh-video-tailoring__pull-right-warp {
      height: 60px;
      background-size: 100% 100%;
    }
    /deep/ .vh-video-tailoring__cutting-warp .vh-video-tailoring__left-border .vh-video-tailoring__pull-left-warp {
      height: 60px;
      background-size: 100% 100%;
    }
    /deep/ .vh-video-tailoring__video-duration-warp .vh-video-tailoring__bg-warp {
      height: 52px;
    }
    /deep/ #vh-player {
      height: 100%;
      #vh-video {
        background: #17171e;
      }
    }
  }
</style>
