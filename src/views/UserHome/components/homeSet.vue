<template>
  <div class="home--set--info">
    <el-form :model="homeSetInfoForm" ref="homeSetInfoForm" :rules="homeSetInfoFormRules" label-width="94px">
      <el-form-item label="主页标题：" prop="title">
        <el-input type="text" placeholder="请输入账号昵称" v-model="homeSetInfoForm.title" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="主页头像：" prop="homepage_avatar">
        <upload
          :class="'upload__avatar ' + avatarImgType"
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
            <p>推荐尺寸：100*100px</p>
            <p>图片不超过100K</p>
            <p>(支持jpg、gif、png、bmp)</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="主页简介：" prop="content">
        <v-editor  :isReturn=true @returnChange="sendRewardData" ref="contentEditor"
                   v-model="homeSetInfoForm.content"
                   toolbar="fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | fullscreen">
        </v-editor>
      </el-form-item>
      <el-form-item label="背景图片：" prop="img_url">
        <upload
          :class="'upload__bg__avatar ' + imgType"
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
            <p>推荐尺寸：100*100px,图片比例 16:9</p>
            <p>图片不超过2MB</p>
            <p>(支持jpg、gif、png、bmp)</p>
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
            :active-text="homeSetInfoForm.show_share ? '关闭后，主页分享按钮将隐藏' : '已关闭，主页分享按钮已隐藏'"
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
            :active-text="homeSetInfoForm.show_webinar_list ? '关闭后，主页将隐藏【直播】列表' : '已关闭，主页已隐藏【直播】列表'"
          >
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item label="专题展示" class="switch-form-item">
        <div class="switch__box">
          <el-switch
            v-model="homeSetInfoForm.show_subject"
            :active-value="1"
            :inactive-value="0"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            :active-text="homeSetInfoForm.show_subject ? '关闭后，主页将隐藏【专题】列表' : '已关闭，主页已隐藏【专题】列表'"
          >
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" round @click.prevent.stop="saveHandle">保 存</el-button>
        <el-button round @click.prevent.stop="returnHandle">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import VEditor from '@/components/Tinymce';
import { sessionOrLocal } from "@/utils/utils";
import Env from "@/api/env";
export default {
  name: "homeSetInfo.vue",
  components: {
    Upload,
    VEditor
  },
  data() {
    return {
      avatarImgType: 'default',
      imgType: 'default',
      homeSetInfoForm: {
        homepage_avatar: '',
        content: '',
        img_url: '', // 背景图片
        show_share: 0, // 分享
        show_webinar_list: 0, // 直播列表展示：0不展示 1展示
        show_subject: 0, // 专题展示：0不展示 1展示
        title: ''
      },
      homeSetInfoFormRules: {
        title: [
          { required: true, message: '主页标题不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入主页标题', trigger: 'blur' }
        ]
      },
      domain_url: '',
      domain_bg_url: ''
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
        this.$message.error('上传主页头像图片大小不能超过 2MB!');
        return;
      }
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.homeSetInfoForm.avatarImgType = 'widthMore';
        } else if (img.width < img.height) {
          that.homeSetInfoForm.avatarImgType = 'heightMore';
        } else {
          that.homeSetInfoForm.avatarImgType = 'default';
        }
      };
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
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.homeSetInfoForm.imgType = 'widthMore';
        } else if (img.width < img.height) {
          that.homeSetInfoForm.imgType = 'heightMore';
        } else {
          that.homeSetInfoForm.imgType = 'default';
        }
      };
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
            homepage_avatar: this.$parseURL(this.homeSetInfoForm.homepage_avatar).path,
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
              /*this.$router.push({
                path: `/user/home/${this.$route.params.str}`
              });*/
              window.location.reload();
            } else {
              this.$message.error(res.msg || '保存基本设置失败');
            }
          }).catch(err=>{
            console.log(err);
            this.$message.error('保存基本设置失败');
          });
        }
      });
    },
    returnHandle() {
      this.$emit('showSet', false);
    },
    homeInfoGet() {
      this.$fetch('homeInfoGet', {
        home_user_id: sessionOrLocal.get('userId')
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          let { homepage_info } = res.data;
          // homepage_info.homepage_avatar = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.homepage_avatar || '');
          // homepage_info.img_url = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, homepage_info.img_url || '');
          // console.log(homepage_info.imgShowUrl );
          this.homeSetInfoForm = homepage_info;
          this.domain_url = homepage_info.homepage_avatar;
          this.domain_bg_url = homepage_info.img_url;
          console.log(this.domain_url, this.domain_bg_url, '主页头像、主页背景');
        }
      }).catch(err=>{
        console.log(err);
      });
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
  .padding41-40();
  .min-height();
  /deep/.el-form {
    width: 800px;
  }
}
/deep/.el-form-item {
  margin-bottom: 32px;
  &.switch-form-item {
    margin-bottom: 0;
  }
  &:last-child {
    margin-top: 32px;
    margin-bottom: 32px;
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
    width: 180px;
    height: 180px;
    border: 1px solid #CCCCCC;
    img {
      width: 100%;
      height: auto;
    }
  }
  /deep/.box > div {
    width: 180px;
    height: 180px;
  }
  &.withMore {
    /deep/.el-upload--picture-card {
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  &.heightMore {
    /deep/.el-upload--picture-card {
      img {
        width: auto;
        height: 100%;
      }
    }
  }
}
.upload__bg__avatar {
  /deep/.el-upload--picture-card {
    width: 400px;
    height: 169px;
    border: 1px solid #CCCCCC;
    img {
      width: 100%;
      height: auto;
    }
  }
  /deep/.box > div {
    width: 180px;
    height: 180px;
  }
  &.withMore {
    /deep/.el-upload--picture-card {
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  &.heightMore {
    /deep/.el-upload--picture-card {
      img {
        width: auto;
        height: 100%;
      }
    }
  }
}
</style>
