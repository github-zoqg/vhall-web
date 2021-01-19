<template>
  <div class="editBox">
    <pageTitle :title="Number($route.query.type) === 2 ? '编辑信息' : `${title}${webniarTypeToZH}`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" v-loading="loading" label-width="80px">
      <el-form-item :label="`${webniarTypeToZH}标题`" prop="title"
      :rules="[
        { required: true, max: 100,  message: `请输入${webniarTypeToZH}标题`, trigger: 'blur' },
      ]">
        <VhallInput v-model.trim="formData.title" :maxlength="100" class="title-inform" autocomplete="off" :placeholder="`请输入${webniarTypeToZH}标题`"  show-word-limit></VhallInput>
      </el-form-item>
      <el-form-item label="直播时间" required v-if="webniarType=='live'" class="item-time">
          <el-col :span="11.5">
            <el-form-item prop="date1" style="width:270px;" :rules="[
              { required: true, message: `请选择直播开始日期`, trigger: 'blur' }
            ]">
              <el-date-picker type="date" class="date" prefix-icon="iconfont-v3 saasicon_date" :picker-options="pickerOptions" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="formData.date1" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11.5">
            <el-form-item prop="date2" style="width:270px;" :rules="[
              { required: true, message: `请选择直播开始时间`, trigger: 'blur' }
            ]">
            <el-time-picker placeholder="选择时间" :disabled="!formData.date1" type="datetime" :picker-options="{
              selectableRange: rangHourMins
            }" format="HH:mm" value-format="HH:mm" v-model="formData.date2" style="width: 100%"></el-time-picker>
            </el-form-item>
          </el-col>
      </el-form-item>
      <el-form-item label="直播模式" required v-if="webniarType=='live'">
        <div class="titleBox">
          <span class="pageTitle">直播创建成功后，直播模式将不可修改</span>
          <el-tooltip>
            <div slot="content">
              <p>1.视频直播：音频+视频直播，需要保证摄像头和麦克风正常</p>
              <p>2.互动直播：音视频互动连麦，最多支持6人连麦直播</p>
              <p>3.音频直播：音频直播，需要保证麦克风正常</p>
            </div>
            <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999;"></i>
          </el-tooltip>
          <slot name="default"></slot>
        </div>
        <div class="modeBox">
          <div>
            <img src="../../common/images/live/mode-video_check.png" :class="{active: liveMode== 2}" @click='liveModeChange(2)' v-if="liveMode== 2">
            <img src="../../common/images/live/mode-video.png" alt="" @click='liveModeChange(2)' v-else>
            <p class="desc">视频直播</p>
            <!-- <el-container class='model'> -->
              <!-- :class="{active: liveMode== 2}" -->
              <!-- <el-aside width="80px" class="block">
                <i class="el-icon-video-camera icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container> -->
            <!-- </el-container> -->
          </div>
          <div>
            <template v-if="webniarIntact">
              <img src="../../common/images/live/mode-active_disabled.png" alt="" style="cursor: default;">
            </template>
            <template v-else>
             <img src="../../common/images/live/mode-active_check.png" alt="" :class="{active: liveMode== 3}" @click='!webniarIntact && liveModeChange(3)' v-if="liveMode== 3">
              <img src="../../common/images/live/mode-active.png" alt="" @click='!webniarIntact && liveModeChange(3)' v-else>
            </template>
            <!-- <el-container class='model'> -->

              <!-- <el-header height='13px'>
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
              </el-container> -->
            <!-- </el-container> -->
            <p class="desc">互动直播</p>
            <!-- <span class="notAllow" v-if="webniarIntact">未开通</span> -->
          </div>
          <div>
            <img src="../../common/images/live/mode-media_check.png" :class="{active: liveMode == 1}" alt=""  @click='liveModeChange(1)' v-if="liveMode== 1">
            <img src="../../common/images/live/mode-media.png" alt=""  @click='liveModeChange(1)' v-else>
            <!-- <el-container class='model'>
              <img src="../../common/images/live/mode-media.png" alt="">
              <el-aside width="80px" class="block">
                <i class="el-icon-microphone icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container>
            </el-container> -->
            <p class="desc">音频直播</p>
          </div>
        </div>
        <div class="modeHide" v-if="$route.query.type==2"></div>
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}封面`">
        <upload
          v-model="formData.imageUrl"
          :domain_url="formData.domain_url"
          :saveData="{
             path: pathUrl,
             type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler"
          @delete="formData.imageUrl = ''">
          <div slot="tip">
            <p>建议尺寸：1280*720px，小于2M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="选择视频"  v-if="webniarType=='vod'" required>
        <div class="mediaBox" @mouseenter="showMenu" @mouseleave="hiddenMenu">
          <div class="mediaSlot" v-if="!selectMedia.id" @click="$refs.selecteMedia.dialogVisible=true">
            <i class="iconfont-v3 saasicon_shangchuan"></i>
            <p>视频格式支持：rmvb、mp4、avi、wmv、mkv、flv、mov；音频格式支持mp3、wav <br/>文件大小不超过2G</p>
          </div>
          <div class="mediaSlot" v-else>
            <icon icon-class="saasshipinwenjian"></icon>
            <p>{{selectMedia.name}}</p>
          </div>
          <div class="abRight" v-if="selectMedia.id&&showChecked">
            <div class="tool" @click.stop="previewVideo">
              <i class="iconfont-v3 saasicon-eye"></i>
              <el-button type="text" class="operaBtn" >预览</el-button>
            </div>
            <div class="tool" @click.stop="deleteSelectMedia">
              <i class="iconfont-v3 saasicon_shanchu"></i>
              <el-button type="text" class="operaBtn" >删除</el-button>
            </div>
            <!-- <el-button type="text" class="operaBtn" @click="previewVideo">预览</el-button>
            <el-button v-if="!$route.query.record_id" type="text" class="operaBtn" @click="deleteSelectMedia">删除</el-button> -->
          </div>
          <el-tooltip v-if="!$route.query.record_id">
              <div slot="content">
                1.上传单个文件最大2G，文件标题不能带有特殊字符和空格<br/>
                2.视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV<br/>
                3.上传的视频，不支持剪辑和下载
              </div>
            <i class="iconfont-v3 saasicon_help_m tip"></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}简介`">
        <v-editor class="editor-wrap" save-type='live' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" v-model="formData.content"></v-editor>
      </el-form-item>
      <!-- <el-form-item :label="`${webniarTypeToZH}类别`" >
        <span :class="{tag: true, active: tagIndex === index}" v-for="(item, index) in liveTags" :key="item" @click="tagIndex=index">{{item}}</span>
      </el-form-item> -->
      <p class="switch__box" v-if="webniarType=='live'">
        <el-switch
          style="display: block"
          v-model="formData.docSwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="文档翻页"
          :active-text="docSwtichDesc">
        </el-switch>
      </p>
      <p class="switch__box" v-if="webniarType=='live'">
        <el-switch
          style="display: block"
          v-model="formData.reservation"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="预约人数"
          :active-text="reservationDesc">
        </el-switch>
      </p>
      <p class="switch__box" v-if="webniarType=='live'">
        <el-switch
          style="display: block"
          v-model="formData.online"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="在线人数"
          :active-text="onlineDesc">
        </el-switch>
      </p>
      <p class="switch__box">
        <el-switch
          style="display: block"
          v-model="formData.hot"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="活动热度"
          :active-text="hotDesc">
        </el-switch>
      </p>
      <p class="switch__box">
        <el-switch
          style="display: block"
          v-model="formData.home"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="关联主页"
          :active-text="homeDesc">
        </el-switch>
        </p>
      <p class="switch__box" v-if="webniarType=='live' && !versionType">
         <el-switch
          style="display: block"
          v-model="formData.capacity"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="并发扩容"
          :disabled="!limitInfo.extend"
          :active-text="capacityDesc">
        </el-switch>
      </p>
      <p class="switch__box">
        <el-switch
          style="display: block"
          v-model="formData.limitCapacitySwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="最高并发"
          :active-text="limitCapacityDesc"
          >
        </el-switch>
         <el-input placeholder="请输入限制并发数" :maxlength="!versionType ? '' : '7'" v-show="formData.limitCapacitySwtich" v-model="formData.limitCapacity" class="limitInput" oninput="this.value=this.value.replace(/\D/g, '')"></el-input>
      </p>
      <el-form-item class="btnGroup">
        <el-button type="primary" class="common-button length152" :disabled="!formData.title" @click="submitForm('ruleForm')" v-preventReClick round>保存</el-button>
        <el-button class="length152" @click="resetForm('ruleForm')" round>取消</el-button>
      </el-form-item>
      <!-- <p class="btnGroup">

      </p> -->
    </el-form>
    <selectMedia ref="selecteMedia" @selected='mediaSelected'></selectMedia>
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" :visible.sync="showDialog" width="30%" center
      :close-on-click-modal=false
      :close-on-press-escape=false>
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
    rangHourMins() {
      let sysDate = new Date().getTime();
      let str = this.$moment().format('HH:mm');
      console.log(this.formData.date1, str);
      let selectDate = this.$moment(this.formData.date1).format('YYYY-MM-DD');
      let targetDate = new Date(`${selectDate} 00:00:00`).getTime();
      if (targetDate > sysDate) {
        return `00:00:00 - 23:59:00`;
      } else {
        return `${str}:00 - 23:59:00`;
      }
    },
    pathUrl: function() {
      return `interacts/screen-imgs/${this.$moment().format('YYYYMM')}`;
    },
    docSwtichDesc(){
      if(this.formData.docSwtich){
        return '已开启，直播中观众可以提前预览文档，进行文档翻页';
      }else{
        return "开启后，直播中观众可以提前预览文档，进行文档翻页";
      }
    },
    reservationDesc(){
      if(this.formData.reservation){
        return '已开启，观看端显示预约人数';
      }else{
        return "开启后，观看端显示预约人数";
      }
    },
    onlineDesc(){
      if(this.formData.online){
        return '已开启，观看端显示在线人数';
      }else{
        return "开启后，观看端显示在线人数";
      }
    },
    hotDesc(){
      if(this.formData.hot){
        return '已开启，观看端显示活动热度';
      }else{
        return "开启后，观看端显示活动热度";
      }
    },
    homeDesc(){
      if(this.formData.home){
        return '已开启，该活动在个人主页中显示';
      }else{
        return "开启后，该活动在个人主页中显示";
      }
    },
    capacityDesc(){
      if(this.formData.capacity){
        return `已开启，可以使用扩展包扩容并发人数（扩展包剩余${this.limitInfo.extend}人）`;
      }else{
        return `开启后，可以使用扩展包扩容并发人数（扩展包剩余${this.limitInfo.extend}人）`;
      }
    },
    limitCapacityDesc(){
      if(this.formData.limitCapacitySwtich){
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
    },
    start_line: function() {
      // 获取当前时分
      let sysDate = new Date();
      let hours = sysDate.getHours();
      let minutes = sysDate.getMinutes();
      if (hours <= 9) {
        hours = `0${hours}`
      }
      if (minutes <= 9) {
        minutes = `0${minutes}`
      }
      return `${hours}:${minutes}`;
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.isChange = true;
      }
    },
    selectMedia: {
      deep: true,
      handler() {
        this.isChange = true;
      }
    }
  },
  data(){
    return {
      formData: {
        title: '',
        date1: '',
        date2: '',
        content: ``,
        docSwtich: false,
        reservation: true,
        online: true,
        hot: true,
        home: true,
        capacity: false,
        limitCapacity: '',
        limitCapacitySwtich: false,
        imageUrl: '',
        domain_url: '',
      },
      liveMode: 2,
      showChecked: false,
      isChange: false,
      showDialog: false,
      startVal: '',
      limitInfo: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      liveTags: ["金融", '互联网', '汽车', '教育', '健康', '其他'],
      tagIndex: 0,
      loading: false,
      selectMedia: {},
      expireTimeOption: {
        disabledDate(time) {
          console.log(time, '?????????????')
          // formData.date1
          this.startVal = this.formData.date1.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          return startVal;
          // return this.formData.date1.getTime() < Date.now() - 24 * 60 * 60 * 1000
          // return time.getTime() < Date.now()
        }
      }
    };
  },
  beforeRouteEnter (to, from, next) {
    let userPhone = JSON.parse(sessionOrLocal.get('userInfo')).phone;
    if (!vm.$route.query.id && !userPhone) {
        vm.$alert('您还没有绑定手机，为了保证您的权益，请绑定后再发起直播！', '提示', {
          confirmButtonText: '立即绑定',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel',
          callback: action => {
            if (action === 'confirm') {
              vm.$router.push({path:'/acc/info', query: {tab: 1}});
            }
          }
        });
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
     // 离开页面前判断信息是否修改
    if (!this.isChange) {
      next()
      return false;
    }
    this.$confirm(`是否取消${this.title}的${this.webniarTypeToZH}内容？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'zdy-message-box',
      lockScroll: false,
      cancelButtonClass: 'zdy-confirm-cancel'
    }).then(() => {
      next()
    }).catch(() => {
    });
  },
  created(){
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
    // 发布为点播
    if (this.$route.query.record_id) {
      this.selectMedia = {
        id: this.$route.query.record_id,
        paas_record_id: this.$route.query.paas_record_id,
        name: this.$route.query.name
      }
      this.getLiveBaseInfo(this.$route.query.webinar_id)
    }
    this.versionType = JSON.parse(sessionOrLocal.get('versionType'));
    if (!this.versionType) {
      this.getHighLimit();
    }

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
        this.formData.imageUrl = this.liveDetailInfo.img_url;
        this.formData.domain_url = this.liveDetailInfo.img_url;
        console.log(this.domain_url, this.imageUrl, '封面地址');
        this.tagIndex = this.liveDetailInfo.category - 1;
        this.formData.home = this.liveDetailInfo.is_private == 1 ? false : true;
        this.formData.docSwtich = Boolean(this.liveDetailInfo.is_adi_watch_doc);
        this.formData.online = Boolean(this.liveDetailInfo.hide_watch);
        this.formData.reservation = Boolean(this.liveDetailInfo.hide_appointment);
        this.formData.content = this.liveDetailInfo.introduction;
        this.formData.hot = Boolean(this.liveDetailInfo.hide_pv);
        if (this.liveDetailInfo.webinar_curr_num) {
          this.formData.limitCapacity = this.liveDetailInfo.webinar_curr_num;
          this.formData.limitCapacitySwtich = true;
        } else {
          this.formData.limitCapacitySwtich = false;
        }
        this.formData.capacity = Boolean(this.liveDetailInfo.is_capacity);
        if (this.liveDetailInfo.paas_record_id) {
          this.selectMedia.paas_record_id = this.liveDetailInfo.paas_record_id;
          this.selectMedia.id = this.liveDetailInfo.record_id;
          this.selectMedia.name = this.liveDetailInfo.record_subject;
        }
        // 重置修改状态
        setTimeout(() => {
          this.isChange = false
        }, 300)
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    sendData(content) {
      this.formData.content = content;
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
        this.formData.imageUrl = file_url;
        this.formData.domain_url = domain_url;
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
        this.$message.error('上传封面图片大小不能超过 2M!');
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
      if (!this.versionType) {
        if (this.formData.limitCapacitySwtich && this.formData.limitCapacity > this.limitInfo.total) {
          this.$message.error(`最大并发数不能大于并发剩余量`);
          return;
        }
      }
      if (this.formData.limitCapacitySwtich && this.formData.limitCapacity < 1) {
        this.$message.error('最高并发请输入大于1的数值');
        return;
      }
      if (this.webniarTypeToZH == '点播' && !this.selectMedia.id) {
        this.$message.error(`请先上传视频`);
        return;
      }
      let data = {
        webinar_id: this.webinarId || '',
        record_id: this.webniarTypeToZH === '点播' ? this.selectMedia.id : '',
        subject: this.formData.title, // 标题
        introduction: this.formData.content, // 简介
        start_time: `${this.formData.date1} ${this.formData.date2}`, // 创建时间
        webinar_type: this.liveMode, // 1 音频 2 视频 3 互动
        category: this.tagIndex+1, // 类别 1 金融 2 互联网 3 汽车 4 教育 5 医疗 6 其他
        is_private: this.formData.home ? 0 : 1 , // 是否在个人主页显示
        // is_open: Number(this.home),  // 是否公开活动 默认0为公开，1为不公开
        hide_watch: Number(this.formData.online), // 是否显示在线人数  1 是 0 否
        is_adi_watch_doc: Number(this.formData.docSwtich),// 观众是否可预览文档 1 是 0 否
        hide_appointment: Number(this.formData.reservation),// 是否显示预约人数 1 是 0 否
        hide_pv: Number(this.formData.hot),// 是否显示活动热度 1 是 0 否
        webinar_curr_num: this.formData.limitCapacitySwtich ? this.formData.limitCapacity : 0,// 	最高并发 0 无限制
        is_capacity: Number(this.formData.capacity),// 是否扩容 1 是 0 否
        img_url: this.$parseURL(this.formData.imageUrl).path, // 封面图
        copy_webinar_id: this.title == '复制' ? this.webinarId : ''
      };
      if(this.$route.query.type != 2 ) {
         data = this.$params(data)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let url;
          if (this.webniarTypeToZH === '点播') {
            url = this.title === '编辑' ? 'liveEdit' : 'demandCreate';
          } else {
            url = this.title === '编辑' ? 'liveEdit' : 'createLive';
          }
          this.$fetch(url, this.$params(data)).then(res=>{
            if(res && res.code === 200) {
              this.$message.success(`${this.title}成功`);
              this.isChange = false;
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
    // 删除
    deleteSelectMedia() {
      this.selectMedia = {};
    },
    getHighLimit() {
      this.$fetch('getHighLimit').then(res => {
        this.limitInfo = res.data;
        // this.versionType = res.data.type;
      })
    },
    resetForm(formName) {
      this.$router.push({path: '/live/list'});
      // this.$refs[formName].resetFields();
      // if(this.$route.query.type == 2){
      //    this.$router.go(-1)
      // }else {
      //   this.$confirm(`取消将不保存此页面的内容？`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     customClass: 'zdy-message-box',
      //     lockScroll: false,
      //     cancelButtonClass: 'zdy-confirm-cancel'
      //   }).then(() => {
      //     // next();
      //       this.$router.go(-1)
      //   }).catch(() => {
      //     });
      // }
      // 重置直播模式、直播封面、直播简介。
    },
     // 鼠标离开
    hiddenMenu () {
      this.showChecked = false
    },
    //鼠标滑上去
    showMenu () {
      this.showChecked = true
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
      margin: 0 13px;
    }
    /deep/ .el-switch__label--right{
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
    /deep/.el-input__inner{
      height: 40px;
    }
    .title-inform /deep/.el-input__inner{
      padding: 0 12px;
    }
    // /deep/.el-date-editor {
    //   /deep/input {
    //     width: 270px;
    //   }
    // }
  }
  .item-time .el-form-item {
    margin-bottom: 0px;
  }
  .date{
    /deep/.el-input__prefix {
        left: 8px;
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
  /deep/.tox-tinymce{
    border-radius: 4px;
  }
  /deep/.el-upload--picture-card{
    border-radius: 4px;
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
      // height: 112px;
      width: 180px;
      border-radius: 4px;
      img{
        width: 100%;
        height: 112px;
        object-fit: scale-down;
        cursor: pointer;
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
        &.active{
          box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
        }
      }
      // position: relative;
      // overflow: hidden;
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
    // .model{
    //   width: 100px;
    //   height: 56px;
    //   margin: 0 auto;
    //   margin-top: 16px;
    //   img{
    //     width: 100%;
    //     height: 100%;
    //     object-fit: scale-down;
    //   }
    //   .el-aside{
    //     margin-right: 2px;
    //   }
    //   .el-header{
    //     margin-bottom: 2px;
    //   }
    //   .el-header,.el-main{
    //     padding: 0;
    //   }
    //   .block{
    //     background: #F2F2F2;
    //     position: relative;
    //   }
    //   .icon{
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     margin: auto;
    //     font-size: 20px;
    //     color: #999999;
    //     height: fit-content;
    //     width: fit-content;
    //   }
    // }
    .desc{
      font-size: 14px;
      text-align: center;
      line-height: 5px;
    }
  }
  .modeHide{
    position: absolute;
    top: 0;
    left: 0;
    height: 130px;
    width: 100%;
    margin-top: 30px;
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
  }
  .editBox {
    .common-button {
      height: 40px;
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
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 148px;
    display: table;
    position: relative;
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
      }
      /deep/.saasicon-eye, /deep/.saasicon_shanchu{
        font-size: 30px!important;
        height: 30px;
      }
    }
    .operaBtn{
      font-size: 14px;
      color: #fff;
    }
    &:hover{
      border-color: #999;
    }
    .mediaSlot{
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
      color: #999999;
      background: #f7f7f7;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      i{
        font-size: 30px;
      }
      /deep/.iconfont-v3{
        font-size: 26px;

      }
      /deep/.saasicon_shangchuan{
        font-size: 44px;
      }
      /deep/.saasshipinwenjian{
        color: #FF733C;
      }
      p{
        padding-top: 5px;
      }
    }
    .el-tooltip{
      position: absolute;
      right: -24px;
      top: -10px;
      i{
        font-size: 14px;
      }
    }
  }
  .vh-dialog{
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
      right: 0px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body{
      width: 642px;
      height: 375px;
      border-top: 16px solid #333;
      border-bottom: 16px solid #333;
      background: #333;
      border-radius: 4px;
      padding: 0 20px;
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
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
