<template>
  <div>
    <div class="upload-image" :style="`width:${uploadWidth}px;height:${uploadHeight}px`">
      <div class="upload-image_box">
        <div v-if="domain_url" class="upload-image_box_pic">
          <div class="img-logo"  :style="`width:${widthImg}px;height:${heightImg}px`">
            <img :src="domain_url" alt="">
          </div>
          <div class="img-mask">
            <span>
              <input  name="resfile" type="file" title=""  accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" @change="setImage" class="upload-file-mask" />
              <i class="el-icon-refresh-left"></i>
              <br />
              更换
            </span>
            <span @click.stop.prevent="deletes">
              <i class="iconfont-v3 saasicon_shanchu"></i>
              <br />
              删除
            </span>
          </div>
        </div>
        <div class="upload-image_box_noPic" v-else>
          <input name="resfile" class="upload-file" type="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" @change="setImage" id="image" />
          <div class="picInco"><i class="iconfont-v3 saasicon_shangchuan"></i></div>
            <div class="tips">
              <slot name="tip"></slot>
            </div>
        </div>
      </div>
    </div>
    <cropper ref="uploadCropper"></cropper>
  </div>
</template>
<script>
import cropper from '../Cropper/index.vue'
export default {
  props: {
    uploadWidth: {
      type: Number,
      require: true,
      default: 228
    },
    uploadHeight: {
      type: Number,
      require: true,
      default: 128
    },
    heightImg: {
      type: Number,
      default: 128
    },
    widthImg: {
      type: Number,
      default: 200
    },
  },
  data() {
    return {
      // https://t-alistatic01.e.vhall.com/upload/interacts/screen-imgs/202206/c2/2e/c22e448f7fe64f026750b934623fe68f.jpg
      domain_url: ''
    }
  },
  components: {
    cropper
  },
  methods: {
    deletes() {
      this.domain_url = '';
    },
    setImage(e) {
      let file = e.target.files[0];
      console.log('上传图片file对象',file)
      const url = this.getObjectURL(file)
      this.$refs.uploadCropper.showModel(url)
    },
    getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }
  }
}
</script>
<style lang="less" scoped>
  .upload-image{
    line-height: unset;
    overflow: hidden;
    background-color: #f7f7f7;
    border: 1px solid #cccccc;
    border-radius: 4px;
    &_box{
      width: 228px;
      height: 100%;
      display: table;
      >div{
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;
        // padding-top: 30px;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
      }
      i {
        color: #999;
        display: inline-block;
      }
      i.saasicon_shangchuan {
        font-size: 36px;
        color: #999;
      }
      &_pic{
        &:hover {
          .img-mask {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            line-height: 20px;
          }
        }
        .img-logo {
          margin: 0 auto;
        }
        img {
          height: 100%;
          object-fit: scale-down;
          width: 100%;
          margin: 0px auto;
        }
        .img-mask{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: none;
          span {
            position: relative;
            font-size: 14px;
            &:nth-child(2) {
              margin: 0 0 0 10px;
              i {
                line-height: 1;
              }
            }
            i {
              color: #fff;
              font-size: 18px;
              vertical-align: middle;
            }
          }
          .upload-file-mask{
            position: absolute;
            cursor: pointer;
            width: 40px;
            height: 40px;
            top: 0;
            left: 0;
            background: #fff;
            opacity: 0;
          }
        }
      }
      &_noPic {
        position: relative;
        cursor: pointer;
        .upload-file{
          height: 128px;
          width: 228px;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        .picInco {
          height: 40px;
        }
        .tips {
          font-size: 12px;
          color: #999;
          text-align: center;
          p {
            line-height: 16px;
            padding: 0;
          }
        }
      }
    }
  }
</style>
