<template>
  <div>
    <VhallDialog
      title="选择封面背景"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      style="overflow: hidden"
      width="670px"
    >
      <el-scrollbar class="scrollbar scroll-modify">
        <div class="background-list">
          <div
            :class="['list-item', isType === 0 ? 'active' : '']"
            @click.stop="domain_url && choseBackground(-1)"
          >
            <upload
              v-model="imageUrl"
              id="invitation_cropper"
              :domain_url="domain_url"
              :saveData="{
                path: 'interacts/invite-card-imgs',
                type: 'image'
              }"
              :on-success="handleuploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :restPic="true"
              @delete="daleteImg()"
              @fullCover="choseBackground(-1)"
              :isFullCover="false"
              :widthImg="138"
              :heightImg="138"
              @handleFileChange="handleFileChange"
              :before-upload="beforeUploadHnadler"
            >
              <div slot="tip">
                <p>建议尺寸：750*1334px,小于4M</p>
                <p>支持jpg、png、bmp</p>
              </div>
            </upload>
            <label class="img-tangle" v-if="isType === 0">
              <img src="../../../../common/images/icon-choose.png" alt="" />
            </label>
            <!-- <label class="img-tangle" v-show="isType==0">
              <i class="el-icon-check"></i>
            </label> -->
          </div>
          <div
            :class="['list-item', 'list-imgs', 'is-success', isType === index + 1 ? 'active' : '']"
            v-for="(item, index) in fileList"
            :key="index"
          >
            <label class="img-tangle" v-if="isType === index + 1">
              <img src="../../../../common/images/icon-choose.png" alt="" />
            </label>
            <!-- <label class="img-tangle" v-if="isType === index + 1">
              <i class="el-icon-check"></i>
            </label> -->
            <img :src="item" alt="" class="bgImg" @click="choseBackground(index)" />
          </div>
        </div>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button
          round
          size="medium"
          v-preventReClick
          type="primary"
          @click.prevent.stop="changePic"
        >
          选 择
        </el-button>
        <el-button round size="medium" @click.prevent.stop="dialogVisible = false">取 消</el-button>
      </div>
    </VhallDialog>
    <!-- 裁剪组件 -->
    <cropper
      ref="invitationCropper"
      @cropComplete="cropComplete"
      @resetUpload="resetUpload"
      :ratio="750 / 1334"
    ></cropper>
  </div>
</template>
<script>
  import upload from '@/components/Upload/main';
  import cropper from '@/components/Cropper/index';
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
          `${Env.staticImgs.invitation[8]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`
        ],
        imageCropper: {}
      };
    },
    components: {
      upload,
      cropper
    },
    props: ['url', 'type', 'mode'],
    watch: {
      dialogVisible() {
        if (this.dialogVisible) {
          this.domain_url = this.type == 0 ? this.domain_url || this.url : '';
          this.imageUrl = this.type == 0 ? this.url : '';
          if (this.imageUrl) {
            this.isType = 0;
          } else {
            this.isType = this.type;
          }
        }
      }
    },
    methods: {
      choseBackground(index) {
        this.isType = index + 1;
      },
      changePic() {
        if (this.isType > 0) {
          this.domain_url = '';
        }
        this.$emit('onChangePic', this.isType, this.domain_url, this.imageCropper);
        this.dialogVisible = false;
      },
      daleteImg() {
        this.isType = 1;
        this.imageUrl = '';
        this.domain_url = '';
        this.url = '';
      },
      cropComplete(cropperData, url, mode) {
        console.log(cropperData, url, '?????');
        this.imageCropper.backgroundSize = cropperData;
        this.imageCropper.imageCropMode = mode;
        this.domain_url = url;
      },
      resetUpload() {
        let dom = document.querySelector('#invitation_cropper .el-upload__input');
        dom.click();
      },
      handleuploadSuccess(res, file) {
        console.log(res, file);
        // this.imageUrl = URL.createObjectURL(file.raw);
        if (res.data) {
          if (this.$route.meta.name == 'invCard') {
            let domain_url = res.data.domain_url || '';
            let file_url = res.data.file_url || '';
            this.imageUrl = file_url;
            this.domain_url = domain_url;
            this.cropComplete({ height: 0, width: 0, x: 0, y: 0 }, this.domain_url, '');
          } else {
            this.$refs.invitationCropper.showModel(res.data.domain_url);
          }
          this.isType = 0;
        }
      },
      beforeUploadHnadler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'bmp'];
        console.log(file.type.toLowerCase());
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
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `背景图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
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
    /deep/.el-scrollbar__bar {
      right: -29px;
    }
  }
  /deep/.el-upload--picture-card {
    .tips p {
      transform: scale(0.95);
      line-height: 14px;
    }
  }
  .background-list {
    // border: 1px solid #ccc;
    max-height: 300px;
    display: flex;
    // justify-content: space-between;
    // align-items: center;
    flex-wrap: wrap;
    .list-item {
      width: 140px;
      height: 140px;
      // margin: 8px;
      margin-bottom: 10px;
      position: relative;
      border-radius: 4px;
      margin-right: 15px;
      border: 1px solid #fff;
      transition: all 0.15s ease-in;
      &.active {
        border: 1px solid #fb3a32;
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        /deep/.el-upload--picture-card {
          border: 0;
        }
      }
      &:hover {
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      }
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      .bgImg {
        width: 100%;
        border-radius: 4px;
      }
      .img-tangle {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        font-size: 0;
        img {
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
    .list-imgs {
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
  /deep/.el-dialog__footer {
    text-align: left;
  }
  .dialog-footer {
    // padding-top: 24px;
    text-align: right;
    /deep/button.el-button {
      &:last-child {
        margin-left: 12px;
      }
    }
  }
</style>
