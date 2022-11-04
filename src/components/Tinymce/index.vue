<template>
  <div class="vh-editor-wrapbox" :style="{'height': height}">
    <vue-tinymce ref="editor" :content="value" :setting="setting" @change="sendContent">
    </vue-tinymce>
    <span class="set-placeholder" v-if="!value || currentCount == 0" onselectstart="return false;" unselectable="on" @click="handleTinyClick">{{placeholder}}</span>
    <div class="word-count">
      <span :class="value && currentCount > 0 && currentCount < (maxWord || 1000) ? 'blue' : value && currentCount == (maxWord || 1000)  ? 'red' : ''">{{ value ? currentCount : 0 }}</span> / {{ maxWord || '1000' }}
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
import 'tinymce/plugins/paste';//复制插件
import './tinymce.less';

import {sessionOrLocal} from "@/utils/utils";
import VueTinymce from './editorPlugin'

export default {
  name: "vhall-editor",
  props: {
    modelType: {
      type: String,
      defaut: 'common'
    },
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
      default: 'fontsizeselect bold italic underline anchor | alignleft aligncenter alignright alignjustify | image | fullscreen'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    isImage: {
      type: Boolean,
      required: false,
      default: true
    },
    saveType: {
      type: String,
      required: false,
      default: 'other'
    },
    maxWord: {
      required: false,
      default: () => 1000
    },
    placeholder: {
      required: false,
      default: () => ''
    }
  },

  components: {
    VueTinymce
  },

  created() {
  },
  updated() {
  },
  data() {
    return {
      // content: this.value || '',
      tinymceId: this.id,
      vm: null,
      setting: {
        selector: `#${this.tinymceId}`,
        plugins: `fullscreen wordcount paste ${this.isImage ? 'image' : ''}`,
        // 字体Icon 库。  等瑞芳提供完整时 进行替换
        icons_url: '//cnstatic01.e.vhall.com/saas/common_libs/editor/icons.js',
        icons: 'vhall',
        image_dimensions: false,
        toolbar: this.toolbar,
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        // 引入汉化组件
        language_url: require('../../common/js/tinynce/zh_CN.js'),
        language: 'zh_CN',
        paste_as_text: true, //只粘贴文本
        height: this.height || 300,
        menubar: false, // 隐藏菜单
        convert_urls: false, // 关闭url自动识别转换
        content_style: 'div{font-size: 14px;} p{color:#1a1a1a; margin: 0px; border:0px ; font-size: 14px; padding: 0px; word-break: break-all;}', // 关闭默认p标签间距
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        // paste_data_images: false, // 允许粘贴图像
        images_file_types: 'jpeg,jpg,png,gif,bmp',
        urlconverter_callback: (url, node, onSave, name) => {
          if (node === 'img' && url.startsWith('blob:')) {
            // Do some custom URL conversion
            // console.log('urlConverter:', url, node, onSave, name)
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
            live: `webinars/intro-imgs/${dayjs().format('YYYYMM')}`,
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
              // debugger;
              failure(res.msg || '上传失败');
            }
          }).catch((res) => {
            failure(res.msg || '上传失败');
          })
        }
      },

      currentCount: 0,
    };
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.sendContent(newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleTinyClick() {
      this.$refs.editor?.getInstance()?.focus()
    },
    // 内容修改后，将信息返回
    sendContent(text) {
        this.currentCount = this.$refs.editor?.getInstance()?.plugins?.wordcount?.body?.getCharacterCount()
        if(this.currentCount > 1000) {
          if (this.vm) {
            this.vm.close();
            this.messageInfo();
          } else {
            this.messageInfo();
          }
          // this.$message.warning('您输入的内容超出1000限制，已自动取消')
          this.$refs.editor.getInstance().setContent(this.value)
          this.$emit('input', this.value)
          return
        } else {
          this.$emit('input', text);
        }
    },
     //文案提示问题
    messageInfo() {
      const message = this.modelType == 'restriction' ? '您输入的内容超出1000限制' : '您输入的内容超出1000限制，已自动取消'
      this.vm = this.$message({
        showClose: false,
        duration: 2000,
        message,
        type: 'warning'
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .tox-statusbar{
  display: none !important;
}
// /deep/.tox-tinymce{
//   padding-bottom: 25px !important;
// }
/deep/.tox .tox-tbtn svg {
  display: block;
  fill: #666!important;
}
/deep/.tox .tox-tbtn {
  color: #666;
}
/deep/.tox .tox-tbtn:hover, /deep/.tox .tox-tbtn:active {
  background: #e6e6e6;
  color: #666!important;
}
.vh-editor-wrapbox{
  position: relative;
  /deep/ .tox-tinymce{
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  /deep/.tox-tinymce {
    padding: 0;
  }
  /deep/ .tox-toolbar__primary{
    background: #f7f7f7;
    border-bottom: 1px solid #ccc;
  }
  /deep/ .tox .tox-tbtn {
    width: 30px;
    height: 30px;
  }
  /deep/ .tox .tox-tbtn--select{
    width: 70px;
  }
}
 /deep/ .tox.tox-tinymce {
  &:hover,&:focus {
    border-color: #999;
  }
}
.word-count{
  position: absolute;
  right: 25px;
  bottom: 0;
  font-size: 14px;
  color: #999;
  line-height: 40px;
  .blue{
    color: #3562FA;
  }
  .zero{
    color: #999;
  }
  .red{
    color: #fb3a32;
  }
}
.set-placeholder {
  position: absolute;
  top: 42px;
  left: 10px;
  z-index: 500;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: text;
}
</style>
