
<template>
  <div class="tinymce-wrap">
    <textarea v-show="false" :id='tinyId'></textarea>
    <editor :init='init' v-model="tinyHtml"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import Editor from '@tinymce/tinymce-vue';
import './../../../public/tinymce/lineheight/plugin';
import './../../../public/tinymce/indent2em/plugin';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/link';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/icons/default';
export default {
  name: 'tinymce',
  data () {
    // 上传图片
    const _this = this;
    function images_upload_handler(blobInfo, success, fail) {
      const File = blobInfo.blob();
      const Params = {
        token: localStorage.getItem('token'),
        image: File
      };
      const head = {
        'Content-Type': 'multipart/form-data'
      };
      _this.$fetch('getUploadImg', Params, head
      ).then(
        res => {
          success(res.data.url);
        }
      ).catch(
        err => {
          fail(err);
        }
      );
    }
    return {
      tinyHtml: '',
      init: {
        selector: `#${this.tinyId}`,
        // 引入汉化组件
        language_url: require('./../../../public/tinymce/langs/zh_CN.js'),
        // 设定语言为中文
        language: lan === 'en' ? 'en_US' : 'zh_CN',
        // 加入主题
        skin_url: `${process.env.STATIC_URL}/fe/static/js/tinymce/skins/ui/oxide`,
        content_css: '',
        plugins: 'preview fullscreen image link hr indent2em lineheight wordcount',
        toolbar: 'fontsizeselect forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent indent2em lineheight | hr image | preview | fullscreen',
        height: 300, // 编辑器高度
        menubar: false, // 隐藏菜单
        min_height: 300,
        // icons_url: require('tinymce/icons/default/icons'),
        convert_urls: false, // 关闭url自动识别转换
        content_style: 'p {color:#555; margin: 0px; border:0px ; padding: 0px; word-break: break-all;}', // 关闭默认p标签间距
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        images_upload_handler: images_upload_handler
      }
    };
  },
  props: {
    tinyId: {
      type: String,
      default: 'tinymce'
    },
    tinyVal: {
      type: String,
      default: ''
    }
  },
  watch: {
    tinyVal: function (val) {
      this.tinyHtml = val;
    }
  },
  mounted () {
    tinymce.init({});
  },
  components: {Editor}
};
</script>

<style lang="less">
  .tox-tinymce  {
    border-radius: 4px !important;
  }
 .tox-statusbar__branding {
   display: none !important;
 }

 .tox .tox-statusbar__path {
   display: none !important;
 }

 .tox .tox-statusbar {
   border-top: none !important;
 }

.tox .tox-dialog__footer-end button:last-child{
  background: #c00000 !important;
  border-color: #c00000 !important;
 }

 .tox .tox-dialog__body-nav-item--active {
   border-bottom:  2px solid #c00000 !important;
   color: rgba(34,47,62,.7) !important;
 }

 .tox .tox-lock {
   pointer-events: none;
 }

.tox .tox-form .tox-form__controls-h-stack .tox-form_group:last-of-type {
   display: none !important;
}

.tox .tox-tbtn svg path {
  fill: #666 !important;
}

.tox .tox-tbtn--bespoke .tox-tbtn__select-label {
  color: #666 !important;
}

.tox .tox-collection--list .tox-collection__item {
  color: #666 !important;
}

.tox .tox-statusbar__wordcount {
  color: #666 !important;
}
</style>
