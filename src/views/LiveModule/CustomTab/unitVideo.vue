<template>
  <div>
    自定义菜单-右侧直播编辑区
  </div>
</template>

<script>
export default {
  name: "unitVideo.vue",
  components: {
  },
  data() {
    return {
      showCompIndex: 0,
      unitVideoForm: {
        component_id: '',
        msg: '',
        text: '',
        src: ''
      },
      unitVideoFormRules: {
        text: [
          { required: true, message: '文字不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入文字', trigger: 'blur' }
        ],
        src: [
          { required: true, message: '跳转地址不能为空', trigger: 'blur' },
          { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的跳转地址' , trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('文字链编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitVideoForm) {
      //   this.$refs.unitVideoForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.text !== '' && compVo.compInfo.text !== null && compVo.compInfo.text !== undefined) {
        this.unitVideoForm.text = compVo.compInfo.text;
        this.unitVideoForm.src = compVo.compInfo.src;
      } else {
        this.unitVideoForm.text = '';
        this.unitVideoForm.src = '';
      }
      // 默认组件类别 和 组件名称
      this.unitVideoForm.component_id = compVo.component_id;
      this.unitVideoForm.msg = compVo.name;
      this.showCompIndex = index;
    },
    sendData() {
      this.$refs.unitVideoForm.validate((valid) => {
        if (valid) {
          this.$emit('cxtChangeInfo', {
            content: JSON.stringify(this.unitVideoForm),
            type: 'text-link',
            compIndex: this.showCompIndex
          });
        }
      });
    }
  },
  watch: {
    'unitVideoForm.text': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    },
    'unitVideoForm.src': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    }
  }
};
</script>

<style lang="less" scoped>

</style>
