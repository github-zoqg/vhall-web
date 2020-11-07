<template>
  <div class="editor__u">
    <div :id="elName">
      <p>{{ defaultText }}</p>
    </div>
    <p class="editor__count">统计{{eLen}}</p>
  </div>
</template>

<script>
import E from 'wangeditor';
export default {
  name: "rqCode.vue",
  props: {
    elName: {
      type: String
    },
    defaultText: {
      type: String
    },
    eContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      eLen: 0,
      content: ''
    }
  },
  mounted() {
    this.initWangEditor();
    if (this.eContent) {
      this.getELen(this.eContent); // 获取已经设置过内容展示字数
      this.editor.txt.html(this.eContent || ''); // 已经存储的内容反显
    }
  },
  methods: {
    getELen(str) {
      // 去除标签后，纯文字内容
      let temp = str.replace(/<\/?.+?>/g, "");
      let result = temp.replace(/ /g, "");
      // 获取img标签数量
      let ImgA = str.match(/<img[^>]+>/g);
      this.eLen = (ImgA ? ImgA.length : 0) + result.length;
    },
    clearE(){
      this.editor.txt.clear();
      this.content = '';
    },
    initWangEditor() {
      this.editor = new E(`#${this.elName}`);
      // 设置编辑区域高度为 500px
      this.editor.config.height = 500;
      this.editor.config.uploadImgMaxLength = 5 // 一次最多上传 5 个图片
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      this.editor.config.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'foreColor',  // 文字颜色
        'link',  // 插入链接
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'video',  // 插入视频
        'undo',  // 撤销
        'redo',  // 重复
        'fullscreen'
      ];
      // 配置服务器端地址
      this.editor.config.customUploadImg = (files, insert) => {
        console.log(files, insert);
        // aliyun 上传图片
        // aliyunDir.getAliyunImg({}, (res => {
        //   if(res.status == 200) {
        //     ailiyunUpload.aliyunUpload(res.data,files,(percentage, cpt)=>{
        //       this.loadingText = Math.round(percentage*100);
        //     }).then((results)=>{
        //         // 上传完成
        //       console.log("this is wangEdit Upload File");
        //       this.aliyunName = results.name.split("/").pop();
        //       this.originalUrl = decodeURI(results.res.requestUrls[0]).split('?')[0];
        //       insert(this.originalUrl);
        //     }).catch((err)=>{
        //       this.$message.error('上传错误'+err);
        //     });
        //   } else {
        //     this.$message.error(res.message);
        //   }
        // }));
      };
      // 配置菜单
      this.editor.config.onchange = (html) => {
        this.content = html || '';// 绑定当前组件值
        this.getELen(this.content);
        //去掉除img以外的所有标签；
        let saveStr = this.content.replace(/<\/?(?!img)[a-z]+?[^>]*>/gi,'');
        this.content= saveStr;
        console.log('当前内容' + saveStr);
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="less" scoped>
.editor__u{
  position: relative;
  padding: 0 0 40px 0;
 /* border: 1px solid #CCCCCC;*/
  border-radius: 4px;
  z-index: 9;
  .editor__count {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    z-index: 100;
  }
  .text {
    width: 100%;
    height: 200px;
    border: 1px solid #F2F0F0;
  }
  .toolbar {
    width: 100%;
    background: #FCFDFF;
    border: 1px solid #F2F0F0;
    height: 50px;
  }
  .w-e-toolbar{
    .w-e-menu{
      padding: 17px 10px;
    }
  }
}
</style>
