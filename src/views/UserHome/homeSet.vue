<template>
  <div>
    <pageTitle title="个人主页"></pageTitle>
    <div class="home--set--info">
      <el-form :model="homeSetInfoForm" ref="homeSetInfoForm" :rules="homeSetInfoFormRules" label-width="94px">
        <el-form-item label="主页标题" prop="title">
          <el-input type="text" placeholder="请输入账号昵称" v-model.trim="homeSetInfoForm.title" maxlength="30" class="input-length">
            <template slot="append">
              <span class="">{{homeSetInfoForm && homeSetInfoForm.title ? homeSetInfoForm.title.length : 0}}</span>/<span>30</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="主页头像" prop="homepage_avatar">
          <upload
            class="upload__avatar"
            v-model="homeSetInfoForm.homepage_avatar"
            :domain_url="domain_url"
            :saveData="{
             path: 'users/homepage-imgs',
             type: 'image',
          }"
            :on-success="handleUploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="homeSetInfoForm.homepage_avatar = ''">
            <div slot="tip">
              <p>建议尺寸：128*128px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="主页简介" prop="content">
          <!--<v-editor  :isReturn=true @returnChange="sendRewardData" ref="contentEditor"
                     v-model="homeSetInfoForm.content"
                     toolbar="fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | fullscreen">
          </v-editor>-->
          <el-input
            type="textarea"
            :rows="5"
            v-model.trim="homeSetInfoForm.content"
            maxlength="150"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="背景图片" prop="img_url">
          <upload
            class="upload__bg__avatar"
            v-model="homeSetInfoForm.img_url"
            :domain_url="domain_bg_url"
            :saveData="{
           path: 'users/homepage-imgs',
           type: 'image',
          }"
            :on-success="handleUploadSuccessBg"
            :on-progress="uploadProcessBg"
            :on-error="uploadErrorBg"
            :on-preview="uploadPreviewBg"
            :before-upload="beforeUploadHandlerBg"
            @delete="homeSetInfoForm.img_url = ''">
            <div slot="tip">
              <p>建议尺寸：1280*768px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="分享" class="switch-form-item">
          <div class="switch__box">
            <el-switch
              v-model="homeSetInfoForm.show_share"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              :active-text="homeSetInfoForm.show_share ? '已开启，主页显示分享功能' : '开启后，主页显示分享功能'"
            >
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item label="直播列表" class="switch-form-item">
          <div class="switch__box">
            <el-switch
              v-model="homeSetInfoForm.show_webinar_list"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              :active-text="homeSetInfoForm.show_webinar_list ? '已开启，个人主页显示直播列表Tab页' : '开启后，个人主页显示直播列表Tab页'"
            >
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item label="专题展示">
          <div class="switch__box">
            <el-switch
              v-model="homeSetInfoForm.show_subject"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              :active-text="homeSetInfoForm.show_subject ? '已开启，个人主页显示专题列表Tab页' : '开启后，个人主页显示专题列表Tab页'"
            >
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" v-preventReClick round @click.prevent.stop="saveHandle">保 存</el-button>
          <el-button round @click.prevent.stop="returnHandle">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from "@/utils/utils";
