<template>
  <div class="editBox">
    <pageTitle :title="`${title}${webniarTypeToZH}`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" v-loading="loading" label-width="100px">
      <el-form-item :label="`${webniarTypeToZH}标题：`" prop="title"
      :rules="[
        { required: true, max: 100,  message: '请输入直播标题', trigger: 'blur' },
      ]">
        <el-input v-model="formData.title" maxlength="100" :placeholder="`请输入${webniarTypeToZH}标题`"  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="直播时间：" required v-if="webniarType=='live'">
          <el-col :span="11">
            <el-form-item prop="date1" :rules="[
              { required: true, message: '请选择直播开始日期', trigger: 'blur' }
            ]">
              <el-date-picker type="date" :picker-options="pickerOptions" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="formData.date1" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2" :rules="[
              { required: true, message: '请选择直播开始时间', trigger: 'blur' }
            ]">
              <el-time-picker placeholder="选择时间" value-format="HH:mm" v-model="formData.date2" style="width: 100%"></el-time-picker>
            </el-form-item>
          </el-col>
      </el-form-item>
      <el-form-item label="直播模式：" required v-if="webniarType=='live'">
        <div class="titleBox">
          <span class="pageTitle">直播创建成功后，不允许修改直播模式</span>
          <el-tooltip>
            <div slot="content">
              <p>1.视频直播：音频+视频直播，需要保证摄像头和麦克风正常</p>
              <p>2.互动直播：音视频互动连麦，最多支持6人连麦直播</p>
              <p>3.音频直播：音频直播，需要保证麦克风正常</p>
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <slot name="default"></slot>
        </div>
        <div class="modeBox">
          <div @click='liveModeChange(2)' :class="{active: liveMode== 2}">
            <el-container class='model'>
              <el-aside width="80px" class="block">
                <i class="el-icon-video-camera icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">视频直播</p>
          </div>
          <div @click='!webniarIntact && liveModeChange(3)' :class="{active: liveMode== 3 }">
            <el-container class='model'>
              <el-header height='13px'>
                <el-col :span="3" class="block"></el-col>
                <el-col :span="3" :offset='1' class="block"></el-col>
                <el-col :span="3" :offset='1' class="block"></el-col>
                <el-col :span="3" :offset='1' class="block"></el-col>
                <el-col :span="3" :offset='1' class="block"></el-col>
                <el-col :span="4" :offset='1' class="block"></el-col>
              </el-header>
              <el-container>
                <el-aside width="80px" class="block">
                  <i class="el-icon-s-custom icon"></i>
                </el-aside>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">互动直播</p>
            <span class="notAllow" v-if="webniarIntact">未开通</span>
          </div>
          <div @click='liveModeChange(1)' :class="{active: liveMode== 1}">
            <el-container class='model'>
              <el-aside width="80px" class="block">
                <i class="el-icon-microphone icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">音频直播</p>
          </div>
        </div>
        <div class="modeHide" v-if="$route.query.type==2"></div>
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}封面：`">
        <upload
          v-model="imageUrl"
          :domain_url="domain_url"
          :saveData="{
             path: pathUrl,
             type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler"
          @delete="imageUrl = ''">
          <p slot="tip">最佳头图尺寸：1280*720px <br/>小于2MB(支持jpg、gif、png、bmp)</p>
        </upload>
      </el-form-item>
      <el-form-item label="选择视频："  v-if="webniarType=='vod'">
        <div class="mediaBox">
          <div class="mediaSlot" v-if="!selectMedia" @click="$refs.selecteMedia.dialogVisible=true">
            <i class="el-icon-film"></i>
            <p>视频格式支持：rmvb、mp4、avi、wmv、mkv、flv、mov；音频格式支持mp3、wav <br/>文件大小不超过2G</p>
          </div>
          <div class="mediaSlot" v-else>
            <icon icon-class="saasshipinwenjian"></icon>
            <p>{{selectMedia.name}}</p>
          </div>
          <div class="abRight" v-if="!!selectMedia">
            <el-button type="text" class="operaBtn" @click="previewVideo">预览</el-button>
            <el-button type="text" class="operaBtn" @click="selectMedia=null">删除</el-button>
          </div>
          <el-tooltip>
              <div slot="content">
                1.上传单个文件最大2G，文件标题不能带有特殊字符和空格<br/>
                2.视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV<br/>
                3.上传的视频，不支持剪辑和下载
              </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}简介：`">
        <v-editor class="editor-wrap" save-type='live' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" v-model="content"></v-editor>
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}类别：`" required>
        <span :class="{tag: true, active: tagIndex === index}" v-for="(item, index) in liveTags" :key="item" @click="tagIndex=index">{{item}}</span>
      </el-form-item>
      <el-switch
         v-if="webniarType=='live'"
        style="display: block"
        v-model="docSwtich"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="文档翻页"
        :active-text="docSwtichDesc">
      </el-switch>
      <el-switch
         v-if="webniarType=='live'"
        style="display: block"
        v-model="reservation"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="预约人数"
        :active-text="reservationDesc">
      </el-switch>
      <el-switch
         v-if="webniarType=='live'"
        style="display: block"
        v-model="online"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="在线人数"
        :active-text="onlineDesc">
      </el-switch>
      <el-switch
        style="display: block"
        v-model="hot"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="活动热度"
        :active-text="hotDesc">
      </el-switch>
      <el-switch
        style="display: block"
        v-model="home"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="关联主页"
        :active-text="homeDesc">
      </el-switch>
      <el-switch
        v-if="webniarType=='live' || !this.versionType"
        style="display: block"
        v-model="capacity"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="并发扩容"
        :active-text="capacityDesc">
      </el-switch>
      <el-switch
        style="display: block"
        v-model="limitCapacitySwtich"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inactive-text="最高并发"
        :active-text="limitCapacityDesc"
        >
      </el-switch>
      <el-input placeholder="请输入限制并发数" v-show="limitCapacitySwtich" v-model="limitCapacity" class="limitInput" oninput="this.value=this.value.replace(/[^\d]/g, '')"></el-input>
      <el-form-item class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')" round>保存</el-button>
        <el-button @click="resetForm('ruleForm')" v-preventReClick round>取消</el-button>
      </el-form-item>
      <!-- <p class="btnGroup">

      </p> -->
    </el-form>
    <selectMedia ref="selecteMedia" @selected='mediaSelected'></selectMedia>
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
        <video-preview ref="videoPreview" :videoParam='selectMedia'></video-preview>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import selectMedia from './selecteMedia';
import VEditor from '@/components/Tinymce';
import { sessionOrLocal } from '@/utils/utils';
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
import Env from "@/api/env";

export default {
  components: {
    PageTitle,
    upload,
    selectMedia,
    VEditor,
    VideoPreview
  },
  computed: {
    pathUrl: function() {
      return `interacts/screen-imgs/${this.$moment().format('YYYYMM')}`;
    },
    docSwtichDesc(){
      if(this.docSwtich){
        return '已开启，支持观众直播中提前预览文档，进行文档翻页';
      }else{
        return "开启后，支持观众直播中提前预览文档，进行文档翻页";
      }
    },
    reservationDesc(){
      if(this.reservation){
        return '关闭后，观看端将隐藏预约人数';
      }else{
        return "已关闭，观看端已隐藏预约人数";
      }
    },
    onlineDesc(){
      if(this.online){
        return '关闭后，观看端将隐藏在线人数';
      }else{
        return "已关闭，观看端已隐藏在线人数";
      }
    },
    hotDesc(){
      if(this.hot){
        return '关闭后，观看端将隐藏活动热度';
      }else{
        return "已关闭，观看端已隐藏活动热度";
      }
    },
    homeDesc(){
      if(this.home){
        return '关闭后，该直播将不在个人主页显示';
      }else{
        return "已关闭，该直播已不在个人主页显示";
      }
    },
    capacityDesc(){
      if(this.capacity){
        return '已开启，观看并发人数扩容X人';
      }else{
        // return "开启后，使用扩展包扩容并发人数（扩展包剩余人）"
        return `开启后，使用扩展包扩容并发人数（扩展包剩余${this.limitInfo.extend}人）`;
      }
    },
    limitCapacityDesc(){
      if(this.limitCapacitySwtich){
        return '已开启，限制进入活动的观众最大并发数';
      }else{
        return "开启后，限制进入活动的观众最大并发数";
      }
    },
    webniarType(){
      return this.$route.meta.webniarType;
    },
    webniarTypeToZH(){
      const zh ={
        vod: '点播',
        live: '直播'
      };
      return zh[this.$route.meta.webniarType];
    },
    webniarIntact() {
      // new_interact 1:有互动权限  0:无权限
      if (JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')).new_interact == '1') {
        return false;
      } else {
        return true;
      }
    }
  },
  data(){
    return {
      formData: {
        title: '',
        date1: '',
        date2: ''
      },
      limitInfo: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      content: ``,
      docSwtich: false,
      reservation: false,
      online: false,
      showDialog: false,
      hot: false,
      home: false,
      capacity: false,
      isSaveInfo: false,
      limitCapacity: '',
      limitCapacitySwtich: false,
      liveTags: ["金融", '互联网', '汽车', '教育', '健康', '其他'],
      liveMode: 2,
      tagIndex: 0,
      loading: false,
      imageUrl: '',
      domain_url: '',
      selectMedia: null
    };
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isSaveInfo && this.title === '编辑') {
    this.$confirm('是否取消编辑的直播内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-alert-box',
        type: 'warning'
      }).then(() => {
        next();
      }).catch(() => {
      });
    } else {
      next();
    }
  },
  created(){
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
    if (this.$route.query.id || this.$route.params.id) {
      this.webinarId = this.$route.query.id || this.$route.params.id;
      if(this.$route.query.id){
        this.title = this.$route.query.type == 2 ? '编辑' : '复制';
      }else{
        this.title = '编辑'
      }
      this.getLiveBaseInfo(this.webinarId);
    } else {
      this.title = '创建';
      this.webinarId = '';
    }
    if (this.$route.query.record_id) {
      this.selectMedia = {
        id: this.$route.query.record_id,
        paas_record_id: this.$route.query.paas_record_id,
        name: this.$route.query.name
      }
    }
    this.getHighLimit();
  },
  methods: {
    getLiveBaseInfo(id) {
      this.$fetch('getWebinarInfo', {webinar_id: id}).then(res=>{
        if( res.code != 200 ){
          return this.$message.warning(res.msg)
        }
        this.liveDetailInfo = res.data;
        this.formData.title = this.liveDetailInfo.subject;
        this.formData.date1 = this.liveDetailInfo.start_time.substring(0, 10);
        this.formData.date2 = this.liveDetailInfo.start_time.substring(11, 16);
        this.liveMode = this.liveDetailInfo.webinar_type;
        // if (this.$route.query.type == 2) {
        //   this.liveMode = 1;
        // }
        this.imageUrl = this.liveDetailInfo.img_url;
        this.domain_url = this.liveDetailInfo.img_url;
        console.log(this.domain_url, this.imageUrl, '封面地址');
        this.tagIndex = this.liveDetailInfo.category - 1;
        this.home = Boolean(this.liveDetailInfo.is_private);
        this.docSwtich = Boolean(this.liveDetailInfo.is_adi_watch_doc);
        this.online = Boolean(this.liveDetailInfo.hide_watch);
        this.reservation = Boolean(this.liveDetailInfo.hide_appointment);
        this.$refs.unitImgTxtEditor.content = this.liveDetailInfo.introduction;
        this.hot = Boolean(this.liveDetailInfo.hide_pv);
        if (this.liveDetailInfo.webinar_curr_num) {
          this.limitCapacity = this.liveDetailInfo.webinar_curr_num;
          this.limitCapacitySwtich = true;
        } else {
          this.limitCapacitySwtich = false;
        }
        this.capacity = Boolean(this.liveDetailInfo.is_capacity);
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    sendData(content) {
      this.content = content;
    },
    liveModeChange(index) {
      this.liveMode = index;
    },
    handleUploadSuccess(res, file) {
      console.log(res, file);
      // 文件上传成功，保存信息
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.imageUrl = file_url;
        this.domain_url = domain_url;
      }
    },
    beforeUploadHnadler(file){
      const typeList = ['png', 'jpeg', 'gif', 'bmp']
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    submitForm(formName) {
      if (this.limitCapacity > this.limitInfo.total) {
        this.$message.error(`最大并发数不能大于并发剩余量`);
      }
      let data = {
        webinar_id: this.webinarId || '',
        record_id: this.webniarTypeToZH === '点播' ? this.selectMedia.id : '',
        subject: this.formData.title, // 标题
        introduction: this.content, // 简介
        start_time: `${this.formData.date1} ${this.formData.date2}`, // 创建时间
        webinar_type: this.liveMode, // 1 音频 2 视频 3 互动
        category: this.tagIndex+1, // 类别 1 金融 2 互联网 3 汽车 4 教育 5 医疗 6 其他
        img_url: this.$parseURL(this.imageUrl).path, // 封面图
        is_private: Number(this.home), // 是否在个人主页显示
        // is_open: Number(this.home),  // 是否公开活动 默认0为公开，1为不公开
        hide_watch: Number(this.online), // 是否显示在线人数  1 是 0 否
        is_adi_watch_doc: Number(this.docSwtich),// 观众是否可预览文档 1 是 0 否
        hide_appointment: Number(this.reservation),// 是否显示预约人数 1 是 0 否
        hide_pv: Number(this.hot),// 是否显示活动热度 1 是 0 否
        webinar_curr_num: this.limitCapacitySwtich ? this.limitCapacity : 0,// 	最高并发 0 无限制
        is_capacity: Number(this.capacity)// 是否扩容 1 是 0 否
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let url;
          if (this.webniarTypeToZH === '点播') {
            url = 'demandCreate';
          } else {
            url = this.title === '编辑' ? 'liveEdit' : 'createLive';
          }
          this.$fetch(url, this.$params(data)).then(res=>{
            if(res && res.code === 200) {
              this.$message.success(`${this.title}成功`);
              this.isSaveInfo = true;
              console.log(res);
              setTimeout(()=>{
                this.$router.push({path: '/live/list'});
              }, 500);
            } else{
              this.$message.error(res.msg || '操作失败');
            }
          }).catch(error=>{
            this.$message.error(`操作失败，${error.message}`);
          }).finally(()=>{
            this.loading = false;
          });
          console.log(data);
        } else {
          this.$message.error('请完善必填字段');
          document.documentElement.scrollTop = 0;
          return false;
        }
      });
    },
     // 预览
    previewVideo() {
      this.showDialog = true;
    },
    getHighLimit() {
      this.$fetch('getHighLimit').then(res => {
        this.limitInfo = res.data;
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 重置直播模式、直播封面、直播简介。
    },
    mediaSelected(media){
      this.selectMedia = media;
      console.log(this.selectMedia);
    }
  },
};
</script>

<style lang="less" scoped>
  .el-form{
    background: #ffffff;
    padding: 48px 20px 50px 48px;
    margin-top: 32px;
    /deep/ .el-switch__label--left{
      color: #1A1A1A;
      pointer-events: none;
      user-select: none;
      margin: 0 20px;
    }
    /deep/ .el-switch__label--right{
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
  }
  /deep/ .el-form-item{
    // width: 100%;
    max-width: 660px;
    margin-bottom: 26px;
  }
  /deep/.el-col-11{
    height: 40px;
  }
  // /deep/ .el-form-item__label{
  //   float: none;
  // }
  .line{
    text-align: center;
    width: 20px;
  }
  .pageTitle {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 40px;
    margin-right: 9px;
    // padding-bottom: 5px;
  }
  .el-icon-question {
    color: #999999;
  }
  .modeBox{
    display: flex;
    justify-content: space-between;
    position: relative;
    >div{
      height: 112px;
      width: 180px;
      border-radius: 4px;
      border: 1px solid #CCCCCC;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &.disabled{
        pointer-events: none;
        .notAllow{
          display: block;
        }
      }
      &.active{
        border-color: #FB3A32;
        .block{
          background: #FFEBEB;
          .icon{
            color: #FB3A32;
          }
        }
      }
      &:nth-child(2){
        .el-header{
          .block{
            height: 13px;
          }
        }
      }
      .notAllow{
        position: absolute;
        color: #727272;
        bottom: -24px;
        right: -32px;
        background: #F2F2F2;
        font-size: 10px;
        line-height: normal;
        padding: 5px 20px;
        padding-bottom: 39px;
        transform: rotate(-45deg);
        display: block;
      }
    }
    .model{
      width: 100px;
      height: 56px;
      margin: 0 auto;
      margin-top: 16px;
      .el-aside{
        margin-right: 2px;
      }
      .el-header{
        margin-bottom: 2px;
      }
      .el-header,.el-main{
        padding: 0;
      }
      .block{
        background: #F2F2F2;
        position: relative;
      }
      .icon{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        font-size: 20px;
        color: #999999;
        height: fit-content;
        width: fit-content;
      }
    }
    .desc{
      font-size: 14px;
      text-align: center;
      line-height: 30px;
    }
  }
  .modeHide{
    position: absolute;
    top: 0;
    left: 0;
    height: 180px;
    width: 100%;
  }
  .tag{
    padding: 3px 18px;
    border: 1px solid #CCCCCC;
    font-size: 14px;
    color: #666666;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 16px;
    transition: all .2s ease-out;
    &.active{
      background: #FB3A32;
      color: #fff;
      border-color: transparent;
    }
  }
  .el-switch{
    margin-top: 30px;
  }
  .limitInput{
    margin-left: 66px;
    max-width: 360px;
    margin-top: 15px;
  }
  .uploadDesc{
    line-height: 20px;
  }
  .btnGroup{
    // text-align: center;
    margin-top: 40px;
    .el-button{
      color:#FB3A32;
      border-color:#FB3A32;
      width: 150px;
      &:hover{
        background: #ffebeb;
      }
    }
    .el-button--primary{
      background:#FB3A32;
      border-color:#FB3A32;
      color: #fff;
      &:hover{
        background: #fc615b;
      }
    }
    .el-button.is-round{
      padding: 10px 23px;
    }
  }
  /*.editBox {
    padding: 0px 40px;
  }
  @media screen and (min-width: 1920px) {
    .editBox {
      padding: 0px 140px;
    }
  }*/
  .mediaBox{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100%;
    height: 148px;
    display: table;
    position: relative;
    .abRight{
      position: absolute;
      top: 0px;
      right: 12px;
    }
    .operaBtn{
      font-size: 14px;
      color: #666;
      &:hover{
        color: #FB3A32;
      }
    }
    &:hover{
      border-color: #FB3A32;
    }
    .mediaSlot{
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
      color: #999999;
      font-size: 12px;
      cursor: pointer;
      i{
        font-size: 30px;
      }
      /deep/.iconfont-v3{
        font-size: 26px;
      }
    }
    .el-tooltip{
      position: absolute;
      right: -24px;
      top: 0px;
      font-size: 16px;
    }
  }
</style>
<style lang="less">
  html{
    background: #F7F7F7;
  }
  .editor-wrap{
    .tox-statusbar{
      display: none;
    }
  }
</style>
