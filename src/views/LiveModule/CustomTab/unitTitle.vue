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
      showCompIndex: 0,
      unitTitleForm: {
        component_id: '',
        msg: '',
        title: ''
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
  methods: {
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('标题区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitTextLinkForm) {
      //   this.$refs.unitTextLinkForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.title !== '' && compVo.compInfo.title !== null && compVo.compInfo.title !== undefined) {
        this.unitTitleForm.title = compVo.compInfo.title;
      } else {
        this.unitTitleForm.title = '';
      }
      // 默认组件类别 和 组件名称
      this.unitTitleForm.component_id = compVo.component_id;
      this.unitTitleForm.msg = compVo.name;
      this.showCompIndex = index;
    },
    sendData() {
      this.$refs.unitTitleForm.validate((valid) => {
        if (valid) {
          this.$emit('cxtChangeInfo', {
            content: JSON.stringify(this.unitTitleForm),
            type: 'title',
            compIndex: this.showCompIndex
          });
        }
      });
    }
  },
  watch: {
    'unitTitleForm.title': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    }
  }
};
</script>

<style scoped>

</style>
