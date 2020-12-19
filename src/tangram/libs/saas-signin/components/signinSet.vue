<template>
  <el-form class="form-wrap" :model="form" inline>
    <el-form-item label="签到提示">
      <el-input
        class="form-input"
        maxlength="15"
        show-word-limit
        v-model="form.signTip"
        @focus="tipFocus"
        @blur="tipBlur"
      ></el-input>
    </el-form-item>
    <el-form-item label="结束时长">
      <el-select class="form-input" v-model="form.duration" popper-class='sign-select'>
        <el-option
          v-for="(opt, idx) in durationOps"
          :key="idx"
          :label="opt.label"
          :value="opt.value"
          class="select-option"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="自动签到">
      <el-switch @change="autoSignChange" v-model="form.autoSign" active-color="#FC5659"></el-switch>
      <el-tooltip placement="right">
        <div class="tip-content" slot="content">
          <div>1.默认关闭；</div>
          <div>2.开启自动签到后，观众将在设置的时间收到签到提示；</div>
          <div>3.活动结束或回放时，观看者收不到签到提示。</div>
        </div>
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="间隔时长" v-show="form.autoSign">
      <el-select class="form-input" v-model="form.interval" popper-class='sign-select'>
        <el-option
          v-for="(opt, idx) in intervalOps"
          :key="idx"
          :label="opt.label"
          :value="opt.value"
          class="select-option"
        ></el-option>
      </el-select>
      <el-tooltip placement="right">
        <div class="tip-content" slot="content">
          <div>签到间隔时长：开启自动签到后，设置好每次签到的间隔时间，观众将在指定时间收到签到提示</div>
        </div>
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-form-item>
    <el-button
      type="danger"
      class="start-btn-core start-btn"
      @click="$emit('start', form)"
      >开始签到</el-button
    >
  </el-form>
</template>

<script>
export default {
  name: 'SigninSet',
  data() {
    const tipText = '主持人发起了签到';
    return {
      defaultText: tipText,
      form: {
        signTip: tipText, //签到提示语
        duration: 30, // 签到显示的时间，单位秒，
        autoSign: false, // 是否自动发起签到，1自动，0取消自动
        interval: 300 // 自动发起签到的轮询定时时间，单位秒
      },
      durationOps: [
        {
          value: 30,
          label: '30秒'
        },
        {
          value: 60,
          label: '60秒'
        },
        {
          value: 120,
          label: '2分钟'
        },
        {
          value: 180,
          label: '3分钟'
        }
      ],
      intervalOps: [
        {
          value: 300,
          label: '5分钟'
        },
        {
          value: 900,
          label: '15分钟'
        },
        {
          value: 1800,
          label: '30分钟'
        }
      ]
    };
  },
  methods: {
    autoSignChange(value){
      console.warn('test----自动签到  改变值', value)
      // window.sessionStorage.setItem('isAutoSign', value)
    },
    tipFocus(e) {
      if (e.target.value === this.defaultText) {
        this.form.signTip = '';
      }
    },
    tipBlur(e) {
      if (e.target.value === '') {
        this.form.signTip = this.defaultText;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.form-wrap {
  margin: 0 auto;
  /deep/ .el-form-item {
    margin-right: 0;
  }
  > * {
    display: block;
  }
}
.form-input {
  width: 264px;
}
.start-btn {
  text-align: center;
  margin: 0 auto;
  width: 160px;
  background: #FC5659;
  color: #fff;
}
.tip-content {
  line-height: 18px;
  font-size: 12px;
  width: 238px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 18px;
}
.select-option {
  line-height: 40px !important;
  &:hover {
    background-color: #fff2f0;
  }
  &.hover {
    font-weight: normal;
    background: none;
  }
  &:hover {
    color: #fc5659;
  }
  &.selected {
    background-color: #fff2f0;
    font-weight: normal;
    color: #606266;
  }
}
.el-icon-question{
  vertical-align: middle;
  margin-left: 6px;
}
</style>
