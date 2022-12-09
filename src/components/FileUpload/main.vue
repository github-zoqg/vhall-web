<template>
  <el-upload
    :class="[
      'file-uploader ',
      {
        'is-upload-disabled': disabled
      }
    ]"
    v-bind="$props"
    :headers="headersVo"
    :data="saveData"
    name="resfile"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
    :on-success="uploadSuccess"
  >
    <div class="box">
      <a href="javascript:;" class="a-upload mr10" v-if="value">
        <i class="iconfont-v3 saasexcelwendang excel"></i>
        <p class="file-name" style="`color: #1A1A1A;`" :title="fileName">{{ fileName }}</p>
        <slot name="upload-result"></slot>
        <div class="mask">
          <span>
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
      </a>
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
        token: sessionOrLocal.get('token', 'localStorage') || '',
        fileName: null,
        errText: ''
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
          default: {
            path: 'sys/material_url',
            type: 'exel' // (image,video,app,exe,doc,exel,audio,csv	)
          }
        },
        action: {
          type: String,
          default: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`
        },
        'list-type': {
          type: String,
          default: 'picture-card'
        },
        'on-progress': {
          type: Function,
          default: () => this.uploadProcess
        },
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
      disabled: {
        type: Boolean,
        default: false
      },
      restPic: {
        type: [Function, Boolean],
        default: null
      },
      coverPic: {
        type: Boolean,
        default: false
      },
      'on-success': {
        type: Function,
        default: () => {}
      },
      defaultFileName: {
        type: String,
        default: ''
      }
    },
    created() {
      console.log(this.$props);
      if (this.defaultFileName) {
        this.fileName = this.defaultFileName;
      }
    },
    methods: {
      uploadSuccess(response, file, fileList) {
        console.log('heqhwhqhwhd ', response, file, fileList, this.onSuccess);
        this.fileName = file.name;
        if (response.code !== 200) {
          this.errText = '上传失败，请重新上传';
          if (typeof this.onError === 'function') {
            this.onError && this.onError(response, file, fileList);
          }
        } else {
          this.errText = '';
          console.log(this.$props);
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
      //   return true
      //   // this['before-upload'](file);
      //   // this.$emit('before-upload', args)
      // },
      // changeHanler(file, fileList){
      //   this['on-change'](file, fileList);
      //   // this.$emit('on-change', args)
      // },
      deletes() {
        this.$emit('delete', '');
      },
      coverPage() {
        this.$emit('coverPage', '');
      },
      refresh(event) {
        if (typeof this.restPic == 'function') {
          this.restPic();
          event.stopPropagation();
        }
      },
      setError(text) {
        this.errText = text;
      }
    },
    filters: {
      typeStr: function (str) {
        if (this.saveData.force_name !== null) {
          return '.xls';
        } else {
          return '';
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  /deep/ .el-upload--picture-card {
    width: 404px;
    height: 154px;
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
    i.img {
      font-size: 44px;
      color: #999;
    }
    i.saasicon_shangchuan {
      font-size: 44px;
      color: #999;
    }
    i.excel {
      font-size: 28px;
      color: rgb(20, 186, 106);
      margin-top: 40px;
      display: block;
      margin: 40px auto 0 auto;
    }
    .box {
      width: 100%;
      height: 100%;
      display: table;
      position: relative;
      > div {
        width: 100%;
        height: 140px;
        position: relative;
        display: table-cell;
        vertical-align: middle;
        &:hover {
          .mask {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            line-height: 20px;
          }
        }
      }
      .picInco {
        height: 40px;
        line-height: 40px;
      }
    }
    img {
      // width: 100%;
      height: 100%;
    }
  }
  .is-upload-disabled {
    .a-upload:hover {
      .mask {
        display: none;
      }
    }
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 2px 2px 4px 4px;
    display: none;
    justify-content: center;
    align-items: center;
    span {
      cursor: pointer;
      color: #fff;
      &:nth-child(2) {
        margin: 0 10px;
      }
      i {
        color: #fff;
      }
    }
  }
  /deep/ .tips {
    font-size: 12px;
    color: #999;
    text-align: center;
    line-height: 16px;
    margin-top: 6px;
  }

  .a-upload {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: 28px;
    text-align: center;
    cursor: initial;
    // border: solid 1px #E2E2E2;
    color: #222;
    border-radius: 2px;
    background-color: #f7f7f7;
    overflow: hidden;
    &:hover {
      .mask {
        display: flex;
      }
    }
  }
  .a-upload .img {
    display: inline-block;
    width: 62px;
    height: 62px;
    margin-top: 12px;
    background: url(../../common/images/temp/associate-csv.png) no-repeat;
    background-size: cover;
    cursor: initial;
  }
  .a-upload .file-name {
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 400;
    margin-top: -5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    margin: 0 20px;
  }
  .a-upload .p-right {
    font-weight: 400;
    margin-top: -5px;
    color: #888;
    font-size: 14px;
  }
  .a-upload .p-error {
    font-weight: 400;
    margin-top: -5px;
    color: #fb3a32;
    font-size: 14px;
  }
  /deep/.el-progress__text /deep/i {
    font-size: 18px;
  }
</style>
