<template>
  <div>
    <el-form :model="unitImgLinkForm" ref="unitImgLinkForm" :rules="unitImgLinkFormRules" label-width="94px">
      <el-form-item label="图片链：" prop="imageSrc">
        <upload
          :class="'upload__imgLink ' + imgType"
          v-model="unitImgLinkForm.imageSrc"
          :value="unitImgLinkForm.imageSrc"
          :saveData="{
             path: 'interacts/menu-imgs',
             type: 'image',
          }"
          :domain_url="domain_url"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <div slot="tip">
            <p>推荐尺寸：600*600px</p>
            <p>图片不超过100K</p>
            <p>(支持jpg、gif、png、bmp)</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="跳转地址：" prop="src">
        <el-input type="text" placeholder="请输入链接" v-model="unitImgLinkForm.src" show-word-limit/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
export default {
  name: "unitImgLink.vue",
  components: {
    Upload
  },
  data() {
    return {
      showCompIndex: 0,
      imgType: 'default', // 默认宽高相等
      unitImgLinkForm: {
        component_id: '',
        msg: '',
        imageSrc: '',
        src: ''
      },
      domain_url: '',
      unitImgLinkFormRules: {
        imageSrc: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ],
        src: [
          { required: true, message: '跳转地址不能为空', trigger: 'blur' },
          { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的跳转地址' , trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      // this.unitImgLinkForm.imageSrc = URL.createObjectURL(file.raw);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        // let file_url = res.data.file_url || '';
        this.unitImgLinkForm.imageSrc = domain_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.unitImgLinkForm.validateField('imageSrc');
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
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
      this.$message.error(`图片上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      // debugger
      console.log('图片链编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitTextLinkForm) {
      //   this.$refs.unitTextLinkForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.imageSrc !== '' && compVo.compInfo.imageSrc !== null && compVo.compInfo.imageSrc !== undefined) {
        this.unitImgLinkForm.imageSrc = compVo.compInfo.imageSrc;
        this.unitImgLinkForm.src = compVo.compInfo.src;
        this.domain_url = compVo.compInfo.imageSrc;
      } else {
        this.unitImgLinkForm.imageSrc = '';
        this.unitImgLinkForm.src = '';
        this.domain_url = '';
      }
      // 默认组件类别 和 组件名称
      this.unitImgLinkForm.component_id = compVo.component_id;
      this.unitImgLinkForm.msg = compVo.name;
      this.showCompIndex = index;
    },
    sendData() {
      this.$refs.unitImgLinkForm.validate((valid) => {
        if (valid) {
          this.$emit('cxtChangeInfo', {
            content: JSON.stringify(this.unitImgLinkForm),
            type: 'img-link',
            compIndex: this.showCompIndex
          });
        }
      });
    }
  },
  watch: {
    'unitImgLinkForm.imageSrc': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    },
    'unitImgLinkForm.src': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    }
  }
};
</script>

<style lang="less" scoped>
/* 二维码上传 */
.upload__imgLink {
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
</style>
