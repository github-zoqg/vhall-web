<template>
  <div>
    <el-form :model="unitTextLinkForm" ref="unitTextLinkForm" :rules="unitTextLinkFormRules" label-width="94px">
      <el-form-item label="文字：" prop="text">
        <el-input type="text" placeholder="请输入文字" v-model="unitTextLinkForm.text" maxlength="30" show-word-limit/>
      </el-form-item>
      <el-form-item label="跳转地址：" prop="textUrl">
        <el-input type="text" placeholder="请输入链接" v-model="unitTextLinkForm.textUrl" show-word-limit/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
	export default {
    name: "unitTextLink.vue",
    components: {
    },
    data() {
      return {
        unitTextLinkForm: {
          text: '',
          textUrl: ''
        },
        unitTextLinkFormRules: {
          text: [
            { required: true, message: '文字不能为空', trigger: 'blur' },
            { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
            { min: 1, message: '请输入文字', trigger: 'blur' }
          ],
          textUrl: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ]
        }
      };
    },
	};
</script>

<style scoped>

</style>
