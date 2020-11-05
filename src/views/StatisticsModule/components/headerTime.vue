<template>
  <div class="header-time">
    <div class="title-data">
      <span>{{ $route.name }}</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <div class="change-time">
      <div style="display: flex">
        <div class="time-kuai">
          <span
            v-for="(item, index) in allTime"
            :key="index"
            :class="item.active === isActive ? 'active' : ''"
            @click="changeTime(item)"
            >{{ item.title }}</span
          >
        </div>
        <el-date-picker
          v-model="time"
          type="date"
          style="width: 200px"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-select v-model="timeValue" placeholder="请选择" style="width: 140px" v-if="$route.name==='数据总览'">
        <el-option
          v-for="item in timeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input v-model="searchTopic" placeholder="请输入标题" style="width: 180px" v-else></el-input>
      </div>
      <div class="export-data">
        <span>导出数据</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timeValue: '1',
      searchTopic: "",
      isActive: 1,
      timeData: [
        {
          label: '主账号',
          value: '1',
        },
        {
          label: '主账号+子账号',
          value: '2',
        },
      ],
      showValue: '1',
      showData: [
        {
          label: '全部',
          value: '1',
        },
        {
          label: '第1场',
          value: '2',
        },
        {
          label: '第2场',
          value: '3',
        },
        {
          label: '第3场',
          value: '4',
        },
        {
          label: '第4场',
          value: '5',
        },
      ],
      time: '',
      allTime: [
        {
          title: '全部',
          active: 1,
        },
        {
          title: '近7日',
          active: 2,
        },
        {
          title: '近30日',
          active: 3,
        },
      ],
    };
  },
  created() {
    console.log(this.$route.name);
  },
  methods: {
    changeTime(item) {
      this.isActive = parseInt(item.active);
    },
  },
};
</script>
<style lang="less" scoped>
  .header-time{
    /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle{
      padding:3px;
    }
    .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      line-height: 30px;
      span{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
      }
      .button-tip {
        vertical-align: top;
      }
    }
    .change-time {
      display: flex;
      position: relative;
      padding: 34px 0 24px 0;
      background: #fff;
      /deep/ .el-input__inner{
        border-radius: 18px;
        height: 35px;
      }
      /deep/.el-input__icon{
        line-height: 37px;
      }
      /deep/.el-input{
        margin-left: 24px;
      }
    }
    .time-kuai {
      height: 35px;
      border: 1px solid #dcdfe6;
      border-radius: 18px;
      background: #fff;
      // margin-right: 24px;
      span {
        display: inline-block;
        border-radius: 18px;
        padding: 10px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
      }
      .active {
        background: #fb3a32;
        color: #fff;
      }
    }
    .export-data {
      position: absolute;
      right: 0;
      top: 32px;
      width: 104px;
      height: 35px;
      border-radius: 20px;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 35px;
      background: #fff;
      cursor: pointer;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
      }
    }
    .export-data:hover {
      background: #fb3a32;
      border: none;
      span {
        color: #fff;
      }
    }
  }
</style>
