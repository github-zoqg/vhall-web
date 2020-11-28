<template>
  <el-upload
    class="file-uploader"
    v-bind="$props"
    :on-success='uploadSuccess'>
      <div class="box">
        <div v-if="value">
          <div class="mask">
            <span v-if="!!$props.coverPic">
              <i class="el-icon-collection" @click.stop="coverPage"></i>
              <br/>
              封面
            </span>
            <span>
              <i class="el-icon-delete" @click.stop="deletes"></i>
              <br/>
              删除
            </span>
            <span v-if="!!$props.restPic">
              <i class="el-icon-refresh-left" @click="refresh($event)"></i>
              <br/>
              重置
            </span>
          </div>
        </div>
        <div v-else class="noPic">
          <i class="el-icon-upload"></i>
          <div class="tips">
            <slot name="tip"></slot>
          </div>
        </div>
      </div>
  </el-upload>
</template>

<script>
import {Upload} from 'element-ui';
export default {
  data(){
    return {
    };
  },
  props: {
    ...Object.assign(Upload.props, {
      action: {
        type: String,
        default: "/mock/user/picupload"
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
      console.log('文件上传 ', response, file, fileList, this.onSuccess);
      console.log(this.$props);
      this.$emit('input', URL.createObjectURL(file.raw));
      this.onSuccess(response, file, fileList);
      // this.$emit('on-success', args)
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
  watch: {
  }
};
</script>

<style lang="less" scoped>
  /deep/ .el-upload--picture-card{
    width: 100%;
    height: 140px;
    line-height: unset;
    overflow: hidden;
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
    background: rgba(0, 0, 0, 0.7);
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
  }
</style>
