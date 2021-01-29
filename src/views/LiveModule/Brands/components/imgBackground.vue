<template>
  <VhallDialog
    title="选择封面背景"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="700px"
  >
    <el-scrollbar class="scrollbar scroll-modify">
      <div class="background-list">
        <div class="list-item" @click.stop="domain_url && choseBackground(-1)">
          <upload
            v-model="imageUrl"
            :domain_url="domain_url"
            :saveData="{
               path: 'interacts/invite-card-imgs',
               type: 'image',
            }"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :restPic="true"
            @delete="daleteImg()"
            @handleFileChange="handleFileChange"
            :before-upload="beforeUploadHnadler">
            <div slot="tip">
              <p>建议尺寸：750*1334px,小于4M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
          <label  class="img-tangle" v-if="isType === 0"><img src="../../../../common/images/icon-choose.png" alt=""></label>
          <!-- <label class="img-tangle" v-show="isType==0">
            <i class="el-icon-check"></i>
          </label> -->
        </div>
        <div class="list-item list-imgs is-success" v-for="(item, index) in fileList" :key="index">
          <label  class="img-tangle" v-if="isType === index + 1"><img src="../../../../common/images/icon-choose.png" alt=""></label>
          <!-- <label class="img-tangle" v-if="isType === index + 1">
            <i class="el-icon-check"></i>
          </label> -->
          <img :src="item" alt="" class="bgImg" @click="choseBackground(index)"/>
        </div>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button round  size="medium" v-preventReClick type="primary" @click.prevent.stop="changePic">选 择</el-button>
      <el-button round size="medium"  @click.prevent.stop="dialogVisible = false">取 消</el-button>
    </div>
  </VhallDialog>
</template>
<script>
import upload from '@/components/Upload/main';
import Env from '@/api/env';
export default {
  data() {
    return {
      dialogVisible: false,
      advertisement: {},
      imageUrl: '',
      domain_url: '',
      isType: 1,
      fileList: [
        `${Env.staticImgs.invitation[0]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[1]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[2]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[3]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[4]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[5]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[6]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[7]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[8]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
      ],
    };
  },
  components: {
    upload
  },
  props: ['url', 'type'],
  watch: {
   dialogVisible() {
     if (this.dialogVisible) {
        this.domain_url  = this.url || '';
        this.imageUrl = this.url;
        if (this.imageUrl) {
          this.isType = 0;
        } else {
          this.isType = this.type
        }
     }
   }
  },
  methods: {
    choseBackground(index) {
      this.isType = index + 1;
    },
    changePic() {
      this.$emit('onChangePic', this.isType, this.imageUrl, this.domain_url);
      this.dialogVisible = false;
    },
    daleteImg() {
      this.isType = 1;
      this.imageUrl = '';
      this.domain_url = '';
      this.url = '';
    },
    handleuploadSuccess(res, file) {
      console.log(res, file);
      // this.imageUrl = URL.createObjectURL(file.raw);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.imageUrl = file_url;
        this.domain_url = domain_url;
        this.isType = 0;
      }
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.$message({
          message: `背景图片只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `背景图片大小不能超过 4M`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message({
        message: `背景图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
    }
  }
};
</script>
<style lang="less" scoped>
.scroll-modify {
  overflow: inherit;
  /deep/.el-scrollbar__wrap::-webkit-scrollbar {
    display: none;
  }
    /deep/.el-scrollbar__bar {
      right:-29px;
    }
}
/deep/.el-upload--picture-card{
  .tips p{
    transform: scale(0.95);
    line-height: 14px;
  }
}
.background-list {
  // border: 1px solid #ccc;
  max-height: 300px;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .list-item {
    width: 140px;
    height: 140px;
    margin: 8px;
    position: relative;
    border-radius: 4px;
    .bgImg {
      width: 100%;
      border-radius: 4px;
    }
    .img-tangle{
      position: absolute;
      right: 0;
      top:0;
      width: 20px;
      height: 20px;
      font-size: 0;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .upload-demo {
      margin-top: 20px;
      i {
        font-size: 60px;
      }
    }
  }
  .list-imgs{
    position: relative;
    // .img-tangle{
    //   position: absolute;
    //   right: 0;
    //   top:0;
    //   width: 0;
    //   height: 0;
    //   border: 10px solid transparent;
    //   border-right-color: #FB3A32;
    //   border-top-color: #FB3A32;
    //   i{
    //     color:#fff;
    //     position: absolute;
    //     top: -8px;
    //     right:-11px;
    //     font-size: 10px;
    //   }
    // }
  }
}
/deep/.el-dialog__footer{
  text-align: left;
}
.dialog-footer {
  padding-top: 24px;
  text-align: right;
  /deep/button.el-button{
    &:last-child{
      margin-left: 12px;
    }
  }
}
</style>

