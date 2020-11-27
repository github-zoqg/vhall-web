<template>
  <div>
    <vue-tinymce v-model="content" :setting="setting" @change="sendContent"></vue-tinymce>
  </div>
</template>

<script>
export default {
  name: "index.vue",
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: String,
      required: false,
      default: 'fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | image | fullscreen'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    isReturn: {
      type: [Boolean, String],
      required: false,
      default: false
    }
  },
  data() {
    // 上传图片
    // const _this = this;
    function images_upload_handler(blobInfo, success, fail) {
      const File = blobInfo.blob();
      console.log(File);
      if(File) {
        success(URL.createObjectURL(File));
      }else {
        fail('失败上传');
      }
      /*
      const Params = {
        token: localStorage.getItem('token'),
        image: File
      };_this.$fetch('getUploadImg', Params, {
        'Content-Type': 'multipart/form-data'
      }).then(
        res => {
          success(res.data.url);
        }
      ).catch(err => {
        fail(err);
      });*/
    }
    return {
      content: this.value||'',
      tinymceId: this.id,
      setting: {
        selector: `#${this.tinymceId}`,
        plugins: 'preview fullscreen image link hr indent2em lineheight wordcount',
        toolbar: this.toolbar,
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        // 引入汉化组件
        language_url: require('../../../public/tinymce/langs/zh_CN.js'),
        language: 'zh_CN',
        height: this.height || 300,
        menubar: false, // 隐藏菜单
        convert_urls: false, // 关闭url自动识别转换
        content_style: 'p {color:#555; margin: 0px; border:0px ; padding: 0px; word-break: break-all;}', // 关闭默认p标签间距
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        images_upload_handler: images_upload_handler
      }
    };
  },
  methods: {
    // 重置默认展示调用
    resetContent(content) {
      this.content = content;
    },
    // 内容修改后，将信息返回
    sendContent() {
      // console.log('sendContent~~~~~~~~~');
      //执行代码
      if (this.isReturn && this.value !== this.content) {
        this.$emit('returnChange', this.content);
      }
    }
  },
};
</script>

<style lang="less" scoped>
</style>
