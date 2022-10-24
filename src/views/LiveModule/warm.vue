<template>
  <div class="wramUp-wrap">
    <pageTitle pageTitle="暖场视频">
      <template  slot="default">
        <div class="switch__box">
          <el-switch
            v-model="warmForm.warmFlag"
            @change="openCloseWarm"
            :active-text="warmForm.warmFlag ? '已开启，预告状态观看端显示暖场视频': '开启后，预告状态观看端显示暖场视频'">
          </el-switch>
        </div>
      </template>
    </pageTitle>
    <div class="content">
      <el-form :model="warmForm" ref="warmForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="视频封面">
          <span style="color:#999">设置暖场封面后，预告状态将会使用该封面</span>
          <upload
            class="upload__avatar"
            id="warm_pc_cropper"
            v-model="warmForm.imageUrl"
            :domain_url="domainUrl"
            :saveData="{
              path: 'users/logo-imgs',
              type: 'image',
            }"
            :disabled='!warmForm.warmFlag'
            :on-success="handleUploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="warmForm.warmFlag && deleteImg()">
            <div slot="tip">
              <p>建议尺寸：1280*720px，小于4M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
          <div class="image_cropper">
            <div class="image_cropper_item">
              <span>模糊程度</span>
              <vh-slider v-model="warmForm.blurryDegree" :max="10" :disabled="!warmForm.imageUrl"  style="width:540px"></vh-slider>
              <span class="wid_block">{{warmForm.blurryDegree}}</span>
            </div>
            <div class="image_cropper_item">
              <span>背景亮度</span>
              <vh-slider v-model="warmForm.lightDegree" :max="20" :disabled="!warmForm.imageUrl"  style="width:540px"></vh-slider>
              <span class="wid_block">{{ warmForm.lightDegree}}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="播放模式" required  prop="playType">
           <el-radio-group v-model="warmForm.playType">
              <el-radio :label="1">单次播放</el-radio>
              <el-radio :label="2">循环播放</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="选择视频" required prop="selectedList">
          <span class="add_video" @click="warmForm.warmFlag && changeVideo()">
           <i class="iconfont-v3 saasline-plus"></i>
           添加视频
          </span>
           <el-tooltip v-tooltipMove>
            <div slot="content">
              1.视频仅支持MP4格式，转码成功后文件大小不超过500M<br/>
              2.上传视频标题不能带有特殊字符和空格，需转码完成才能预览和观看<br/>
              3.点播、音频直播不支持暖场视频<br/>
              4.最多支持添加10个暖场视频
            </div>
            <i class="iconfont-v3 saasicon_help_m tip"></i>
          </el-tooltip>
          <div class="vh-sort-tables" v-show="warmForm.selectedList.length">
            <div class="vh-sort-tables__theader">
              <div class="vh-sort-tables__theader-id">
                序号
              </div>
              <div class="vh-sort-tables__theader-title">
                视频名称
              </div>
              <div class="vh-sort-tables__theader-date">
                上传日期
              </div>
              <div class="vh-sort-tables__theader-hots">
                时长
              </div>
              <div class="vh-sort-tables__theader-status">
                转码后大小
              </div>
              <div class="vh-sort-tables__theader-editor">
                操作
              </div>
            </div>
             <div class="vh-sort-tables__tbody">
                <draggable
                :list="warmForm.selectedList"
                chosenClass="vh-sort-tables__tbody-selected"
                >
                  <div
                  class="vh-sort-tables__tbody-tr"
                  v-for="(item, index) in warmForm.selectedList"
                  :key="index"
                  >
                    <div class="vh-sort-tables__tbody-id">
                      {{ index + 1 }}
                    </div>
                    <el-tooltip placement="top" effect="dark" v-tooltipMove>
                      <div slot="content">{{ item.record_name || item.name }}</div>
                      <div class="vh-sort-tables__tbody-title" @click.stop="previewVideo(item)">
                        {{ item.record_name || item.name }}
                      </div>
                    </el-tooltip>
                    <!-- <div class="vh-sort-tables__tbody-title" @click.stop="previewVideo(item)" >
                      {{ item.record_name || item.name }}
                    </div> -->
                    <div class="vh-sort-tables__tbody-date">
                      <template>
                      {{ item.created_at.substring(0, 16) }}
                      </template>
                    </div>
                    <div class="vh-sort-tables__tbody-hots">
                      {{ item.duration }}
                    </div>
                    <div class="vh-sort-tables__tbody-status">
                      {{ item.storage }}
                    </div>
                    <div class="vh-sort-tables__tbody-editor">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top" v-tooltipMove>
                        <i class="iconfont-v3 saasicon-trash" @click.prevent.stop="deleteSpecial(item.paas_record_id)"></i>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="移动" placement="top" v-tooltipMove>
                        <i class="iconfont-v3 saasicon_move"></i>
                      </el-tooltip>
                    </div>
                  </div>
                </draggable>
              </div>
          </div>
        </el-form-item>
        <el-form-item class="warm_submit">
          <el-button round class="length152" :disabled='!warmForm.warmFlag' type="primary" @click="submitForm('warmForm')" v-preventReClick>提交</el-button>
        </el-form-item>
      </el-form>
      <div class="white-box" v-show="!warmForm.warmFlag">
      </div>
    </div>
    <selectMedias ref="selecteMedia" :isWarmVideo="true" @selected='mediaSelected' :selectedList="warmVideoList" :videoSize="videoSize" :videoType="videoType" @closeWarm="isNeedCloseWarm"></selectMedias>
    <cropper ref="warmCropper" @cropComplete="cropComplete" @resetUpload="resetUpload"></cropper>
    <!-- 预览 -->
    <template v-if="showDialog">
      <div class="preview-wrap">
        <el-dialog class="vh-saas-dialog" title="" :visible.sync="showDialog" width="30%" center
        :close-on-press-escape=false>
          <video-preview ref="videoPreview" :videoParam='selectMedia'></video-preview>
        </el-dialog>
      </div>
    </template>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5"></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import Upload from '@/components/Upload/main';
