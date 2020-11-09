<template>
  <el-dialog
    title="创建广告推荐"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%">
    <el-form label-width="80px" :model="advertisement">
      <el-form-item label="推广图片">
        <div class="img-box">
          <el-upload
            class="upload-demo"
            action=""
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="advertisement.title" maxlength="15" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="advertisement.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = false" round size="medium">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false" round size="medium">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      advertisement: {}
    };
  },
};
</script>
<style lang="less" scoped>
   /deep/.el-upload{
     border: 1px solid #ccc;
   }
</style>
