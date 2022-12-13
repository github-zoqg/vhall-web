<template>
  <el-upload
    class="avatar-uploader"
    v-bind="$props"
    :headers="headersVo"
    :action="action"
    :data="saveData"
    name="resfile"
    accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
    :on-success="handleuploadSuccess"
  >
    <div class="box">
      <div v-if="value || (domain_url && domain_url.indexOf('aliqr.e.vhall.com/qr.png') == -1)">
        <div :style="`width:${widthImg}px;height:${heightImg}px`" class="img-logo">
          <img
            :src="domain_url || domainUrl"
            class="avatar"
            alt=""
            @click.stop.prevent="!isFullCover && fullCover()"
          />
        </div>
        <div class="mask" @click="isProduct && refresh($event)" v-if="isFullCover">
          <span v-if="!!$props.coverPic" @click.stop.prevent="coverPage">
            <i class="el-icon-collection"></i>
            <br />
            封面
          </span>
          <span @click="refresh($event)">
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
        <div class="bottom-mask" v-else>
          <span @click="refresh($event)">更换</span>
          <span @click.stop.prevent="deletes">删除</span>
        </div>
      </div>
      <div v-else class="noPic">
        <div class="picInco"><i class="iconfont-v3 saasicon_shangchuan"></i></div>
        <div class="tips">
          <slot name="tip"></slot>
        </div>
      </div>
    </div>
  </el-upload>
</template>

<script>
  import { Upload } from 'element-ui';
  import Env from '@/api/env.js';
  import { sessionOrLocal } from '@/utils/utils';
  import { v1 as uuidV1 } from 'uuid';

  export default {
    data() {
      return {
        imageUrl: '',
        domainUrl: '',
        token: sessionOrLocal.get('token', 'localStorage') || ''
      };
    },
    computed: {
      headersVo: function () {
        let vo = { token: this.token, platform: 17, 'request-id': uuidV1() };
        // 取缓存userId相关
        if (window.sessionStorage.getItem('userId')) {
          vo['gray-id'] = window.sessionStorage.getItem('userId');
        }
        return vo;
      }
    },
    props: {
      ...Object.assign(Upload.props, {
        saveData: {
          type: Object,
          default: () => ({
            path: 'sys/img_url',
            type: 'image'
          })
        },
        action: {
          type: String,
          default: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`
        },
        domain_url: {
          type: String,
          default: ``
        },
        accept: {
          type: String,
          default: `image/gif, image/jpeg, image/jpg, image/png, image/bmp`
        },
        'list-type': {
          type: String,
          default: 'picture-card'
        },
        // 'on-progress': {
        //   type: Function,
        //   default: ()=> this.uploadProcess
        // },
        'on-error': {
          type: Function,
          default: () => this.uploadError
        },
        'on-preview': {
          type: Function,
          default: () => this.uploadPreview
        },
        // 'before-upload': {
        //   type: Function,
        //   default: ()=> this.beforeUploadHandler
        // },
        'show-file-list': {
          type: Boolean,
          default: false
        }
      }),
      value: {
        type: String,
        default: ''
      },
      coverPic: {
        type: Boolean,
        default: false
      },
      isProduct: {
        type: Boolean,
        default: false
      },
      isFullCover: {
        type: Boolean,
        default: true
      },
      heightImg: {
        type: Number,
        default: 180
      },
      widthImg: {
        type: [Number, String],
        default: 320
      },
      'on-success': {
        type: Function,
        default: () => {}
      }
    },
    created() {
      console.log(this.$props);
    },
    methods: {
      handleuploadSuccess(response, file, fileList) {
        console.log('heqhwhqhwhd ', response, file, fileList, this.onSuccess);
        if (response.code !== 200) {
          this.$message({
            message: response.msg || '上传失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          console.log(this.$props);
          if (response.data.domain_url) {
            this.domainUrl = response.data.domain_url;
          }
          // this.$emit('input', URL.createObjectURL(file.raw));
          // this.imageUrl = URL.createObjectURL(file.raw);
          this.onSuccess(response, file, fileList);
          // this.$emit('on-success', args)
        }
      },
      // uploadProcess(event, file, fileList){
      //   this['on-progress'](event, file, fileList);
      //   // this.$emit('on-progress', args)
      // },
      // uploadError(err, file, fileList){
      //   this['on-error'](err, file, fileList);
      //   // this.$emit('on-error', args)
      // },
      // uploadPreview(file){
      //   this['on-preview'](file);
      //   // this.$emit('on-preview', args)
      // },
      // beforeUploadHandler(file){
      //   console.log(file);
      //   // this['before-upload'](file);
      //   // this.$emit('before-upload', args)
      // },
      // changeHanler(file, fileList){
      //   this['on-change'](file, fileList);
      //   // this.$emit('on-change', args)
      // },
      deletes() {
        this.domainUrl = '';
        this.$emit('delete', '');
      },
      coverPage() {
        this.$emit('coverPage', '');
      },
      fullCover() {
        this.$emit('fullCover');
      },
      refresh(event) {
        this.$emit('resetImage');
        // event.stopPropagation();
        // if(typeof this.restPic == "function"){
        //   this.restPic();
        //   event.stopPropagation();
        //   // this.$emit('resetImage');
        // }
      }
    },
    watch: {}
  };
</script>

<style lang="less" scoped>
  /deep/ .el-upload--picture-card {
    width: 100%;
    height: 138px;
    line-height: unset;
    overflow: hidden;
    background-color: #f7f7f7;
    border: 1px solid #cccccc;
    border-radius: 4px;
    &:hover,
    &:focus {
      background-color: #f7f7f7;
      border: 1px solid #999999;
      border-radius: 4px;
    }
    i {
      color: #999;
      display: inline-block;
    }
    i.saasicon_shangchuan {
      font-size: 36px;
      color: #999;
    }
    .box {
      width: 100%;
      height: 100%;
      display: table;
      > div {
        width: 100%;
        height: 100%;
        position: relative;
        // padding-top: 30px;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        &:hover {
          .mask {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            line-height: 20px;
            // padding: 0 10px;
          }
          .bottom-mask {
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #fff;
          }
        }
      }
      .picInco {
        height: 40px;
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
  }
  // .avatar-uploader{
  //   height: 180px;
  // }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: none;
    span {
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
  }
  .bottom-mask {
    position: absolute;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: none;
    border-radius: 2px 2px 0 0;
    padding: 0 5px;
    bottom: 0;
    span {
      font-size: 14px;
      display: inline-block;
      line-height: 26px;
      color: #fff;
    }
  }
  /deep/ .tips {
    font-size: 12px;
    color: #999;
    text-align: center;
    p {
      line-height: 16px;
      padding: 0;
    }
  }
</style>
