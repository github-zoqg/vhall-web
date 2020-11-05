<template>
	<div class="w-wang">
		<div id="edit_menu" class="toolbar"></div>
        <div id="edit_content" class="text"></div>
	</div>
</template>
<script>
	import E from 'wangeditor';
  export default {
    data() {
      return {
        updatedesc: "",
        // 阿里云上传
        editor: {},
        percentage: 0,
        aliyunName: '',
        originalUrl: '',
        loadingText:0,
      };
    },
    props: {
      descont: String
    },
    mounted() {
      this.wangEdit();
    },
    methods: {
      wangEdit() {

        let editor = new E('#edit_menu', '#edit_content');
        editor.config.menus = [
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
          'redo'  // 重复
        ];
        // 配置服务器端地址
        editor.config.customUploadImg = (files, insert) => {
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
        editor.config.onchange = (html) => {
          this.updatedesc = html;
          console.log(html);
          // 返回editor
          this.$emit("updatEditor", this.updatedesc);
        };
        editor.config.zIndex = 1;
        editor.create();
        this.editor = editor;
        // 方法里取不到 this.descont
        console.log("this.descont=== ", this.descont);
        let htmltxt = this.descont || this.updatedesc;
        editor.txt.html(htmltxt);

      },
    },
    watch: {
      descont: 'wangEdit'
    }
  };
</script>
<style scoped lang="less">
  .w-wang {
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
  #edit_content {
    overflow: hidden!important;
  }
</style>
<style>
.w-wang #edit_content {
    overflow: hidden;
}
</style>
