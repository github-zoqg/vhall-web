<template>
  <div class="editBox">
    <pageTitle :title="`${$route.query.title || '创建'}专题`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" :rules="rules" v-loading="loading" label-width="100px">
      <el-form-item label="专题标题:" prop="title">
        <el-input v-model="formData.title" limit='100'></el-input>
      </el-form-item>
      <el-form-item label="专题封面:">
        <upload
          v-model="imageUrl"
          :domain_url="domain_url"
          :saveData="{
             path: 'webinars/subject-imgs',
             type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler">
          <p slot="tip">最佳头图尺寸：1280*720px <br/>小于2MB(支持jpg、gif、png、bmp)</p>
        </upload>
      </el-form-item>
      <el-form-item label="专题简介:" required>
        <v-editor save-type='special' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" :value="content"></v-editor>
      </el-form-item>
      <el-form-item label="预约人数:">
         <el-switch
          v-model="reservation"
          :active-value="1"
          :inactive-value="0"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          :active-text="reservationDesc">
        </el-switch>
      </el-form-item>
      <el-form-item label="活动热度:">
        <el-switch
          v-model="hot"
          :active-value="1"
          :inactive-value="0"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          :active-text="hotDesc">
        </el-switch>
      </el-form-item>
      <el-form-item label="关联主页:">
        <el-switch
          v-model="home"
          :active-value="1"
          :inactive-value="0"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          :active-text="homeDesc">
        </el-switch>
      </el-form-item>
      <el-form-item label="专题目录:">
         <el-button size="small" @click="showActiveSelect = true">添加</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submitForm('ruleForm')" round>保存</el-button>
        <el-button @click="resetForm('ruleForm')" round>取消</el-button>
      </el-form-item>
    </el-form>
    <chose-actives
      v-if="showActiveSelect"
      :checkedList="selectedActives"
      @cacelSelect="showActiveSelect = false"
      @selectedEvent="doSelectedActives"
    ></chose-actives>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import VEditor from '@/components/Tinymce';
import Env from "@/api/env";
import ChoseActives from './components/choseActives'

export default {
  components: {
    PageTitle,
    VEditor,
    upload,
    ChoseActives
  },
  computed: {
    reservationDesc(){
      return this.reservation ?  '关闭后，观看端将隐藏预约人数' : '已关闭，观看端已隐藏预约人数';
    },
    hotDesc(){
      return this.hot ? '关闭后，观看端将隐藏活动热度' : "已关闭，观看端已隐藏活动热度";
    },
    homeDesc(){
      return this.home ? '关闭后，该直播将不在个人主页显示' : "已关闭，该直播已不在个人主页显示";
    }
  },
  data(){
    return {
      showActiveSelect: false,
      selectedActives: [],

      formData: {
        title: '',
      },
      subject_id: '',
      reservation: false,
      hot: false,
      home: false,
      loading: false,
      imageUrl: '',
      domain_url:'',
      content: '',
      webinarIds: ['856483543'],
      rules: {
        title: [
          { required: true, message: '请输入专题标题', trigger: 'blur' }
        ]
      }
    };
  },
  created(){
    // console.log(this.$route.query.title, '111111111111111111');
  },
  methods: {
    sendData(content) {
      this.content = content;
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.imageUrl = file_url;
        this.domain_url = domain_url;
      }
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
            introduction: this.content,
            img_url: this.imageUrl,
            is_private: this.home,
            hide_appointment: this.reservation,
            hide_pv: this.hot,
            webinar_ids: this.webinarIds.join(',')
          };
          this.loading = true;
          let url = this.$route.query.title === '编辑' ? 'subjectEdit' : 'subjectCreate';
          this.$fetch(url, this.$params(data)).then(res=>{
            this.subject_id = res.data.subject_id;
            this.$message.success(`创建成功`);
            console.log(res);
            setTimeout(()=>{
              this.$router.push({path: '/special'});
            }, 500);
          }).catch(error=>{
            this.$message.error(`创建失败，${error.message}`);
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    doSelectedActives (selectedActives) {
      this.selectedActives = selectedActives
      this.showActiveSelect = false
    }
  },
};
</script>

<style lang="less" scoped>
  .el-form{
    background: #ffffff;
    padding: 48px 20px 50px 48px;
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
 /* .editBox {
    padding: 0px 40px;
  }
  @media screen and (min-width: 1920px) {
    .editBox {
      padding: 0px 140px;
    }
  }*/
</style>
<style lang="css">
  html{
    background: #F7F7F7;
  }
</style>
