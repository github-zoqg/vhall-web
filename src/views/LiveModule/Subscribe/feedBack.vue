<template>
  <VhallDialog
    title="反馈"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    center
    @closed='closeHandler'
    width="30%">
    <div class="content">
      <el-radio-group v-model="type" @change="radioChange">
        <el-radio :label="1">观看问题</el-radio>
        <el-radio :label="2">内容举报</el-radio>
      </el-radio-group>
      <div class="item">
        <span class="label">问题信息</span>
        <el-select v-model="selectValue" placeholder="请选择">
          <el-option
            v-for="item in renderOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="label">描述</span>
        <el-input type="textarea" v-model="desc" placeholder="如遇其他问题，请具体描述~~"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleInfo" round size="medium">确 定</el-button>
    </span>
  </VhallDialog>
</template>

<script>
export default {
  data(){
    return {
      dialogVisible: false,
      type: 1,
      questionOptions: [
        {label: '卡顿', value: 1},
        {label: '黑屏', value: 2},
        {label: '声音不同步', value: 3}
      ],
      renderVideoOption: [
        {label: '卡顿', value: 1},
        {label: '黑屏', value: 2},
        {label: '声音不同步', value: 3},
        {label: '其他', value: 4},
        {label: '助手崩溃', value: 10},
        {label: '插入视频问题', value: 11},
        {label: '摄像设置问题', value: 12},
        {label: '音频问题', value: 13},
        {label: '软件共享源失败', value: 14},
      ],
      feedBackOptions: [
        {label: '传播色情、暴力、反动等违法不良信息', value: 1},
        {label: '欺诈', value: 2},
        {label: '传销', value: 3},
        {label: '邪教', value: 4},
        {label: '其他', value: 5}
      ],
      selectValue: 1,
      desc: ''
    };
  },
  computed: {
    renderOption(){
      if(this.type == 1){
        return this.renderVideoOption;
      }else{
        return this.feedBackOptions;
      }
    }
  },
  methods: {
    radioChange(){
      this.selectValue = 1;
    },
    closeHandler(){
      this.type = 1;
      this.selectValue = 1;
      this.desc = '';
    },
    handleInfo () {
      let params = {
        webinar_id: this.$route.params.id,
        type: this.selectValue,
        content: this.desc,
      },
      url = ''
      if (this.type == 1) {
        params.source = 1 // TODO  2app 3小助手
        url = 'videoTipOff'
      } else {
        url = 'tipOff'
      }
      this.$fetch(url, {
        ...params
      }).then(res => {
        if (res.code == 200) {
          this.$message.success('问题反馈成功!')
          this.closeHandler()
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .content{
    .el-radio-group{
      display: block;
      text-align: center;
    }
    .item{
      margin: 30px 0;
      .label{
        margin-right: 16px;
        display: inline-block;
        width: 60px;
        text-align: right;
        vertical-align: top;
        line-height: 40px;
      }
      .el-select, .el-textarea{
        width: 300px;
      }
    }
  }
</style>
