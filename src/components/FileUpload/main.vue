<template>
  <el-upload
    class="file-uploader"
    v-bind="$props"
    :headers="{token: token, platform: 17}"
    :data=saveData
    name="resfile"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
    :on-success='uploadSuccess'>
      <div class="box">
        <a href="javascript:;" class="a-upload mr10" v-if="value">
          <i class="img"></i>
          <p class="file-name" style="color: rgb(136, 136, 136);">{{fileName}}</p>
          <div class="change-txt" v-if="result">
            <p id="right">上传成功，共检测到{{result.success}}条有效数据</p>
          </div>
          <div class="change-txt" v-if="!result">
            <p id="error">上传失败</p>
          </div>
        </a>
        <div v-else class="noPic">
          <i class="iconfont-v3 saasicon_shangchuan"></i>
          <div class="tips">
            <slot name="tip"></slot>
          </div>
        </div>
      </div>
  </el-upload>
</template>

<script>
import {Upload} from 'element-ui';
import Env from '@/api/env.js';
import {sessionOrLocal} from "@/utils/utils";
export default {
  data(){
    return {
      token: sessionOrLocal.get('token', 'localStorage') || '',
      fileName: null
    };
  },
  props: {
    ...Object.assign(Upload.props, {
      saveData: {
        type: Object,
        default: {
          path: 'sys/material_url',
          type: 'exel', // (image,video,app,exe,doc,exel,audio,csv	)
        }
      },
      action: {
        type: String,
        default: `${process.env.VUE_APP_BASE_URL}/v3/commons/upload/index`
      },
      "list-type": {
        type: String,
        default: "picture-card"
      },
      'on-progress': {
        type: Function,
        default: ()=> this.uploadProcess
      },
      'on-error': {
        type: Function,
        default: ()=> this.uploadError
      },
      'on-preview': {
        type: Function,
        default: ()=> this.uploadPreview
      },
      // 'before-upload': {
      //   type: Function,
      //   default: ()=> this.beforeUploadHandler
      // },
      "show-file-list": {
        type: Boolean,
        default: false
      },
    }),
    value: {
      type: String,
      default: ''
    },
    restPic: {
      type: [Function, Boolean],
      default: null
    },
    coverPic: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object,
      default: function() {
        return {
          success: 0,
          fail: 0
        };
      }
    },
    'on-success': {
      type: Function,
      default: ()=>{}
    }
  },
  created(){
    console.log(this.$props);
  },
  methods: {
    uploadSuccess(response, file, fileList){
      console.log('heqhwhqhwhd ', response, file, fileList, this.onSuccess);
      this.fileName = file.name;
      if(response.code !== 200) {
        this.$message.error(response.msg || '上传失败');
      } else {
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
    deletes(){
      this.$emit('delete', '');
    },
    coverPage() {
      this.$emit('coverPage', '');
    },
    refresh(event){
      if(typeof this.restPic == "function"){
        this.restPic();
        event.stopPropagation();
      }
    }
  },
  filters: {
    typeStr: function(str) {
      if(this.saveData.force_name !== null) {
        return '.xls';
      } else{
        return '';
      }
    }
  }
};
</script>

<style lang="less" scoped>
  /deep/ .el-upload--picture-card{
    width: 404px;
    height: 154px;
    line-height: unset;
    overflow: hidden;
    background-color: #F7F7F7;
    border: 1px solid #cccccc;
    border-radius: 4px;
    &:hover,&:focus {
      background-color: #F7F7F7;
      border: 1px solid #999999;
      border-radius: 4px;
    }
    i {
      font-size: 44px;
      color: #8c939d;
    }
    .box{
      width: 100%;
      height: 100%;
      display: table;
      >div{
        width: 100%;
        height: 140px;
        position: relative;
        display: table-cell;
        vertical-align: middle;
        &:hover{
          .mask{
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            line-height: 20px;
          }
        }
      }
    }
    img{
      // width: 100%;
      height: 100%;
    }
  }
  .mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 2px 2px 4px 4px;
    display: none;
    span{
      &:nth-child(2){
        margin: 0  10px;
      }
      i{
        color: #fff;
      }
    }
  }
  /deep/ .tips{
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
    border: solid 1px #E2E2E2;
    color: #222;
    border-radius: 2px;
    background-color: #F7F7F7;
    overflow: hidden;
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
    color: #999;
    font-size: 14px;
    font-weight: 400;
    margin-top: -5px;
  }
  .a-upload #right {
    font-weight: 400;
    margin-top: -5px;
    color: #888;
    font-size: 14px;
  }
</style>
