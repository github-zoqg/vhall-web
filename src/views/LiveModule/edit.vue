<template>
  <div class="editBox">
    <pageTitle :title="`创建${webniarTypeToZH}`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" v-loading="loading">
      <el-form-item :label="`${webniarTypeToZH}标题：`" prop="title"
      :rules="[
        { required: true, message: '请输入直播标题', trigger: 'blur' },
      ]">
        <el-input v-model="formData.title" limit='100'></el-input>
      </el-form-item>
      <el-form-item label="直播时间：" required v-if="webniarType=='live'">
        <!-- <el-row :gutter="20"> -->
          <el-col :span="11">
            <el-form-item prop="date1" :rules="[
              { required: true, message: '请选择直播开始日期', trigger: 'blur' }
            ]">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="formData.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2" :rules="[
              { required: true, message: '请选择直播开始时间', trigger: 'blur' }
            ]">
              <el-time-picker placeholder="选择时间" value-format="HH:mm:ss" v-model="formData.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        <!-- </el-row> -->
      </el-form-item>
      <el-form-item label="直播模式：" required v-if="webniarType=='live'">
        <div class="modeBox">
          <div @click='liveMode=2' :class="{active: liveMode== 2}">
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
          <div @click='liveMode=3' :class="{active: liveMode== 3}">
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
          </div>
          <div @click='liveMode=1' :class="{active: liveMode== 1}">
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
      </el-form-item>
      <el-form-item :label="`${webniarTypeToZH}封面：`">
        <upload
          v-model="imageUrl"
          :on-success="handleuploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler">
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
            <i class="el-icon-moon-night"></i>
            <p>{{selectMedia.name}}</p>
          </div>
          <div class="abRight" v-if="!!selectMedia">
            <el-button type="text" class="operaBtn">预览</el-button>
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
        <editor ref="editor"></editor>
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
         v-if="webniarType=='live'"
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
        :active-text="limitCapacityDesc">
      </el-switch>
      <el-input placeholder="请输入限制并发数" v-show="limitCapacitySwtich" v-model="limitCapacity" class="limitInput"></el-input>
      <p class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')" round>保存</el-button>
        <el-button @click="resetForm('ruleForm')" round>取消</el-button>
      </p>
    </el-form>
    <selectMedia ref="selecteMedia" @selected='mediaSelected'></selectMedia>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import editor from '@/components/WangEditor/main';
import upload from '@/components/Upload/main';
import selectMedia from './selecteMedia';
export default {
  components: {
    PageTitle,
    editor,
    upload,
    selectMedia
  },
  computed: {
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
        return "开启后，使用扩展包扩容并发人数（扩展包剩余X人）";
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
    }
  },
  data(){
    return {
      formData: {
        title: '',
        date1: '',
        date2: ''
      },
      docSwtich: false,
      reservation: false,
      online: false,
      hot: false,
      home: false,
      capacity: false,
      limitCapacity: '',
      limitCapacitySwtich: false,
      liveTags: ["金融", '互联网', '汽车', '教育', '健康', '其他'],
      liveMode: 2,
      tagIndex: 0,
      loading: false,
      imageUrl: '',
      selectMedia: null
    };
  },
  created(){
    console.log(this.$route);
  },
  methods: {
    handleuploadSuccess(res, file){
      console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            subject: this.formData.title,
            introduction: this.$refs.editor.editor.txt.html(),
            start_date: this.formData.date1,
            start_time: this.formData.date2,
            webinar_type: this.liveMode,
            category: 2,
            img_url: '//t-alistatic01.e.vhall.com/upload/webinars/img_url/7e/65/7e651ca254943327ab8d7d133ed2d778.jpg',
            is_private: Boolean(this.home),
            is_open: Boolean(this.home),
            hide_watch: Boolean(this.online),
            is_adi_watch_doc: Boolean(this.docSwtich),
            hide_appointment: Boolean(this.reservation),
            hide_pv: Boolean(this.hot),
            is_capacity: Boolean(this.capacity),
            webinar_curr_num: this.limitCapacitySwtich ? this.limitCapacity : 0
          };
          this.loading = true;
          this.$fetch('createLive', data).then(res=>{
            this.$message.success(`创建成功`);
            console.log(res);
            setTimeout(()=>{
              this.$router.push({name: 'liveList'});
            }, 500);
          }).catch(error=>{
            this.$message.error(`创建失败，${error.message}`);
          }).finally(()=>{
            this.loading = false;
          });
          console.log(data);
          // createLive
          // alert('submit!');
        } else {
          this.$message.error('请完善必填字段');
          document.documentElement.scrollTop = 0;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    mediaSelected(media){
      this.selectMedia = media;
    }
  },
};
</script>

<style lang="less" scoped>
  .el-form{
    background: #ffffff;
    padding: 60px 80px;
    margin-top: 30px;
    /deep/ .el-switch__label--left{
      color: #1A1A1A;
      pointer-events: none;
      user-select: none;
    }
    /deep/ .el-switch__label--right{
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
  }
  .el-form-item{
    width: 100%;
    max-width: 640px;
  }
  /deep/ .el-form-item__label{
    float: none;
  }
  .line{
    text-align: center;
    width: 20px;
  }
  .modeBox{
    display: flex;
    justify-content: space-between;
    >div{
      height: 112px;
      width: 200px;
      border-radius: 4px;
      border: 1px solid #CCCCCC;
      cursor: pointer;
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
    text-align: center;
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
  .editBox {
    padding: 0px 40px;
  }
  @media screen and (min-width: 1920px) {
    .editBox {
      padding: 0px 140px;
    }
  }
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
    }
    .el-tooltip{
      position: absolute;
      right: -24px;
      top: 0px;
      font-size: 16px;
    }
  }
</style>
<style lang="css">
  html{
    background: #F7F7F7;
  }
</style>
