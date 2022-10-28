<template>
  <div class="tailorWrap">
    <header>
      <div class="leftBox">
        <i class="el-icon-back" @click="$router.back()"></i>
        <span>回放剪辑台</span>
      </div>

      <div v-if="!recordId" class="time-box">
        <div class="rightBox">
          <span class="time-label">选择回放时间</span>
          <el-date-picker
            v-model="timeVal"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            prefix-icon="iconfont-v3 saasicon_date"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button @click="createRecord" size="small">确定</el-button>
        </div>
      </div>
    </header>
    <videoTailoring
      v-if="dataReady"
      ref="videoTailoringComponent"
      :roomInfo="roomInfo"
      :playerParams="playerParams"
      :isAdd="isAdd"
      @saveVideo="saveVideoHandler"
      @exportVideo="exportVideoHandler"
      @getVod="getVod"
      @createVideo="createVideo"
      @selectVideo="selectVideo"
      :class="[recordId ? 'vh-video-tailoring__editwarp' : '']"
    ></videoTailoring>
    <el-dialog
      title="视频标题"
      v-loading="editLoading"
      :visible.sync="titleDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      custom-class="save-title"
      :before-close="resetTitleValue"
      width="483px">
      <VhallInput
        placeholder="请输入视频标题"
        :maxlength="100"
        autocomplete="off"
        show-word-limit
        v-model="titleEdit"
        type="textarea"
        v-clearEmoij
        resize=none
      ></VhallInput>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTitle" :disabled="editLoading" round size="medium">确 定</el-button>
        <el-button @click="handleCancle" :disabled="editLoading" round size="medium">取 消</el-button>
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
      userId: JSON.parse(sessionOrLocal.get("userId")),
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
      handleMsgTimer: '',
      isChange: false,
      playerParams: {},
      createRecordMsg: null
    };
  },
  watch: {
    timeVal: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.isChange = true
        }
      }
    }
  },
  created() {
    // 回放列表剪辑
    if (this.$route.query.recordId && this.$route.query.isRecordVideo != 1) {
      this.createRecordMsg = this.$message({
        message: `视频获取中,请稍侯...`,
        showClose: true,
        duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
      this.getPlayBackInfo();
    } else if(this.$route.query.switch_id) {
      // 回放录制剪辑
      this.dataReady = true;
      this.getInitMsgInfo();
      this.getTime();
    } else {
      // 创建回放剪辑
      this.dataReady = true;
      this.getInitMsgInfo();
      this.getDefaultTime();
    }
    // 监听事件点的变化
    this.$EventBus.$on('eventPointListChange', eventPointList => {
      this.isChange = true
    });
    // 监听剪辑事件
    this.$EventBus.$on('cutTimeListChange', eventPointList => {
      this.isChange = true
    });
    // window.onbeforeunload = function(){
    //   return '关闭提示';
    // }
  },
  beforeRouteLeave(to, from, next) {
    // 离开页面前判断信息是否修改
    if (!this.isChange) {
      next()
      return false;
    } else {
      this.$confirm('是否放弃当前编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        next()
      }).catch(() => {});
    }
  },
  beforeDestroy() {
    if (this.$PLAYER) {
      this.$PLAYER.destroy();
      this.$PLAYER = null;
    }
    if (this.chatSDK) {
      this.chatSDK.destroy();
      this.chatSDK = null;
    }
  },
  methods:{
    getDefaultTime() {
      this.$fetch('getDefaultStartTime', {
        webinar_id: this.webinar_id
      }).then(res => {
        this.timeVal = [res.data.start_time, res.data.end_time];
      })
    },
    handleCancle() {
      this.titleDialogVisible = false
      this.titleEdit = ''
    },
    resetTitleValue(done) {
      this.titleEdit = ''
      done()
    },
    // 传 sid 的时候，需要查询回放的起止时间，回显
    getTime() {
      this.$fetch('getWebinarSwitchList', {
        webinar_id: this.webinar_id,
        switch_id: this.$route.query.switch_id
      }).then(res => {
        console.log(res.data);
        this.timeVal = [res.data.switch_list[0].start_time, res.data.switch_list[0].end_time]
        this.createRecord()
      })
    },
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
            if (msg.type == "vod_cut_preview" && msg.user_id == this.userId) {
              console.log('回放生成了')
              // 消息会下发三次，只处理第一次
              if (!this.handleMsgTimer) {
                this.isNew = true;
                this.getPlayBackInfo(msg.data.paas_record_id, true, msg.data.paas_record_id);
                this.createRecordMsg.close()
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
        scene_type: 0,
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
      // 如果 isNew 并且是录制裁剪，来源类型应该是 录制
      if (this.$route.query.switch_id && this.isNew) {
        opts.source = 1
      }
      this.$fetch('tailorSave', opts).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message({
            message: `保存成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.recordId = res.data.record_id;
          this._tryCount = 0
          this.getRecordInfo(this.recordId).then(res => {
            // 保存需要重置 isNew 的状态，导出不需要
            this.isNew = false;
            this.recordName = this.titleEdit;
            this.getPlayBackInfo(res.data.record_id);
          })
        }
        this.editLoading = false;
        this.titleEdit = '';
        this.titleDialogVisible = false;
      }).catch(err=> {
        if (err.code == '12909') {
          this.$message({
            message: `被剪切的视频片段不能小于10秒`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.$message({
            message: err.msg || `保存失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
        this.editLoading = false;
        this.titleEdit = '';
        this.titleDialogVisible = false;
      })
    },
    createRecord() {
      if(new Date(this.timeVal[1]) - new Date(this.timeVal[0]) > 7*24*60*60*1000) {
        this.$message({
          message:  '所选时间范围不能超过7天',
          showClose: true, // 是否展示关闭按钮
          type: 'error', //  提示类型
          customClass: 'zdy-info-box' // 样式处理
        });
        return false;
      }
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
            if (res.data.status == 0) {
              // 点击创建，如果 status===0 视频未生成，等消息
              this.createRecordMsg = this.$message({
                message: `视频生成中,请稍侯...`,
                showClose: true,
                duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
            } else if (res.data.status == 1) {
              // 点击创建，如果 status===1 视频已生成，直接初始化剪辑台
              this.isNew = true
              this.getPlayBackInfo(res.data.pass_record_id, true, res.data.pass_record_id)
            }
            this.editLoading = false;
          } else {
            this.$message.warning(res.msg);
            this.editLoading = false;
          }
        }).catch(err => {
          console.log('catch++++++++++++++++++++++++++++')
          this.$message({
              message: err.msg,
              showClose: true, // 是否展示关闭按钮
              type: 'error', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
          // if (err.code == 512005) {
          //   this.$message({
          //     message:  '所选时间范围内没有搜索到回放视频',
          //     showClose: true, // 是否展示关闭按钮
          //     type: 'error', //  提示类型
          //     customClass: 'zdy-info-box' // 样式处理
          //   });
          // } else if (err.code == 512908) {
          //   this.$message({
          //     message:  '所选时间范围不能超过7天',
          //     showClose: true, // 是否展示关闭按钮
          //     type: 'error', //  提示类型
          //     customClass: 'zdy-info-box' // 样式处理
          //   });
          // }
        })
      }
    },
    getPlayBackInfo(recordId, isCreate, paasRecordId) {
      !isCreate && (this.dataReady = false)
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
        this.createRecordMsg && this.createRecordMsg.close()
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
        this.playerParams.otherOption = {
          vid: res.data.report_data.vid, // hostId
          vfid: res.data.report_data.vfid,
          guid: res.data.report_data.guid,
          biz_id: this.webinar_id
        }
        this.playerParams.otherOption.report_extra = res.data.report_data.report_extra
        this.dataReady = true;
      })
    },
    // 每隔1s查询一次info接口，如果点播文件转码完成，开始播放
    getRecordInfo(recordId) {
      this._tryCount++
      return new Promise((resolve, reject) => {
        this.$fetch('recordInfo', {
          record_id: recordId
        }).then(res => {
          if (res.code == 200 && res.data.transcode_status == 1) {
            resolve(res)
          } else {
            if (this._tryCount > 15) {
              return reject('timeout')
            }
            setTimeout(() => {
              this.getRecordInfo(recordId).then(resolve).catch(reject)
            }, 1000)
          }
        })
      })
    },
    saveVideoHandler (param) {
      this.$vhall_paas_port({
        k: this.recordId ? 100412 : 100405,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.webinar_id, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.titleDialogVisible = true;
      this.saveParam = param;
    },
    exportVideoHandler (param) {
      const cut_sections = param.cut_sections && JSON.parse(param.cut_sections)
      const point_sections = param.point_sections && JSON.parse(param.point_sections)

      const opts = {
        record_id: this.recordId,
        webinar_id: param.il_id,
        scene_type: 0,
        name: param.name,
        cut_sections: JSON.stringify(cut_sections),
        point_sections: JSON.stringify(point_sections)
      }
      if (this.isNew) {
        opts.scene_type = 1
      }else {
        opts.record_id = this.recordId
      }
      // 如果 isNew 并且是录制裁剪，来源类型应该是 录制
      if (this.$route.query.switch_id && this.isNew) {
        opts.source = 1
      }

      this.$fetch('tailorSave', opts).then(res => {
        console.log(res)
        this.$message({
          message: `导出成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$refs.videoTailoringComponent.cancelExportVideoFun()
      }).catch(err => {
        if (err.code == '12909') {
          this.$message({
            message: `被剪切的视频片段不能小于10秒`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.$message({
            message: err.msg || `导出失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
        this.editLoading = false;
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
    height: 100%;
    overflow: hidden;
    /deep/ .save-title{
      // margin-top: 18%!important;
      .el-dialog__title {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        color: #1a1a1a;
      }
      .el-dialog__body{
        .el-input__inner{
          padding-right: 66px;
        }
      }
      .el-textarea__inner {
        color: #1a1a1a;
        height: 96px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .el-button--default {
        margin-left: 12px;
      }
    }
    .vh-video-tailoring__warp{
      width: 100%;
      height: calc( 100vh - 63px);
      margin-top: 0px;
      margin-bottom: 0;
      border-radius: 0px;
      &.vh-video-tailoring__editwarp{
        height: calc( 100vh - 60px);
      }
    }
    header{
      background: #222;
      color: #ffffff;
      font-size: 16px;
      line-height: 16px;
      // text-align: center;
      // width: 1366px;
      margin: 0 auto;
      position: relative;
      height: 64px;
      .leftBox {
        position: absolute;
        top: 34px;
        left: 24px;
      }
      i{
        float: left;
        cursor: pointer;
        padding-right: 10px;
      }
    }
    .time-box {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #222222;
      .rightBox {
        padding-top: 10px;
      }
      .time-label {
        color: #999999;
        font-size: 14px;
        display: inline-block;
        padding-right: 15px;
      }
      .el-date-editor {
        background: #fff;
      }
      .el-button {
        margin-left: 10px;
        padding: 7px 16px;
        height: 36px;
        border-radius: 25px;
        border-color: #666666;
        border-width: 1px;
        background: transparent;
        width: 72px;
        font-size: 14px;
        color: #999999;
      }
      /deep/ .el-range-editor {
        border-radius: 25px;
        height: 36px;
        background: transparent;
        border-color: #666666;
        border-width: 1px;
        width: 382px;
        .el-range-separator {
          color: #999999;
          line-height: 26px;
          font-size: 14px;
        }
        .el-range-input {
          background: transparent;
          color: #666666;
          line-height: 26px;
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
          font-size: 14px;
          line-height: 29px;
          color: #666666;
        }
        .el-range__close-icon {
          font-size: 14px;
          line-height: 28px;
          color: #666666;
        }
      }
    }
    /deep/ .vh-video-tailoring__tailoring-warp .vh-video-tailoring__button-operation-warp {
      background-color: #000;
    }
    /deep/ .vh-video-tailoring__ruler ul li .vh-video-tailoring__scale-tip {
      background-color: #000;
    }
    /deep/ .vh-video-tailoring__video-duration-warp .vh-video-tailoring__bg-warp {
      height: 80px;
    }
    /deep/ #vh-player {
      height: 100%;
      #vh-video {
        background: #292929;
      }
    }
  }
</style>
