<template>
  <div class="components-container">
    <el-button round>默认按钮</el-button>
    <el-button size="medium" round>中等按钮</el-button>
    <el-button size="small" round>小型按钮</el-button>
    <br />
    <br />
    <br />
    <el-button type="primary" round>保存</el-button>
    <el-button round>取消</el-button>
    <br />
    <br />
    <br />
    <el-button type="primary" size="medium" round>资料库</el-button>
    <el-button size="medium" round>批量删除</el-button>
    <br />
    <br />
    <br />
    <el-button type="primary" size="medium" round>确定</el-button>
    <el-button size="medium" round>取消</el-button>
    <br />
    <br />
    <br />
    <el-button size="small" round>恢复预告</el-button>
    <el-button type="primary" size="small" round>扫码</el-button>
    <el-button size="small" round>查看</el-button>
    <br />
    <br />
    <br />
    <p>禁用：</p>
    <el-button disabled round>恢复预告</el-button>
    <el-button type="primary" disabled round>恢复预告</el-button>
    <br />
    <br />
    <br />
    {{content}}
    <v-editor :isReturn=true @returnChange="sendData1" ref="unitImgTxtEditor" :value="content"></v-editor>
    {{content2}}
    <v-editor :isReturn=true @returnChange="sendData2" ref="unitImgTxtEditor" :value="content2"></v-editor>
    <v-editor></v-editor>
  </div>
</template>

<script>
import VEditor from '@/components/Tinymce';
export default {
  name: 'TinymceDemo',
  components: { VEditor },
  data() {
    return {
      content:
        `第一个编辑器`,
      content2:
        `第二个编辑器`
    };
  },
  methods: {
    sendData1(content) {
     this.content = content;
    },
    sendData2(content) {
      this.content2 = content;
    }
  }
};
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
