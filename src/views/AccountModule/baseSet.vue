<template>
  <div class="base--set">
    <el-form :model="baseSetForm" ref="baseSetForm" :rules="baseSetFormRules" label-width="94px">
      <el-form-item label="账号昵称：" prop="nick_name">
        <el-input type="text" placeholder="请输入账号昵称" v-model="baseSetForm.nick_name" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="账号头像：" prop="avatar">
        <upload
          :class="'upload__avatar ' + imgType"
          v-model="baseSetForm.avatar"
          :domain_url="domain_url"
          :saveData="{
             path: 'users/face-imgs',
             type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler"
          @delete="baseSetForm.avatar = ''">
          <div slot="tip">
            <p>推荐尺寸：100*100px</p>
            <p>图片不超过100K</p>
            <p>(支持jpg、gif、png、bmp)</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="公司名称：" prop="company">
        <el-input type="text" placeholder="请输入公司名称" v-model="baseSetForm.company" maxlength="30" />
      </el-form-item>
      <el-form-item label="您的职业：" prop="position">
        <el-input type="text" placeholder="请输入您的职业" v-model="baseSetForm.position" maxlength="15" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="length152" round @click.prevent.stop="baseSetSave">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
export default {
  name: "baseSet.vue",
  components: {
    Upload
  },
  data() {
    return {
      imgType: 'default', // 默认宽高相等
      domain_url: '',
      baseSetForm: {
        nick_name: '',
        avatar: '',
        company: '',
        position: ''
      },
      baseSetFormRules: {
        nick_name: [
          { required: true, message: '账号昵称不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入账号昵称', trigger: 'blur' }
        ],
        company: [
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
        ],
        position: [
          { max: 15, message: '最多可输入15个字符', trigger: 'blur' },
        ],
      },
      accountInfo: null
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.baseSetForm.avatar = file_url;
        this.domain_url = domain_url;
      }
    },
    beforeUploadHandler(file){
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
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.imgType = 'widthMore';
        } else if (img.width < img.height) {
          that.imgType = 'heightMore';
        } else {
          that.imgType = 'default';
        }
      };
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
    initComp() {
      let account_info = sessionOrLocal.get('userInfo');
      if(account_info !== null) {
        let accountInfo = JSON.parse(account_info);
        this.baseSetForm = accountInfo;
        this.domain_url = accountInfo.avatar;
        console.log(this.domain_url, this.baseSetForm.avatar, '其它头像地址');
      }
    },
    // 保存
    baseSetSave() {
      this.$refs.baseSetForm.validate((valid) => {
        if(valid) {
          let params = {
            nick_name: this.baseSetForm.nick_name,
            avatar: this.$parseURL(this.baseSetForm.avatar).path,
            company: this.baseSetForm.company,
            position: this.baseSetForm.position
          };
          // 昵称、头像、公司、职位 可修改
          this.$fetch('userEdit', params).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('保存基本设置成功');
              // 更新账户信息
              this.getAccountInfo();
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
    getAccountInfo() {
      this.$fetch('getInfo', {
        scene_id: 2
      }).then(res =>{
        if(res.code === 200 && res.data) {
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
          this.$EventBus.$emit('saas_vs_account_change', res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.base--set {
  .padding41-40();
}
/deep/.el-form-item__label {
  padding: 0 10px 0 0;
}
/deep/.el-form-item {
  margin-bottom: 32px;
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
.save-btn {
  margin: 40px auto;
}
</style>
