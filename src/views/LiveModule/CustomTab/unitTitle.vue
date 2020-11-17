<template>
  <div>
    <el-form :model="unitTitleForm" ref="unitTitleForm" :rules="unitTitleFormRules" label-width="94px">
      <el-form-item label="标题：" prop="title">
        <el-input type="text" placeholder="默认标题" v-model="unitTitleForm.title" maxlength="30" show-word-limit/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "unitTitle.vue",
  components: {
  },
  data() {
    return {
      unitTitleForm: {
        title: '',
      },
      unitTitleFormRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入标题', trigger: 'blur' }
        ]
      }
    };
  },
};
</script>

<style scoped>

</style>
