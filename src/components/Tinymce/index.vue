<template>
  <div class="vh-editor-wrapbox" :style="{'height': height}">
    <vue-tinymce ref="editor" :content="value" :setting="setting" @change="sendContent">
    </vue-tinymce>
    <div class="word-count">
      <span class="blue">{{ currentCount }}</span> / {{ maxWord || '1000' }}
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce';
//样式
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
//主题
import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons.min.js';
//插件
import 'tinymce/plugins/image'; //图片插件
import 'tinymce/plugins/quickbars';//快速栏插件
import 'tinymce/plugins/wordcount';//快速栏插件
import 'tinymce/plugins/fullscreen';//全屏插件

import {sessionOrLocal} from "@/utils/utils";
import VueTinymce from './editorPlugin'


export default {
  name: "vhall-editor",
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    value: {
      required: true,
      default: ''
    },
    toolbar: {
      type: String,
      required: false,
      default: 'fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | image | fullscreen | wordcount'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    saveType: {
      type: String,
      required: false,
      default: 'other'
    },

    maxWord: {
      requred: false,
      defaut: 1000
    }
  },

  components: {
    VueTinymce
  },

  created() {
  },
  mounted() {
  },
  updated() {
  },

  data() {
    return {
      // content: this.value || '',
      tinymceId: this.id,
      setting: {
        selector: `#${this.tinymceId}`,
        plugins: 'fullscreen image wordcount',
        image_dimensions: false,
        toolbar: this.toolbar,
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        // 引入汉化组件
        language_url: require('../../common/js/tinynce/zh_CN.js'),
        language: 'zh_CN',
        height: this.height || 300,
        menubar: false, // 隐藏菜单
        convert_urls: false, // 关闭url自动识别转换
        content_style: 'p {color:#555; margin: 0px; border:0px ; padding: 0px; word-break: break-all;}', // 关闭默认p标签间距
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        // paste_data_images: false, // 允许粘贴图像
        images_file_types: 'jpeg,jpg,png,gif,bmp',
        urlconverter_callback: (url, node, onSave, name) => {
          if (node === 'img' && url.startsWith('blob:')) {
            // Do some custom URL conversion
            console.log('urlConverter:', url, node, onSave, name)
            tinymce.activeEditor && tinymce.activeEditor.uploadImages()
          }
          // Return new URL
          return url
        },
        images_upload_handler: (blobInfo, success, failure) => {
          console.log('========== upload info ============')
          let files = new window.File([blobInfo.blob()], blobInfo.filename(), {
            type: blobInfo.type
          })
          console.log(files, '当前文件对象');
          let pathVo = {
            live: `webinars/intro-imgs/${this.$moment().format('YYYYMM')}`,
            customTabImg: `interacts/menu-imgs`,
            special: `webinars/subject-imgs`,
            other: `webinars/saas-tinymce`
          }
          const param = {
            token: sessionOrLocal.get('token', 'localStorage') || '',
            platform: 17,
            type: 'image',
            resfile: files,
            path: pathVo[this.saveType]
          }
          this.$fetch('uploadImage', param, {
            'Content-Type': 'multipart/form-data'
          }).then(res => {
            if (res && res.code === 200) {
              success(res.data.domain_url);
            } else {
              failure(res.msg || '上传失败');
            }
          }).catch(() => {
            failure(res.msg || '上传失败');
          })
        }
      },

      currentCount: 0,
    };
  },
  methods: {
    // 内容修改后，将信息返回
    sendContent(text) {
      console.log('字符数', this.$refs.editor.getInstance().plugins.wordcount.body.getCharacterCount())
      this.currentCount = this.$refs.editor.getInstance().plugins.wordcount.body.getCharacterCount()

      if(this.currentCount > 1000) {
        this.$emit('input', value)
        return
      }

      // 移除-base64图片
      this.$emit('input', text);
    }
  },
};
</script>
<style lang="less" scoped>
/deep/ .tox-statusbar{
  display: none !important;

  .blue{

  }
}

.vh-editor-wrapbox{
  position: relative;
}

.word-count{
  position: absolute;
  right: 10px;
  bottom: 20px;
  font-size: 14px;
  .blue{
    color: blue;
  }
}

</style>