import beginPlay from '@/components/beginBtn';
import selectMedias from './selecteMedia';
import draggable from "vuedraggable";
import {sessionOrLocal, parseImgOssQueryString, cropperImage, getImageQuery} from "@/utils/utils";
import cropper from '@/components/Cropper/index'
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
export default {
  components: {
    PageTitle,
    Upload,
    selectMedias,
    VideoPreview,
    beginPlay,
    draggable,
    cropper
  },
   watch: {
    warmForm: {
      deep: true,
      handler() {
        this.isChange = true;
      }
    },
  },
  data() {
    return {
      showChecked: false, // 是否滑中选择视频
      warmFlag: false,
      loading: false,
      isChange: false,
      videoSize: '500.1',
      videoType: 'MP4',
      warmId: '',
      userId: '',
      selectMedia: {},
      showDialog: false,
      imageCropMode: 1,
      warmForm: {
        imageUrl: '',
        playType: 1,
        selectedList:[],
        warmFlag: false,
        blurryDegree: 0,
        lightDegree: 10,
        backgroundSize: {
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      },
      domain_url: '',
      vm: null
    };
  },
  computed: {
    warmVideoList() {
      return JSON.parse(JSON.stringify(this.warmForm.selectedList || []))
    },
    domainUrl() {
      if (!this.warmForm.imageUrl) return '';
      return `${this.warmForm.imageUrl}?x-oss-process=image/crop,x_${this.warmForm.backgroundSize.x.toFixed()},y_${this.warmForm.backgroundSize.y.toFixed()},w_${this.warmForm.backgroundSize.width.toFixed()},h_${this.warmForm.backgroundSize.height.toFixed()}${this.warmForm.blurryDegree > 0 ? `,x-oss-process=image/blur,r_10,s_${this.warmForm.blurryDegree * 2}` : ''},x-oss-process=image/bright,${(this.warmForm.lightDegree - 10) * 5}&mode=${this.imageCropMode}`;
    }
  },
  async created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    await this.getWarmVideoInfo();
  },
  beforeRouteLeave (to, from, next) {
     if (!this.isChange) {
        next()
        return false;
      }
      this.$confirm('是否取消暖场视频的设置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(status => {
        if (status === 'confirm') { // 点击确定按钮
          this.isNeedCloseWarm(next);
        }
      }).catch(() => {
        this.messageInfo('获取暖场视频信息失败，请稍后重试', 'error')
      })
  },
  methods: {
    // 鼠标离开
    hiddenMenu () {
      this.showChecked = false
    },
    //鼠标滑上去
    showMenu () {
      this.showChecked = true
    },
    //文案提示问题
    messageInfo(msg, type) {
      if (this.vm) {
        this.vm.close();
      }
      this.vm = this.$message({
        showClose: true,
        // duration: 2000,
        message: msg,
        type: type,
        customClass: 'zdy-info-box',
      })
    },
    // 是否需要关闭暖场视频
    async isNeedCloseWarm(next) {
      // 如果当前活动下暖场视频 - 设置有视频，这个时候不应该关闭；
      // 如果当前活动下暖场视频 - 未设置过视频，并且选择视频也没内容，这个时候应该弹出提示。
      let warnResult = await this.$fetch('warnInfo', {webinar_id: this.$route.params.str})
      if (warnResult && warnResult.code == 200) {
        let recordList = warnResult.data?.record_list || []
        if (recordList.length > 0 && next) {
          // 当前界面去往别的界面
          next();
        } else if (recordList.length > 0 && !next) {
          // 音视频上传跳转别的界面，什么也不做
        } else {
          this.closeWarm();
        }
      } else {
        this.messageInfo('获取暖场视频信息失败，请稍后重试', 'error')
      }
    },
    // 关闭暖场视频
    closeWarm() {
      this.warmForm.warmFlag = false
      this.openCloseWarm(1);
    },
    // 开启或关闭暖场视频
    openCloseWarm(index) {
      let params = {
        webinar_id: this.$route.params.str,
        is_open_warm_video: Number(this.warmForm.warmFlag)
      }
      this.$fetch('warmOpen', params).then(res=>{
        if(res.code == 200){
          if (!this.warmForm.warmFlag) {
            this.$vhall_paas_port({
              k: 100134,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '',s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
          }
          this.messageInfo(this.warmForm.warmFlag ? '开启暖场视频成功' : '关闭暖场视频成功', 'success')
        }
      }).catch(res => {
        this.messageInfo(res.msg || (this.warmForm.warmFlag ? '开启暖场视频失败' : '关闭暖场视频失败'), 'error')
      });
    },
    // 获取暖场视频详情
    getWarmVideoInfo() {
      this.$fetch('warnInfo', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200) {
          this.warmForm.warmFlag = Boolean(res.data.is_open_warm_video);
          this.warmId = res.data.warm_id;
          // this.domain_url = res.data.img_url;
          // this.warmForm.imageUrl = res.data.img_url;
          this.warmForm.playType = res.data.player_type || 1;
          this.warmForm.selectedList = res.data.record_list || [];
          if (res.data.img_url) {
            this.handlerImageInfo(res.data.img_url)
          }
          // 重置修改状态
          setTimeout(() => {
            this.isChange = false
          }, 300)
        }
      })
    },
    // 处理图片
    handlerImageInfo(url) {
      this.warmForm.imageUrl = getImageQuery(url);
      if (cropperImage(url)) {
        let obj = parseImgOssQueryString(url);
        const { blur, crop } = obj;
        this.warmForm.backgroundSize = {
          x: Number(crop.x),
          y: Number(crop.y),
          width: Number(crop.w),
          height: Number(crop.h)
        };
        this.warmForm.blurryDegree = blur && Number(blur.s) / 2 || 0;
        this.warmForm.lightDegree = obj.bright ? 10 + Number(obj.bright) / 5 : 10;
        this.imageCropMode = obj.mode;
      }
    },
    changeVideo() {
      this.$refs.selecteMedia.dialogVisible = true;
    },
    deleteSpecial(id) {
      this.$confirm('删除后将会影响暖场视频的演示和观看，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.warmForm.selectedList.map((item, index) => {
          if (item.paas_record_id === id) {
            this.warmForm.selectedList.splice(index, 1)
          }
        })
      })
    },
    mediaSelected(selectedActives){
      this.warmForm.selectedList = selectedActives.map(item => {
        return {
          record_name: item.name || item.record_name,
          duration: item.duration,
          paas_record_id: item.paas_record_id,
          created_at: item.created_at,
          storage: item.storage
        }
      });
       console.log(selectedActives,this.warmForm.selectedList, '???134')
      // let id = 'paas_record_id';
      // this.warmForm.selectedList = selectedActives.reduce((all, next) => all.some((atom) => atom[id] == next[id]) ? all : [...all, next],[]);
    },
    // 预览
    previewVideo(item) {
      this.selectMedia.paas_record_id = item.paas_record_id;
      this.selectMedia.name = item.record_name || item.name;
      this.selectMedia.msg_url = '.mp4';
      this.showDialog = true;
    },
    cropComplete(cropperData, url, mode) {
      console.log(cropperData, url, '?????')
      this.warmForm.backgroundSize = cropperData;
      this.warmForm.imageUrl = url;
      this.imageCropMode = mode;
    },
    resetUpload() {
      let dom = document.querySelector('#warm_pc_cropper .el-upload__input');
      dom.click();
    },
    handleUploadSuccess(res, file) {
      if(res.data) {
        this.$refs.warmCropper.showModel(res.data.domain_url);
        // let domain_url = res.data.domain_url || ''
        // let file_url = res.data.file_url || '';
        // this.warmForm.imageUrl = file_url;
        // this.domain_url = domain_url;
      }
    },
    beforeUploadHandler(file){
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.messageInfo(`上传封面图片只能是 ${typeList.join('、')} 格式`, 'error')
        return false;
      }
      if (!isLt2M) {
        this.messageInfo('上传封面图片大小不能超过 4M', 'error')
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.messageInfo('封面图片上传失败', 'error')
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    submitForm(){
      let recordId = [];
      this.warmForm.selectedList.map(item => {
        recordId.push(item.paas_record_id);
      })
      console.log(recordId, '???12312435')
      if(!recordId.length){
        this.messageInfo('请上传暖场视频', 'error')
      }else{
        this.saveWarmInfo(recordId);
      }
    },
    saveWarmInfo(recordId) {
      let params = {
        is_open_warm_video: Number(this.warmForm.warmFlag),
        img_url: this.$parseURL(this.domainUrl).path,
        player_type: this.warmForm.playType,
        webinar_id: this.$route.params.str,
        warm_id: this.warmId,
        record_id: recordId.join(',')
      }
      this.$fetch('warnEdit', this.$params(params)).then(res => {
        if (this.domainUrl) {
          this.$vhall_paas_port({
            k: 100135,
            data: {business_uid: this.userId, user_id: this.$route.params.str, webinar_id: '', refer: '',s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        this.$vhall_paas_port({
            k: 100133,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '',s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        this.$message({
          message: `保存暖场视频成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });

        this.isChange = false;
        setTimeout(()=>{
          this.$router.push({path: `/live/detail/${this.$route.params.str}`});
        }, 500);
      }).catch(res => {
        this.messageInfo(res.msg || "保存暖场视频失败", 'error');
      });
    },
    // 删除图片
    deleteImg() {
      this.warmForm.imageUrl = '';
      this.warmForm.blurryDegree = 0;
      this.warmForm.lightDegree = 10;
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  .layout--right--main();
  .padding48-40();
  position: relative;
  .white-box{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;
  }
}
.saasicon_help_m{
  margin-left: 5px;
  color: #999;
}
/deep/.upload__avatar{
  .mask{
    top:0;
  }
}
/deep/.el-upload--picture-card{
  font-size: 40px;
  .box >div {
    height: 180px;
  }
  i.saasicon_shangchuan{
    font-size: 40px;
  }
  .picInco{
    height: 40px;
  }
}
.demo-ruleForm {
  width: 740px;
}
.switch__box {
  display: inline-block;
}
/deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
  color: #999999;
  pointer-events: none;
  user-select: none;
}
.el-role-switch{
  margin-left: 8px;
  vertical-align: sub;
}
.warm_submit{
  margin-top: 32px;
}
.wramUp-wrap::v-deep{
  .avatar-uploader .el-upload {
     width: 640px;
     height: 180px;
     border: 1px solid #cccccc;
     border-radius: 6px;
     cursor: pointer;
     position: relative;
     overflow: hidden;
   }
   .avatar-uploader .el-upload:hover {
     border-color: #409EFF;
   }
   .avatar-uploader-icon {
     font-size: 28px;
     color: #8c939d;
     width: 178px;
     height: 178px;
     line-height: 178px;
     text-align: center;
   }
   .avatar {
     display: block;
   }
   .el-upload:hover {
     border: 1px solid #999!important;
   }
   .selet-video{
     border: 1px solid #cccccc;
     border-radius: 6px;
     width: 640px;
     height: 180px;
     position: relative;
     background: #f7f7f7;
    .abRight{
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      top: 0px;
      right: 0px;
      // line-height: 180px;
      text-align: center;
      display:flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #fff;
      .tool{
        width: 30px;
        line-height: 20px;
        margin: 0px 5px;
        &:hover{
          cursor: pointer;
        }
      }
      span{
        color: #fff;
        font-size: 14px;
      }
      /deep/.saasicon-eye, /deep/.saasicon_shanchu{
        font-size: 18px!important;
        height: 30px;
      }
    }
    .operaBtn{
      font-size: 14px;
      color: #666;
      positioN: relative;
      &:hover{
        color: #FB3A32;
      }
    }
    &:hover{
      border: 1px solid #999;
    }
    .mediaSlot{
      width: 100%;
      text-align: center;
      vertical-align: middle;
      line-height: 18px;
      color: #999999;
      font-size: 12px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .selectMediaName{
        word-break: break-word;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 144px;
        font-size: 14px;
        color: #666;
        padding-top: 12px;
        line-height: 18px;
      }
      .tip{
        width: 100%;
      }
      i{
        font-size: 30px;
      }
      /deep/.iconfont-v3{
        font-size: px;
      }
      .picInco{
        height: 30px;
      }
      /deep/.saasicon_shangchuan{
        font-size: 40px;
        color: #999;
      }
      /deep/.saasshipinwenjian{
        color: #FF733C;
      }
      p{
        padding-top: 5px;
      }
    }
   }
}
.image_cropper{
  width: 100%;
  margin-top: 16px;
  &_item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      color: #595959;
    }
    .wid_block{
      display: inline-block;
      width: 16px;
    }
  }
}
.vh-saas-dialog{
    /deep/ .el-dialog {
      width: 624px!important;
      background: transparent!important;
      border:none;
      box-shadow: none;
    }
    /deep/ .el-dialog__header {
      width: 642px!important;
      padding: 0px;
      height: 55px;
      background: transparent!important;
      border:none;
      color: #fff;
    }
    /deep/ .el-dialog__headerbtn{
      top: 30px;
      right: -18px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body{
      width: 642px;
      height: 375px;
      border-top: 4px solid #1a1a1a;
      border-bottom: 4px solid #1a1a1a;
      background: #1a1a1a;
      border-radius: 4px;
      padding: 0 4px;
    }
}
.box{
  text-align: center;
}
.add_video{
  display: inline-block;
  width: 110px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: center;
  color: #000;
  font-size: 14px;
  cursor: pointer;
  i{
    color: #262626;
    font-size: 14px;
  }

}
.vh-sort-tables{
    position: relative;
    width: 640px;
    font-size: 14px;
    font-weight: 400;
    margin-top: 16px;


    &__theader{
      height: 40px;
      line-height: 40px;
      background: #F7F7F7;
      color: #666666;
      display: flex;
      &>div{
        display: inline-block;
      }
      &-id{
        width: 77px;
        padding-left: 24px;
        box-sizing: border-box;
      }
      &-title{
        width: 165px;
        padding: 0 10px;
      }
      &-status{
        width: 120px;
      }
      &-date{
        width: 160px;
        padding: 0 10px;
      }
      &-hots{
        width: 100px;
      }
      &-editor{
        width: 86px;
      }
    }

    &__tbody{
      // height: 200px;
      // overflow-y: auto;
      &-tr{
        // border: 1px solid #FB3A32;
        border-bottom: 1px solid #E6E6E6;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #1A1A1A;
        word-break: keep-all;
        display: flex;
        &>div{
          display: inline-block;
          vertical-align: top;
        }
      }
      &-selected {
        border: 1px solid #FB3A32;
      }

      &-id{
        width: 77px;
        padding-left: 24px;
        box-sizing: border-box;
      }
      &-title{
        width: 165px;
        padding: 0 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        cursor: pointer;
        color: #3562FA;
        &:hover{
          color: #FB3A32;
        }
      }

      &-hots{
        width: 100px;
      }
      &-status{
        width: 120px;
      }
      &-date{
        width: 160px;
        padding: 0 10px;
      }
      &-editor{
        width: 86px;
        i{
          font-size: 20px;
          margin: 0 5px;
          cursor: pointer;
          &:hover{
            color: #FB3A32;
          }
        }
      }
    }
}


</style>