export default {
  name: "homeSetInfo.vue",
  components: {
    Upload,
    PageTitle
  },
  data() {
    return {
      homeSetInfoForm: {
        homepage_avatar: '',
        content: '',
        img_url: '', // 背景图片
        show_share: 1, // 分享
        show_webinar_list: 1, // 直播列表展示：0不展示 1展示
        show_subject: 1, // 专题展示：0不展示 1展示
        title: ''
      },
      homeSetInfoFormRules: {
        title: [
          { required: true, message: '主页标题不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入主页标题', trigger: 'blur' }
        ],
        content: [
          { required: false, message: '最多可输入150个字符', trigger: 'blur' },
          { max: 150, message: '最多可输入150个字符', trigger: 'blur' }
        ]
      },
      domain_url: '',
      domain_bg_url: '',
      isEdit: false
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      // this.homeSetInfoForm.homepage_avatar = URL.createObjectURL(file.raw);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.homeSetInfoForm.homepage_avatar = file_url;
        this.domain_url = domain_url;
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`主页头像只能是 ${typeList.join('、')} 格式!`);
        return;
      }
      if (!isLt2M) {
        this.$message.error('上传主页头像图片大小不能超过 2M!');
        return;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`主页头像上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleUploadSuccessBg(res, file){
      console.log(res, file);
      // this.homeSetInfoForm.img_url = URL.createObjectURL(file.raw);
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.homeSetInfoForm.img_url = file_url;
        this.domain_bg_url = domain_url;
      }
    },
    beforeUploadHandlerBg(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传背景图片只能是 ${typeList.join('、')} 格式!`);
        return;
      }
      if (!isLt2M) {
        this.$message.error('上传背景图片大小不能超过 2MB!');
        return;
      }
      return isType && isLt2M;
    },
    uploadProcessBg(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadErrorBg(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`主页背景上传失败`);
    },
    uploadPreviewBg(file){
      console.log('uploadPreview', file);
    },
    sendRewardData(content) {
      console.log(content);
      if (content) {
        this.homeSetInfoForm.content = content;
      }
    },
    saveHandle() {
      this.$refs.homeSetInfoForm.validate((valid) => {
        if(valid) {
          let params = {
            img_url: this.$parseURL(this.homeSetInfoForm.img_url).path,
            homepage_avatar: this.homeSetInfoForm.homepage_avatar ? this.$parseURL(this.homeSetInfoForm.homepage_avatar).path : '',
            content: this.homeSetInfoForm.content,
            show_share: this.homeSetInfoForm.show_share, // 分享
            show_webinar_list: this.homeSetInfoForm.show_webinar_list, // 直播列表展示：0不展示 1展示
            show_subject: this.homeSetInfoForm.show_subject, // 专题展示：0不展示 1展示
            title: this.homeSetInfoForm.title
          };
          if(this.homeSetInfoForm.id) {
            params.id = this.homeSetInfoForm.id;
          }
          this.$fetch(this.homeSetInfoForm.id ? 'homeInfoEdit' : 'homeInfoCreate', params).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('保存基本设置成功');
              // 回到前一个页面
              this.$router.push({
                path: `/account/myHome`
              });
              // window.location.reload();
            } else {
              this.$message.error(res.msg || '保存基本设置失败');
            }
          }).catch(err=>{
            console.log(err);
            this.$message.error(err.msg || '保存基本设置失败');
          });
        }
      });
    },
    returnHandle() {
      this.$refs['homeSetInfoForm'].resetFields();
      this.isEditUnit = false;
      this.$router.push({
        path: `/account/myHome`
      })
    },
    homeInfoGet() {
      this.$fetch('homeInfoGet', {
        home_user_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          let { homepage_info } = res.data;
          // homepage_info.homepage_avatar = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.homepage_avatar || '');
          // homepage_info.img_url = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.img_url || '');
          // console.log(homepage_info.imgShowUrl );
          this.homeSetInfoForm = homepage_info || {
            show_share: 1, // 分享
            show_webinar_list: 1, // 直播列表展示：0不展示 1展示
            show_subject: 1 // 专题展示：0不展示 1展示
          };
          this.beforeData = Object.assign({},this.homeSetInfoForm);
          this.domain_url = homepage_info.homepage_avatar || '';
          this.domain_bg_url = homepage_info.img_url || '';
          console.log(this.domain_url, this.domain_bg_url, '主页头像、主页背景');
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    beforeRouteLeave(to, from, next) {
    }
  },
  created() {
    this.homeInfoGet();
  }
};
</script>

<style lang="less" scoped>
.home--set--info {
  .layout--right--main();
  .padding-form();
  .min-height();
  /deep/.el-form {
    width: 800px;
  }
  /deep/.el-form-item__content {
    width: 641px;
  }
}
/deep/.el-form-item {
  margin-bottom: 32px;
  &.switch-form-item {
    margin-bottom: 12px;
  }
  &:last-child {
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
/deep/.el-switch__label {
  color: #999999;
}
/deep/.el-switch__label.is-active {
  color: #999999;
}
/* 图片上传 */
.upload__avatar {
  /deep/.el-upload--picture-card {
    width: 641px;
    height: 180px;
  }
  /deep/.box > div {
    width: 641px;
    height: 180px;
  }
}
.upload__bg__avatar {
  /deep/.el-upload--picture-card {
    width: 641px;
    height: 180px;
  }
  /deep/.box > div {
    width: 641px;
    height: 180px;
  }
}
</style>
