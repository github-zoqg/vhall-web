<template>
	<div>
    <el-form :model="unitRQCodeForm" ref="unitRQCodeForm" :rules="unitRQCodeFormRules" label-width="94px">
      <el-form-item label="二维码：" prop="rqCode">
        <upload
          :class="'upload__qrCode ' + imgType"
          v-model="unitRQCodeForm.imageSrc"
          :value="unitRQCodeForm.imageSrc"
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
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
export default {
  name: "rqCode.vue",
  components: {
    Upload
  },
  data() {
    return {
      showCompIndex: 0,
      imgType: 'default', // 默认宽高相等
      unitRQCodeForm: {
        component_id: '',
        msg: '',
        imageSrc: '',
        isDefault: false,
        hrc: ''
      },
      unitRQCodeFormRules: {
        imageSrc: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      let url = URL.createObjectURL(file.raw);
      this.unitRQCodeForm.imageSrc = url;
      this.unitRQCodeForm.hrc = url;
      this.unitRQCodeForm.isDefault = false;
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
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('二维码编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitRQCodeForm) {
      //   this.$refs.unitRQCodeForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.imageSrc !== '' && compVo.compInfo.imageSrc !== null && compVo.compInfo.imageSrc !== undefined && compVo.compInfo.isDefault === false) {
        this.unitRQCodeForm.imageSrc = compVo.compInfo.imageSrc;
        this.unitRQCodeForm.hrc = compVo.compInfo.hrc;
      } else {
        this.unitRQCodeForm.imageSrc = '';
        this.unitRQCodeForm.hrc = '';
      }
      // 默认组件类别 和 组件名称
      this.unitRQCodeForm.component_id = compVo.component_id;
      this.unitRQCodeForm.msg = compVo.name;
      this.showCompIndex = index;
    },
    sendData() {
      this.$refs.unitRQCodeForm.validate((valid) => {
        if (valid) {
          this.$emit('cxtChangeInfo', {
            content: JSON.stringify(this.unitRQCodeForm),
            type: 'rq-code',
            compIndex: this.showCompIndex
          });
        }
      });
    }
  },
  watch: {
    'unitRQCodeForm.imageSrc': {
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
.upload__qrCode {
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
